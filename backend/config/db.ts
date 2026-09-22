import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_USER = process.env.MONGO_ROOT_USERNAME;
const MONGO_PASS = process.env.MONGO_ROOT_PASSWORD;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

const MONGO_URI = `mongodb://localhost:${MONGO_PORT}/${MONGO_DB_NAME}`;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      auth: { username: MONGO_USER, password: MONGO_PASS },
      authSource: "admin",
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting database: ", error);
    process.exit();
  }
};
