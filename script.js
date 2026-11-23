const opening = document.querySelector('.opening');
const story = document.querySelector('.story');
const reveal = document.querySelector('.reveal');
const sceneImage = document.querySelector('#scene-image');
const sceneImageWrap = document.querySelector('#scene-image-wrap');
const sceneKicker = document.querySelector('#scene-kicker');
const scenePlace = document.querySelector('#scene-place');
const sceneTitle = document.querySelector('#story-title');
const sceneBody = document.querySelector('#scene-body');
const sceneHotspots = document.querySelector('#scene-hotspots');
const sceneClue = document.querySelector('#scene-clue');
const choicePrompt = document.querySelector('#choice-prompt');
const choices = document.querySelector('#choices');
const continueButton = document.querySelector('#continue-story');
const continueLabel = document.querySelector('#continue-label');
const progressNumber = document.querySelector('#progress-number');
const endingBackdrop = document.querySelector('#ending-backdrop');
const endingKicker = document.querySelector('#ending-kicker');
const endingTitle = document.querySelector('#reveal-title');
const endingOutcome = document.querySelector('#ending-outcome');
const shareSummary = document.querySelector('#share-summary');
const shareStatus = document.querySelector('#share-status');
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
let cartographerNoticed = false;
let doorTapped = false;
let soundOptedOut = false;
const decisions = [];

