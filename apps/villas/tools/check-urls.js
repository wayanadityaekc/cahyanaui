#!/usr/bin/env node
// GATE (villa version of CUE's check-urls): links, sitemap, canonicals and robots.txt all agree with what the build wrote.
// Every internal link lands on a built page, out/sitemap.xml lists exactly lib/routes.js indexablePaths(), every sitemap URL was built, every indexable page's canonical is its own sitemap URL, and robots.txt points at the sitemap.
const fs = require('fs');
const path = require('path');
const { importApp } = require('./app-import');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'out');
if (!fs.existsSync(OUT)) { console.error('out/ missing - run the build first'); process.exit(2); }

function builtPages() {
  function walk(dir, base) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      if (entry.name === '_next') return [];
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full, `${base}${entry.name}/`);
      if (entry.name === 'index.html') return [{ url: base, file: full }];
      return entry.name.endsWith('.html') ? [{ url: `${base}${entry.name}`, file: full }] : [];
    });
  }
  return walk(OUT, '/');
}

function isNoindex(html) {
  return /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html);
}

function decode(value) {
  return value.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
}

async function main() {
  try {
    await run();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function run() {
  const routes = await importApp('lib/routes.js');
  const SITE = routes.SITE;
  const indexable = routes.indexablePaths();
  const problems = [];

  const pages = builtPages();
  const builtUrls = new Set(pages.map((page) => page.url));

  // 1. Internal links: every <a href> on our own site must land on a built page (the #hash part is not checked).
  let linksChecked = 0;
  pages.forEach(({ url: pageUrl, file }) => {
    const html = fs.readFileSync(file, 'utf8');
    [...html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)].forEach((match) => {
      const href = decode(match[1]);
      if (/^(mailto:|tel:|javascript:|data:)/.test(href) || href.startsWith('#') || href === '') return;
      const target = new URL(href, `${SITE}${pageUrl}`);
      if (target.origin !== SITE) return;
      linksChecked++;
      const pathname = decodeURIComponent(target.pathname);
      if (builtUrls.has(pathname)) return;
      if (/\.[a-z0-9]+$/i.test(pathname) && fs.existsSync(path.join(OUT, pathname))) return;
      const hint = builtUrls.has(`${pathname}/`) ? ` (built as ${pathname}/ - add the trailing slash, or the host answers with a redirect)` : '';
      problems.push(`BROKEN LINK   ${pageUrl} -> ${href}${hint}`);
    });
  });

  // 2. Sitemap = indexablePaths(), in both directions, and every entry was built.
  const sitemapFile = path.join(OUT, 'sitemap.xml');
  const sitemapLocs = fs.existsSync(sitemapFile)
    ? [...fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim())
    : [];
  if (!sitemapLocs.length) problems.push('SITEMAP       out/sitemap.xml is missing or lists no URLs');
  const expected = new Set(indexable.map((indexPath) => `${SITE}${indexPath}`));
  const listed = new Set(sitemapLocs);
  [...expected].filter((loc) => !listed.has(loc)).forEach((loc) => { problems.push(`SITEMAP       indexablePaths() has ${loc} but out/sitemap.xml does not`); });
  sitemapLocs.filter((loc) => !expected.has(loc)).forEach((loc) => { problems.push(`SITEMAP       out/sitemap.xml lists ${loc} but indexablePaths() does not`); });
  sitemapLocs.forEach((loc) => {
    if (!loc.startsWith(SITE)) { problems.push(`SITEMAP       ${loc} is not on ${SITE}`); return; }
    if (!builtUrls.has(loc.slice(SITE.length))) problems.push(`SITEMAP       ${loc} was not built`);
  });

  // 3. Every built page without noindex is in the sitemap, and its canonical is its own sitemap URL.
  let indexablePages = 0;
  pages.forEach(({ url: pageUrl, file }) => {
    if (/^\/(404|_not-found)(\/|\.html)/.test(pageUrl)) return;
    const html = fs.readFileSync(file, 'utf8');
    if (isNoindex(html)) return;
    indexablePages++;
    const own = `${SITE}${pageUrl}`;
    if (!listed.has(own)) problems.push(`SITEMAP       indexable page ${pageUrl} is missing from the sitemap (add it to lib/routes.js, or mark it noindex)`);
    const canonical = (html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/) || [])[1];
    if (!canonical) problems.push(`CANONICAL     ${pageUrl} has no canonical link`);
    else if (decode(canonical) !== own) problems.push(`CANONICAL     ${pageUrl} points at ${canonical}, expected ${own}`);
  });

  // 4. robots.txt names the sitemap and does not shut the whole site.
  const robotsFile = path.join(OUT, 'robots.txt');
  const robots = fs.existsSync(robotsFile) ? fs.readFileSync(robotsFile, 'utf8') : '';
  if (!robots) problems.push('ROBOTS        out/robots.txt is missing');
  else {
    if (!robots.split('\n').some((line) => line.trim() === `Sitemap: ${SITE}/sitemap.xml`)) problems.push(`ROBOTS        robots.txt does not say "Sitemap: ${SITE}/sitemap.xml"`);
    if (/^\s*Disallow:\s*\/\s*$/m.test(robots)) problems.push('ROBOTS        robots.txt disallows the whole site');
  }

  console.log(`Pages built          : ${pages.length}`);
  console.log(`Internal links       : ${linksChecked}`);
  console.log(`Sitemap URLs         : ${sitemapLocs.length} (indexablePaths: ${indexable.length})`);
  console.log(`Indexable pages      : ${indexablePages}`);

  if (!pages.length || !linksChecked || !indexablePages) problems.push('BLIND         found no pages, links or indexable pages - the gate proved nothing');

  if (problems.length) {
    console.error(`\nURL CHECK FAILED - ${problems.length} problem(s):`);
    problems.forEach((problem) => { console.error(`  ${problem}`); });
    process.exit(1);
  }
  console.log('\nURL check passed - links, sitemap, canonicals and robots.txt agree with the build.');
}

main();
