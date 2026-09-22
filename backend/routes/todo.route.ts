import express, { Response, Request, response } from "express";
import Todo from "../models/todo.model";
import { Error } from "mongoose";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const todo = new Todo({
    text: req.body.text,
  });
  try {
    const newTodo = await todo.save();
    response.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    if (req.body.text !== undefined) {
      todo.text = req.body.text;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
