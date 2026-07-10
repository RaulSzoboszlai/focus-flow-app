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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
