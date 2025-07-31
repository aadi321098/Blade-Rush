import React from 'react';

const GameInfo = ({ level, knivesRemaining }) => {
  return (
    <div className="game-info">
      <p className="level-info">Level: <span>{level}</span></p>
      <p className="knives-info">Knives Remaining: {knivesRemaining - 1}</p>
    </div>
  );
};

export default GameInfo;