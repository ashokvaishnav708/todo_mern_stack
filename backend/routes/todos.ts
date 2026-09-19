import express from "express";
import { readTodos } from "../controller/todos";

const router = express.Router();

router.get("/", readTodos);
router.post("/", createTodos);

export default router;
