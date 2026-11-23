import { animate, inView, scroll } from 'https://cdn.jsdelivr.net/npm/motion@14.14.0/+esm';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const portrait = document.querySelector('.portrait');
const opening = document.querySelector('.opening');
const story = document.querySelector('.story');
const storyScene = document.querySelector('.story__scene');
const sceneArt = document.querySelector('#scene-art');
const reveal = document.querySelector('.reveal');

if (!reduced) {
  animate('.portrait__silhouette', { opacity: [0, 1], scale: [0.88, 1], filter: ['blur(8px)', 'blur(0px)'] }, { duration: 1.3, ease: [0.22, 1, 0.36, 1] });
  animate('.portrait__eye', { scaleX: [0.3, 1.15, 0.55, 1], opacity: [0.25, 1, 0.45, 0.8] }, { duration: 5.6, repeat: Infinity, ease: 'easeInOut' });
  animate('.portrait__scanline', { y: ['-120%', '125%'] }, { duration: 6.5, repeat: Infinity, ease: 'linear' });
  animate('.fragment', { opacity: [0, 1], y: [18, 0], rotate: [-4, 0] }, { duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] });

  scroll(
    animate(portrait, { y: [0, 70], scale: [1, 0.9], opacity: [1, 0.35] }, { ease: 'linear' }),
    { target: opening, offset: ['start start', 'end start'] }
  );

  inView('.scene-tag', (element) => {
    animate(element, { opacity: [0, 1], y: [12, 0], rotate: [-5, 0] }, { duration: 0.65, ease: [0.16, 1, 0.3, 1] });
  });

  window.addEventListener('story:start', () => {
    animate(storyScene, { opacity: [0, 1], y: [22, 0], filter: ['blur(7px)', 'blur(0px)'] }, { duration: 0.85, ease: [0.22, 1, 0.36, 1] });
  });

  window.addEventListener('story:choice', () => {
    animate('.scene-art__photo', { scale: [1, 0.94, 1.03], rotate: [-4, 2, 0] }, { duration: 0.75, ease: [0.22, 1, 0.36, 1] });
    animate('.scene-art__phone', { x: [0, -10, 0], rotate: [15, 4, 15] }, { duration: 0.7, ease: 'easeInOut' });
  });

  window.addEventListener('story:scene', (event) => {
    animate('.scene-copy', { opacity: [0, 0.4, 1], x: [18, 0], filter: ['blur(5px)', 'blur(0px)'] }, { duration: 0.8, ease: [0.22, 1, 0.36, 1] });
    if (event.detail.scene === 2) {
      const route = document.querySelector('.scene-map__route');
      const length = route.getTotalLength();
      const ending = event.detail.choice === 'review' ? length * 0.38 : 0;
      route.style.strokeDasharray = String(length);
      route.style.strokeDashoffset = String(length);
      animate(route, { strokeDashoffset: [length, ending] }, { duration: 2.1, delay: 0.25, ease: [0.2, 0.7, 0.15, 1] });
      animate('.scene-map__label', { opacity: [0, 1], y: [8, 0] }, { duration: 0.6, delay: 0.8 });
    }
    if (event.detail.scene === 3) {
      animate('.scene-door__slab', { rotateY: [0, -16], opacity: [0.6, 1] }, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
      animate('.scene-door__beam', { opacity: [0, 0.75, 0.2], y: ['-120%', '0%', '120%'] }, { duration: 2.2, delay: 0.2, ease: 'easeInOut' });
      animate('.scene-door__stamp', { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.35, delay: 1.3 });
    }
  });

  window.addEventListener('story:reveal', () => {
    animate(reveal.querySelector('.reveal__copy'), { opacity: [0, 1], x: [-18, 0], filter: ['blur(6px)', 'blur(0px)'] }, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    animate('.reveal__stamp', { opacity: [0, 0.08], scale: [0.7, 1] }, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
  });

  window.addEventListener('story:reset', () => {
    animate('.portrait__silhouette', { opacity: [0.65, 1], scale: [0.96, 1] }, { duration: 0.7 });
  });
}
