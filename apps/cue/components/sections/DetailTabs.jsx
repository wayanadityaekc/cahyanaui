'use client';

import { Backpack, Banknote, Car, Clock, CreditCard, Info } from 'lucide-react';
import { INFO_LIST_YES, INFO_LIST_NO } from '@/components/ui/infoClasses';
import { useEffect, useRef, useState } from 'react';
import ReviewsStrip from '@/components/reviews/ReviewsStrip';

// Options (was "Details") - the two ways every program can be booked. This
// replaces a facts grid that just repeated the hero hooks; the choice between
// Standard and Exclusive is the genuinely useful, page-specific decision. Prices
// are live and currency-correct (Price component), not hardcoded.
const CarIcon = () => <Car strokeWidth={1.7} aria-hidden="true" />;
const TicketIcon = () => <Banknote strokeWidth={1.7} aria-hidden="true" />;

// Informational cards: the two ways every program can be booked. Choosing the
// actual mode happens in the booking form's Standard/Exclusive toggle - these
// cards just explain the difference.
const ClockIcon = () => <Clock strokeWidth={1.7} aria-hidden="true" />;
const BagIcon = () => <Backpack strokeWidth={1.7} aria-hidden="true" />;
const InfoIcon = () => <Info strokeWidth={1.7} aria-hidden="true" />;
const CardIcon = () => <CreditCard strokeWidth={1.7} aria-hidden="true" />;

// Details - the two booking options plus practical, generic-but-real notes that
// hold for every day tour (pick-up, what to bring, things to note, payment), all
// in one list. Deliberately not per-tour specifics, so nothing here is invented.
//
// Single activities/performances (ATV, Kecak Dance, etc.) have no car-tour
// Standard/Exclusive split - the ticket is always in the price - so they get a
// one-row "included" explanation instead of the two tour tiers, and skip the
// temple/sarong line, which isn't true for every activity.
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

