/**
 * Button - the shared action atom. One place for the site's button shape
 * (pill), weight, and colour roles so new UI doesn't hand-roll classes.
 *   variant: "primary" (green CTA) | "ghost" (soft-black outline) | "plain"
 *   size:    "md" (default) | "lg"
 *   as:      render as a different tag/component (e.g. "a") - defaults to button.
 */
export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const cls = [
    'btn',
    `btn--${variant}`,
    size !== 'md' ? `btn--${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const typeProp = Tag === 'button' && rest.type === undefined ? { type: 'button' } : {};
  return (
    <Tag className={cls} {...typeProp} {...rest}>
      {children}
    </Tag>
  );
}
