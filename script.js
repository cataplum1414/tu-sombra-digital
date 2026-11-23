const opening = document.querySelector('.opening');
const story = document.querySelector('.story');
const reveal = document.querySelector('.reveal');
const sceneImage = document.querySelector('#scene-image');
const sceneKicker = document.querySelector('#scene-kicker');
const sceneTitle = document.querySelector('#story-title');
const sceneBody = document.querySelector('#scene-body');
const choicePrompt = document.querySelector('#choice-prompt');
const choices = document.querySelector('#choices');
const continueButton = document.querySelector('#continue-story');
const continueLabel = document.querySelector('#continue-label');
const progressNumber = document.querySelector('#progress-number');
const endingBackdrop = document.querySelector('#ending-backdrop');
const endingKicker = document.querySelector('#ending-kicker');
const endingTitle = document.querySelector('#reveal-title');
const endingOutcome = document.querySelector('#ending-outcome');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = reduceMotion ? 'auto' : 'smooth';

const modeNormal = document.querySelector('#mode-normal');
const modeImmersive = document.querySelector('#mode-immersive');
const screenModeShortcut = document.querySelector('#screen-mode-shortcut');
const screenModeShortLabel = document.querySelector('#screen-mode-short-label');
const rotationGuide = document.querySelector('#rotation-guide');
const rotationGuideTitle = document.querySelector('#rotation-guide-title');
const leaveImmersive = document.querySelector('#leave-immersive');
const portraitOrientation = window.matchMedia('(orientation: portrait)');
let viewMode = 'normal';

let currentScene = -1;
let riskScore = 0;
let lastDecision = '';
const decisions = [];

const scenes = [
  {
    image: 'assets/story/alcala-night.webp',
    kicker: 'CALLE MAYOR · 23:17',
    title: 'La foto ya está en tu perfil.',
    body: 'Una story pública deja ver los soportales. El Cartógrafo reúne detalles que cualquiera puede ver; no necesita entrar en tu teléfono.',
    prompt: 'La vas a subir. ¿Qué haces con la ubicación?',
    choices: [
      { id: 'live-location', risk: 1, label: 'Publicarla ahora con la ubicación' },
      { id: 'remove-location', risk: 0, label: 'Quitar la ubicación y esperar a mañana' }
    ]
  },
  {
    image: 'assets/story/alcala-reflection.webp',
    kicker: 'UN MENSAJE · 23:24',
    title: '«Sé por dónde vuelves».',
    body: () => riskScore
      ? 'La hora y la ubicación ya apuntan a la calle. Llega un mensaje desde una cuenta desconocida: «Sé por dónde vuelves».'
      : 'Quitaste la etiqueta, pero el arco y la hora siguen dando pistas. Llega un mensaje desde una cuenta desconocida: «Sé por dónde vuelves».',
    prompt: 'El Cartógrafo quiere confirmar tu rutina. ¿Qué haces?',
    choices: [
      { id: 'reply-routine', risk: 1, label: 'Responderle y confirmar a qué hora sales' },
      { id: 'block-save', risk: 0, label: 'Guardar captura, bloquear y avisar a alguien' }
    ]
  },
  {
    image: 'assets/story/alcala-portal.webp',
    kicker: 'LA ÚLTIMA CALLE · 23:41',
    title: 'La ciudad se queda en silencio.',
    body: () => riskScore > 1
      ? 'El Cartógrafo ha unido la hora, la calle y parte de tu rutina. El portal está a una manzana; llega otro mensaje: «Apuesto a que vas hacia la Plaza de la Estación».'
      : 'La figura sigue al otro lado de la calle. No sabes qué sabe ni qué pretende. El portal queda cerca; también hay un café abierto bajo los soportales.',
    prompt: 'Tienes una última decisión. ¿Hacia dónde vas?',
    choices: [
      { id: 'take-shortcut', risk: 1, label: 'Ir sola al portal por la calle vacía' },
      { id: 'go-cafe', risk: 0, label: 'Entrar al café abierto y llamar a alguien de confianza' }
    ]
  }
];

function announce(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(`story:${name}`, { detail }));
}

function setLocation(id) {
  const next = `#${id}`;
  if (window.location.hash !== next) window.history.pushState(null, '', next);
}

