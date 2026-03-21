import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointementRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ pong: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

export default app;
