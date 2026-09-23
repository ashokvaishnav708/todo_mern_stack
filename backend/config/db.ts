import mongoose from "mongoose";

const MONGO_USER = process.env.MONGO_ROOT_USERNAME;
const MONGO_PASS = process.env.MONGO_ROOT_PASSWORD;

const MONGO_URI = process.env.MONGO_URI || "";

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
