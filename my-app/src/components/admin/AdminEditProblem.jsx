import React, { useState, useEffect } from "react";
import { getProblem, updateProblem } from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";

const AdminEditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [examples, setExamples] = useState([{ input: "", output: "" }]);

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await getProblem(id);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setDifficulty(res.data.difficulty);
      setExamples(res.data.examples);
    };
    fetchProblem();
  }, [id]);

  const handleExampleChange = (i, field, value) => {
    const newEx = [...examples];
    newEx[i][field] = value;
    setExamples(newEx);
  };

  const addExample = () => setExamples([...examples, { input: "", output: "" }]);

  const handleSubmit = async () => {
    await updateProblem(id, { title, description, difficulty, examples });
    alert("Problem updated!");
    navigate("/admin/problems");
  };

  return (
    <div className="container">
      <h2>Edit Problem</h2>

      <label>Title</label>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Difficulty</label>
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <h3>Examples</h3>
      {examples.map((ex, i) => (
        <div key={i} className="example">
          <input
            placeholder="Input"
            value={ex.input}
            onChange={(e) => handleExampleChange(i, "input", e.target.value)}
          />
          <input
            placeholder="Output"
            value={ex.output}
            onChange={(e) => handleExampleChange(i, "output", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addExample} className="btn-secondary">
        + Add Example
      </button>

      <button onClick={handleSubmit} className="btn-primary">
        Update Problem
      </button>

      {/* CSS in the same file */}
      <style>{`
        .container {
          max-width: 700px;
          margin: 40px auto;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        label {
          display: block;
          margin-top: 15px;
          margin-bottom: 5px;
          font-weight: bold;
          color: #555;
        }

        input, textarea, select {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-bottom: 10px;
          font-size: 1rem;
        }

        textarea {
          resize: vertical;
        }

        .example {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .example input {
          flex: 1;
        }

        .btn-primary, .btn-secondary {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          margin-top: 10px;
          cursor: pointer;
        }

        .btn-primary {
          background-color: #007BFF;
          color: white;
        }

        .btn-primary:hover {
          background-color: #0056b3;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background-color: #5a6268;
        }
      `}</style>
    </div>
  );
};

export default AdminEditProblem;
