import express from "express";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import './config/passport.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/focus-flow-app";
const SESSION_SECRET = process.env.SESSION_SECRET;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });



app.use(express.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URL, collectionName: 'sessions'}),
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true } // 1 day\
    
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
