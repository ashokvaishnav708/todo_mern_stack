import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db";

import todoRoutes from "./routes/todo.route";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to server");
});

app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server started on localhost at port ${PORT}`);
});
