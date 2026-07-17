import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Goal title required"],
    trim: true,
  },
  type: {
    type: String,
    enum: ["numeric", "time"],
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  current: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    },
  },
});

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
