import { justify } from './assets/justif/dist/index.js';
import { hyphenateEs } from './assets/justif/dist/hyphenate/es.js';
import { getLanguage, setLanguage, text as localized, t } from './language.js?v=mobile-depth-v2';

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
    title: copy('Estás a punto de publicarla.', 'You are about to post it.'),
    body: copy('Son las 23:17. Estás frente a la Casa Natal de Cervantes, en el número 48 de la Calle Mayor. La fachada y la hora pueden revelar dónde estás, aunque no escribas la dirección.', '11:17 p.m. You are outside the Cervantes Birthplace Museum at 48 Calle Mayor. The façade and timestamp could reveal where you are, even without a location tag.'),
    prompt: copy('¿Qué haces antes de subir la foto?', 'What do you do before posting the photo?'),
    hotspots: [
      { id: 'protagonist', label: copy('La chica', 'The woman'), x: 20, y: 45, align: 'right', response: copy('El flash salta: el Cartógrafo acaba de fotografiarte desde el otro lado de la Calle Mayor. Ahora decides qué pista compartir y a quién pedir apoyo.', 'A flash bursts: the Cartographer has just taken a picture from across Calle Mayor. She decides what to share and who to ask for help.' ) },
      { id: 'landmark', label: copy('Casa Cervantes', 'Cervantes House'), x: 53, y: 46, align: 'center', response: copy('Unos pasos húmedos resuenan bajo los soportales. Estás frente a la Casa Natal de Cervantes, en el número 48 de la Calle Mayor. La fachada puede revelar dónde se tomó la foto, aunque no añadas una etiqueta.', 'Wet footsteps echo beneath the arcades. You are outside the Cervantes Birthplace Museum, 48 Calle Mayor. The façade can give away the location even without a tag.') },
      { id: 'cartographer', label: copy('El Cartógrafo', 'The Cartographer'), x: 74, y: 57, align: 'left', response: copy('Lo señalas. De debajo de la capucha se escapa una risa breve. La imagen da un salto: ya no está junto al farol, sino detrás de ti, en el reflejo. Se ha dado cuenta de que lo has visto.', 'You point at him. A short laugh slips from beneath the hood. The image jolts: he is no longer by the streetlamp. He is behind you in the reflection. He knows you saw him.') }
    ],
    choices: [
      { id: 'live-location', risk: 1, label: copy('Subirla ahora con la ubicación en directo', 'Post it now with live location') },
      { id: 'remove-location', risk: 0, label: copy('Quitar la ubicación y publicarla mañana', 'Remove the location and post tomorrow') }
    ]
  },
  {
    image: 'assets/story/alcala-reflection.webp',
    place: copy('CALLE MAYOR · CERCA DE CASA CERVANTES', 'CALLE MAYOR · NEAR CERVANTES HOUSE'),
    kicker: copy('CALLE MAYOR · 23:24', 'CALLE MAYOR · 11:24 P.M.'),
    title: copy('«Sé por dónde vuelves».', '“I know which way you go home.”'),
    body: () => cartographerNoticed
        ? localized('Después de señalarlo, reaparece mucho más cerca, reflejado en el cristal de un edificio de la Calle Mayor. Entonces recibes un mensaje: «Sé por dónde vuelves».', 'After you point him out, he reappears much closer in a Calle Mayor shop window. A message arrives: “I know which way you go home.”')
      : riskScore
        ? localized('Publicaste la hora y la ubicación en directo. Frente a la Casa Natal de Cervantes recibes un mensaje: «Sé por dónde vuelves».', 'You posted the time and live location. Outside the museum, a message arrives: “I know which way you go home.”')
        : localized('Quitaste la etiqueta, pero la fachada y la hora siguen dando pistas. Frente a la Casa Natal de Cervantes recibes un mensaje: «Sé por dónde vuelves».', 'You removed the tag, but the façade and timestamp still give clues. Outside the museum, a message arrives: “I know which way you go home.”'),
    prompt: copy('El Cartógrafo quiere confirmar tu rutina. ¿Qué haces?', 'The Cartographer wants to confirm your routine. What do you do?'),
    hotspots: [
      { id: 'protagonist', label: copy('La chica', 'The woman'), x: 20, y: 45, align: 'right', response: copy('Un destello cruza el cristal. Ella reconoce al Cartógrafo; no tiene que responder a quien la intimida.', 'A glint crosses the glass. She recognizes the Cartographer; she does not have to answer someone who is intimidating her.') },
      { id: 'phone', label: copy('El móvil', 'The phone'), x: 51, y: 72, align: 'center', response: copy('El móvil vibra con otro mensaje. La hora que aparece en pantalla y el reflejo del escaparate dan pistas sobre tu rutina. Nadie tuvo que piratear el teléfono.', 'The phone buzzes with another message. The time on screen and the shop-window reflection reveal part of your routine. No one had to hack your phone.') },
      { id: 'cartographer', label: copy('El reflejo', 'The reflection'), x: 79, y: 44, align: 'left', response: copy('Tocas el reflejo. Su risa suena detrás de ti; en el cristal, la figura se mueve antes que tú. Está demasiado cerca.', 'You touch the reflection. His laugh comes from behind you. In the glass, the figure moves before you do. He is too close.') }
    ],
    choices: [
      { id: 'reply-routine', risk: 1, label: copy('Responderle y confirmar a qué hora sales', 'Reply and confirm what time you leave') },
      { id: 'block-save', risk: 0, label: copy('Guardar captura, bloquear y avisar a alguien', 'Save a screenshot, block him and tell someone') }
    ]
  },
  {
    image: 'assets/story/alcala-plaza-exterior.webp',
    ambience: 'street',
    place: copy('PLAZA DE CERVANTES · CAFETERÍA ABIERTA', 'CERVANTES SQUARE · CAFÉ OPEN'),
    kicker: copy('PLAZA DE CERVANTES · 23:32', 'CERVANTES SQUARE · 11:32 P.M.'),
    title: copy('La luz sigue encendida.', 'The light is still on.'),
    body: () => decisions.includes('block-save')
      ? localized('Cruzas desde Calle Mayor hasta Plaza de Cervantes. Paula contesta: «Estoy llegando; quédate donde haya gente». La cafetería sigue abierta. Bajo los soportales, al otro lado de la plaza, espera el encapuchado.', 'You cross from Calle Mayor to Cervantes Square. Paula replies: “I’m on my way. Stay where there are people.” The café is still open. Beneath the arcades across the square, the hooded figure is waiting.')
      : localized('Llegas a Plaza de Cervantes. Junto a la estatua de Cervantes ves una cafetería iluminada, con gente dentro. No has avisado a nadie. El mensaje vuelve a encender la pantalla: «Te vi junto a la Casa de Cervantes».', 'You reach Cervantes Square. Beside the statue, a café glows with people inside. You have not told anyone where you are. Your screen lights up again: “I saw you by Cervantes House.”'),
    prompt: () => decisions.includes('block-save')
      ? localized('Paula viene hacia la cafetería. ¿Esperas dentro o tomas el atajo?', 'Paula is heading to the café. Do you wait inside or take the shortcut?')
      : localized('La cafetería está abierta. ¿Pides ayuda o tomas el atajo?', 'The café is open. Do you ask for help or take the shortcut?'),
    hotspots: [
      { id: 'cafe', label: copy('La cafetería', 'The café'), x: 21, y: 57, align: 'right', response: copy('Te acercas a la entrada. Suena la campanilla y, desde dentro, llegan voces y se escapa la luz. Hay gente en la cafetería; puedes pedir ayuda sin revelar tus contraseñas ni tu ubicación.', 'You approach the entrance. A bell rings; warm light and voices spill onto the square. There are people inside. You can ask for help without sharing passwords or posting your location.') },
      { id: 'protagonist', label: copy('La chica', 'The woman'), x: 52, y: 75, align: 'center', response: copy('Avanzas unos pasos por la plaza iluminada. Puedes entrar donde hay gente, llamar a Paula y decidir con calma qué compartir.', 'You take a few steps across the lit square. You can go where there are people, call Paula and decide what to share once you feel safe.') },
      { id: 'cartographer', label: copy('La figura', 'The figure'), x: 75, y: 56, align: 'left', response: copy('Bajo los soportales, la figura parece estar mirando hacia ti. Cuando la luz de la plaza parpadea, ya no está junto a la farola.', 'Under the arcades, the figure seems to be looking straight at you. The square lights flicker. He is no longer beside the lamp.') }
    ],
    choices: () => [
      { id: 'go-cafe', risk: 0, label: copy(decisions.includes('block-save') ? 'Entrar y esperar a Paula con gente alrededor' : 'Entrar y escribir a Paula para que venga', decisions.includes('block-save') ? 'Go in and wait for Paula with other people' : 'Go in and text Paula to come meet you') },
      { id: 'take-shortcut', risk: 1, label: copy('Salir sola por Cardenal Sandoval y Rojas para despistarlo', 'Take Cardenal Sandoval y Rojas alone to lose him') }
    ]
  },
  {
    image: () => decisions.includes('go-cafe') ? 'assets/story/alcala-cafe.webp' : 'assets/story/alcala-portal.webp',
    ambience: () => decisions.includes('go-cafe') ? 'cafe' : 'street',
    place: () => localized(decisions.includes('go-cafe') ? 'PLAZA DE CERVANTES · DENTRO DEL CAFÉ' : 'CARDENAL SANDOVAL Y ROJAS · UN PORTAL', decisions.includes('go-cafe') ? 'CERVANTES SQUARE · INSIDE THE CAFÉ' : 'CARDENAL SANDOVAL Y ROJAS · A DOORWAY'),
    kicker: () => localized(decisions.includes('go-cafe') ? 'PLAZA DE CERVANTES · 23:38' : 'SANDOVAL Y ROJAS · 23:41', decisions.includes('go-cafe') ? 'CERVANTES SQUARE · 11:38 P.M.' : 'SANDOVAL Y ROJAS · 11:41 P.M.'),
    title: () => localized(decisions.includes('go-cafe') ? 'No estás sola.' : 'El atajo termina en una puerta.', decisions.includes('go-cafe') ? 'You are not alone.' : 'The shortcut ends at a doorway.'),
    body: () => decisions.includes('go-cafe')
      ? localized('Entras en la cafetería que viste desde la Plaza de Cervantes. Paula llega y te hace un sitio; detrás del cristal, la calle sigue mojada. Te pide que compartas tu ubicación solo con ella hasta que llegues a casa.', 'You enter the café you spotted from Cervantes Square. Paula arrives and makes room for you. Beyond the glass, the street is still wet. She asks you to share your location with her privately until you get home.')
      : localized('Dejas atrás la Plaza de Cervantes y tomas la calle Cardenal Sandoval y Rojas. El portal está entornado; la luz del zaguán no alcanza la acera. La hora y la ruta de la publicación bastaron para que el Cartógrafo pareciera conocer tu rutina. Aún puedes volver a la plaza iluminada.', 'You leave Cervantes Square and turn onto Cardenal Sandoval y Rojas. A doorway stands ajar; its light does not reach the pavement. A timestamp and a route were enough to make the Cartographer seem to know your routine. You can still return to the lit square.'),
    prompt: () => decisions.includes('go-cafe')
      ? localized('Llega una última notificación. ¿Qué compartes ahora?', 'One last notification arrives. What do you share now?')
      : localized('¿Qué haces al llegar al portal?', 'What do you do at the doorway?'),
    hotspots: () => decisions.includes('go-cafe') ? [
      { id: 'friend', label: copy('Paula', 'Paula'), x: 60, y: 58, align: 'right', response: copy('Paula desliza una taza sobre la mesa y se queda contigo. Pedir apoyo no requiere entregar tus cuentas: basta con contar qué pasó y qué necesitas.', 'Paula slides a cup across the table and stays with you. Asking for support does not mean handing over your accounts. Tell her what happened and what you need.') },
      { id: 'phone', label: copy('La notificación', 'The notification'), x: 28, y: 84, align: 'left', response: copy('El mensaje exige saber dónde estás. Si no respondes y guardas una captura, conservas una prueba sin revelar más datos personales.', 'The message demands to know where you are. Do not reply. Save a screenshot as evidence without revealing anything else.') },
      { id: 'cartographer', label: copy('El cristal', 'The glass'), x: 88, y: 45, align: 'left', response: copy('Afuera se oyen pasos que se alejan por la calle mojada. La amenaza no convierte en culpable a quien compartió una foto: la responsabilidad de invadir la intimidad es de quien lo hace.', 'Outside, footsteps fade along the wet street. Sharing a photo does not make you responsible for being threatened. The person invading your privacy is responsible.') }
    ] : [
      { id: 'protagonist', label: copy('La chica', 'The woman'), x: 22, y: 47, align: 'right', response: copy('Retrocedes desde el portal. Puedes cambiar de rumbo, llamar a Paula y volver a la plaza iluminada.', 'You step back from the doorway. You can change course, call Paula and return to the lit square.') },
      { id: 'door', label: copy('El picaporte', 'The door handle'), x: 88, y: 69, align: 'left', response: copy('El picaporte cede y la puerta cruje al abrirse unos centímetros. Aún puedes retroceder: entrar en un portal desconocido no te protege; la cafetería y las calles con gente siguen siendo una opción.', 'The handle gives way. The door creaks open a few inches. You can still step back: an unfamiliar doorway will not keep you safe. The café and busier streets are still an option.') },
      { id: 'cartographer', label: copy('La figura', 'The figure'), x: 65, y: 49, align: 'left', response: copy('Una respiración áspera raspa el silencio bajo la capucha. El encapuchado sigue al otro lado de la calle: la amenaza está en la información que reunió, no en una capacidad mágica para leer tu móvil.', 'A rough breath rasps beneath the hood. He is still across the street. The threat comes from the information he pieced together, not from any magic ability to read your phone.') }
    ],
    choices: () => decisions.includes('go-cafe') ? [
      { id: 'share-private', risk: 0, label: copy('Guardar la prueba y compartir tu ubicación solo con Paula', 'Save the evidence and share your location with Paula only') },
      { id: 'post-cafe', risk: 1, label: copy('Publicar otra historia en directo mostrando la cafetería', 'Post another live story showing the café') }
    ] : [
      { id: 'return-light', risk: 0, label: copy('Volver a la plaza y llamar a Paula desde la cafetería', 'Return to the square and call Paula from the café') },
      { id: 'open-portal', risk: 1, label: copy('Entrar sola en el portal para esconderte', 'Go into the doorway alone to hide') }
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

function renderScene(index, { languageRefresh = false } = {}) {
  const hotspotToRestore = languageRefresh ? activeHotspotId : '';
  const choiceToRestore = languageRefresh && decisions.length > index ? decisions[index] : '';
  if (!languageRefresh) activeHotspotId = '';
  textLayoutController?.destroy();
  textLayoutController = undefined;
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
    <button class="story__hotspot story__hotspot--${hotspot.id}" type="button" data-hotspot="${hotspot.id}" style="left:${hotspot.x}%;top:${hotspot.y}%" aria-controls="scene-clue" aria-label="${t('sceneA11y')}${sceneValue(hotspot.label)}"></button>`).join('');
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
    if (restoredHotspot) {
      sceneClue.textContent = sceneValue(restoredHotspot.response);
      sceneClue.hidden = false;
    }
  }
  applyTextLayout();
  updateProgress(index + 1);
  document.querySelector('.story__soundline').innerHTML = `<i></i> ${localized(`EL CARTÓGRAFO · ARCHIVO 0${index + 1}`, `THE CARTOGRAPHER · FILE 0${index + 1}`)}`;
  if (!languageRefresh) {
    window.scrollTo({ top: 0, behavior: scrollBehavior });
    announce(index === 0 ? 'start' : 'scene', { scene: index + 1, risk: riskScore, decision: lastDecision });
    sceneTitle.focus({ preventScroll: true });
  }
}

function renderEnding({ languageRefresh = false } = {}) {
  textLayoutController?.destroy();
  textLayoutController = undefined;
  const endedInCafe = ['share-private', 'post-cafe', 'return-light'].includes(lastDecision);
  const choseSupport = ['share-private', 'return-light'].includes(lastDecision);
  const finalImage = endedInCafe ? 'assets/story/alcala-cafe.webp' : 'assets/story/alcala-portal.webp';
  if (!languageRefresh) setAmbientTrack(endedInCafe ? 'cafe' : 'street');
  endingBackdrop.style.backgroundImage = `url("${finalImage}")`;
  endingKicker.textContent = localized(endedInCafe ? 'PLAZA DE CERVANTES · CAFÉ · 23:48' : 'CARDENAL SANDOVAL Y ROJAS · 23:48', endedInCafe ? 'CERVANTES SQUARE · CAFÉ · 11:48 P.M.' : 'CARDENAL SANDOVAL Y ROJAS · 11:48 P.M.');
  endingTitle.innerHTML = lastDecision === 'post-cafe'
    ? localized('La foto<br><em>reabre el rastro.</em>', 'The photo<br><em>reopens the trail.</em>')
    : lastDecision === 'return-light'
      ? localized('Volviste<br><em>a la luz.</em>', 'You found<br><em>your way back to the light.</em>')
      : choseSupport
        ? localized('No llegaste<br><em>sola.</em>', 'You did not arrive<br><em>alone.</em>')
        : localized('El rastro<br><em>llegó a la puerta.</em>', 'The trail<br><em>reached the door.</em>');
  endingOutcome.textContent = lastDecision === 'post-cafe'
    ? localized('La nueva historia muestra la cafetería y la hora en directo. Ahora se ha expuesto más información, pero eso no te hace responsable de la vigilancia. La responsabilidad de invadir tu intimidad es de quien lo hace.', 'Your new story reveals the café and the live timestamp. More information is exposed, but that never makes you responsible for being watched. The person invading your privacy is responsible.')
    : lastDecision === 'open-portal'
      ? localized('Abrir un portal desconocido no te habría protegido. Puedes pedir ayuda y volver a un lugar concurrido y seguro. Que el Cartógrafo te siga es responsabilidad suya, no tuya.', 'An unfamiliar doorway would not have kept you safe. You can ask for help and return to a staffed place. The Cartographer is responsible for following you, not you.')
      : riskScore === 0
        ? localized('Quitaste la ubicación, no confirmaste tu horario, entraste en un lugar con gente y avisaste a Paula en privado. Redujiste la información disponible. El derecho a la intimidad merece protección en cualquier final.', 'You removed the location, kept your routine private, went somewhere with people and contacted Paula privately. You closed several clues. The right to privacy deserves protection in every ending.')
        : choseSupport
          ? localized('Una pista quedó expuesta. Cambiaste de rumbo y buscaste compañía. Compartir una foto nunca da permiso para vigilarte: la responsabilidad es de quien invade la intimidad.', 'One clue was exposed. You changed course and found someone to stay with you. Sharing a photo never gives anyone permission to follow you. The person invading your privacy is responsible.')
          : localized('El Cartógrafo dedujo la hora, el lugar y tu rutina. Es ficción: publicar una foto no autoriza a nadie a seguirte ni te hace responsable de la invasión.', 'The Cartographer pieced together a time, a place and a routine. This is fiction: posting does not give anyone permission to follow you, and it never makes the person who posted responsible.');
  const answerLabels = {
    'live-location': copy('publiqué mi ubicación en directo', 'posted my live location'),
    'remove-location': copy('quité la ubicación y esperé', 'removed the location tag and waited'),
    'reply-routine': copy('confirmé mi horario', 'confirmed my routine'),
    'block-save': copy('guardé pruebas, bloqueé y pedí apoyo', 'saved evidence, blocked him and asked for help'),
    'go-cafe': copy('entré en la cafetería y busqué compañía', 'went into the café and found company'),
    'take-shortcut': copy('salí sola por el atajo', 'took the shortcut alone'),
    'share-private': copy('compartí mi ubicación solo con Paula', 'shared my location with Paula only'),
    'post-cafe': copy('publiqué otra historia en directo', 'posted another live story'),
    'return-light': copy('volví a la plaza iluminada', 'returned to the lit square'),
    'open-portal': copy('entré sola al portal', 'went into the doorway alone')
  };
  const answerRoute = decisions.map((decision, index) => `${index + 1}. ${answerLabels[decision] ? sceneValue(answerLabels[decision]) : localized('elegí una opción', 'chose an option')}`).join(' · ');
  const endingLabels = {
    'share-private': copy('Terminé acompañada en la cafetería.', 'I ended up with company at the café.'),
    'post-cafe': copy('Llegué a la cafetería, pero volví a publicar en directo.', 'I reached the café, then posted live again.'),
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
  sceneClue.textContent = sceneValue(hotspot.response);
  sceneClue.hidden = false;
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
    `El artículo 12 de la Declaración Universal de los Derechos Humanos protege tu vida privada, tu domicilio y tus comunicaciones frente a injerencias arbitrarias. ${shareSummary.textContent} Conoce la historia sobre el derecho a la intimidad.`,
    `Article 12 of the Universal Declaration of Human Rights protects your privacy, home and communications from arbitrary interference. ${shareSummary.textContent} Explore the story of the right to privacy.`
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
    return;
  }
  playback.then(() => updateSoundControls(true, 'licensed-track'))
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
