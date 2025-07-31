(function () {
  let boardWobble = 0;
  let wobbleFrame = 0;


const canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 700;
const ctx = canvas.getContext("2d");

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

const knife = new Image();
knife.src = "knife.png";

const throwSound = new Audio("throw.wav");
const clickSound = new Audio("click.wav");
throwSound.volume = 0.5;
clickSound.volume = 0.5;

const canVibrate = "vibrate" in navigator;

let currentAngle = 0;
let rectHeight = canvas.height - 90;
let knifeMoving = 0;
let knifesRemaining = 10;
let hit = 0;
let level = 1; // Start from level 1
let score = 0;
let hitKnives = [];
let rotationSpeed = 1;
let knifeLoaded = false;

const DEBUG_MODE = false;
const boardStyle = localStorage.getItem("selectedBoard") || "classic";

knife.onload = () => {
  console.log("✅ Knife image loaded");
  console.log("🎨 Board Style:", boardStyle);
  knifeLoaded = true;
  setupLevel();
  update();
};

knife.onerror = () => {
  console.error("❌ Failed to load knife.png.");
};

function updateUI() {
  document.getElementById("Level").innerText = `Level: ${level}`;
  document.getElementById("Knifes_rem").innerText = `Knives: ${Math.max(knifesRemaining - 1, 0)}`;
  document.getElementById("Score").innerText = `Score: ${score}`;
}

function showPopup(title, message) {
  const popup = document.getElementById("popup");
  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-message").innerText = message;
  popup.classList.remove("hidden");
}

function retryGame() {
  document.getElementById("reset-popup").classList.remove("hidden");
}

function retryGme() {
  clickSound.play();
  if (canVibrate) navigator.vibrate(70);
  localStorage.setItem("rushScore", 0);
  window.location.reload();
}

function closeResetPopup() {
  document.getElementById("reset-popup").classList.add("hidden");
}

function confirmReset() {
  clickSound.play();
  if (canVibrate) navigator.vibrate(70);
  localStorage.setItem("rushScore", 0);
  window.location.reload();
}

function exitGame() {
  document.getElementById("exit-popup").classList.remove("hidden");
}

function closeExitPopup() {
  document.getElementById("exit-popup").classList.add("hidden");
}

function confirmExit() {
  clickSound.play();
  if (canVibrate) navigator.vibrate(70);
  window.location.href = "/";
}

function change_status() {
  if (knifeMoving === 0) {
    knifeMoving = 1;
    throwSound.currentTime = 0;
    throwSound.play();
    if (canVibrate) navigator.vibrate(100);
  }
}

function checkRectCollision(curArc) {
  if (DEBUG_MODE) return false;
  for (let k of hitKnives) {
    const diff = Math.abs(curArc.currentAngle - k.cangle);
    const safe = Math.min(diff, 2 * Math.PI - diff);
    if (safe < 0.15) {
      showPopup("Game Over!", `Your Score: ${score}`);
      localStorage.setItem("rushScore", score);
      return true;
    }
  }
  return false;
}

function checkCollision(curArc, curKnife) {
  if (curKnife.y - curArc.centerY <= curArc.radius) {
    if (checkRectCollision(curArc)) return false;
    hit = 1;
    wobbleFrame = 1; // Start wobble on knife stick
    hitKnives.push({
      x: curKnife.x,
      y: curKnife.y,
      width: curKnife.width,
      height: curKnife.height,
      r: curArc.radius,
      angle: 0,
      cangle: curArc.currentAngle
    });
    wobbleFrame = 1; // trigger wobble
    knifesRemaining--;
    score++;
    updateUI();
    return true;
  }
  return false;
}

function setupLevel() {
  hitKnives = [];
  currentAngle = 0;

  // ⏩ Speed increases by 15% every level
  rotationSpeed = 1 * Math.pow(1.15, level - 1);

  // 🗡️ Knife count logic
  if (level <= 3) {
    knifesRemaining = 10;
  } else if (level <= 6) {
    knifesRemaining = 11;
  } else if (level <= 10) {
    knifesRemaining = 12;
  } else {
    knifesRemaining = 9 + Math.floor(Math.random() * 5); // 9 to 13
  }

  updateUI();
}

function update() {
  if (!knifeLoaded) {
    requestAnimationFrame(update);
    return;
  }

  if (knifesRemaining > 0) {
    if (rectHeight < 0 || hit === 1) {
      rectHeight = canvas.height - 90;
      knifeMoving = 0;
      hit = 0;
    }

    const currentArc = {
      centerX: canvas.width / 2,
      centerY: 200,
      radius: 100,
      currentAngle: currentAngle
    };

    const currentKnife = {
      x: canvas.width / 2,
      y: rectHeight,
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
          if (wobbleFrame > 0) {
  boardWobble = Math.sin(wobbleFrame * 0.3) * 0.05; // max ±0.05 rad
  wobbleFrame++;
  if (wobbleFrame > 15) {
    boardWobble = 0;
    wobbleFrame = 0;
  }
} else {
  boardWobble = 0;
}
  ctx.rotate(currentArc.currentAngle + boardWobble);
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
        2 * Math.sin(a * 6 + j); // wave effect
      const x = waveRadius * Math.cos(a);
      const y = waveRadius * Math.sin(a);
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore(); // ⛔ Stop rotating after board drawing

  // 🌕 Outer glow (non-rotating so it's static on screen)
  const outerGrad = ctx.createRadialGradient(0, 0, currentArc.radius, 0, 0, currentArc.radius + 15);
  outerGrad.addColorStop(0, "rgba(255, 217, 102, 0.2)");
  outerGrad.addColorStop(1, "rgba(255, 217, 102, 0)");
  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius + 15, 0, Math.PI * 2);
  ctx.fill();

  // 🌕 Inner glow
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
  ctx.rotate(currentArc.currentAngle); // 🔁 Rotate everything inside

  // 🔵 Outer deep navy rim
  ctx.fillStyle = "#003366";
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius + 10, 0, Math.PI * 2);
  ctx.fill();

  // 🔷 Inner radial gradient fill (Pi-like)
  const classicGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, currentArc.radius);
  classicGrad.addColorStop(0, "#00b0fc");
  classicGrad.addColorStop(1, "#004080");
  ctx.fillStyle = classicGrad;
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius, 0, Math.PI * 2);
  ctx.fill();

  // ⏱️ Rotating tick marks
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

  ctx.restore(); // 🔓 Stop rotating

  // ✨ Inner glow
  const innerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, currentArc.radius - 15);
  innerGlow.addColorStop(0, "rgba(255,255,255,0)");
  innerGlow.addColorStop(1, "rgba(0,176,252,0.3)");
  ctx.fillStyle = innerGlow;
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius - 10, 0, Math.PI * 2);
  ctx.fill();

  // 🌌 Outer blue glow
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
  ctx.rotate(currentArc.currentAngle); // full rotation 🔄

  // ⚫ Dark base
  ctx.fillStyle = "#0a0a1a"; // very dark blue/black
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius, 0, Math.PI * 2);
  ctx.fill();

  // 🔵 Inner glow gradient (electric cyan)
  const neonCore = ctx.createRadialGradient(0, 0, 0, 0, 0, currentArc.radius);
  neonCore.addColorStop(0, "#00ffff");
  neonCore.addColorStop(1, "#003355");
  ctx.fillStyle = neonCore;
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius * 0.85, 0, Math.PI * 2);
  ctx.fill();

  // 🌀 Rotating neon rings
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

  // 🔘 Dotted markers for tech feel
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

  ctx.restore(); // end rotation

  // 💫 Outer glow
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
  ctx.rotate(currentArc.currentAngle); // 🔄 Rotate the whole board

  // 🔴 Base lava gradient (hot to dark)
  const lavaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentArc.radius);
  lavaGrad.addColorStop(0, "#330000");
  lavaGrad.addColorStop(1, "#ff3300");
  ctx.fillStyle = lavaGrad;
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius, 0, Math.PI * 2);
  ctx.fill();

  // 🔥 Jagged glow cracks
  for (let i = 0; i < lavaCracks.length; i++) {
    const c = lavaCracks[i];
    const angle = c.angle + Math.sin(Date.now() * 0.002) * 0.05; // flicker effect
    const r = c.radius;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, c.width / 2, 0, Math.PI * 2);
    const flicker = 0.3 + Math.random() * 0.7;
    ctx.fillStyle = `rgba(255, 100, 0, ${flicker.toFixed(2)})`;
    ctx.fill();
  }

  ctx.restore(); // 🚫 stop rotation

  // 🌋 Outer lava glow
  const outerGlow = ctx.createRadialGradient(0, 0, currentArc.radius - 10, 0, 0, currentArc.radius + 20);
  outerGlow.addColorStop(0, "rgba(255, 80, 0, 0.3)");
  outerGlow.addColorStop(1, "rgba(255, 80, 0, 0)");
  ctx.fillStyle = outerGlow;
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius + 20, 0, Math.PI * 2);
  ctx.fill();

  // 🌕 Inner fiery glow
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
  ctx.rotate(currentArc.currentAngle); // board rotation

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

  // ❄️ Ice particles (emoji)
  for (let p of iceParticles) {
    const totalAngle = currentArc.currentAngle * p.speedFactor + p.angleOffset;
    const x = p.radiusOffset * Math.cos(totalAngle);
    const y = p.radiusOffset * Math.sin(totalAngle);
    ctx.font = `${p.size}px serif`;
    ctx.fillText("❄️", x - p.size / 2, y + p.size / 2);
  }

  ctx.restore(); // board rotation ends here

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
  ctx.rotate(currentArc.currentAngle); // 🔄 Full rotation

  // 🧊 Outer rim (thick steel border)
  ctx.fillStyle = "#333";
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius + 10, 0, Math.PI * 2);
  ctx.fill();

  // ⚙️ Inner brushed steel gradient
  const metalGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, currentArc.radius);
  metalGrad.addColorStop(0, "#bbb");
  metalGrad.addColorStop(1, "#555");
  ctx.fillStyle = metalGrad;
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius, 0, Math.PI * 2);
  ctx.fill();

  // 🌀 Brushed metal lines
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

  // ✨ Shine arc
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 3;
  ctx.arc(0, 0, currentArc.radius - 5, -Math.PI / 4, Math.PI / 6);
  ctx.stroke();

  ctx.restore(); // 🔚 stop rotation

  // 🌟 Inner metallic glow
  const metalInner = ctx.createRadialGradient(0, 0, 0, 0, 0, currentArc.radius - 15);
  metalInner.addColorStop(0, "rgba(255,255,255,0)");
  metalInner.addColorStop(1, "rgba(180,180,180,0.2)");
  ctx.fillStyle = metalInner;
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius - 10, 0, Math.PI * 2);
  ctx.fill();

  // 🌌 Outer glow
  const metalOuter = ctx.createRadialGradient(0, 0, currentArc.radius, 0, 0, currentArc.radius + 25);
  metalOuter.addColorStop(0, "rgba(180,180,180,0.2)");
  metalOuter.addColorStop(1, "rgba(180,180,180,0)");
  ctx.fillStyle = metalOuter;
  ctx.beginPath();
  ctx.arc(0, 0, currentArc.radius + 25, 0, Math.PI * 2);
  ctx.fill();

  break;
}
        
        
     default:
          const classicGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, currentArc.radius);
          classicGrad.addColorStop(0, "#00b0fc");
          classicGrad.addColorStop(1, "#003366");
          ctx.fillStyle = classicGrad;
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
    for (let k of hitKnives) {
      ctx.save();
      ctx.translate(currentArc.centerX, currentArc.centerY);
      ctx.rotate(k.angle);
      ctx.drawImage(knife, -20, currentArc.radius - 10, 40, 80);
      ctx.restore();
      k.angle += (Math.PI / 180) * rotationSpeed;
      k.angle %= 2 * Math.PI;
    }

    // Draw moving knife
    ctx.drawImage(knife, canvas.width / 2 - 20, rectHeight, 40, 80);

    // Rotate main arc
    currentAngle += (Math.PI / 180) * rotationSpeed;
    currentAngle %= 2 * Math.PI;

    if (knifeMoving === 1) rectHeight -= 15;

    checkCollision(currentArc, currentKnife);
    updateUI();
    requestAnimationFrame(update);
  } else {
    score += level;
    level++;
    setupLevel();
    requestAnimationFrame(update);
  }
}



// At the end of the IIFE, expose only what you need:
  window.change_status = change_status;
  window.retryGame = retryGame;
  window.retryGme = retryGme;
  window.exitGame = exitGame;
  window.closeExitPopup = closeExitPopup;
  window.confirmExit = confirmExit;
  window.confirmReset = confirmReset;
  window.closeResetPopup = closeResetPopup;
})();