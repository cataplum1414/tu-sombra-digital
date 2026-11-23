import { animate, inView, scroll } from 'https://cdn.jsdelivr.net/npm/motion@14.14.0/+esm';

document.documentElement.classList.add('has-motion');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const portrait = document.querySelector('.portrait');
const opening = document.querySelector('.opening');
const story = document.querySelector('.story');
const storyScene = document.querySelector('.story__scene');
const sceneArt = document.querySelector('#scene-art');
const reveal = document.querySelector('.reveal');
let audioPulse = null;

if (!reduced) {
  animate('.portrait__silhouette', { opacity: [0, 1], scale: [0.88, 1], filter: ['blur(8px)', 'blur(0px)'] }, { duration: 1.3, ease: [0.22, 1, 0.36, 1] });
  animate('.portrait__eye', { scaleX: [0.3, 1.15, 0.55, 1], opacity: [0.25, 1, 0.45, 0.8] }, { duration: 5.6, repeat: Infinity, ease: 'easeInOut' });
  animate('.portrait__halo', { scale: [0.84, 1.12, 0.92], opacity: [0.38, 0.88, 0.52] }, { duration: 5.2, repeat: Infinity, ease: 'easeInOut' });
  animate('.portrait__orbit--one', { rotate: [-21, 15, -21], scaleY: [0.56, 0.62, 0.56] }, { duration: 16, repeat: Infinity, ease: 'linear' });
  animate('.portrait__orbit--two', { rotate: [39, -22, 39], scaleY: [0.47, 0.55, 0.47] }, { duration: 22, repeat: Infinity, ease: 'linear' });
  animate('.portrait__scanline', { y: ['-120%', '125%'] }, { duration: 6.5, repeat: Infinity, ease: 'linear' });
  animate('.fragment', { opacity: [0, 1], y: [18, 0], rotate: [-4, 0], filter: ['blur(6px)', 'blur(0px)'] }, { duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] });
  animate('.fragment--location', { opacity: [0.72, 1, 0.78] }, { duration: 2.8, delay: 1.2, repeat: Infinity, ease: 'easeInOut' });

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

  window.addEventListener('story:clue', (event) => {
    const target = document.querySelector(`[data-clue="${event.detail.clue}"]`);
    animate(target, { scale: [0.72, 1.26, 1], rotate: [0, -8, 0] }, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    const panel = document.querySelector('.portrait__clue-panel');
    animate(panel, { opacity: [0, 1], y: [18, 0], filter: ['blur(7px)', 'blur(0px)'] }, { duration: 0.48, ease: [0.22, 1, 0.36, 1] });
  });

  window.addEventListener('story:audio', (event) => {
    if (event.detail.active) {
      audioPulse?.stop();
      audioPulse = animate('.portrait__silhouette', { scale: [1, 1.035, 1], filter: ['brightness(1)', 'brightness(1.28)', 'brightness(1)'] }, { duration: 1.2, repeat: Infinity, repeatDelay: 2.8, ease: 'easeInOut' });
    } else audioPulse?.stop();
  });

  window.addEventListener('story:scene', (event) => {
    animate('.scene-copy', { opacity: [0, 0.4, 1], x: [18, 0], filter: ['blur(5px)', 'blur(0px)'] }, { duration: 0.8, ease: [0.22, 1, 0.36, 1] });
    if (event.detail.scene === 2) {
      const route = document.querySelector(event.detail.choice === 'share' ? '.scene-map__route--home' : '.scene-map__route--safe');
      const otherRoute = document.querySelector(event.detail.choice === 'share' ? '.scene-map__route--safe' : '.scene-map__route--home');
      const length = route.getTotalLength();
      const otherLength = otherRoute.getTotalLength();
      route.style.strokeDasharray = String(length);
      route.style.strokeDashoffset = String(length);
      otherRoute.style.strokeDasharray = String(otherLength);
      otherRoute.style.strokeDashoffset = String(otherLength);
      const map = document.querySelector('.scene-map');
      map.classList.add('is-zooming');
      const destination = document.querySelector(event.detail.choice === 'share' ? '.scene-map__destination--home' : '.scene-map__destination--safe');
      const mapBox = map.getBoundingClientRect();
      const targetBox = destination.getBoundingClientRect();
      const zoom = 1.45;
      const cameraX = (mapBox.left + mapBox.width / 2 - targetBox.left - targetBox.width / 2) * zoom;
      const cameraY = (mapBox.top + mapBox.height / 2 - targetBox.top - targetBox.height / 2) * zoom;
      animate(map, { scale: [0.94, 1, zoom], x: [0, 0, cameraX], y: [0, 0, cameraY], opacity: [0.25, 1, 1] }, { duration: 1.25, delay: 1.4, ease: [0.16, 1, 0.3, 1] });
      animate(route, { strokeDashoffset: [length, 0] }, { duration: 2.25, delay: 0.12, ease: [0.2, 0.7, 0.15, 1] });
      animate(event.detail.choice === 'share' ? '.scene-map__destination--home' : '.scene-map__destination--safe', { scale: [0.5, 1.8, 1], opacity: [0, 1, 1] }, { duration: 0.55, delay: 2.15, ease: [0.16, 1, 0.3, 1] });
      animate('.scene-map__label', { opacity: [0, 1], y: [8, 0] }, { duration: 0.6, delay: 0.7 });
    }
    if (event.detail.scene === 3) {
      if (event.detail.choice === 'share') {
        animate(storyScene, { x: [0, -13, 8, -4, 0], filter: ['brightness(1)', 'brightness(.42)', 'brightness(1.4)', 'brightness(.82)', 'brightness(1)'] }, { duration: 0.62, ease: 'easeOut' });
        animate('.scene-door__slab', { rotateY: [0, -62, -52], x: [0, -10, -5], opacity: [0.6, 1, 1] }, { duration: 0.72, delay: 0.12, ease: [0.18, 0.75, 0.25, 1] });
        animate('.scene-door__beam', { opacity: [0, 0.92, 0.18], y: ['-120%', '0%', '120%'] }, { duration: 0.78, delay: 0.16, ease: 'easeIn' });
        animate('.scene-door__stamp', { opacity: [0, 1], scale: [1.4, 0.92, 1], rotate: [8, -3, 4] }, { duration: 0.42, delay: 0.72, ease: [0.16, 1, 0.3, 1] });
      } else {
        animate('.scene-safe__lamp', { opacity: [0, 1], scale: [0.6, 1.2, 1] }, { duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] });
        animate('.scene-safe__pool', { opacity: [0, 0.9], scale: [0.75, 1] }, { duration: 1.2, delay: 0.25, ease: 'easeOut' });
        animate('.scene-safe__person', { opacity: [0, 1], y: [10, 0] }, { duration: 0.55, delay: 0.45, ease: [0.16, 1, 0.3, 1] });
      }
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
