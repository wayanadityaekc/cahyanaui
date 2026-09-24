import { BTN_SM } from '@/components/ui/btnClasses';
/**
 * Button - the shared action atom. One place for the site's button shape,
 * weight, and colour roles so new UI doesn't hand-roll classes.
 *   variant: "primary" (green CTA) | "ghost" (soft-black outline) | "plain"
 *   as:      render as a different tag/component (e.g. "a") - defaults to button.
 *
 * ONE SIZE (Sep 2026, Wayan pilih "A" dari sheet hasil ukur): every action button
 * is BTN_SM - 33.6px tall, 12.8px text, 8px corners, label centred on both axes.
 * The `size` prop is GONE; md/lg do not exist any more. The shape lives in BTN_SM
 * (btnClasses.js), so this primitive and the ~20 hand-written buttons cannot drift
 * apart again - that drift is exactly what the census found (11 heights for one role).
 *
 * "plain" is NOT a button: it is a text link, so it takes BASE_LINK instead and
 * never gets BTN_SM. Giving it the button geometry and then cancelling the parts
 * again (h-auto, p-0, rounded-none) does not work: in Tailwind the winner is CSS
 * order, not class order, so `rounded-sm` from BTN_SM beat `rounded-none` and the
 * text link rendered with 8px corners on a transparent background.
 */
const SHARED = 'font-body border cursor-pointer no-underline ' +
  'transition-[color,background-color,border-color,scale] duration-200 ease-in-out';

const BASE = `inline-flex ${BTN_SM} gap-2 ${SHARED}`;
const BASE_LINK = `inline-flex items-center gap-2 p-0 h-auto text-small font-semibold rounded-none ${SHARED}`;

const VARIANTS = {
  primary: 'border-transparent bg-cta text-white hover:bg-cta-d',
  ghost: 'border-line bg-transparent text-gold hover:bg-cream',
  plain: 'border-transparent bg-transparent text-gold hover:text-gold-d',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  className = '',
  children,
  ...rest
}) {
  const base = variant === 'plain' ? BASE_LINK : BASE;
  const cls = [base, VARIANTS[variant] || VARIANTS.primary, className].filter(Boolean).join(' ');
  const typeProp = Tag === 'button' && rest.type === undefined ? { type: 'button' } : {};
  return (
    <Tag className={cls} {...typeProp} {...rest}>
      {children}
    </Tag>
  );
}
