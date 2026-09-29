/**
 * One review posted for several trips is saved once per trip, so each trip's
 * own page can show its copy. A list that mixes trips (a homepage, an
 * all-reviews page) merges those copies into one entry whose `service` reads
 * "Ubud Tour + 2 more"; `services` keeps the full list for the detail view.
 *
 * Copies are matched on everything the guest wrote: name, country, stars,
 * text, source. A second, different review by the same guest stays separate.
 */
function reviewKey(r) {
  return [r.name, r.country, r.rating, r.message, r.source].map((v) => String(v ?? '').trim()).join('\u0001');
}

// List order is kept (newest first); trips inside one review are in the order the guest submitted them.
export default function groupReviews(rows = []) {
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
