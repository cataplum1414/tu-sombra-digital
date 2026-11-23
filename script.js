const opening = document.querySelector('.opening');
const story = document.querySelector('.story');
const reveal = document.querySelector('.reveal');
const scene = document.querySelector('#scene');
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
    kicker: 'PISTA 02 ? EL MAPA',
    title: 'La hora se une<br><em>al lugar.</em>',
    share: 'La ubicación queda unida a la hora y al mensaje. Un punto se convierte en un mapa; el mapa empieza a dibujar una rutina.',
    review: 'Quitaste la ubicación y el trayecto no se cierra. Esa decisión cambia la historia. La intimidad no debería depender de que vivas escondiéndote.',
    next: 'Seguir la última pista'
  },
  3: {
    kicker: 'PISTA 03 ? EL LÍMITE',
    title: 'Alguien conoce<br><em>tu rutina.</em>',
    share: 'En este caso ficticio, alguien cruza el límite: interfiere en tu vida privada y tus mensajes. Esa invasión es la razón por la que el derecho importa.',
    review: 'En este caso ficticio, alguien intenta cruzar el límite. Revisar una foto puede ayudar; no convierte en tu responsabilidad impedir toda invasión.',
    next: 'Ver qué derecho te protege'
  }
};

function announce(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(`story:${name}`, { detail }));
}

function updateProgress(number) {
  progressNumber.textContent = `0${number} / 03`;
  progressLine.style.setProperty('--progress', `${number * 33.333}%`);
}

function goToStory() {
  opening.hidden = true;
  story.hidden = false;
  story.classList.add('is-revealing');
  story.dataset.choice = '';
  currentScene = 1;
  sceneArt.dataset.scene = '1';
  updateProgress(1);
  announce('start');
  sceneTitle.focus({ preventScroll: true });
  story.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
}

function showNextScene() {
  if (currentScene === 3) {
    story.hidden = true;
    reveal.hidden = false;
    announce('reveal');
    document.querySelector('#reveal-title').focus({ preventScroll: true });
    reveal.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
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
  opening.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
  choices.hidden = false;
  continueButton.hidden = true;
  sceneKicker.textContent = 'PISTA 01 ? LA FOTO';
  sceneTitle.innerHTML = 'Una foto parece simple.<br><em>Hasta que no lo es.</em>';
  sceneBody.textContent = 'El caso es ficticio. Una foto puede revelar más por lo que aparece alrededor que por lo que querías enseñar. ?Qué harías antes de publicarla?';
  choices.querySelectorAll('.choice').forEach((button) => button.setAttribute('aria-pressed', 'false'));
  chosenPath = '';
  currentScene = 1;
  story.dataset.choice = '';
  sceneArt.dataset.scene = '1';
  story.classList.remove('is-revealing');
  announce('reset');
}

document.querySelector('#start-story').addEventListener('click', goToStory);

document.querySelectorAll('.choice').forEach((button) => {
  button.addEventListener('click', () => {
    chosenPath = button.dataset.choice;
    choices.querySelectorAll('.choice').forEach((choice) => choice.setAttribute('aria-pressed', String(choice === button)));
    continueButton.hidden = false;
    continueLabel.textContent = 'Ver qu� cambia';
    story.dataset.choice = chosenPath;
    announce('choice', { choice: chosenPath });
  });
});

continueButton.addEventListener('click', showNextScene);
document.querySelector('#restart-story').addEventListener('click', restart);

const soundToggle = document.querySelector('#sound-toggle');
const soundLabel = document.querySelector('#sound-label');
const soundState = document.querySelector('#sound-state');
let soundContext = null;
let soundMaster = null;
let ambientOn = false;

function buildSoundscape() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;
  soundContext = new AudioContextClass();
  soundMaster = soundContext.createGain();
  soundMaster.gain.value = 0.0001;
  soundMaster.connect(soundContext.destination);

  const makeTone = (frequency, type, level, detune = 0) => {
    const oscillator = soundContext.createOscillator();
    const voice = soundContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;
    voice.gain.value = level;
    oscillator.connect(voice);
    voice.connect(soundMaster);
    oscillator.start();
  };

  // Atm?sfera original sintetizada; sin pista grabada ni audio de terceros.
  makeTone(54, 'sine', 0.2);
  makeTone(55.4, 'sine', 0.15);
  makeTone(82.4, 'triangle', 0.08, -3);
  makeTone(110, 'sine', 0.035, 2);
  makeTone(164.8, 'sine', 0.025, -2);

  const buffer = soundContext.createBuffer(1, soundContext.sampleRate * 4, soundContext.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < channel.length; i += 1) channel[i] = (Math.random() * 2 - 1) * 0.22;
  const noise = soundContext.createBufferSource();
  const lowPass = soundContext.createBiquadFilter();
  const noiseGain = soundContext.createGain();
  noise.buffer = buffer;
  noise.loop = true;
  lowPass.type = 'lowpass';
  lowPass.frequency.value = 520;
  noiseGain.gain.value = 0.07;
  noise.connect(lowPass);
  lowPass.connect(noiseGain);
  noiseGain.connect(soundMaster);
  noise.start();
  return true;
}

soundToggle.addEventListener('click', async () => {
  if (!ambientOn) {
    if (!soundContext && !buildSoundscape()) {
      soundLabel.textContent = 'Sonido no disponible';
      soundToggle.setAttribute('aria-label', 'Sonido no disponible en este navegador');
      soundState.textContent = '?';
      soundToggle.disabled = true;
      return;
    }
    await soundContext.resume();
    soundMaster.gain.cancelScheduledValues(soundContext.currentTime);
    soundMaster.gain.setValueAtTime(Math.max(soundMaster.gain.value, 0.0001), soundContext.currentTime);
    soundMaster.gain.linearRampToValueAtTime(0.18, soundContext.currentTime + 2.2);
    ambientOn = true;
    soundToggle.setAttribute('aria-pressed', 'true');
    soundLabel.textContent = 'Sonido';
    soundToggle.setAttribute('aria-label', 'Apagar sonido ambiente');
    soundState.textContent = 'activo';
    return;
  }

  soundMaster.gain.cancelScheduledValues(soundContext.currentTime);
  soundMaster.gain.setValueAtTime(soundMaster.gain.value, soundContext.currentTime);
  soundMaster.gain.linearRampToValueAtTime(0.0001, soundContext.currentTime + 0.7);
  ambientOn = false;
  soundToggle.setAttribute('aria-pressed', 'false');
  soundLabel.textContent = 'Sonido';
  soundToggle.setAttribute('aria-label', 'Activar sonido ambiente');
  soundState.textContent = 'apagado';
  window.setTimeout(() => { if (!ambientOn) soundContext?.suspend(); }, 800);
});
