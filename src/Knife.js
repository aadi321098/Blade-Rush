import Phaser, { Game } from 'phaser';
import BootScene from './scenes/BootScene';
import LoadingScene from './scenes/LoadingScene';
import GameScene from './scenes/GameScene';
import './knife-ui.css'; // ✅ Include the CSS

let gameInstance = null;

export function mountKnifeGame(containerId = 'knife-container') {
  const existingCanvas = document.querySelector(`#${containerId} canvas`);
  if (existingCanvas) return; // prevent double mount

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Container with id '${containerId}' not found.`);
    return;
  }

  // Setup Phaser Game
  const config = {
    type: Phaser.AUTO,
    width: 850,
    height: 1334,
    backgroundColor: '#05424C',
    parent: containerId,
    scene: [BootScene, LoadingScene, GameScene],
  };

  gameInstance = new Game(config);
  addKnifeUI(containerId);
  bindEvents();
  resize(containerId);
}

function addKnifeUI(containerId) {
  const container = document.getElementById(containerId);

  // Status Box
  const statusBox = document.createElement('div');
  statusBox.id = 'status-box';
  statusBox.innerHTML = `
    <div class="status-item"><img src="/images/knife.png" /><span id="knife-count">0</span></div>
    <div class="status-item"><img src="/images/apple.png" /><span id="apple-count">0</span></div>
  `;
  container.appendChild(statusBox);

  // Popup
  const popup = document.createElement('div');
  popup.id = 'popup';
  popup.innerHTML = `
    <h2 id="popup-message">🎉 Level Complete!</h2>
    <button id="popup-btn">Next ▶</button>
  `;
  container.appendChild(popup);
}

function bindEvents() {
  window.addEventListener('resize', () => resize('knife-container'));
}

function resize(containerId) {
  const canvas = document.querySelector(`#${containerId} canvas`);
  if (!canvas) return;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowRatio = windowWidth / windowHeight;
  const gameRatio = gameInstance.config.width / gameInstance.config.height;

  if (windowRatio < gameRatio) {
    canvas.style.width = `${windowWidth}px`;
    canvas.style.height = `${windowWidth / gameRatio}px`;
  } else {
    canvas.style.width = `${windowHeight * gameRatio}px`;
    canvas.style.height = `${windowHeight}px`;
  }
}