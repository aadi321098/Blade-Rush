import React, { useState, useEffect, useRef } from 'react';
import './RushMode.css'; // We'll keep the same CSS file
import { useNavigate } from "react-router-dom";

import { useContext } from 'react';
import { AppContext } from '../../context/AppContext'; // ✅ where authUser lives


const RushMode = () => {
  // Game state
  const [level, setLevel] = useState(1);
  const [knivesRemaining, setKnivesRemaining] = useState(10);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(null);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [knifeImage, setKnifeImage] = useState(null);
  const [saving, setSaving] = useState(false);
const [saved, setSaved] = useState(false);
  // Game refs
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const levelCompleteRef = useRef(false);
  const knifeMovingRef = useRef(0);
  const hitRef = useRef(0);
  const scoreRef = useRef(0); // 🆕 add this line
  const currentAngleRef = useRef(0);
  const rectHeightRef = useRef(0);
  const hitKnivesRef = useRef([]);
  const rotationSpeedRef = useRef(1);
  const wobbleFrameRef = useRef(0);
  const boardWobbleRef = useRef(0);
  const animationFrameRef = useRef(null);
  
  // Assets
  const knifeImageRef = useRef(new Image());
  const throwSoundRef = useRef(null);
  const clickSoundRef = useRef(null);
  const canVibrateRef = useRef("vibrate" in navigator);
  
  // Game constants
  const DEBUG_MODE = false;
  const boardStyle = localStorage.getItem("selectedBoard") || "classic";
  const { authUser } = useContext(AppContext); // ✅ Get authenticated user
  
  // Particle effects
  const iceParticles = Array.from({ length: 8 }, () => ({
    angleOffset: Math.random() * Math.PI * 2,
    radiusOffset: 60 + Math.random() * 30,
    size: 18 + Math.random() * 6,
    speedFactor: 0.5 + Math.random() * 0.8,
  }));
  
  const lavaCracks = Array.from({ length: 7 }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 50 + Math.random() * 40,
    width: 8 + Math.random() * 6,
    flicker: Math.random() * 0.4 + 0.6
  }));

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 700;
    
    // Load assets
    const selectedKnife = localStorage.getItem('selectedKnife') || 'knife1';
    knifeImageRef.current.src = process.env.PUBLIC_URL + `/knives/${selectedKnife}.png`;
   // ✅ top-level useEffect
    throwSoundRef.current = new Audio("/throw.mp3");
    clickSoundRef.current = new Audio("/click.wav");
    throwSoundRef.current.volume = 0.5;
    clickSoundRef.current.volume = 0.5;
    
    rectHeightRef.current = canvas.height - 90;
    
    setupLevel();
    update();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  const setupLevel = (currentLevel = level) => {
    hitKnivesRef.current = [];
    currentAngleRef.current = 0;
    knifeMovingRef.current = 0;
  hitRef.current = 0;
  wobbleFrameRef.current = 0;
  boardWobbleRef.current = 0;
    
    // Speed increases by 15% every level
    rotationSpeedRef.current = 1 * Math.pow(1.15, currentLevel - 1);
    
    // Knife count logic
    let newKnives;
    if (currentLevel <= 3) {
      newKnives = 10;
    } else if (currentLevel <= 6) {
      newKnives = 11;
    } else if (currentLevel <= 10) {
      newKnives = 12;
    } else {
      newKnives = 9 + Math.floor(Math.random() * 5); // 9 to 13
    }
    
    setKnivesRemaining(newKnives);
    rectHeightRef.current = canvasRef.current.height - 90;
  };
  
  const updateUI = () => {
    // State updates already handle UI updates through React's reactivity
  };
  
  const showPopup = (title, message) => {
    setGameOver({ title, message });
  };
  const checkRectCollision = (curArc) => {
  if (DEBUG_MODE) return false;
  if (hitKnivesRef.current.length === 0) return false;

  for (let k of hitKnivesRef.current) {
    let diff = Math.abs(curArc.currentAngle - k.cangle);
    diff = Math.min(diff, 2 * Math.PI - diff);

    // Avoid threshold going too low
    const threshold = Math.max(0.1, 0.3 - 0.02 * hitKnivesRef.current.length);
    if (diff < threshold) {const currentScore = scoreRef.current;
const prevHigh = parseInt(localStorage.getItem('rushHighScore') || '0');
if (currentScore > prevHigh) {
  localStorage.setItem('rushHighScore', currentScore);
}
const prevScores = JSON.parse(localStorage.getItem('rushRecentScores') || '[]');
const updatedScores = [currentScore, ...prevScores].slice(0, 5);
localStorage.setItem('rushRecentScores', JSON.stringify(updatedScores));

// ✅ Show popup only
showPopup("Game Over", `Your Score: ${currentScore}`);
  

  return true;
}
    
  }

  return false;
};
const handleCheckScore = () => {
  navigate("/RushScorePage");
};

