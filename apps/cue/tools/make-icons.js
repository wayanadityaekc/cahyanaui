#!/usr/bin/env node
// Rebuild the favicon set from one source logo:
//   node tools/make-icons.js path/to/logo.png
//
// Not a CI gate - run it by hand when the logo changes, then commit what it
// writes into public/assets/icons/. The <link> tags in app/layout.jsx already
// point at these filenames and carry a content hash, so nothing else to touch.
//
// sharp comes in transitively with Next (it is not in package.json). If a future
// install drops it, `npm i -D sharp` and run this again.
const fs = require('fs');
const path = require('path');
let sharp;
try { sharp = require('sharp'); }
catch { console.error('sharp not installed - run: npm i -D sharp'); process.exit(2); }

const SRC = process.argv[2];
if (!SRC || !fs.existsSync(SRC)) { console.error('usage: node tools/make-icons.js <logo.png>'); process.exit(2); }
const OUT = path.join(__dirname, '..', 'public', 'assets', 'icons') + path.sep;

// The mark usually arrives centred on a big transparent canvas, and not always
// dead centre - crop to the ink itself so the disc fills the icon edge to edge
// instead of floating in padding at 16px.
async function inkBox() {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C;
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a > 10 && !(r > 245 && g > 245 && b > 245)) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) throw new Error('the source looks empty');
  // square it off around the ink's centre, clamped to the canvas
  const side = Math.max(maxX - minX + 1, maxY - minY + 1);
  const cx = (minX + maxX + 1) / 2, cy = (minY + maxY + 1) / 2;
  const left = Math.max(0, Math.min(W - side, Math.round(cx - side / 2)));
  const top = Math.max(0, Math.min(H - side, Math.round(cy - side / 2)));
  return { left, top, width: side, height: side };
}

(async () => {
  const box = await inkBox();
  console.log('cropped to', box);
  const disc = () => sharp(SRC).extract(box);
  // A two-colour mark: a palette PNG is visually identical and a fraction of the
  // size (raw RGBA came out 4x bigger at 512).
  const PNG = { palette: true, colours: 128, compressionLevel: 9, effort: 10 };

  // TAB ICONS keep their TRANSPARENT corners (Sep 2026, Wayan: "kok isi kotak
  // putih"). A white square behind the disc is invisible on a light tab strip and
  // a white tile on a dark one - transparency is the only setting that reads as a
  // disc on both, and every browser here handles a transparent PNG/ICO.
  const onClear = (size) => disc().resize(size, size, { fit: 'cover' }).png(PNG);

  // HOME-SCREEN ICONS must be opaque - iOS and Android composite transparency
  // themselves, usually onto black, and they round the corners for you. So the
  // tile is filled with the logo's own gold instead: the disc melts into it and
  // the result is a solid brand tile carrying the monogram, not a white box with
  // a sticker on it. The colour is sampled from the artwork, not guessed.
  // Zoomed past the rim (1.45x, then centre-cropped) so the disc BLEEDS off the
  // tile. Just flattening onto the gold leaves a faint ring, because the artwork's
  // gold has a slight gradient and no flat fill matches it exactly. The flatten
  // stays as a backstop for sub-pixel edges.
  const GOLD = '#b4975f';
  const onGold = async (size) => {
    const z = Math.round(size * 1.45);
    const zoomed = await disc().resize(z, z).png().toBuffer();
    const off = Math.round((z - size) / 2);
    return sharp(zoomed).extract({ left: off, top: off, width: size, height: size })
      .flatten({ background: GOLD }).png(PNG);
  };

  for (const [name, size] of [['favicon-16x16.png', 16], ['favicon-32x32.png', 32]]) {
    await onClear(size).toFile(OUT + name);
  }
  for (const [name, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    await (await onGold(size)).toFile(OUT + name);
  }

  // ICO holding PNG frames - understood by every browser this site supports.
  const frames = [];
  for (const size of [16, 32, 48]) frames.push({ size, buf: await onClear(size).toBuffer() });
  const head = Buffer.alloc(6);
  head.writeUInt16LE(1, 2); head.writeUInt16LE(frames.length, 4);
  let offset = 6 + frames.length * 16;
  const dir = [], body = [];
  for (const { size, buf } of frames) {
    const e = Buffer.alloc(16);
    e[0] = size; e[1] = size;
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12);
    dir.push(e); body.push(buf); offset += buf.length;
  }
  fs.writeFileSync(OUT + 'favicon.ico', Buffer.concat([head, ...dir, ...body]));

  // The SVG is a shell around a raster, same as the file it replaces - the
  // monogram is a custom glyph and there is no honest vector of it. Transparent
  // corners on purpose here: a browser tab may be dark, and the disc should read
  // as a disc rather than as a white tile.
  const png = await disc().resize(128, 128).png(PNG).toBuffer();
  fs.writeFileSync(OUT + 'favicon.svg',
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <image width="100" height="100" href="data:image/png;base64,${png.toString('base64')}"/>
</svg>
`);
  for (const f of ['favicon.svg', 'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png',
                   'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'])
    console.log(' ', f, fs.statSync(OUT + f).size, 'bytes');
})();
