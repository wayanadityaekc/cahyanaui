import Link from 'next/link';
import AddToBooking from '@/components/ui/AddToBooking';
import { WHATSAPP_LINK } from '@/lib/constants';

export default function ServiceAside({ title, facts, ctaLabel, ctaHref, otherServices, serviceId }) {
  return (
    <aside className="lg:sticky lg:top-24 flex flex-col gap-5">
      <div className="card p-6">
        <p className="caps text-muted mb-3">{title}</p>
        <ul className="flex flex-col gap-2 mb-5">
          {facts.map((fact) => (
            <li key={fact} className="flex items-start gap-2 text-small text-gold">
              <span className="text-amber">•</span>
              {fact}
            </li>
          ))}
        </ul>
        <Link href="/villas" className="btn btn-cta btn-full">Pick your villa</Link>
        {serviceId && <AddToBooking serviceId={serviceId} />}
        <a href={ctaHref || WHATSAPP_LINK} target="_blank" rel="noopener" className="btn btn-outline btn-full mt-2">{ctaLabel}</a>
      </div>

      <div className="card p-6 bg-cream">
        <p className="caps text-muted mb-3">Also at your villa</p>
        <ul className="flex flex-col">
          {otherServices.map((s) => (
            <li key={s.href} className="border-b border-line last:border-b-0">
              <Link href={s.href} className="flex items-center justify-between py-2.5 text-small text-gold">
                {s.label}
                <span>›</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