function shouldAskToRotate() {
  const touchDevice = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  return viewMode === 'immersive' && touchDevice && window.innerWidth <= 900 && portraitOrientation.matches;
}

function syncRotationGuide() {
  const showGuide = shouldAskToRotate();
  const wasVisible = !rotationGuide.hidden;
  rotationGuide.hidden = !showGuide;
  if (wasVisible && !showGuide && rotationGuide.contains(document.activeElement)) {
    screenModeShortcut.focus({ preventScroll: true });
  }
}

function setViewMode(mode) {
  viewMode = mode;
  const immersive = mode === 'immersive';
  document.body.classList.toggle('view-immersive', immersive);
  modeNormal.setAttribute('aria-pressed', String(!immersive));
  modeImmersive.setAttribute('aria-pressed', String(immersive));
  modeNormal.classList.toggle('is-selected', !immersive);
  modeImmersive.classList.toggle('is-selected', immersive);
  screenModeShortLabel.textContent = immersive ? 'Inmersiva' : 'Normal';
  screenModeShortcut.setAttribute('aria-pressed', String(immersive));
  screenModeShortcut.setAttribute('aria-label', immersive ? 'Volver a pantalla normal' : 'Activar modo más inmersivo; gira el teléfono');
  syncRotationGuide();
}

modeNormal.addEventListener('click', () => setViewMode('normal'));
modeImmersive.addEventListener('click', () => {
  setViewMode('immersive');
  if (!rotationGuide.hidden) rotationGuideTitle.focus({ preventScroll: true });
});
screenModeShortcut.addEventListener('click', () => {
  setViewMode(viewMode === 'normal' ? 'immersive' : 'normal');
  if (!rotationGuide.hidden) rotationGuideTitle.focus({ preventScroll: true });
});
leaveImmersive.addEventListener('click', () => {
  setViewMode('normal');
  screenModeShortcut.focus({ preventScroll: true });
});
rotationGuide.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    setViewMode('normal');
    screenModeShortcut.focus({ preventScroll: true });
  } else if (event.key === 'Tab') {
    event.preventDefault();
    if (document.activeElement === rotationGuideTitle) leaveImmersive.focus();
    else rotationGuideTitle.focus();
  }
});
window.addEventListener('resize', syncRotationGuide, { passive: true });
window.addEventListener('orientationchange', syncRotationGuide, { passive: true });
screen.orientation?.addEventListener?.('change', syncRotationGuide);

function updateProgress(number) {
  progressNumber.textContent = `DECISIÓN ${number} DE 3`;
}

function renderScene(index) {
  const scene = scenes[index];
  currentScene = index;
  sceneImage.src = scene.image;
  sceneKicker.textContent = scene.kicker;
  sceneTitle.textContent = scene.title;
  sceneBody.textContent = typeof scene.body === 'function' ? scene.body() : scene.body;
  choicePrompt.textContent = scene.prompt;
  choices.innerHTML = scene.choices.map((choice, choiceIndex) => `
    <button class="choice ${choice.risk ? 'choice--danger' : 'choice--safe'}" type="button" data-choice="${choice.id}" data-risk="${choice.risk}" aria-pressed="false">
      <span class="choice__mark" aria-hidden="true">${String.fromCharCode(65 + choiceIndex)}</span>
      <span>${choice.label}</span>
      <span class="choice__arrow" aria-hidden="true">↗</span>
    </button>`).join('');
  choices.hidden = false;
  choices.classList.remove('has-selection');
  continueButton.hidden = true;
  updateProgress(index + 1);
  document.querySelector('.story__soundline').innerHTML = `<i></i> EL CARTÓGRAFO · ARCHIVO 0${index + 1}`;
  window.scrollTo({ top: 0, behavior: scrollBehavior });
  announce(index === 0 ? 'start' : 'scene', { scene: index + 1, risk: riskScore, decision: lastDecision });
  sceneTitle.focus({ preventScroll: true });
}

