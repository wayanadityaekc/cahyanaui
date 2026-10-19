function reviewKey(r) {
  return [r.name, r.country, r.rating, r.message, r.source].map((v) => String(v ?? '').trim()).join('\u0001');
}

export function groupReviews(rows = []) {
  const groups = new Map();
  rows.forEach((row) => {
    const key = reviewKey(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  });
  return [...groups.values()].map((copies) => {
    const services = [...copies]
      .sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')))
      .map((r) => r.service)
      .filter((s, i, all) => s && all.indexOf(s) === i);
    const label =
      services.length > 1 ? `${services[0]} + ${services.length - 1} more` : services[0] || copies[0].service;
    return { ...copies[0], service: label, services };
  });
}
