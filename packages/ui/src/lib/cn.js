import clsx from 'clsx';

/**
 * Join class strings, dropping falsy ones.
 *
 * Deliberately NOT tailwind-merge. That library resolves conflicts by parsing
 * class names, and it only understands Tailwind's OWN scale - it would treat
 * `text-h2` and `text-body` as unrelated because neither is a class it knows,
 * and it cannot see inside an arbitrary value like `[transition:...]` at all.
 * Half this design system is exactly those two shapes.
 *
 * So conflicts are avoided by construction instead: a primitive never puts the
 * same property in two places, and `className` is always appended last so the
 * caller's class wins on source order.
 */
export function cn(...parts) {
  return clsx(parts);
}
