import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problems: [{ type: String }], // later can store ObjectId references
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;  // ✅ important for ESM