function renderEnding() {
  const choseSupport = lastDecision === 'go-cafe';
  const finalImage = choseSupport ? 'assets/story/alcala-cafe.webp' : 'assets/story/alcala-portal.webp';
  endingBackdrop.style.backgroundImage = `url("${finalImage}")`;
  endingKicker.textContent = choseSupport ? 'PLAZA DE CERVANTES · 23:48' : 'TU PORTAL · 23:48';
  endingTitle.innerHTML = choseSupport ? 'No llegaste<br><em>sola.</em>' : 'El rastro<br><em>llegó a tu puerta.</em>';
  endingOutcome.textContent = riskScore === 0
    ? 'Quitaste la ubicación, no confirmaste tu horario y buscaste compañía. Cerraste varias pistas y cambiaste el rumbo de la noche. Ninguna medida garantiza seguridad: quien respeta tu intimidad es responsable de no invadirla.'
    : riskScore === 1
      ? choseSupport
        ? 'Una pista quedó expuesta. Al dejar de responder y entrar a un lugar atendido, evitaste compartir más sobre tu rutina. Eso reduce exposición, pero no traslada a ti la responsabilidad de que otra persona respete tu intimidad.'
        : 'Una pista quedó expuesta y el recorrido termina frente al portal, con una figura al otro lado de la calle. El Cartógrafo no tiene acceso mágico a tu teléfono: reunió detalles visibles. Compartirlos nunca da permiso para vigilarte.'
      : choseSupport
        ? 'El Cartógrafo pudo unir la hora, la calle y parte de tu rutina. Elegiste un lugar atendido y avisaste a alguien, aunque algunas pistas ya estaban expuestas. Si alguien invade tu intimidad, no es culpa tuya por haber publicado.'
        : 'El Cartógrafo unió la hora, la calle y parte de tu rutina. El recorrido termina frente al portal, con una figura al otro lado de la calle. Esto es ficción: publicar no da permiso para vigilarte, y la invasión nunca es culpa de quien la sufre.';
  story.hidden = true;
  reveal.hidden = false;
  setLocation('derecho');
  announce('ending', { risk: riskScore, decision: lastDecision, decisions: [...decisions] });
  endingTitle.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: scrollBehavior });
}

function goToStory() {
  opening.hidden = true;
  story.hidden = false;
  riskScore = 0;
  lastDecision = '';
  decisions.length = 0;
  story.dataset.risk = '0';
  story.classList.remove('is-revealing');
  setLocation('recorrido');
  renderScene(0);
}

function showNextScene() {
  if (currentScene < scenes.length - 1) {
    renderScene(currentScene + 1);
    return;
  }
  renderEnding();
}

function restart() {
  reveal.hidden = true;
  story.hidden = true;
  opening.hidden = false;
  riskScore = 0;
  lastDecision = '';
  currentScene = -1;
  decisions.length = 0;
  story.dataset.risk = '0';
  story.dataset.lastDecision = '';
  history.replaceState(null, '', '#inicio');
  announce('reset');
  window.scrollTo({ top: 0, behavior: scrollBehavior });
  document.querySelector('#opening-title').focus({ preventScroll: true });
}

document.querySelector('#start-story').addEventListener('click', goToStory);
choices.addEventListener('click', (event) => {
  const button = event.target.closest('[data-choice]');
  if (!button || choices.hidden) return;
  lastDecision = button.dataset.choice;
  riskScore += Number(button.dataset.risk);
  decisions.push(lastDecision);
  story.dataset.risk = String(riskScore);
  story.dataset.lastDecision = lastDecision;
  choices.querySelectorAll('[data-choice]').forEach((choice) => {
    choice.setAttribute('aria-pressed', String(choice === button));
    choice.disabled = true;
  });
  choices.classList.add('has-selection');
  continueButton.hidden = false;
  continueLabel.textContent = currentScene === scenes.length - 1 ? 'Ver cómo termina' : 'Continuar';
  announce('choice', { choice: lastDecision, risk: riskScore, scene: currentScene + 1 });
  navigator.vibrate?.(lastDecision === 'take-shortcut' ? [35, 45, 70] : 24);
});
continueButton.addEventListener('click', showNextScene);
document.querySelector('#restart-story').addEventListener('click', restart);

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

