import mongoose from "mongoose";
import { Todo } from "../models/todos";

export const readTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.status;
  } catch {}
};
