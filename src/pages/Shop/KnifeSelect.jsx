import React, { useState, useEffect, useRef } from 'react';
import './KnifeSelect.css';
import { useNavigate } from 'react-router-dom';

const KnifeSelect = () => {
  const [selectedKnife, setSelectedKnife] = useState('');
  const [message, setMessage] = useState('');
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const knifeList = ['knife1', 'knife2', 'knife3', 'knife4', 'knife5'];

  useEffect(() => {
    const savedKnife = localStorage.getItem('selectedKnife');
    if (savedKnife) setSelectedKnife(savedKnife);
  }, []);

  const playClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleSelect = (knifeId) => {
    setSelectedKnife(knifeId);
    playClick();
  };

  const handleSave = () => {
    if (selectedKnife) {
      localStorage.setItem('selectedKnife', selectedKnife);
      playClick();
      setMessage(`✅ Knife '${selectedKnife.toUpperCase()}' saved!`);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="knife-select-page">
      <audio ref={audioRef} src="/sounds/click.wav" preload="auto" />

      <h1>Select Your Knife</h1>

      <div className="knife-grid">
        {knifeList.map(knifeId => (
          <div
            key={knifeId}
            className={`knife-card ${selectedKnife === knifeId ? 'selected' : ''}`}
            onClick={() => handleSelect(knifeId)}
          >
            <div className="knife-img-wrapper">
              <img src={`/knives/${knifeId}.png`} alt={knifeId} />
            </div>
            <p>{knifeId.toUpperCase()}</p>
          </div>
        ))}
      </div>

      {selectedKnife && (
        <div className="knife-preview">
          <h3>Preview:</h3>
          <img src={`/knives/${selectedKnife}.png`} alt="Preview" />
        </div>
      )}

      <button className="save-button" onClick={handleSave} disabled={!selectedKnife}>
        Save Knife
      </button>

      {message && <div className="knife-message">{message}</div>}
    </div>
  );
};

export default KnifeSelect;