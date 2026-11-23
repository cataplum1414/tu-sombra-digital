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
let tensionLevel = 0;
let lastDecision = '';
let cartographerNoticed = false;
let cafeEntranceRang = false;
let soundOptedOut = false;
const decisions = [];

const scenes = [
  {
    image: 'assets/story/alcala-night.webp',
    place: 'CALLE MAYOR · CASA CERVANTES',
    kicker: 'CALLE MAYOR · 23:17',
    title: 'Estás a punto de publicarla.',
    body: '23:17. Estás frente a la Casa Natal de Cervantes, en Calle Mayor 48. La fachada y la hora podrían revelar dónde estás, aunque no escribas la dirección.',
    prompt: '¿Qué haces antes de subir la foto?',
    hotspots: [
      { id: 'protagonist', label: 'La chica', x: 20, y: 45, align: 'right', response: 'El flash salta: el Cartógrafo acaba de tomar una foto desde el otro lado de Calle Mayor. La protagonista decide qué pista compartir y a quién pedir apoyo.' },
      { id: 'landmark', label: 'Casa Cervantes', x: 53, y: 46, align: 'center', response: 'Unos pasos húmedos resuenan bajo los soportales. Estás frente a la Casa Natal de Cervantes, Calle Mayor 48; la fachada puede ubicar la foto aunque no añadas una etiqueta.' },
      { id: 'cartographer', label: 'El Cartógrafo', x: 74, y: 57, align: 'left', response: 'Lo señalas. Desde debajo de la capucha se escapa una risa breve. La imagen da un salto: ya no está junto al farol; aparece en el reflejo, detrás de ti. Ha notado que lo viste.' }
    ],
    choices: [
      { id: 'live-location', risk: 1, label: 'Subirla ahora con la ubicación en directo' },
      { id: 'remove-location', risk: 0, label: 'Quitar la ubicación y publicarla mañana' }
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
        ? 'Publicaste la hora y la ubicación en directo. Frente a la Casa Natal llega un mensaje: «Sé por dónde vuelves».'
        : 'Quitaste la etiqueta, pero la fachada y la hora siguen dando pistas. Frente a la Casa Natal llega: «Sé por dónde vuelves».',
    prompt: 'El Cartógrafo quiere confirmar tu rutina. ¿Qué haces?',
    hotspots: [
      { id: 'protagonist', label: 'La chica', x: 20, y: 45, align: 'right', response: 'Un destello cruza el cristal. Ella reconoce al Cartógrafo; no tiene que responder a quien la intimida.' },
      { id: 'phone', label: 'El móvil', x: 51, y: 72, align: 'center', response: 'El móvil vibra con otro mensaje. La hora en pantalla y el reflejo del escaparate dan pistas sobre tu rutina; nadie tuvo que hackear el teléfono.' },
      { id: 'cartographer', label: 'El reflejo', x: 79, y: 44, align: 'left', response: 'Tocas el reflejo. Su risa suena detrás de ti; en el cristal, la figura se mueve antes que tú. Está demasiado cerca.' }
    ],
    choices: [
      { id: 'reply-routine', risk: 1, label: 'Responderle y confirmar a qué hora sales' },
      { id: 'block-save', risk: 0, label: 'Guardar captura, bloquear y avisar a alguien' }
    ]
  },
  {
    image: 'assets/story/alcala-plaza-exterior.webp',
    ambience: 'street',
    place: 'PLAZA DE CERVANTES · CAFETERÍA ABIERTA',
    kicker: 'PLAZA DE CERVANTES · 23:32',
    title: 'La luz sigue encendida.',
    body: () => decisions.includes('block-save')
      ? 'Cruzas desde Calle Mayor hasta Plaza de Cervantes. Paula contesta: «Estoy llegando; quédate donde haya gente». La cafetería sigue abierta. Bajo los soportales, al otro lado de la plaza, espera el encapuchado.'
      : 'Llegas a Plaza de Cervantes. Junto a la estatua de Cervantes ves una cafetería iluminada, con gente dentro. No has avisado a nadie. El mensaje vuelve a encender la pantalla: «Te vi junto a la Casa de Cervantes».',
    prompt: () => decisions.includes('block-save')
      ? 'Paula viene hacia la cafetería. ¿Esperas dentro o tomas el atajo?'
      : 'La cafetería está abierta. ¿Pides ayuda o tomas el atajo?',
    hotspots: [
      { id: 'cafe', label: 'La cafetería', x: 21, y: 57, align: 'right', response: 'Te acercas a la entrada: suena la campanilla y salen luz y voces. Dentro hay gente; puedes pedir ayuda sin entregar tus contraseñas ni publicar tu ubicación.' },
      { id: 'protagonist', label: 'La chica', x: 52, y: 75, align: 'center', response: 'Avanzas unos pasos por la plaza iluminada. Puedes entrar donde hay gente, llamar a Paula y decidir con calma qué compartir.' },
      { id: 'cartographer', label: 'La figura', x: 75, y: 56, align: 'left', response: 'Bajo los soportales, la figura parece estar mirando hacia ti. Cuando la luz de la plaza parpadea, ya no está junto a la farola.' }
    ],
    choices: () => [
      { id: 'go-cafe', risk: 0, label: decisions.includes('block-save') ? 'Entrar y esperar a Paula con gente alrededor' : 'Entrar y escribir a Paula para que venga' },
      { id: 'take-shortcut', risk: 1, label: 'Salir sola por Cardenal Sandoval y Rojas para despistarlo' }
    ]
  },
  {
    image: () => decisions.includes('go-cafe') ? 'assets/story/alcala-cafe.webp' : 'assets/story/alcala-portal.webp',
    ambience: () => decisions.includes('go-cafe') ? 'cafe' : 'street',
    place: () => decisions.includes('go-cafe') ? 'PLAZA DE CERVANTES · DENTRO DEL CAFÉ' : 'CARDENAL SANDOVAL Y ROJAS · UN PORTAL',
    kicker: () => decisions.includes('go-cafe') ? 'PLAZA DE CERVANTES · 23:38' : 'SANDOVAL Y ROJAS · 23:41',
    title: () => decisions.includes('go-cafe') ? 'No estás sola.' : 'El atajo termina en una puerta.',
    body: () => decisions.includes('go-cafe')
      ? 'Entras en la cafetería que viste desde la Plaza de Cervantes. Paula llega y te hace un sitio; detrás del cristal, la calle sigue mojada. Te pide que compartas tu ubicación solo con ella mientras vuelve a casa.'
      : 'Dejas atrás la Plaza de Cervantes y tomas la calle Cardenal Sandoval y Rojas. El portal está entornado; la luz del zaguán no alcanza la acera. La hora y la ruta de la publicación bastaron para que el Cartógrafo pareciera conocer tu rutina. Aún puedes volver a la plaza iluminada.',
    prompt: () => decisions.includes('go-cafe')
      ? 'Llega una última notificación. ¿Qué compartes ahora?'
      : '¿Qué haces al llegar al portal?',
    hotspots: () => decisions.includes('go-cafe') ? [
      { id: 'friend', label: 'Paula', x: 60, y: 58, align: 'right', response: 'Paula desliza una taza sobre la mesa y se queda contigo. Pedir apoyo no requiere entregar tus cuentas: basta con contar qué pasó y qué necesitas.' },
      { id: 'phone', label: 'La notificación', x: 28, y: 84, align: 'left', response: 'El mensaje exige saber dónde estás. No contestar y guardar una captura conserva una prueba sin abrir otro dato privado.' },
      { id: 'cartographer', label: 'El cristal', x: 88, y: 45, align: 'left', response: 'Afuera se oyen pasos que se alejan por la calle mojada. La amenaza no convierte en culpable a quien compartió una foto: la responsabilidad de invadir la intimidad es de quien lo hace.' }
    ] : [
      { id: 'protagonist', label: 'La chica', x: 22, y: 47, align: 'right', response: 'Retrocedes desde el portal. Puedes cambiar de rumbo, llamar a Paula y volver a la plaza iluminada.' },
      { id: 'door', label: 'El picaporte', x: 88, y: 69, align: 'left', response: 'El picaporte cede y la puerta cruje al abrirse unos centímetros. Aún puedes retroceder: entrar en un portal desconocido no te protege; la cafetería y las calles con gente siguen siendo una opción.' },
      { id: 'cartographer', label: 'La figura', x: 65, y: 49, align: 'left', response: 'Una respiración áspera raspa el silencio bajo la capucha. El encapuchado sigue al otro lado de la calle: la amenaza está en la información que reunió, no en una capacidad mágica para leer tu móvil.' }
    ],
    choices: () => decisions.includes('go-cafe') ? [
      { id: 'share-private', risk: 0, label: 'Guardar la prueba y compartir tu ubicación solo con Paula' },
      { id: 'post-cafe', risk: 1, label: 'Subir otra story en directo mostrando el café' }
    ] : [
      { id: 'return-light', risk: 0, label: 'Volver a la plaza y llamar a Paula desde la cafetería' },
      { id: 'open-portal', risk: 1, label: 'Entrar sola en el portal para esconderte' }
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
  progressNumber.textContent = `DECISIÓN ${number} DE ${scenes.length}`;
}

function sceneValue(value) {
  return typeof value === 'function' ? value() : value;
}

function renderScene(index) {
  const scene = scenes[index];
  currentScene = index;
  const hotspots = sceneValue(scene.hotspots);
  const sceneChoices = sceneValue(scene.choices);
  sceneImage.src = sceneValue(scene.image);
  setAmbientTrack(sceneValue(scene.ambience) || 'street');
  sceneKicker.textContent = sceneValue(scene.kicker);
  scenePlace.textContent = sceneValue(scene.place);
  sceneTitle.textContent = sceneValue(scene.title);
  sceneBody.textContent = sceneValue(scene.body);
  sceneClue.hidden = true;
  sceneClue.textContent = '';
  sceneImageWrap.classList.remove('is-disturbed', 'is-door-touched', 'is-camera-flash');
  sceneHotspots.classList.remove('is-disturbed', 'is-door-touched');
  sceneHotspots.innerHTML = hotspots.map((hotspot) => `
    <button class="story__hotspot story__hotspot--${hotspot.id}" type="button" data-hotspot="${hotspot.id}" style="left:${hotspot.x}%;top:${hotspot.y}%" aria-controls="scene-clue" aria-label="Tocar: ${hotspot.label}"></button>`).join('');
  choicePrompt.textContent = sceneValue(scene.prompt);
  choices.innerHTML = sceneChoices.map((choice, choiceIndex) => `
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
  const endedInCafe = ['share-private', 'post-cafe', 'return-light'].includes(lastDecision);
  const choseSupport = ['share-private', 'return-light'].includes(lastDecision);
  const finalImage = endedInCafe ? 'assets/story/alcala-cafe.webp' : 'assets/story/alcala-portal.webp';
  setAmbientTrack(endedInCafe ? 'cafe' : 'street');
  endingBackdrop.style.backgroundImage = `url("${finalImage}")`;
  endingKicker.textContent = endedInCafe ? 'PLAZA DE CERVANTES · CAFÉ · 23:48' : 'CARDENAL SANDOVAL Y ROJAS · 23:48';
  endingTitle.innerHTML = lastDecision === 'post-cafe'
    ? 'La foto<br><em>reabre el rastro.</em>'
    : lastDecision === 'return-light'
      ? 'Volviste<br><em>a la luz.</em>'
      : choseSupport
        ? 'No llegaste<br><em>sola.</em>'
        : 'El rastro<br><em>llegó a la puerta.</em>';
  endingOutcome.textContent = lastDecision === 'post-cafe'
    ? 'La nueva story enseña el café y la hora en directo. La exposición aumentó, pero eso nunca convierte la vigilancia en culpa de quien publica: la responsabilidad de invadir tu intimidad es de quien lo hace.'
    : lastDecision === 'open-portal'
      ? 'Abrir un portal desconocido no te habría protegido. Puedes pedir ayuda y volver a un lugar atendido. Seguirte sigue siendo responsabilidad del Cartógrafo, no tuya.'
      : riskScore === 0
        ? 'Quitaste la ubicación, no confirmaste tu horario, entraste en un lugar con gente y avisaste a Paula en privado. Cerraste varias pistas; el derecho a la intimidad merece protección en cualquier final.'
        : choseSupport
          ? 'Una pista quedó expuesta. Cambiaste de rumbo y buscaste compañía. Compartir una foto nunca da permiso para vigilarte: la responsabilidad es de quien invade la intimidad.'
          : 'El Cartógrafo reunió hora, lugar y rutina. Esto es ficción: publicar no autoriza a nadie a seguirte ni convierte en culpable a quien comparte una foto.';
  const answerLabels = {
    'live-location': 'publiqué mi ubicación en directo',
    'remove-location': 'quité la ubicación y esperé',
    'reply-routine': 'confirmé mi horario',
    'block-save': 'guardé pruebas, bloqueé y pedí apoyo',
    'go-cafe': 'entré en la cafetería y busqué compañía',
    'take-shortcut': 'salí sola por el atajo',
    'share-private': 'compartí mi ubicación solo con Paula',
    'post-cafe': 'publiqué otra story en directo',
    'return-light': 'volví a la plaza iluminada',
    'open-portal': 'entré sola al portal'
  };
  const answerRoute = decisions.map((decision, index) => `${index + 1}. ${answerLabels[decision] || 'elegí una opción'}`).join(' · ');
  const endingLabels = {
    'share-private': 'Terminé acompañada en la cafetería.',
    'post-cafe': 'Llegué a la cafetería, pero volví a publicar en directo.',
    'return-light': 'Volví a la plaza iluminada.',
    'open-portal': 'Entré sola al portal.'
  };
  const endingLabel = endingLabels[lastDecision] || 'Mi recorrido terminó en Alcalá.';
  shareSummary.textContent = `Mis respuestas: ${answerRoute}. ${endingLabel} La intimidad también es libertad.`;
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
  tensionLevel = 0;
  lastDecision = '';
  cartographerNoticed = false;
  cafeEntranceRang = false;
  decisions.length = 0;
  story.dataset.risk = '0';
  story.dataset.tension = '0';
  updateSoundtrackMood(tensionLevel);
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
  tensionLevel = 0;
  lastDecision = '';
  cartographerNoticed = false;
  cafeEntranceRang = false;
  currentScene = -1;
  decisions.length = 0;
  story.dataset.risk = '0';
  story.dataset.tension = '0';
  story.dataset.lastDecision = '';
  updateSoundtrackMood(tensionLevel);
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
  if (!button) return;
  const hotspot = sceneValue(scenes[currentScene]?.hotspots)?.find((item) => item.id === button.dataset.hotspot);
  if (!hotspot) return;
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
    sceneImageWrap.classList.remove('is-door-touched');
    sceneHotspots.classList.remove('is-door-touched');
    void sceneImageWrap.offsetWidth;
    sceneImageWrap.classList.add('is-door-touched');
    sceneHotspots.classList.add('is-door-touched');
  }
  if (isThreat) {
    navigator.vibrate?.([20, 28, 42]);
    if (currentScene <= 1) playCartographerLaugh();
    else if (currentScene === 3 && !decisions.includes('go-cafe')) playCartographerBreath();
    else if (currentScene !== 3 || decisions.includes('go-cafe')) playFootsteps(0.58);
  } else if (hotspot.id === 'door') {
    navigator.vibrate?.(42);
    playDoorCreak();
  } else if (hotspot.id === 'protagonist') {
    navigator.vibrate?.(18);
    if (currentScene < 2) {
      sceneImageWrap.classList.remove('is-camera-flash');
      void sceneImageWrap.offsetWidth;
      sceneImageWrap.classList.add('is-camera-flash');
      playCameraFlash();
    } else {
      playFootsteps(0.58);
    }
  } else if (hotspot.id === 'phone') {
    navigator.vibrate?.(14);
    playMessageAlert();
  } else if (hotspot.id === 'landmark') {
    navigator.vibrate?.(14);
    playFootsteps(0.58);
  } else if (hotspot.id === 'friend') {
    navigator.vibrate?.(14);
    playCoffeeCup();
  } else if (hotspot.id === 'cafe') {
    navigator.vibrate?.(14);
    playCafeDoorbell();
    cafeEntranceRang = true;
  }
  announce('hotspot', { id: hotspot.id, scene: currentScene + 1, threat: isThreat });
});

choices.addEventListener('click', (event) => {
  const button = event.target.closest('[data-choice]');
  if (!button || choices.hidden) return;
  lastDecision = button.dataset.choice;
  riskScore += Number(button.dataset.risk);
  tensionLevel = Math.max(0, Math.min(3, tensionLevel + (Number(button.dataset.risk) ? 1 : -1)));
  decisions.push(lastDecision);
  story.dataset.risk = String(riskScore);
  story.dataset.tension = String(tensionLevel);
  story.dataset.lastDecision = lastDecision;
  updateSoundtrackMood(tensionLevel);
  choices.querySelectorAll('[data-choice]').forEach((choice) => {
    choice.setAttribute('aria-pressed', String(choice === button));
    choice.disabled = true;
  });
  choices.classList.add('has-selection');
  continueButton.hidden = false;
  continueLabel.textContent = currentScene === scenes.length - 1 ? 'Ver cómo termina' : 'Continuar';
  announce('choice', { choice: lastDecision, risk: riskScore, scene: currentScene + 1 });
  navigator.vibrate?.(Number(button.dataset.risk) ? [35, 45, 70] : 24);
  if (lastDecision === 'go-cafe' && !cafeEntranceRang) playCafeDoorbell();
  else if (lastDecision === 'live-location') playCameraFlash();
  else if (['take-shortcut', 'return-light'].includes(lastDecision)) playFootsteps();
  else if (['block-save', 'post-cafe'].includes(lastDecision)) playCameraFlash();
  else if (lastDecision === 'open-portal') playDoorCreak();
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
const ambienceTracks = {
  street: 'assets/audio/alcala-night-city.mp3',
  cafe: 'assets/audio/cafe-crowd.mp3'
};
const scoreSources = {
  hopeful: 'assets/audio/soft-hopeful-bed.mp3',
  ominous: 'assets/audio/echoes.mp3',
  horror: 'assets/audio/piano-horror.mp3'
};
let currentAmbience = 'street';
const licensedAmbience = new Audio(ambienceTracks.street);
licensedAmbience.loop = true;
licensedAmbience.preload = 'none';
licensedAmbience.volume = 0.24;
const scorePlayers = Object.fromEntries(Object.entries(scoreSources).map(([mood, source]) => {
  const player = new Audio(source);
  player.loop = true;
  player.preload = 'none';
  player.volume = 0;
  return [mood, player];
}));
let currentScoreMood = 'hopeful';
let storyMusic = scorePlayers[currentScoreMood];
storyMusic.volume = 0.2;
let ambientOn = false;
let soundscapeDuckTimer = 0;
let activeSoundEffect = null;
let ambienceTargetVolume = 0.24;
let musicTargetVolume = 0.2;
const audioFadeFrames = new WeakMap();

const soundEffects = {
  camera: 'assets/audio/camera-shutter.mp3',
  doorCreak: 'assets/audio/door-creak.mp3',
  footsteps: 'assets/audio/wet-pavement-steps.mp3',
  message: 'assets/audio/message-alert.mp3',
  cafeDoorbell: 'assets/audio/cafe-doorbell.mp3',
  coffeeCup: 'assets/audio/coffee-cup-setdown.mp3',
  cartographerLaugh: 'assets/audio/cartographer-laugh.mp3',
  cartographerBreath: 'assets/audio/cartographer-breath.mp3'
};

function setAmbientTrack(name) {
  const nextName = name in ambienceTracks ? name : 'street';
  if (currentAmbience === nextName) return;
  const resume = ambientOn && !licensedAmbience.paused;
  licensedAmbience.pause();
  currentAmbience = nextName;
  licensedAmbience.src = ambienceTracks[nextName];
  if (resume) {
    licensedAmbience.load();
    licensedAmbience.play().catch(() => turnSoundOff());
  }
}

function playSoundEffect(name, volume = 0.46, delay = 0, maxDuration = 0) {
  const source = soundEffects[name];
  if (!source) return;
  const play = () => {
    duckSoundscapeFor(['cartographerLaugh', 'cartographerBreath'].includes(name) ? 2400 : 900);
    if (activeSoundEffect) {
      activeSoundEffect.pause();
      activeSoundEffect.currentTime = 0;
    }
    const effect = new Audio(source);
    effect.volume = volume;
    activeSoundEffect = effect;
    effect.addEventListener('ended', () => {
      if (activeSoundEffect === effect) activeSoundEffect = null;
    }, { once: true });
    if (maxDuration) window.setTimeout(() => {
      if (activeSoundEffect === effect) {
        effect.pause();
        activeSoundEffect = null;
      }
    }, maxDuration);
    effect.play().catch(() => {
      if (activeSoundEffect === effect) activeSoundEffect = null;
    });
  };
  if (delay) window.setTimeout(play, delay);
  else play();
}

function updateSoundControls(active, mode = 'none') {
  ambientOn = active;
  soundLabel.textContent = 'Música';
  soundState.textContent = active ? 'ON' : 'OFF';
  soundToggle.setAttribute('aria-pressed', String(active));
  soundToggle.setAttribute('aria-label', active ? 'Apagar música y ambiente; los efectos al tocar siguen activos' : 'Activar música y ambiente; los efectos al tocar siguen activos');
  opening.classList.toggle('is-audio-on', active);
  announce('audio', { active, mode });
}

function turnSoundOn() {
  if (ambientOn) return;
  updateSoundtrackMood(tensionLevel);
  storyMusic.volume = musicTargetVolume;
  storyMusic.play().catch(() => {});
  const playback = licensedAmbience.play();
  if (!playback?.then) {
    updateSoundControls(true, 'licensed-track');
    return;
  }
  playback.then(() => updateSoundControls(true, 'licensed-track'))
    .catch(() => {
      soundLabel.textContent = 'Reintentar';
      soundState.textContent = 'OFF';
      soundToggle.setAttribute('aria-label', 'No se pudo iniciar la música de ambiente. Toca para reintentar. Los efectos al tocar siguen activos.');
    });
}

function turnSoundOff() {
  window.clearTimeout(soundscapeDuckTimer);
  cancelAudioFade(licensedAmbience);
  licensedAmbience.pause();
  licensedAmbience.currentTime = 0;
  licensedAmbience.volume = ambienceTargetVolume;
  Object.values(scorePlayers).forEach((player) => {
    cancelAudioFade(player);
    player.pause();
    player.currentTime = 0;
    player.volume = player === storyMusic ? musicTargetVolume : 0;
  });
  updateSoundControls(false);
}

function cancelAudioFade(audio) {
  const frame = audioFadeFrames.get(audio);
  if (frame) window.cancelAnimationFrame(frame);
  audioFadeFrames.delete(audio);
}

function fadeAudioTo(audio, target, duration = 700) {
  cancelAudioFade(audio);
  const startVolume = audio.volume;
  const startedAt = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    audio.volume = startVolume + (target - startVolume) * progress;
    if (progress < 1) audioFadeFrames.set(audio, window.requestAnimationFrame(step));
    else audioFadeFrames.delete(audio);
  };
  audioFadeFrames.set(audio, window.requestAnimationFrame(step));
}

function updateSoundtrackMood(level) {
  const intensity = Math.max(0, Math.min(3, Number(level) || 0));
  const moods = [
    { track: 'hopeful', music: 0.23 },
    { track: 'ominous', music: 0.25 },
    { track: 'horror', music: 0.29 },
    { track: 'horror', music: 0.36 }
  ];
  const mood = moods[intensity];
  musicTargetVolume = mood.music;
  if (mood.track !== currentScoreMood) {
    const previousMusic = storyMusic;
    const nextMusic = scorePlayers[mood.track];
    const shouldCrossfade = ambientOn && !previousMusic.paused && !document.hidden;
    currentScoreMood = mood.track;
    storyMusic = nextMusic;
    cancelAudioFade(nextMusic);
    nextMusic.pause();
    nextMusic.currentTime = 0;
    nextMusic.volume = 0;

    if (shouldCrossfade) {
      nextMusic.play().catch(() => {});
      fadeAudioTo(previousMusic, 0, 1150);
      fadeAudioTo(nextMusic, musicTargetVolume, 1150);
      window.setTimeout(() => {
        if (storyMusic !== previousMusic) {
          previousMusic.pause();
          previousMusic.currentTime = 0;
        }
      }, 1200);
    } else {
      previousMusic.pause();
      previousMusic.currentTime = 0;
      nextMusic.volume = musicTargetVolume;
    }
    return;
  }
  if (ambientOn && !storyMusic.paused) fadeAudioTo(storyMusic, musicTargetVolume, 900);
  else storyMusic.volume = musicTargetVolume;
}

function duckSoundscapeFor(milliseconds = 900) {
  if (!ambientOn) return;
  fadeAudioTo(licensedAmbience, ambienceTargetVolume * 0.26, 80);
  Object.values(scorePlayers).forEach((player) => {
    fadeAudioTo(player, player === storyMusic ? musicTargetVolume * 0.18 : 0, 80);
  });
  window.clearTimeout(soundscapeDuckTimer);
  soundscapeDuckTimer = window.setTimeout(() => {
    if (!ambientOn) return;
    if (!licensedAmbience.paused) fadeAudioTo(licensedAmbience, ambienceTargetVolume, 600);
    if (!storyMusic.paused) fadeAudioTo(storyMusic, musicTargetVolume, 600);
    updateSoundtrackMood(tensionLevel);
  }, milliseconds);
}

function playCameraFlash(volume = 0.55) {
  playSoundEffect('camera', volume);
}

function playFootsteps(volume = 0.62) {
  playSoundEffect('footsteps', volume);
}

function playDoorCreak() {
  playSoundEffect('doorCreak', 0.66);
}

function playMessageAlert() {
  playSoundEffect('message', 0.64);
}

function playCafeDoorbell() {
  playSoundEffect('cafeDoorbell', 0.62);
}

function playCoffeeCup() {
  playSoundEffect('coffeeCup', 0.62);
}

function playCartographerLaugh() {
  playSoundEffect('cartographerLaugh', 0.58);
}

function playCartographerBreath() {
  playSoundEffect('cartographerBreath', 0.64);
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
document.addEventListener('visibilitychange', () => {
  if (document.hidden && ambientOn) {
    licensedAmbience.pause();
    Object.values(scorePlayers).forEach((player) => player.pause());
  } else if (!document.hidden && ambientOn) {
    if (licensedAmbience.currentTime > 0) licensedAmbience.play().catch(() => turnSoundOff());
    if (storyMusic.currentTime > 0) storyMusic.play().catch(() => {});
  }
});
