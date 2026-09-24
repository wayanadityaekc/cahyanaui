import { cn } from '../lib/cn.js';
import { BTN_SM } from './btnClasses.js';

/**
 * The action atom. One place for the shape, the weight, and which colour means
 * what.
 *
 *   variant  primary  green CTA - the one thing to do on a screen
 *            ghost    outlined - "see more", secondary
 *            light    translucent white, for a button sitting ON a photograph
 *            plain    a text link
 *
 * THERE IS NO `size` PROP. Every action button on both sites is BTN_SM; see
 * btnClasses.js for why the question is closed.
 *
 * `plain` is NOT a button, it is a text link, so it takes BASE_LINK and never
 * gets BTN_SM. Handing it the button geometry and then cancelling the parts
 * again (h-auto, p-0, rounded-none) does not work: the winner is CSS order, so
 * `rounded-sm` from BTN_SM beats a later `rounded-none` and the text link
 * renders with 8px corners on a transparent background. CUE shipped that bug.
 *
 * Every button carries data-btn="<variant>". It is not styling - it is how a
 * test can census the real action buttons on a page. Finding them by computed
 * style instead matches calendar day cells, gallery arrows and avatar circles,
 * all of which are centred flex boxes too.
 *
 * Properties that differ per variant live ONLY in the variant map, never in
 * BASE - the same property must not be set twice and left to the cascade.
 */
const SHARED =
  'font-body border cursor-pointer no-underline ' +
  'transition-[color,background-color,border-color,scale] duration-200 ease-in-out ' +
  'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed';

const BASE = `inline-flex ${BTN_SM} gap-2 ${SHARED}`;
const BASE_LINK = `inline-flex items-center gap-2 p-0 h-auto text-small font-semibold rounded-none ${SHARED}`;

const VARIANTS = {
  primary: 'border-transparent bg-cta text-white hover:bg-cta-d',
  ghost: 'border-line bg-transparent text-gold hover:bg-cream',
  // On a photograph, where neither white nor the green reads reliably against
  // whatever happens to be behind it. The blur is what keeps the label legible
  // over a busy frame; without it this is just a faint outline.
  light: 'border-white/60 bg-white/10 text-white backdrop-blur-[2px] hover:bg-white hover:text-gold',
  plain: 'border-transparent bg-transparent text-gold hover:text-gold-d',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  full = false,
  className,
  children,
  ...rest
}) {
  const base = variant === 'plain' ? BASE_LINK : BASE;
  // A <button> with no type submits the form around it. That has surprised
  // enough people that the default is set here rather than at each call site.
  const type = Tag === 'button' && rest.type === undefined ? { type: 'button' } : {};
  return (
    <Tag
      className={cn(base, VARIANTS[variant] || VARIANTS.primary, full && 'flex w-full', className)}
      data-btn={variant}
      {...type}
      {...rest}
    >
      {children}
    </Tag>
  );
}