function updateSoundControls(active, mode = 'none') {
  ambientOn = active;
  const label = active ? 'Apagar ambiente' : 'Activar ambiente';
  const heroLabel = active ? 'Apagar ambiente' : 'Escuchar con ambiente';
  soundLabel.textContent = label;
  soundState.textContent = active ? 'ON' : 'OFF';
  heroSoundLabel.textContent = heroLabel;
  heroSoundState.textContent = active ? 'ON' : 'OFF';
  soundToggle.setAttribute('aria-pressed', String(active));
  heroSoundToggle.setAttribute('aria-pressed', String(active));
  opening.classList.toggle('is-audio-on', active);
  soundHint.textContent = active
    ? 'Ambiente activo. Puedes apagarlo con ♫ en cualquier momento.'
    : 'El ambiente es opcional. Actívalo aquí o desde el control ♫.';
  announce('audio', { active, mode });
}

function startSynthFallback() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return Promise.reject(new Error('Audio no disponible'));
  audioContext = audioContext || new AudioContextClass();
  soundMaster = audioContext.createGain();
  soundMaster.gain.value = 0.0001;
  soundMaster.connect(audioContext.destination);
  [[55, 'sine', 0.12], [82.4, 'triangle', 0.035], [110, 'sine', 0.02]].forEach(([frequency, type, volume]) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(soundMaster);
    oscillator.start();
    fallbackVoices.push(oscillator);
  });
  return audioContext.resume().then(() => {
    soundMaster.gain.setTargetAtTime(0.52, audioContext.currentTime, 0.65);
    updateSoundControls(true, 'synthesized-fallback');
  });
}

function turnSoundOn() {
  if (ambientOn) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (AudioContextClass) {
    try {
      audioContext = audioContext || new AudioContextClass();
      audioContext.resume().catch(() => {});
    } catch {}
  }
  const playback = licensedAmbience.play();
  if (!playback?.then) {
    updateSoundControls(true, 'licensed-track');
    return;
  }
  playback.then(() => updateSoundControls(true, 'licensed-track'))
    .catch(() => startSynthFallback().catch(() => {
      soundHint.textContent = 'El navegador bloqueó el audio. Puedes reintentarlo o recorrer la historia en silencio.';
    }));
}

function turnSoundOff() {
  licensedAmbience.pause();
  licensedAmbience.currentTime = 0;
  licensedAmbience.volume = 0.72;
  if (audioContext && soundMaster) {
    soundMaster.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.18);
    window.setTimeout(() => {
      if (ambientOn) return;
      fallbackVoices.forEach((voice) => { try { voice.stop(); } catch {} });
      fallbackVoices = [];
      audioContext.suspend();
    }, 900);
  }
  updateSoundControls(false);
}

function playEndingImpact() {
  if (!ambientOn) return;
  const savedVolume = licensedAmbience.volume;
  if (licensedAmbience.paused === false) licensedAmbience.volume = 0.07;
  window.setTimeout(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext = audioContext || new AudioContextClass();
    audioContext.resume().then(() => {
      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const noise = audioContext.createBufferSource();
      const filter = audioContext.createBiquadFilter();
      const noiseGain = audioContext.createGain();
      const buffer = audioContext.createBuffer(1, Math.ceil(audioContext.sampleRate * 0.32), audioContext.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let index = 0; index < samples.length; index += 1) samples[index] = (Math.random() * 2 - 1) * (1 - index / samples.length);
      noise.buffer = buffer;
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, now);
      filter.frequency.exponentialRampToValueAtTime(90, now + 0.26);
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioContext.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(132, now);
      oscillator.frequency.exponentialRampToValueAtTime(42, now + 0.31);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.46);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      noise.start(now);
      oscillator.start(now);
      noise.stop(now + 0.32);
      oscillator.stop(now + 0.48);
      window.setTimeout(() => {
        if (ambientOn && licensedAmbience.paused === false) licensedAmbience.volume = savedVolume;
      }, 650);
    }).catch(() => {});
  }, 320);
}

soundToggle.addEventListener('click', () => ambientOn ? turnSoundOff() : turnSoundOn());
heroSoundToggle.addEventListener('click', () => ambientOn ? turnSoundOff() : turnSoundOn());
window.addEventListener('story:ending', (event) => {
  if (event.detail.decision === 'take-shortcut') playEndingImpact();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && ambientOn) {
    licensedAmbience.pause();
    audioContext?.suspend();
  } else if (!document.hidden && ambientOn) {
    if (licensedAmbience.currentTime > 0) licensedAmbience.play().catch(() => turnSoundOff());
    audioContext?.resume();
  }
});
