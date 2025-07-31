import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RushScorePage.css';

const RushScorePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentRushScore = location.state?.score || 0;

  const rushHighScore = parseInt(localStorage.getItem('rushHighScore') || '0');
  const recentScores = JSON.parse(localStorage.getItem('rushRecentScores') || '[]');
  const levelHigh = parseInt(localStorage.getItem('knifeMaxLevel') || '1');

  return (
    <div className="rush-score-page">
      <h1 className="title">🎮 Game Summary</h1>

      <div className="score-section">
        <div className="score-card rush-mode">
          <h2>🏁 Rush Mode</h2>
          <p>Current Score: <span>{currentRushScore}</span></p>
          <p>High Score: <span>{rushHighScore}</span></p>
        </div>

        <div className="score-card level-mode">
          <h2>🧠 Level Mode</h2>
          <p>Highest Level Reached: <span>{levelHigh}</span></p>
        </div>
      </div>

      <div className="recent-section">
        <h3>📊 Last 5 Rush Scores</h3>
        <ul className="recent-list">
          {recentScores.map((score, index) => (
            <li key={index}>• {score}</li>
          ))}
        </ul>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate('/play/rush')}>🔁 Play Again</button>
        <button onClick={() => navigate('/')}>🏠 Home</button>
      </div>
    </div>
  );
};

export default RushScorePage;