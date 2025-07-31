import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext"; // Adjust if needed
import SoundButton from "../../components/SoundButton"; // Adjust path if needed
import './PvPSetup.css'; // Reuse existing styles

function ChooseGameMode() {
  const navigate = useNavigate();
  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);

  const playClickSound = () => {
    if (soundOn) {
      const audio = new Audio("/sounds/click.wav");
      audio.volume = soundVolume;
      audio.play();
    }
    if (vibration && navigator.vibrate) {
      navigator.vibrate(vibrationStrength);
    }
  };

  const handleModeSelect = (mode) => {
    playClickSound();
    navigate(`/${mode}`);
  };

  return (
    <div className="setup-container">
      <h2>Choose Game Mode</h2>

      <div className="mode-selection">
         <div className="sa">
           <div className="mode-card" onClick={() => handleModeSelect("rush")}>

          { <img src="/rushmode.png" alt="Rush Mode" /> }
          
          
           </div><p>Play endless knife throwing action without levels!</p>
        </div>

        <div className= "sa">
          <div className="mode-card" onClick={() => handleModeSelect("level")}>
          {<img src="/level.png" alt="Level Mode" /> }
          
          
          </div><p>Advance through levels with increasing difficulty!</p>
        </div>
      </div>
    </div>
  );
}

export default ChooseGameMode;