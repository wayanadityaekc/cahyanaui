import Link from 'next/link';
import Mosaic from '@/components/ui/Mosaic';
import ServiceAside from '@/components/sections/ServiceAside';

// Shared layout for every "at your villa" service page (Breakfast, Spa,
// Live Dinner, and the new Scooter Rental) — one structure, content-driven,
// so styling only has to be maintained in one place.
export default function ServiceDetail({
  kicker,
  title,
  subtitle,
  heroImg,
  heroAlt,
  glance,
  sections,
  gallery,
  aside,
  bottomHeading,
  bottomText,
  bottomCta,
}) {
  return (
    <>
      <section className="relative">
        <div className="relative min-h-[38vh] flex items-end overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImg} alt={heroAlt} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,20,16,0.1), rgba(20,20,16,0.65))' }} />
          <div className="container relative z-10 py-10">
            <p className="eyebrow" style={{ color: 'var(--color-gold-l)' }}>{kicker}</p>
            <h1 className="text-display font-bold" style={{ color: '#fff' }}>{title}</h1>
            <p className="mt-2 max-w-md text-small" style={{ color: 'rgba(255,255,255,0.85)' }}>{subtitle}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid lg:grid-cols-[1.7fr_1fr] gap-10 items-start">
          <div className="prose-copy">
            <p className="eyebrow">At a Glance</p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 border-t border-b border-line mb-2">
              {glance.map((g) => (
                <li key={g.label} className="flex flex-col py-4 pr-4 text-small">
                  <span className="text-label uppercase tracking-wide text-muted">{g.label}</span>
                  <span style={{ color: 'var(--color-gold)' }}>{g.value}</span>
                </li>
              ))}
            </ul>

            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-h2 font-semibold mt-9 mb-3" style={{ color: 'var(--color-gold)' }}>{s.heading}</h2>
                {s.body?.map((p, i) => <p key={i}>{p}</p>)}
                {s.list && (
                  <ul className="grid sm:grid-cols-2 gap-x-8">
                    {s.list.map((item) => (
                      <li key={item.title} className="py-3 border-b border-line text-small">
                        <strong className="block" style={{ color: 'var(--color-gold)' }}>{item.title}</strong>
                        <span className="text-muted">{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.note && <p className="text-small text-muted">{s.note}</p>}
              </div>
            ))}

            {gallery && <Mosaic images={gallery} />}
          </div>

          <ServiceAside {...aside} />
        </div>
      </section>

      <section className="section text-center" style={{ background: 'var(--color-gold)' }}>
        <div className="container">
          <h2 className="text-h2 font-semibold" style={{ color: '#fff' }}>{bottomHeading}</h2>
          <p className="mt-2 text-small" style={{ color: 'rgba(255,255,255,0.75)' }}>{bottomText}</p>
          <div className="flex justify-center mt-6">
            {bottomCta || <Link href="/villas" className="btn btn-cta">See both villas</Link>}
          </div>
        </div>
      </section>
    </>
  );
}
