import Button from '../primitives/Button.jsx';

// Full-bleed photo band, centred. paired: from 993px it becomes a rounded, left-aligned card for a two-column row.
export default function PhotoBand({ image = '', eyebrow = '', title = '', text = '', cta = '', href = '#', external = false, paired = false, id }) {
  const linkProps = external ? { target: '_blank', rel: 'noopener' } : {};
  return (
    <section
      id={id}
      className={`relative flex items-center justify-center min-h-[360px] px-[var(--container-x)] py-16 text-center bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(0,0,0,0.52),rgba(0,0,0,0.72))]${paired ? ' min-[993px]:min-h-0 min-[993px]:h-full min-[993px]:rounded-lg min-[993px]:overflow-hidden min-[993px]:justify-start min-[993px]:text-left min-[993px]:p-[var(--space-5)] min-[993px]:[&_p]:mx-0' : ''}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className={`relative z-[2] max-w-[600px]${paired ? ' min-[993px]:max-w-none' : ''}`}>
        <span className="block mb-[0.55rem] text-label tracking-[0.14em] uppercase font-medium text-gold-l">{eyebrow}</span>
        <h2 className="mt-0 mb-[0.8rem] text-h2 font-medium tracking-[-0.01em] leading-[1.15] text-white">{title}</h2>
        <p className="mx-auto mt-0 mb-[1.4rem] max-w-[520px] text-body leading-[1.6] text-white/90">{text}</p>
        <Button as="a" href={href} variant="primary" {...linkProps}>{cta}</Button>
      </div>
    </section>
  );
}
