// GameScene.js — with DOM-based UI + level logic
import { playThrowFeedback, playTouchFeedback, playClickFeedback } from '../utils/feedback';
import Phaser, { Scene } from 'phaser';
import options from '../constants/options';
import levels from '../constants/levels';

class GameScene extends Scene {
  constructor() {
    super('game');
  }
init(data) {
  const configLevel = this.sys.game.config.knifeLevel;
  this.currentLevel = configLevel !== undefined ? configLevel : (data.level || 0);
  this.levelConfig = levels[this.currentLevel];
  window.currentLevel = this.currentLevel + 1;

  // ✅ Save highest level played
  const maxLevel = parseInt(localStorage.getItem('knifeMaxLevel')) || 1;
  if (window.currentLevel > maxLevel) {
    localStorage.setItem('knifeMaxLevel', window.currentLevel);
  }
}
  

  create() {
    this.canThrow = true;
    this.levelCompleted = false;

    const { width, height } = this.sys.game.config;
    const { knives, apples } = this.levelConfig;

    this.remainingKnives = knives;
    
// top-right corner
    this.remainingApples = apples;

    // 👇 Link to DOM counters
    this.knifeStatus = document.getElementById('knife-count');
    this.appleStatus = document.getElementById('apple-count');
    this.knifeStatus.textContent = this.remainingKnives;
    this.appleStatus.textContent = this.remainingApples;

    this.knifeGroup = this.add.group();
    this.appleGroup = this.add.group();
    this.appleAngles = [];

    this.knife = this.add.sprite(width / 2, (height / 5) * 4, 'knife');
    this.target = this.add.sprite(width / 2, 400, 'target');
    this.target.depth = 1;

    for (let i = 0; i < apples; i++) {
      let angle;
      const minGap = 50;
      do {
        angle = Phaser.Math.Between(0, 359);
      } while (this.appleAngles.some(a => Math.abs(a - angle) < minGap));

      this.appleAngles.push(angle);
      const radians = Phaser.Math.DegToRad(angle + 90);
      const x = this.target.x + (this.target.width / 2) * Math.cos(radians);
      const y = this.target.y + (this.target.width / 2) * Math.sin(radians);

      const apple = this.add.sprite(x, y, 'apple');
      apple.setScale(0.25);
      apple.setOrigin(0.5, 0.7);
      apple.relativeAngle = angle;
      this.appleGroup.add(apple);
    }

    this.input.on('pointerdown', this.throwKnife, this);
  }

  update() {
    if (this.levelCompleted) return;
    this.target.angle += options.rotationSpeed;

    const knives = this.knifeGroup.getChildren();
    for (let knife of knives) {
      knife.angle += options.rotationSpeed;
      const radians = Phaser.Math.DegToRad(knife.angle + 90);
      knife.x = this.target.x + (this.target.width / 2) * Math.cos(radians);
      knife.y = this.target.y + (this.target.width / 2) * Math.sin(radians);
    }

    const apples = this.appleGroup.getChildren();
    for (let apple of apples) {
      const currentAngle = (this.target.angle + apple.relativeAngle) % 360;
      const radians = Phaser.Math.DegToRad(currentAngle + 90);
      apple.x = this.target.x + (this.target.width / 2) * Math.cos(radians);
      apple.y = this.target.y + (this.target.width / 2) * Math.sin(radians);
      apple.currentImpactAngle = currentAngle;
    }
  }

  throwKnife() {
    if (!this.canThrow || this.levelCompleted) return;
    this.canThrow = false;
playThrowFeedback(); // 🔊 sound + vibration when thrown
    this.tweens.add({
      targets: [this.knife],
      y: this.target.y + this.target.width / 2,
      duration: options.throwSpeed,
      callbackScope: this,
      onComplete: this.onCompleteThrowKnife,
    });
  }

