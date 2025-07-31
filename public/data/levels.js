const levels = Array.from({ length: 50 }, (_, i) => {
  const level = i + 1;
  const baseSpeed = 0;
  const speedIncrease = 0.002;
  
  // Base configuration
  const config = {
    level,
    knives: Math.max(3, 8 - Math.floor(level / 10)),
    apples: level < 10 ? 2 : level < 20 ? 3 : 4,
    rotationSpeed: baseSpeed + (level * speedIncrease),
  };

  // Special levels
  if (level === 1) return { ...config, knives: 7, apples: 2, rotationSpeed: 0.02 };
  if (level === 5) return { ...config, knives: 10, apples: 3, rotationSpeed: 0.03 };
  if (level === 10) return { ...config, knives: 5, apples: 4, rotationSpeed: 0.04 };
  if (level === 20) return { ...config, knives: 6, apples: 5, rotationSpeed: 0.05 };
  if (level === 30) return { ...config, knives: 5, apples: 6, rotationSpeed: 0.06 };
  
  return config;
});

export default levels;