import Badge from '../primitives/Badge.jsx';
import Button from '../primitives/Button.jsx';
import MediaCard from './MediaCard.jsx';
import PriceBlock from './PriceBlock.jsx';

/**
 * A villa, as a card.
 *
 * THIS IS SITE-SPECIFIC AND IT STILL LIVES IN THE LIBRARY - that is the rule,
 * not an accident. A block kept in the app "because only one site uses it" is a
 * block nobody else can see, review, or reuse; and "only one site uses it" has
 * a habit of expiring. What the library must NOT hold is the villas themselves.
 *
 * So the seam is: the library owns the SHAPE and the slot names, the app owns
 * the DATA and anything that needs a provider.
 *
 *   villa       { slug, name, badge, cardImg, guests, bedrooms, shortDesc,
 *                 nightlyRate }
 *   price       the already-formatted string. NOT a currency hook: the hook
 *               lives in the app's provider tree, and a library component that
 *               reaches for it can only be rendered inside that one app.
 *   meta        the fact row, as nodes - which facts matter is editorial
 *   href        where the card goes
 *   icons       { guests, bedrooms, pool } - Lucide nodes, passed in so the
 *               library does not take a dependency on an icon set
 */
export default function VillaCard({
  villa,
  price,
  meta = null,
  href,
  linkAs: Link = 'a',
  unit = '/ night',
  cta = 'View details',
  ctaIcon = null,
}) {
  return (
    <MediaCard
      as={Link}
      href={href || `/villas/${villa.slug}`}
      zoom
      image={{
        src: villa.cardImg,
        alt: `${villa.name} private pool and garden`,
        width: 700,
        height: 525,
        ratio: 'aspect-[4/3]',
      }}
      badges={
        <>
          {villa.badge ? <Badge tone="cta" className="absolute top-3 left-3">{villa.badge}</Badge> : null}
          <Badge className="absolute top-3 right-3">{villa.name}</Badge>
        </>
      }
      footer={
        <>
          <PriceBlock amount={price} unit={unit} size="md" />
          {/* A <span>, not a <button>: the whole card is already the link, and a
              button inside a link is invalid HTML that browsers resolve by
              guessing. It reads as the affordance without being a second
              target. */}
          <Button as="span" size="md" className="h-[2.25rem] px-[1.15rem]">
            {cta}
            {ctaIcon}
          </Button>
        </>
      }
    >
      <h3 className="text-h3 font-semibold text-gold">{villa.name}</h3>
      {meta}
      <p className="text-small text-muted">{villa.shortDesc}</p>
    </MediaCard>
  );
}
