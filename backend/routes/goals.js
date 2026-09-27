import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createGoalSchema } from "../validators/validationGoalSchemas.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import Goal from "../models/Goal.js";
import User from "../models/User.js";

const router = Router();

router.use(isAuthenticated);

router.get("/today", async (req, res) => {
  try {
    const userId = req.user.id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let goals = await Goal.find({
      userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const user = await User.findById(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);

      if (lastActive.getTime() < yesterday.getTime()) {
        user.currentStreak = 0;
        await user.save();
      }
    }

    if (goals.length > 0) {
      return res.status(200).json({
        goals,
        streak: user.currentStreak || 0,
      });
    }

    const defaultGoals = [
      {
        userId,
        title: "Complete 3 tasks",
        type: "numeric",
        target: 3,
        current: 0,
        date: startOfDay,
      },
      {
        userId,
        title: "Focus for 2+ hours",
        type: "time",
        target: 120,
        current: 0,
        date: startOfDay,
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

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const updatedGoal = await Goal.findOneAndUpdate(
      {
        userId,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        type: "time",
      },
      { $inc: { current: minutes } },
      { returnDocument: 'after' }
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
