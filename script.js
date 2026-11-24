import { justify } from './assets/justif/dist/index.js';
import { hyphenateEs } from './assets/justif/dist/hyphenate/es.js';
import { getLanguage, setLanguage, text as localized, t } from './language.js?v=fluorescent-rain-beats-20261124';

const opening = document.querySelector('.opening');
const story = document.querySelector('.story');
const reveal = document.querySelector('.reveal');
const sceneImage = document.querySelector('#scene-image');
const sceneReflection = document.querySelector('#scene-reflection');
const sceneImageWrap = document.querySelector('#scene-image-wrap');
const sceneReaction = document.querySelector('#scene-reaction');
const sceneKicker = document.querySelector('#scene-kicker');
const scenePlace = document.querySelector('#scene-place');
const sceneTitle = document.querySelector('#story-title');
const sceneBody = document.querySelector('#scene-body');
const sceneExploreHint = document.querySelector('#scene-explore-hint');
const sceneHotspots = document.querySelector('#scene-hotspots');
const sceneClue = document.querySelector('#scene-clue');
const sceneInterruption = document.querySelector('#scene-interruption');
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
const languageToggle = document.querySelector('#language-toggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = reduceMotion ? 'auto' : 'smooth';
let textLayoutController;

function applyTextLayout() {
  textLayoutController?.destroy();
  const paragraphs = [...document.querySelectorAll('.copy-justify')]
    .filter((paragraph) => paragraph.getClientRects().length > 0 && !paragraph.closest('.campaign-ending'));
  textLayoutController = paragraphs.length
    ? justify(paragraphs, { hyphenate: hyphenateEs })
    : undefined;
}

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
let activeHotspotId = '';
let activeBeatClass = '';
let activeBeatResetTimer = 0;
const copy = (es, en) => () => localized(es, en);

const scenes = [
  {
    image: 'assets/story/alcala-night.webp?v=alcala-casa-20261124',
    place: copy('CALLE MAYOR 48 \u00b7 CASA NATAL DE CERVANTES', '48 CALLE MAYOR \u00b7 CERVANTES BIRTHPLACE MUSEUM'),
    kicker: copy('CALLE MAYOR \u00b7 23:17', 'CALLE MAYOR \u00b7 11:17 P.M.'),
    title: copy('\u00bfPublicas la foto?', 'Do you post the photo?'),
    exploreHint: copy('Toca la c\u00e1mara, la fachada o al Cart\u00f3grafo. Cada toque revela una pista.', 'Tap the camera, the fa\u00e7ade or the Cartographer. Each tap reveals a clue.'),
    body: copy('Son las 23:17. Est\u00e1s frente a la Casa Natal de Cervantes, en el n\u00famero 48 de Calle Mayor. Has fotografiado la fachada. La hora y lo que aparece detr\u00e1s pueden revelar d\u00f3nde est\u00e1s.', 'It is 11:17 p.m. You are outside Cervantes Birthplace Museum at 48 Calle Mayor. You took a photo of the fa\u00e7ade. The time and background can reveal where you are.'),
    prompt: copy('\u00bfQu\u00e9 haces con la foto?', 'What do you do with the photo?'),
    hotspots: [
      { id: 'protagonist', label: copy('Tu m\u00f3vil', 'Your phone'), x: 28, y: 62, align: 'right', response: copy('El obturador suena en la calle mojada. En la foto quedan la fachada y la hora.', 'The shutter cuts through the wet street. The fa\u00e7ade and time are now in the photo.') },
      { id: 'landmark', label: copy('La Casa de Cervantes', 'Cervantes House'), x: 51, y: 45, align: 'center', response: copy('La fachada de ladrillo y las figuras de bronce identifican la Casa Natal de Cervantes, en Calle Mayor 48.', 'The brick fa\u00e7ade and bronze figures identify Cervantes Birthplace Museum at 48 Calle Mayor.') },
      { id: 'cartographer', label: copy('El Cart\u00f3grafo', 'The Cartographer'), x: 82, y: 48, align: 'left', response: copy('Levanta la cabeza bajo la capucha. No ves su cara. Una risa breve se mezcla con la lluvia.', 'He raises his hooded head. You cannot see his face. A short laugh blends into the rain.') }
    ],
    choices: [
      { id: 'live-location', risk: 1, label: copy('Publicarla ahora con mi ubicaci\u00f3n en directo', 'Post it now with my live location') },
      { id: 'remove-location', risk: 0, label: copy('Quitar la ubicaci\u00f3n y publicarla sin etiqueta', 'Remove the location tag before posting') }
    ]
  },
  {
    image: 'assets/story/alcala-reflection.webp?v=alcala-mayor-20261124',
    place: copy('CALLE MAYOR \u00b7 BAJO LOS SOPORTALES', 'CALLE MAYOR \u00b7 UNDER THE ARCADES'),
    kicker: copy('CALLE MAYOR \u00b7 23:24', 'CALLE MAYOR \u00b7 11:24 P.M.'),
    title: copy('\u00abS\u00e9 a qu\u00e9 hora vuelves\u00bb.', 'I know what time you come back.'),
    exploreHint: copy('Toca el m\u00f3vil, a la protagonista o el reflejo rojo. La pista aparece debajo.', 'Tap the phone, the woman or the red reflection. The clue appears below.'),
    body: () => riskScore > 0
      ? localized('Sigues por los soportales de Calle Mayor. Publicaste la ubicaci\u00f3n en directo y una cuenta desconocida responde a tu historia: \u00abS\u00e9 a qu\u00e9 hora vuelves\u00bb.', 'You keep walking under Calle Mayor arcades. You shared your live location, and an unknown account replies to your story: I know what time you come back.')
      : localized('Sigues por los soportales de Calle Mayor. Quitaste la etiqueta, pero la fachada y la hora siguen en la foto. Una cuenta desconocida responde: \u00abS\u00e9 a qu\u00e9 hora vuelves\u00bb.', 'You keep walking under Calle Mayor arcades. You removed the tag, but the fa\u00e7ade and time are still in the photo. An unknown account replies: I know what time you come back.'),
    prompt: copy('Te pregunta a qu\u00e9 hora sales. \u00bfQu\u00e9 haces?', 'The account asks what time you leave. What do you do?'),
    hotspots: [
      { id: 'protagonist', label: copy('T\u00fa', 'You'), x: 36, y: 63, align: 'right', response: copy('El reflejo rojo aparece a tu espalda. No tienes que contestar ni acercarte.', 'The red reflection appears behind you. You do not have to answer or go closer.') },
      { id: 'phone', label: copy('El m\u00f3vil', 'The phone'), x: 62, y: 55, align: 'center', response: copy('El m\u00f3vil vibra. La foto muestra la hora y un lugar reconocible. Nadie ha entrado en tu tel\u00e9fono: basta con ver lo que publicaste.', 'Your phone vibrates. The photo shows the time and a recognizable place. No one accessed your phone; what you posted was enough.') },
      { id: 'cartographer', label: copy('El reflejo', 'The reflection'), x: 86, y: 48, align: 'left', response: copy('Tocas el cristal. La figura roja se mueve antes que tu reflejo. Oyes una risa al otro lado de la ventana.', 'You touch the glass. The red figure moves before your reflection does. A laugh comes from the other side of the window.') }
    ],
    choices: [
      { id: 'reply-routine', risk: 1, label: copy('Decirle a qu\u00e9 hora suelo salir', 'Tell them what time I usually leave') },
      { id: 'block-save', risk: 0, label: copy('Guardar el mensaje, bloquear la cuenta y llamar a Paula', 'Save the message, block the account and call Paula') }
    ]
  },
  {
    image: 'assets/story/alcala-plaza-exterior.webp?v=alcala-plaza-20261124',
    ambience: 'street',
    place: copy('PLAZA DE CERVANTES \u00b7 CAF\u00c9 DE LA PLAZA', 'PLAZA DE CERVANTES \u00b7 CAF\u00c9 ON THE SQUARE'),
    kicker: copy('PLAZA DE CERVANTES \u00b7 23:32', 'PLAZA DE CERVANTES \u00b7 11:32 P.M.'),
    title: copy('Paula ya viene.', 'Paula is on her way.'),
    exploreHint: copy('Toca el caf\u00e9, el m\u00f3vil o la farola junto al Cart\u00f3grafo.', 'Tap the caf\u00e9, the phone or the lamppost beside the Cartographer.'),
    body: () => decisions.includes('block-save')
      ? localized('Llegas a la Plaza de Cervantes. Ya llamaste a Paula y quedasteis en el caf\u00e9. Ella va de camino. Bajo los \u00e1rboles, ves al Cart\u00f3grafo junto a una farola.', 'You reach Plaza de Cervantes. You called Paula and agreed to meet at the caf\u00e9. She is on her way. Beneath the trees, you see the Cartographer beside a lamppost.')
      : localized('Llegas a la Plaza de Cervantes. Le escribes a Paula y qued\u00e1is en el caf\u00e9. Ella va de camino. Bajo los \u00e1rboles, ves al Cart\u00f3grafo junto a una farola.', 'You reach Plaza de Cervantes. You message Paula and agree to meet at the caf\u00e9. She is on her way. Beneath the trees, you see the Cartographer beside a lamppost.'),
    prompt: copy('\u00bfEsperas a Paula dentro o sigues sola?', 'Do you wait inside for Paula or keep walking alone?'),
    hotspots: [
      { id: 'cafe', label: copy('El caf\u00e9', 'The caf\u00e9'), x: 22, y: 59, align: 'right', response: copy('La puerta se abre y suena la campanilla. Hay clientes y personal dentro. Puedes esperar ah\u00ed a Paula.', 'The door opens and its bell rings. Customers and staff are inside. You can wait there for Paula.') },
      { id: 'phone', label: copy('Tu m\u00f3vil', 'Your phone'), x: 35, y: 62, align: 'left', response: copy('Paula confirma que est\u00e1 a cinco minutos. Puedes compartir tu ubicaci\u00f3n solo con ella mientras llega.', 'Paula says she is five minutes away. You can share your location with her only while she gets here.') },
      { id: 'cartographer', label: copy('La farola', 'The lamppost'), x: 78, y: 47, align: 'left', response: copy('La farola parpadea y se apaga. Cuando vuelve la luz, el Cart\u00f3grafo ya no est\u00e1 junto al poste.', 'The lamppost flickers and goes dark. When the light returns, the Cartographer is no longer beside it.') }
    ],
    choices: [
      { id: 'go-cafe', risk: 0, label: copy('Entrar al caf\u00e9 y esperar a Paula', 'Go into the caf\u00e9 and wait for Paula') },
      { id: 'take-shortcut', risk: 1, label: copy('Seguir sola por Cardenal Sandoval y Rojas', 'Continue alone along Cardenal Sandoval y Rojas') }
    ]
  },
  {
    image: () => decisions.includes('go-cafe') ? 'assets/story/alcala-cafe.webp?v=alcala-cafe-20261124' : 'assets/story/alcala-portal.webp?v=alcala-puerta-female-night-20261124',
    ambience: () => decisions.includes('go-cafe') ? 'cafe' : 'street',
    place: () => localized(decisions.includes('go-cafe') ? 'PLAZA DE CERVANTES \u00b7 CAF\u00c9' : 'PASEO CARDENAL SANDOVAL Y ROJAS \u00b7 PUERTA DE MADRID', decisions.includes('go-cafe') ? 'PLAZA DE CERVANTES \u00b7 CAF\u00c9' : 'PASEO CARDENAL SANDOVAL Y ROJAS \u00b7 PUERTA DE MADRID'),
    kicker: () => localized(decisions.includes('go-cafe') ? 'PLAZA DE CERVANTES \u00b7 23:38' : 'PUERTA DE MADRID \u00b7 23:41', decisions.includes('go-cafe') ? 'PLAZA DE CERVANTES \u00b7 11:38 P.M.' : 'PUERTA DE MADRID \u00b7 11:41 P.M.'),
    title: () => localized(decisions.includes('go-cafe') ? 'Paula est\u00e1 contigo.' : 'La farola falla.', decisions.includes('go-cafe') ? 'Paula is with you.' : 'The lamppost falters.'),
    exploreHint: () => decisions.includes('go-cafe')
      ? localized('Toca a Paula, el mensaje o la ventana. Cada toque activa una pista.', 'Tap Paula, the message or the window. Each tap reveals a clue.')
      : localized('Toca el arco, a la protagonista o al Cart\u00f3grafo. Cada toque activa una pista.', 'Tap the arch, the woman or the Cartographer. Each tap reveals a clue.'),
    body: () => decisions.includes('go-cafe')
      ? localized('Entras al caf\u00e9 de la Plaza de Cervantes. Paula llega y se sienta contigo. A trav\u00e9s del cristal ves al Cart\u00f3grafo fuera, bajo la lluvia. Puedes compartir tu ubicaci\u00f3n solo con Paula hasta llegar a casa.', 'You enter the caf\u00e9 on Plaza de Cervantes. Paula arrives and sits with you. Through the glass, you see the Cartographer outside in the rain. You can share your location only with Paula until you get home.')
      : localized('Sigues por el Paseo de Cardenal Sandoval y Rojas hasta la Puerta de Madrid. El arco de piedra aparece al final del paseo. La farola parpadea y una sombra roja cruza el otro lado. Puedes volver hacia la plaza y buscar a Paula.', 'You follow Paseo de Cardenal Sandoval y Rojas to Puerta de Madrid. The stone arch appears at the end of the promenade. The lamppost flickers and a red shadow crosses the other side. You can turn back toward the square and find Paula.'),
    prompt: () => decisions.includes('go-cafe')
      ? localized('Paula est\u00e1 a tu lado. \u00bfQu\u00e9 haces con el mensaje?', 'Paula is beside you. What do you do with the message?')
      : localized('Est\u00e1s frente a la Puerta de Madrid. \u00bfQu\u00e9 haces?', 'You are at Puerta de Madrid. What do you do?'),
    hotspots: () => decisions.includes('go-cafe') ? [
      { id: 'friend', label: copy('Paula', 'Paula'), x: 62, y: 57, align: 'right', response: copy('Paula se queda contigo. Cu\u00e9ntale qu\u00e9 pas\u00f3 y qu\u00e9 necesitas. No tienes que compartir tus contrase\u00f1as.', 'Paula stays with you. Tell her what happened and what you need. You do not have to share your passwords.') },
      { id: 'phone', label: copy('El mensaje', 'The message'), x: 29, y: 86, align: 'left', response: copy('Guarda una captura y bloquea la cuenta. El mensaje no le da derecho a acercarse a ti.', 'Save a screenshot and block the account. The message does not give them the right to approach you.') },
      { id: 'cartographer', label: copy('La ventana', 'The window'), x: 88, y: 46, align: 'left', response: copy('Los pasos se alejan por la plaza. Publicar una foto no da permiso para seguirte. La responsabilidad es de quien te sigue.', 'Footsteps fade across the square. Posting a photo does not give anyone permission to follow you. The person following you is responsible.') }
    ] : [
      { id: 'protagonist', label: copy('T\u00fa', 'You'), x: 27, y: 68, align: 'right', response: copy('Gira hacia la plaza iluminada. Llama a Paula y vuelve por el paseo, donde hay m\u00e1s gente.', 'Turn back toward the lit square. Call Paula and return along the promenade, where more people are around.') },
      { id: 'gate', label: copy('Puerta de Madrid', 'Puerta de Madrid'), x: 52, y: 38, align: 'center', response: copy('El arco est\u00e1 abierto a la calle. La farola falla y una sombra roja cruza el otro lado. No tienes que seguir adelante.', 'The arch opens onto the street. The lamppost falters and a red shadow crosses the other side. You do not have to go on.') },
      { id: 'cartographer', label: copy('El Cart\u00f3grafo', 'The Cartographer'), x: 60, y: 62, align: 'left', response: copy('Su respiraci\u00f3n llega desde el otro lado del arco. Bajo la capucha no hay un rostro visible. Retrocede hacia la plaza y llama a Paula.', 'You hear him breathe from the other side of the arch. His face is hidden under the hood. Step back toward the square and call Paula.') }
    ],
    choices: () => decisions.includes('go-cafe') ? [
      { id: 'share-private', risk: 0, label: copy('Guardar el mensaje y compartir mi ubicaci\u00f3n solo con Paula', 'Save the message and share my location with Paula only') },
      { id: 'post-cafe', risk: 1, label: copy('Publicar otra foto del caf\u00e9 ahora', 'Post another photo of the caf\u00e9 now') }
    ] : [
      { id: 'return-light', risk: 0, label: copy('Volver a la plaza y llamar a Paula', 'Return to the square and call Paula') },
      { id: 'open-portal', risk: 1, label: copy('Seguir sola bajo el arco de la Puerta de Madrid', 'Continue alone beneath the Puerta de Madrid arch') }
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
  screenModeShortLabel.textContent = immersive ? t('immersiveScreen') : t('normalScreen');
  screenModeShortcut.setAttribute('aria-pressed', String(immersive));
  screenModeShortcut.setAttribute('aria-label', immersive ? t('returnNormal') : t('rotatePrompt'));
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
  progressNumber.textContent = t('progress', { n: number, total: scenes.length });
}

function sceneValue(value) {
  return typeof value === 'function' ? value() : value;
}

const depthTimers = new WeakMap();
function aimPerspective(container, clientX, clientY, range = 1, reference = container) {
  if (reduceMotion) return;
  const rect = reference.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const x = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width - 0.5) * 2));
  const y = Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height - 0.5) * 2));
  container.style.setProperty('--tilt-x', `${(x * range).toFixed(2)}deg`);
  container.style.setProperty('--tilt-y', `${(-y * range * 0.72).toFixed(2)}deg`);
}

