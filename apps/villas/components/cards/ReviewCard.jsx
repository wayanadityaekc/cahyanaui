// Renders one of the two real review-content shapes from lib/reviews.js.
// No reviewer name or photo is shown because none exist in the real source
// data — see lib/reviews.js for why (guardrail against fabricating guests).
function Stars({ count }) {
  return (
    <p className="stars-amber text-small mb-3" aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}
    </p>
  );
}

export default function ReviewCard({ card }) {
  if (card.type === 'themes') {
    return (
      <div className="card p-6">
        <p className="caps text-muted mb-3">{card.heading}</p>
        <ul className="flex flex-col gap-2">
          {card.themes.map(([label, count]) => (
            <li key={label} className="flex items-center justify-between text-small py-1.5 border-b border-line last:border-b-0">
              <span className="text-gold">{label}</span>
              <span className="font-semibold text-amber">{count}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-label text-muted">{card.source}</p>
      </div>
    );
  }

  return (
    <div className="card p-6 flex flex-col">
      <Stars count={card.stars} />
      <p className="text-h3 leading-relaxed flex-1 text-gold">&ldquo;{card.text}&rdquo;</p>
      <p className="mt-4 text-label text-muted">{card.source}</p>
    </div>
  );
}
