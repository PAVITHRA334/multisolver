import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
   problemTitle: { type: String, required: true },
  language: { type: String, required: true },
  approach: { type: String, enum: ["brute", "better", "optimal"], required: true },
  sourceCode: { type: String, required: true },
  output: { type: String },
  error: { type: String },
  status: { type: String, enum: ["Accepted", "Wrong Answer", "Compilation Error", "Runtime Error", "Time Limit Exceeded", "Memory Limit Exceeded"], required: true },
  runtime: { type: Number, default: 0 }, // in ms
  memory: { type: Number, default: 0 }, // in MB
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Submission", submissionSchema);
