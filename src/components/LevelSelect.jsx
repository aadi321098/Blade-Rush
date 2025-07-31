import React, { useEffect, useState } from 'react';
import levelsData from '../data/levels';
import { useNavigate } from 'react-router-dom';
import './LevelSelect.css'; // optional if you want styling

const LevelSelect = () => {
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('knifeGameProgress')) || {
      completedLevels: [],
      unlockedLevels: [1]
    };

    const updated = levelsData.map((levelObj) => {
      const { level } = levelObj;
      if (progress.completedLevels.includes(level)) return { ...levelObj, status: 'completed' };
      if (progress.unlockedLevels.includes(level)) return { ...levelObj, status: 'unlocked' };
      return { ...levelObj, status: 'locked' };
    });

    setLevels(updated);
  }, []);

  const handleClick = (levelObj) => {
    if (levelObj.status === 'locked') {
      alert('🔒 This level is locked.\nComplete the previous one to unlock.');
    } else {
      navigate(`/${levelObj.level}`);
    }
  };

  return (
    <div className="level-select-container">
      <h2>🎯 Level Mode</h2>
      <div className="levels-grid">
        {levels.map((level) => (
          <div
            key={level.level}
            className={`level-card ${level.status}`}
            onClick={() => handleClick(level)}
          >
            <span>Level {level.level}</span>
            {level.status === 'completed' && <span className="status">✅</span>}
            {level.status === 'locked' && <span className="status">🔒</span>}
          </div>
        ))}
        <div className="coming-soon-card">🚧 More Levels Coming Soon...</div>
      </div>
    </div>
  );
};

export default LevelSelect;