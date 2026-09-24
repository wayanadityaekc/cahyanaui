import { cn } from '../lib/cn.js';
import Container from './Container.jsx';
import { SECTION, SECTION_TONES } from './layoutClasses.js';

/**
 * One band of a page: vertical rhythm, an optional tinted surface, and the
 * container inside it.
 *
 *   tone      plain | cream | white | dark
 *   width     passed through to Container
 *   bare      true = render the band but NOT the container, for a section
 *             whose own children need to reach the screen edges (a full-bleed
 *             slider, a photo strip). You then place your own Container.
 *   flush     drop the vertical padding, for a band that carries its own.
 *
 * OVERRIDING THE PADDING FROM `className` NEEDS `!`. Both this component's
 * padding and the caller's are Tailwind utilities now, and between two
 * utilities the winner is the compiled stylesheet's order, not the order they
 * appear in a string - so a plain `pt-8` loses to `md:py-20` above 768px. That
 * is a change from when .section was a CSS class in a layer, where the utility
 * always won. It cost 48px on the villa detail page before it was measured.
 *
 * `tone` and the padding are on the OUTER element and the width is on the
 * inner one, deliberately: a tinted band has to run the full width of the
 * screen while its content stays inside the container. Collapsing the two into
 * one element is what makes a cream section look like a cream card.
 */
export default function Section({
  as: Tag = 'section',
  tone = 'plain',
  width = 'wide',
  bare = false,
  flush = false,
  className,
  innerClassName,
  children,
  ...rest
}) {
  return (
    <Tag className={cn(!flush && SECTION, SECTION_TONES[tone] ?? '', className)} {...rest}>
      {bare ? children : <Container width={width} className={innerClassName}>{children}</Container>}
    </Tag>
  );
}
