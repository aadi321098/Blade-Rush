import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";

function SoundButton({ onClick, children, className = "", ...props }) {
  const { soundOn, soundVolume, vibration, vibrationStrength } = useContext(AppContext);
  const audioRef = useRef(null);

  // Preload audio once
  useEffect(() => {
    audioRef.current = new Audio("/sounds/click.wav");
    audioRef.current.load();
  }, []);

  const handleClick = (e) => {
    // Play preloaded sound
    if (soundOn && audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.volume = soundVolume ?? 1;
        audioRef.current.play();
      } catch (err) {
        console.warn("⚠️ Audio play error:", err);
      }
    }

    // Vibrate
    if (vibration && navigator.vibrate) {
      navigator.vibrate(vibrationStrength || 50);
    }

    if (onClick) onClick(e);
  };

  return (
    <button className={className} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export default SoundButton;