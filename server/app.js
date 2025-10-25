// ✅ Core modules
import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

// ✅ Local utilities
import connectDB from "./config/mongodb.js"; // your existing DB connection
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// ✅ Routes
import authRouter from "./routes/authRoutes.js"; // your existing auth
import userRouter from "./routes/userRoutes.js"; // your user management
import oneToOneRoutes from "./routes/oneToOne.js"; // chat one-to-one
import groupRoutes from "./routes/group.js"; // chat group

// ✅ Socket and background services
import socketHandlers from "./sockets/index.js";
import { startCleanupService } from "./services/cleanupService.js";

// ✅ Setup dirname + environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ✅ Initialize app & server
const app = express();
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new IOServer(server, {
  cors: {
    origin: [
      "http://localhost:5173", // your frontend
      "http://localhost:5174",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

// ✅ Global middleware
app.use(helmet());
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,
});
app.use(limiter);

// ✅ Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ✅ API Routes
app.get("/", (req, res) => res.send("🔥 Unified Auth + Chat API is running..."));

// 🔐 Auth & User
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// 💬 Chat
app.use("/api", oneToOneRoutes);
app.use("/api", groupRoutes);

// 🧩 Error handling
app.use(notFound);
app.use(errorHandler);

// ⚡ Socket.IO Handlers
socketHandlers(io);

// 🧹 Background cleanup (for disappearing messages)
startCleanupService();

export default app;