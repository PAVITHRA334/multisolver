import { exec } from "child_process";
import fs from "fs";
import path from "path";

const languages = {
  cpp: { ext: "cpp", compile: "g++ {file} -o {outfile}", run: "./{outfile}" },
  python: { ext: "py", run: "python3 {file}" },
  js: { ext: "js", run: "node {file}" }
};

// Simulated job queue (replace with Redis/Bull in production)
const submissions = [
  {
    problemId: "p123",
    language: "cpp",
    code: `#include <iostream>
int main(){int a,b;std::cin>>a>>b;std::cout<<a+b;return 0;}`,
    input: "2 3"
  }
];

const executeSubmission = (sub) => {
  const lang = languages[sub.language];
  if (!lang) return console.log("Language not supported");

  const filename = `temp.${lang.ext}`;
  const filepath = path.join("/app", filename);
  fs.writeFileSync(filepath, sub.code);

  const runCode = () => {
    const command = lang.run.replace("{file}", filename).replace("{outfile}", "a.out");
    const proc = exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) {
        console.log("Error:", error.message);
      } else {
        console.log("Output:", stdout.trim());
      }
    });

    if (sub.input) {
      proc.stdin.write(sub.input);
      proc.stdin.end();
    }
  };

  if (lang.compile) {
    const compileCmd = lang.compile.replace("{file}", filename).replace("{outfile}", "a.out");
    exec(compileCmd, (err, stdout, stderr) => {
      if (err) return console.log("Compilation error:", stderr);
      runCode();
    });
  } else {
    runCode();
  }
};

// Execute all submissions
submissions.forEach(executeSubmission);
