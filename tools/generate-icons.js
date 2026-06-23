const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const icons = [
  { src: path.join(__dirname,'..','icons','icon-192.svg'), out: path.join(__dirname,'..','icons','icon-192.png'), size: 192 },
  { src: path.join(__dirname,'..','icons','icon-512.svg'), out: path.join(__dirname,'..','icons','icon-512.png'), size: 512 }
];

async function build() {
  for (const icon of icons) {
    if (!fs.existsSync(icon.src)) {
      console.warn(`Skipping missing icon source: ${icon.src}`);
      continue;
    }
    console.log(`Rendering ${path.basename(icon.src)} -> ${path.basename(icon.out)} (${icon.size}x${icon.size})`);
    try {
      await sharp(icon.src)
        .resize(icon.size, icon.size, { fit: 'contain' })
        .png({ quality: 90 })
        .toFile(icon.out);
      console.log(`Wrote ${icon.out}`);
    } catch (err) {
      console.error(`Failed to render ${icon.src}:`, err.message || err);
    }
  }
}

build().catch(err => { console.error(err); process.exit(1); });
