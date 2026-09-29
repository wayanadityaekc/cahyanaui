import { BTN_SM } from '@/components/ui/btnClasses';
// Shared button: primary | ghost use BTN_SM; plain is a text link on BASE_LINK and must never get BTN_SM (CSS order wins).
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
