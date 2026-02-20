import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 4000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:4001";
const DELIVERY_SERVICE_URL =
  process.env.DELIVERY_SERVICE_URL || "http://localhost:4002";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

// Simple auth proxy
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "/auth" },
  })
);

// Simple delivery proxy
app.use(
  "/api/deliveries",
  createProxyMiddleware({
    target: DELIVERY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/deliveries": "/deliveries" },
  })
);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-delivery-room", (deliveryId: string) => {
    socket.join(`delivery:${deliveryId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`API Gateway listening on http://localhost:${PORT}`);
});

