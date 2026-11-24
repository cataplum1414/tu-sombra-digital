import { justify } from './assets/justif/dist/index.js';
import { hyphenateEs } from './assets/justif/dist/hyphenate/es.js';
import { getLanguage, setLanguage, text as localized, t } from './language.js?v=hotspots-cover-fix-20261124';

const opening = document.querySelector('.opening');
const story = document.querySelector('.story');
const reveal = document.querySelector('.reveal');
const sceneImage = document.querySelector('#scene-image');
const sceneImageWrap = document.querySelector('#scene-image-wrap');
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
    .filter((paragraph) => paragraph.getClientRects().length > 0);
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
const copy = (es, en) => () => localized(es, en);

const scenes = [
  {
    image: 'assets/story/alcala-night.webp',
    place: copy('CALLE MAYOR · CASA CERVANTES', 'CALLE MAYOR · CERVANTES BIRTHPLACE MUSEUM'),
    kicker: copy('CALLE MAYOR · 23:17', 'CALLE MAYOR · 11:17 P.M.'),
    title: copy('¿Subes esta foto ahora?', 'Do you post this photo now?'),
    exploreHint: copy('Toca a la protagonista, la Casa Cervantes o al Cartógrafo. La pista aparecerá debajo.', 'Tap the woman, Cervantes House or the Cartographer. The clue will appear below.'),
    body: copy('Son las 23:17. Estás en la Calle Mayor, frente a la Casa Natal de Cervantes, número 48. La foto puede mostrar dónde estás, aunque no añadas la ubicación.', 'It is 11:17 p.m. You are on Calle Mayor, outside Cervantes Birthplace Museum at number 48. The photo can show where you are, even without a location tag.'),
    prompt: copy('La foto muestra dónde estás. ¿Qué haces?', 'The photo shows where you are. What do you do?'),
    hotspots: [
      { id: 'protagonist', label: copy('Tú', 'You'), x: 20, y: 45, align: 'right', response: copy('¡Flash! El Cartógrafo te acaba de hacer una foto desde el otro lado de la calle. Tú decides qué publicas y a quién pides ayuda.', 'Flash! The Cartographer just took your picture from across the street. You choose what to post and who to ask for help.') },
      { id: 'landmark', label: copy('Casa Cervantes', 'Cervantes House'), x: 53, y: 46, align: 'center', response: copy('Estás frente a la Casa Natal de Cervantes, en Calle Mayor 48. El edificio muestra dónde hiciste la foto, aunque quites la ubicación.', 'You are outside Cervantes Birthplace Museum at 48 Calle Mayor. The building shows where you took the photo, even if you remove the location tag.') },
      { id: 'cartographer', label: copy('El Cartógrafo', 'The Cartographer'), x: 74, y: 57, align: 'left', response: copy('Lo señalas. Se ríe. Parpadeas y ahora aparece detrás de ti, en el reflejo de una ventana. Sabe que lo has visto.', 'You point at him. He laughs. You blink, and now he is behind you in a window reflection. He knows you saw him.') }
    ],
    choices: [
      { id: 'live-location', risk: 1, label: copy('Publicarla ahora y mostrar dónde estoy', 'Post it now and show where I am') },
      { id: 'remove-location', risk: 0, label: copy('Publicarla sin decir dónde estoy', 'Post it without saying where I am') }
    ]
  },
  {
    image: 'assets/story/alcala-reflection.webp?v=single-cartographer-20261124',
    place: copy('CALLE MAYOR · CERCA DE CASA CERVANTES', 'CALLE MAYOR · NEAR CERVANTES HOUSE'),
    kicker: copy('CALLE MAYOR · 23:24', 'CALLE MAYOR · 11:24 P.M.'),
    title: copy('«Sé a qué hora vuelves».', '“I know what time you go home.”'),
    exploreHint: copy('Toca sobre el móvil, la protagonista o el reflejo rojo. La pista aparecerá debajo.', 'Tap the phone, the woman or the red reflection. The clue will appear below.'),
    body: () => cartographerNoticed
        ? localized('Lo señalaste. Ahora aparece más cerca, en una ventana de la Calle Mayor. Te llega un mensaje: «Sé a qué hora vuelves».', 'You pointed him out. Now he appears closer, in a Calle Mayor window. A message arrives: “I know what time you go home.”')
      : riskScore
        ? localized('Publicaste la hora y el lugar. Frente a la Casa Natal te llega un mensaje: «Sé a qué hora vuelves».', 'You posted the time and place. Outside Cervantes House, a message arrives: “I know what time you go home.”')
        : localized('Quitaste la ubicación, pero la foto muestra el lugar y la hora. Frente a la Casa Natal te llega un mensaje: «Sé a qué hora vuelves».', 'You removed the location tag, but the photo shows the place and time. Outside Cervantes House, a message arrives: “I know what time you go home.”'),
    prompt: copy('Te pregunta a qué hora sales. ¿Se lo dices?', 'He asks what time you leave. Do you tell him?'),
    hotspots: [
      { id: 'protagonist', label: copy('Tú', 'You'), x: 20, y: 45, align: 'right', response: copy('Un destello cruza el cristal. Reconoces al Cartógrafo. No tienes que responder a su mensaje.', 'A flash crosses the glass. You recognize the Cartographer. You do not have to reply to his message.') },
      { id: 'phone', label: copy('El móvil', 'The phone'), x: 51, y: 72, align: 'center', response: copy('El móvil vibra. La hora de la foto y el lugar pueden mostrar cuándo pasas por aquí. No hace falta entrar en tu móvil para saberlo.', 'Your phone buzzes. The photo time and place can show when you come here. No one needs to get into your phone to learn that.') },
      { id: 'cartographer', label: copy('El reflejo', 'The reflection'), x: 79, y: 44, align: 'left', response: copy('Tocas el reflejo. Oyes su risa a tu espalda. En el cristal, se mueve antes que tú.', 'You touch the reflection. You hear him laugh behind you. In the glass, he moves before you do.') }
    ],
    choices: [
      { id: 'reply-routine', risk: 1, label: copy('Decirle a qué hora salgo', 'Tell him what time I leave') },
      { id: 'block-save', risk: 0, label: copy('Guardar el mensaje y llamar a Paula', 'Save the message and call Paula') }
    ]
  },
  {
    image: 'assets/story/alcala-plaza-exterior.webp',
    ambience: 'street',
    place: copy('PLAZA DE CERVANTES · CAFÉ ABIERTO', 'CERVANTES SQUARE · CAFÉ OPEN'),
    kicker: copy('PLAZA DE CERVANTES · 23:32', 'CERVANTES SQUARE · 11:32 P.M.'),
    title: copy('Hay un café abierto.', 'There is a café open.'),
    exploreHint: copy('Toca el café, la protagonista o al Cartógrafo. La pista aparecerá debajo.', 'Tap the café, the woman or the Cartographer. The clue will appear below.'),
    body: () => decisions.includes('block-save')
      ? localized('Llegas a la Plaza de Cervantes. Paula te escribe: «Voy para allá. Espera dentro del café». El Cartógrafo te mira desde el otro lado de la plaza.', 'You reach Cervantes Square. Paula texts: “I’m coming. Wait inside the café.” The Cartographer watches you from across the square.')
      : localized('Llegas a la Plaza de Cervantes. Hay un café abierto junto a la estatua. Nadie sabe que estás aquí. Te llega otro mensaje: «Te vi junto a la Casa de Cervantes».', 'You reach Cervantes Square. A café is open beside the statue. No one knows you are here. Another message arrives: “I saw you by Cervantes House.”'),
    prompt: () => decisions.includes('block-save')
      ? localized('Paula viene. ¿La esperas dentro del café o te vas sola?', 'Paula is coming. Do you wait inside the café or leave alone?')
      : localized('El café está abierto. ¿Entras y llamas a Paula o te vas sola?', 'The café is open. Do you go in and call Paula or leave alone?'),
    hotspots: [
      { id: 'cafe', label: copy('El café', 'The café'), x: 21, y: 57, align: 'right', response: copy('La puerta del café se abre. Suena una campanilla. Hay gente dentro. Puedes pedir ayuda.', 'The café door opens. A bell rings. People are inside. You can ask for help.') },
      { id: 'protagonist', label: copy('Tú', 'You'), x: 52, y: 75, align: 'center', response: copy('La plaza está iluminada. Puedes entrar al café y llamar a Paula.', 'The square is lit. You can go into the café and call Paula.') },
      { id: 'cartographer', label: copy('El Cartógrafo', 'The Cartographer'), x: 75, y: 56, align: 'left', response: copy('La luz parpadea. Cuando vuelve, el Cartógrafo ya no está junto a la farola.', 'The light flickers. When it comes back on, the Cartographer is no longer by the lamp.') }
    ],
    choices: () => [
      { id: 'go-cafe', risk: 0, label: copy(decisions.includes('block-save') ? 'Entrar al café y esperar a Paula' : 'Entrar al café y llamar a Paula', decisions.includes('block-save') ? 'Go into the café and wait for Paula' : 'Go into the café and call Paula') },
      { id: 'take-shortcut', risk: 1, label: copy('Ir sola por Cardenal Sandoval y Rojas', 'Walk alone along Cardenal Sandoval y Rojas') }
    ]
  },
  {
    image: () => decisions.includes('go-cafe') ? 'assets/story/alcala-cafe.webp' : 'assets/story/alcala-portal.webp',
    ambience: () => decisions.includes('go-cafe') ? 'cafe' : 'street',
    place: () => localized(decisions.includes('go-cafe') ? 'PLAZA DE CERVANTES · CAFÉ' : 'CALLE CARDENAL SANDOVAL Y ROJAS · PORTAL', decisions.includes('go-cafe') ? 'CERVANTES SQUARE · CAFÉ' : 'CARDENAL SANDOVAL Y ROJAS · DOORWAY'),
    kicker: () => localized(decisions.includes('go-cafe') ? 'PLAZA DE CERVANTES · 23:38' : 'SANDOVAL Y ROJAS · 23:41', decisions.includes('go-cafe') ? 'CERVANTES SQUARE · 11:38 P.M.' : 'SANDOVAL Y ROJAS · 11:41 P.M.'),
    title: () => localized(decisions.includes('go-cafe') ? 'No estás sola.' : 'El atajo termina en una puerta.', decisions.includes('go-cafe') ? 'You are not alone.' : 'The shortcut ends at a doorway.'),
    exploreHint: () => decisions.includes('go-cafe')
      ? localized('Toca a Paula, el mensaje o la ventana. La pista aparecerá debajo.', 'Tap Paula, the message or the window. The clue will appear below.')
      : localized('Toca la puerta, la protagonista o al Cartógrafo. La pista aparecerá debajo.', 'Tap the door, the woman or the Cartographer. The clue will appear below.'),
    body: () => decisions.includes('go-cafe')
      ? localized('Entras al café. Paula llega y se sienta contigo. Puedes compartir tu ubicación solo con ella hasta llegar a casa.', 'You go into the café. Paula arrives and sits with you. You can share your location with her only until you get home.')
      : localized('Vas por Cardenal Sandoval y Rojas. El portal está abierto, oscuro y vacío. La foto y la hora dieron pistas al Cartógrafo. Puedes volver a la plaza, donde hay luz y gente.', 'You walk along Cardenal Sandoval y Rojas. The doorway is open, dark and empty. The photo and time gave the Cartographer clues. You can return to the lit, busy square.'),
    prompt: () => decisions.includes('go-cafe')
      ? localized('Paula te escribe otra vez. ¿Qué haces?', 'Paula texts you again. What do you do?')
      : localized('Llegas al portal. ¿Qué haces?', 'You reach the doorway. What do you do?'),
    hotspots: () => decisions.includes('go-cafe') ? [
      { id: 'friend', label: copy('Paula', 'Paula'), x: 60, y: 58, align: 'right', response: copy('Paula se queda contigo. Cuéntale qué pasó y qué necesitas. No tienes que darle tus contraseñas.', 'Paula stays with you. Tell her what happened and what you need. You do not need to give her your passwords.') },
      { id: 'phone', label: copy('El mensaje', 'The message'), x: 28, y: 84, align: 'left', response: copy('El mensaje pregunta dónde estás. No contestes. Guarda una captura.', 'The message asks where you are. Do not reply. Save a screenshot.') },
      { id: 'cartographer', label: copy('La ventana', 'The window'), x: 88, y: 45, align: 'left', response: copy('Oyes pasos que se alejan. Publicar una foto no da permiso para seguirte. La responsabilidad es de quien te sigue.', 'You hear footsteps fading away. Posting a photo does not give anyone permission to follow you. The person following you is responsible.') }
    ] : [
      { id: 'protagonist', label: copy('Tú', 'You'), x: 22, y: 47, align: 'right', response: copy('Aléjate del portal. Llama a Paula y vuelve a la plaza iluminada.', 'Step away from the doorway. Call Paula and return to the lit square.') },
      { id: 'door', label: copy('La puerta', 'The door'), x: 88, y: 69, align: 'left', response: copy('La puerta se abre un poco. Dentro está oscuro. Puedes volver a la plaza o ir al café, donde hay gente.', 'The door opens a little. It is dark inside. You can return to the square or go to the café, where there are people.') },
      { id: 'cartographer', label: copy('El Cartógrafo', 'The Cartographer'), x: 65, y: 49, align: 'left', response: copy('Oyes su respiración bajo la capucha. Está al otro lado de la calle. Solo sabe lo que has compartido; no puede leer tu móvil.', 'You hear him breathe under the hood. He is across the street. He only knows what you have shared; he cannot read your phone.') }
    ],
    choices: () => decisions.includes('go-cafe') ? [
      { id: 'share-private', risk: 0, label: copy('Guardar el mensaje y compartir mi ubicación solo con Paula', 'Save the message and share my location with Paula only') },
      { id: 'post-cafe', risk: 1, label: copy('Publicar otra foto del café ahora', 'Post another photo of the café now') }
    ] : [
      { id: 'return-light', risk: 0, label: copy('Volver a la plaza e ir al café para llamar a Paula', 'Return to the square and go to the café to call Paula') },
      { id: 'open-portal', risk: 1, label: copy('Entrar sola en el portal para esconderme', 'Go into the doorway alone to hide') }
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
    queueSceneAudio(index, 5600, 'footsteps', 0.2);
    queueSceneAudio(index, 8800, 'suspenseAmbience', 0.1);
  } else if (index === 1) {
    queueSceneAudio(index, 4700, 'suspenseAmbience', 0.13);
    queueSceneAudio(index, 7600, 'footsteps', 0.24);
  } else if (index === 2) {
    if (riskScore > 0) {
      queueSceneAudio(index, 3600, 'suspenseAmbience', 0.15);
      queueSceneAudio(index, 9800, 'distantThunder', Math.min(0.24, 0.14 + tensionLevel * 0.03));
      queueSceneAudio(index, 16800, 'footsteps', 0.28);
    } else {
      queueSceneAudio(index, 6800, 'footsteps', 0.16);
    }
  } else if (index === 3 && decisions.includes('go-cafe')) {
    queueSceneAudio(index, 2400, 'coffeeCup', 0.34);
  } else if (index === 3) {
    queueSceneAudio(index, 1200, 'suspenseAmbience', 0.17);
    queueSceneAudio(index, 3100, 'doorCreak', 0.28);
    queueSceneAudio(index, 6500, 'cartographerBreath', 0.36);
    queueSceneAudio(index, 12400, 'footsteps', 0.32);
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
  sceneImageWrap.classList.remove('is-camera-flash', 'is-lamp-failure', 'is-reflection-slip');
}

function scheduleSceneInterruption(index) {
  const interruption = [
    {
      delay: 2600,
      title: copy('FLASH AL OTRO LADO DE LA CALLE', 'A FLASH ACROSS THE STREET'),
      message: copy('El Cartógrafo acaba de hacerte una foto.', 'The Cartographer has just taken your picture.'),
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
      effect: 'rain',
      sound: 'footsteps'
    } : null,
    decisions.includes('take-shortcut') ? {
      delay: 1800,
      title: copy('LA FAROLA FALLA', 'THE STREETLIGHT FALTERS'),
      message: copy('Algo se mueve al otro lado del portal.', 'Something moves across the doorway.'),
      effect: 'lamp',
      sound: 'lamp'
    } : null
  ][index];

  if (!interruption) return;
  sceneInterruptionTimer = window.setTimeout(() => {
    if (story.hidden || document.hidden || currentScene !== index) return;
    if ((index === 0 && activeHotspotId === 'protagonist')
      || (index === 1 && activeHotspotId === 'phone')
      || (index === 3 && activeHotspotId === 'cartographer')) return;

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
    } else if (interruption.effect === 'rain') {
      story.classList.add('is-raining');
    } else if (interruption.effect === 'lamp') {
      sceneImageWrap.classList.add('is-lamp-failure');
      sceneInterruptionEffectTimer = window.setTimeout(() => sceneImageWrap.classList.remove('is-lamp-failure'), 6800);
      if (ambientOn) navigator.vibrate?.([24, 38, 24]);
    }

    if (ambientOn) {
      if (interruption.sound === 'camera') playCameraFlash(0.42);
      else if (interruption.sound === 'phone') playPhoneVibration();
      else if (interruption.sound === 'footsteps') playFootsteps(0.42);
      else if (interruption.sound === 'lamp') playLampFlicker();
      else if (interruption.sound === 'breath') playCartographerBreath();
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
  clearSceneInterruption();
  const hotspots = sceneValue(scene.hotspots);
  const sceneChoices = sceneValue(scene.choices);
  sceneImage.src = sceneValue(scene.image);
  setAmbientTrack(sceneValue(scene.ambience) || 'street');
  sceneKicker.textContent = sceneValue(scene.kicker);
  scenePlace.textContent = sceneValue(scene.place);
  sceneTitle.textContent = sceneValue(scene.title);
  sceneExploreHint.textContent = scene.exploreHint ? sceneValue(scene.exploreHint) : t('tapScene');
  sceneBody.textContent = sceneValue(scene.body);
  sceneClue.hidden = true;
  sceneClue.textContent = '';
  sceneImageWrap.classList.remove('is-disturbed', 'is-door-touched', 'is-camera-flash', 'is-lamp-failure', 'is-reflection-slip');
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
  const finalImage = endedInCafe ? 'assets/story/alcala-cafe.webp' : 'assets/story/alcala-portal.webp';
  if (!languageRefresh) setAmbientTrack(endedInCafe ? 'cafe' : 'street');
  endingBackdrop.style.backgroundImage = `url("${finalImage}")`;
  endingKicker.textContent = localized(endedInCafe ? 'PLAZA DE CERVANTES · CAFÉ · 23:48' : 'CARDENAL SANDOVAL Y ROJAS · 23:48', endedInCafe ? 'CERVANTES SQUARE · CAFÉ · 11:48 P.M.' : 'CARDENAL SANDOVAL Y ROJAS · 11:48 P.M.');
  endingTitle.innerHTML = lastDecision === 'post-cafe'
    ? localized('La foto<br><em>da otra pista.</em>', 'The photo<br><em>gives another clue.</em>')
    : lastDecision === 'return-light'
      ? localized('Volviste<br><em>a la plaza.</em>', 'You went back<br><em>to the square.</em>')
      : choseSupport
        ? localized('Llegaste<br><em>con ayuda.</em>', 'You got there<br><em>with help.</em>')
        : localized('Entraste sola<br><em>al portal.</em>', 'You went inside<br><em>alone.</em>');
  endingOutcome.textContent = lastDecision === 'post-cafe'
    ? localized('Publicaste otra foto. Se ve qué café es y a qué hora estás allí. Eso no te hace culpable. Nadie tiene derecho a seguirte.', 'You posted another photo. It shows which café you are at and what time it is. That does not make you guilty. No one has the right to follow you.')
    : lastDecision === 'open-portal'
      ? localized('El portal estaba oscuro y vacío. Puedes volver a la plaza y pedir ayuda. El Cartógrafo es responsable de seguirte. Tú no tienes la culpa.', 'The doorway was dark and empty. You can return to the square and ask for help. The Cartographer is responsible for following you. It is not your fault.')
      : riskScore === 0
        ? localized('Quitaste la ubicación, no dijiste a qué hora salías y pediste ayuda. Así diste menos pistas. Todas las personas tienen derecho a la intimidad.', 'You removed the location, did not say what time you would leave and asked for help. You gave away fewer clues. Everyone has the right to privacy.')
        : choseSupport
          ? localized('Alguien vio la foto. Cambiaste de rumbo y buscaste compañía. Publicar una foto no da permiso para seguirte. La culpa es de quien lo hace.', 'Someone saw the photo. You changed course and found company. Posting a photo does not give anyone permission to follow you. It is their fault.')
          : localized('El Cartógrafo juntó la hora, el lugar y tus fotos para saber por dónde ibas. Esta historia es inventada. Publicar una foto no da permiso para seguirte.', 'The Cartographer used the time, place and your photos to work out where you were going. This story is fictional. Posting a photo does not give anyone permission to follow you.');
  const answerLabels = {
    'live-location': copy('publiqué mi ubicación', 'posted my location'),
    'remove-location': copy('publiqué sin decir dónde estaba', 'posted without saying where I was'),
    'reply-routine': copy('dije a qué hora salgo', 'said what time I leave'),
    'block-save': copy('guardé el mensaje y llamé a Paula', 'saved the message and called Paula'),
    'go-cafe': copy('entré al café', 'went into the café'),
    'take-shortcut': copy('fui sola por la otra calle', 'took the other street alone'),
    'share-private': copy('compartí mi ubicación solo con Paula', 'shared my location with Paula only'),
    'post-cafe': copy('publiqué otra foto del café', 'posted another photo of the café'),
    'return-light': copy('volví a la plaza y llamé a Paula', 'returned to the square and called Paula'),
    'open-portal': copy('entré sola al portal', 'went into the doorway alone')
  };
  const answerRoute = decisions.map((decision, index) => `${index + 1}. ${answerLabels[decision] ? sceneValue(answerLabels[decision]) : localized('elegí una opción', 'chose an option')}`).join(' · ');
  const endingLabels = {
    'share-private': copy('Terminé acompañada en la cafetería.', 'I ended up with company at the café.'),
    'post-cafe': copy('Llegué al café y publiqué otra foto.', 'I reached the café and posted another photo.'),
    'return-light': copy('Volví a la plaza iluminada.', 'I returned to the lit square.'),
    'open-portal': copy('Entré sola al portal.', 'I went into the doorway alone.')
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
  if (!ambientOn && !soundOptedOut) turnSoundOn();
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
    navigator.vibrate?.([65, 35, 110]);
    playPhoneVibration();
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

function playDoorCreak() {
  playSoundEffect('doorCreak', 0.66);
}

function playLampFlicker() {
  playSoundEffect('lampSwitch', 0.46);
  duckSoundscapeFor(6600);
  lampBuzzTimer = window.setTimeout(() => {
    const buzz = new Audio(soundEffects.lampBuzz);
    buzz.volume = 0.36;
    activeLampBuzz = buzz;
    activeSoundEffect = buzz;
    buzz.addEventListener('ended', () => {
      if (activeSoundEffect === buzz) activeSoundEffect = null;
      if (activeLampBuzz === buzz) activeLampBuzz = null;
    }, { once: true });
    buzz.play().catch(() => {
      if (activeSoundEffect === buzz) activeSoundEffect = null;
      if (activeLampBuzz === buzz) activeLampBuzz = null;
    });
  }, 110);
}

function playPhoneVibration() {
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
    output.gain.value = 0.2;
    output.connect(context.destination);
    const start = context.currentTime + 0.01;

    [[0, 0.16], [0.27, 0.21]].forEach(([offset, duration]) => {
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

    window.setTimeout(() => output.disconnect(), 850);
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
