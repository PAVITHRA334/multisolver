import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("user");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // ✅ Corrected URL
      const res = await axios.post("http://localhost:5000/auth/signup", {
        username: name,
        email,
        password,
        role,
      });

      setSuccess(res.data.message || "Registration successful!");
      setName("");
      setEmail("");
      setPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.log("Signup error:", err.response?.data); // Debug
    }
  };

  return (
    <div className="register-container">
      <button className="back-btn" onClick={() => navigate("/")}>⬅ Home</button>

      <h2>Sign Up</h2>
      <form onSubmit={handleRegister}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
  <option value="user">User</option>
  <option value="admin">Admin</option>
</select>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        {success && <p className="success">{success}</p>}
        <button type="submit">Register</button>
      </form>

      <div className="login-link">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Login</span>
      </div>

      <style>{`
        .register-container {
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
        input { width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #ccc; font-size: 14px; }
        .error { color: red; margin-bottom: 10px; }
        .success { color: green; margin-bottom: 10px; }
        button[type="submit"] { width: 100%; padding: 10px; border-radius: 5px; border: none; background-color: #3b82f6; color: white; font-weight: bold; cursor: pointer; }
        button[type="submit"]:hover { background-color: #2563eb; }
        .back-btn { position: absolute; top: 20px; left: 20px; padding: 8px 16px; border-radius: 8px; background: #6b7280; color: white; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s; }
        .back-btn:hover { background: #374151; }
        .login-link { margin-top: 15px; font-size: 0.9rem; }
        .login-link span { color: #3b82f6; cursor: pointer; font-weight: 500; }
        .login-link span:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
};

export default Register;
