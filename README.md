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
Its cinematic hero uses a real engineering-workspace photo, CSS depth, and
Motion-powered hover and scroll reveals. Headings type in as they enter view.
The motion toggle and `prefers-reduced-motion` setting keep animations optional.
Motion is loaded from a CDN; there is no build step or npm dependency.

`scripts/audit.cjs` runs a local browser audit for desktop, mobile, and reduced
motion. It requires `playwright-core` and an installed Chromium executable
(adjust the executable path for your machine). Screenshots and the audit report
are written to the ignored `output/playwright/` directory. The audit checks
navigation, project content, images, section reveals, and layout overflow.

Vercel serves the static page and assets from `public/`.
