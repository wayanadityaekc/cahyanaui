import { cn } from '../lib/cn.js';

/**
 * "From  Rp1.850.000  / night".
 *
 * Three lines that had been hand-typed in three places on the villa site (card
 * footer, booking panel, mobile bar) at three sizes, and the amber had to be
 * remembered each time.
 *
 *   amount  the formatted string. Formatting is the app's job - it owns the
 *           currency the guest picked and the rate it converts at.
 *   kicker  the word above ("From"). Only pass it when it is TRUE: "from"
 *           promises the number can only go up, so it must not sit above a
 *           total.
 *   unit    "/ night", "per car"
 *   size    md (a card) | lg (a panel) | sm (a bar)
 *   tight   collapse the leading. A price inside a sticky bar has to fit in
 *           one short row; the same block in a card is part of the running
 *           column and must keep the page line-height, or the card gets 10px
 *           shorter than the one beside it that does not use this. Measured -
 *           it is not a rounding difference.
 *   tone    amber (the default, and the rule) | gold
 *
 * AMBER IS NOT A CHOICE HERE. Prices are one of only three jobs the real gold
 * has site-wide, and this is the component that spends it. `tone="gold"` exists
 * for the one measured exception: a price sitting directly beside a green CTA,
 * where amber and the green fight - CUE hit this in its book bar, its charter
 * cards and the airport total, and made the price soft black in exactly those
 * three places.
 */
const SIZES = {
  sm: 'text-h3 font-bold',
  md: 'text-h2 font-bold',
  lg: 'text-h2 font-bold',
};

export default function PriceBlock({
  amount,
  kicker = 'From',
  unit,
  size = 'md',
  tone = 'amber',
  tight = false,
  className,
  ...rest
}) {
  return (
    <p className={cn(tight && 'leading-tight', className)} {...rest}>
      {kicker ? <span className="block text-label text-muted">{kicker}</span> : null}
      <span className={cn(SIZES[size] || SIZES.md, tone === 'gold' ? 'text-gold' : 'text-amber')}>{amount}</span>
      {unit ? <span className="text-label text-muted"> {unit}</span> : null}
    </p>
  );
}
