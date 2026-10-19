'use client';

import { Backpack, Banknote, Car, Clock, CreditCard, Info } from 'lucide-react';
import InfoBoxes, { InfoBox, InfoBoxList } from '@/components/ui/InfoBoxes';
import { useEffect, useRef, useState } from 'react';
import ReviewsStrip from '@/components/reviews/ReviewsStrip';
import LoadFallback from '@/components/ui/LoadFallback';
import { CARD, CARD_WRAP, STRIP, TRACK, buildSegmentClass, SEC, SEC_H } from '@/components/ui/detailCardClasses';

const ICON_STROKE_WIDTH_REGULAR = 1.7;
const TAB_SCROLL_LINE_OFFSET_PX = 12;
const TAB_SCROLL_TOP_OFFSET_PX = 8;

function CarIcon() {
  return <Car strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />;
}
function TicketIcon() {
  return <Banknote strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />;
}

function ClockIcon() {
  return <Clock strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />;
}
function BagIcon() {
  return <Backpack strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />;
}
function InfoIcon() {
  return <Info strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />;
}
function CardIcon() {
  return <CreditCard strokeWidth={ICON_STROKE_WIDTH_REGULAR} aria-hidden="true" />;
}

function GoodToKnow({ isActivity }) {
  const rows = isActivity
    ? [
        {
          ic: <TicketIcon />,
          h: 'Included in this price',
          t: 'Your entrance ticket and return transport from Ubud are already included - nothing extra to pay for the activity itself.',
        },
        {
          ic: <ClockIcon />,
          h: 'Pick-up & timing',
          t: 'We pick you up from your hotel or villa in the Ubud area at the time you choose. Your driver shares their details the day before.',
        },
        {
          ic: <BagIcon />,
          h: 'What to bring',
          t: 'Comfortable clothes and shoes suited to the activity, sunscreen, and a change of clothes if things might get wet or muddy.',
        },
        {
          ic: <CardIcon />,
          h: 'Booking & payment',
          t: 'A small deposit over WhatsApp holds your date; you settle the rest at the end. Free cancellation up to 24 hours before.',
        },
      ]
    : [
        {
          ic: <CarIcon />,
          h: 'Standard',
          t: 'Private car, driver and fuel. You pay entrance tickets at each gate as you go - handy if you like to skip a stop.',
        },
        {
          ic: <TicketIcon />,
          h: 'Exclusive',
          t: 'The whole day prepaid, with entrance tickets for the listed stops included. Nothing to pay at the gates.',
        },
        {
          ic: <ClockIcon />,
          h: 'Pick-up & timing',
          t: 'We pick you up from your hotel or villa in the Ubud area at the time you choose. Your driver shares their details the day before.',
        },
        {
          ic: <BagIcon />,
          h: 'What to bring',
          t: 'Comfortable shoes, sunscreen and a hat, and some cash for entrance tickets (Standard) and lunch along the way.',
        },
        {
          ic: <InfoIcon />,
          h: 'Good to know',
          t: 'Temples ask for a sarong, arranged at the gate. A few stops have stairs or a short walk. The route is flexible - linger or skip as you like.',
        },
        {
          ic: <CardIcon />,
          h: 'Booking & payment',
          t: 'A small deposit over WhatsApp holds your date; you settle the rest at the end of the day. Free cancellation up to 24 hours before.',
        },
      ];
  return (
    <ul className="list-none mb-[1.6rem] flex flex-col gap-[1.1rem]">
      {rows.map((row) => (
        <li className="flex gap-[0.85rem] items-start" key={row.h}>
          <span className="flex-none grid place-items-center w-[2.2rem] h-[2.2rem] rounded-[50%] bg-cream text-gold [&_svg]:w-[var(--icon-sm)] [&_svg]:h-[var(--icon-sm)]">
            {row.ic}
          </span>
          <div>
            <span className="block text-strong font-semibold text-gold mb-[0.15rem]">{row.h}</span>
            <p className="text-small leading-[1.45] text-green m-0">{row.t}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

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

export default function DetailTabs({
  overview = null,
  priceItem = '',
  bookType = 'tour',
  included = [],
  excluded = [],
  reviewService = '',
}) {
  const sections = [{ id: 'overview', label: 'Overview', content: overview || <LoadFallback /> }];
  if (priceItem) {
    sections.push({
      id: 'details',
      label: 'Details',
      content: <GoodToKnow isActivity={bookType === 'experience' || bookType === 'performance'} />,
    });
  }
  if ((included && included.length) || (excluded && excluded.length)) {
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
    content: (
      <ReviewsStrip
        service={reviewService}
        emptyText="No reviews yet for this program - be the first to share your trip."
      />
    ),
  });

  const [active, setActive] = useState(sections[0].id);
  const stripRef = useRef(null);
  const secRefs = useRef({});

  useEffect(() => {
    const ids = sections.map((section) => section.id);
    function handleScroll() {
      const stripH = stripRef.current ? stripRef.current.offsetHeight : 0;
      const header = document.querySelector('header');
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const line = headerH + stripH + TAB_SCROLL_LINE_OFFSET_PX;
      let current = ids[0];
      ids.forEach((id) => {
        const section = secRefs.current[id];
        if (section && section.getBoundingClientRect().top <= line) current = id;
      });
      setActive(current);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  function pick(id) {
    const section = secRefs.current[id];
    if (!section) return;
    const stripH = stripRef.current ? stripRef.current.offsetHeight : 0;
    const header = document.querySelector('header');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const top = section.getBoundingClientRect().top + window.scrollY - headerH - stripH - TAB_SCROLL_TOP_OFFSET_PX;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <div className={CARD_WRAP}>
      <div className={CARD}>
        <div ref={stripRef} className={STRIP}>
          <nav className={TRACK} aria-label="Jump to section">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                aria-current={active === section.id ? 'true' : undefined}
                className={buildSegmentClass(active === section.id)}
                onClick={() => pick(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
        {sections.map((sectionItem) => (
          <section
            key={sectionItem.id}
            id={`dsec-${sectionItem.id}`}
            ref={(section) => {
              secRefs.current[sectionItem.id] = section;
            }}
            className={SEC}
            aria-label={sectionItem.heading === false ? sectionItem.label : undefined}
          >
            {sectionItem.heading !== false && <h2 className={SEC_H}>{sectionItem.label}</h2>}
            {sectionItem.content}
          </section>
        ))}
      </div>
    </div>
  );
}
