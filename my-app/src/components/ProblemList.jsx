import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ProblemList = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [solved, setSolved] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/problems").then((res) => setProblems(res.data));

    // Load solved problems from localStorage
    const solvedFromStorage = JSON.parse(localStorage.getItem("solvedProblems")) || [];
    setSolved(solvedFromStorage);
  }, []);

  // Filter problems by search
  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Go Back
      </button>

      <h2>Problems</h2>

      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredProblems.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        <div className="grid">
          {filteredProblems.map((p) => (
            <Link key={p._id} to={`/problems/${p._id}`} className="problem-card">
              <div className="left-section">
                {solved.includes(p._id) && <span className="tick">✅</span>}
                <h3>{p.title}</h3>
              </div>
              <span className={`badge ${p.difficulty.toLowerCase()}`}>
                {p.difficulty}
              </span>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .container {
          position: relative;
          max-width: 900px;
          margin: 40px auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        h2 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 20px;
          color: #1f2937;
        }

        .search-container {
          text-align: center;
          margin-bottom: 20px;
        }

        .search-container input {
          width: 70%;
          padding: 10px;
          border: 2px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }

        .search-container input:focus {
          border: 2px solid #2563eb;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .problem-card {
          background-color: #fff;
          border-radius: 12px;
          padding: 15px 20px;
          text-decoration: none;
          color: #1f2937;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .problem-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .left-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tick {
          font-size: 1.2rem;
        }

        .problem-card h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .badge {
          padding: 5px 10px;
          border-radius: 12px;
          color: white;
          font-weight: bold;
          font-size: 0.85rem;
          min-width: 70px;
          text-align: center;
        }

        .badge.easy { background-color: #28a745; }
        .badge.medium { background-color: #ffc107; color: #333; }
        .badge.hard { background-color: #dc3545; }

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
        }

        .back-btn:hover {
          background: #374151;
        }
      `}</style>
    </div>
  );
};

export default ProblemList;
