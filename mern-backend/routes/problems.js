import express from "express";
import Problem from "../models/Problem.js";

const router = express.Router();

// GET all problems
router.get("/", async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
});

// GET one problem
router.get("/:id", async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  res.json(problem);
});

// POST new problem (dynamic add)
router.post("/", async (req, res) => {
  try {
    const newProblem = new Problem(req.body);
    await newProblem.save();
    res.json(newProblem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a problem
router.delete("/:id", async (req, res) => {
  try {
    const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
    if (!deletedProblem) return res.status(404).json({ error: "Problem not found" });
    res.json({ message: "Problem deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
