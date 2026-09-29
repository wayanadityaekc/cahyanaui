// One review posted for several trips is saved once per trip; mixed lists show it once as "Ubud Tour + 2 more".
function reviewKey(r) {
  return [r.name, r.country, r.rating, r.message, r.source].map((v) => String(v ?? '').trim()).join('\u0001');
}

// Keeps the list order (newest first); trips inside a review are listed in the order the guest submitted them.
export function groupReviews(rows = []) {
  const groups = new Map();
  rows.forEach((r) => {
    const key = reviewKey(r);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  });
  return [...groups.values()].map((copies) => {
    const services = [...copies]
      .sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')))
      .map((r) => r.service)
      .filter((s, i, all) => s && all.indexOf(s) === i);
    const label = services.length > 1 ? `${services[0]} + ${services.length - 1} more` : services[0] || copies[0].service;
    return { ...copies[0], service: label, services };
  });
}