function releasePerspective(container, delay = 850) {
  window.clearTimeout(depthTimers.get(container));
  depthTimers.set(container, window.setTimeout(() => {
    container.style.setProperty('--tilt-x', '0deg');
    container.style.setProperty('--tilt-y', '0deg');
    container.style.setProperty('--depth-photo-x', '0px');
    container.style.setProperty('--depth-photo-y', '0px');
    container.classList.remove('is-depth-dragging');
  }, delay));
}

if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  for (const surface of [opening, story]) {
    surface.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        aimPerspective(surface, event.clientX, event.clientY, surface === opening ? 3.1 : 2.7);
      }
    }, { passive: true });
    surface.addEventListener('pointerleave', () => releasePerspective(surface, 0), { passive: true });
  }
}

let depthGesture;
let suppressHotspotClickUntil = 0;
let suppressImageClickUntil = 0;
let suppressedHotspot;
function enableTouchPerspective(surface, visual, range) {
  surface.addEventListener('pointerdown', (event) => {
    if (reduceMotion || event.pointerType !== 'touch' || !event.isPrimary || depthGesture) return;
    if (event.target.closest('button:not(.story__hotspot), a, summary, input')) return;
    const rect = visual.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
    depthGesture = { surface, visual, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false, hotspot: event.target.closest('[data-hotspot]') };
  }, { passive: true });

  surface.addEventListener('pointermove', (event) => {
    if (!depthGesture || depthGesture.surface !== surface || depthGesture.pointerId !== event.pointerId) return;
    const rect = visual.getBoundingClientRect();
    const dragX = event.clientX - depthGesture.startX;
    const dragY = event.clientY - depthGesture.startY;
    if (!depthGesture.moved && (Math.abs(dragX) < 10 || Math.abs(dragX) < Math.abs(dragY) * 1.12)) return;
    depthGesture.moved = true;
    suppressImageClickUntil = Date.now() + 420;
    surface.classList.add('is-depth-dragging');
    const x = Math.max(-1, Math.min(1, dragX / 64));
    const y = Math.max(-1, Math.min(1, dragY / 52));
    surface.style.setProperty('--tilt-x', `${(x * range).toFixed(2)}deg`);
    surface.style.setProperty('--tilt-y', `${(-y * range * 0.62).toFixed(2)}deg`);
    surface.style.setProperty('--depth-photo-x', `${(-x * 17).toFixed(1)}px`);
    surface.style.setProperty('--depth-photo-y', `${(-y * 11).toFixed(1)}px`);
  }, { passive: true });

  const finishGesture = (event) => {
    if (!depthGesture || depthGesture.surface !== surface || depthGesture.pointerId !== event.pointerId) return;
    if (depthGesture.moved) {
      if (depthGesture.hotspot) {
        suppressedHotspot = depthGesture.hotspot;
        suppressHotspotClickUntil = Date.now() + 350;
      }
      releasePerspective(surface, 320);
    }
    depthGesture = undefined;
  };
  surface.addEventListener('pointerup', finishGesture, { passive: true });
  surface.addEventListener('pointercancel', finishGesture, { passive: true });
}

