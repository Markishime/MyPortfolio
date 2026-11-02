# Mark Lloyd Cuizon Portfolio

A static portfolio built with HTML, CSS, and JavaScript. The complete page is
in `index.html`; no build step or package installation is required.

## Run locally

Serve the repository root over HTTP so the browser can load the JavaScript
modules:

```powershell
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

The cinematic processor and circuit-board environment is built with Three.js.
GSAP ScrollTrigger choreographs its movement as the page scrolls, and Lenis
provides smooth scrolling. These libraries load from CDNs, so the background
needs an internet connection and WebGL. The rest of the portfolio remains
usable if WebGL is unavailable. Portfolio images are stored in `public/`.

Vercel serves the static page directly from the repository root.
