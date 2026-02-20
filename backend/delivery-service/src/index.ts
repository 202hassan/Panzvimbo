import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { env } from "./config/env";
import deliveryRoutes from "./routes/deliveryRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "delivery-service" });
});

app.use("/deliveries", deliveryRoutes);

async function start() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("Delivery service connected to MongoDB");

    app.listen(env.port, () => {
      console.log(
        `Delivery service listening on http://localhost:${env.port}`
      );
    });
  } catch (err) {
    console.error("Failed to start delivery service", err);
    process.exit(1);
  }
}

start();

