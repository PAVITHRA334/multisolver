import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ContestList = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        // No token required
        const res = await axios.get("http://localhost:5000/api/contest");

        // Map data for UI
        const mappedContests = res.data.map(c => ({
          id: c._id,
          title: c.name || c.title || "Untitled Contest",
          problems: c.problems || [],
        }));

        setContests(mappedContests);
      } catch (err) {
        console.log("Error fetching contests", err);
      }
    };

    fetchContests();
  }, []);

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Contests</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {contests.map(contest => (
          <div
            key={contest.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "20px",
              width: "300px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#f9fafb",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", marginBottom: "10px" }}>
              {contest.title}
            </h2>
            <h4 style={{ marginBottom: "10px", color: "#555" }}>Problems:</h4>
            <ul style={{ paddingLeft: "20px", marginBottom: "15px" }}>
              {contest.problems.length === 0 && <li>No problems added</li>}
              {contest.problems.map((p, idx) => (
                <li key={idx} style={{ marginBottom: "5px" }}>
                  {p.name || p} {/* Problem name */}
                </li>
              ))}
            </ul>
            <Link
              to={`/contest/${contest.id}`}
              style={{
                textDecoration: "none",
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: "8px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Enter Contest
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestList;
