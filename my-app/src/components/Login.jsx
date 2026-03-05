import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roleType = location.state?.roleType || null; // "user" or "admin"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // inside Login.jsx

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:5000/auth/login", { 
      email: email.trim().toLowerCase(),
      password
    });

    const { token, role } = res.data;

    if (roleType && role !== roleType) {
      setError(`Only ${roleType} login is allowed here.`);
      setLoading(false);
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // ✅ use `from` if available, else fallback
    const redirectPath = location.state?.from?.pathname || 
      (role === "admin" ? "/admin" : "/user");

    navigate(redirectPath, { replace: true });
  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-container">
      <button className="back-btn" onClick={() => navigate("/")}>⬅ Home</button>
      <h2>Login {roleType ? `(${roleType})` : ""}</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="signup-link">
        Don't have an account? <span onClick={() => navigate("/register")}>Sign Up</span>
      </div>

      <style>{`
        .login-container { 
          position: relative; 
          max-width: 400px; 
          margin: 100px auto; 
          padding: 30px; 
          background: #f5f5f5; 
          border-radius: 10px; 
          text-align: center; 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
        }
        h2 { margin-bottom: 20px; color: #333; }
        input { 
          width: 100%; 
          padding: 10px; 
          margin-bottom: 15px; 
          border-radius: 5px; 
          border: 1px solid #ccc; 
          font-size: 14px; 
        }
        .error { color: red; margin-bottom: 10px; }
        button[type="submit"] { 
          width: 100%; 
          padding: 10px; 
          border-radius: 5px; 
          border: none; 
          background-color: #3b82f6; 
          color: white; 
          font-weight: bold; 
          cursor: pointer; 
        }
        button[type="submit"]:disabled { 
          opacity: 0.6; 
          cursor: not-allowed; 
        }
        button[type="submit"]:hover:not(:disabled) { background-color: #2563eb; }
        .back-btn { 
          position: absolute; 
          top: 20px; 
          left: 20px; 
          padding: 8px 16px; 
          border-radius: 8px; 
          background: #6b7280; 
          color: white; 
          font-weight: 600; 
          border: none; 
          cursor: pointer; 
          transition: background 0.2s; 
        }
        .back-btn:hover { background: #374151; }
        .signup-link { margin-top: 15px; font-size: 0.9rem; }
        .signup-link span { color: #3b82f6; cursor: pointer; font-weight: 500; }
        .signup-link span:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
};

export default Login;
