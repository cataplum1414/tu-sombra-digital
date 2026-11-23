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


