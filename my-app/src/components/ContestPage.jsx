import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ContestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/contest/${id}`);
        setContest(res.data.contest);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Error fetching contest");
      }
    };

    fetchContest();
  }, [id]);

  if (!contest) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        {contest.title}
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {contest.problems.length === 0 && <p>No problems added yet</p>}

        {contest.problems.map((problem, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "20px",
              width: "250px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#f9fafb",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
              {problem.name || problem}
            </h3>
            <button
              onClick={() => navigate(`/problems/${problem._id || problem}`)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Solve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestPage;
