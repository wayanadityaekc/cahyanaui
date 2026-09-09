'use client';

import { useState, useRef, useEffect } from 'react';
import ListingRow from '@/components/cards/ListingRow';
import SectionSwitcher from '@/components/ui/SectionSwitcher';

// Tailwind-native (TW-A12, #333): .closing-band* -> utilities. `closing.buttons[].cls`
// in content/shared/listings.js still holds legacy-looking BEM strings
// ("closing-band__btn(--primary)?") - left untouched there (it's content data, not
// this component's job to rewrite) and read here only as a variant flag.
// py-9 = var(--section-gap) (36px, NOT the old rule's own 3rem/48px - that was
// already losing to the later, same-specificity global --section-gap rule, same
// gotcha as .arow in #328).
const CLOSING_BTN_BASE =
  'inline-block py-[0.8rem] px-[1.4rem] rounded-pill font-body font-semibold no-underline border transition-colors duration-200 ease-in-out';
const CLOSING_BTN = {
  primary: `${CLOSING_BTN_BASE} bg-cta border-cta text-white hover:bg-cta-d hover:border-cta-d`,
  default: `${CLOSING_BTN_BASE} bg-white border-green text-green hover:bg-green hover:text-white`,
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 11l1.4-4.2A2 2 0 0 1 8.3 5.4h7.4a2 2 0 0 1 1.9 1.4L19 11M4 11h16v5H4zM7 16v1.6M17 16v1.6" /><circle cx="7.5" cy="13.5" r="1" /><circle cx="16.5" cy="13.5" r="1" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

// Search placeholder noun per listing page.
const NOUN = { tours: 'tours', activities: 'experiences', destinations: 'destinations' };

export default function ListingPage({ data }) {
  const { heroBg, title, sub, listTitle, sectionId, chips, cats, closing, info } = data;
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('all'); // 'all' | category id (desktop dim filter)

  const q = query.trim().toLowerCase();
  const noun = NOUN[sectionId] || 'programs';

  // One flat grid: every card tagged with its category id; the first card of each
  // category carries an anchor id so the mobile switcher can scroll to it.
  const allCards = [];
  cats.forEach((cat) => cat.cards.forEach((card, i) => allCards.push({ card, catId: cat.id, anchor: i === 0 ? cat.id : null })));
  const shownCards = q ? allCards.filter((x) => x.card.name.toLowerCase().includes(q)) : allCards;
  const tabs = [{ id: 'all', label: listTitle }, ...chips];

  // The Browse-all button and the sticky bottom nav must not show together:
  // the sticky nav only appears once the hero (with its button) scrolls away.
  const browseRef = useRef(null);
  const [heroInView, setHeroInView] = useState(true);
  useEffect(() => {
    const el = browseRef.current;
    if (!el) { setHeroInView(true); return undefined; }
    const io = new IntersectionObserver(([e]) => setHeroInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [q]);
  const showStickyNav = !q && !heroInView;

  return (
    <div className="tourprog">
      {/* Hero = gaya split putih kayak halaman attraction (.tour-hero): teks kiri,
          foto kanan di desktop; foto atas + sheet putih di mobile. Search di bawah
          judul (desktop) / mengambang di foto (mobile) - memfilter kartu di bawah. */}
      {/* "tour-hero"/"tour-hero__image"/"tour-hero__body" kept as inert marker
          classNames (own styling below is Tailwind utilities) - needed by rules
          left untouched in style.css: `.tour-hero + .tour-layout--book` (sibling
          selector, n/a here but shared with AttractionPage/TourPage),
          `.tourprog .tour-hero__image::after` (this page's own mobile gradient),
          and `.tour-hero__body .subhero__title` (shared H1 tier, out of scope). */}
      <section className="tour-hero min-[769px]:grid min-[769px]:grid-cols-[45%_55%] min-[769px]:items-stretch min-[769px]:min-h-[62vh] min-[769px]:pt-[6.5rem]">
        <div
          className="tour-hero__image min-h-[48vh] bg-green bg-cover bg-center min-[769px]:order-1 min-[769px]:min-h-0"
          style={{ backgroundImage: `url(/assets/images/${heroBg})` }}
        />
        <div className="tour-hero__body relative z-[1] -mt-7 pt-9 px-6 pb-3 bg-white rounded-t-[var(--r-xl)] flex flex-col items-center text-center
          min-[769px]:mt-0 min-[769px]:pt-12 min-[769px]:pr-12 min-[769px]:pb-12 min-[769px]:pl-[max(1.5rem,calc((100vw-1280px)/2))]
          min-[769px]:bg-transparent min-[769px]:rounded-none min-[769px]:justify-center min-[769px]:items-start min-[769px]:text-left">
          {!q && <h1 className="subhero__title">{title}</h1>}
          {/* was .tour-hero__desc (CSS dihapus, migrasi Fase 2) -> utilities inline */}
          {!q && <p className="max-w-[460px] m-0 text-[#3d3d3d]">{sub}</p>}
          <div className="lsearch">
            <input
              type="search"
              className="lsearch__input"
              placeholder={`Search ${noun}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={`Search ${noun}`}
            />
            <button
              type="button"
              className="lsearch__btn"
              aria-label={q ? 'Clear search' : 'Search'}
              onClick={() => q && setQuery('')}
            >
              {q ? <CloseIcon /> : <SearchIcon />}
            </button>
          </div>
          {!q && (
            <ul className="lhero-usp">
              <li><CarIcon />Fixed price per car (standard or exclusive)</li>
              <li><UserIcon />Private driver, just for your group</li>
              <li><PinIcon />Free pickup in the Ubud area</li>
              <li><CheckIcon />Free cancellation up to 24h before your tour</li>
            </ul>
          )}
          {!q && <a ref={browseRef} href={`#${sectionId}`} className="lbrowse">Browse all {noun}</a>}
        </div>
      </section>

      <section className="experience experience--alt" id={sectionId}>
        <div className="lhead">
          <h2 className="section__title">{listTitle}</h2>
        </div>

        {/* Floating sticky nav (bawah). DESKTOP: segmented tab (.zfilter) - pilih
            daerah => kartu di luar daerah diredupkan. MOBILE: satu pill di tengah
            (SectionSwitcher) - panah scroll ke section (tanpa redup). */}
        {showStickyNav && (
          <div className="zfilter" role="tablist" aria-label="Filter by area">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`zfilter__tab${zone === t.id ? ' is-active' : ''}`}
                aria-pressed={zone === t.id}
                onClick={() => setZone(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        {showStickyNav && <SectionSwitcher zones={chips} />}

        <section className="catsec">
          <div className="lrow-list">
            {shownCards.map(({ card, catId, anchor }) => {
              const dim = !q && zone !== 'all' && catId !== zone;
              return (
                <ListingRow
                  key={card.href + card.name}
                  {...card}
                  anchorId={anchor || undefined}
                  dim={dim}
                  onReset={() => setZone('all')}
                />
              );
            })}
          </div>
          {q && shownCards.length === 0 && (
            <p className="lsearch__empty">No {noun} match &ldquo;{query.trim()}&rdquo;.</p>
          )}
        </section>
      </section>

      {info && (
        <section className="info">
          <div className="info__container">
            <h2 className="section__title">{info.title}</h2>
            <div className="info__facts">
              {info.facts.map((f) => (
                <div className="info__fact" key={f.label}>
                  <span>{f.label}</span>
                  <strong>{f.value}</strong>
                </div>
              ))}
            </div>
            <div className="info__lists">
              {info.cols.map((c) => (
                <div className="info__col" key={c.title}>
                  <h3>{c.title}</h3>
                  <ul className={`info__list ${c.cls}`}>
                    {c.items.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {closing && (
        <section className="text-center py-9 px-6 bg-cream">
          <p className="mx-auto mb-[1.3rem] max-w-[640px] text-green">{closing.text}</p>
          <div className="flex gap-[0.8rem] justify-center flex-wrap">
            {closing.buttons.map((b) => (
              <a href={b.href} className={b.cls.includes('--primary') ? CLOSING_BTN.primary : CLOSING_BTN.default} key={b.href}>{b.text}</a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
