import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import paymentRouter from "./routes/payment";
import quizRouter from "./routes/quiz";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ─── Middleware ───────────────────────────────────────────────────────────
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true, // Required for cookies to work cross-origin
  })
);
app.use(express.json());
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.send("Cortix API is Online 🚀");
});

app.use("/auth", authRouter);
app.use("/payment", paymentRouter);
app.use("/quizzes", quizRouter);

// ─── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Cortix Server running on http://localhost:${PORT}`);
});