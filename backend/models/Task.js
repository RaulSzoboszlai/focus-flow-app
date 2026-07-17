import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
  },
  category: {
    type: String,
    default: "Personal",
    trim: true,
  },
  time: {
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  linkedGoalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goal",
    default: null,
  },
  goalContribution: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
