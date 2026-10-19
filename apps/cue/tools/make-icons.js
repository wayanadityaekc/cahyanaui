#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('sharp not installed - run: npm i -D sharp');
  process.exit(2);
}

const SRC = process.argv[2];
if (!SRC || !fs.existsSync(SRC)) {
  console.error('usage: node tools/make-icons.js <logo.png>');
  process.exit(2);
}
const OUT = path.join(__dirname, '..', 'public', 'assets', 'icons') + path.sep;

async function inkBox() {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: imageWidth, height: imageHeight, channels: channelCount } = info;
  let minX = imageWidth,
    minY = imageHeight,
    maxX = -1,
    maxY = -1;
  [...Array(imageHeight).keys()].forEach((rowIndex) =>
    [...Array(imageWidth).keys()].forEach((columnIndex) => {
      const pixelOffset = (rowIndex * imageWidth + columnIndex) * channelCount;
      const [red, green, blue, alpha] = [
        data[pixelOffset],
        data[pixelOffset + 1],
        data[pixelOffset + 2],
        data[pixelOffset + 3],
      ];
      if (alpha > 10 && !(red > 245 && green > 245 && blue > 245)) {
        if (columnIndex < minX) minX = columnIndex;
        if (columnIndex > maxX) maxX = columnIndex;
        if (rowIndex < minY) minY = rowIndex;
        if (rowIndex > maxY) maxY = rowIndex;
      }
    }),
  );
  if (maxX < 0) throw new Error('the source looks empty');
  const side = Math.max(maxX - minX + 1, maxY - minY + 1);
  const cx = (minX + maxX + 1) / 2,
    cy = (minY + maxY + 1) / 2;
  const left = Math.max(0, Math.min(imageWidth - side, Math.round(cx - side / 2)));
  const top = Math.max(0, Math.min(imageHeight - side, Math.round(cy - side / 2)));
  return { left, top, width: side, height: side };
}

(async () => {
  const box = await inkBox();
  console.log('cropped to', box);
  function disc() {
    return sharp(SRC).extract(box);
  }
  const PNG = { palette: true, colours: 128, compressionLevel: 9, effort: 10 };

  function onClear(size) {
    return disc().resize(size, size, { fit: 'cover' }).png(PNG);
  }

  const GOLD = '#b4975f';
  async function onGold(size) {
    const scaledSize = Math.round(size * 1.45);
    const zoomed = await disc().resize(scaledSize, scaledSize).png().toBuffer();
    const off = Math.round((scaledSize - size) / 2);
    return sharp(zoomed)
      .extract({ left: off, top: off, width: size, height: size })
      .flatten({ background: GOLD })
      .png(PNG);
  }

  for (const [name, size] of [
    ['favicon-16x16.png', 16],
    ['favicon-32x32.png', 32],
  ]) {
    await onClear(size).toFile(OUT + name);
  }
  for (const [name, size] of [
    ['apple-touch-icon.png', 180],
    ['icon-192.png', 192],
    ['icon-512.png', 512],
  ]) {
    await (await onGold(size)).toFile(OUT + name);
  }

  const frames = [];
  for (const size of [16, 32, 48]) frames.push({ size, buf: await onClear(size).toBuffer() });
  const head = Buffer.alloc(6);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(frames.length, 4);
  let offset = 6 + frames.length * 16;
  const dir = [],
    body = [];
  frames.forEach(({ size, buf }) => {
    const entryBuffer = Buffer.alloc(16);
    entryBuffer[0] = size;
    entryBuffer[1] = size;
    entryBuffer.writeUInt16LE(1, 4);
    entryBuffer.writeUInt16LE(32, 6);
    entryBuffer.writeUInt32LE(buf.length, 8);
    entryBuffer.writeUInt32LE(offset, 12);
    dir.push(entryBuffer);
    body.push(buf);
    offset += buf.length;
  });
  fs.writeFileSync(`${OUT}favicon.ico`, Buffer.concat([head, ...dir, ...body]));

  const png = await disc().resize(128, 128).png(PNG).toBuffer();
  fs.writeFileSync(
    `${OUT}favicon.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <image width="100" height="100" href="data:image/png;base64,${png.toString('base64')}"/>
</svg>
`,
  );
  [
    'favicon.svg',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'icon-192.png',
    'icon-512.png',
  ].forEach((iconFile) => {
    console.log(' ', iconFile, fs.statSync(OUT + iconFile).size, 'bytes');
  });
})();
