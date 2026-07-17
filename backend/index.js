import express from "express";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import taskRouter from "./routes/tasks.js";
import goalRouter from "./routes/goals.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import './config/passport.js';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/focus-flow-app";
const SESSION_SECRET = process.env.SESSION_SECRET;



app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URL || "mongodb://localhost:27017/focus-flow-app", collectionName: 'sessions'}),
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true } // 1 day\
    
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
  
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/goals", goalRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
