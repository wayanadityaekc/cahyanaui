import CardImage from '@/components/cards/CardImage';
import Price from '@/components/Price';

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.9 6 6.6.6-5 4.3 1.5 6.5L12 16.9 5.9 20l1.5-6.5-5-4.3 6.6-.6z" />
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5 21c0-8 5-15 15-16 1 10-5 16-13 16H5zm3-3c5-1 8-4 9-9-5 2-8 5-9 9z" />
    </svg>
  );
}
function MaskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c-4 0-7 2-7 6 0 5 3 10 7 14 4-4 7-9 7-14 0-4-3-6-7-6zM9.5 9a1.2 1.2 0 1 1 0 .01zM14.5 9a1.2 1.2 0 1 1 0 .01zM9 14c1 1.2 5 1.2 6 0-1 2-5 2-6 0z" />
    </svg>
  );
}
function MountainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 20h18L14 8l-3.2 5-2-2.8L3 20z" />
    </svg>
  );
}
function TempleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l9 5v2H3V7l9-5zM5 10h2v7H5v-7zm4 0h2v7H9v-7zm4 0h2v7h-2v-7zm4 0h2v7h-2v-7zM3 18h18v3H3v-3z" />
    </svg>
  );
}

// Category -> badge tone + icon. Labels are the real category (no invented
// "Popular" tags), tone reuses the brand gold/green.
const CATS = {
  Culture: { tone: 'gold', Icon: MaskIcon },
  Temple: { tone: 'gold', Icon: TempleIcon },
  Nature: { tone: 'green', Icon: LeafIcon },
  Adventure: { tone: 'green', Icon: MountainIcon },
};

// Homepage / "You might also like" card - glassmorphism overlay style: the
// photo fills the card under a dark gradient, a category badge (top-left) and a
// rating pill (top-right, "New" until real reviews), then the title with a
// coloured accent and a frosted glass bar (duration + Private Tour, price).
export default function HomepageCard({
  href, name, img, alt, meta, metaIcon = 'clock',
  priceName, priceFallback, priceMode = 'standard', zone, cat, rating, width = 600, height = 600,
}) {
  const c = (cat && CATS[cat]) || null;
  const tone = c ? c.tone : 'gold';
  const isTour = metaIcon !== 'pin';
  // Full modifier class names kept as literals (not `--${tone}`) so the
  // check-classes gate can resolve them statically.
  const catTone = tone === 'green' ? 'hcard__cat--green' : 'hcard__cat--gold';
  const accentTone = tone === 'green' ? 'hcard__accent--green' : 'hcard__accent--gold';
  return (
    <a className="experience__card hcard" href={href} data-zone={zone}>
      <CardImage img={img} alt={alt || name} width={width} height={height} />
      {c && (
        <span className={`hcard__cat ${catTone}`}>
          <c.Icon />{cat}
        </span>
      )}
      <span className="hcard__rate"><StarIcon />{rating || 'New'}</span>
      <div className="hcard__ov">
        <h3 className="hcard__t">{name}</h3>
        <span className={`hcard__accent ${accentTone}`} />
        <div className="hcard__bar">
          <span className="hcard__meta">
            {isTour ? <ClockIcon /> : <PinIcon />}<span>{meta}</span>
            {isTour && (
              <>
                <span className="hcard__sep" />
                <UserIcon /><span>Private Tour</span>
              </>
            )}
          </span>
          {priceName && (
            <span className="hcard__price">
              <small>from</small>
              <Price name={priceName} mode={priceMode} fallback={priceFallback} />
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
