import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ServiceCard({ href, img, alt, name, desc, cta }) {
  return (
    <Link href={href} className="card card-hover flex flex-col overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={alt} width={700} height={460} loading="lazy" className="w-full aspect-[3/2] object-cover" />
      <div className="p-5">
        <h3 className="text-h3 font-semibold text-gold">{name}</h3>
        <p className="mt-1.5 text-small text-muted">{desc}</p>
        <span className="mt-3 inline-flex items-center gap-1 caps text-cta">
          {cta}
          <ArrowRight className="w-[var(--icon-sm)] h-[var(--icon-sm)]" strokeWidth={1.6} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
