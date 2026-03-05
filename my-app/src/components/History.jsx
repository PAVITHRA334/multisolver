import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch user profile
        const userRes = await axios.get("http://localhost:5000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        setForm({
          username: userRes.data.username,
          email: userRes.data.email,
          password: "",
        });

        // Fetch user submissions
        const subRes = await axios.get("http://localhost:5000/users/my-submissions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(subRes.data);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/auth/profile",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  // Group submissions by problem and store as booleans
  const groupedSubmissions = submissions.reduce((acc, s) => {
    const pid = s.problemId.toString();
    if (!acc[pid]) {
      acc[pid] = {
        title: s.problemTitle || "Problem",
        approaches: { brute: false, better: false, optimal: false }
      };
    }
    if (s.approach in acc[pid].approaches) {
      acc[pid].approaches[s.approach] = s.status?.toLowerCase() === "accepted";
    }
    return acc;
  }, {});

  // Total problems fully solved (all approaches accepted)
  const totalSolved = Object.values(groupedSubmissions).filter(p =>
    p.approaches.brute && p.approaches.better && p.approaches.optimal
  ).length;

  return (
    <div className="history-container">
      <h1>📜 My Profile & Submissions</h1>
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Go Back</button>

      {/* User Profile Card */}
      {user && !editing && (
        <div className="profile-card">
          <h2>👤 {user.username}</h2>
          <p>{user.email}</p>
          <span className="role">{user.role}</span>
          <br />
          <button className="edit-btn" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
        </div>
      )}

      {/* Edit Profile Form */}
      {editing && (
        <div className="profile-card">
          <h2>✏️ Edit Profile</h2>
          <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New Password (optional)" />
          <div className="btn-group">
            <button className="save-btn" onClick={saveProfile}>💾 Save</button>
            <button className="cancel-btn" onClick={() => setEditing(false)}>❌ Cancel</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats">
        <div className="stat-box">
          <h3>{totalSolved}</h3>
          <p>Problems Fully Solved</p>
        </div>
        <div className="stat-box">
          <h3>{submissions.length > 0 ? Math.round((submissions.filter(s => s.status?.toLowerCase() === "accepted").length / submissions.length) * 100) : 0}%</h3>
          <p>Acceptance Rate</p>
        </div>
        <div className="stat-box">
          <h3>{new Set(submissions.map(s => s.language)).size || 0}</h3>
          <p>Languages Used</p>
        </div>
      </div>

      {/* Submission History Table */}
      <h2 className="section-title">Problem Submission History</h2>
      {Object.keys(groupedSubmissions).length === 0 ? (
        <p className="no-data">No submissions yet.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Problem</th>
              <th>Brute Force</th>
              <th>Better</th>
              <th>Optimal</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedSubmissions).map(([pid, p]) => (
              <tr key={pid}>
                <td
                  style={{ cursor: "pointer", color: "#3b82f6", textDecoration: "underline" }}
                  onClick={() => navigate(`/problems/${pid}`)}
                >
                  {p.title}
                </td>
                <td style={{ textAlign: "center" }}>{p.approaches.brute ? "✅" : "❌"}</td>
                <td style={{ textAlign: "center" }}>{p.approaches.better ? "✅" : "❌"}</td>
                <td style={{ textAlign: "center" }}>{p.approaches.optimal ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CSS */}
      <style>{`
        .history-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        h1 { font-size: 2.5rem; margin-bottom: 30px; font-weight: bold; color: #1f2937; }
        .back-btn { position: absolute; top: 20px; left: 20px; padding: 10px 20px; border-radius: 8px; background: #6b7280; color: white; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s; }
        .back-btn:hover { background: #374151; }

        .profile-card {
          background: white; padding: 20px 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center; margin-bottom: 30px; width: 100%; max-width: 400px;
        }
        .profile-card input { width: 100%; padding: 10px; margin: 8px 0; border-radius: 8px; border: 1px solid #ccc; }
        .edit-btn { margin-top: 10px; padding: 8px 15px; border: none; border-radius: 10px; background: #3b82f6; color: white; cursor: pointer; }
        .edit-btn:hover { background: #2563eb; }
        .btn-group { display: flex; gap: 10px; margin-top: 10px; justify-content: center; }
        .save-btn { padding: 8px 15px; border: none; border-radius: 10px; background: #10b981; color: white; cursor: pointer; }
        .save-btn:hover { background: #059669; }
        .cancel-btn { padding: 8px 15px; border: none; border-radius: 10px; background: #ef4444; color: white; cursor: pointer; }
        .cancel-btn:hover { background: #b91c1c; }
        .role { display: inline-block; background: #3b82f6; color: white; padding: 5px 12px; border-radius: 10px; font-size: 0.9rem; }

        .stats { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-bottom: 30px; }
        .stat-box { background: white; padding: 20px; border-radius: 15px; width: 180px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .stat-box h3 { font-size: 1.8rem; margin-bottom: 5px; color: #1f2937; }

        .section-title { font-size: 1.8rem; margin-bottom: 20px; font-weight: bold; color: #1f2937; }
        .no-data { color: #555; font-size: 1.2rem; margin-top: 20px; }

        .history-table {
          width: 100%; max-width: 800px; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .history-table th, .history-table td { padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-size: 1rem; }
        .history-table th { background: #3b82f6; color: white; text-align: left; }
        .history-table tr:last-child td { border-bottom: none; }
      `}</style>
    </div>
  );
};

export default History;
