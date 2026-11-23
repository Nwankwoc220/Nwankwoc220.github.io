#!/usr/bin/env bash
set -e

# Helper: build icons, then print deployment hints
# This script does not publish automatically. It prepares local PNG icons and reminds you how to deploy.

echo "Building icons..."
./build-icons.sh

echo "\nDone. To publish via GitHub Pages using the included workflow:"
echo "1. Commit the generated icons (if you want them tracked):"
echo "   git add icons/icon-192.png icons/icon-512.png"
echo "   git commit -m \"chore: add generated PNG icons\""

echo "2. Push to GitHub (main branch). The CI workflow will convert icons in the runner and deploy to gh-pages."
echo "   git push origin main"

echo "Alternatively, deploy to Netlify/Vercel by connecting this repo and setting root as deploy directory."
