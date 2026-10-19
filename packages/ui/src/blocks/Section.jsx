import { cn } from '../lib/cn.js';
import Container from './Container.jsx';
import { SECTION, SECTION_TONES } from './layoutClasses.js';

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
      {bare ? (
        children
      ) : (
        <Container width={width} className={innerClassName}>
          {children}
        </Container>
      )}
    </Tag>
  );
}
