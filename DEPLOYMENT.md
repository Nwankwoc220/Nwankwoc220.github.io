# Deployment Checklist

This checklist prepares the `lasu-navigator` static PWA for production deployment.

1. Icons
   - Generate production PNG icons (recommended):
     - Node (sharp): `npm ci && npm run build-icons` (may require build tools on Windows)
     - ImageMagick: `magick convert icons/icon-192.svg -resize 192x192 icons/icon-192.png`
     - librsvg (WSL/Linux): `rsvg-convert -w 192 -h 192 icons/icon-192.svg -o icons/icon-192.png`
   - Verify `icons/icon-192.png` and `icons/icon-512.png` are present and committed.

2. Manifest & Service Worker
   - Confirm `manifest.json` includes PNG icons and correct `start_url`.
   - If filenames change, update `sw.js` `ASSETS` list and bump `CACHE` name.

3. Local testing
   - Serve site locally and verify PWA behavior:
     ```powershell
     cd 'C:\Users\HomePC\Downloads\attachments'
     python -m http.server 8000
     # open http://localhost:8000 in Chrome/Edge
     ```
   - In DevTools → Application: check manifest, icons, and service worker registration.

4. Hosting options
   - GitHub Pages: push to `main` and enable Pages; included workflow will publish to `gh-pages`.
   - Netlify: connect repo, set publish directory to repository root.
   - Vercel: connect repo; `vercel.json` is present for static routing.

5. CI / PR
   - If using GitHub Actions, ensure any secrets or branch protections allow the deploy workflow to run.
   - Open a PR for these changes and run CI to confirm icon conversion (if workflow handles it).

6. Final steps
   - After publishing, open the site and test offline install and caching behavior.
   - If changes are not reflected for users, bump `CACHE` in `sw.js` to force update.
