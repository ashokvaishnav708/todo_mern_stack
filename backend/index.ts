import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const mongodb = process.env.MONGODB_STR;

app.get("/", (req, res) => {
  res.send("Welcome to server");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(mongodb || "")
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => {
    console.error("Error connecting mongodb: ", err);
  });
