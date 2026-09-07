import Link from 'next/link';

export default function ServiceCard({ href, img, alt, name, desc, cta }) {
  return (
    <Link href={href} className="card card-hover flex flex-col overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={alt} width={700} height={460} loading="lazy" className="w-full aspect-[3/2] object-cover" />
      <div className="p-5">
        <h3 className="text-h3 font-semibold" style={{ color: 'var(--color-gold)' }}>{name}</h3>
        <p className="mt-1.5 text-small text-muted">{desc}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-label font-semibold uppercase tracking-wide" style={{ color: 'var(--color-cta)' }}>
          {cta}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 2.5 10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
    </Link>
  );
}
