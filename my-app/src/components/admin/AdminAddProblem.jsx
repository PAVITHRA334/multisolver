import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminAddProblem = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [examples, setExamples] = useState([{ input: "", output: "" }]);
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const [timeLimit, setTimeLimit] = useState(2000);
  const [memoryLimit, setMemoryLimit] = useState(256);
const [approaches, setApproaches] = useState({
  brute: true,
  better: true,
  optimal: true,
});

  // Automatically adjust time/memory based on difficulty
  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    if (value === "Easy") {
      setTimeLimit(2000);
      setMemoryLimit(256);
    } else if (value === "Medium") {
      setTimeLimit(3000);
      setMemoryLimit(512);
    } else if (value === "Hard") {
      setTimeLimit(5000);
      setMemoryLimit(1024);
    }
  };

  const handleChange = (i, field, value, arr, setArr) => {
    const newArr = [...arr];
    newArr[i][field] = value;
    setArr(newArr);
  };

  const addRow = (arr, setArr) => setArr([...arr, { input: "", output: "" }]);

  const handleSubmit = async () => {
    const data = { title, description, difficulty, examples, testCases, timeLimit, memoryLimit };
    try {
      await axios.post("http://localhost:5000/problems", data);
      alert("Problem Added!");
      // Reset form
      setTitle("");
      setDescription("");
      setDifficulty("Easy");
      setExamples([{ input: "", output: "" }]);
      setTestCases([{ input: "", output: "" }]);
      setTimeLimit(2000);
      setMemoryLimit(256);
    } catch (err) {
      alert(`Failed to add problem: ${err.response?.data?.error || err.message}`);
    }
  };

  // CSS styles
  const styles = {
    container: {
      position: "relative",
      maxWidth: "800px",
      margin: "20px auto",
      padding: "20px",
      backgroundColor: "#f5f5f5",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: { textAlign: "center", marginBottom: "20px", color: "#333" },
    section: { marginBottom: "20px" },
    input: {
      width: "100%",
      padding: "8px 10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      minHeight: "80px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    select: {
      width: "100%",
      padding: "8px 10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    row: { display: "flex", gap: "10px", marginBottom: "10px" },
    smallInput: {
      flex: 1,
      padding: "8px 10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#007bff",
      color: "#fff",
      cursor: "pointer",
      fontSize: "14px",
      marginTop: "10px",
    },
    buttonSecondary: {
      padding: "6px 12px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#28a745",
      color: "#fff",
      cursor: "pointer",
      fontSize: "12px",
    },
    backBtn: {
      position: "absolute",
      top: "20px",
      left: "20px",
      padding: "10px 20px",
      borderRadius: "8px",
      background: "#6b7280",
      color: "white",
      fontWeight: "600",
      border: "none",
      cursor: "pointer",
      transition: "background 0.2s",
    },
  };

  return (
    <div style={styles.container}>
      {/* Back button on top-left */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ⬅ Go Back
      </button>

      <h2 style={styles.heading}>Add Problem</h2>

      <div style={styles.section}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
        <select
          value={difficulty}
          onChange={(e) => handleDifficultyChange(e.target.value)}
          style={styles.select}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>
      

      <div style={styles.section}>
        <h3>Examples</h3>
        {examples.map((ex, i) => (
          <div key={i} style={styles.row}>
            <input
              placeholder="Input"
              value={ex.input}
              onChange={(e) =>
                handleChange(i, "input", e.target.value, examples, setExamples)
              }
              style={styles.smallInput}
            />
            <input
              placeholder="Output"
              value={ex.output}
              onChange={(e) =>
                handleChange(i, "output", e.target.value, examples, setExamples)
              }
              style={styles.smallInput}
            />
          </div>
        ))}
        <button
          onClick={() => addRow(examples, setExamples)}
          style={styles.buttonSecondary}
        >
          Add Example
        </button>
      </div>

      <div style={styles.section}>
        <h3>Test Cases</h3>
        {testCases.map((tc, i) => (
          <div key={i} style={styles.row}>
            <input
              placeholder="Input"
              value={tc.input}
              onChange={(e) =>
                handleChange(i, "input", e.target.value, testCases, setTestCases)
              }
              style={styles.smallInput}
            />
            <input
              placeholder="Output"
              value={tc.output}
              onChange={(e) =>
                handleChange(i, "output", e.target.value, testCases, setTestCases)
              }
              style={styles.smallInput}
            />
          </div>
        ))}
        <button
          onClick={() => addRow(testCases, setTestCases)}
          style={styles.buttonSecondary}
        >
          Add Test Case
        </button>
      </div>

      <div style={styles.section}>
        <h3>Time Limit (ms)</h3>
        <input
          type="number"
          placeholder="Time Limit"
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          style={styles.input}
        />
        <h3>Memory Limit (MB)</h3>
        <input
          type="number"
          placeholder="Memory Limit"
          value={memoryLimit}
          onChange={(e) => setMemoryLimit(Number(e.target.value))}
          style={styles.input}
        />
      </div>

      <button onClick={handleSubmit} style={styles.button}>
        Submit Problem
      </button>
    </div>
  );
};

export default AdminAddProblem;
