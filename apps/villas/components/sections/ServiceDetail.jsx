import Link from 'next/link';
import { Button, CAPS, Container, EYEBROW_LINE, Hero, PROSE_COPY, Section } from '@cahyana/ui';
import Mosaic from '@/components/ui/Mosaic';
import ServiceAside from '@/components/sections/ServiceAside';
import LoadFallback from '@/components/ui/LoadFallback';

// Shared layout for every 'at your villa' service page, so styling lives in one place.
export default function ServiceDetail({
  kicker = '',
  title = '',
  subtitle = '',
  heroImg = '',
  heroAlt = '',
  glance = [],
  sections = [],
  gallery = null,
  aside = {},
  serviceId = '',
  bottomHeading = '',
  bottomText = '',
  bottomCta = null,
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
            {glance.length ? (
              <ul className="grid grid-cols-2 sm:grid-cols-4 border-t border-b border-line mb-2">
                {glance.map((item) => (
                  <li key={item.label} className="flex flex-col py-4 pr-4 text-small">
                    <span className={`${CAPS} text-muted`}>{item.label}</span>
                    <span className="text-gold">{item.value}</span>
                  </li>
                ))}
              </ul>
            ) : <LoadFallback className="mb-2" />}

            {!sections.length && <LoadFallback className="mt-9" />}
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-h2 font-medium mt-9 mb-3 text-gold">{section.heading}</h2>
                {section.body?.map((para, i) => <p key={i}>{para}</p>)}
                {section.list && (
                  <ul className="grid sm:grid-cols-2 gap-x-8">
                    {section.list.map((item) => (
                      <li key={item.title} className="py-3 border-b border-line text-small">
                        <strong className="block text-gold">{item.title}</strong>
                        <span className="text-muted">{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.note && <p className="text-small text-muted">{section.note}</p>}
              </div>
            ))}

            {gallery && <Mosaic images={gallery} />}
          </div>

          <ServiceAside {...aside} serviceId={serviceId} />
        </Container>
      </Section>

      <Section tone="dark" className="text-center">
        <h2 className="text-h2 font-medium text-white">{bottomHeading}</h2>
        <p className="mt-2 text-small text-white/75">{bottomText}</p>
        <div className="flex justify-center mt-6">
          {bottomCta || <Button as={Link} variant="onDark" href="/#villas">See villas</Button>}
        </div>
</Section>
    </>
  );
}
