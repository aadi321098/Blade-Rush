import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BoardShop.css";

function BoardShop() {
  const [selected, setSelected] = useState(localStorage.getItem("selectedBoard") || "classic");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const boards = [
    { id: "board1", name: "classic", draw: drawClassic },
    { id: "board2", name: "wood", draw: drawWood },
    { id: "board3", name: "neon", draw: drawNeon },
    { id: "board4", name: "lava", draw: drawLava },
    { id: "board5", name: "ice", draw: drawIce },
    { id: "board6", name: "metal", draw: drawMetal }
  ];

  useEffect(() => {
    boards.forEach((board) => {
      const canvas = document.getElementById(board.id);
      if (canvas) {
        const ctx = canvas.getContext("2d");
        board.draw(ctx);
      }
    });
  }, []);

  const saveTheme = () => {
    localStorage.setItem("selectedBoard", selected);
    setMessage(`✅ Theme '${selected}' saved!`);
    setTimeout(() => navigate("/shop"), 1000);
  };

  return (
    <div className="board-shop">
      <h1>Select Your Board</h1>
      <div className="board-container">
        {boards.map((board) => (
          <div
            key={board.name}
            className={`board-option ${selected === board.name ? "selected" : ""}`}
            onClick={() => setSelected(board.name)}
          >
            <canvas id={board.id} width="200" height="200"></canvas>
            <p>{board.name.charAt(0).toUpperCase() + board.name.slice(1)}</p>
          </div>
        ))}
      </div>

      <button className="save-btn" onClick={saveTheme}>
        💾 Save & Back
      </button>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default BoardShop;

// === Drawing Functions (same as before, simplified here for space) ===
function drawClassic(ctx) {
  const g = ctx.createRadialGradient(100, 100, 20, 100, 100, 80);
  g.addColorStop(0, "#00b0fc");
  g.addColorStop(1, "#003366");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(100, 100, 80, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#66ccff"; ctx.lineWidth = 5; ctx.stroke();
}
function drawWood(ctx) {
  ctx.fillStyle = "#8B4513"; ctx.beginPath(); ctx.arc(100, 100, 80, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#deb887"; ctx.lineWidth = 5; ctx.stroke();
}
function drawNeon(ctx) {
  ctx.fillStyle = "#0a0a1a"; ctx.beginPath(); ctx.arc(100, 100, 80, 0, Math.PI * 2); ctx.fill();
  const g = ctx.createRadialGradient(100, 100, 0, 100, 100, 80);
  g.addColorStop(0, "#0ff"); g.addColorStop(1, "#003355");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(100, 100, 65, 0, Math.PI * 2); ctx.fill();
}
function drawLava(ctx) {
  const g = ctx.createRadialGradient(100, 100, 10, 100, 100, 80);
  g.addColorStop(0, "#ff6600"); g.addColorStop(1, "#330000");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(100, 100, 80, 0, Math.PI * 2); ctx.fill();
}
function drawIce(ctx) {
  const g = ctx.createRadialGradient(100, 100, 5, 100, 100, 80);
  g.addColorStop(0, "#ccfaff"); g.addColorStop(1, "#003344");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(100, 100, 80, 0, Math.PI * 2); ctx.fill();
}
function drawMetal(ctx) {
  const g = ctx.createLinearGradient(0, 0, 200, 200);
  g.addColorStop(0, "#ccc"); g.addColorStop(1, "#555");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(100, 100, 80, 0, Math.PI * 2); ctx.fill();
}