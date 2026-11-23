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
    share: 'La ubicación queda unida a la hora y al mensaje. Un punto se convierte en un mapa; el mapa empieza a dibujar una rutina.',
    review: 'Quitaste la ubicación y el trayecto no se cierra. Esa decisión cambia la historia. La intimidad no debería depender de que vivas escondiéndote.',
    next: 'Seguir la última pista'
  },
  3: {
    kicker: 'PISTA 03 · EL LÍMITE',
    title: 'Alguien conoce<br><em>tu rutina.</em>',
    share: 'En este caso ficticio, alguien cruza el límite: interfiere en tu vida privada y tus mensajes. Esa invasión es la razón por la que el derecho importa.',
    review: 'En este caso ficticio, alguien intenta cruzar el límite. Revisar una foto puede ayudar; no convierte en tu responsabilidad impedir toda invasión.',
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
  sceneTitle.innerHTML = 'Una foto parece simple.<br><em>Hasta que no lo es.</em>';
  sceneBody.textContent = 'El caso es ficticio. Una foto puede revelar más por lo que aparece alrededor que por lo que querías enseñar. ¿Qué harías antes de publicarla?';
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

// Real CC0 ambience is loaded only after an explicit tap. A brighter Web Audio layer
// is kept as a fallback for browsers that cannot decode Ogg Vorbis.
const soundToggle = document.querySelector('#sound-toggle');
const heroSoundToggle = document.querySelector('#sound-toggle-hero');
const soundLabel = document.querySelector('#sound-label');
const soundState = document.querySelector('#sound-state');
const heroSoundLabel = document.querySelector('#hero-sound-label');
const heroSoundState = document.querySelector('#hero-sound-state');
const soundHint = document.querySelector('.sound-prompt__hint');
const licensedAmbience = window.Howl ? new window.Howl({
  src: ['assets/audio/ambiente-cavernas.ogg'],
  format: ['ogg'],
  volume: 0.72,
  loop: true,
  preload: false,
  html5: true
}) : null;
let ambientOn = false;
let audioContext = null;
let soundMaster = null;
let fallbackVoices = [];
let activeAudioMode = 'none';
let audioPending = false;

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

async function turnSoundOn() {
  if (ambientOn || audioPending) return;
  audioPending = true;
  soundState.textContent = '…';
  soundLabel.textContent = 'Cargando audio';
  try {
    if (!licensedAmbience) throw new Error('Howler no está disponible.');
    const started = new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error('El audio tardó demasiado en cargar.')), 9000);
      licensedAmbience.once('play', () => { clearTimeout(timeout); resolve(); });
      licensedAmbience.once('playerror', (_id, error) => { clearTimeout(timeout); reject(error); });
      licensedAmbience.once('loaderror', (_id, error) => { clearTimeout(timeout); reject(error); });
    });
    licensedAmbience.play();
    await started;
    activeAudioMode = 'licensed-track';
    ambientOn = true;
    audioPending = false;
    soundLabel.textContent = 'Apagar ambiente';
    soundState.textContent = 'ON';
    soundToggle.setAttribute('aria-label', 'Apagar ambiente sonoro');
    soundToggle.setAttribute('aria-pressed', 'true');
    heroSoundLabel.textContent = 'Apagar ambiente';
    heroSoundState.textContent = 'ON';
    heroSoundToggle.setAttribute('aria-label', 'Apagar ambiente sonoro');
    heroSoundToggle.setAttribute('aria-pressed', 'true');
    soundHint.textContent = 'Ambiente activo · auriculares opcionales · toca arriba para apagar.';
    opening.classList.add('is-audio-on');
    announce('audio', { active: true, mode: 'licensed-track' });
    return;
  } catch (error) {
    licensedAmbience?.stop();
    try {
      if (!createFallbackAmbience()) throw new Error('No hay API de audio disponible.');
      await audioContext.resume();
    } catch (fallbackError) {
      soundLabel.textContent = 'Audio no disponible';
      soundState.textContent = 'ERROR';
      heroSoundLabel.textContent = 'Audio no disponible';
      heroSoundState.textContent = 'ERROR';
      audioPending = false;
      soundToggle.setAttribute('aria-label', 'Audio no disponible');
      heroSoundToggle.setAttribute('aria-label', 'Audio no disponible');
      soundHint.textContent = 'Este navegador no permite reproducir el ambiente. La historia sigue disponible.';
      return;
    }
    soundMaster.gain.setTargetAtTime(0.42, audioContext.currentTime, 0.8);
    activeAudioMode = 'synthesized-fallback';
    ambientOn = true;
    audioPending = false;
    soundLabel.textContent = 'Apagar ambiente';
    soundState.textContent = 'ON';
    soundToggle.setAttribute('aria-label', 'Apagar ambiente sonoro');
    soundToggle.setAttribute('aria-pressed', 'true');
    heroSoundLabel.textContent = 'Apagar ambiente';
    heroSoundState.textContent = 'ON';
    heroSoundToggle.setAttribute('aria-label', 'Apagar ambiente sonoro');
    heroSoundToggle.setAttribute('aria-pressed', 'true');
    soundHint.textContent = 'Ambiente sintetizado activo · auriculares opcionales · toca arriba para apagar.';
    opening.classList.add('is-audio-on');
    announce('audio', { active: true, mode: 'synthesized-fallback' });
  }
}

async function turnSoundOff() {
  if (activeAudioMode === 'licensed-track') {
    licensedAmbience?.stop();
  }
  if (audioContext && soundMaster) {
    soundMaster.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.18);
    window.setTimeout(() => {
      if (!ambientOn) {
        fallbackVoices.forEach((voice) => { try { voice.stop(); } catch {} });
        fallbackVoices = [];
        audioContext.suspend();
      }
    }, 900);
  }
  ambientOn = false;
  audioPending = false;
  activeAudioMode = 'none';
  soundLabel.textContent = 'Activar ambiente';
  soundState.textContent = 'OFF';
  soundToggle.setAttribute('aria-label', 'Activar ambiente sonoro');
  soundToggle.setAttribute('aria-pressed', 'false');
  heroSoundLabel.textContent = 'Escuchar con ambiente';
  heroSoundState.textContent = 'OFF';
  heroSoundToggle.setAttribute('aria-label', 'Activar ambiente sonoro');
  heroSoundToggle.setAttribute('aria-pressed', 'false');
  soundHint.textContent = 'Pulsa «Activar ambiente» arriba para escuchar la banda sonora. Es opcional y puedes apagarla.';
  opening.classList.remove('is-audio-on');
  announce('audio', { active: false });
}

soundToggle.addEventListener('click', () => {
  if (ambientOn) turnSoundOff();
  else turnSoundOn();
});
heroSoundToggle.addEventListener('click', () => {
  if (ambientOn) turnSoundOff();
  else turnSoundOn();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && ambientOn) {
    if (activeAudioMode === 'licensed-track') licensedAmbience?.pause();
    if (activeAudioMode === 'synthesized-fallback') audioContext?.suspend();
  } else if (!document.hidden && ambientOn) {
    if (activeAudioMode === 'licensed-track' && licensedAmbience?.state() === 'loaded' && !licensedAmbience.playing()) licensedAmbience.play();
    if (activeAudioMode === 'synthesized-fallback') audioContext?.resume();
  }
});
