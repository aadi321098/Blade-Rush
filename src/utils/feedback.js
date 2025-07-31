let context, throwBuffer, touchBuffer, clickBuffer;
let settings = {
  soundOn: true,
  soundVolume: 1,
  vibrationOn: true,
  vibrationStrength: 50,
};

export async function initFeedback(settingsObj = {}) {
  context = new (window.AudioContext || window.webkitAudioContext)();

  settings = { ...settings, ...settingsObj };

  const sounds = await Promise.all([
    fetch('/sounds/throw.mp3').then(res => res.arrayBuffer()),
    fetch('/sounds/touch.mp3').then(res => res.arrayBuffer()),
    fetch('/sounds/click.mp3').then(res => res.arrayBuffer()),
  ]);

  [throwBuffer, touchBuffer, clickBuffer] = await Promise.all(
    sounds.map(buf => context.decodeAudioData(buf))
  );

  window._feedbackSettings = settings;
}

export function updateFeedbackSettings(update) {
  settings = { ...settings, ...update };
  window._feedbackSettings = settings;
}

function playSound(buffer) {
  if (!settings.soundOn || !buffer) return;
  const src = context.createBufferSource();
  const gain = context.createGain();

  src.buffer = buffer;
  gain.gain.value = settings.soundVolume;

  src.connect(gain);
  gain.connect(context.destination);
  src.start(0);
}

function vibrate() {
  if (settings.vibrationOn && navigator.vibrate) {
    navigator.vibrate(settings.vibrationStrength);
  }
}

// 🔊 Public functions
export function playThrowFeedback() {
  playSound(throwBuffer);
  vibrate();
}

export function playTouchFeedback() {
  playSound(touchBuffer);
  vibrate();
}

export function playClickFeedback() {
  playSound(clickBuffer);
  vibrate();
}