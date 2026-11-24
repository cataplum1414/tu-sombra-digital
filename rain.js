(() => {
  const story = document.querySelector('.story');
  const opening = document.querySelector('.campaign-opening');
  const canvas = document.querySelector('#rain-canvas');
  const context = canvas?.getContext('2d', { alpha: true });
  if (!story || !opening || !canvas || !context) return;

  // Keep the glass effect viewport-sized even while the story uses 3D transforms.
  document.body.append(canvas);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let streaks = [];
  let drops = [];
  let raf = 0;
  let active = false;
  let lastTime = 0;

  const random = (min, max) => min + Math.random() * (max - min);

  function seedRain() {
    const density = Math.max(64, Math.min(150, Math.round(width / 7)));
    streaks = Array.from({ length: density }, () => ({
      x: random(-40, width + 40),
      y: random(-height, height),
      length: random(12, 38),
      speed: random(2.2, 6.3),
      drift: random(-1.35, -.3),
      alpha: random(.1, .26),
      line: random(.65, 1.35)
    }));

    const count = Math.max(28, Math.min(64, Math.round(width / 12)));
    drops = Array.from({ length: count }, () => ({
      x: random(0, width),
      y: random(0, height),
      radius: random(2.3, 8.5),
      speed: random(.06, .42),
      slide: random(-.13, .13),
      alpha: random(.12, .3),
      phase: random(0, Math.PI * 2),
      trail: random(9, 32)
    }));
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    seedRain();
    if (reduceMotion.matches) draw(0, false);
  }

  function paintGlassDrop(drop, time, move) {
    const sway = Math.sin(time * .00055 + drop.phase) * drop.radius * .22;
    if (move) {
      drop.y += drop.speed;
      drop.x += drop.slide + sway * .008;
      if (drop.y - drop.radius > height) {
        drop.y = -drop.radius * 2;
        drop.x = random(0, width);
      }
    }
    const x = drop.x + sway;
    const r = drop.radius;
    const gradient = context.createRadialGradient(x - r * .34, drop.y - r * .4, .2, x, drop.y, r * 1.35);
    gradient.addColorStop(0, `rgba(226,239,245,${drop.alpha * .8})`);
    gradient.addColorStop(.45, `rgba(127,157,171,${drop.alpha * .35})`);
    gradient.addColorStop(1, 'rgba(4,8,12,0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(x, drop.y, r * .74, r * 1.18, -.12, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = `rgba(226,239,245,${drop.alpha * .9})`;
    context.lineWidth = .8;
    context.beginPath();
    context.arc(x - r * .14, drop.y - r * .12, r * .7, Math.PI * 1.1, Math.PI * 1.78);
    context.stroke();
    if (r > 3.4) {
      context.strokeStyle = `rgba(188,215,227,${drop.alpha * .36})`;
      context.beginPath();
      context.moveTo(x, drop.y + r * .9);
      context.quadraticCurveTo(x + sway * .08, drop.y + drop.trail * .5, x + sway * .12, drop.y + drop.trail);
      context.stroke();
    }
  }

  function draw(time, move) {
    context.clearRect(0, 0, width, height);
    const heavy = !story.hidden && story.classList.contains('is-heavy-rain');
    streaks.forEach((streak) => {
      if (move) {
        streak.y += streak.speed * (heavy ? 1.35 : 1);
        streak.x += streak.drift * (heavy ? 1.25 : 1);
        if (streak.y - streak.length > height) {
          streak.y = random(-150, -20);
          streak.x = random(-30, width + 30);
        }
      }
      context.strokeStyle = `rgba(206,222,230,${streak.alpha * (heavy ? 1.2 : 1)})`;
      context.lineWidth = streak.line;
      context.beginPath();
      context.moveTo(streak.x, streak.y);
      context.lineTo(streak.x + streak.drift * 1.3, streak.y + streak.length * (heavy ? 1.3 : 1));
      context.stroke();
    });
    drops.forEach((drop) => paintGlassDrop(drop, time, move));
  }

  function animate(time) {
    if (!active || document.hidden || reduceMotion.matches) return;
    if (!lastTime || time - lastTime > 18) {
      draw(time, true);
      lastTime = time;
    }
    raf = requestAnimationFrame(animate);
  }

  function isExperienceVisible() {
    return !opening.hidden || !story.hidden;
  }

  function syncExperience() {
    if (!isExperienceVisible()) {
      stop();
      return;
    }
    document.body.classList.toggle('is-heavy-rain', !story.hidden && story.classList.contains('is-heavy-rain'));
    start();
  }

  function start() {
    active = true;
    document.body.classList.add('is-raining');
    document.body.classList.toggle('is-heavy-rain', story.classList.contains('is-heavy-rain'));
    if (reduceMotion.matches) {
      cancelAnimationFrame(raf);
      draw(0, false);
      return;
    }
    if (!raf && !document.hidden) raf = requestAnimationFrame(animate);
  }

  function stop() {
    active = false;
    document.body.classList.remove('is-raining', 'is-heavy-rain');
    cancelAnimationFrame(raf);
    raf = 0;
    context.clearRect(0, 0, width, height);
  }

  const observer = new MutationObserver(syncExperience);
  observer.observe(story, { attributes: true, attributeFilter: ['hidden', 'class'] });
  observer.observe(opening, { attributes: true, attributeFilter: ['hidden', 'class'] });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (active && !reduceMotion.matches) {
      raf = requestAnimationFrame(animate);
    }
  });
  reduceMotion.addEventListener?.('change', () => {
    cancelAnimationFrame(raf);
    raf = 0;
    if (active) start();
  });
  window.addEventListener('story:ending', syncExperience);
  window.addEventListener('story:reset', syncExperience);

  resize();
  syncExperience();
})();
