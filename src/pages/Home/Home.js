import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { playClickFeedback } from '../../utils/feedback'; // ✅ add this
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    playClickFeedback(); // ✅ instant preloaded sound + vibration
    navigate(path);
  };

  return (
    <div className="home-container">
      <h1 className="home-logo">Blade Rush</h1>

      <div className="mode-buttons">
        <div className="mode-card" onClick={() => handleCardClick('/play/choosemode')}>
          <img src="/assets/icons/play.png" alt="Knif-hit" />
        </div>

        <div className="mode-card" onClick={() => handleCardClick('/score')}>
          <img src="/assets/icons/score.png" alt="Check Score" />
        </div>

        <div className="mode-card" onClick={() => handleCardClick('/tournament')}>
          <img src="/assets/icons/tournament.png" alt="Play Tournament" />
        </div>
      </div>
    </div>
  );
}

export default Home;