const scenes = [
  {
    image: 'assets/story/alcala-night.webp',
    place: 'CALLE MAYOR · CASA CERVANTES',
    kicker: 'CALLE MAYOR · 23:17',
    title: 'Ya es pública.',
    body: 'Casa Natal de Cervantes, Calle Mayor 48. La foto ya revela dónde y cuándo.',
    prompt: '¿La publicas con ubicación?',
    hotspots: [
      { id: 'protagonist', label: 'La chica', x: 20, y: 45, align: 'right', response: 'El flash salta: el Cartógrafo acaba de tomar una foto desde el otro lado de Calle Mayor. La protagonista decide qué pista compartir y a quién pedir apoyo.' },
      { id: 'landmark', label: 'Casa Cervantes', x: 53, y: 46, align: 'center', response: 'Estás en el casco histórico, frente a la Casa Natal de Cervantes, en Calle Mayor 48. La fachada de una foto puede revelar el lugar aunque no añadas una etiqueta.' },
      { id: 'cartographer', label: 'El Cartógrafo', x: 74, y: 57, align: 'left', response: 'Lo señalas. La imagen da un salto: el encapuchado ya no está junto al farol; aparece en el reflejo, detrás de ti. Ha notado que lo viste.' }
    ],
    choices: [
      { id: 'live-location', risk: 1, label: 'Publicarla ahora con la ubicación' },
      { id: 'remove-location', risk: 0, label: 'Quitar la ubicación y esperar a mañana' }
    ]
  },
  {
    image: 'assets/story/alcala-reflection.webp',
    place: 'CALLE MAYOR · CERCA DE CASA CERVANTES',
    kicker: 'CALLE MAYOR · 23:24',
    title: '«Sé por dónde vuelves».',
    body: () => cartographerNoticed
        ? 'Después de señalarlo, reaparece en el cristal de un edificio de Calle Mayor, mucho más cerca. Llega: «Sé por dónde vuelves».'
      : riskScore
        ? 'La hora y la ubicación apuntan a Calle Mayor. Frente a la Casa Natal llega un mensaje: «Sé por dónde vuelves».'
        : 'Quitaste la etiqueta, pero la fachada y la hora siguen dando pistas. Frente a la Casa Natal llega: «Sé por dónde vuelves».',
    prompt: 'El Cartógrafo quiere confirmar tu rutina. ¿Qué haces?',
    hotspots: [
      { id: 'protagonist', label: 'La chica', x: 20, y: 45, align: 'right', response: 'Un destello cruza el cristal. Ella reconoce al Cartógrafo; no tiene que responder a quien la intimida.' },
      { id: 'phone', label: 'El móvil', x: 51, y: 72, align: 'center', response: 'La pantalla muestra la hora; el reflejo revela el escaparate. Dos detalles cotidianos pueden ubicar una foto sin que nadie hackee el teléfono.' },
      { id: 'cartographer', label: 'El reflejo', x: 79, y: 44, align: 'left', response: 'Tocas el reflejo. Por un instante, la figura se mueve antes que tú. El cristal la devuelve demasiado cerca.' }
    ],
    choices: [
      { id: 'reply-routine', risk: 1, label: 'Responderle y confirmar a qué hora sales' },
      { id: 'block-save', risk: 0, label: 'Guardar captura, bloquear y avisar a alguien' }
    ]
  },
  {
    image: 'assets/story/alcala-portal.webp',
    place: 'SANDOVAL Y ROJAS · PUERTA DE MADRID',
    kicker: 'RUMBO A PUERTA DE MADRID · 23:41',
    title: 'La ciudad se queda en silencio.',
    body: () => riskScore > 1
      ? 'Varias pistas te han llevado de Calle Mayor a Sandoval y Rojas. Ya distingues la Puerta de Madrid; llega otro mensaje: «Vas hacia la muralla».'
      : 'En Sandoval y Rojas, junto a la Puerta de Madrid, la figura sigue al otro lado. El café abierto de Plaza de Cervantes ofrece un lugar atendido.',
    prompt: 'Tienes una última decisión. ¿Hacia dónde vas?',
    hotspots: [
      { id: 'protagonist', label: 'La chica', x: 23, y: 46, align: 'right', response: 'El flash ilumina el pomo. Ella decide no entrar sola y avisar a alguien de confianza.' },
      { id: 'door', label: 'El picaporte', x: 87, y: 68, align: 'left', response: 'Tocas el pomo. No cede. Un portal identifica un domicilio: no publiques la entrada ni te quedes ahí si no te sientes segura.' },
      { id: 'cartographer', label: 'El Cartógrafo', x: 64, y: 48, align: 'left', response: 'Lo tocas en la pantalla. El encapuchado avanza hasta el borde de la luz; la figura sigue siendo ficción, pero la pista que le diste era real.' }
    ],
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
  scenePlace.textContent = scene.place;
  sceneTitle.textContent = scene.title;
  sceneBody.textContent = typeof scene.body === 'function' ? scene.body() : scene.body;
  sceneClue.hidden = true;
  sceneClue.textContent = '';
  sceneImageWrap.classList.remove('is-disturbed', 'is-door-touched', 'is-camera-flash');
  sceneHotspots.classList.remove('is-disturbed', 'is-door-touched');
  sceneHotspots.innerHTML = scene.hotspots.map((hotspot) => `
    <button class="story__hotspot story__hotspot--${hotspot.align}" type="button" data-hotspot="${hotspot.id}" style="left:${hotspot.x}%;top:${hotspot.y}%" aria-controls="scene-clue" aria-pressed="false" aria-label="Explorar: ${hotspot.label}">
      <span class="story__hotspot-marker" aria-hidden="true">+</span><span class="story__hotspot-label">${hotspot.label}</span>
    </button>`).join('');
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
  endingKicker.textContent = choseSupport ? 'PLAZA DE CERVANTES · 23:48' : 'CARDENAL SANDOVAL Y ROJAS · 23:48';
  endingTitle.innerHTML = choseSupport ? 'No llegaste<br><em>sola.</em>' : 'El rastro<br><em>llegó a tu puerta.</em>';
  endingOutcome.textContent = riskScore === 0
    ? 'Quitaste la ubicación, no confirmaste tu horario y pediste compañía. Cerraste varias pistas. Tu intimidad merece respeto en cualquier final.'
    : riskScore === 1
      ? choseSupport
        ? 'Una pista quedó expuesta. Entrar a un lugar atendido y avisar a alguien frenó el rastro. Nada de esto te hace responsable de una invasión.'
        : 'Una pista bastó para acercar al Cartógrafo. Publicar jamás autoriza a seguirte; la invasión es responsabilidad de quien la comete.'
      : choseSupport
        ? 'El Cartógrafo unió hora, lugar y rutina. Cambiaste el destino y pediste apoyo. Compartir nunca justifica que invadan tu intimidad.'
        : 'El Cartógrafo unió hora, lugar y rutina. Esto es ficción: ninguna publicación da permiso para vigilarte.';
  if (doorTapped) endingOutcome.textContent = `${endingOutcome.textContent} La puerta no cedió; pedir apoyo seguía siendo una opción.`;
  shareSummary.textContent = choseSupport
    ? 'Elegí apoyo en Plaza de Cervantes. La intimidad también es libertad.'
    : 'Mi ruta llegó al portal. La intimidad también es libertad.';
  shareStatus.textContent = '';
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
  cartographerNoticed = false;
  doorTapped = false;
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
  cartographerNoticed = false;
  doorTapped = false;
  currentScene = -1;
  decisions.length = 0;
  story.dataset.risk = '0';
  story.dataset.lastDecision = '';
  history.replaceState(null, '', '#inicio');
  announce('reset');
  window.scrollTo({ top: 0, behavior: scrollBehavior });
  document.querySelector('#opening-title').focus({ preventScroll: true });
}

document.querySelector('#start-story').addEventListener('click', () => {
  if (!ambientOn && !soundOptedOut) turnSoundOn();
  goToStory();
});
sceneHotspots.addEventListener('click', (event) => {
  const button = event.target.closest('[data-hotspot]');
  if (!button || button.getAttribute('aria-pressed') === 'true') return;
  const hotspot = scenes[currentScene]?.hotspots.find((item) => item.id === button.dataset.hotspot);
  if (!hotspot) return;
  button.setAttribute('aria-pressed', 'true');
  sceneClue.textContent = hotspot.response;
  sceneClue.hidden = false;
  const isThreat = hotspot.id === 'cartographer';
  if (isThreat) {
    cartographerNoticed = true;
    sceneImageWrap.classList.remove('is-disturbed');
    sceneHotspots.classList.remove('is-disturbed');
    void sceneImageWrap.offsetWidth;
    sceneImageWrap.classList.add('is-disturbed');
    sceneHotspots.classList.add('is-disturbed');
  }
  if (hotspot.id === 'door') {
    doorTapped = true;
    sceneImageWrap.classList.remove('is-door-touched');
    sceneHotspots.classList.remove('is-door-touched');
    void sceneImageWrap.offsetWidth;
    sceneImageWrap.classList.add('is-door-touched');
    sceneHotspots.classList.add('is-door-touched');
  }
  if (isThreat) {
    navigator.vibrate?.([24, 32, 52]);
    if (ambientOn) playMacabreLaugh();
  } else if (hotspot.id === 'door') {
    navigator.vibrate?.(42);
    if (ambientOn) playDoorKnock();
  } else if (hotspot.id === 'protagonist' || hotspot.id === 'phone') {
    navigator.vibrate?.(18);
    sceneImageWrap.classList.remove('is-camera-flash');
    void sceneImageWrap.offsetWidth;
    sceneImageWrap.classList.add('is-camera-flash');
    if (ambientOn) playCameraFlash();
  } else if (hotspot.id === 'landmark') {
    navigator.vibrate?.(14);
    if (ambientOn) playLocationPing();
  }
  announce('hotspot', { id: hotspot.id, scene: currentScene + 1, threat: isThreat });
});

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
document.querySelector('#share-ending').addEventListener('click', async () => {
  const title = 'Tu sombra digital · Artículo 12';
  const url = new URL(window.location.href);
  url.hash = 'derecho';
  const text = `El artículo 12 de la Declaración Universal de los Derechos Humanos protege tu vida privada, tu domicilio y tus comunicaciones frente a injerencias arbitrarias. ${shareSummary.textContent} Conoce la historia sobre el derecho a la intimidad.`;
  const data = { title, text, url: url.href };
  if (navigator.share) {
    try {
      await navigator.share(data);
      shareStatus.textContent = 'Listo para compartir.';
    } catch (error) {
      if (error.name !== 'AbortError') shareStatus.textContent = 'No se pudo abrir el menú para compartir.';
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url.href}`);
    shareStatus.textContent = 'Enlace y reflexión copiados.';
  } catch {
    window.prompt('Copia y comparte este final:', `${text} ${url.href}`);
  }
});

const soundToggle = document.querySelector('#sound-toggle');
const soundLabel = document.querySelector('#sound-label');
const soundState = document.querySelector('#sound-state');
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
  const label = active ? 'Silenciar' : 'Audio';
  soundLabel.textContent = label;
  soundState.textContent = active ? 'ON' : 'OFF';
  soundToggle.setAttribute('aria-pressed', String(active));
  soundToggle.setAttribute('aria-label', active ? 'Silenciar música y efectos de sonido' : 'Activar música y efectos de sonido');
  opening.classList.toggle('is-audio-on', active);
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
      soundLabel.textContent = 'Reintentar';
      soundState.textContent = 'OFF';
      soundToggle.setAttribute('aria-label', 'No se pudo iniciar el audio. Toca para reintentar.');
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

function getSoundContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext = audioContext || new AudioContextClass();
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  return audioContext;
}

function duckAmbienceFor(milliseconds, level = 0.16) {
  if (licensedAmbience.paused) return;
  licensedAmbience.volume = Math.min(licensedAmbience.volume, level);
  window.setTimeout(() => {
    if (ambientOn && !licensedAmbience.paused) licensedAmbience.volume = 0.72;
  }, milliseconds);
}

function makeNoiseBuffer(context, seconds) {
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * seconds), context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    const fade = 1 - index / samples.length;
    samples[index] = (Math.random() * 2 - 1) * fade;
  }
  return buffer;
}

function playCameraFlash() {
  if (!ambientOn) return;
  const context = getSoundContext();
  if (!context) return;
  duckAmbienceFor(420, 0.25);
  const now = context.currentTime;
  const noise = context.createBufferSource();
  const highPass = context.createBiquadFilter();
  const hissGain = context.createGain();
  noise.buffer = makeNoiseBuffer(context, 0.12);
  highPass.type = 'highpass';
  highPass.frequency.setValueAtTime(1250, now);
  hissGain.gain.setValueAtTime(0.0001, now);
  hissGain.gain.linearRampToValueAtTime(0.22, now + 0.004);
  hissGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
  noise.connect(highPass);
  highPass.connect(hissGain);
  hissGain.connect(context.destination);
  noise.start(now);
  noise.stop(now + 0.12);

  const click = context.createOscillator();
  const clickGain = context.createGain();
  click.type = 'square';
  click.frequency.setValueAtTime(1850, now);
  click.frequency.exponentialRampToValueAtTime(520, now + 0.035);
  clickGain.gain.setValueAtTime(0.055, now);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
  click.connect(clickGain);
  clickGain.connect(context.destination);
  click.start(now);
  click.stop(now + 0.05);
}

function playLocationPing() {
  if (!ambientOn) return;
  const context = getSoundContext();
  if (!context) return;
  const now = context.currentTime;
  const ping = context.createOscillator();
  const gain = context.createGain();
  ping.type = 'sine';
  ping.frequency.setValueAtTime(690, now);
  ping.frequency.exponentialRampToValueAtTime(430, now + 0.28);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.075, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
  ping.connect(gain);
  gain.connect(context.destination);
  ping.start(now);
  ping.stop(now + 0.35);
}

function playMacabreLaugh() {
  if (!ambientOn) return;
  const context = getSoundContext();
  if (!context) return;
  duckAmbienceFor(1450, 0.14);
  const now = context.currentTime;
  const voice = context.createOscillator();
  const formant = context.createBiquadFilter();
  const voiceGain = context.createGain();
  const breath = context.createBufferSource();
  const breathFormant = context.createBiquadFilter();
  const breathGain = context.createGain();
  const delay = context.createDelay(0.35);
  const echoGain = context.createGain();
  voice.type = 'sawtooth';
  formant.type = 'bandpass';
  formant.Q.setValueAtTime(2.2, now);
  breath.buffer = makeNoiseBuffer(context, 0.92);
  breathFormant.type = 'bandpass';
  breathFormant.Q.setValueAtTime(0.9, now);
  delay.delayTime.setValueAtTime(0.21, now);
  echoGain.gain.setValueAtTime(0.16, now);
  voice.connect(formant);
  formant.connect(voiceGain);
  voiceGain.connect(context.destination);
  voiceGain.connect(delay);
  delay.connect(echoGain);
  echoGain.connect(context.destination);
  breath.connect(breathFormant);
  breathFormant.connect(breathGain);
  breathGain.connect(context.destination);

  const laughs = [
    { offset: 0.02, pitch: 176, endPitch: 132, formant: 620, length: 0.17 },
    { offset: 0.28, pitch: 158, endPitch: 118, formant: 530, length: 0.17 },
    { offset: 0.56, pitch: 139, endPitch: 94, formant: 440, length: 0.22 }
  ];
  laughs.forEach(({ offset, pitch, endPitch, formant: vowel, length }) => {
    const start = now + offset;
    voice.frequency.setValueAtTime(pitch, start);
    voice.frequency.exponentialRampToValueAtTime(endPitch, start + length);
    formant.frequency.setValueAtTime(vowel, start);
    formant.frequency.exponentialRampToValueAtTime(vowel * 0.82, start + length);
    voiceGain.gain.setValueAtTime(0.0001, start);
    voiceGain.gain.linearRampToValueAtTime(0.15, start + 0.025);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, start + length);
    breathFormant.frequency.setValueAtTime(vowel * 1.3, start);
    breathGain.gain.setValueAtTime(0.0001, start);
    breathGain.gain.linearRampToValueAtTime(0.055, start + 0.02);
    breathGain.gain.exponentialRampToValueAtTime(0.0001, start + length * 0.9);
  });
  voice.start(now);
  breath.start(now);
  voice.stop(now + 0.86);
  breath.stop(now + 0.9);
  window.setTimeout(() => {
    try { delay.disconnect(); echoGain.disconnect(); } catch {}
  }, 1200);
}

function playDoorKnock() {
  if (!ambientOn) return;
  const context = getSoundContext();
  if (!context) return;
  duckAmbienceFor(900, 0.2);
  const now = context.currentTime;
  [0, 0.2].forEach((offset, index) => {
    const start = now + offset;
    const thud = context.createOscillator();
    const thudGain = context.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(index === 0 ? 92 : 78, start);
    thud.frequency.exponentialRampToValueAtTime(48, start + 0.13);
    thudGain.gain.setValueAtTime(0.0001, start);
    thudGain.gain.linearRampToValueAtTime(index === 0 ? 0.24 : 0.19, start + 0.008);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
    thud.connect(thudGain);
    thudGain.connect(context.destination);
    thud.start(start);
    thud.stop(start + 0.17);
  });
}

function toggleSoundFromControl() {
  if (ambientOn) {
    soundOptedOut = true;
    turnSoundOff();
  } else {
    soundOptedOut = false;
    turnSoundOn();
  }
}

soundToggle.addEventListener('click', toggleSoundFromControl);
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
