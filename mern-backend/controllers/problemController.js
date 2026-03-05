import Problem from "../models/Problem.js";

export const getProblems = async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
};

export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty } = req.body;
    const problem = new Problem({ title, description, difficulty });
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
