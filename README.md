# Mark Lloyd Cuizon Portfolio

A static portfolio built with HTML, CSS, and JavaScript. The complete page is
in `public/index.html`; no build step or package installation is required.

## Run locally

Serve `public/` over HTTP so the browser can load the page and its assets:

```powershell
python -m http.server 8000 --directory public
```

Open [http://localhost:8000](http://localhost:8000).

The cinematic processor and circuit-board environment is built with Three.js.
Traveling signal pulses, orbital hardware, and depth particles add motion and
space around the board. GSAP ScrollTrigger choreographs its movement as the
page scrolls, and Lenis provides smooth scrolling. Motion respects reduced
motion preferences. These libraries load from CDNs, so the background needs an
internet connection and WebGL. The rest of the portfolio remains usable if
WebGL is unavailable. Portfolio images are stored in `public/`.

Vercel serves the static page and assets from `public/`.
