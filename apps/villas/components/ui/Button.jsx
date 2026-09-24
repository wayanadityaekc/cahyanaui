/**
 * Button - the shared action atom, ported from CUE's components/ui/Button.jsx so
 * both sister sites render the same button shape, weight and colour roles.
 *
 * RELATIONSHIP TO .btn IN globals.css: the .btn / .btn-cta / .btn-outline CSS
 * classes already in this project are the same design expressed as CSS, and the
 * pages using them are NOT being rewritten here - the two produce the same pill,
 * the same 2.9rem height and the same tokens. Prefer this atom for new UI (it is
 * the portable, self-contained form CUE standardised on); leave working .btn
 * markup alone until there is a reason to touch it.
 *
 * Original notes follow.
 *
 * Button - the shared action atom. One place for the site's button shape
 * (pill), weight, and colour roles so new UI doesn't hand-roll classes.
 *   variant: "primary" (green CTA) | "ghost" (soft-black outline) | "plain"
 *   size:    "md" (default) | "lg"
 *   as:      render as a different tag/component (e.g. "a") - defaults to button.
 *
 * Tailwind-native (Fase 2 migrasi): utilities dipetakan 1:1 dari .btn di
 * style.css lewat token @theme (rounded-pill, bg-cta, text-small, dst) supaya
 * nilainya persis sama, bukan angka Tailwind default. Konflik font-size/height/
 * radius/border dihindari dengan menaruh properti yang beda-per-varian HANYA di
 * map varian/size (bukan di BASE), karena urutan className tidak menentukan mana
 * yang menang di Tailwind - yang menang urutan di CSS hasil compile.
 */
const BASE =
  'inline-flex items-center justify-center gap-2 font-body font-semibold leading-none ' +
  'border cursor-pointer no-underline transition-[color,background-color,border-color,scale] duration-200 ease-in-out';

const VARIANTS = {
  primary: 'rounded-pill border-transparent bg-cta text-white hover:bg-cta-d',
  ghost: 'rounded-pill border-line bg-transparent text-gold hover:bg-cream',
  plain: 'rounded-none border-transparent bg-transparent text-gold hover:text-gold-d',
};

// .btn--lg naikin height/padding/font; md = default .btn. Plain = text link,
// tanpa height/padding/pill (padding 0, height auto) - size diabaikan.
const SIZES = {
  md: 'h-[2.9rem] px-6 text-small',
  lg: 'h-[3.2rem] px-[1.9rem] text-[1rem]',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const sizeCls = variant === 'plain' ? 'p-0 h-auto text-small' : SIZES[size] || SIZES.md;
  const cls = [BASE, VARIANTS[variant] || VARIANTS.primary, sizeCls, className]
    .filter(Boolean)
    .join(' ');
  const typeProp = Tag === 'button' && rest.type === undefined ? { type: 'button' } : {};
  return (
    <Tag className={cls} {...typeProp} {...rest}>
      {children}
    </Tag>
  );
}