enableTouchPerspective(opening, opening.querySelector('.opening__visual'), 3.8);
enableTouchPerspective(story, sceneImageWrap, 4.1);

function objectPositionFraction(value, axis) {
  const parts = value.trim().split(/\s+/);
  const token = parts[axis] || (axis === 0 ? '50%' : '50%');
  if (token === 'left' || token === 'top') return 0;
  if (token === 'right' || token === 'bottom') return 1;
  if (token === 'center') return 0.5;
  return Number.parseFloat(token) / 100 || 0;
}

function positionSceneHotspots() {
  if (currentScene < 0 || !sceneImage.naturalWidth || !sceneImage.naturalHeight) return;
  const stageWidth = sceneImageWrap.clientWidth;
  const stageHeight = sceneImageWrap.clientHeight;
  const stageRect = sceneImageWrap.getBoundingClientRect();
  const overlayRect = sceneHotspots.getBoundingClientRect();
  if (!stageWidth || !stageHeight || !overlayRect.width || !overlayRect.height) return;

  const scale = Math.max(stageWidth / sceneImage.naturalWidth, stageHeight / sceneImage.naturalHeight);
  const renderedWidth = sceneImage.naturalWidth * scale;
  const renderedHeight = sceneImage.naturalHeight * scale;
  const position = getComputedStyle(sceneImage).objectPosition;
  const offsetX = (stageWidth - renderedWidth) * objectPositionFraction(position, 0);
  const offsetY = (stageHeight - renderedHeight) * objectPositionFraction(position, 1);

  sceneHotspots.querySelectorAll('[data-hotspot]').forEach((button) => {
    const hotspot = sceneValue(scenes[currentScene].hotspots).find((item) => item.id === button.dataset.hotspot);
    if (!hotspot) return;
    const imageX = (hotspot.x / 100) * renderedWidth + offsetX;
    const imageY = (hotspot.y / 100) * renderedHeight + offsetY;
    const screenX = stageRect.left + (imageX / stageWidth) * stageRect.width;
    const screenY = stageRect.top + (imageY / stageHeight) * stageRect.height;
    button.style.left = `${((screenX - overlayRect.left) / overlayRect.width) * 100}%`;
    button.style.top = `${((screenY - overlayRect.top) / overlayRect.height) * 100}%`;
  });
}

function showHotspotClue(hotspot) {
  const target = document.createElement('span');
  target.className = 'story__clue-target';
  target.textContent = localized(`PISTA: ${sceneValue(hotspot.label)}`, `CLUE: ${sceneValue(hotspot.label)}`);
  sceneClue.replaceChildren(target, document.createTextNode(sceneValue(hotspot.response)));
  sceneClue.hidden = false;
}

let sceneInterruptionTimer = 0;
let sceneInterruptionHideTimer = 0;
let sceneInterruptionRemoveTimer = 0;
let sceneInterruptionEffectTimer = 0;
let lampBuzzTimer = 0;
let lampBuzzStopTimer = 0;
let activeLampBuzz = null;
let sceneAudioCueTimers = [];
let sceneAudioPlayers = new Set();
const sceneAudioVolumes = new WeakMap();

function clearSceneAudio() {
  sceneAudioCueTimers.forEach((timer) => window.clearTimeout(timer));
  sceneAudioCueTimers = [];
  sceneAudioPlayers.forEach((player) => {
    player.pause();
    player.currentTime = 0;
  });
  sceneAudioPlayers.clear();
}

function playSceneAudio(name, volume = 0.32, { loop = false } = {}) {
  const source = soundEffects[name];
  if (!ambientOn || !source || currentScene < 0) return;
  const layer = new Audio(source);
  layer.volume = volume;
  layer.loop = loop;
  sceneAudioVolumes.set(layer, volume);
  if (soundscapeDuckTimer) layer.volume *= 0.24;
  sceneAudioPlayers.add(layer);
  layer.addEventListener('ended', () => sceneAudioPlayers.delete(layer), { once: true });
  layer.play().catch(() => sceneAudioPlayers.delete(layer));
}

