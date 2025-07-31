import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mountKnifeGame } from './Knife'; // Update path if needed
import './KnifePage.css';

const LevelModes = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const level = parseInt(id) || 0;

  const [score, setScore] = useState(0);

  useEffect(() => {
    window.setKnifeScore = (val) => setScore(val);
    mountKnifeGame('knife-container', level);

    return () => {
      window.setKnifeScore = null;
      if (window.game && window.game.destroy) {
        window.game.destroy(true);
        window.game = null;
      }
    };
  }, [level]);

  return (
    <div className="knife-wrapper">
      <div className="knife-header">
        <button className="exit-btn" onClick={() => navigate('/')}>⟵ Exit</button>
        <div className="center-label">Level Mode</div>
        <div className="level-label">Level {level + 1}</div>
      </div>
      <div id="knife-container" ref={containerRef} className="knife-container" />
    </div>
  );
};

export default LevelModes;