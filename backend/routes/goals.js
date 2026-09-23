import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createGoalSchema } from "../validators/validationGoalSchemas.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import Goal from "../models/Goal.js";
import User from "../models/User.js";
import Task from "../models/Task.js";

const router = Router();

router.use(isAuthenticated);

router.get("/today", async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let goals = await Goal.find({
      userId,
      date: today,
    });

    const user = await User.findById(userId);

    if (goals.length > 0) {
      return res.status(200).json({
        goals,
        streak: user.currentStreak || 0,
      });
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = user.currentStreak || 0;

    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);

      if (lastActive.getTime() === yesterday.getTime()) {
        const yesterdayStart = new Date(0, 0, 0, 0);
        const yesterdayEnd = new Date(23, 59, 59, 999);
        const yesterdayTasks = await Task.find({
          userId,
          completed: true,
          createdAt: {
            $gte: yesterdayStart,
            $lte: yesterdayEnd,
          },
        });

        const completedTasks = yesterdayTasks.length > 0;

        if (completedTasks) {
          newStreak += 1;
        } else {
          newStreak = 0;
        }
      } else if (lastActive.getTime() < yesterday.getTime()) {
        newStreak = 0;
      }
    } else {
      newStreak = 0;
    }

    user.currentStreak = newStreak;
    user.lastActiveDate = today;
    await user.save();

    const defaultGoals = [
      {
        userId,
        title: "Complete 3 tasks",
        type: "numeric",
        target: 3,
        current: 0,
      },
      {
        userId,
        title: "Focus for 2+ hours",
        type: "time",
        target: 120,
        current: 0,
      },
    ];

    goals = await Goal.insertMany(defaultGoals);

    res.status(200).json({
      goals,
      streak: user.currentStreak,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", checkSchema(createGoalSchema), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const validatedData = matchedData(req);
    const { title, type, target, unit } = validatedData;

    const newGoal = new Goal({
      userId: req.user.id,
      title,
      type,
      target,
      unit: unit || null,
    });

    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/focus", async (req, res) => {
  try {
    const userId = req.user.id;
    const { minutes } = req.body;

    if (!minutes || typeof minutes !== "number") {
      return res.status(400).json({ message: "Invalid minutes provided" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedGoal = await Goal.findOneAndUpdate(
      {
        userId,
        date: today,
        type: "time",
      },
      { $inc: { current: minutes } },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: "Focus goal not found for today" });
    }

    res.status(200).json(updatedGoal);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.user.id;

    const goal = await Goal.findOneAndDelete({ _id: goalId, userId });
    if (!goal) {
      return res.status(404).json({ message: "Goal was not found" });
    }

    res.status(200).json({ message: "Goal successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