function queueSceneAudio(index, delay, name, volume = 0.32, options) {
  const timer = window.setTimeout(() => {
    if (currentScene === index && !story.hidden && !document.hidden) playSceneAudio(name, volume, options);
  }, delay);
  sceneAudioCueTimers.push(timer);
}

function scheduleSceneAudio(index) {
  if (!ambientOn) return;

  // Each passage has a small sound arc: a location cue, then a consequence.
  // The long texture stays underneath the licensed music without cutting it.
  if (index === 0) {
    queueSceneAudio(index, 8800, 'suspenseAmbience', 0.1);
  } else if (index === 2) {
    if (riskScore > 0) {
      queueSceneAudio(index, 9800, 'distantThunder', Math.min(0.24, 0.14 + tensionLevel * 0.03));
    }
  }
}

function clearSceneInterruption() {
  window.clearTimeout(sceneInterruptionTimer);
  window.clearTimeout(sceneInterruptionHideTimer);
  window.clearTimeout(sceneInterruptionRemoveTimer);
  window.clearTimeout(sceneInterruptionEffectTimer);
  window.clearTimeout(lampBuzzTimer);
  window.clearTimeout(lampBuzzStopTimer);
  sceneInterruptionTimer = 0;
  sceneInterruptionHideTimer = 0;
  sceneInterruptionRemoveTimer = 0;
  sceneInterruptionEffectTimer = 0;
  clearSceneAudio();
  lampBuzzTimer = 0;
  lampBuzzStopTimer = 0;
  if (activeLampBuzz) {
    activeLampBuzz.pause();
    activeLampBuzz.currentTime = 0;
    if (activeSoundEffect === activeLampBuzz) activeSoundEffect = null;
    activeLampBuzz = null;
  }
  sceneInterruption.hidden = true;
  sceneInterruption.classList.remove('is-visible', 'is-leaving');
  sceneInterruption.replaceChildren();
  story.classList.remove('is-raining');
  story.classList.remove('is-heavy-rain');
  sceneImageWrap.classList.remove('is-camera-flash', 'is-lamp-failure', 'is-reflection-slip', 'is-object-reaction', 'is-reaction-phone', 'is-reaction-threat', 'is-reaction-gate', 'is-reaction-protagonist', 'is-reaction-friend', 'is-reaction-cafe', 'is-reaction-landmark');
  sceneReaction.classList.remove('is-visible', 'is-reaction-phone', 'is-reaction-threat', 'is-reaction-gate', 'is-reaction-protagonist', 'is-reaction-friend', 'is-reaction-cafe', 'is-reaction-landmark');
}

function triggerPhotoReaction(button, hotspot) {
  const stage = sceneImageWrap.getBoundingClientRect();
  const target = button.getBoundingClientRect();
  const x = Math.max(0, Math.min(100, ((target.left + target.width / 2 - stage.left) / stage.width) * 100));
  const y = Math.max(0, Math.min(100, ((target.top + target.height / 2 - stage.top) / stage.height) * 100));
  const reactionClasses = ['is-reaction-phone', 'is-reaction-threat', 'is-reaction-gate', 'is-reaction-protagonist', 'is-reaction-friend', 'is-reaction-cafe', 'is-reaction-landmark'];
  const reactionClass = `is-reaction-${hotspot.id === 'cartographer' ? 'threat' : hotspot.id}`;
  sceneImageWrap.style.setProperty('--tap-x', `${x}%`);
  sceneImageWrap.style.setProperty('--tap-y', `${y}%`);
  sceneReaction.style.setProperty('--tap-x', `${x}%`);
  sceneReaction.style.setProperty('--tap-y', `${y}%`);
  sceneImageWrap.classList.remove(...reactionClasses);
  window.clearTimeout(activeBeatResetTimer);
  if (activeBeatClass) sceneImageWrap.classList.remove(activeBeatClass);
  sceneReaction.classList.remove('is-visible', ...reactionClasses);
  void sceneImageWrap.offsetWidth;
  sceneImageWrap.classList.add(reactionClass);
  activeBeatClass = `is-beat-${currentScene + 1}-${hotspot.id}`;
  sceneImageWrap.classList.add(activeBeatClass);
  sceneReaction.classList.add(reactionClass, 'is-visible');
  activeBeatResetTimer = window.setTimeout(() => {
    sceneImageWrap.classList.remove(reactionClass, activeBeatClass);
    sceneReaction.classList.remove('is-visible', reactionClass);
    activeBeatClass = '';
  }, 3400);
}
function showLampFailure() {
  window.clearTimeout(sceneInterruptionEffectTimer);
  sceneImageWrap.style.setProperty('--lamp-x', currentScene === 3 && !decisions.includes('go-cafe') ? '15%' : '79%');
  sceneImageWrap.style.setProperty('--lamp-y', currentScene === 2 ? '14%' : currentScene === 3 && !decisions.includes('go-cafe') ? '42%' : '37%');
  sceneImageWrap.classList.remove('is-lamp-failure');
  void sceneImageWrap.offsetWidth;
  sceneImageWrap.classList.add('is-lamp-failure');
  sceneInterruptionEffectTimer = window.setTimeout(() => sceneImageWrap.classList.remove('is-lamp-failure'), 8600);
}

function markCartographerGone() {
  const cafeWindow = currentScene === 3 && decisions.includes('go-cafe');
  sceneImageWrap.style.setProperty('--vanish-x', cafeWindow ? '86%' : '80%');
  sceneImageWrap.style.setProperty('--vanish-y', cafeWindow ? '40%' : '49%');
  sceneImageWrap.classList.add('is-cartographer-gone');
}

function scheduleSceneInterruption(index) {
  const interruption = [
    {
      delay: 2600,
      title: copy('EL OBTURADOR CORTA LA LLUVIA', 'THE SHUTTER CUTS THROUGH THE RAIN'),
      message: copy('La fachada y la hora quedan en la imagen.', 'The fa\u00e7ade and time are now in the image.'),
      effect: 'flash',
      sound: 'camera'
    },
    {
      delay: 1900,
      title: copy('MENSAJE · NÚMERO DESCONOCIDO', 'MESSAGE · UNKNOWN NUMBER'),
      message: copy('«Sé a qué hora vuelves».', '“I know what time you come home.”'),
      effect: 'phone',
      sound: 'phone'
    },
    riskScore >= 2 ? {
      delay: 2200,
      title: copy('PASOS DETRÁS DE TI', 'FOOTSTEPS BEHIND YOU'),
      message: copy('La lluvia tapa el ruido de la calle.', 'The rain swallows the sounds of the street.'),
      effect: 'shadow-pass',
      sound: 'footsteps'
    } : null,
    decisions.includes('take-shortcut') ? {
      delay: 1800,
      title: copy('ALGO RESPIRA BAJO EL ARCO', 'SOMETHING BREATHES UNDER THE ARCH'),
      message: copy('Tus pasos dejan de sonar. Una respiración llega desde el otro lado.', 'Your footsteps stop. A breath comes from the other side.'),
      effect: 'shadow',
      sound: 'breath'
    } : null
  ][index];

  if (!interruption) return;
  sceneInterruptionTimer = window.setTimeout(() => {
    if (story.hidden || document.hidden || currentScene !== index) return;
    if ((index === 0 && activeHotspotId === 'protagonist')
      || (index === 1 && activeHotspotId === 'phone')
      || (index === 2 && activeHotspotId === 'cartographer')
      || (index === 3 && ['cartographer', 'gate'].includes(activeHotspotId))) return;

    const label = document.createElement('span');
    label.className = 'scene-interruption__label';
    label.textContent = sceneValue(interruption.title);
    const message = document.createElement('span');
    message.className = 'scene-interruption__message';
    message.textContent = sceneValue(interruption.message);
    sceneInterruption.replaceChildren(label, message);
    sceneInterruption.hidden = false;
    requestAnimationFrame(() => sceneInterruption.classList.add('is-visible'));

    if (interruption.effect === 'flash') {
      sceneImageWrap.classList.remove('is-camera-flash');
      void sceneImageWrap.offsetWidth;
      sceneImageWrap.classList.add('is-camera-flash');
    } else if (interruption.effect === 'phone') {
      if (ambientOn) navigator.vibrate?.([65, 35, 110]);
      sceneImageWrap.classList.add('is-reflection-slip');
      sceneInterruptionEffectTimer = window.setTimeout(() => sceneImageWrap.classList.remove('is-reflection-slip'), 2600);
    } else if (interruption.effect === 'shadow-pass') {
      sceneImageWrap.classList.add('is-shadow-pass');
      sceneInterruptionEffectTimer = window.setTimeout(() => sceneImageWrap.classList.remove('is-shadow-pass'), 2600);
    } else if (interruption.effect === 'lamp') {
      showLampFailure();
      if (ambientOn) navigator.vibrate?.([24, 38, 24]);
    } else if (interruption.effect === 'shadow') {
      sceneImageWrap.classList.add('is-arch-breath');
      sceneHotspots.classList.add('is-disturbed');
      if (ambientOn) {
        duckSoundscapeFor(1500);
        navigator.vibrate?.([22, 48, 22]);
      }
    }

    if (ambientOn) {
      if (interruption.sound === 'camera') playCameraFlash(0.42);
      else if (interruption.sound === 'phone') playPhoneVibration();
      else if (interruption.sound === 'footsteps') playFootsteps(0.42);
      else if (interruption.sound === 'lamp') playLampFlicker();
      else if (interruption.sound === 'breath') queueSceneAudio(index, 650, 'cartographerBreath', 0.42);
    }

    sceneInterruptionHideTimer = window.setTimeout(() => {
      sceneInterruption.classList.add('is-leaving');
      sceneInterruptionRemoveTimer = window.setTimeout(() => {
        sceneInterruption.hidden = true;
        sceneInterruption.classList.remove('is-visible', 'is-leaving');
      }, 360);
    }, 3900);
  }, interruption.delay);
}

