// ✅ LEVEL MODE GAME CANVAS — FIXED VERSION WITH ROTATION, IMAGE FALLBACK, AND SAFER COLLISION


import React, { useEffect, useRef, useState } from 'react';

const GameCanvas = ({ levelData, onLevelComplete, onGameOver, updateKnivesRemaining }) => { const canvasRef = useRef(null); const animationRef = useRef(null); const [imagesLoaded, setImagesLoaded] = useState(false);

const knifeImage = useRef(new Image()); const appleImage = useRef(new Image());

const gameState = useRef({ knifeMoving: false, rectHeight: 610, currentAngle: 0, hitKnives: [], apples: [], knivesRemaining: 0, }).current;

useEffect(() => { knifeImage.current.src = process.env.PUBLIC_URL + "/knife.png"; appleImage.current.src = process.env.PUBLIC_URL + "/apple.png";

let loaded = 0;
const handleLoad = () => {
  loaded += 1;
  if (loaded === 2) setImagesLoaded(true);
};

knifeImage.current.onload = handleLoad;
appleImage.current.onload = handleLoad;

return () => {
  knifeImage.current.onload = null;
  appleImage.current.onload = null;
};

}, []);

const handleInteraction = () => { if (!gameState.knifeMoving && gameState.knivesRemaining > 0) { gameState.knifeMoving = true; } };

useEffect(() => { if (!imagesLoaded) return;

const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;

gameState.rectHeight = canvas.height - 90;
gameState.knivesRemaining = levelData.knives;
updateKnivesRemaining(levelData.knives);
gameState.hitKnives = [];

// Setup apples
const appleCount = levelData.apples;
const angleGap = (2 * Math.PI) / appleCount;
gameState.apples = Array.from({ length: appleCount }, (_, i) => ({
  angle: i * angleGap,
  active: true,
}));

const checkCollision = (angle) => {
  for (let k of gameState.hitKnives) {
    const diff = Math.abs(angle - k.angle);
    if (Math.min(diff, 2 * Math.PI - diff) < 0.25) return 'knife';
  }

  for (let a of gameState.apples) {
    if (!a.active) continue;
    const diff = Math.abs(angle - a.angle);
    if (Math.min(diff, 2 * Math.PI - diff) < 0.3) {
      a.active = false;
      return 'apple';
    }
  }

  return null;
};

const update = () => {
  const centerX = 250;
  const centerY = 200;
  const radius = 100;
  const knifeY = gameState.rectHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw board
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#68a";
  ctx.fill();

  // Rotate objects
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(gameState.currentAngle);

  // Apples
  gameState.apples.forEach((a) => {
    if (!a.active) return;
    const x = Math.sin(a.angle) * radius;
    const y = -Math.cos(a.angle) * radius;
    if (imagesLoaded) {
      ctx.drawImage(appleImage.current, x - 15, y - 15, 30, 30);
    } else {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Stuck knives
  gameState.hitKnives.forEach((k) => {
    const x = Math.sin(k.angle) * (radius + 10);
    const y = -Math.cos(k.angle) * (radius + 10);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(k.angle);
    if (imagesLoaded) {
      ctx.drawImage(knifeImage.current, -20, -80, 40, 80);
    } else {
      ctx.fillStyle = "black";
      ctx.fillRect(-2, -40, 4, 40);
    }
    ctx.restore();
  });

  ctx.restore();

  // Draw moving knife
  if (imagesLoaded) {
    ctx.drawImage(knifeImage.current, centerX - 20, knifeY, 40, 80);
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(centerX - 2, knifeY, 4, 30);
  }

  // Rotation update
  if (levelData.rotationSpeed > 0) {
    gameState.currentAngle += levelData.rotationSpeed;
    gameState.currentAngle %= 2 * Math.PI;
  }

  if (gameState.knifeMoving) {
    gameState.rectHeight -= 15;

    if (gameState.rectHeight <= centerY + radius - 30) {
      const angleNow = gameState.currentAngle % (2 * Math.PI);
      const result = checkCollision(angleNow);

      if (result === 'knife') {
        onGameOver();
        return;
      }

      if (result !== 'apple') {
        gameState.hitKnives.push({ angle: angleNow });
      }

      gameState.knivesRemaining--;
      updateKnivesRemaining(gameState.knivesRemaining);
      gameState.knifeMoving = false;
      gameState.rectHeight = canvas.height - 90;

      const allApplesGone = gameState.apples.every(a => !a.active);

      if (allApplesGone) {
        onLevelComplete();
        return;
      }

      if (gameState.knivesRemaining === 0 && !allApplesGone) {
        onGameOver();
        return;
      }
    }
  }

  animationRef.current = requestAnimationFrame(update);
};

animationRef.current = requestAnimationFrame(update);

canvas.addEventListener("click", handleInteraction);
canvas.addEventListener("touchstart", handleInteraction);

return () => {
  cancelAnimationFrame(animationRef.current);
  canvas.removeEventListener("click", handleInteraction);
  canvas.removeEventListener("touchstart", handleInteraction);
};

}, [imagesLoaded, levelData, onGameOver, onLevelComplete, updateKnivesRemaining]);

return ( <canvas
ref={canvasRef}
className="game-canvas"
onClick={handleInteraction}
onTouchStart={handleInteraction}
/> ); };

export default GameCanvas;

