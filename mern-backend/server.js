import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import problemRoutes from "./routes/problems.js";
import submissionRoutes from "./routes/submissions.js";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/users.js";
import contestRoutes from "./routes/contest.js"; // ✅ renamed for clarity

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/problems", problemRoutes);
app.use("/submissions", submissionRoutes);
app.use("/", dashboardRoutes);
app.use("/users", userRoutes);
app.use("/api/contest", contestRoutes); // ✅ now matches import name

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/multisolver", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected ✅"))
.catch((err) => console.log("MongoDB error:", err));

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
