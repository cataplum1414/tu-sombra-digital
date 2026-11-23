import { animate } from 'https://cdn.jsdelivr.net/npm/motion@14.14.0/+esm';

document.documentElement.classList.add('has-motion');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const story = document.querySelector('#recorrido');
const image = document.querySelector('#scene-image');
const content = document.querySelector('#scene');
const endingBackdrop = document.querySelector('#ending-backdrop');
const endingContent = document.querySelector('.ending__content');

window.addEventListener('story:start', () => {
  if (reduced) return;
  animate(image, { opacity: [0.2, 1], scale: [1.08, 1], filter: ['brightness(.42) blur(7px)', 'brightness(1) blur(0px)'] }, { duration: 1.25, ease: [0.2, 0.8, 0.2, 1] });
  animate(content, { opacity: [0, 1], y: [24, 0] }, { duration: 0.72, delay: 0.25, ease: [0.16, 1, 0.3, 1] });
});

window.addEventListener('story:choice', (event) => {
  if (reduced) return;
  const danger = event.detail.risk > 0;
  animate(image, {
    scale: danger ? [1, 1.025, 1.07] : [1, 1.025],
    x: danger ? [0, -5, 4, 0] : [0, 3, 0],
    filter: danger ? ['brightness(1)', 'brightness(.72)', 'brightness(.94)'] : ['brightness(1)', 'brightness(1.08)']
  }, { duration: danger ? 0.62 : 0.48, ease: [0.16, 1, 0.3, 1] });
});

window.addEventListener('story:scene', (event) => {
  if (reduced) return;
  story.classList.remove('is-revealing');
  void story.offsetWidth;
  story.classList.add('is-revealing');
  animate(image, { opacity: [0.35, 1], scale: [1.12, 1], filter: ['brightness(.32) blur(10px)', 'brightness(1) blur(0px)'] }, { duration: 1.1, ease: [0.2, 0.8, 0.2, 1] });
  animate(content, { opacity: [0.4, 1], y: [20, 0], filter: ['blur(5px)', 'blur(0px)'] }, { duration: 0.72, delay: 0.2, ease: [0.16, 1, 0.3, 1] });
  if (event.detail.risk > 1) animate(story, { x: [0, -7, 4, -2, 0] }, { duration: 0.42, ease: 'easeOut' });
});

window.addEventListener('story:ending', (event) => {
  if (reduced) return;
  animate(endingBackdrop, { opacity: [0.18, 1], scale: [1.09, 1] }, { duration: 1.45, ease: [0.16, 1, 0.3, 1] });
  animate(endingContent, { opacity: [0, 1], y: [24, 0] }, { duration: 0.78, delay: 0.22, ease: [0.16, 1, 0.3, 1] });
  if (event.detail.decision === 'take-shortcut') animate(endingBackdrop, { filter: ['brightness(.38)', 'brightness(1.05)', 'brightness(.68)', 'brightness(.82)'] }, { duration: 0.76, ease: 'easeOut' });
});

window.addEventListener('story:reset', () => {
  if (reduced) return;
  animate(image, { scale: [1.04, 1], opacity: [0.55, 1] }, { duration: 0.65 });
});
