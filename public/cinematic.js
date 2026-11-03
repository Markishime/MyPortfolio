// Interactive layer. Each animated property has one owner here:
// CSS `translate` (magnetic), `rotate` (tilt), and custom properties (glow, progress).
// Motion in editorial.js owns `transform`, so these never collide.
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const paused = () => reduced.matches || root.classList.contains('motion-paused');
const cleanups = [];
const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); cleanups.push(() => target.removeEventListener(type, fn, opts)); };

// ---------- Scroll-linked values (one rAF per scroll) ----------
const bar = document.querySelector('.scroll-progress span');
const heroInner = document.querySelector('.hero-inner');
const hero = document.querySelector('.hero');
const timeline = document.querySelector('.timeline');
let scrollQueued = false;
function onScrollFrame() {
  scrollQueued = false;
  const max = root.scrollHeight - innerHeight;
  const p = max > 0 ? scrollY / max : 0;
  if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
  root.classList.toggle('is-scrolled', scrollY > 24);

  // Hero copy drifts up and softens only after the visitor starts leaving it.
  if (heroInner && hero) {
    const h = hero.offsetHeight || 1;
    const t = Math.min(1, Math.max(0, scrollY / h));
    if (paused()) { heroInner.style.translate = ''; heroInner.style.opacity = ''; }
    else {
      heroInner.style.translate = `0 ${(-t * 90).toFixed(1)}px`;
      heroInner.style.opacity = String(1 - Math.max(0, t - 0.25) * 1.1);
    }
  }
  if (timeline) {
    const r = timeline.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / (r.height || 1)));
    timeline.style.setProperty('--progress', t.toFixed(3));
  }
}
const queueScroll = () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScrollFrame); } };
on(window, 'scroll', queueScroll, { passive: true });
on(window, 'resize', queueScroll);
new MutationObserver(queueScroll).observe(root, { attributes: true, attributeFilter: ['class'] });
onScrollFrame();

// ---------- Count-up numbers (final value is already in the HTML) ----------
const counters = [...document.querySelectorAll('[data-count]')];
const countObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    countObserver.unobserve(entry.target);
    if (paused()) continue;
    const el = entry.target, end = Number(el.dataset.count), start = performance.now(), dur = 1400;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = String(Math.round(end * (1 - Math.pow(1 - t, 4))));
      if (t < 1 && !paused()) requestAnimationFrame(step); else el.textContent = String(end);
    };
    requestAnimationFrame(step);
  }
}, { threshold: 0.6 });
counters.forEach((el) => countObserver.observe(el));

// ---------- Pointer effects: fine pointers only ----------
function setupPointer() {
  if (!fine.matches) return;
  const light = document.querySelector('.cursor-light');
  let lx = innerWidth / 2, ly = innerHeight / 2, cx = lx, cy = ly, lightRaf = 0;
  const follow = () => {
    cx += (lx - cx) * 0.14; cy += (ly - cy) * 0.14;
    light.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
    lightRaf = Math.abs(lx - cx) + Math.abs(ly - cy) > 0.5 ? requestAnimationFrame(follow) : 0;
  };
  on(window, 'pointermove', (e) => {
    lx = e.clientX; ly = e.clientY;
    root.classList.add('has-pointer');
    if (!paused() && !lightRaf) lightRaf = requestAnimationFrame(follow);
  }, { passive: true });
  on(document, 'pointerleave', () => root.classList.remove('has-pointer'));

  // Spotlight glow follows the pointer on every interactive surface.
  on(document, 'pointermove', (e) => {
    const surface = e.target.closest?.('.interactive-surface');
    if (!surface) return;
    const r = surface.getBoundingClientRect();
    surface.style.setProperty('--pointer-x', `${e.clientX - r.left}px`);
    surface.style.setProperty('--pointer-y', `${e.clientY - r.top}px`);
  }, { passive: true });

  // 3D tilt for project cards via the independent `rotate` property.
  document.addEventListener('pointerover', (e) => {
    const card = e.target.closest?.('.tilt');
    if (!card || card.dataset.tiltBound) return;
    card.dataset.tiltBound = '1';
    const move = (ev) => {
      if (paused()) return;
      const r = card.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
      const rx = -y * 6, ry = x * 7, deg = Math.hypot(rx, ry);
      card.style.rotate = deg > 0.01 ? `${(rx / deg).toFixed(3)} ${(ry / deg).toFixed(3)} 0 ${deg.toFixed(2)}deg` : '';
      card.classList.add('is-tilting');
    };
    const leave = () => { card.style.rotate = ''; card.classList.remove('is-tilting'); };
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', leave);
  });

  // Magnetic controls: the decoration moves, the hit area stays put.
  document.querySelectorAll('.magnetic').forEach((el) => {
    const move = (e) => {
      if (paused()) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
      el.style.translate = `${(x * 0.22).toFixed(1)}px ${(y * 0.3).toFixed(1)}px`;
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', () => { el.style.translate = ''; });
  });

  // Hero stage parallax: layers move at different depths.
  const stage = document.querySelector('.hero-stage');
  if (stage) {
    const layers = [['.hero-terminal', 18], ['.hero-tag--chip', 30], ['.hero-tag--stack', -24]]
      .map(([sel, depth]) => [stage.querySelector(sel), depth]).filter(([el]) => el);
    on(hero, 'pointermove', (e) => {
      if (paused()) return;
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      layers.forEach(([el, d]) => { el.style.translate = `${(x * d).toFixed(1)}px ${(y * d).toFixed(1)}px`; });
    }, { passive: true });
    on(hero, 'pointerleave', () => layers.forEach(([el]) => { el.style.translate = ''; }));
  }
}
setupPointer();

// Clear pointer-driven offsets whenever motion is paused.
new MutationObserver(() => {
  if (!paused()) return;
  document.querySelectorAll('.magnetic,.tilt,.hero-terminal,.hero-tag').forEach((el) => { el.style.translate = ''; el.style.rotate = ''; });
}).observe(root, { attributes: true, attributeFilter: ['class'] });

addEventListener('pagehide', (e) => { if (!e.persisted) { cleanups.forEach((fn) => fn()); countObserver.disconnect(); } });
