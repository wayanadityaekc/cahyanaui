#!/usr/bin/env node
// Serve the built site locally, exactly as Hostinger does.
//
// Why this exists and `npm run dev` does not do the job: every internal link on
// this site ends in `.html` (`/ubud-tour.html`), because that is what the static
// export writes and what the canonical URLs, the sitemap and the redirects all
// use. `next dev` does not serve those - it serves `/ubud-tour` and answers 404
// (or 500) for the `.html` form. So in dev, clicking any card lands on an error
// page. Nothing is wrong with the site; dev is just not serving the artifact we
// actually ship.
//
//   npm run build && node tools/serve-out.js     ->  http://localhost:4000
//
// Use this for anything that involves clicking through the site, and for testing
// checkout end to end.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "out");
const PORT = Number(process.env.PORT || 4000);

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
  ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".woff": "font/woff",
};

if (!fs.existsSync(ROOT)) {
  console.error("No out/ directory. Run `npm run build` first.");
  process.exit(1);
}

http
  .createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    let file = path.join(ROOT, p);

    // Serve both /x.html (how the site links) and /x (convenience).
    if (!fs.existsSync(file) && !path.extname(file)) file = path.join(ROOT, p + ".html");
    // Never serve outside out/, whatever the URL says.
    if (!path.resolve(file).startsWith(path.resolve(ROOT))) {
      res.writeHead(403); return res.end("Forbidden");
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const nf = path.join(ROOT, "404.html");
      res.writeHead(404, { "content-type": "text/html" });
      return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : "Not found");
    }
    res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(fs.readFileSync(file));
  })
  .listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}`));