sceneImage.addEventListener('load', positionSceneHotspots);
window.addEventListener('resize', positionSceneHotspots, { passive: true });
window.addEventListener('orientationchange', positionSceneHotspots, { passive: true });
window.visualViewport?.addEventListener('resize', positionSceneHotspots, { passive: true });

function renderScene(index, { languageRefresh = false } = {}) {
  const hotspotToRestore = languageRefresh ? activeHotspotId : '';
  const choiceToRestore = languageRefresh && decisions.length > index ? decisions[index] : '';
  if (!languageRefresh) activeHotspotId = '';
  textLayoutController?.destroy();
  textLayoutController = undefined;
  const scene = scenes[index];
  currentScene = index;
  story.dataset.scene = String(index + 1);
  story.dataset.route = index === 3 ? (decisions.includes('go-cafe') ? 'cafe' : 'portal') : '';
  clearSceneInterruption();
  story.classList.add('is-raining');
  story.classList.toggle('is-heavy-rain', riskScore >= 2);
  const hotspots = sceneValue(scene.hotspots);
  const sceneChoices = sceneValue(scene.choices);
  sceneImage.src = sceneValue(scene.image);
  sceneReflection.src = sceneImage.src;
  setAmbientTrack(sceneValue(scene.ambience) || 'street');
  sceneKicker.textContent = sceneValue(scene.kicker);
  scenePlace.textContent = sceneValue(scene.place);
  sceneTitle.textContent = sceneValue(scene.title);
  sceneExploreHint.textContent = scene.exploreHint ? sceneValue(scene.exploreHint) : t('tapScene');
  sceneBody.textContent = sceneValue(scene.body);
  sceneClue.hidden = true;
  sceneClue.textContent = '';
  sceneImageWrap.classList.remove('is-disturbed', 'is-door-touched', 'is-camera-flash', 'is-lamp-failure', 'is-cartographer-gone', 'is-reflection-slip', 'is-gate-rumble', 'is-shadow-pass', 'is-arch-breath', 'is-object-reaction', 'is-reaction-phone', 'is-reaction-threat', 'is-reaction-gate', 'is-reaction-protagonist', 'is-reaction-friend', 'is-reaction-cafe', 'is-reaction-landmark');
  if (activeBeatClass) sceneImageWrap.classList.remove(activeBeatClass);
  window.clearTimeout(activeBeatResetTimer);
  activeBeatResetTimer = 0;
  activeBeatClass = '';
  sceneReaction.classList.remove('is-visible', 'is-reaction-phone', 'is-reaction-threat', 'is-reaction-gate', 'is-reaction-protagonist', 'is-reaction-friend', 'is-reaction-cafe', 'is-reaction-landmark');
  sceneHotspots.classList.remove('is-disturbed', 'is-door-touched');
  sceneHotspots.innerHTML = hotspots.map((hotspot) => `
    <button class="story__hotspot story__hotspot--${hotspot.id}" type="button" data-hotspot="${hotspot.id}" aria-pressed="false" style="left:${hotspot.x}%;top:${hotspot.y}%" aria-controls="scene-clue" aria-label="${t('sceneA11y')}${sceneValue(hotspot.label)}"></button>`).join('');
  if (sceneImage.complete) positionSceneHotspots();
  choicePrompt.textContent = sceneValue(scene.prompt);
  choices.innerHTML = sceneChoices.map((choice, choiceIndex) => `
    <button class="choice ${choice.risk ? 'choice--danger' : 'choice--safe'}" type="button" data-choice="${choice.id}" data-risk="${choice.risk}" aria-pressed="false">
      <span class="choice__mark" aria-hidden="true">${String.fromCharCode(65 + choiceIndex)}</span>
      <span>${sceneValue(choice.label)}</span>
      <span class="choice__arrow" aria-hidden="true">↗</span>
    </button>`).join('');
  choices.hidden = false;
  choices.querySelectorAll('[data-choice]').forEach((choice) => {
    const selected = choice.dataset.choice === choiceToRestore;
    choice.setAttribute('aria-pressed', String(selected));
    choice.disabled = Boolean(choiceToRestore);
  });
  choices.classList.toggle('has-selection', Boolean(choiceToRestore));
  continueButton.hidden = !choiceToRestore;
  if (choiceToRestore) continueLabel.textContent = index === scenes.length - 1 ? t('seeEnding') : t('continue');
  if (hotspotToRestore) {
    const restoredHotspot = hotspots.find((hotspot) => hotspot.id === hotspotToRestore);
    if (restoredHotspot) showHotspotClue(restoredHotspot);
  }
  applyTextLayout();
  updateProgress(index + 1);
  document.querySelector('.story__soundline').innerHTML = `<i></i> ${localized(`EL CARTÓGRAFO · ARCHIVO 0${index + 1}`, `THE CARTOGRAPHER · FILE 0${index + 1}`)}`;
  if (!languageRefresh) {
    window.scrollTo({ top: 0, behavior: scrollBehavior });
    announce(index === 0 ? 'start' : 'scene', { scene: index + 1, risk: riskScore, decision: lastDecision });
    scheduleSceneInterruption(index);
    scheduleSceneAudio(index);
    sceneTitle.focus({ preventScroll: true });
  }
}

