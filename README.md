# Mark Lloyd Cuizon Portfolio

A static portfolio built with HTML, CSS, and JavaScript. The complete page is
in `public/index.html`; no build step or package installation is required.

## Run locally

Serve `public/` over HTTP so the browser can load the page and its assets:

```powershell
python -m http.server 8000 --directory public
```

Open [http://localhost:8000](http://localhost:8000).

The portfolio is a static HTML site with locally stored project and hero images.
A fixed Three.js background (`public/cinematic-scene.js`) renders a procedural
CPU on a motherboard; scrolling flies the camera across the board and lifts the
chip layers into an exploded view. If WebGL or the CDN fails, a static grid-and-glow
background stays in place. Headings, eyebrows and the hero terminal type in with a
caret, and `public/cinematic.js` adds magnetic buttons, project filters, card tilt,
count-up stats and a timeline progress rail.
The hero uses the live 3D chip as its visual. The `prefers-reduced-motion` setting
keeps animations optional.
Motion is loaded from a CDN; there is no build step or npm dependency.

`scripts/audit.cjs` runs a local browser audit for desktop, mobile, and reduced
motion. It requires `playwright-core` and an installed Chromium executable
(adjust the executable path for your machine). Screenshots and the audit report
are written to the ignored `output/playwright/` directory. The audit checks
navigation, project content, images, section reveals, and layout overflow.

Vercel serves the static page and assets from `public/`.
