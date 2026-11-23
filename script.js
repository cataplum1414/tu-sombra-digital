const opening = document.querySelector('.opening');
const story = document.querySelector('.story');
const reveal = document.querySelector('.reveal');
const sceneArt = document.querySelector('#scene-art');
const sceneKicker = document.querySelector('#scene-kicker');
const sceneTitle = document.querySelector('#story-title');
const sceneBody = document.querySelector('#scene-body');
const choices = document.querySelector('#choices');
const continueButton = document.querySelector('#continue-story');
const continueLabel = document.querySelector('#continue-label');
const progressNumber = document.querySelector('#progress-number');
const progressLine = document.querySelector('#progress-line');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = reduceMotion ? 'auto' : 'smooth';

let chosenPath = '';
let currentScene = 1;

const scenes = {
  2: {
    kicker: 'PISTA 02 · EL MAPA',
    title: 'La hora se une<br><em>al lugar.</em>',
    share: 'La ubicación se cruza con la hora. El punto rojo avanza por el mapa y empieza a dibujar una rutina.',
    review: 'Quitaste una pista. El mapa pierde precisión. La intimidad no debería depender de que vivas escondiéndote.',
    next: 'Seguir la última pista'
  },
  3: {
    kicker: 'PISTA 03 · EL LÍMITE',
    title: 'El rastro llega<br><em>a tu puerta.</em>',
    share: 'En este caso ficticio, alguien reconstruye tu rutina y se acerca a tu hogar. Esa invasión de la vida privada es grave: nadie tiene derecho a cruzar ese límite arbitrariamente.',
    review: 'En este caso ficticio, quitar la ubicación reduce una pista, pero no garantiza protección total. Si alguien invade tu vida privada, la responsabilidad es de quien cruza el límite.',
    next: 'Descubrir qué te protege'
  }
};

const clueText = {
  time: 'La hora exacta convierte una foto aislada en parte de una rutina.',
  place: 'La ubicación aproximada indica dónde empieza el rastro.',
  background: 'El fondo puede revelar un portal, una calle o un lugar que no querías compartir.'
};
const cluesFound = new Set();
const cluePanel = document.querySelector('#clue-panel');

function announce(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(`story:${name}`, { detail }));
}

function updateProgress(number) {
  progressNumber.textContent = `0${number} / 03`;
  progressLine.style.setProperty('--progress', `${number * 33.333}%`);
}

function setLocation(id) {
  const next = `#${id}`;
  if (window.location.hash !== next) window.history.pushState(null, '', next);
}

function goToStory() {
  if (!ambientOn) turnSoundOn();
  opening.hidden = true;
  story.hidden = false;
  story.classList.add('is-revealing');
  story.dataset.choice = '';
  currentScene = 1;
  sceneArt.dataset.scene = '1';
  updateProgress(1);
  setLocation('recorrido');
  announce('start');
  sceneTitle.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: scrollBehavior });
}

function showNextScene() {
  if (currentScene === 3) {
    story.hidden = true;
    reveal.hidden = false;
    setLocation('derecho');
    announce('reveal');
    document.querySelector('#reveal-title').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: scrollBehavior });
    return;
  }

  currentScene += 1;
  const details = scenes[currentScene];
  sceneKicker.textContent = details.kicker;
  sceneTitle.innerHTML = details.title;
  sceneBody.textContent = details[chosenPath];
  choices.hidden = true;
  continueButton.hidden = false;
  continueLabel.textContent = details.next;
  story.dataset.choice = chosenPath;
  sceneArt.dataset.scene = String(currentScene);
  story.classList.remove('is-revealing');
  void story.offsetWidth;
  story.classList.add('is-revealing');
  updateProgress(currentScene);
  announce('scene', { scene: currentScene, choice: chosenPath });
  sceneTitle.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function restart() {
  reveal.hidden = true;
  opening.hidden = false;
  choices.hidden = false;
  continueButton.hidden = true;
  sceneKicker.textContent = 'PISTA 01 · LA FOTO';
  sceneTitle.innerHTML = 'A las 20:41,<br><em>subes la foto.</em>';
  sceneBody.textContent = 'El caso es ficticio. La imagen muestra una hora, una calle y una ventana encendida. ¿Qué harías antes de compartirla?';
  choices.querySelectorAll('.choice').forEach((button) => button.setAttribute('aria-pressed', 'false'));
  document.querySelectorAll('.clue-hotspot').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  cluesFound.clear();
  cluePanel.hidden = true;
  document.querySelector('.portrait').classList.remove('has-open-clue');
  chosenPath = '';
  currentScene = 1;
  story.dataset.choice = '';
  sceneArt.dataset.scene = '1';
  story.classList.remove('is-revealing');
  history.replaceState(null, '', '#inicio');
  announce('reset');
  window.scrollTo({ top: 0, behavior: scrollBehavior });
  document.querySelector('#opening-title').focus({ preventScroll: true });
}