function renderEnding({ languageRefresh = false } = {}) {
  clearSceneInterruption();
  textLayoutController?.destroy();
  textLayoutController = undefined;
  const endedInCafe = ['share-private', 'post-cafe', 'return-light'].includes(lastDecision);
  const choseSupport = ['share-private', 'return-light'].includes(lastDecision);
  const finalImage = endedInCafe ? 'assets/story/alcala-cafe.webp?v=alcala-cafe-20261124' : 'assets/story/alcala-portal.webp?v=alcala-puerta-female-night-20261124';
  if (!languageRefresh) setAmbientTrack(endedInCafe ? 'cafe' : 'street');
  endingBackdrop.style.backgroundImage = `url("${finalImage}")`;
  endingKicker.textContent = localized(endedInCafe ? 'PLAZA DE CERVANTES \u00b7 CAF\u00c9 \u00b7 23:48' : 'PUERTA DE MADRID \u00b7 23:48', endedInCafe ? 'PLAZA DE CERVANTES \u00b7 CAF\u00c9 \u00b7 11:48 P.M.' : 'PUERTA DE MADRID \u00b7 11:48 P.M.');
  endingTitle.innerHTML = lastDecision === 'post-cafe'
    ? localized('La foto<br><em>da otra pista.</em>', 'The photo<br><em>gives another clue.</em>')
    : lastDecision === 'return-light'
      ? localized('Volviste<br><em>a la plaza.</em>', 'You went back<br><em>to the square.</em>')
      : choseSupport
        ? localized('Llegaste<br><em>con ayuda.</em>', 'You got there<br><em>with help.</em>')
        : localized('Seguiste sola<br><em>bajo el arco.</em>', 'You continued<br><em>under the arch.</em>');
  endingOutcome.textContent = lastDecision === 'post-cafe'
    ? localized('Publicaste otra foto desde el caf\u00e9 y se reconoce la Plaza. Eso no te hace culpable. Nadie tiene derecho a seguirte ni a invadir tu intimidad.', 'You posted another photo from the caf\u00e9, and the square is recognizable. That does not make you guilty. No one has the right to follow you or invade your privacy.')
    : lastDecision === 'open-portal'
      ? localized('Seguiste sola bajo el arco de la Puerta de Madrid. El Cart\u00f3grafo es responsable de haberte seguido. Publicar una foto no te hace culpable ni le da permiso para invadir tu intimidad.', 'You continued alone beneath the Puerta de Madrid arch. The Cartographer is responsible for following you. Posting a photo does not make you guilty or give him permission to invade your privacy.')
      : riskScore === 0
        ? localized('Quitaste la ubicaci\u00f3n en directo, no compartiste tu rutina y pediste apoyo. Diste menos pistas. Todas las personas tienen derecho a la intimidad.', 'You removed live location, kept your routine private and asked for support. You shared fewer clues. Everyone has a right to privacy.')
        : choseSupport
          ? localized('Cambiaste de rumbo y buscaste compa\u00f1\u00eda. Publicar una foto no justifica que alguien te siga. La responsabilidad es de quien lo hace.', 'You changed course and found company. Posting a photo does not justify anyone following you. The person doing it is responsible.')
          : localized('El Cart\u00f3grafo junt\u00f3 la hora, el lugar y tus publicaciones para deducir tu recorrido. Esta historia es inventada. Compartir una imagen nunca da permiso para seguirte.', 'The Cartographer combined the time, place and your posts to work out your route. This story is fictional. Sharing an image never gives anyone permission to follow you.');
  const answerLabels = {
    'live-location': copy('publiqu\u00e9 con mi ubicaci\u00f3n en directo', 'posted with my live location'),
    'remove-location': copy('publiqu\u00e9 sin etiqueta de ubicaci\u00f3n', 'posted without a location tag'),
    'reply-routine': copy('dije a qu\u00e9 hora suelo salir', 'said what time I usually leave'),
    'block-save': copy('guard\u00e9 el mensaje, bloque\u00e9 la cuenta y llam\u00e9 a Paula', 'saved the message, blocked the account and called Paula'),
    'go-cafe': copy('entr\u00e9 al caf\u00e9 y esper\u00e9 a Paula', 'went into the caf\u00e9 and waited for Paula'),
    'take-shortcut': copy('segu\u00ed sola por Cardenal Sandoval y Rojas', 'continued alone along Cardenal Sandoval y Rojas'),
    'share-private': copy('compart\u00ed mi ubicaci\u00f3n solo con Paula', 'shared my location with Paula only'),
    'post-cafe': copy('publiqu\u00e9 otra foto del caf\u00e9', 'posted another photo from the caf\u00e9'),
    'return-light': copy('volv\u00ed a la plaza y llam\u00e9 a Paula', 'returned to the square and called Paula'),
    'open-portal': copy('segu\u00ed sola bajo el arco de la Puerta de Madrid', 'continued alone beneath the Puerta de Madrid arch')
  };
  const answerRoute = decisions.map((decision, index) => `${index + 1}. ${answerLabels[decision] ? sceneValue(answerLabels[decision]) : localized('eleg\u00ed una opci\u00f3n', 'chose an option')}`).join(' \u00b7 ');
  const endingLabels = {
    'share-private': copy('Termin\u00e9 acompa\u00f1ada en el caf\u00e9.', 'I ended up with company at the caf\u00e9.'),
    'post-cafe': copy('Llegu\u00e9 al caf\u00e9 y publiqu\u00e9 otra foto.', 'I reached the caf\u00e9 and posted another photo.'),
    'return-light': copy('Volv\u00ed a la Plaza de Cervantes.', 'I returned to Plaza de Cervantes.'),
    'open-portal': copy('Segu\u00ed sola bajo el arco de la Puerta de Madrid.', 'I continued alone beneath the Puerta de Madrid arch.')
  };
  const endingLabel = endingLabels[lastDecision] ? sceneValue(endingLabels[lastDecision]) : localized('Mi recorrido terminó en Alcalá.', 'My story ended in Alcalá.');
  shareSummary.textContent = `${t('restartSharePrefix')} ${answerRoute}. ${endingLabel} ${t('shareEndingTail')}`;
  shareStatus.textContent = '';
  story.hidden = true;
  reveal.hidden = false;
  applyTextLayout();
  setLocation('derecho');
  if (!languageRefresh) {
    announce('ending', { risk: riskScore, decision: lastDecision, decisions: [...decisions] });
    endingTitle.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: scrollBehavior });
  }
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
  clearSceneInterruption();
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
  applyTextLayout();
  window.scrollTo({ top: 0, behavior: scrollBehavior });
  document.querySelector('#opening-title').focus({ preventScroll: true });
}