// Included / excluded lists - reuses the site-wide radio bullet lists.
const DINCL_H = 'text-label font-semibold tracking-[0.06em] uppercase text-gold mt-[1.3rem] mb-[0.6rem] first:mt-0';
function Inclusions({ included, excluded }) {
  return (
    <div>
      {included && included.length > 0 && (
        <>
          <h3 className={DINCL_H}>What&apos;s included</h3>
          <ul className={INFO_LIST_YES}>
            {included.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        </>
      )}
      {excluded && excluded.length > 0 && (
        <>
          <h3 className={DINCL_H}>Not included</h3>
          <ul className={INFO_LIST_NO}>
            {excluded.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}

// Detail page sections (Overview / Details / Included / Reviews). Everything is
// on one scrollable page - the sections are stacked and always visible - and the
// sticky tab strip is a jump nav: clicking a tab scrolls to its section, and the
// active tab follows the section currently in view (scrollspy).
export default function DetailTabs({ overview, notes, priceItem, bookType, included, excluded, reviewService, showReviews = true }) {
  const sections = [{ id: 'overview', label: 'Overview', content: overview }];
  // Destination pages: the practical notes that replace Include/Exclude.
  if (notes) sections.push({ id: 'notes', label: 'Good to know', content: notes });
  if (priceItem) {
    sections.push({
      id: 'details',
      label: 'Details',
      content: <GoodToKnow isActivity={bookType === 'experience' || bookType === 'performance'} />,
    });
  }
  if ((included && included.length) || (excluded && excluded.length)) {
    sections.push({ id: 'included', label: 'Included', content: <Inclusions included={included} excluded={excluded} /> });
  }
  if (showReviews) sections.push({
    id: 'reviews',
    label: 'Reviews',
    content: <ReviewsStrip service={reviewService} emptyText="No reviews yet for this program - be the first to share your trip." emptyCta />,
  });

  const [active, setActive] = useState(sections[0].id);
  const stripRef = useRef(null);
  const secRefs = useRef({});

  // Wayan (14 Sep 2026): dropped the sticky-card-with-internal-scroll design
  // (2 attempts, see git history) - nesting a second scrollable region inside
  // a sticky card kept feeling "locked" on scroll (a nested overflow region
  // can swallow the scroll gesture, especially on touch). Back to a simple,
  // proven mechanic: only the pill-shaped tab strip is sticky (bound to this
  // component's own height via normal position:sticky - it un-sticks once its
  // parent's bottom edge scrolls past), the card underneath just scrolls with
  // the page like everything else. No internal overflow, no scroll traps.
  //
  // stripRef is the OUTER sticky wrapper (top: headerH, flush against the
  // navbar), not the visible pill track - its `pt-[10px]` bakes the "jangan
  // nempel banget, kasi space dikit" breathing room in as opaque padding
  // (bg-white) instead of an empty gap, so nothing peeks through that gap
  // once the strip is stuck. Its offsetHeight already includes that padding,
  // so headerH + stripH alone is the full occluded height - no separate gap
  // constant to add on top.
  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const onScroll = () => {
      const stripH = stripRef.current ? stripRef.current.offsetHeight : 0;
      const header = document.querySelector('header');
      const headerH = header ? header.getBoundingClientRect().height : 0;
      const line = headerH + stripH + 12;
      let cur = ids[0];
      ids.forEach((id) => {
        const el = secRefs.current[id];
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (id) => {
    const el = secRefs.current[id];
    if (!el) return;
    const stripH = stripRef.current ? stripRef.current.offsetHeight : 0;
    const header = document.querySelector('header');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - stripH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // Tailwind-native (full-portable): wrapper/strip/tab/section-heading + section
  // wrapper -> utilities. Section pakai [&+&] (jarak antar-section) + [&_.stops]/
  // [&_.stop] (context override buat engine .stop yg masih CSS). .info__list*
  // (checklist bullet, kosakata konten) tetep shared - dikonversi di pass-nya.
  const SEC = 'pt-6 [scroll-margin-top:120px] [&+&]:mt-6 [&+&]:[border-top:1px_solid_var(--line)] [&_.stops]:p-0 [&_.stop]:max-w-none';
  // One elongated pill-shaped track (Wayan, 14 Sep 2026: "1 box memanjang
  // dengan border radius, bukan pill kecil-kecil") holding the tab buttons -
  // same segmented-control pattern as the Standard/Exclusive toggle in
  // BookingForm.jsx (muted track, active segment = filled pill), not a row of
  // separately-bordered pills. Nested back inside the card (not floating
  // outside it) - only this track is sticky, bound to the card's own height.
  // w-full + flex-1 tabs (not inline-flex/shrink-to-fit): the track needs an
  // opaque background spanning the FULL row, not just around its buttons -
  // otherwise, once stuck, whatever section content scrolls up to that height
  // peeks through on either side of the (narrower) button row.
  const tab = (on) =>
    `flex-1 text-center whitespace-nowrap font-body text-small font-semibold border-none rounded-pill py-[0.55rem] px-2 cursor-pointer transition-[background-color,color,scale] duration-[var(--dur-fast)] ease-[ease] ${on ? 'bg-gold text-white' : 'bg-transparent text-muted hover:text-green'}`;
  return (
    <div className="max-w-[1000px] mt-5 mx-auto max-[560px]:mt-4">
      <div className="bg-white rounded-xl px-6 pt-6 pb-8 [box-shadow:inset_0_8px_11px_-10px_rgba(34,32,28,0.3),inset_7px_0_9px_-9px_rgba(34,32,28,0.1),inset_-7px_0_9px_-9px_rgba(34,32,28,0.1)] max-[560px]:px-4 max-[560px]:pt-5 max-[560px]:pb-[1.6rem] max-[560px]:rounded-lg">
        {/* Wraps the visible pill track with the small breathing-room gap baked
            in as opaque padding (bg-white), not an empty gap above it - a
            transparent gap there let whatever section is mid-scroll peek
            through the moment the track is stuck (Wayan caught this on the
            Reviews tab: the tail end of Included's list showed through). */}
        <div ref={stripRef} className={`${sections.length > 1 ? '' : 'hidden '}sticky top-[var(--header-h,52.8px)] min-[769px]:top-[var(--header-h,57.6px)] z-20 pt-[10px] bg-white`}>
          <div
            className="mb-6 flex w-full gap-1 p-1 rounded-pill bg-[rgba(34,32,28,0.08)]"
            role="tablist"
            aria-label="Jump to section"
          >
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-current={active === s.id}
                className={tab(active === s.id)}
                onClick={() => pick(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        {sections.map((s) => (
          <section
            key={s.id}
            id={`dsec-${s.id}`}
            ref={(el) => { secRefs.current[s.id] = el; }}
            className={SEC}
          >
            <h2 className="text-h2 font-semibold text-gold m-0 mb-4">{s.label}</h2>
            {s.content}
          </section>
        ))}
      </div>
    </div>
  );
}
