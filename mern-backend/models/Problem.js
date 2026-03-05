// models/Problem.js
import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ["Easy", "Medium", "Hard"], 
    default: "Easy" 
  },
  examples: [
    { input: { type: String, required: true }, output: { type: String, required: true } }
  ],
  testCases: [
    { input: { type: String, required: true }, output: { type: String, required: true } }
  ],
  timeLimit: { type: Number, default: 2000 },   // ms
  memoryLimit: { type: Number, default: 256 },  // MB
  approaches: {
    brute: { type: Boolean, default: true },
    better: { type: Boolean, default: true },
    optimal: { type: Boolean, default: true },
  }
});

export default mongoose.model("Problem", problemSchema);