document.querySelector('#start-story').addEventListener('click', () => {
  if (!ambientOn && !soundOptedOut) {
    turnSoundOn();
    playOpeningFluorescent();
  }
  goToStory();
});
sceneHotspots.addEventListener('click', (event) => {
  if (Date.now() < suppressHotspotClickUntil && event.target.closest('[data-hotspot]') === suppressedHotspot) {
    event.preventDefault();
    suppressedHotspot = undefined;
    return;
  }
  const button = event.target.closest('[data-hotspot]');
  if (!button) return;
  const hotspot = sceneValue(scenes[currentScene]?.hotspots)?.find((item) => item.id === button.dataset.hotspot);
  if (!hotspot) return;
  const touchTarget = button.getBoundingClientRect();
  const touchX = event.clientX || touchTarget.left + touchTarget.width / 2;
  const touchY = event.clientY || touchTarget.top + touchTarget.height / 2;
  aimPerspective(story, touchX, touchY, hotspot.id === 'cartographer' ? 3.7 : 2.8, sceneImageWrap);
  releasePerspective(story, hotspot.id === 'cartographer' ? 1150 : 780);
  activeHotspotId = hotspot.id;
  triggerPhotoReaction(button, hotspot);
  sceneHotspots.querySelectorAll('[data-hotspot]').forEach((target) => {
    target.setAttribute('aria-pressed', String(target === button));
  });
  showHotspotClue(hotspot);
  applyTextLayout();
  const isThreat = hotspot.id === 'cartographer';
  if (isThreat) {
    cartographerNoticed = true;
    sceneImageWrap.classList.remove('is-disturbed');
    sceneHotspots.classList.remove('is-disturbed');
    void sceneImageWrap.offsetWidth;
    sceneImageWrap.style.setProperty('--threat-x', currentScene === 3 && !decisions.includes('go-cafe') ? '60%' : currentScene === 3 ? '88%' : currentScene === 2 ? '78%' : '84%');
    sceneImageWrap.classList.add('is-disturbed');
    sceneHotspots.classList.add('is-disturbed');
  }
  if (hotspot.id === 'gate') {
    sceneImageWrap.classList.remove('is-door-touched');
    sceneHotspots.classList.remove('is-door-touched');
    void sceneImageWrap.offsetWidth;
    sceneImageWrap.classList.add('is-door-touched');
    sceneHotspots.classList.add('is-door-touched');
  }
  if (isThreat) {
    if (ambientOn) navigator.vibrate?.([20, 28, 42]);
    if (currentScene === 0) playCartographerLaugh();
    else if (currentScene === 1) playCartographerLaugh();
    else if (currentScene === 2) {
      markCartographerGone();
      showLampFailure();
      playLampFlicker();
    } else if (currentScene === 3 && decisions.includes('go-cafe')) {
      markCartographerGone();
      playFootsteps(0.46);
    }
    else if (currentScene === 3 && !decisions.includes('go-cafe')) {
      sceneImageWrap.classList.add('is-arch-breath');
      duckSoundscapeFor(2100);
      playCartographerBreath();
    }
    else if (currentScene === 3) playFootsteps(0.46);
  } else if (hotspot.id === 'gate') {
    if (ambientOn) navigator.vibrate?.([24, 38, 24]);
    sceneImageWrap.classList.add('is-door-touched');
    sceneImageWrap.classList.add('is-gate-rumble');
    window.clearTimeout(sceneInterruptionEffectTimer);
    sceneInterruptionEffectTimer = window.setTimeout(() => sceneImageWrap.classList.remove('is-gate-rumble'), 2600);
    playStoneResonance();
  } else if (hotspot.id === 'protagonist') {
    if (currentScene === 0) {
      if (ambientOn) navigator.vibrate?.(18);
      sceneImageWrap.classList.remove('is-camera-flash');
      void sceneImageWrap.offsetWidth;
      sceneImageWrap.classList.add('is-camera-flash');
      playCameraFlash();
    } else if (currentScene === 1) {
      sceneImageWrap.classList.add('is-reflection-slip');
      window.clearTimeout(sceneInterruptionEffectTimer);
      sceneInterruptionEffectTimer = window.setTimeout(() => sceneImageWrap.classList.remove('is-reflection-slip'), 2600);
      playGlassTap();
    } else {
      if (ambientOn) navigator.vibrate?.(18);
      playFootsteps(0.58);
    }
  } else if (hotspot.id === 'phone') {
    if (currentScene === 1) {
      if (ambientOn) navigator.vibrate?.([65, 35, 110]);
      playPhoneVibration();
    } else if (currentScene === 2) {
      playSoundEffect('messageAlert', 0.52);
      if (ambientOn) navigator.vibrate?.([35, 28, 35]);
    } else if (currentScene === 3 && decisions.includes('go-cafe')) {
      playCameraFlash(0.34);
      if (ambientOn) navigator.vibrate?.(18);
    } else {
      playPhoneVibration();
    }
  } else if (hotspot.id === 'landmark') {
    if (ambientOn) navigator.vibrate?.(14);
    if (currentScene === 0) playFocusLock();
  } else if (hotspot.id === 'friend') {
    if (ambientOn) navigator.vibrate?.(14);
    playCoffeeCup();
  } else if (hotspot.id === 'cafe') {
    if (ambientOn) navigator.vibrate?.(14);
    playCafeDoorbell();
    cafeEntranceRang = true;
  }
  window.dispatchEvent(new CustomEvent('story:touch', {
    detail: { x: touchX, y: touchY, scene: currentScene + 1, target: hotspot.id }
  }));
  announce('hotspot', { id: hotspot.id, scene: currentScene + 1, threat: isThreat });
});
sceneImageWrap.addEventListener('click', (event) => {
  if (Date.now() < suppressImageClickUntil) return;
  const buttons = [...sceneHotspots.querySelectorAll('[data-hotspot]')];
  if (!buttons.length) return;
  const nearest = buttons.reduce((best, button) => {
    const rect = button.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = dx * dx + dy * dy;
    return !best || distance < best.distance ? { button, distance } : best;
  }, undefined);
  nearest?.button.click();
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
  continueLabel.textContent = currentScene === scenes.length - 1 ? t('seeEnding') : t('continue');
  announce('choice', { choice: lastDecision, risk: riskScore, scene: currentScene + 1 });
  if (ambientOn) navigator.vibrate?.(Number(button.dataset.risk) ? [35, 45, 70] : 24);
  if (lastDecision === 'go-cafe' && !cafeEntranceRang) playCafeDoorbell();
  else if (lastDecision === 'live-location') playPhoneVibration();
  else if (['take-shortcut', 'return-light'].includes(lastDecision)) playFootsteps();
  else if (['block-save', 'post-cafe'].includes(lastDecision)) playPhoneVibration();
  else if (lastDecision === 'open-portal') playFootsteps();
});
continueButton.addEventListener('click', showNextScene);
document.querySelector('#restart-story').addEventListener('click', restart);
document.querySelector('#share-ending').addEventListener('click', async () => {
  const title = localized('Tu sombra digital · Artículo 12', 'Your Digital Shadow · Article 12');
  const url = new URL(window.location.href);
  url.searchParams.set('preview', 'articulo-12-cartografo');
  url.hash = 'derecho';
  const text = localized(
    `El artículo 12 de la Declaración Universal de los Derechos Humanos protege tu vida privada, tu familia, tu casa y tus mensajes. ${shareSummary.textContent}`,
    `Article 12 of the Universal Declaration of Human Rights protects your private life, family, home and messages. ${shareSummary.textContent}`
  );
  const data = { title, text, url: url.href };
  if (navigator.share) {
    try {
      await navigator.share(data);
      shareStatus.textContent = localized('Listo para compartir.', 'Ready to share.');
    } catch (error) {
      if (error.name !== 'AbortError') shareStatus.textContent = t('shareError');
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url.href}`);
    shareStatus.textContent = t('linkCopied');
  } catch {
    window.prompt(t('copyPrompt'), `${text} ${url.href}`);
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
let phoneVibrationAudioContext = null;
let ambienceTargetVolume = 0.24;
let musicTargetVolume = 0.2;
const audioFadeFrames = new WeakMap();

const soundEffects = {
  camera: 'assets/audio/camera-shutter.mp3',
  messageAlert: 'assets/audio/message-alert.mp3',
  doorCreak: 'assets/audio/door-creak.mp3',
  footsteps: 'assets/audio/wet-pavement-steps.mp3',
  cafeDoorbell: 'assets/audio/cafe-doorbell.mp3',
  coffeeCup: 'assets/audio/coffee-cup-setdown.mp3',
  cartographerLaugh: 'assets/audio/cartographer-laugh.mp3',
  cartographerBreath: 'assets/audio/cartographer-breath.mp3',
  lampSwitch: 'assets/audio/lamp-switch.mp3',
  lampBuzz: 'assets/audio/lamp-electric-buzz.mp3',
  suspenseAmbience: 'assets/audio/cinematic-suspense-ambience.mp3',
  distantThunder: 'assets/audio/distant-thunder-rumble.mp3'
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
  if (!ambientOn) return;
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
  soundLabel.textContent = t('music');
  soundState.textContent = active ? 'ON' : 'OFF';
  soundToggle.setAttribute('aria-pressed', String(active));
  soundToggle.setAttribute('aria-label', active ? t('soundOnLabel') : t('soundOffLabel'));
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
    if (currentScene >= 0 && !story.hidden) scheduleSceneAudio(currentScene);
    return;
  }
  playback.then(() => {
    updateSoundControls(true, 'licensed-track');
    if (currentScene >= 0 && !story.hidden) scheduleSceneAudio(currentScene);
  })
    .catch(() => {
      soundLabel.textContent = t('retry');
      soundState.textContent = 'OFF';
      soundToggle.setAttribute('aria-label', t('soundError'));
    });
}

function turnSoundOff() {
  window.clearTimeout(soundscapeDuckTimer);
  window.clearTimeout(lampBuzzTimer);
  window.clearTimeout(lampBuzzStopTimer);
  if (activeLampBuzz) {
    activeLampBuzz.pause();
    activeLampBuzz.currentTime = 0;
    if (activeSoundEffect === activeLampBuzz) activeSoundEffect = null;
    activeLampBuzz = null;
  }
  cancelAudioFade(licensedAmbience);
  licensedAmbience.pause();
  licensedAmbience.currentTime = 0;
  licensedAmbience.volume = ambienceTargetVolume;
  clearSceneAudio();
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
  sceneAudioPlayers.forEach((layer) => {
    fadeAudioTo(layer, (sceneAudioVolumes.get(layer) || layer.volume) * 0.24, 80);
  });
  window.clearTimeout(soundscapeDuckTimer);
  soundscapeDuckTimer = window.setTimeout(() => {
    if (!ambientOn) return;
    if (!licensedAmbience.paused) fadeAudioTo(licensedAmbience, ambienceTargetVolume, 600);
    if (!storyMusic.paused) fadeAudioTo(storyMusic, musicTargetVolume, 600);
    sceneAudioPlayers.forEach((layer) => {
      if (!layer.paused) fadeAudioTo(layer, sceneAudioVolumes.get(layer) || 0.2, 600);
    });
    updateSoundtrackMood(tensionLevel);
  }, milliseconds);
}

function playCameraFlash(volume = 0.55) {
  playSoundEffect('camera', volume);
}

function playFootsteps(volume = 0.62) {
  playSoundEffect('footsteps', volume);
}

function playFocusLock() {
  if (!ambientOn) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    if (!phoneVibrationAudioContext) phoneVibrationAudioContext = new AudioContextClass();
    const context = phoneVibrationAudioContext;
    if (context.state === 'suspended') context.resume().catch(() => {});
    const tone = context.createOscillator();
    const envelope = context.createGain();
    const start = context.currentTime + 0.01;
    tone.type = 'sine';
    tone.frequency.setValueAtTime(1040, start);
    tone.frequency.exponentialRampToValueAtTime(720, start + .11);
    envelope.gain.setValueAtTime(.0001, start);
    envelope.gain.linearRampToValueAtTime(.065, start + .015);
    envelope.gain.exponentialRampToValueAtTime(.0001, start + .14);
    tone.connect(envelope);
    envelope.connect(context.destination);
    tone.start(start);
    tone.stop(start + .15);
    tone.addEventListener('ended', () => { tone.disconnect(); envelope.disconnect(); }, { once: true });
  } catch { /* Visual focus still works if Web Audio is unavailable. */ }
}

function playGlassTap() {
  if (!ambientOn) return;
  duckSoundscapeFor(1900);
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    if (!phoneVibrationAudioContext) phoneVibrationAudioContext = new AudioContextClass();
    const context = phoneVibrationAudioContext;
    if (context.state === 'suspended') context.resume().catch(() => {});
    const start = context.currentTime + .015;
    [0, .19, .47].forEach((offset, index) => {
      const tone = context.createOscillator();
      const filter = context.createBiquadFilter();
      const envelope = context.createGain();
      const at = start + offset;
      tone.type = index === 1 ? 'triangle' : 'sine';
      tone.frequency.setValueAtTime(index === 1 ? 1580 : 1120, at);
      tone.frequency.exponentialRampToValueAtTime(index === 1 ? 920 : 680, at + .34);
      filter.type = 'bandpass';
      filter.frequency.value = 1250;
      filter.Q.value = 2.6;
      envelope.gain.setValueAtTime(.0001, at);
      envelope.gain.linearRampToValueAtTime(index === 1 ? .035 : .052, at + .012);
      envelope.gain.exponentialRampToValueAtTime(.0001, at + .38);
      tone.connect(filter);
      filter.connect(envelope);
      envelope.connect(context.destination);
      tone.start(at);
      tone.stop(at + .4);
      tone.addEventListener('ended', () => { tone.disconnect(); filter.disconnect(); envelope.disconnect(); }, { once: true });
    });
  } catch { /* The reflection animation still works without Web Audio. */ }
}

function playStoneResonance() {
  if (!ambientOn) return;
  duckSoundscapeFor(2300);
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    if (!phoneVibrationAudioContext) phoneVibrationAudioContext = new AudioContextClass();
    const context = phoneVibrationAudioContext;
    if (context.state === 'suspended') context.resume().catch(() => {});
    const start = context.currentTime + .02;
    const master = context.createGain();
    master.gain.setValueAtTime(.0001, start);
    master.gain.linearRampToValueAtTime(.2, start + .18);
    master.gain.exponentialRampToValueAtTime(.0001, start + 1.95);
    master.connect(context.destination);
    const low = context.createOscillator();
    const overtone = context.createOscillator();
    const filter = context.createBiquadFilter();
    low.type = 'triangle';
    low.frequency.setValueAtTime(78, start);
    low.frequency.exponentialRampToValueAtTime(46, start + 1.7);
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(156, start);
    overtone.frequency.exponentialRampToValueAtTime(92, start + 1.7);
    filter.type = 'lowpass';
    filter.frequency.value = 240;
    low.connect(filter);
    overtone.connect(filter);
    filter.connect(master);
    low.start(start);
    overtone.start(start);
    low.stop(start + 2);
    overtone.stop(start + 2);
    low.addEventListener('ended', () => { low.disconnect(); overtone.disconnect(); filter.disconnect(); master.disconnect(); }, { once: true });
  } catch { playSoundEffect('distantThunder', 0.2, 0, 2200); }
}

function playDoorCreak() {
  playSoundEffect('doorCreak', 0.66);
}

function playLampFlicker() {
  if (!ambientOn) return;
  window.clearTimeout(lampBuzzTimer);
  window.clearTimeout(lampBuzzStopTimer);
  playSoundEffect('lampSwitch', 0.46);
  duckSoundscapeFor(8600);
  lampBuzzTimer = window.setTimeout(() => {
    const buzz = new Audio(soundEffects.lampBuzz);
    buzz.volume = 0.48;
    buzz.loop = true;
    activeLampBuzz = buzz;
    activeSoundEffect = buzz;
    buzz.play().catch(() => {
      if (activeSoundEffect === buzz) activeSoundEffect = null;
      if (activeLampBuzz === buzz) activeLampBuzz = null;
    });
    lampBuzzStopTimer = window.setTimeout(() => {
      buzz.pause();
      buzz.currentTime = 0;
      if (activeSoundEffect === buzz) activeSoundEffect = null;
      if (activeLampBuzz === buzz) activeLampBuzz = null;
    }, 8200);
  }, 90);
}

function playOpeningFluorescent() {
  if (opening.hidden) return;
  opening.classList.remove('is-fluorescent-failure');
  void opening.offsetWidth;
  opening.classList.add('is-fluorescent-failure');
  window.setTimeout(() => opening.classList.remove('is-fluorescent-failure'), 9200);
  playLampFlicker();
}

function playPhoneVibration() {
  if (!ambientOn) return;
  duckSoundscapeFor(900);
  if (activeSoundEffect) {
    activeSoundEffect.pause();
    activeSoundEffect.currentTime = 0;
    activeSoundEffect = null;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    if (!phoneVibrationAudioContext) phoneVibrationAudioContext = new AudioContextClass();
    const context = phoneVibrationAudioContext;
    if (context.state === 'suspended') context.resume().catch(() => {});

    const output = context.createGain();
    output.gain.value = 0.18;
    output.connect(context.destination);
    const start = context.currentTime + 0.01;

    [[0, 0.2], [0.31, 0.28], [0.78, 0.18]].forEach(([offset, duration]) => {
      const pulseStart = start + offset;
      const pulseEnd = pulseStart + duration;
      const motor = context.createOscillator();
      const rattle = context.createOscillator();
      const filter = context.createBiquadFilter();
      const envelope = context.createGain();

      motor.type = 'sawtooth';
      motor.frequency.value = 142;
      rattle.type = 'triangle';
      rattle.frequency.value = 196;
      filter.type = 'lowpass';
      filter.frequency.value = 520;
      envelope.gain.setValueAtTime(0.0001, pulseStart);
      envelope.gain.linearRampToValueAtTime(0.68, pulseStart + 0.022);
      envelope.gain.setValueAtTime(0.68, pulseEnd - 0.035);
      envelope.gain.linearRampToValueAtTime(0.0001, pulseEnd);

      motor.connect(filter);
      rattle.connect(filter);
      filter.connect(envelope);
      envelope.connect(output);
      motor.start(pulseStart);
      rattle.start(pulseStart);
      motor.stop(pulseEnd + 0.01);
      rattle.stop(pulseEnd + 0.01);
    });

    window.setTimeout(() => output.disconnect(), 1150);
  } catch {
    navigator.vibrate?.([65, 35, 110]);
  }
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
    playOpeningFluorescent();
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

document.querySelector('.ending__details').addEventListener('toggle', applyTextLayout);
languageToggle.addEventListener('click', () => setLanguage(getLanguage() === 'es' ? 'en' : 'es'));
window.addEventListener('site-languagewillchange', () => {
  textLayoutController?.destroy();
  textLayoutController = undefined;
});
window.addEventListener('site-languagechange', () => {
  screenModeShortLabel.textContent = viewMode === 'immersive' ? t('immersiveScreen') : t('normalScreen');
  screenModeShortcut.setAttribute('aria-label', viewMode === 'immersive' ? t('returnNormal') : t('rotatePrompt'));
  soundLabel.textContent = t('music');
  soundToggle.setAttribute('aria-label', ambientOn ? t('soundOnLabel') : t('soundOffLabel'));
  if (!story.hidden && currentScene >= 0) renderScene(currentScene, { languageRefresh: true });
  else if (!reveal.hidden) renderEnding({ languageRefresh: true });
  else applyTextLayout();
});

setLanguage('es');
applyTextLayout();
