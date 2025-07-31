import React from "react";
import { useNavigate } from "react-router-dom";
import "./Tournament.css"; // ← Make sure this CSS is present

const Tournament = () => {
  const navigate = useNavigate();

  return (
    <div className="tournament-glass">
      <h1>🏆 Weekly Tournament</h1>
      <p className="coming-soon">🚧 Coming Soon...</p>

      <p>This feature will allow premium users to compete weekly and monthly with Pi rewards!</p>
      <p>We're working on leaderboard, authentication and secure Pi payment integration.</p>

      <button className="help-btn" onClick={() => navigate("/help")}>
        ❓ Help / Contribute
      </button>
    </div>
  );
};

export default Tournament;