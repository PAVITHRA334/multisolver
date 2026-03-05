import express from "express";
import Contest from "../models/Contest.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ Create contest (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const { title, startTime, endTime, problems } = req.body;

    const contest = new Contest({
      title,
      startTime,
      endTime,
      problems,
    });

    await contest.save();
    res.json({ success: true, contestId: contest._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Add problem to contest (admin only)
router.post("/:id/add-problem", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const { problemId } = req.body;
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    contest.problems.push(problemId);
    await contest.save();
    res.json({ success: true, problems: contest.problems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all contests (public)
router.get("/", async (req, res) => {
  try {
    const contests = await Contest.find({}, "_id title startTime endTime problems");
    res.json(contests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get contest by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ error: "Contest not found" });

    const now = new Date();
    let status;
    if (now < contest.startTime) status = "not_started";
    else if (now > contest.endTime) status = "ended";
    else status = "running";

    res.json({ status, contest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Solve contest (requires login)
router.post("/:id/solve", authMiddleware, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const user = await User.findById(req.user._id);
    if (!user.solvedContests) user.solvedContests = [];

    if (!user.solvedContests.includes(contest._id)) {
      user.solvedContests.push(contest._id);
      await user.save();
    }

    res.json({ success: true, message: "Contest solved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
