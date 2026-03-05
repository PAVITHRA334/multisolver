import express from "express";
import fs from "fs";
import { spawn } from "child_process";
import pidusage from "pidusage";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();


router.post("/submit", authMiddleware, async (req, res) => {
  const { problemId, source_code, language, stdin, approach } = req.body;

  if (!source_code || typeof source_code !== "string") {
    return res.status(400).json({ error: "source_code is required and must be a string" });
  }

  const problem = await Problem.findById(problemId);
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  const TIME_LIMIT = problem.timeLimit || 2000;
  const MEMORY_LIMIT = problem.memoryLimit || 256;

  let child;
  const tempFiles = [];
  let output = "";
  let error = "";

  try {
    // ----------- Language Setup -----------
    if (language === "cpp") {
      fs.writeFileSync("main.cpp", source_code);
      tempFiles.push("main.cpp");

      let compileError = "";
      const compile = spawn("g++", ["main.cpp", "-o", process.platform === "win32" ? "main.exe" : "main"]);
      compile.stderr.on("data", (data) => (compileError += data.toString()));

      await new Promise((resolve, reject) => {
        compile.on("close", (code) => {
          if (code !== 0) return reject(new Error(compileError || "Compilation Error"));
          resolve();
        });
      });

      tempFiles.push(process.platform === "win32" ? "main.exe" : "main");
      child = spawn(process.platform === "win32" ? "main.exe" : "./main");

    } else if (language === "java") {
      fs.writeFileSync("Main.java", source_code);
      tempFiles.push("Main.java");

      let compileError = "";
      const compile = spawn("javac", ["Main.java"]);
      compile.stderr.on("data", (data) => (compileError += data.toString()));

      await new Promise((resolve, reject) => {
        compile.on("close", (code) => {
          if (code !== 0) return reject(new Error(compileError || "Compilation Error"));
          resolve();
        });
      });

      tempFiles.push("Main.class");
      child = spawn("java", ["Main"]);

    } else if (language === "python") {
      fs.writeFileSync("main.py", source_code);
      tempFiles.push("main.py");
      child = spawn("python", ["main.py"]);

    } else {
      return res.status(400).json({ error: "Unsupported language" });
    }

    // ----------- Run Program -----------
    if (stdin) child.stdin.write(stdin);
    child.stdin.end();

    child.stdout.on("data", (data) => (output += data.toString()));
    child.stderr.on("data", (data) => (error += data.toString()));

    await new Promise((resolve) => {
      let finished = false;

      const timer = setTimeout(() => {
        if (!finished) {
          finished = true;
          child.kill();
          error = "Time Limit Exceeded";
          resolve();
        }
      }, TIME_LIMIT);

      const memoryChecker = setInterval(async () => {
        if (finished) return;
        try {
          const stats = await pidusage(child.pid);
          const memoryMB = stats.memory / 1024 / 1024;
          if (memoryMB > MEMORY_LIMIT) {
            finished = true;
            clearTimeout(timer);
            clearInterval(memoryChecker);
            child.kill();
            error = "Memory Limit Exceeded";
            resolve();
          }
        } catch {}
      }, 50);

      child.on("close", () => {
        if (!finished) {
          finished = true;
          clearTimeout(timer);
          clearInterval(memoryChecker);
          resolve();
        }
      });
    });

    // ----------- Save to MongoDB -----------
    const submission = new Submission({
      userId: req.user.id,
      problemId,
      problemTitle: problem.title,
      language,
      approach,
      sourceCode: source_code,
      output: error && error.includes("Compilation") ? "" : output.trim(),
      error: error || null,
      status: error ? (error.includes("Compilation") ? "Compilation Error" : error) : "Accepted",
    });

    await submission.save();

    res.json({
      output: submission.output,
      error: submission.error,
      submissionId: submission._id,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
  }
});

export default router;
