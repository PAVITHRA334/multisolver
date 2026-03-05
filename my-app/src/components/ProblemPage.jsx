import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";

// Default code templates
const defaultCode = {
  54: `#include <iostream>
using namespace std;
int main() {
    int a,b;
    cin >> a >> b;
    cout << a+b;
    return 0;
}`,
  62: `import java.util.Scanner;
class Main{
  public static void main(String[] args){
    Scanner sc = new Scanner(System.in);
    int a=sc.nextInt();
    int b=sc.nextInt();
    System.out.println(a+b);
    sc.close();
  }
}`,
  71: `a,b = map(int,input().split())
print(a+b)`
};

const ProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState(54); // 54=C++,62=Java,71=Python
  const [codes, setCodes] = useState({
    brute: defaultCode[54],
    better: defaultCode[54],
    optimal: defaultCode[54],
  });
  const [solutionType, setSolutionType] = useState("brute"); // brute/better/optimal
  const [testCases, setTestCases] = useState([{ input: "", output: "", status: null, error: null }]);
  const [activeCase, setActiveCase] = useState(0);
  const [message, setMessage] = useState("");
  const [approachStatus, setApproachStatus] = useState({ brute: null, better: null, optimal: null });

  const token = localStorage.getItem("token");

  // Fetch problem details
  useEffect(() => {
    axios.get(`http://localhost:5000/problems/${id}`)
      .then(res => {
        const examples = res.data.examples || [];
        setProblem({ ...res.data, examples });
        if (examples.length > 0) {
          setTestCases(
            examples.map(ex => ({ input: ex.input, output: ex.output, status: null, error: null }))
          );
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  // Run all test cases for current approach
  // Run all test cases for current approach
const handleRunAll = async () => {
  if (!problem || !token) return;
  setMessage("");

  const langName = language === 54 ? "cpp" : language === 62 ? "java" : "python";
  const codeToSubmit = codes[solutionType] || "";

  const updatedCases = testCases.map(tc => ({ ...tc, status: "pending", error: null }));
  setTestCases(updatedCases);

  let allPass = true;

  for (let i = 0; i < updatedCases.length; i++) {
    try {
      const res = await axios.post(
        "http://localhost:5000/submissions/submit",
        {
          problemId: id,
          source_code: codeToSubmit,
          problemTitle: problem.title, // send as backend expects
          language: langName,
          stdin: updatedCases[i].input,
          approach: solutionType
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const output = res.data.output || "";
      const error = res.data.error || null;

      updatedCases[i].output = output;
      updatedCases[i].error = error;
      updatedCases[i].status = !error ? "pass" : "fail";

      if (error) allPass = false;

      setTestCases([...updatedCases]);
    } catch (err) {
      updatedCases[i].status = "fail";
      updatedCases[i].output = "—";
      updatedCases[i].error = err.response?.data?.error || err.message;
      allPass = false;
      setTestCases([...updatedCases]);
    }
  }

  setApproachStatus(prev => {
    const newStatus = { ...prev, [solutionType]: allPass ? "pass" : "fail" };
    if (Object.values(newStatus).every(s => s === "pass")) markProblemComplete();
    return newStatus;
  });
};

// Submit single approach
const handleSubmit = async () => {
  if (!problem || !token) return;

  const langName = language === 54 ? "cpp" : language === 62 ? "java" : "python";
  const codeToSubmit = codes[solutionType] || "";

  try {
    const res = await axios.post(
      "http://localhost:5000/submissions/submit",
      {
        problemId: id,
        source_code: codeToSubmit,
          problemTitle: problem.title, // send as backend expects
        language: langName,
        stdin: "", // optional
        approach: solutionType
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const output = res.data.output || "";
    const error = res.data.error || null;

    setApproachStatus(prev => {
      const newStatus = { ...prev, [solutionType]: !error ? "pass" : "fail" };
      if (Object.values(newStatus).every(s => s === "pass")) markProblemComplete();
      return newStatus;
    });

    setMessage(`✅ ${solutionType} submission ${!error ? "accepted" : "failed"}! (ID: ${res.data.submissionId})`);

  } catch (err) {
    console.error(err);
    setMessage(`❌ Error submitting problem: ${err.response?.data?.error || err.message}`);
  }
};


  // Mark problem complete
  const markProblemComplete = async () => {
    try {
      await axios.post(`http://localhost:5000/users/complete-problem`, { problemId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Problem Completed! All approaches passed.");
    } catch (err) {
      console.error(err);
    }
  };

  if (!problem) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;

  return (
    <div style={{ ...styles.page, position: "relative" }}>
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Go Back</button>

      {/* Problem Panel */}
      <div style={styles.problemPanel}>
        <h1 style={styles.title}>
          {problem.title}{" "}
          <span style={{ ...styles.badge, backgroundColor: difficultyColor(problem.difficulty) }}>
            {problem.difficulty}
          </span>
        </h1>
        <div style={styles.description}>{problem.description}</div>
        <h3>Examples:</h3>
        {problem.examples.map((ex, i) => (
          <div key={i} style={styles.example}>
            <b>Input:</b> <pre>{ex.input}</pre>
            <b>Output:</b> <pre>{ex.output}</pre>
          </div>
        ))}
      </div>

      {/* Editor Panel */}
      <div style={styles.editorPanel}>
        {!token ? (
          <div style={styles.lockedBox}>
            <h2>🔒 Editor Locked</h2>
            <p>You must be logged in to solve this problem.</p>
            <Link to="/login">
              <button style={styles.loginBtn}>Login to Continue</button>
            </Link>
          </div>
        ) : (
          <>
            {/* Language & Solution Type selector */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <select
                value={language}
                onChange={e => {
                  const lang = Number(e.target.value);
                  setLanguage(lang);
                  setCodes({
                    brute: defaultCode[lang],
                    better: defaultCode[lang],
                    optimal: defaultCode[lang]
                  });
                }}
                style={styles.select}
              >
                <option value={54}>C++</option>
                <option value={62}>Java</option>
                <option value={71}>Python</option>
              </select>

              <select
                value={solutionType}
                onChange={e => setSolutionType(e.target.value)}
                style={styles.select}
              >
                <option value="brute">Brute Force</option>
                <option value="better">Better</option>
                <option value="optimal">Optimal</option>
              </select>

              <button style={styles.runButton} onClick={handleRunAll}>Run All Test Cases</button>
    
<button
  style={{ ...styles.runButton, backgroundColor: "#16a34a", marginLeft: "10px" }}
  onClick={handleSubmit}
>
  Submit
</button>
</div>

            {/* Code Editor */}
            <Editor
              height="400px"
              language={language === 54 ? "cpp" : language === 62 ? "java" : "python"}
              value={codes[solutionType]}
              onChange={(val) => setCodes({ ...codes, [solutionType]: val })}
              theme="vs-dark"
            />

            {/* Test Case Tabs */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {testCases.map((tc, idx) => (
                <button
                  key={idx}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    backgroundColor: tc.status === "pass" ? "#22c55e" : tc.status === "fail" ? "#ef4444" : idx === activeCase ? "#3b82f6" : "#e5e7eb",
                    color: tc.status || idx === activeCase ? "#fff" : "#111",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveCase(idx)}
                >
                  Case {idx + 1}
                </button>
              ))}
              <button
                onClick={() => {
                  setTestCases([...testCases, { input: "", output: "", status: null, error: null }]);
                  setActiveCase(testCases.length);
                }}
                style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }}
              >
                +
              </button>
            </div>

            {/* Test Case Input */}
            <textarea
              rows={4}
              value={testCases[activeCase].input}
              onChange={e => {
                const newCases = [...testCases];
                newCases[activeCase].input = e.target.value;
                newCases[activeCase].status = null;
                setTestCases(newCases);
              }}
              style={{ ...styles.textarea, marginTop: "8px" }}
              placeholder="Enter input for this test case"
            />

            {/* Result */}
            {testCases[activeCase]?.status && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "8px",
                  borderRadius: "6px",
                  backgroundColor: testCases[activeCase].status === "pass" ? "#e6ffe6" : "#ffe6e6",
                  border: "1px solid #ccc",
                  fontFamily: "monospace",
                }}
              >
                <b>Output:</b> {testCases[activeCase]?.output || "—"} <br />
                <b>Error:</b> {testCases[activeCase]?.error || "—"}
              </div>
            )}

            {/* Submission Message */}
            {message && (
              <div style={{ marginTop: "12px", padding: "10px", borderRadius: "6px", backgroundColor: "#f3f4f6", fontWeight: "bold" }}>
                {message}
              </div>
            )}
          </>
        )}
      </div>

      {/* Back Button CSS */}
      <style>{`
        .back-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          padding: 10px 20px;
          border-radius: 8px;
          background: #6b7280;
          color: white;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          z-index: 10;
        }
        .back-btn:hover { background: #374151; }
      `}</style>
    </div>
  );
};

// Helpers
const difficultyColor = diff => {
  switch(diff.toLowerCase()) {
    case "easy": return "#28a745";
    case "medium": return "#ffc107";
    case "hard": return "#dc3545";
    default: return "#6c757d";
  }
};

const styles = {
  page: { display: "flex", gap: "20px", padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  problemPanel: { flex: 1, maxWidth: "45%", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "10px", overflowY: "auto", maxHeight: "90vh" },
  editorPanel: { flex: 1, maxWidth: "55%", display: "flex", flexDirection: "column", padding: "20px", backgroundColor: "#fff", borderRadius: "10px", overflowY: "auto", maxHeight: "90vh" },
  title: { fontSize: "1.8rem", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" },
  badge: { color: "white", fontWeight: "bold", padding: "3px 10px", borderRadius: "12px", fontSize: "0.85rem" },
  description: { marginBottom: "15px", lineHeight: "1.5" },
  example: { marginBottom: "10px", padding: "10px", borderRadius: "8px", background: "#e9ecef" },
  select: { padding: "8px", borderRadius: "6px", border: "1px solid #ccc" },
  runButton: { padding: "8px 16px", borderRadius: "6px", backgroundColor: "#3b82f6", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer" },
  textarea: { width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "monospace" },
  lockedBox: { textAlign: "center", marginTop: "100px" },
  loginBtn: { padding: "10px 20px", borderRadius: "6px", backgroundColor: "#10b981", color: "white", fontWeight: "bold", border: "none", cursor: "pointer", marginTop: "15px" },
};

export default ProblemPage;
