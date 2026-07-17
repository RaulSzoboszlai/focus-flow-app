import { Router } from "express";
import {
  check,
  checkSchema,
  matchedData,
  validationResult,
} from "express-validator";
import { createGoalSchema } from "../validators/validationGoalSchemas.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import Goal from "../models/Goal.js";
import User from "../models/User.js";

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

    if (goasls.length > 0) {
      res.status(200).json(goals);
    }

    const user = User.findById(userId);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = user.currentStreak;

    if (user.lastActiveDay) {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);

      if (lastActive.getTime() === yesterday.getTime()) {
        const yesterdayGoals = await Goal.find({ userId, date: yesterday });

        const completedGoals = yesterdayGoals > 0;

        if (completedGoals) {
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

    res.status(200).json(goals);
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
