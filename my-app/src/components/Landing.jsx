import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to Multisolver</h1>
      <div className="button-group">
        <button className="btn blue" onClick={() => navigate("/problems")}>
          Problems
        </button>
        <button className="btn green" onClick={() => navigate("/login", { state: { roleType: "user" } })}>
          User
        </button>
        <button className="btn red" onClick={() => navigate("/login", { state: { roleType: "admin" } })}>
          Admin
        </button>
      </div>

      <style>{`
        .landing-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          text-align: center;
        }

        h1 {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 40px;
          color: #1f2937;
        }

        .button-group {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 15px 30px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 1.2rem;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .btn.blue { background: #3b82f6; }
        .btn.blue:hover { background: #2563eb; }

        .btn.green { background: #10b981; }
        .btn.green:hover { background: #059669; }

        .btn.red { background: #ef4444; }
        .btn.red:hover { background: #b91c1c; }

        @media (max-width: 600px) {
          .button-group {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;