document.querySelector('#start-story').addEventListener('click', goToStory);
document.querySelectorAll('.clue-hotspot').forEach((button) => {
  button.addEventListener('click', () => {
    const clue = button.dataset.clue;
    cluesFound.add(clue);
    document.querySelectorAll('.clue-hotspot').forEach((item) => item.setAttribute('aria-expanded', String(item === button)));
    cluePanel.textContent = cluesFound.size === 3
      ? `${clueText[clue]} Ya viste las tres pistas: inicia la historia para descubrir cómo se conectan.`
      : clueText[clue];
    cluePanel.hidden = false;
    document.querySelector('.portrait').classList.add('has-open-clue');
    announce('clue', { clue, count: cluesFound.size });
    navigator.vibrate?.(14);
  });
});

document.querySelectorAll('.choice').forEach((button) => {
  button.addEventListener('click', () => {
    chosenPath = button.dataset.choice;
    choices.querySelectorAll('.choice').forEach((choice) => choice.setAttribute('aria-pressed', String(choice === button)));
    continueButton.hidden = false;
    continueLabel.textContent = 'Ver qué cambia';
    story.dataset.choice = chosenPath;
    announce('choice', { choice: chosenPath });
    navigator.vibrate?.(20);
  });
});

continueButton.addEventListener('click', showNextScene);
document.querySelector('#restart-story').addEventListener('click', restart);

// Start the licensed track directly in the tap handler. This keeps the browser's
// user-gesture permission attached to playback on iOS and Android.
const soundToggle = document.querySelector('#sound-toggle');
const heroSoundToggle = document.querySelector('#sound-toggle-hero');
const soundLabel = document.querySelector('#sound-label');
const soundState = document.querySelector('#sound-state');
const heroSoundLabel = document.querySelector('#hero-sound-label');
const heroSoundState = document.querySelector('#hero-sound-state');
const soundHint = document.querySelector('.sound-prompt__hint');
const licensedAmbience = new Audio('assets/audio/ambiente-cavernas.ogg');
licensedAmbience.loop = true;
licensedAmbience.preload = 'none';
licensedAmbience.volume = 0.72;
let ambientOn = false;
let audioContext = null;
let soundMaster = null;
let fallbackVoices = [];
let activeAudioMode = 'none';
let audioPending = false;
let audioRequest = 0;

function updateSoundControls({ active, pending = false, mode = 'none' }) {
  ambientOn = active;
  audioPending = pending;
  activeAudioMode = mode;
  const label = pending ? 'Cargando ambiente' : active ? 'Apagar ambiente' : 'Activar ambiente';
  const heroLabel = pending ? 'Cargando ambiente' : active ? 'Apagar ambiente' : 'Escuchar con ambiente';
  const state = pending ? '…' : active ? 'ON' : 'OFF';
  soundLabel.textContent = label;
  soundState.textContent = state;
  heroSoundLabel.textContent = heroLabel;
  heroSoundState.textContent = state;
  soundToggle.setAttribute('aria-label', active ? 'Apagar ambiente sonoro' : 'Activar ambiente sonoro');
  heroSoundToggle.setAttribute('aria-label', active ? 'Apagar ambiente sonoro' : 'Activar ambiente sonoro');
  soundToggle.setAttribute('aria-pressed', String(active));
  heroSoundToggle.setAttribute('aria-pressed', String(active));
  opening.classList.toggle('is-audio-on', active);
}

