// Portfolio enhancements: scroll-driven robot guide and the AI video showcase.

(() => {
  /* ---------------- AI video showcase ---------------- */
  const LONG_VIDEOS = [
    { id: "wTdmbLOWvZY", title: "How NVIDIA Went From Gaming Chips to Powering AI (in 60 Seconds)", tag: "Tech explainer" },
    { id: "DZT5-1GVmpg", title: "I Do Love the Smiths… Made with Higgsfield Genjutsu", tag: "AI animation" },
    { id: "f1gazCPoVV0", title: "What If You Needed Surgery 30,000 Years Ago?", tag: "History explainer" },
    { id: "ofBQ4GtGRXw", title: "Why “Just One Video” Turns Into Midnight", tag: "Psychology explainer" },
    { id: "zNDnXmd9mQ8", title: "Why Were Spartans So Feared? The Dark Truth About Sparta", tag: "History explainer" },
    { id: "M91RkLhPvfk", title: "What Was Love & Pleasure Like in Ancient Times?", tag: "History explainer" },
  ];
  const SHORTS = [
    { id: "GjwffUlqe9U", title: "If You Sneeze, You Teleport (I Ended Up Flying a Plane)" },
    { id: "XWBJyQlJ1cY", title: "The Eiffel Tower Was Built to Be Torn Down?!" },
    { id: "Ja0MSAWnjus", title: "In This Town, You MUST Wave at the Yellow Bus…" },
    { id: "hSpqe-eIgb0", title: "The War That Saved the Leaning Tower of Pisa" },
    { id: "XtUCWNuxg_U", title: "Why You Can’t Stop Scrolling" },
    { id: "aShXOEXeKBk", title: "AI Short" },
    { id: "3_DP3rXeGJU", title: "Imagine Living Here Under This Beautiful Moon" },
    { id: "IainCCAYtW8", title: "The Hardest Working Office Cat" },
    { id: "N1rM1Ns0vpg", title: "Odysseus Survived Troy… But Couldn’t Get Home?!" },
    { id: "JjCn2Cb8f5s", title: "Cat Fires His Human For Being Late" },
    { id: "ozwmMqBYaf8", title: "Security Dog Enforces Strict Lobby Access" },
  ];

  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor"/></svg>';

  const card = (video, kind) => `
    <article class="video-card video-card--${kind}">
      <button class="video-thumb" type="button" data-video="${esc(video.id)}" data-title="${esc(video.title)}" aria-label="Play video: ${esc(video.title)}">
        <img src="https://i.ytimg.com/vi/${esc(video.id)}/hqdefault.jpg" alt="" loading="lazy" decoding="async" width="480" height="360">
        <span class="video-play">${playIcon}</span>
        ${video.tag ? `<span class="video-tag">${esc(video.tag)}</span>` : ""}
      </button>
      <h4>${esc(video.title)}</h4>
    </article>`;

  const longGrid = document.querySelector("#video-long");
  const shortsRail = document.querySelector("#video-shorts");
  if (longGrid) longGrid.innerHTML = LONG_VIDEOS.map((v) => card(v, "long")).join("");
  if (shortsRail) shortsRail.innerHTML = SHORTS.map((v) => card(v, "short")).join("");

  // Click-to-load player: no third-party iframe until the visitor asks for one.
  document.addEventListener("click", (event) => {
    const thumb = event.target.closest(".video-thumb");
    if (!thumb) return;
    const frame = document.createElement("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(thumb.dataset.video)}?autoplay=1&rel=0&playsinline=1`;
    frame.title = thumb.dataset.title;
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    frame.className = "video-frame";
    thumb.replaceWith(frame);
  });

  // Featured (self-hosted) AI videos: play inline with native controls.
  document.querySelectorAll(".featured-play").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".featured-card");
      const video = card && card.querySelector("video");
      if (!video) return;
      document.querySelectorAll(".featured-card.is-playing video").forEach((other) => {
        if (other !== video) other.pause();
      });
      card.classList.add("is-playing");
      video.controls = true;
      if (video.loop && video.muted) video.loop = false;
      video.play().catch(() => {});
      video.focus({ preventScroll: true });
    });
  });

  document.querySelectorAll(".rail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!shortsRail) return;
      const dir = btn.dataset.rail === "next" ? 1 : -1;
      shortsRail.scrollBy({ left: dir * shortsRail.clientWidth * 0.8, behavior: "smooth" });
    });
  });

  /* ---------------- Scroll-driven robot guide ---------------- */
  const bot = document.querySelector(".bot-companion");
  const anchor = document.querySelector(".hero-bot-anchor");
  if (!bot || !anchor) return;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const bubbleText = bot.querySelector(".bot-bubble-text");
  const eyes = bot.querySelector(".bot-eyes");
  const SECTION_LINES = {
    about: "meet the engineer",
    experience: "reviewing experience",
    projects: "shipping projects",
    videos: "editing AI videos",
    skills: "checking the toolkit",
    learning: "studying up",
    contact: "let’s build together",
  };
  const SECTION_NAMES = {
    about: "About", experience: "Experience", projects: "Projects", videos: "Videos",
    skills: "Skills", learning: "Education", contact: "Contact",
  };
  const sections = Object.keys(SECTION_LINES).map((id) => document.getElementById(id)).filter(Boolean);

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const cur = { x: 0, y: 0, w: 0, r: 0, lag: 0, eye: 0 };
  let lastScroll = scrollY;
  let velocity = 0;
  let started = false;
  let docked = false;

  const roamSize = () => (innerWidth < 768 ? 66 : innerWidth < 1100 ? 92 : 112);

  // Reduced motion: park in the bottom-right corner instead of roaming.
  const dock = () => {
    const w = roamSize();
    const margin = innerWidth < 768 ? 12 : 26;
    return { x: innerWidth - w - margin, y: innerHeight - w * 1.2 - margin, w };
  };

  // Roaming flight path. Every scroll position maps to a spot on screen, so
  // scrolling sends the robot across the whole viewport along a looping,
  // never-repeating-looking curve (two sine waves at unrelated frequencies).
  const roam = () => {
    const w = roamSize();
    const h = w * 1.2;
    const top = innerWidth < 768 ? 84 : 104;
    const margin = innerWidth < 768 ? 10 : 24;
    const t = scrollY / (innerWidth < 768 ? 420 : 560);
    const nx = clamp(0.5 + 0.42 * Math.sin(t) + 0.08 * Math.sin(t * 2.7 + 1), 0, 1);
    const ny = clamp(0.5 + 0.38 * Math.sin(t * 0.73 + 2.1) + 0.12 * Math.sin(t * 1.9), 0, 1);
    return {
      x: margin + nx * (innerWidth - w - margin * 2),
      y: top + ny * (innerHeight - h - top - margin),
      w,
    };
  };

  let facing = 1;
  const frame = () => {
    const still = reduce.matches;
    const rect = anchor.getBoundingClientRect();
    const goal = still ? dock() : roam();

    // Takeoff progress: the robot leaves its hero spot as the hero scrolls away.
    const p = clamp((innerHeight * 0.45 - rect.top) / (innerHeight * 0.55), 0, 1);
    const e = ease(p);

    const delta = scrollY - lastScroll;
    lastScroll = scrollY;
    velocity = lerp(velocity, delta, 0.2);

    const prevX = cur.x;
    const prevY = cur.y;
    const target = {
      x: lerp(rect.left, goal.x, e),
      y: lerp(rect.top, goal.y, e),
      w: lerp(rect.width, goal.w, e),
      eye: still ? 0 : clamp(velocity * 0.25, -4, 4),
    };

    // Low follow rate gives the flight a weighty, cinematic glide.
    const k = still || !started ? 1 : 0.075;
    for (const key in target) cur[key] = lerp(cur[key], target[key], key === "w" ? 0.12 : k);
    started = true;

    const dx = cur.x - prevX;
    const dy = cur.y - prevY;
    const speed = Math.hypot(dx, dy);
    // Bank into horizontal motion, pitch slightly with vertical motion.
    cur.r = still ? 0 : lerp(cur.r, clamp(dx * 1.5 + dy * 0.3, -24, 24), 0.15);
    if (!still && Math.abs(dx) > 1.2) facing = dx < 0 ? -1 : 1;

    bot.style.width = `${cur.w.toFixed(2)}px`;
    bot.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0) rotate(${cur.r.toFixed(2)}deg)`;
    bot.style.setProperty("--thrust", still ? 0 : clamp(speed / 7, 0, 1).toFixed(3));
    bot.classList.toggle("is-facing-left", facing < 0);
    bot.classList.toggle("is-left-half", cur.x + cur.w / 2 < innerWidth / 2);
    if (eyes) eyes.style.transform = `translateY(${cur.eye.toFixed(2)}px)`;

    const isDocked = p > 0.97;
    if (isDocked !== docked) {
      docked = isDocked;
      bot.classList.toggle("is-roaming", docked);
      if (!docked && bubbleText) bubbleText.textContent = "build passing";
    }
    bot.classList.toggle("is-flying", p > 0.02 && p < 0.97);
    requestAnimationFrame(frame);
  };

  let talkTimer = 0;
  let waveTimer = 0;
  const say = (line, wave = true) => {
    if (bubbleText) bubbleText.textContent = line;
    bot.classList.add("is-talking");
    clearTimeout(talkTimer);
    talkTimer = setTimeout(() => bot.classList.remove("is-talking"), 2600);
    if (wave && !reduce.matches) {
      bot.classList.remove("is-waving");
      void bot.offsetWidth;
      bot.classList.add("is-waving");
      clearTimeout(waveTimer);
      waveTimer = setTimeout(() => bot.classList.remove("is-waving"), 1300);
    }
  };

  let current = "";
  const nextSection = () => sections.find((s) => s.getBoundingClientRect().top > 90);
  const updateLabel = () => {
    const next = nextSection();
    bot.setAttribute("aria-label", next ? `Robot guide: go to ${SECTION_NAMES[next.id]}` : "Robot guide: back to top");
  };

  const observer = new IntersectionObserver((entries) => {
    const hit = entries.find((entry) => entry.isIntersecting);
    if (!hit || hit.target.id === current) return;
    current = hit.target.id;
    updateLabel();
    if (docked) say(SECTION_LINES[current]);
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => observer.observe(s));

  bot.addEventListener("click", () => {
    const next = nextSection();
    const behavior = reduce.matches ? "auto" : "smooth";
    if (next) next.scrollIntoView({ behavior, block: "start" });
    else scrollTo({ top: 0, behavior });
  });
  const preview = () => {
    if (!docked) return;
    const next = nextSection();
    say(next ? `next → ${SECTION_NAMES[next.id].toLowerCase()}` : "back to top", false);
  };
  bot.addEventListener("pointerenter", preview);
  bot.addEventListener("focus", preview);

  updateLabel();
  requestAnimationFrame(() => {
    frame();
    bot.classList.add("is-ready");
  });
})();
