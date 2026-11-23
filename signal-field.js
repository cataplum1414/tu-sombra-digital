(() => {
  const canvas = document.querySelector('#signal-field');
  const portrait = canvas?.closest('.portrait');
  const context = canvas?.getContext('2d', { alpha: true, desynchronized: true });
  if (!canvas || !portrait || !context) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const lowMemory = (navigator.deviceMemory || 4) <= 4;
  const points = [];
  const pulses = [];
  const pointCount = lowMemory || coarse ? 18 : 30;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frame = 0;
  let visible = false;
  let audioActive = false;
  let pointer = { x: -100, y: -100, active: false };

  for (let i = 0; i < pointCount; i += 1) {
    const angle = (Math.PI * 2 * i) / pointCount;
    const radius = 0.18 + Math.random() * 0.31;
    points.push({
      x: 0.5 + Math.cos(angle) * radius,
      y: 0.5 + Math.sin(angle) * radius,
      phase: Math.random() * Math.PI * 2,
      speed: 0.00018 + Math.random() * 0.0003
    });
  }

  function resize() {
    const rect = portrait.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    pixelRatio = Math.min(window.devicePixelRatio || 1, lowMemory ? 1.15 : 1.5);
    canvas.width = Math.max(1, Math.round(width * pixelRatio));
    canvas.height = Math.max(1, Math.round(height * pixelRatio));
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw(performance.now());
  }

  function addPulse(x, y) {
    pulses.push({ x, y, time: performance.now() });
    if (pulses.length > 5) pulses.shift();
  }

  function draw(now) {
    context.clearRect(0, 0, width, height);
    if (!width || !height) return;

    const centerX = width * (0.5 + (pointer.active ? (pointer.x / width - 0.5) * 0.035 : 0));
    const centerY = height * (0.5 + (pointer.active ? (pointer.y / height - 0.5) * 0.035 : 0));
    const glow = context.createRadialGradient(centerX, centerY, 2, centerX, centerY, Math.max(width, height) * 0.48);
    glow.addColorStop(0, audioActive ? 'rgba(255,74,86,.18)' : 'rgba(255,74,86,.10)');
    glow.addColorStop(0.55, 'rgba(71,57,92,.08)');
    glow.addColorStop(1, 'rgba(9,11,17,0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    const scanY = ((now * 0.00011) % 1) * height;
    const scan = context.createLinearGradient(0, scanY - 18, 0, scanY + 18);
    scan.addColorStop(0, 'rgba(255,69,90,0)');
    scan.addColorStop(0.5, audioActive ? 'rgba(255,69,90,.62)' : 'rgba(255,69,90,.36)');
    scan.addColorStop(1, 'rgba(255,69,90,0)');
    context.fillStyle = scan;
    context.fillRect(0, scanY - 18, width, 36);

    const positions = points.map((point) => {
      const drift = Math.sin(now * point.speed + point.phase);
      return {
        x: point.x * width + drift * 12 + (pointer.active ? (pointer.x - width / 2) * 0.018 : 0),
        y: point.y * height + Math.cos(now * point.speed + point.phase) * 14 + (pointer.active ? (pointer.y - height / 2) * 0.018 : 0)
      };
    });

    context.lineWidth = 1;
    for (let i = 0; i < positions.length; i += 1) {
      for (let j = i + 1; j < positions.length; j += 1) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const distance = Math.hypot(dx, dy);
        if (distance > width * 0.24) continue;
        context.strokeStyle = `rgba(157,111,153,${(1 - distance / (width * 0.24)) * (audioActive ? 0.33 : 0.2)})`;
        context.beginPath();
        context.moveTo(positions[i].x, positions[i].y);
        context.lineTo(positions[j].x, positions[j].y);
        context.stroke();
      }
    }

    positions.forEach((point, index) => {
      const flicker = 0.35 + (Math.sin(now * 0.002 + points[index].phase) + 1) * 0.25;
      context.beginPath();
      context.fillStyle = index % 5 === 0 ? `rgba(255,105,115,${flicker})` : `rgba(200,245,106,${flicker * 0.72})`;
      context.arc(point.x, point.y, index % 5 === 0 ? 1.8 : 1.25, 0, Math.PI * 2);
      context.fill();
    });

    pulses.forEach((pulse) => {
      const age = (now - pulse.time) / 1200;
      if (age >= 1) return;
      context.beginPath();
      context.strokeStyle = `rgba(255,86,102,${(1 - age) * 0.85})`;
      context.lineWidth = 1.5;
      context.arc(pulse.x, pulse.y, 8 + age * Math.max(width, height) * 0.34, 0, Math.PI * 2);
      context.stroke();
    });
    while (pulses.length && now - pulses[0].time > 1200) pulses.shift();

    if (!reducedMotion && visible && !document.hidden) frame = requestAnimationFrame(draw);
  }

  function start() {
    if (reducedMotion || !visible || document.hidden || frame) return;
    frame = requestAnimationFrame((now) => { frame = 0; draw(now); });
  }

  function stop() {
    if (!frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
  }

  portrait.addEventListener('pointermove', (event) => {
    const rect = portrait.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
    if (reducedMotion) draw(performance.now());
  }, { passive: true });
  portrait.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
  portrait.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.clue-hotspot')) return;
    const rect = portrait.getBoundingClientRect();
    addPulse(event.clientX - rect.left, event.clientY - rect.top);
    if (reducedMotion) draw(performance.now());
    else start();
  }, { passive: true });

  window.addEventListener('story:clue', (event) => {
    const target = document.querySelector(`[data-clue="${event.detail.clue}"]`);
    const rect = target.getBoundingClientRect();
    const parent = portrait.getBoundingClientRect();
    addPulse(rect.left + rect.width / 2 - parent.left, rect.top + rect.height / 2 - parent.top);
    if (reducedMotion) draw(performance.now());
    else start();
  });
  window.addEventListener('story:audio', (event) => { audioActive = event.detail.active; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(portrait);
  else window.addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    }).observe(portrait);
  } else {
    visible = true;
    start();
  }
  resize();
})();
