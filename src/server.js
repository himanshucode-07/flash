import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/database.js";
import noteRoutes from "./routes/note.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use("/api", noteRoutes);
app.use("/api", userRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route nahi mila" });
});

app.listen(process.env.PORT, () =>
  console.log(`Notes API chal raha hai port ${process.env.PORT} pe`)
);