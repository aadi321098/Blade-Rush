import React, { useRef, useEffect, useState } from 'react';

const GameCanvas = ({ levelData, onLevelComplete, onGameOver }) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [knivesLeft, setKnivesLeft] = useState(levelData.knives);
  const [lives, setLives] = useState(3);
  const [isThrowing, setIsThrowing] = useState(false);
  const [knifeY, setKnifeY] = useState(650);

  const [apples, setApples] = useState(
    Array.from({ length: levelData.apples }, (_, i) => ({
      angle: (2 * Math.PI * i) / levelData.apples,
      hit: false,
      fallingY: null
    }))
  );

  const stuckKnives = useRef([]);
  const requestRef = useRef();
  const boardRadius = 100;
  const center = { x: 250, y: 350 };

  const playSound = (id) => {
    const audio = document.getElementById(id);
    if (audio) audio.play();
  };

  const vibrate = (duration = 100) => {
    if (navigator.vibrate) navigator.vibrate(duration);
  };

  const throwKnife = () => {
    if (isThrowing || knivesLeft <= 0) return;
    setIsThrowing(true);
  };

  const handleKnifeHit = () => {
    const angleNow = rotation % (2 * Math.PI);
    const collision = stuckKnives.current.some((angle) => Math.abs(angle - angleNow) < 0.15);

    if (collision) {
      playSound('hit-fail');
      vibrate(200);
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) onGameOver();
        return newLives;
      });
      return;
    }

    stuckKnives.current.push(angleNow);
    playSound('hit-success');
    vibrate(50);

    const updatedApples = apples.map((apple) => {
      if (apple.hit) return apple;
      const diff = Math.abs(angleNow - apple.angle);
      if (diff < 0.2) {
        return { ...apple, hit: true, fallingY: null };
      }
      return apple;
    });

    setApples(updatedApples);

    const remaining = updatedApples.filter((a) => !a.hit).length;
    if (remaining === 0 && knivesLeft > 1) onLevelComplete();

    setKnivesLeft((prev) => {
      const next = prev - 1;
      if (next === 0 && remaining === 0) onLevelComplete();
      else if (next === 0 && remaining > 0) onGameOver();
      return next;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 700;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(rotation);

      // Draw Board
      ctx.beginPath();
      ctx.arc(0, 0, boardRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#68a';
      ctx.fill();

      // Apples
      apples.forEach((apple, i) => {
        if (apple.hit && apple.fallingY === null) return;
        const angle = apple.angle;
        const x = Math.sin(angle) * boardRadius;
        const y = -Math.cos(angle) * boardRadius;

        if (apple.hit) {
          apples[i].fallingY = (apple.fallingY ?? y) + 5;
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(x, apples[i].fallingY, 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Stuck Knives
      stuckKnives.current.forEach((angle) => {
        const x = Math.sin(angle) * (boardRadius + 10);
        const y = -Math.cos(angle) * (boardRadius + 10);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = 'black';
        ctx.fillRect(-2, -10, 4, 20);
        ctx.restore();
      });

      ctx.restore();

      // Knife throw animation
      if (isThrowing) {
        ctx.fillStyle = 'black';
        ctx.fillRect(center.x - 2, knifeY, 4, 30);

        setKnifeY((prev) => {
          const next = prev - 20;
          if (next < center.y + boardRadius) {
            handleKnifeHit();
            setIsThrowing(false);
            return 650;
          }
          return next;
        });
      } else {
        // Idle knife
        ctx.fillStyle = 'black';
        ctx.fillRect(center.x - 2, 650, 4, 30);
      }

      requestRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(requestRef.current);
  }, [rotation, apples, isThrowing, knifeY]);

  useEffect(() => {
    const speed = levelData.rotationSpeed || 0.02;
    const rotate = () => {
      setRotation((prev) => prev + speed);
      requestRef.current = requestAnimationFrame(rotate);
    };
    rotate();
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 10 }}>
        <h3>Level {levelData.level}</h3>
        <p>
          Knives: {knivesLeft} | Apples: {apples.filter((a) => !a.hit).length} | Lives: ❤️ {lives}
        </p>
      </div>

      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setKnivesLeft((k) => k + 1)}>+1 Knife</button>
        <button onClick={() => (stuckKnives.current = [])}>Remove Stuck Knives</button>
      </div>

      <canvas
        ref={canvasRef}
        onClick={throwKnife}
        style={{ border: '2px solid #ccc', borderRadius: '10px' }}
      />

      <audio id="hit-success" src="/sounds/hit.mp3" preload="auto"></audio>
      <audio id="hit-fail" src="/sounds/fail.mp3" preload="auto"></audio>
    </div>
  );
};

export default GameCanvas;