  onCompleteThrowKnife() {
    let legalHit = true;
    for (let knife of this.knifeGroup.getChildren()) {
      const isSameAngle = Math.abs(
        Phaser.Math.Angle.ShortestBetween(this.target.angle, knife.impactAngle)
      ) < options.minAngle;
      if (isSameAngle) {
        legalHit = false;
        break;
      }
    }

    if (legalHit) {
      const newKnife = this.add.sprite(this.knife.x, this.knife.y, 'knife');
      newKnife.impactAngle = this.target.angle;
      this.knifeGroup.add(newKnife);

      const { height } = this.sys.game.config;
      this.knife.y = (height / 5) * 4;

      this.remainingKnives--;
      this.knifeStatus.textContent = this.remainingKnives;

      const apples = this.appleGroup.getChildren();
      for (let i = 0; i < apples.length; i++) {
        const apple = apples[i];
        const knifeCircle = new Phaser.Geom.Circle(newKnife.x, newKnife.y, newKnife.displayWidth / 6);
        const appleCircle = new Phaser.Geom.Circle(apple.x, apple.y, 12);

        if (Phaser.Geom.Intersects.CircleToCircle(knifeCircle, appleCircle)) {
          playTouchFeedback(); // ✅ ye sound + vibration karega
          
          const { x, y } = apple;
apple.destroy();
this.remainingApples--;
this.appleStatus.textContent = this.remainingApples;

// Left Half
const left = this.add.image(x, y, 'apple').setOrigin(0.5).setScale(0.25);
const leftMask = this.make.graphics({ x: 0, y: 0, add: false });
leftMask.fillStyle(0xffffff);
leftMask.fillRect(x - 50, y - 50, 50, 100);
const leftMaskGeom = leftMask.createGeometryMask();
left.setMask(leftMaskGeom);

// Right Half
const right = this.add.image(x, y, 'apple').setOrigin(0.5).setScale(0.25);
const rightMask = this.make.graphics({ x: 0, y: 0, add: false });
rightMask.fillStyle(0xffffff);
rightMask.fillRect(x, y - 50, 50, 100);
const rightMaskGeom = rightMask.createGeometryMask();
right.setMask(rightMaskGeom);

// Animate both halves
this.tweens.add({
  targets: left,
  x: x - 40,
  y: y + 150,
  angle: -90,
  alpha: 0,
  duration: 800,
  ease: 'Cubic.easeIn',
  onComplete: () => {
    left.destroy();
    leftMask.destroy();
  }
});

this.tweens.add({
  targets: right,
  x: x + 40,
  y: y + 150,
  angle: 90,
  alpha: 0,
  duration: 800,
  ease: 'Cubic.easeIn',
  onComplete: () => {
    right.destroy();
    rightMask.destroy();
  }
});

// ✅ Now check if level completed
if (this.remainingApples === 0) {
  this.levelCompleted = true;
  this.time.delayedCall(1000, () => {
    this.showDomPopup(`🎉 Level ${this.currentLevel + 1} Complete!`, 'Next ▶', () => {
      this.scene.restart({ level: this.currentLevel + 1 });
    });
  });
} else {
  this.canThrow = true;
}



          return;
        }
      }

      if (this.remainingKnives === 0 && this.remainingApples > 0) {
        this.levelCompleted = true;
        this.time.delayedCall(500, () => {
          this.showDomPopup(`💥 Game Over`, 'Retry ⟳', () => {
            this.scene.restart({ level: this.currentLevel });
          });
        });
      } else {
        this.canThrow = true;
      }
    } else {
      this.levelCompleted = true;
      this.tweens.add({
        targets: [this.knife],
        y: this.sys.game.config.height + this.knife.height,
        rotation: 5,
        duration: options.throwSpeed * 4,
        callbackScope: this,
        onComplete: () => {
          this.showDomPopup(`💥 Game Over`, 'Retry ⟳', () => {
            this.scene.restart({ level: this.currentLevel });
          });
        },
      });
    }
  }

  showDomPopup(message, buttonText, callback) {
    const popup = document.getElementById('popup');
    const messageBox = document.getElementById('popup-message');
    const button = document.getElementById('popup-btn');

    messageBox.innerText = message;
    button.innerText = buttonText;

    popup.style.display = 'block';
button.onclick = () => {
  playClickFeedback(); // 🔊 popup button click
  popup.style.display = 'none';
  callback();
};
    
  }
}

export default GameScene;