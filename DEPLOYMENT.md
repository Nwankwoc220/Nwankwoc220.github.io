# Deployment Checklist

This checklist prepares the `lasu-navigator` static PWA for production deployment.

1. Icons
   - Generate production PNG icons (recommended):
     - Node (sharp): `npm ci && npm run build-icons` (may require build tools on Windows)
     - ImageMagick: `magick convert icons/icon-192.svg -resize 192x192 icons/icon-192.png`
     - librsvg (WSL/Linux): `rsvg-convert -w 192 -h 192 icons/icon-192.svg -o icons/icon-192.png`
   - Required sizes:
     - `icons/icon-192.png` and `icons/icon-512.png` — minimum for a valid manifest, verify both are present and committed.
     - `icons/apple-touch-icon-180.png` (180x180) — needed for iOS "Add to Home Screen"; iOS ignores `manifest.json` icons and looks for a `<link rel="apple-touch-icon">` tag instead.
     - Optional: a maskable variant (512x512 with the logo padded inside a safe-area circle) if you want the icon to look right on Android adaptive-icon shapes instead of getting cropped.

2. Manifest & Service Worker
   - Open `manifest.json` and confirm, for each icon entry:
     - `src` points to the `.png` file (not the old `.svg`)
     - `sizes` matches the actual file dimensions (e.g. `"192x192"`)
     - `type` is `"image/png"`
   - Confirm `start_url` is correct.
   - If you added an apple-touch-icon, confirm `index.html` has:
     ```html
     <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png">
     ```
   - If filenames change, update `sw.js` `ASSETS` list and bump `CACHE` name.

3. Local testing
   - Serve site locally and verify PWA behavior:
     ```powershell
     cd 'C:\Users\HomePC\Downloads\attachments'
     python -m http.server 8000
     # open http://localhost:8000 in Chrome/Edge
     ```
   - Note: service workers only register on `https://` or `localhost` — testing via a LAN IP (e.g. `http://192.168.x.x:8000`) will silently fail to register the SW. Stick to `localhost` for local testing.
   - In DevTools → Application: check manifest, icons, and service worker registration.

4. Hosting options
   - All options below serve over HTTPS by default, which service workers require in production — no extra config needed.
   - GitHub Pages: push to `main` and enable Pages; included workflow will publish to `gh-pages`.
   - Netlify: connect repo, set publish directory to repository root.
   - Vercel: connect repo; `vercel.json` is present for static routing.

5. CI / PR
   - Confirm any secrets or branch protections allow the deploy workflow to run.
   - Open a PR for these changes and run CI to confirm icon conversion (if workflow handles it).
   - Verify CI actually ran the icon build step and the output PNGs match what's committed (avoids a stale-icon mismatch between CI and local).

6. Final steps
   - After publishing, open the site and test offline install and caching behavior.
   - On an actual phone (not just desktop DevTools), test "Add to Home Screen" end-to-end — this is where icon, manifest, and SW issues most often surface in practice.
   - If changes are not reflected for users, bump `CACHE` in `sw.js` to force update.
