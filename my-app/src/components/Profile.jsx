import React, { useEffect, useState } from "react";
import { getAllSubmissions, getProblems } from "../utils/api";

const Profile = () => {
  const userId = "USER_ID"; // Replace with logged-in user
  const [submissions, setSubmissions] = useState([]);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    getAllSubmissions(userId).then(res => setSubmissions(res.data));
    getProblems().then(res => setProblems(res.data));
  }, []);

  const getProblemTitle = (id) => {
    const p = problems.find(pr => pr._id === id);
    return p ? p.title : id;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

      <h3 className="text-xl font-semibold mb-2">Submissions</h3>
      <ul>
        {submissions.map(sub => (
          <li key={sub._id} className="mb-2 p-2 border rounded hover:bg-gray-100">
            <p><strong>Problem:</strong> {getProblemTitle(sub.problemId)}</p>
            <p><strong>Method:</strong> {sub.method}</p>
            <p><strong>Language:</strong> {sub.language}</p>
            <p><strong>Status:</strong> {sub.status}</p>
            <p><strong>Time:</strong> {sub.timeMs} ms | <strong>Memory:</strong> {sub.memoryKb} KB</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
