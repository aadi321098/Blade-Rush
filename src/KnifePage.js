import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mountKnifeGame } from './Knife';
import './KnifePage.css';
import { playClickFeedback } from './utils/feedback'; // ✅ import path adjust
const KnifePage = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.currentLevel) setLevel(window.currentLevel);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.setKnifeScore = (val) => setScore(val);
    mountKnifeGame('knife-container');
    return () => {
      window.setKnifeScore = null;
      if (window.game && window.game.destroy) {
        window.game.destroy(true);
        window.game = null;
      }
    };
  }, []);

  return (
    <div className="knife-wrapper">
      <header className="knife-header">
        <button
  className="exit-btn"
  onClick={() => {
    playClickFeedback(); // ✅ sound + vibration
    navigate('/');
  }}
>
  ⟵ Exit
</button>
        <div className="header-center">
          <div className="mode-label">🎯 Level Mode</div>
          <div className="level-label">Level {level}</div>
        </div>
        <div className="right-space" /> {/* Placeholder for alignment */}
      </header>

      <div id="knife-container" ref={containerRef} className="knife-container" />
    </div>
  );
};

export default KnifePage;