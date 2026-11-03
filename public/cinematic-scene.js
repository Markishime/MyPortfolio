// Procedural computer-engineering scene: a CPU package on a motherboard.
// Scroll drives one camera path and an exploded view of the chip layers.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const root = document.documentElement;
const isMotionPaused = () => root.classList.contains('motion-paused') || document.hidden;

// Seeded random so the board layout is identical on every visit.
let seed = 20250;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

export function start(canvas) {
  const mobile = matchMedia('(max-width: 767px)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08080a, mobile ? 0.03 : 0.026);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;

  const camera = new THREE.PerspectiveCamera(mobile ? 46 : 34, 1, 0.1, 200);
  const disposables = [envTexture, pmrem];
  const track = (thing) => (disposables.push(thing), thing);

  // ---------- Materials ----------
  const mat = {
    board: track(new THREE.MeshStandardMaterial({ color: 0x0c0d10, roughness: 0.78, metalness: 0.15 })),
    copper: track(new THREE.MeshStandardMaterial({ color: 0xc0703f, roughness: 0.32, metalness: 1, envMapIntensity: 0.9 })),
    pad: track(new THREE.MeshStandardMaterial({ color: 0xd9b27a, roughness: 0.25, metalness: 1 })),
    substrate: track(new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.55, metalness: 0.3 })),
    ihs: track(new THREE.MeshStandardMaterial({ color: 0xc8cbd0, roughness: 0.22, metalness: 1, envMapIntensity: 1.1 })),
    black: track(new THREE.MeshStandardMaterial({ color: 0x101012, roughness: 0.6, metalness: 0.2 })),
    silver: track(new THREE.MeshStandardMaterial({ color: 0x9a9da3, roughness: 0.3, metalness: 1 })),
    socket: track(new THREE.MeshStandardMaterial({ color: 0x1e1e22, roughness: 0.4, metalness: 0.6 })),
  };

  // Die surface: a canvas-drawn floorplan with a faint, steady accent glow.
  const dieCanvas = document.createElement('canvas');
  dieCanvas.width = dieCanvas.height = 512;
  const g = dieCanvas.getContext('2d');
  g.fillStyle = '#0c0c0f'; g.fillRect(0, 0, 512, 512);
  const blocks = [[24, 24, 220, 220], [268, 24, 220, 100], [268, 140, 104, 104], [384, 140, 104, 104], [24, 268, 464, 90], [24, 374, 140, 114], [180, 374, 308, 114]];
  blocks.forEach(([x, y, w, h], i) => {
    g.fillStyle = i % 2 ? '#1a1214' : '#151418'; g.fillRect(x, y, w, h);
    g.strokeStyle = 'rgba(255,90,54,.55)'; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, w - 2, h - 2);
    g.strokeStyle = 'rgba(255,120,80,.18)'; g.lineWidth = 1;
    for (let k = 8; k < Math.max(w, h); k += 8) {
      if (k < w) { g.beginPath(); g.moveTo(x + k, y + 4); g.lineTo(x + k, y + h - 4); g.stroke(); }
    }
  });
  const dieTexture = track(new THREE.CanvasTexture(dieCanvas));
  dieTexture.colorSpace = THREE.SRGBColorSpace;
  dieTexture.anisotropy = 4;
  const dieMat = track(new THREE.MeshStandardMaterial({
    map: dieTexture, emissiveMap: dieTexture, emissive: 0xff3b1d, emissiveIntensity: 0.55, roughness: 0.18, metalness: 0.6,
  }));

  // ---------- Board ----------
  const boardSize = 80;
  const board = new THREE.Mesh(track(new THREE.BoxGeometry(boardSize, 0.4, boardSize)), mat.board);
  board.position.y = -0.2;
  scene.add(board);

  const segs = [];
  const pads = [];
  const addSeg = (a, b) => segs.push([a, b]);
  const v = (x, z) => new THREE.Vector3(x, 0, z);
  const H = 4.6;
  const sides = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const perSide = mobile ? 14 : 22;
  for (const [dx, dz] of sides) {
    const d = v(dx, dz), t = v(-dz, dx);
    for (let i = 0; i < perSide; i++) {
      const u = -H + 0.5 + i * ((2 * H - 1) / (perSide - 1));
      const p0 = d.clone().multiplyScalar(H).addScaledVector(t, u);
      const p1 = p0.clone().addScaledVector(d, 0.8 + rand() * 3);
      const diag = d.clone().addScaledVector(t, Math.sign(u) || 1).normalize();
      const p2 = p1.clone().addScaledVector(diag, rand() * 4.5);
      const p3 = p2.clone().addScaledVector(d, 3 + rand() * 16);
      addSeg(p0, p1); addSeg(p1, p2); addSeg(p2, p3);
      pads.push(p3);
    }
  }
  // Parallel buses elsewhere on the board.
  for (let b = 0; b < 10; b++) {
    const horizontal = rand() > 0.5;
    const ox = (rand() - 0.5) * 60, oz = (rand() - 0.5) * 60;
    if (Math.abs(ox) < 9 && Math.abs(oz) < 9) continue;
    const len = 8 + rand() * 16, lanes = 6 + Math.floor(rand() * 6);
    for (let l = 0; l < lanes; l++) {
      const off = l * 0.32;
      const a = horizontal ? v(ox, oz + off) : v(ox + off, oz);
      const e = horizontal ? v(ox + len, oz + off) : v(ox + off, oz + len);
      addSeg(a, e); pads.push(a, e);
    }
  }

  const segGeo = track(new THREE.BoxGeometry(1, 0.035, 0.085));
  const traces = new THREE.InstancedMesh(segGeo, mat.copper, segs.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s3 = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  segs.forEach(([a, b], i) => {
    const mid = a.clone().add(b).multiplyScalar(0.5); mid.y = 0.02;
    const len = a.distanceTo(b) + 0.085;
    q.setFromAxisAngle(up, -Math.atan2(b.z - a.z, b.x - a.x));
    traces.setMatrixAt(i, m4.compose(mid, q, s3.set(len, 1, 1)));
  });
  scene.add(traces);

  const padGeo = track(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 14));
  const padMesh = new THREE.InstancedMesh(padGeo, mat.pad, pads.length);
  pads.forEach((p, i) => padMesh.setMatrixAt(i, m4.compose(v(p.x, p.z).setY(0.03), q.identity(), s3.set(1, 1, 1))));
  scene.add(padMesh);

  // Surface-mount parts and larger ICs, kept clear of the CPU socket.
  const clear = (x, z, r) => Math.abs(x) < r && Math.abs(z) < r;
  const smdCount = mobile ? 70 : 150;
  const smd = new THREE.InstancedMesh(track(new THREE.BoxGeometry(0.62, 0.22, 0.32)), mat.black, smdCount);
  const smdCaps = new THREE.InstancedMesh(track(new THREE.BoxGeometry(0.12, 0.23, 0.33)), mat.silver, smdCount * 2);
  for (let i = 0; i < smdCount; i++) {
    let x, z; do { x = (rand() - 0.5) * 56; z = (rand() - 0.5) * 56; } while (clear(x, z, 7.5));
    q.setFromAxisAngle(up, rand() > 0.5 ? 0 : Math.PI / 2);
    smd.setMatrixAt(i, m4.compose(v(x, z).setY(0.11), q, s3.set(1, 1, 1)));
    const ax = new THREE.Vector3(0.31, 0, 0).applyQuaternion(q);
    smdCaps.setMatrixAt(i * 2, m4.compose(v(x + ax.x, z + ax.z).setY(0.11), q, s3));
    smdCaps.setMatrixAt(i * 2 + 1, m4.compose(v(x - ax.x, z - ax.z).setY(0.11), q, s3));
  }
  scene.add(smd, smdCaps);

  const icSpots = [[-14, -9, 0], [13, 11, 1], [-12, 13, 1], [16, -12, 0], [-22, 2, 1], [24, 3, 0], [3, -20, 0], [-4, 21, 1]];
  const pinGeo = track(new THREE.BoxGeometry(0.1, 0.12, 0.42));
  const icPins = new THREE.InstancedMesh(pinGeo, mat.silver, icSpots.length * 20);
  let pinIndex = 0;
  for (const [x, z, rot] of icSpots) {
    const ic = new THREE.Mesh(track(new THREE.BoxGeometry(3.4, 0.45, 2.1)), mat.black);
    ic.position.set(x, 0.24, z); ic.rotation.y = rot * Math.PI / 2;
    scene.add(ic);
    q.setFromAxisAngle(up, ic.rotation.y);
    for (let k = 0; k < 10; k++) for (const side of [-1, 1]) {
      const local = new THREE.Vector3(-1.45 + k * 0.32, 0.06, side * 1.22).applyQuaternion(q);
      icPins.setMatrixAt(pinIndex++, m4.compose(local.add(v(x, z)), q, s3.set(1, 1, 1)));
    }
  }
  scene.add(icPins);

  const capGeo = track(new THREE.CylinderGeometry(0.62, 0.62, 1.7, 28));
  [[-9, -12], [-7.6, -12], [10, 14.5], [11.4, 14.5], [-18, -4], [19, 8], [-6, 17], [7, -17]].forEach(([x, z]) => {
    const cap = new THREE.Mesh(capGeo, mat.silver);
    cap.position.set(x, 0.85, z);
    scene.add(cap);
  });

  // ---------- CPU package (layers lift apart on scroll) ----------
  const cpu = new THREE.Group();
  scene.add(cpu);
  const socket = new THREE.Mesh(track(new THREE.BoxGeometry(10.4, 0.5, 10.4)), mat.socket);
  socket.position.y = 0.25;
  cpu.add(socket);

  const pinsLayer = new THREE.Group();
  const gridN = mobile ? 14 : 20;
  const ballGeo = track(new THREE.SphereGeometry(0.12, 10, 8));
  const balls = new THREE.InstancedMesh(ballGeo, mat.pad, gridN * gridN);
  for (let i = 0, n = 0; i < gridN; i++) for (let j = 0; j < gridN; j++) {
    balls.setMatrixAt(n++, m4.compose(v(-3.6 + i * (7.2 / (gridN - 1)), -3.6 + j * (7.2 / (gridN - 1))), q.identity(), s3.set(1, 1, 1)));
  }
  pinsLayer.add(balls);
  cpu.add(pinsLayer);

  const substrate = new THREE.Mesh(track(new THREE.BoxGeometry(8.6, 0.32, 8.6)), mat.substrate);
  const die = new THREE.Mesh(track(new THREE.BoxGeometry(4.4, 0.22, 4.4)), [mat.black, mat.black, dieMat, mat.black, mat.black, mat.black]);
  const ihs = new THREE.Group();
  const ihsTop = new THREE.Mesh(track(new THREE.BoxGeometry(7, 0.3, 7)), mat.ihs);
  const ihsLip = new THREE.Mesh(track(new THREE.BoxGeometry(7.8, 0.12, 7.8)), mat.ihs);
  ihsLip.position.y = -0.18;
  ihs.add(ihsTop, ihsLip);
  cpu.add(substrate, die, ihs);

  // ---------- Lights ----------
  scene.add(new THREE.HemisphereLight(0xc4cad8, 0x0a0a0c, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(-12, 22, 10);
  scene.add(key);
  const rim = new THREE.PointLight(0xff3b1d, 90, 46, 1.7);
  rim.position.set(7, 4, -7);
  const warm = new THREE.PointLight(0xff7a4a, 26, 40, 1.8);
  warm.position.set(-9, 5, 11);
  scene.add(rim, warm);

  // ---------- Camera path ----------
  // Each key is anchored to a section, so the path follows the story, not raw page length.
  // Key: anchor, camera position, look target, explode amount, exposure.
  const K = (at, pos, look, explode, exposure) => ({ at, p: 0, pos: new THREE.Vector3(...pos), look: new THREE.Vector3(...look), explode, exposure });
  const keys = mobile ? [
    K(0, [0, 14, 21], [0, -3.5, 3], 0.3, 1.1),
    K('#about', [-6, 16, 12], [0, 2, 0], 1, 0.9),
    K('.showcase', [9, 13, 13], [0, 2.4, 0], 0.85, 0.8),
    K('#projects', [0, 30, 6], [0, 0, 0], 0.45, 0.65),
    K('#skills', [16, 9, -9], [0, 1, 0], 0.15, 0.72),
    K('#contact', [0, 12, 22], [0, 1, 0], 0, 0.95),
    K(1, [0, 11, 20], [0, 1.2, 0], 0, 1),
  ] : [
    K(0, [10.5, 13, 25.5], [-7.2, -1, 1.8], 0.35, 1.15),
    K('#about', [-10, 7.5, 13], [1.5, 3.4, 0], 1, 1),
    K('.showcase', [11, 9, 12], [3.5, 2.8, 0], 0.9, 0.82),
    K('#projects', [0, 27, 5], [0, 0, 0], 0.45, 0.68),
    K('#skills', [15, 6.5, -9], [0, 0.8, 0], 0.12, 0.76),
    K('#contact', [0, 8.5, 18], [0, 1.4, 0], 0, 1),
    K(1, [0, 8, 16.5], [0, 1.4, 0], 0, 1.05),
  ];
  const resolveKeys = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    let prev = 0;
    for (const k of keys) {
      let p = typeof k.at === 'number' ? k.at : 0;
      if (typeof k.at === 'string') {
        const el = document.querySelector(k.at);
        if (el) p = (el.getBoundingClientRect().top + scrollY - innerHeight * 0.35) / max;
      }
      k.p = prev = Math.min(1, Math.max(prev + 0.001, p));
    }
  };
  resolveKeys();
  const layoutWatch = new ResizeObserver(() => resolveKeys());
  layoutWatch.observe(document.body);
  const smooth = (x) => x * x * (3 - 2 * x);
  const sample = (p, out) => {
    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1].p) i++;
    const a = keys[i], b = keys[i + 1];
    const t = smooth(THREE.MathUtils.clamp((p - a.p) / (b.p - a.p), 0, 1));
    out.pos.lerpVectors(a.pos, b.pos, t);
    out.look.lerpVectors(a.look, b.look, t);
    out.explode = a.explode + (b.explode - a.explode) * t;
    out.exposure = a.exposure + (b.exposure - a.exposure) * t;
    return out;
  };
  const target = { pos: new THREE.Vector3(), look: new THREE.Vector3(), explode: 0, exposure: 1 };
  const current = { pos: new THREE.Vector3(), look: new THREE.Vector3(), explode: 0, exposure: 1 };

  const scrollProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    return max > 0 ? THREE.MathUtils.clamp(scrollY / max, 0, 1) : 0;
  };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => { pointer.tx = e.clientX / innerWidth - 0.5; pointer.ty = e.clientY / innerHeight - 0.5; };
  if (finePointer) addEventListener('pointermove', onPointer, { passive: true });

  const applyLayers = (e, time) => {
    const breathe = time ? Math.sin(time * 0.0006) * 0.04 * e : 0;
    pinsLayer.position.y = 0.55 - e * 0.25;
    substrate.position.y = 0.66 + e * 0.9;
    die.position.y = 0.93 + e * 2.6 + breathe;
    ihs.position.y = 1.2 + e * 5 + breathe * 2;
    ihs.rotation.y = e * 0.18;
    substrate.rotation.y = -e * 0.06;
  };

  const resize = () => {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener('resize', resize);

  // ---------- One clock ----------
  let raf = 0, last = 0, running = false;
  const draw = (time, snap) => {
    // Paused or reduced motion: hold a single, authored hero frame.
    const p = snap === 'static' ? 0 : scrollProgress();
    sample(p, target);
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    if (snap) {
      current.pos.copy(target.pos); current.look.copy(target.look);
      current.explode = target.explode; current.exposure = target.exposure;
    } else {
      const dt = Math.min(64, time - last || 16);
      const k = 1 - Math.exp(-dt * 0.0045);
      current.pos.lerp(target.pos, k);
      current.look.lerp(target.look, k);
      current.explode += (target.explode - current.explode) * k;
      current.exposure += (target.exposure - current.exposure) * k;
    }
    last = time;
    const px = snap === 'static' ? 0 : pointer.x, py = snap === 'static' ? 0 : pointer.y;
    camera.position.set(current.pos.x + px * 2.2, current.pos.y - py * 1.2, current.pos.z);
    camera.lookAt(current.look);
    applyLayers(current.explode, snap === 'static' ? 0 : time);
    // Hero turntable: the chip turns slowly while the hero is in view, settles after.
    const heroWeight = snap === 'static' ? 0 : Math.max(0, 1 - p / Math.max(0.001, keys[1].p));
    cpu.rotation.y = Math.sin(time * 0.00028) * 0.55 * heroWeight;
    renderer.toneMappingExposure = current.exposure;
    renderer.render(scene, camera);
  };
  const loop = (time) => {
    raf = 0;
    if (!running) return;
    draw(time);
    raf = requestAnimationFrame(loop);
  };
  const sync = () => {
    const shouldRun = !isMotionPaused();
    if (shouldRun && !running) { running = true; last = performance.now(); draw(last, 'snap'); raf = requestAnimationFrame(loop); }
    if (!shouldRun) { running = false; cancelAnimationFrame(raf); raf = 0; if (!document.hidden) draw(performance.now(), 'static'); }
  };
  const classWatch = new MutationObserver(sync);
  classWatch.observe(root, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', sync);
  addEventListener('resize', () => { if (!running) draw(performance.now(), 'static'); });

  // First frame proves the renderer works before we announce "ready".
  draw(performance.now(), isMotionPaused() ? 'static' : 'snap');
  sync();

  const dispose = () => {
    running = false; cancelAnimationFrame(raf);
    classWatch.disconnect();
    layoutWatch.disconnect();
    removeEventListener('resize', resize);
    removeEventListener('pointermove', onPointer);
    scene.traverse((o) => { if (o.isInstancedMesh) o.dispose(); });
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
  };
  addEventListener('pagehide', (e) => { if (!e.persisted) dispose(); });
  return { dispose, renderer };
}