function createFallbackAmbience() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;
  audioContext = audioContext || new AudioContextClass();
  soundMaster = audioContext.createGain();
  soundMaster.gain.value = 0.0001;
  soundMaster.connect(audioContext.destination);

  [[110, 'sine', 0.18], [164.81, 'triangle', 0.065], [220, 'sine', 0.035], [329.63, 'sine', 0.018]].forEach(([frequency, type, level]) => {
    const oscillator = audioContext.createOscillator();
    const voice = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = Math.random() * 7 - 3.5;
    voice.gain.value = level;
    oscillator.connect(voice);
    voice.connect(soundMaster);
    oscillator.start();
    fallbackVoices.push(oscillator);
  });

  const length = audioContext.sampleRate * 3;
  const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) samples[i] = (Math.random() * 2 - 1) * 0.35;
  const noise = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const noiseGain = audioContext.createGain();
  noise.buffer = buffer;
  noise.loop = true;
  filter.type = 'bandpass';
  filter.frequency.value = 880;
  filter.Q.value = 0.45;
  noiseGain.gain.value = 0.12;
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(soundMaster);
  noise.start();
  fallbackVoices.push(noise);
  return true;
}

function startSynthFallback() {
  try {
    if (!createFallbackAmbience()) throw new Error('No hay API de audio disponible.');
    return audioContext.resume().then(() => {
      soundMaster.gain.cancelScheduledValues(audioContext.currentTime);
      soundMaster.gain.setTargetAtTime(0.42, audioContext.currentTime, 0.8);
      updateSoundControls({ active: true, mode: 'synthesized-fallback' });
      soundHint.textContent = 'Ambiente activo · puedes apagarlo arriba cuando quieras.';
      announce('audio', { active: true, mode: 'synthesized-fallback' });
    });
  } catch {
    return Promise.reject(new Error('Audio no disponible'));
  }
}

function turnSoundOn() {
  if (ambientOn || audioPending) return;
  const request = ++audioRequest;
  updateSoundControls({ active: false, pending: true });

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (AudioContextClass) {
    try {
      audioContext = audioContext || new AudioContextClass();
      // Unlock Web Audio while the trusted tap is still active. This is also the
      // reliable fallback when a mobile browser cannot decode the OGG soundtrack.
      audioContext.resume().catch(() => {});
    } catch {}
  }

  // Call play() before awaiting anything; mobile Safari requires the call to stay
  // inside the original tap/click. A failed codec or network request gets a synth bed.
  const playback = licensedAmbience.play();
  if (!playback || typeof playback.then !== 'function') {
    updateSoundControls({ active: true, mode: 'licensed-track' });
    soundHint.textContent = 'Ambiente activo · puedes apagarlo arriba cuando quieras.';
    announce('audio', { active: true, mode: 'licensed-track' });
    return;
  }
  playback.then(() => {
    if (request !== audioRequest) return;
    updateSoundControls({ active: true, mode: 'licensed-track' });
    soundHint.textContent = 'Ambiente activo · puedes apagarlo arriba cuando quieras.';
    announce('audio', { active: true, mode: 'licensed-track' });
  }).catch(() => {
    if (request !== audioRequest) return;
    licensedAmbience.pause();
    startSynthFallback().catch(() => {
      updateSoundControls({ active: false });
      soundState.textContent = heroSoundState.textContent = 'ERROR';
      soundHint.textContent = 'El navegador bloqueó el audio. Toca de nuevo para reintentar; puedes continuar sin sonido.';
    });
  });
}

function turnSoundOff() {
  audioRequest += 1;
  licensedAmbience.pause();
  licensedAmbience.currentTime = 0;
  if (audioContext && soundMaster) {
    soundMaster.gain.cancelScheduledValues(audioContext.currentTime);
    soundMaster.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.18);
    window.setTimeout(() => {
      if (!ambientOn) {
        fallbackVoices.forEach((voice) => { try { voice.stop(); } catch {} });
        fallbackVoices = [];
        audioContext.suspend();
      }
    }, 900);
  }
  updateSoundControls({ active: false });
  soundHint.textContent = 'El sonido es opcional. Actívalo cuando quieras desde aquí o desde el control superior.';
  announce('audio', { active: false });
}

soundToggle.addEventListener('click', () => {
  if (ambientOn || audioPending) turnSoundOff();
  else turnSoundOn();
});
heroSoundToggle.addEventListener('click', () => {
  if (ambientOn || audioPending) turnSoundOff();
  else turnSoundOn();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && ambientOn) {
    if (activeAudioMode === 'licensed-track') licensedAmbience.pause();
    if (activeAudioMode === 'synthesized-fallback') audioContext?.suspend();
  } else if (!document.hidden && ambientOn) {
    if (activeAudioMode === 'licensed-track' && licensedAmbience.paused) licensedAmbience.play().catch(() => turnSoundOff());
    if (activeAudioMode === 'synthesized-fallback') audioContext?.resume();
  }
});
