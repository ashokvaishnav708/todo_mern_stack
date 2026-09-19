import mongoose from "mongoose";

const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: String,
  },
  { timestamps: true },
);

export const Todo = mongoose.model("Todo", todoSchema);
