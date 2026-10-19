function buildReviewKey(review) {
  return [review.name, review.country, review.rating, review.message, review.source]
    .map((field) => String(field ?? '').trim())
    .join('\u0001');
}

export default function groupReviews(rows = []) {
  const groups = new Map();
  rows.forEach((row) => {
    const key = buildReviewKey(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  });
  return [...groups.values()].map((copies) => {
    const services = [...copies]
      .sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')))
      .map((review) => review.service)
      .filter((service, index, all) => service && all.indexOf(service) === index);
    const label =
      services.length > 1 ? `${services[0]} + ${services.length - 1} more` : services[0] || copies[0].service;
    return { ...copies[0], service: label, services };
  });
}
