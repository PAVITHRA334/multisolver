import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateContest = () => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [contestLink, setContestLink] = useState(""); // ✅ Link state
  const navigate = useNavigate();

  useEffect(() => {
  const fetchProblems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/problems");
      setProblems(res.data); // ✅ Problems will appear in checkbox list
    } catch (err) {
      console.error(err);
      alert("Failed to fetch problems");
    }
  };
  fetchProblems();
}, []);


  const handleCheckboxChange = (id) => {
    setSelectedProblems((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!title || !startTime || !endTime)
      return alert("All fields are required");

    if (selectedProblems.length === 0)
      return alert("Select at least one problem");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/contest",
        {
          title,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          problems: selectedProblems,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const link = `http://localhost:3000/contest/${res.data.contestId}`;
      setContestLink(link); // ✅ Show link in box
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating contest");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contestLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div style={styles.container}>
      <h2>Create Contest</h2>
      <input
        type="text"
        placeholder="Contest Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        style={styles.input}
      />
      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        style={styles.input}
      />

      <h3>Select Problems:</h3>
      <div style={styles.problemsContainer}>
        {problems.map((p) => (
          <label key={p._id} style={styles.problemLabel}>
            <input
              type="checkbox"
              checked={selectedProblems.includes(p._id)}
              onChange={() => handleCheckboxChange(p._id)}
            />
            {p.title} ({p.difficulty})
          </label>
        ))}
      </div>

      <button onClick={handleCreate} style={styles.button}>
        Create Contest
      </button>

      {/* ✅ Contest link box */}
      {contestLink && (
        <div style={styles.linkBox}>
          <input
            type="text"
            readOnly
            value={contestLink}
            style={styles.linkInput}
          />
          <button onClick={handleCopy} style={styles.copyButton}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  input: {
    width: "80%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  problemsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    maxHeight: "200px",
    overflowY: "auto",
    margin: "15px 0",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  problemLabel: { marginBottom: "8px", cursor: "pointer" },
  button: {
    padding: "12px 25px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "15px",
  },
  linkBox: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  linkInput: {
    width: "70%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  copyButton: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#10b981",
    color: "#fff",
    cursor: "pointer",
  },
};

export default CreateContest;
