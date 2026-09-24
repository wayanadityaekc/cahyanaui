import Link from 'next/link';
import { Button, CAPS, Container, EYEBROW_LINE, Hero, PROSE_COPY, Section } from '@cahyana/ui';
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
  serviceId,
  bottomHeading,
  bottomText,
  bottomCta,
}) {
  return (
    <>
      <Hero
        size="compact"
        align="end"
        image={heroImg}
        alt={heroAlt}
        eyebrow={kicker}
        title={title}
        titleClassName=""
        lede={subtitle}
      />

      <Section bare>
        <Container className="grid lg:grid-cols-[1.7fr_1fr] gap-10 items-start">
          <div className={PROSE_COPY}>
            <p className={EYEBROW_LINE}>At a Glance</p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 border-t border-b border-line mb-2">
              {glance.map((g) => (
                <li key={g.label} className="flex flex-col py-4 pr-4 text-small">
                  <span className={`${CAPS} text-muted`}>{g.label}</span>
                  <span className="text-gold">{g.value}</span>
                </li>
              ))}
            </ul>

            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-h2 font-semibold mt-9 mb-3 text-gold">{s.heading}</h2>
                {s.body?.map((p, i) => <p key={i}>{p}</p>)}
                {s.list && (
                  <ul className="grid sm:grid-cols-2 gap-x-8">
                    {s.list.map((item) => (
                      <li key={item.title} className="py-3 border-b border-line text-small">
                        <strong className="block text-gold">{item.title}</strong>
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

          <ServiceAside {...aside} serviceId={serviceId} />
        </Container>
      </Section>

      <Section tone="dark" className="text-center">
        <h2 className="text-h2 font-semibold text-white">{bottomHeading}</h2>
        <p className="mt-2 text-small text-white/75">{bottomText}</p>
        <div className="flex justify-center mt-6">
          {bottomCta || <Button as={Link} href="/villas">See both villas</Button>}
        </div>
</Section>
    </>
  );
}
