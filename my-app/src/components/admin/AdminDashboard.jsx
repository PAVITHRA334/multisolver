import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") navigate("/login");
  }, [navigate]);

  return (
    <div className="dashboard">
      
      <button
        className="back-btn"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }}
      >
        ⬅ Log Out
      </button>

      <h1>Admin Dashboard</h1>
      <div className="links">
        <Link to="/admin/add-problem" className="btn blue">Add Problem</Link>
        <Link to="/admin/problems" className="btn green">Manage Problems</Link>
        <button className="btn purple" onClick={() => navigate("/create-contest")}>
  Create Contest
</button>
      </div>

      <style>{`
        .dashboard { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #fdfcfb, #e2d1c3); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 20px; }
        h1 { font-size: 2.5rem; margin-bottom: 30px; color: #1f2937; }
        .links { display: flex; gap: 20px; flex-wrap: wrap; }
        .btn { padding: 12px 25px; border-radius: 10px; color: white; font-weight: 600; text-decoration: none; font-size: 1.1rem; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
        .btn.blue { background: #3b82f6; } .btn.blue:hover { background: #2563eb; }
        .btn.green { background: #10b981; } .btn.green:hover { background: #059669; }
        .back-btn { position: absolute; top: 20px; left: 20px; padding: 10px 20px; border-radius: 8px; background: #6b7280; color: white; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s; }
        .back-btn:hover { background: #374151; }
        .btn.purple { background: #8b5cf6; }
.btn.purple:hover { background: #7c3aed; }

        @media (max-width: 600px) { .links { flex-direction: column; gap: 15px; } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
