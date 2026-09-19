// Derive a detail page's hero gallery from the photos that page ALREADY carries
// (Wayan, Sep 2026, on the rollout: "lu gak usah pilih pakai yang udah ada di tour
// itu aja, nanti gua yang milih ... udah ada minimal 3 foto jadi lu bisa langsung
// pakai itu").
//
// Nothing is invented and nothing is chosen here: the pool is the page's own hero
// photo, its hero-carousel slides and its stop photos, deduplicated by filename.
// That dedup matters - the hero carousel on every tour reuses the stop photos
// file-for-file, so a naive concat would show each photo twice.
//
// An explicit `gallery` on a page WINS. That is the hand-picked path: when Wayan
// picks photos for a page, they go in the content file and this helper steps aside.
// ubud-tour already has one (it was the pilot), which is why it reads differently
// from the rest.
//
// Captions and alt text come from wherever the page already stated them - a stop's
// `alt`/`name`, or a slide's `title`. Never from a filename: a made-up caption is
// the same problem as a made-up photo.
const FILE = (s) => String(s || '').replace(/^\/?assets\/images\//, '').replace(/^images\//, '').trim();

export function galleryFrom(data) {
  if (!data) return [];
  if (Array.isArray(data.gallery) && data.gallery.length) return data.gallery;

  // Tours keep their sections in `items` (type: 'stop'), attraction pages in `stops`.
  const sections = [
    ...(Array.isArray(data.items) ? data.items.filter((i) => i && i.type === 'stop') : []),
    ...(Array.isArray(data.stops) ? data.stops : []),
  ];

  // What the page says about each file, so hero photos inherit the alt text and
  // dimensions the same file already has as a stop.
  const meta = new Map();
  sections.forEach((s) => {
    const f = FILE(s.img);
    if (f && !meta.has(f)) meta.set(f, { alt: s.alt, title: s.name, w: s.w, hgt: s.hgt });
  });
  (data.heroSlides || []).forEach((s) => {
    const f = FILE(s.src || s.img || s);
    if (!f) return;
    const at = meta.get(f) || {};
    meta.set(f, { ...at, title: at.title || s.title, alt: at.alt || s.title });
  });

  const order = [
    FILE(data.heroBg),                                     // the photo the page already leads with
    ...(data.heroSlides || []).map((s) => FILE(s.src || s.img || s)),
    ...sections.map((s) => FILE(s.img)),
  ];

  const seen = new Set();
  const out = [];
  order.forEach((f) => {
    if (!f || seen.has(f)) return;
    seen.add(f);
    const m = meta.get(f) || {};
    out.push({ src: `/assets/images/${f}`, alt: m.alt || m.title || '', title: m.title || '', w: m.w, hgt: m.hgt });
  });
  return out;
}
