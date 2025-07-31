import { createContext, useState, useEffect } from "react";
import {
  initFeedback,
  updateFeedbackSettings,
} from "../utils/feedback";

export const AppContext = createContext();

export function AppProvider({ children }) {
  // 🔊 Audio/Vibration Settings
  const [soundOn, setSoundOn] = useState(() => getStored("sound", true));
  const [musicOn, setMusicOn] = useState(() => getStored("music", true));
  const [vibration, setVibration] = useState(() => getStored("vibration", true));
  const [musicVolume, setMusicVolume] = useState(() => getStored("musicVolume", 0.5));
  const [soundVolume, setSoundVolume] = useState(() => getStored("soundVolume", 0.5));
  const [vibrationStrength, setVibrationStrength] = useState(() => getStored("vibrationStrength", 50));

  // 🔊 Save feedback settings to localStorage
  useEffect(() => {
    localStorage.setItem("sound", JSON.stringify(soundOn));
    localStorage.setItem("music", JSON.stringify(musicOn));
    localStorage.setItem("vibration", JSON.stringify(vibration));
    localStorage.setItem("musicVolume", musicVolume);
    localStorage.setItem("soundVolume", soundVolume);
    localStorage.setItem("vibrationStrength", vibrationStrength);
  }, [soundOn, musicOn, vibration, musicVolume, soundVolume, vibrationStrength]);

  // 🔄 Initialize Feedback Utility Once
  useEffect(() => {
    initFeedback({
      soundOn,
      soundVolume,
      vibrationOn: vibration,
      vibrationStrength,
    });
  }, []);

  // 🔁 Update Feedback Utility on changes
  useEffect(() => {
    updateFeedbackSettings({
      soundOn,
      soundVolume,
      vibrationOn: vibration,
      vibrationStrength,
    });
  }, [soundOn, soundVolume, vibration, vibrationStrength]);

  function getStored(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  }

  return (
    <AppContext.Provider value={{
      soundOn, setSoundOn,
      musicOn, setMusicOn,
      vibration, setVibration,
      musicVolume, setMusicVolume,
      soundVolume, setSoundVolume,
      vibrationStrength, setVibrationStrength,
    }}>
      {children}
    </AppContext.Provider>
  );
}