function FILE(s) { return String(s || '').replace(/^\/?assets\/images\//, '').replace(/^images\//, '').trim(); }

export function galleryFrom(data) {
  if (!data) return [];
  if (Array.isArray(data.gallery) && data.gallery.length) return data.gallery;

  const sections = [
    ...(Array.isArray(data.items) ? data.items.filter((i) => i && i.type === 'stop') : []),
    ...(Array.isArray(data.stops) ? data.stops : []),
  ];

  const meta = new Map();
  sections.forEach((s) => {
    const f = FILE(s.img);
    if (f && !meta.has(f)) meta.set(f, { alt: s.alt, title: s.name, w: s.w, hgt: s.hgt });
  });
  (data.heroSlides || []).forEach((s) => {
    const f = FILE(s.src || s.img || s);
    if (!f) return;
    const existing = meta.get(f) || {};
    meta.set(f, { ...existing, title: existing.title || s.title, alt: existing.alt || s.title });
  });

  const order = [
    FILE(data.heroBg),
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
