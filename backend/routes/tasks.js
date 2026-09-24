import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { createTaskSchema } from "../validators/validationTaskSchemas.js";
import Task from "../models/Task.js";
import Goal from "../models/Goal.js";

const router = Router();

router.use(isAuthenticated);

router.get("/", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId: req.user.id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/all', async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", checkSchema(createTaskSchema), async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const validatedData = matchedData(req);
    const { title, category, time, linkedGoalId, goalContribution } =
      validatedData;

    const newTask = new Task({
      userId: req.user.id,
      title,
      category: category || "Personal",
      time,
      linkedGoalId: linkedGoalId || null,
      goalContribution: goalContribution || 1,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id/toggle", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ message: "Task was not found" });
    }

    const wasCompleted = task.completed;
    task.completed = !task.completed;
    await task.save();

    const incrementValue = !wasCompleted && task.completed ? 1 : -1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Goal.findOneAndUpdate(
      {
        userId,
        date: today,
        title: "Complete 3 tasks",
      },
      { $inc: { current: incrementValue } },
    );

    if (task.linkedGoalId) {
      const specificIncrement =
        !wasCompleted && task.completed
          ? task.goalContribution
          : -task.goalContribution;

      await Goal.findOneAndUpdate(
        { _id: task.linkedGoalId, userId },
        { $inc: { current: specificIncrement } },
      );
    }

    res.status(200).json({ message: "Task successfully updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, category, time } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { title, category, time },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task was not found "});
    }

    return res.status(200).json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ message: "Task was not found" });
    }

    if (task.completed && task.linkedGoalId) {
      await Goal.findOneAndUpdate(
        { _id: task.linkedGoalId, userId },
        { $inc: { current: -task.goalContribution } },
      );
    }

    await Task.deleteOne({ _id: taskId, userId });
    res.status(200).json({ message: "Task successfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
