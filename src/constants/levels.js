const levels = Array.from({ length: 100 }, (_, i) => {
  const level = i + 1;
  const baseSpeed = 0.015;
  const speedIncrease = 0.0015;

  let knives = 8;
  let apples = 4;

  if (level === 1) {
    knives = 8;
    apples = 4;
  } else if (level === 2) {
    knives = 7;
    apples = 4;
  } else if (level === 3) {
    knives = 6;
    apples = 4;
  } else if (level === 4) {
    knives = 8;
    apples = 5;
  } else if (level === 5) {
    knives = 7;
    apples = 5;
  } else if (level === 6) {
    knives = 6;
    apples = 4;
  } else if (level >= 7 && level <= 10) {
    knives = 8;
    apples = 6;
  } else if (level >= 11 && level <= 15) {
    knives = 7;
    apples = 5;
  } else if (level >= 16 && level <= 50) {
    knives = Math.floor(Math.random() * 5) + 8; // 8 to 12
    apples = Math.max(2, knives - 2);
  } else if (level > 50) {
    knives = Math.floor(Math.random() * 5) + 8; // 8 to 12
    apples = knives; // ✅ Same as knife count
  }

  return {
    level,
    knives,
    apples,
    rotationSpeed: baseSpeed + (level * speedIncrease),
  };
});

export default levels;