function FILE(imagePath) {
  return String(imagePath || '')
    .replace(/^\/?assets\/images\//, '')
    .replace(/^images\//, '')
    .trim();
}

export function buildGallery(data) {
  if (!data) return [];
  if (Array.isArray(data.gallery) && data.gallery.length) return data.gallery;

  const sections = [
    ...(Array.isArray(data.items) ? data.items.filter((item) => item && item.type === 'stop') : []),
    ...(Array.isArray(data.stops) ? data.stops : []),
  ];

  const meta = new Map();
  sections.forEach((section) => {
    const fileName = FILE(section.img);
    if (fileName && !meta.has(fileName))
      meta.set(fileName, { alt: section.alt, title: section.name, w: section.w, hgt: section.hgt });
  });
  (data.heroSlides || []).forEach((slide) => {
    const fileName = FILE(slide.src || slide.img || slide);
    if (!fileName) return;
    const existing = meta.get(fileName) || {};
    meta.set(fileName, { ...existing, title: existing.title || slide.title, alt: existing.alt || slide.title });
  });

  const orderedFiles = [
    FILE(data.heroBg),
    ...(data.heroSlides || []).map((slide) => FILE(slide.src || slide.img || slide)),
    ...sections.map((section) => FILE(section.img)),
  ];

  const seen = new Set();
  const galleryFiles = [];
  orderedFiles.forEach((fileName) => {
    if (!fileName || seen.has(fileName)) return;
    seen.add(fileName);
    const fileMeta = meta.get(fileName) || {};
    galleryFiles.push({
      src: `/assets/images/${fileName}`,
      alt: fileMeta.alt || fileMeta.title || '',
      title: fileMeta.title || '',
      w: fileMeta.w,
      hgt: fileMeta.hgt,
    });
  });
  return galleryFiles;
}
