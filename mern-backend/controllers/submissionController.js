import Submission from "../models/Submission.js";

export const submitSolution = async (req, res) => {
  try {
    const { userId, problemId, code } = req.body;
    const submission = new Submission({ user: userId, problem: problemId, code, status: "Pending" });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getSubmissions = async (req, res) => {
  const submissions = await Submission.find().populate("user").populate("problem");
  res.json(submissions);
};
