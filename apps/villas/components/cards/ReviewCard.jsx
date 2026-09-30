import { CAPS, Card, SourceMark, STARS } from '@cahyana/ui';
// No reviewer name or photo: the real review data has none, and we do not invent guests.
function Stars({ count }) {
  return (
    <p className={`${STARS} text-small mb-3`} aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}
    </p>
  );
}

export default function ReviewCard({ card }) {
  if (card.type === 'themes') {
    return (
      <Card className="relative p-6 pb-[2.3rem]">
        <p className={`${CAPS} text-muted mb-3`}>{card.heading}</p>
        <ul className="flex flex-col gap-2">
          {card.themes.map(([label, count]) => (
            <li key={label} className="flex items-center justify-between text-small py-1.5 border-b border-line last:border-b-0">
              <span className="text-gold">{label}</span>
              <span className="font-semibold text-amber">{count}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 pr-8 text-label text-muted">{card.source}</p>
        <SourceMark platform={card.platform} />
      </Card>
    );
  }

  return (
    <Card className="relative p-6 pb-[2.3rem] flex flex-col">
      <Stars count={card.stars} />
      <p className="flex-1 m-0 text-body leading-[var(--lh-body,1.6)] text-green">&ldquo;{card.text}&rdquo;</p>
      <p className="mt-4 pr-8 text-label text-muted">{card.source}</p>
      <SourceMark platform={card.platform} />
    </Card>
  );
}
