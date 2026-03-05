import React, { useEffect, useState } from "react";
import { getProblems, deleteProblem } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";

const AdminProblemList = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);

  const fetchProblems = async () => {
    const res = await getProblems();
    setProblems(res.data);
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this problem?")) {
      await deleteProblem(id);
      fetchProblems();
    }
  };

  return (
    <div className="container">
      {/* Back button on top-left */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Go Back
      </button>

      <h2>Manage Problems</h2>
      {problems.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>
                  <span className={`badge ${p.difficulty.toLowerCase()}`}>
                    {p.difficulty}
                  </span>
                </td>
                <td className="actions">
                  <Link to={`/admin/edit-problem/${p._id}`} className="edit">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style>{`
        .container {
          position: relative; /* for back button positioning */
          max-width: 900px;
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

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px 15px;
          text-align: left;
        }

        thead {
          background-color: #007BFF;
          color: white;
          border-radius: 12px;
        }

        tbody tr {
          background-color: white;
          border-bottom: 1px solid #ddd;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        tbody tr:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .edit {
          color: #007BFF;
          cursor: pointer;
          text-decoration: underline;
        }

        .delete {
          color: #dc3545;
          cursor: pointer;
          background: none;
          border: none;
          text-decoration: underline;
          font-family: inherit;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 12px;
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .badge.easy {
          background-color: #28a745;
        }

        .badge.medium {
          background-color: #ffc107;
        }

        .badge.hard {
          background-color: #dc3545;
        }

        /* Back button top-left */
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

export default AdminProblemList;
