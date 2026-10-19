import { cn } from '../lib/cn.js';

const SIZES = {
  sm: 'text-h3 font-semibold',
  md: 'text-h2 font-semibold',
  lg: 'text-h2 font-semibold',
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
