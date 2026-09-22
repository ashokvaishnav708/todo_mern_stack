import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to server");
});

const PORT = process.env.PORT || 5000;
const MONGO_USER = process.env.MONGO_ROOT_USERNAME;
const MONGO_PASS = process.env.MONGO_ROOT_PASSWORD;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

const MONGO_URI = `mongodb://localhost:${MONGO_PORT}/${MONGO_DB_NAME}`;

mongoose
  .connect(MONGO_URI || "", {
    auth: {
      username: MONGO_USER,
      password: MONGO_PASS,
    },
    authSource: "admin",
  })
  .then(() => console.log(`Connected to ${MONGO_URI}`))
  .catch((err) => {
    console.error(`Error connecting ${MONGO_URI}: `, err);
  });

app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
  } else {
    console.log(`Server started on localhost at port ${PORT}`);
  }
});
