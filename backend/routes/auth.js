import { Router } from "express";
import User from "../models/User.js";
import { hashPassword, comparePasswords } from "../utils/password.js";
import { checkSchema, validationResult, matchedData } from "express-validator";
import {
  registerSchema,
  loginSchema,
} from "../validators/validationAuthSchemas.js";
import passport from "passport";

const router = Router();

router.post("/register", checkSchema(registerSchema), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const validatedData = matchedData(req);
    const { email, password, displayName } = validatedData;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ email, password: hashedPassword, displayName });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", checkSchema(loginSchema), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: info?.message || "Invalid email or password" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ message: "Internal server error" });
      }

      return res.status(200).json({
        message: "Logged in successfully",
        user: { email: user.email, displayName: user.displayName },
      });
    });
  })(req, res, next);
});

router.get("/status", (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "Not Authenticated" });
  }
  res.status(200).json({
    isAuthenticated: true,
    user: { email: req.user.email, displayName: req.user.displayName },
  });
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.log(sessionErr);
        return res.status(500).json({ message: "Internal server error" });
      }

      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

export default router;
