// Renders the app icon (gradient tile, white shield with check, gold sparkle) to the PNG sizes phones need.
// Usage: node make-icons.js <path to @napi-rs/canvas>
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require(process.argv[2] || "@napi-rs/canvas");

// Full-bleed square (the phone rounds the corners). The shield sits inside the central 60% so
// Android's "maskable" crop never cuts it.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3cc4b4"/><stop offset="1" stop-color="#1e5a7d"/></linearGradient></defs>
  <rect width="100" height="100" fill="url(#g)"/>
  <path d="M50 24l22 8.4v16.2c0 14.7-9.3 26-22 31.6-12.7-5.6-22-16.9-22-31.6V32.4z" fill="#ffffff" fill-opacity=".18" stroke="#ffffff" stroke-width="4.6" stroke-linejoin="round"/>
  <path d="M39.5 50.5l7.6 7.6 14-15" stroke="#ffffff" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M73 17l2 5.2 5.2 2-5.2 2-2 5.2-2-5.2-5.2-2 5.2-2z" fill="#f6c86b"/>
</svg>`;

(async () => {
  const out = path.join(__dirname, "docs");
  fs.writeFileSync(path.join(out, "icon.svg"), svg);
  for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180], ["favicon-32.png", 32]]) {
    // rasterise the SVG at the target size so edges stay sharp
    const img = await loadImage(Buffer.from(svg.replace("<svg ", `<svg width="${size}" height="${size}" `)));
    const c = createCanvas(size, size);
    c.getContext("2d").drawImage(img, 0, 0, size, size);
    fs.writeFileSync(path.join(out, name), c.toBuffer("image/png"));
    console.log("wrote", name);
  }
})();
