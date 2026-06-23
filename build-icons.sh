#!/usr/bin/env bash
set -e

# Build PNG icons from SVG placeholders using rsvg-convert or ImageMagick
# Usage: ./build-icons.sh

mkdir -p icons

if command -v rsvg-convert >/dev/null 2>&1; then
  echo "Using rsvg-convert to render PNGs..."
  rsvg-convert -w 192 -h 192 icons/icon-192.svg -o icons/icon-192.png || true
  rsvg-convert -w 512 -h 512 icons/icon-512.svg -o icons/icon-512.png || true
elif command -v magick >/dev/null 2>&1; then
  echo "Using ImageMagick (magick) to render PNGs..."
  magick convert icons/icon-192.svg -resize 192x192 icons/icon-192.png || true
  magick convert icons/icon-512.svg -resize 512x512 icons/icon-512.png || true
else
  echo "No renderer found (rsvg-convert or magick). Please install librsvg or ImageMagick."
  exit 1
fi

echo "Icons built: icons/icon-192.png, icons/icon-512.png"
