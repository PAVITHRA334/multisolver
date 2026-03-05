import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();
const JWT_SECRET = "supersecretjwtkey";

// Protect middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// User Dashboard
router.get("/user/dashboard", protect, (req, res) => {
  if (req.user.role !== "user") return res.status(403).json({ message: "Forbidden" });
  res.json({ message: `Welcome User ${req.user.id}!` });
});

// Admin Dashboard
router.get("/admin/dashboard", protect, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  res.json({ message: `Welcome Admin ${req.user.id}!` });
});

export default router;
