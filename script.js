const opening = document.querySelector('.opening');
const story = document.querySelector('.story');
const reveal = document.querySelector('.reveal');
const scene = document.querySelector('#scene');
const sceneKicker = document.querySelector('#scene-kicker');
const sceneTitle = document.querySelector('#story-title');
const sceneBody = document.querySelector('#scene-body');
const choices = document.querySelector('#choices');
const continueButton = document.querySelector('#continue-story');
const continueLabel = document.querySelector('#continue-label');
const progressNumber = document.querySelector('#progress-number');
const progressLine = document.querySelector('#progress-line');

let chosenPath = '';
let currentScene = 1;

const scenes = {
  2: {
    kicker: 'La escena 2',
    title: 'Una pista parece pequeña.<br><em>Varias ya cuentan algo.</em>',
    share: 'La foto queda con su ubicación. En esta historia, esa pista se une a la hora y al mensaje que la acompañaba.',
    review: 'Quitas la ubicación. La historia cambia: compartir también puede incluir decidir qué detalle dejas fuera.',
    next: 'Seguir hasta el límite'
  },
  3: {
    kicker: 'La escena 3',
    title: 'La pregunta no es<br><em>si tienes secretos.</em>',
    share: 'Es quién puede entrar en tu vida privada, leer tus mensajes o convertir una pista en un ataque a tu reputación.',
    review: 'Es quién puede entrar en tu vida privada, leer tus mensajes o convertir una pista en un ataque a tu reputación.',
    next: 'Descubrir el derecho'
  }
};

function updateProgress(number) {
  progressNumber.textContent = `0${number} / 03`;
  progressLine.style.setProperty("--progress", `${number * 33.333}%`);

}

function goToStory() {
  opening.hidden = true;
  story.hidden = false;
  story.classList.add('is-revealing');
  story.dataset.choice = '';
  currentScene = 1;
  updateProgress(1);
  scene.querySelector('.eyebrow').focus?.();
  story.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showNextScene() {
  if (currentScene === 3) {
    story.hidden = true;
    reveal.hidden = false;
    reveal.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  story.classList.remove('is-revealing');
  void story.offsetWidth;
  story.classList.add('is-revealing');
  updateProgress(currentScene);
  sceneTitle.focus?.();
}

function restart() {
  reveal.hidden = true;
  opening.hidden = false;
  opening.scrollIntoView({ behavior: 'smooth', block: 'start' });
  choices.hidden = false;
  continueButton.hidden = true;
  sceneKicker.textContent = 'La escena 1';
  sceneTitle.innerHTML = 'Subes una foto.<br><em>Compartes un momento.</em>';
  sceneBody.textContent = 'En esta historia, una imagen lleva pistas sobre cuándo y dónde ocurrió. ¿Qué harías antes de publicarla?';
  choices.querySelectorAll('.choice').forEach((button) => button.setAttribute('aria-pressed', 'false'));
  chosenPath = '';
  currentScene = 1;
  story.dataset.choice = '';
  story.classList.remove('is-revealing');
}

document.querySelector('#start-story').addEventListener('click', goToStory);

document.querySelectorAll('.choice').forEach((button) => {
  button.addEventListener('click', () => {
    chosenPath = button.dataset.choice;
    choices.querySelectorAll('.choice').forEach((choice) => choice.setAttribute('aria-pressed', String(choice === button)));
    continueButton.hidden = false;
    continueLabel.textContent = 'Ver qué cambia';
    story.dataset.choice = chosenPath;
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

  // A slow, low tonal bed with gentle beating; no recorded or third-party track.
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
      soundLabel.textContent = 'Sonido no disponible en este navegador';
      soundState.textContent = '—';
      soundToggle.disabled = true;
      return;
    }
    await soundContext.resume();
    soundMaster.gain.cancelScheduledValues(soundContext.currentTime);
    soundMaster.gain.setValueAtTime(Math.max(soundMaster.gain.value, 0.0001), soundContext.currentTime);
    soundMaster.gain.linearRampToValueAtTime(0.18, soundContext.currentTime + 2.2);
    ambientOn = true;
    soundToggle.setAttribute('aria-pressed', 'true');
    soundLabel.textContent = 'Apagar sonido ambiente';
    soundState.textContent = 'activo';
    return;
  }

  soundMaster.gain.cancelScheduledValues(soundContext.currentTime);
  soundMaster.gain.setValueAtTime(soundMaster.gain.value, soundContext.currentTime);
  soundMaster.gain.linearRampToValueAtTime(0.0001, soundContext.currentTime + 0.7);
  ambientOn = false;
  soundToggle.setAttribute('aria-pressed', 'false');
  soundLabel.textContent = 'Activar sonido ambiente';
  soundState.textContent = 'apagado';
  window.setTimeout(() => { if (!ambientOn) soundContext?.suspend(); }, 800);
});

