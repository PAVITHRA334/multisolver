import express from "express";
import Submission from "../models/Submission.js";
import { authMiddleware } from "../middleware/auth.js"; // ✅ correct path

const router = express.Router();

router.get("/my-submissions", authMiddleware, async (req, res) => {
  const subs = await Submission.find({ userId: req.user.id }).sort({ createdAt: -1 });

  // Convert problemId to string
  const data = subs.map(s => ({
    ...s._doc,
    problemId: s.problemId.toString(),
  }));

  res.json(data);
});


import mongoose from "mongoose";

router.post("/submit", authMiddleware, async (req, res) => {
  const { problemId, problemTitle, approach, language, source_code, stdin } = req.body;

  const sub = new Submission({
    userId: req.user.id,
    problemId: mongoose.Types.ObjectId(problemId), // <-- convert to ObjectId
    problemTitle: problemTitle ,
    approach,
    language,
    sourceCode: source_code,
    status: "Accepted",
    output: stdin,
  });

  await sub.save();
  res.json(sub);
});


router.post("/complete-problem", authMiddleware, async (req, res) => {
  const { problemId } = req.body;
  res.json({ message: `Problem ${problemId} marked complete!` });
});

export default router;
