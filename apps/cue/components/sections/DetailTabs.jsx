'use client';

import { Backpack, Banknote, Car, Clock, CreditCard, Info } from 'lucide-react';
import InfoBoxes, { InfoBox, InfoBoxList } from '@/components/ui/InfoBoxes';
import { useEffect, useRef, useState } from 'react';
import ReviewsStrip from '@/components/reviews/ReviewsStrip';
import { CARD, CARD_WRAP, STRIP, TRACK, segment, SEC, SEC_H } from '@/components/ui/detailCardClasses';

// Icons for the Standard / Exclusive rows in the Details list.
function CarIcon() { return <Car strokeWidth={1.7} aria-hidden="true" />; }
function TicketIcon() { return <Banknote strokeWidth={1.7} aria-hidden="true" />; }

// Icons for the practical notes rows in the Details list.
function ClockIcon() { return <Clock strokeWidth={1.7} aria-hidden="true" />; }
function BagIcon() { return <Backpack strokeWidth={1.7} aria-hidden="true" />; }
function InfoIcon() { return <Info strokeWidth={1.7} aria-hidden="true" />; }
function CardIcon() { return <CreditCard strokeWidth={1.7} aria-hidden="true" />; }

// Details list: tour tiers plus generic pick-up/bring/notes rows; activities get one 'included' row and no temple line.
function GoodToKnow({ isActivity }) {
  const rows = isActivity
    ? [
        { ic: <TicketIcon />, h: 'Included in this price', t: 'Your entrance ticket and return transport from Ubud are already included - nothing extra to pay for the activity itself.' },
        { ic: <ClockIcon />, h: 'Pick-up & timing', t: 'We pick you up from your hotel or villa in the Ubud area at the time you choose. Your driver shares their details the day before.' },
        { ic: <BagIcon />, h: 'What to bring', t: 'Comfortable clothes and shoes suited to the activity, sunscreen, and a change of clothes if things might get wet or muddy.' },
        { ic: <CardIcon />, h: 'Booking & payment', t: 'A small deposit over WhatsApp holds your date; you settle the rest at the end. Free cancellation up to 24 hours before.' },
      ]
    : [
        { ic: <CarIcon />, h: 'Standard', t: 'Private car, driver and fuel. You pay entrance tickets at each gate as you go - handy if you like to skip a stop.' },
        { ic: <TicketIcon />, h: 'Exclusive', t: 'The whole day prepaid, with entrance tickets for the listed stops included. Nothing to pay at the gates.' },
        { ic: <ClockIcon />, h: 'Pick-up & timing', t: 'We pick you up from your hotel or villa in the Ubud area at the time you choose. Your driver shares their details the day before.' },
        { ic: <BagIcon />, h: 'What to bring', t: 'Comfortable shoes, sunscreen and a hat, and some cash for entrance tickets (Standard) and lunch along the way.' },
        { ic: <InfoIcon />, h: 'Good to know', t: 'Temples ask for a sarong, arranged at the gate. A few stops have stairs or a short walk. The route is flexible - linger or skip as you like.' },
        { ic: <CardIcon />, h: 'Booking & payment', t: 'A small deposit over WhatsApp holds your date; you settle the rest at the end of the day. Free cancellation up to 24 hours before.' },
      ];
  return (
    <ul className="list-none mb-[1.6rem] flex flex-col gap-[1.1rem]">
      {rows.map((r) => (
        <li className="flex gap-[0.85rem] items-start" key={r.h}>
          <span className="flex-none grid place-items-center w-[2.2rem] h-[2.2rem] rounded-[50%] bg-cream text-gold [&_svg]:w-[var(--icon-sm)] [&_svg]:h-[var(--icon-sm)]">{r.ic}</span>
          <div>
            <span className="block text-strong font-semibold text-gold mb-[0.15rem]">{r.h}</span>
            <p className="text-small leading-[1.45] text-green m-0">{r.t}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Shared InfoBoxes pair; pass variant to BOTH InfoBox (frame, tint) and InfoBoxList (row rules, muted text).
function Inclusions({ included, excluded }) {
  return (
    <InfoBoxes>
      {included && included.length > 0 && (
        <InfoBox title="What's included" variant="yes">
          <InfoBoxList items={included} variant="yes" />
        </InfoBox>
      )}
      {excluded && excluded.length > 0 && (
        <InfoBox title="Not included" variant="no">
          <InfoBoxList items={excluded} variant="no" />
        </InfoBox>
      )}
    </InfoBoxes>
  );
}

// Detail page sections stacked on one page; the sticky strip is a jump nav whose active item follows scroll.
export default function DetailTabs({ overview, priceItem, bookType, included, excluded, reviewService }) {
  const sections = [{ id: 'overview', label: 'Overview', content: overview }];
  if (priceItem) {
    sections.push({
      id: 'details',
      label: 'Details',
      content: <GoodToKnow isActivity={bookType === 'experience' || bookType === 'performance'} />,
    });
  }
  if ((included && included.length) || (excluded && excluded.length)) {
    // No visible heading (the boxes already say it); the label stays on the jump nav and as the section aria-label.
    sections.push({
      id: 'included',
      label: 'Included',
      heading: false,
      content: <Inclusions included={included} excluded={excluded} />,
    });
  }
  sections.push({
    id: 'reviews',
    label: 'Reviews',
    content: <ReviewsStrip service={reviewService} emptyText="No reviews yet for this program - be the first to share your trip." emptyCta />,
  });

  const [active, setActive] = useState(sections[0].id);
  const stripRef = useRef(null);
  const secRefs = useRef({});

  // Scrollspy; only the strip is sticky (no nested scroll area), and stripRef includes its opaque top padding.
  useEffect(() => {
    const ids = sections.map((s) => s.id);
    function onScroll() {
      const stripH = stripRef.current ? stripRef.current.offsetHeight : 0;
      const header = document.querySelector('header');
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const line = headerH + stripH + 12;
      let cur = ids[0];
      ids.forEach((id) => {
        const section = secRefs.current[id];
        if (section && section.getBoundingClientRect().top <= line) cur = id;
      });
      setActive(cur);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pick(id) {
    const section = secRefs.current[id];
    if (!section) return;
    const stripH = stripRef.current ? stripRef.current.offsetHeight : 0;
    const header = document.querySelector('header');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const top = section.getBoundingClientRect().top + window.scrollY - headerH - stripH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Card with the sticky jump-nav strip on top and the stacked sections below.
  return (
    <div className={CARD_WRAP}>
      <div className={CARD}>
        {/* Breathing room above the track is opaque padding (bg-white), so content never shows through once it sticks. */}
        <div ref={stripRef} className={STRIP}>
          <nav
            className={TRACK}
            aria-label="Jump to section"
          >
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-current={active === s.id ? 'true' : undefined}
                className={segment(active === s.id)}
                onClick={() => pick(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
        {sections.map((s) => (
          <section
            key={s.id}
            id={`dsec-${s.id}`}
            ref={(section) => { secRefs.current[s.id] = section; }}
            className={SEC}
            aria-label={s.heading === false ? s.label : undefined}
          >
            {s.heading !== false && <h2 className={SEC_H}>{s.label}</h2>}
            {s.content}
          </section>
        ))}
      </div>
    </div>
  );
}
