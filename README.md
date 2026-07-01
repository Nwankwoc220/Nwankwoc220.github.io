
# LASU Navigator — Local build & deploy

This folder is a static web app (single-page) prepared as a Progressive Web App (PWA).

Quick contents
- `index.html` — app entry (single canonical file)
- `lasu-navigator-1.css` — styles
- `lasu-navigator-1.js` — app logic and SW registration
- `qrcode.min.js` — vendored QR library
- `sw.js` — static service worker
- `manifest.json` — PWA manifest (now references `/icons/*.png`)
- `icons/` — SVG placeholders and CI-generated PNGs

Local testing

1. Start a local HTTP server (PowerShell):

```powershell
cd 'C:\Users\HomePC\Downloads\attachments'
python -m http.server 8000
```

2. Open `http://localhost:8000` in Chrome or Edge.

3. In DevTools → Application:
	- Confirm `manifest.json` is detected and lists the icons.
	- Under Service Workers, confirm `/sw.js` registers and caches the listed assets.

Generating PNG icons (two options)

- Option A — Local (ImageMagick):

```powershell
cd 'C:\Users\HomePC\Downloads\attachments'
magick convert icons/icon-192.svg -resize 192x192 icons/icon-192.png
magick convert icons/icon-512.svg -resize 512x512 icons/icon-512.png
```

- Option B — Local (librsvg):

```powershell
cd 'C:\Users\HomePC\Downloads\attachments'
# On Windows you can use WSL or install librsvg; inside WSL/Ubuntu:
rsvg-convert -w 192 -h 192 icons/icon-192.svg -o icons/icon-192.png
rsvg-convert -w 512 -h 512 icons/icon-512.svg -o icons/icon-512.png
```

Node-based fallback (sharp)

If you prefer to generate PNGs with Node (cross-platform), run:

```powershell
cd 'C:\Users\HomePC\Downloads\attachments'
npm ci
npm run build-icons
```

This uses `sharp` to render `icons/icon-192.svg` and `icons/icon-512.svg` into PNGs.

CI conversion

The included GitHub Actions workflow will install `librsvg` on the runner and convert the SVG icons to PNG before publishing the site to the `gh-pages` branch.

Deploy (GitHub Pages)

1. Push this repository to GitHub (default branch `main`).
2. The workflow `.github/workflows/deploy-gh-pages.yml` runs on pushes to `main` and publishes the repo root to the `gh-pages` branch.
3. Enable Pages to serve from the `gh-pages` branch (Settings → Pages).

Notes
- The service worker caches the core assets listed in `sw.js`. If you add or rename files, update `sw.js` and bump the cache name (e.g. `lasu-nav-v2`) to force clients to pick up changes.
- If you want me to produce final PNGs here as base64 files inside the repo (not ideal), say so — otherwise the CI/local conversion creates correct PNG binaries.

If you'd like, I can also add a small `deploy.sh` script or configure Netlify/Vercel deployment steps.

Note: `lasu-navigator-1.html` was removed to keep a single canonical entry file; a backup `lasu-navigator-1.html.bak` exists in the repo.
 
CI & Additional deploy targets

- A Lighthouse workflow was added at `.github/workflows/lighthouse.yml`. On pushes to `main` it will:
	- install `http-server` and `lighthouse`, build PNG icons (if SVGs exist), serve the site locally on the runner, run Lighthouse, and upload the HTML report as a workflow artifact.

- Netlify: a minimal `netlify.toml` was added to publish the repository root and route all requests to `index.html` for the SPA.

- Vercel: a minimal `vercel.json` was added to serve the site as static files with SPA routing.

PNG placeholders

- I created placeholder PNG files at `icons/icon-192.png` and `icons/icon-512.png` using a tiny base64 placeholder. These are present so `manifest.json` points to files you can commit. For production, run the build scripts to create full-resolution PNGs or replace them with designed icons.

Firebase security rules

- Basic rules for Firestore and Storage are included in `firebase/firestore.rules` and `firebase/storage.rules`.
- `users/{uid}` documents are readable/writable only by the authenticated `uid`.
- `students/{matric}` is read-only (write disabled) — use a trusted backend for admin writes.
- Storage rules allow users to write only to `profiles/{uid}/...`. Profile images are public-read by default; change `allow read` to `if request.auth != null && request.auth.uid == userId` to restrict reads.

To deploy rules with Firebase CLI:

```bash
# install the firebase cli if not present
npm install -g firebase-tools
# login
firebase login
# deploy rules
npm run firebase:deploy
```

How to decode the placeholders locally (PowerShell):

```powershell
cd 'C:\Users\HomePC\Downloads\attachments\icons'
[System.Convert]::FromBase64String((Get-Content icon-192.png -Raw)) | Set-Content -Encoding Byte icon-192-decoded.png
[System.Convert]::FromBase64String((Get-Content icon-512.png -Raw)) | Set-Content -Encoding Byte icon-512-decoded.png
```

Or using Bash:

```bash
cd ~/Downloads/attachments/icons
base64 -d icon-192.png > icon-192-decoded.png
base64 -d icon-512.png > icon-512-decoded.png
```

