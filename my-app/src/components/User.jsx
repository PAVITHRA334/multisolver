import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "user") {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(res.data.message);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <div className="dashboard">
      <button className="back-btn" onClick={handleLogout}>Logout</button>
      <h1>User Dashboard</h1>
      <div className="links">
        <Link to="/problems" className="btn blue">Problems</Link>
        <Link to="/history" className="btn green">History/Profile</Link>
        <Link to="/contests" className="btn purple">Contests</Link> {/* New Contest button */}
      </div>

      <style>{`
        .dashboard {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfcfb, #e2d1c3);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          text-align: center;
          padding: 20px;
        }
        h1 { font-size: 2.5rem; margin-bottom: 30px; color: #1f2937; }
        .links { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 20px; }
        .btn { padding: 12px 25px; border-radius: 10px; color: white; font-weight: 600; text-decoration: none; font-size: 1.1rem; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
        .btn.blue { background: #3b82f6; } .btn.blue:hover { background: #2563eb; }
        .btn.green { background: #10b981; } .btn.green:hover { background: #059669; }
        .btn.purple { background: #8b5cf6; } .btn.purple:hover { background: #7c3aed; } /* Contest button style */
        .back-btn { position: absolute; top: 20px; left: 20px; padding: 10px 20px; border-radius: 8px; background: #6b7280; color: white; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s; }
        .back-btn:hover { background: #374151; }
        @media (max-width: 600px) { .links { flex-direction: column; gap: 15px; } }
      `}</style>
    </div>
  );
};

export default UserDashboard;