const handleExit = () => {
  navigate("/"); // Home or Landing page
};
const checkCollision = (curArc, curKnife) => {
  // Only check when knife is close to the target
  if (curKnife.y - curArc.centerY > curArc.radius + 15) return false;

  // First check if knife hits the board
  if (curKnife.y - curArc.centerY <= curArc.radius) {
    // Then check for collisions with existing knives
    if (checkRectCollision(curArc)) {
      return false; // Collision detected - game over handled by checkRectCollision
    }

    // Successful stick
    hitRef.current = 1;
    wobbleFrameRef.current = 1;
    
    hitKnivesRef.current.push({
      x: curKnife.x,
      y: curKnife.y,
      width: curKnife.width,
      height: curKnife.height,
      r: curArc.radius,
      angle: 0,
      cangle: curArc.currentAngle
    });
    
    setKnivesRemaining(prev => {
      const newRemaining = prev - 1;
      if (newRemaining <= 0) {
        // Level complete logic
        setTimeout(() => {
          setLevel(prevLevel => {
            const nextLevel = prevLevel + 1;
            setupLevel(nextLevel);
            return nextLevel;
          });
          
      setScore(prevScore => {
        const updated = prevScore + level * 2;
        scoreRef.current = updated;
        return updated;
      });
    }, 800);
  }

  return newRemaining;
});

// 🟢 Add score for successful hit
setScore(prev => {
  const updated = prev + 1;
  scoreRef.current = updated;
  return updated;
});

return true;
  }
  return false;
};
  const changeStatus = () => {
  if (knifeMovingRef.current === 0 && knivesRemaining > 0) {
    knifeMovingRef.current = 1;
    throwSoundRef.current.currentTime = 0;
    throwSoundRef.current.play();
    if (canVibrateRef.current) navigator.vibrate(100);
  }
};
  
  
  const retryGame = () => {
    setShowResetPopup(true);
  };
  const confirmReset = () => {
  clickSoundRef.current?.play();
  if (canVibrateRef.current) navigator.vibrate(70);

  // ✅ Cancel the old animation loop
  cancelAnimationFrame(animationFrameRef.current);

  localStorage.setItem("rushScore", 0);

  // Reset all state
  setLevel(1);
  setScore(0);
  setKnivesRemaining(10);
  setGameOver(null);
  setShowResetPopup(false);

  // Reset all refs
  levelCompleteRef.current = false;
  hitRef.current = 0;
  hitKnivesRef.current = [];
  scoreRef.current = 0;
  currentAngleRef.current = 0;

  setupLevel();
  update(); // 👈 Restart loop fresh
};
  
  
  const exitGame = () => {
    setShowExitPopup(true);
  };
  const confirmExit = () => {
  clickSoundRef.current.play();
  if (canVibrateRef.current) navigator.vibrate(70);
  navigate("/"); // ✅ React routing instead of hard reload
};
  
  
  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");// 🔄 Rotate the board every frame
  currentAngleRef.current += (rotationSpeedRef.current * Math.PI) / 180;
  if (currentAngleRef.current >= 2 * Math.PI) {
    currentAngleRef.current -= 2 * Math.PI;
  }

  // ✅ Level complete logici
  if (
  knivesRemaining <= 0 &&
  hitKnivesRef.current.length > 0 &&
  knifeMovingRef.current === 0 &&
  hitRef.current === 0 &&
  !levelCompleteRef.current
) {
  levelCompleteRef.current = true;

  setTimeout(() => {
    const nextLevel = level + 1;

    setLevel(nextLevel);            // ✅ update level state
    setupLevel(nextLevel);         // ✅ setup with new level
    setScore(prev => prev + level * 2); // ✅ still use current level score

    levelCompleteRef.current = false;
  }, 1000);
  return;
}
  
  
    
    // Normal game update
  if (rectHeightRef.current < 0 || hitRef.current === 1) {
    rectHeightRef.current = canvas.height - 90;
    knifeMovingRef.current = 0;
    hitRef.current = 0;
  }
    

    
      
      const currentArc = {
        centerX: canvas.width / 2,
        centerY: 200,
        radius: 100,
        currentAngle: currentAngleRef.current
      };
      
      const currentKnife = {
        x: canvas.width / 2,
        y: rectHeightRef.current,
        width: 40,
        height: 80
      };
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw board
      ctx.save();
      ctx.translate(currentArc.centerX, currentArc.centerY);
      ctx.beginPath();
      ctx.arc(0, 0, currentArc.radius, 0, Math.PI * 2);
      ctx.closePath();
      
      
      
      try {
        switch (boardStyle) {
          case "wood": {
            ctx.save();
            if (wobbleFrameRef.current > 0) {
              boardWobbleRef.current = Math.sin(wobbleFrameRef.current * 0.3) * 0.05;
              wobbleFrameRef.current++;
              if (wobbleFrameRef.current > 15) {
                boardWobbleRef.current = 0;
                wobbleFrameRef.current = 0;
              }
            } else {
              boardWobbleRef.current = 0;
            }
            ctx.rotate(currentArc.currentAngle + boardWobbleRef.current);
            
            // Outer brown border
            ctx.fillStyle = "#8B4513";
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius + 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner yellow fill
            ctx.fillStyle = "#FFD966";
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Wavey concentric rings
            const waveCount = 3;
            const waveColor = "#D2B48C";
            for (let j = 1; j <= waveCount; j++) {
              ctx.beginPath();
              for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.05) {
                const waveRadius =
                  (currentArc.radius * j) / (waveCount + 1) +
                  2 * Math.sin(a * 6 + j);
                const x = waveRadius * Math.cos(a);
                const y = waveRadius * Math.sin(a);
                if (a === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.strokeStyle = waveColor;
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }
            
            ctx.restore();
            
            // Outer glow
            const outerGrad = ctx.createRadialGradient(0, 0, currentArc.radius, 0, 0, currentArc.radius + 15);
            outerGrad.addColorStop(0, "rgba(255, 217, 102, 0.2)");
            outerGrad.addColorStop(1, "rgba(255, 217, 102, 0)");
            ctx.fillStyle = outerGrad;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius + 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner glow
            const innerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentArc.radius - 15);
            innerGrad.addColorStop(0, "rgba(255, 217, 102, 0)");
            innerGrad.addColorStop(1, "rgba(255, 217, 102, 0.3)");
            ctx.fillStyle = innerGrad;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius - 15, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          
          case "classic": {
            ctx.save();
            ctx.rotate(currentArc.currentAngle);
            
            // Outer deep navy rim
            ctx.fillStyle = "#003366";
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius + 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner radial gradient fill
            const classicGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, currentArc.radius);
            classicGrad.addColorStop(0, "#00b0fc");
            classicGrad.addColorStop(1, "#004080");
            ctx.fillStyle = classicGrad;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Rotating tick marks
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.lineWidth = 2;
            for (let i = 0; i < 12; i++) {
              const angle = (i / 12) * 2 * Math.PI;
              const inner = currentArc.radius * 0.7;
              const outer = currentArc.radius * 0.9;
              const x1 = inner * Math.cos(angle);
              const y1 = inner * Math.sin(angle);
              const x2 = outer * Math.cos(angle);
              const y2 = outer * Math.sin(angle);
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
            
            ctx.restore();
            
            // Inner glow
            const innerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, currentArc.radius - 15);
            innerGlow.addColorStop(0, "rgba(255,255,255,0)");
            innerGlow.addColorStop(1, "rgba(0,176,252,0.3)");
            ctx.fillStyle = innerGlow;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius - 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Outer glow
            const outerGlow = ctx.createRadialGradient(0, 0, currentArc.radius, 0, 0, currentArc.radius + 25);
            outerGlow.addColorStop(0, "rgba(0,176,252,0.3)");
            outerGlow.addColorStop(1, "rgba(0,176,252,0)");
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius + 25, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          
          case "neon": {
            ctx.save();
            ctx.rotate(currentArc.currentAngle);
            
            // Dark base
            ctx.fillStyle = "#0a0a1a";
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner glow gradient
            const neonCore = ctx.createRadialGradient(0, 0, 0, 0, 0, currentArc.radius);
            neonCore.addColorStop(0, "#00ffff");
            neonCore.addColorStop(1, "#003355");
            ctx.fillStyle = neonCore;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius * 0.85, 0, Math.PI * 2);
            ctx.fill();
            
            // Rotating neon rings
            const neonColors = ["#00ffff", "#ff00ff", "#00b0fc"];
            for (let i = 1; i <= 3; i++) {
              ctx.beginPath();
              const r = (currentArc.radius * i) / 4;
              ctx.strokeStyle = neonColors[i % neonColors.length];
              ctx.lineWidth = 1.5;
              ctx.shadowColor = ctx.strokeStyle;
              ctx.shadowBlur = 8;
              ctx.arc(0, 0, r, 0, Math.PI * 2);
              ctx.stroke();
            }
            
            // Dotted markers
            for (let i = 0; i < 12; i++) {
              const angle = (i / 12) * 2 * Math.PI;
              const r = currentArc.radius * 0.85;
              const x = r * Math.cos(angle);
              const y = r * Math.sin(angle);
              ctx.beginPath();
              ctx.fillStyle = "#00ffffaa";
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
            
            ctx.restore();
            
            // Outer glow
            const neonOuter = ctx.createRadialGradient(0, 0, currentArc.radius, 0, 0, currentArc.radius + 30);
            neonOuter.addColorStop(0, "rgba(0,255,255,0.3)");
            neonOuter.addColorStop(1, "rgba(0,255,255,0)");
            ctx.fillStyle = neonOuter;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius + 30, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          
          case "lava": {
            ctx.save();
            ctx.rotate(currentArc.currentAngle);
            
            // Base lava gradient
            const lavaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentArc.radius);
            lavaGrad.addColorStop(0, "#330000");
            lavaGrad.addColorStop(1, "#ff3300");
            ctx.fillStyle = lavaGrad;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Jagged glow cracks
            for (let i = 0; i < lavaCracks.length; i++) {
              const c = lavaCracks[i];
              const angle = c.angle + Math.sin(Date.now() * 0.002) * 0.05;
              const r = c.radius;
              const x = r * Math.cos(angle);
              const y = r * Math.sin(angle);
              
              ctx.beginPath();
              ctx.arc(x, y, c.width / 2, 0, Math.PI * 2);
              const flicker = 0.3 + Math.random() * 0.7;
              ctx.fillStyle = `rgba(255, 100, 0, ${flicker.toFixed(2)})`;
              ctx.fill();
            }
            
            ctx.restore();
            
            // Outer lava glow
            const outerGlow = ctx.createRadialGradient(0, 0, currentArc.radius - 10, 0, 0, currentArc.radius + 20);
            outerGlow.addColorStop(0, "rgba(255, 80, 0, 0.3)");
            outerGlow.addColorStop(1, "rgba(255, 80, 0, 0)");
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius + 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner fiery glow
            const innerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, currentArc.radius - 20);
            innerGlow.addColorStop(0, "rgba(255,100,0,0)");
            innerGlow.addColorStop(1, "rgba(255,100,0,0.25)");
            ctx.fillStyle = innerGlow;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius - 10, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          
          case "ice": {
            ctx.save();
            ctx.rotate(currentArc.currentAngle);
            
            // Radial icy gradient
            const iceGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, currentArc.radius);
            iceGrad.addColorStop(0, "#e0faff");
            iceGrad.addColorStop(1, "#1c3f4c");
            ctx.fillStyle = iceGrad;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Wave shimmer rings
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctx.lineWidth = 1.2;
            for (let r = currentArc.radius / 4; r < currentArc.radius; r += currentArc.radius / 4) {
              ctx.beginPath();
              for (let a = 0; a <= Math.PI * 2; a += 0.05) {
                const offset = 2 * Math.sin(a * 6 + r);
                const x = (r + offset) * Math.cos(a);
                const y = (r + offset) * Math.sin(a);
                if (a === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();
            }
            
            // Curved cracks
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = 1.4;
            for (let i = 0; i < 5; i++) {
              const start = Math.random() * 2 * Math.PI;
              const end = start + Math.random() * 0.7 + 0.3;
              const r = currentArc.radius * (0.4 + Math.random() * 0.3);
              ctx.beginPath();
              ctx.arc(0, 0, r, start, end);
              ctx.stroke();
            }
            
            // Ice particles
            for (let p of iceParticles) {
              const totalAngle = currentArc.currentAngle * p.speedFactor + p.angleOffset;
              const x = p.radiusOffset * Math.cos(totalAngle);
              const y = p.radiusOffset * Math.sin(totalAngle);
              ctx.font = `${p.size}px serif`;
              ctx.fillText("❄️", x - p.size / 2, y + p.size / 2);
            }
            
            ctx.restore();
            
            // Inner glow
            const frostInner = ctx.createRadialGradient(0, 0, 0, 0, 0, currentArc.radius - 20);
            frostInner.addColorStop(0, "rgba(255,255,255,0)");
            frostInner.addColorStop(1, "rgba(200,255,255,0.25)");
            ctx.fillStyle = frostInner;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius - 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Outer glow
            const frostOuter = ctx.createRadialGradient(0, 0, currentArc.radius, 0, 0, currentArc.radius + 25);
            frostOuter.addColorStop(0, "rgba(204,250,255,0.25)");
            frostOuter.addColorStop(1, "rgba(204,250,255,0)");
            ctx.fillStyle = frostOuter;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius + 25, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          
          case "metal": {
            ctx.save();
            ctx.rotate(currentArc.currentAngle);
            
            // Outer rim
            ctx.fillStyle = "#333";
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius + 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner brushed steel gradient
            const metalGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, currentArc.radius);
            metalGrad.addColorStop(0, "#bbb");
            metalGrad.addColorStop(1, "#555");
            ctx.fillStyle = metalGrad;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Brushed metal lines
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1;
            for (let i = 0; i < 100; i++) {
              const angle = (i / 100) * 2 * Math.PI;
              const x = currentArc.radius * Math.cos(angle);
              const y = currentArc.radius * Math.sin(angle);
              ctx.beginPath();
              ctx.moveTo(x * 0.2, y * 0.2);
              ctx.lineTo(x, y);
              ctx.stroke();
            }
            
            // Shine arc
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,255,255,0.3)";
            ctx.lineWidth = 3;
            ctx.arc(0, 0, currentArc.radius - 5, -Math.PI / 4, Math.PI / 6);
            ctx.stroke();
            
            ctx.restore();
            
            // Inner metallic glow
            const metalInner = ctx.createRadialGradient(0, 0, 0, 0, 0, currentArc.radius - 15);
            metalInner.addColorStop(0, "rgba(255,255,255,0)");
            metalInner.addColorStop(1, "rgba(180,180,180,0.2)");
            ctx.fillStyle = metalInner;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius - 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Outer glow
            const metalOuter = ctx.createRadialGradient(0, 0, currentArc.radius, 0, 0, currentArc.radius + 25);
            metalOuter.addColorStop(0, "rgba(180,180,180,0.2)");
            metalOuter.addColorStop(1, "rgba(180,180,180,0)");
            ctx.fillStyle = metalOuter;
            ctx.beginPath();
            ctx.arc(0, 0, currentArc.radius + 25, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          
          default: {
            const classicGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, currentArc.radius);
            classicGrad.addColorStop(0, "#00b0fc");
            classicGrad.addColorStop(1, "#003366");
            ctx.fillStyle = classicGrad;
          }
        }
        
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#444";
        ctx.stroke();
      } catch (e) {
        console.error("❌ Board style rendering failed:", e);
      }
      
      ctx.restore();
      
      // Draw hit knives
      for (let k of hitKnivesRef.current) {
        ctx.save();
        ctx.translate(currentArc.centerX, currentArc.centerY);
        ctx.rotate(k.angle);
        ctx.drawImage(knifeImageRef.current, -20, currentArc.radius - 10, 40, 80);
        ctx.restore();
        k.angle += (Math.PI / 180) * rotationSpeedRef.current;
        k.angle %= 2 * Math.PI;
      }
      
      // Draw moving knife
      if (knifeImageRef.current.complete && knivesRemaining > 0) {
    ctx.drawImage(knifeImageRef.current, canvas.width / 2 - 20, rectHeightRef.current, 40, 80);
  }
      
      // Rotate main arccurrentAngleRef.current += (Math.PI / 180) * rotationSpeedRef.current;
  currentAngleRef.current %= 2 * Math.PI;
  
  if (knifeMovingRef.current === 1) rectHeightRef.current -= 15;
  
  checkCollision(currentArc, currentKnife);
  animationFrameRef.current = requestAnimationFrame(update);
};
  {saving && (
  <div className="score-popup">
    <h3>Saving your score...</h3>
  </div>
)}

{saved && (
  <div className="score-popup">
    <h3>✅ Score Saved Successfully!</h3>
  </div>
)}    
  
  return (
    <div>
      <div className="game-header">
        <h1>Rush Mode</h1>
        <div className="info">
          <span id="Level">Level: {level}</span>
          <span id="Knifes_rem">Knives: {Math.max(knivesRemaining - 1, 0)}</span>
          <span id="Score">Score: {score}</span>
        </div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width="500" 
        height="700" 
        onClick={changeStatus}
      ></canvas>
      
      {/* Reset & Exit Buttons */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        display: 'flex', 
        gap: '20px', 
        zIndex: 10 
      }}>
        <button onClick={retryGame} className="button blue">🔄 Reset</button>
        <button onClick={exitGame} className="button red">🚪 Exit</button>
      </div>
      
      {/* Game Over Popup */}
      {gameOver && (
        <div className="popup">
          <div className="popup-content">
            <h2 id="popup-title">{gameOver.title}</h2>
            <p id="popup-message">{gameOver.message}

<button
  onClick={() => {
    clickSoundRef.current?.play();
    if (canVibrateRef.current) navigator.vibrate(70);

    // ✅ Directly navigate to Rush Score page
    navigate("/score", { state: { score: scoreRef.current } });
  }}
>
  Check Score
</button>


  </p>
            <div className="popup-buttons"><button
  onClick={() => {
    clickSoundRef.current?.play();
    if (canVibrateRef.current) navigator.vibrate(70);

    localStorage.setItem("rushScore", 0);
cancelAnimationFrame(animationFrameRef.current);
    // ✅ Reset game state manually
    setLevel(1);
    setScore(0);
    setKnivesRemaining(10);
    setGameOver(null);
    setShowResetPopup(false);
    setShowExitPopup(false);

    levelCompleteRef.current = false;
    hitRef.current = 0;
    hitKnivesRef.current = [];
    scoreRef.current = 0;
    currentAngleRef.current = 0;

    setupLevel();  // 🎯 Redraw board
    update();      // ▶️ Restart animation loop
  }}
  className="yes-btn"
>
  Retry
</button>
  

   

  <button
    onClick={() => {
      clickSoundRef.current.play();
      if (canVibrateRef.current) navigator.vibrate(70);
      navigate("/"); // 👈 React way of going to Home
    }}
    className="no-btn"
  >
    Home
  </button>
</div>
          </div>
        </div>
      )}
      
      {/* Reset Confirmation Popup */}
      {showResetPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Reset Game?</h2>
            <p>Your progress will be lost. Are you sure?</p>
            <div className="popup-buttons">
              <button onClick={confirmReset} className="yes-btn">Yes</button>
              <button onClick={() => setShowResetPopup(false)} className="no-btn">No</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Exit Confirmation Popup */}
      {showExitPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Exit Game?</h2>
            <p>Do you really want to exit to home screen?</p>
            <div className="popup-buttons">
              <button onClick={confirmExit} className="yes-btn">Yes</button>
              <button onClick={() => setShowExitPopup(false)} className="no-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RushMode;