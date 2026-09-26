import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    minLength: [8, "Password must be at least 8 characters long"],
  },
  displayName: {
    type: String,
    required: [true, "Display name is required"],
    trim: true,
    minLength: [3, "Display name must be at least 3 characters long"],
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  lastActiveDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  settings: {
    focusTimers: {
      type: [Number],
      default: [15, 30, 45, 60],
      validate: {
        validator: function(array) {
          return array.length === 4;
        },
        message: "They are required exactly 4 time options."
      }
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
