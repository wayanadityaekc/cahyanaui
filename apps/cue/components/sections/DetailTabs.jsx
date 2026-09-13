'use client';

import { INFO_LIST_YES, INFO_LIST_NO } from '@/components/ui/infoClasses';
import { useEffect, useRef, useState } from 'react';
import ReviewsStrip from '@/components/reviews/ReviewsStrip';

// Options (was "Details") - the two ways every program can be booked. This
// replaces a facts grid that just repeated the hero hooks; the choice between
// Standard and Exclusive is the genuinely useful, page-specific decision. Prices
// are live and currency-correct (Price component), not hardcoded.
function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 11l1.4-4.2A2 2 0 0 1 8.3 5.4h7.4a2 2 0 0 1 1.9 1.4L19 11M4 11h16v5H4zM7 16v1.6M17 16v1.6" /><circle cx="7.5" cy="13.5" r="1" /><circle cx="16.5" cy="13.5" r="1" />
    </svg>
  );
}
function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4z" /><path d="M14 6.5v1.5M14 11v2M14 16v-1.5" />
    </svg>
  );
}

// Informational cards: the two ways every program can be booked. Choosing the
// actual mode happens in the booking form's Standard/Exclusive toggle - these
// cards just explain the difference.
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h4" />
    </svg>
  );
}

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
    sections.push({ id: 'included', label: 'Included', content: <Inclusions included={included} excluded={excluded} /> });
  }
  sections.push({
    id: 'reviews',
    label: 'Reviews',
    content: <ReviewsStrip service={reviewService} emptyText="No reviews yet for this program - be the first to share your trip." emptyCta />,
  });

  const [active, setActive] = useState(sections[0].id);
  const wrapRef = useRef(null);
  const boxRef = useRef(null);
  const stripRef = useRef(null);
  const contentRef = useRef(null);
  const secRefs = useRef({});

  // Small breathing room so the card doesn't sit flush against the navbar
  // once it's stuck (Wayan: "jangan nempel banget, kasi space dikit").
  const NAV_GAP = 10;
  // Desktop only (see DESKTOP_MQ below) - on mobile a nested scroll region is
  // exactly the "stuck scroll" feel the site's sliders deliberately avoid
  // (touch-action: pan-x pan-y so vertical swipe always reaches the page),
  // so small screens keep the simpler page-level sticky strip instead.
  const DESKTOP_MQ = '(min-width: 769px)';

  const headerH = () => {
    const h = document.querySelector('header');
    return h ? h.getBoundingClientRect().height : 0;
  };

  // Wayan (12-13 Sep 2026): the card holds still while its own content (photos,
  // text) scrolls inside it, releasing once that content runs out - and the tab
  // strip belongs to the STICKY CARD, not to the scrolling content.
  //
  // Two containers, split by role (Wayan's own framing, after a first attempt
  // that bundled both roles into one element didn't look right):
  //   - boxRef (Container A): position:sticky + the card's border/shadow/radius,
  //     plus the tab strip as a plain, non-scrolling child - it's the "shell".
  //   - contentRef (Container B), nested inside A: the ONLY thing that scrolls
  //     (overflow-y:auto + a bounded max-height), holding just the <section>s.
  //     The strip is now outside of B entirely, so it never needs its own
  //     position:sticky trick to stay visible - being outside the scrolling
  //     region already keeps it in view.
  //
  // Gotcha (still applies, now scoped to B instead of A): giving an element
  // both `position:sticky` on an ancestor AND `max-height + overflow-y:auto`
  // on itself clips that element's contribution to ITS OWN parent's height
  // down to max-height - so mainCol (A's parent) would end up only as tall as
  // A itself, leaving ~0px of scroll "runway" for the sticky mechanic to ever
  // visibly pin against. Fixed the same way as before: an extra unstyled
  // wrapper around A, whose height is set (via JS) to A's true, unclipped
  // total height (tab + B's real content height) - `scrollHeight` reports
  // that even while B is visually clipped by its own overflow/max-height.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const lastId = sections[sections.length - 1].id;
    const apply = () => {
      const top = headerH() + NAV_GAP;
      if (boxRef.current) {
        if (mq.matches && contentRef.current) {
          boxRef.current.style.top = `${top}px`;
          const stripH = stripRef.current ? stripRef.current.offsetHeight : 0;
          contentRef.current.style.maxHeight = `calc(100dvh - ${top}px - ${NAV_GAP}px - ${stripH}px)`;
          // Reset to the natural (Tailwind pb-8) padding first, so the shortfall
          // below is measured against the real content height, not a stale
          // extra-padding value from a previous run of this same effect.
          contentRef.current.style.paddingBottom = '';
          // The LAST section needs to be scrollable all the way up to the top
          // of B - without extra room, B's max scrollTop gets reached before a
          // short trailing section (e.g. an empty Reviews state) ever clears
          // it, so it can never become the scrollspy's active tab. Add exactly
          // the missing amount, not a flat guess - a full extra viewport of
          // blank padding looked broken.
          const lastEl = secRefs.current[lastId];
          const maxScrollable = contentRef.current.scrollHeight - contentRef.current.clientHeight;
          const neededForLast = lastEl ? lastEl.offsetTop - 8 : 0;
          const shortfall = Math.max(0, neededForLast - maxScrollable);
          if (shortfall > 0) contentRef.current.style.paddingBottom = `calc(2rem + ${shortfall}px)`;
          // Read AFTER settling the padding above, since scrollHeight includes it.
          if (wrapRef.current) wrapRef.current.style.height = `${stripH + contentRef.current.scrollHeight}px`;
        } else {
          boxRef.current.style.top = '';
          if (contentRef.current) {
            contentRef.current.style.maxHeight = '';
            contentRef.current.style.paddingBottom = '';
          }
          if (wrapRef.current) wrapRef.current.style.height = '';
        }
      }
    };
    apply();
    window.addEventListener('resize', apply);
    mq.addEventListener('change', apply);
    return () => {
      window.removeEventListener('resize', apply);
      mq.removeEventListener('change', apply);
    };
  }, []);

  // Scrollspy: highlight the tab whose section is currently under the strip.
  // getBoundingClientRect() is always viewport-relative regardless of which
  // element actually scrolled, so the same line/comparison works whether the
  // page scrolled (mobile) or content scrolled internally (desktop) - just
  // listen on both, the one that isn't the active scroller never fires.
  useEffect(() => {
    const content = contentRef.current;
    const ids = sections.map((s) => s.id);
    const onScroll = () => {
      const line = (contentRef.current ? contentRef.current.getBoundingClientRect().top : 0) + 12;
      let cur = ids[0];
      ids.forEach((id) => {
        const el = secRefs.current[id];
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (content) content.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (content) content.removeEventListener('scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (id) => {
    const el = secRefs.current[id];
    if (!el) return;
    if (window.matchMedia(DESKTOP_MQ).matches && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
    } else {
      const stripH = stripRef.current ? stripRef.current.offsetHeight : 0;
      const top = el.getBoundingClientRect().top + window.scrollY - headerH() - NAV_GAP - stripH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Tailwind-native (full-portable): wrapper/strip/tab/section-heading + section
  // wrapper -> utilities. Section pakai [&+&] (jarak antar-section) + [&_.stops]/
  // [&_.stop] (context override buat engine .stop yg masih CSS). .info__list*
  // (checklist bullet, kosakata konten) tetep shared - dikonversi di pass-nya.
  const SEC = 'pt-6 [scroll-margin-top:120px] [&+&]:mt-6 [&+&]:[border-top:1px_solid_var(--line)] [&_.stops]:p-0 [&_.stop]:max-w-none';
  const tab = (on) =>
    `font-body text-small bg-transparent [border-top:0] [border-left:0] [border-right:0] py-[0.9rem] px-[0.15rem] mb-[-1px] whitespace-nowrap cursor-pointer transition-[color,border-color] duration-[var(--dur-fast)] ease-[ease] ${on ? '[border-bottom:2px_solid_var(--color-gold)] font-semibold text-green' : '[border-bottom:2px_solid_transparent] font-medium text-muted hover:text-green'}`;
  return (
    <div ref={wrapRef} className="min-[769px]:relative">
    <div
      ref={boxRef}
      className="max-w-[1000px] mt-5 mx-auto px-6 bg-white rounded-xl [box-shadow:inset_0_8px_11px_-10px_rgba(34,32,28,0.3),inset_7px_0_9px_-9px_rgba(34,32,28,0.1),inset_-7px_0_9px_-9px_rgba(34,32,28,0.1)] max-[560px]:mt-4 max-[560px]:px-4 max-[560px]:rounded-lg min-[769px]:sticky"
    >
      <div className="flex gap-[1.6rem] [border-bottom:1px_solid_var(--line)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-white max-[560px]:gap-[1.1rem]" ref={stripRef} role="tablist" aria-label="Jump to section">
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
      <div
        ref={contentRef}
        className="pb-8 max-[560px]:pb-[1.6rem] min-[769px]:relative min-[769px]:overflow-y-auto min-[769px]:[scrollbar-width:none] min-[769px]:[&::-webkit-scrollbar]:hidden"
      >
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
    </div>
  );
}
