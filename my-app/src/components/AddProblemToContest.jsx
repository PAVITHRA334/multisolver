import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProblemToContest = ({ contestId }) => {
  const [problems, setProblems] = useState([]); // all problems
  const [selectedProblem, setSelectedProblem] = useState("");

  // Fetch all available problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/problems");
        setProblems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProblems();
  }, []);

  const handleAddProblem = async () => {
    if (!selectedProblem) return alert("Select a problem first");
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/contest/${contestId}/add-problem`,
        { problemId: selectedProblem },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Problem added to contest!");
      setSelectedProblem("");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding problem");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Add Problem to Contest</h3>
      <select
        value={selectedProblem}
        onChange={(e) => setSelectedProblem(e.target.value)}
      >
        <option value="">-- Select a problem --</option>
        {problems.map((p) => (
          <option key={p._id} value={p._id}>
            {p.title} ({p.difficulty})
          </option>
        ))}
      </select>
      <button onClick={handleAddProblem} style={{ marginLeft: "10px" }}>
        Add Problem
      </button>
    </div>
  );
};

export default AddProblemToContest;
