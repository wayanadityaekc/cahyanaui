#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'out');
const PORT = Number(process.env.PORT || 4000);

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

if (!fs.existsSync(ROOT)) {
  console.error('No out/ directory. Run `npm run build` first.');
  process.exit(1);
}

http
  .createServer((req, response) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    let file = path.join(ROOT, p);

    if (!fs.existsSync(file) && !path.extname(file)) file = path.join(ROOT, `${p}.html`);
    if (!path.resolve(file).startsWith(path.resolve(ROOT))) {
      response.writeHead(403);
      return response.end('Forbidden');
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const nf = path.join(ROOT, '404.html');
      response.writeHead(404, { 'content-type': 'text/html' });
      return response.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'Not found');
    }
    response.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    response.end(fs.readFileSync(file));
  })
  .listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}`));
