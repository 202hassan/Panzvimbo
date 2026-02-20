import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { env } from "./config/env";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "auth-service" });
});

app.use("/auth", authRoutes);

async function start() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("Auth service connected to MongoDB");

    app.listen(env.port, () => {
      console.log(`Auth service listening on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error("Failed to start auth service", err);
    process.exit(1);
  }
}

start();

