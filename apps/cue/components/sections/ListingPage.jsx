'use client';
import { BTN_SM } from '@/components/ui/btnClasses';

import { Car, Check, MapPin, Search, UserRound, X } from 'lucide-react';
import { INFO_SECTION_DETAIL, INFO_CARD } from '@/components/ui/infoClasses';
import InfoFacts from '@/components/ui/InfoFacts';
import InfoBoxes, { InfoBox, InfoBoxList } from '@/components/ui/InfoBoxes';
import { SUBHERO_TITLE } from '@/components/ui/subheroClasses';
import { useState, useRef, useEffect } from 'react';
import ListingRow from '@/components/cards/ListingRow';
import SectionSwitcher from '@/components/ui/SectionSwitcher';
import ProgramPromoSlider from '@/components/sections/ProgramPromoSlider';
import { CATSEC, LROW_LIST } from '@/components/ui/listingClasses';
import { isHiddenTour } from '@/lib/routes';
import { SECTION_TITLE } from '@/components/ui/sectionTitle';

const SearchIcon = () => <Search strokeWidth={1.8} aria-hidden="true" />;
const CloseIcon = () => <X aria-hidden="true" />;
const CarIcon = () => <Car strokeWidth={1.7} aria-hidden="true" />;
const UserIcon = () => <UserRound strokeWidth={1.7} aria-hidden="true" />;
const CheckIcon = () => <Check aria-hidden="true" />;
const PinIcon = () => <MapPin strokeWidth={1.7} aria-hidden="true" />;

// Search placeholder noun per listing page.
const NOUN = { tours: 'tours', activities: 'experiences', destinations: 'destinations' };

export default function ListingPage({ data }) {
  const { heroBg, title, sub, listTitle, sectionId, chips, cats, info } = data;
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('all'); // 'all' | category id (desktop dim filter)

  const q = query.trim().toLowerCase();
  const noun = NOUN[sectionId] || 'programs';

  // One flat grid: every card tagged with its category id; the first card of each
  // category carries an anchor id so the mobile switcher can scroll to it.
  const allCards = [];
  cats.forEach((cat) => {
    // Parked tours drop out of the grid entirely, so the anchor has to land on
    // whichever card is shown first, not on cat.cards[0].
    const shown = cat.cards.filter((card) => !isHiddenTour(card.href));
    shown.forEach((card, i) => allCards.push({ card, catId: cat.id, anchor: i === 0 ? cat.id : null }));
  });
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
    <div className="tourprog pb-20">
      {/* Hero = gaya split putih kayak halaman attraction (.tour-hero): teks kiri,
          foto kanan di desktop; foto atas + sheet putih di mobile. Search di bawah
          judul (desktop) / mengambang di foto (mobile) - memfilter kartu di bawah. */}
      {/* The mobile hero-photo gradient (was `.tourprog .tour-hero__image::after`) is
          now a [.tourprog_&]: scoped after: utility on the image - it only paints when
          an ancestor .tourprog exists (always true here). `tourprog` stays as that hook
          marker; tour-hero markers carry no CSS anymore. */}
      <section className="min-[769px]:grid min-[769px]:grid-cols-[45%_55%] min-[769px]:items-stretch min-[769px]:min-h-[62vh] min-[769px]:pt-[6.5rem]">
        <div
          className="min-h-[48vh] bg-green bg-cover bg-center min-[769px]:order-1 min-[769px]:min-h-0 max-[768px]:[.tourprog_&]:relative max-[768px]:[.tourprog_&]:after:content-[''] max-[768px]:[.tourprog_&]:after:absolute max-[768px]:[.tourprog_&]:after:inset-0 max-[768px]:[.tourprog_&]:after:[background:linear-gradient(to_bottom,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0)_32%,rgba(0,0,0,0.58)_100%)]"
          style={{ backgroundImage: `url(/assets/images/${heroBg})` }}
        />
        <div className="relative z-[1] -mt-7 pt-9 px-6 pb-3 bg-white rounded-t-[var(--r-xl)] flex flex-col items-center text-center
          min-[769px]:mt-0 min-[769px]:pt-12 min-[769px]:pr-12 min-[769px]:pb-12 min-[769px]:pl-[max(1.5rem,calc((100vw-1280px)/2))]
          min-[769px]:bg-transparent min-[769px]:rounded-none min-[769px]:justify-center min-[769px]:items-start min-[769px]:text-left">
          {!q && <h1 className={`${SUBHERO_TITLE} mb-3`}>{title}</h1>}
          {/* was .tour-hero__desc (CSS dihapus, migrasi Fase 2) -> utilities inline */}
          {!q && <p className="max-w-[460px] m-0 text-[#3d3d3d]">{sub}</p>}
          <div className="flex items-center gap-[6px] w-full max-w-[430px] mt-6 h-[2.9rem] pl-[18px] pr-[6px] bg-white [border:1px_solid_var(--line)] rounded-md [box-shadow:var(--shadow-sm)] max-[768px]:absolute max-[768px]:left-[1.2rem] max-[768px]:right-[1.2rem] max-[768px]:top-[-3.9rem] max-[768px]:w-auto max-[768px]:z-[4] max-[768px]:mt-0 max-[768px]:max-w-none max-[768px]:[box-shadow:var(--shadow-lg)]">
            <input
              type="search"
              className="flex-1 min-w-0 [border:0] bg-transparent outline-none [font-family:inherit] text-field text-ink placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-decoration]:hidden"
              placeholder={`Search ${noun}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={`Search ${noun}`}
            />
            <button
              type="button"
              className="flex-none w-[2.1rem] h-[2.1rem] flex items-center justify-center [border:0] rounded-[50%] bg-cta text-white cursor-pointer [transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d [&_svg]:w-4 [&_svg]:h-4"
              aria-label={q ? 'Clear search' : 'Search'}
              onClick={() => q && setQuery('')}
            >
              {q ? <CloseIcon /> : <SearchIcon />}
            </button>
          </div>
          {!q && (
            <ul className="list-none mt-6 p-0 flex flex-col gap-[0.7rem] text-left self-start [&>li]:flex [&>li]:items-center [&>li]:gap-[10px] [&>li]:text-[0.82rem] [&>li]:font-medium [&>li]:leading-[1.3] [&>li]:whitespace-nowrap [&>li]:text-ink [&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:text-cta [&_svg]:flex-none">
              <li><CarIcon />Fixed price per car (standard or exclusive)</li>
              <li><UserIcon />Private driver, just for your group</li>
              <li><PinIcon />Free pickup in the Ubud area</li>
              <li><CheckIcon />Free cancellation up to 24h before your tour</li>
            </ul>
          )}
          {!q && <a ref={browseRef} href={`#${sectionId}`} className={`inline-flex mt-4 ${BTN_SM} bg-cta text-white no-underline [transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d max-[768px]:flex max-[768px]:w-full max-[768px]:mt-[1.25rem]`}>All {noun}</a>}
        </div>
      </section>

      <section className="bg-white py-[var(--section-gap)] px-6" id={sectionId}>
        <div className="max-w-[1200px] mx-auto mb-[1.6rem] pt-2 text-center max-[768px]:hidden">
          <h2 className={`${SECTION_TITLE} !text-[1.5rem] max-[768px]:hidden`}>{listTitle}</h2>
        </div>

        {/* Floating sticky nav (bawah). DESKTOP: segmented tab (.zfilter) - pilih
            daerah => kartu di luar daerah diredupkan. MOBILE: satu pill di tengah
            (SectionSwitcher) - panah scroll ke section (tanpa redup). */}
        {showStickyNav && (
          <div className="fixed left-1/2 [transform:translateX(-50%)] bottom-[1.3rem] z-50 flex items-center gap-[4px] p-[6px] max-w-[calc(100vw-2rem)] bg-white [border:1px_solid_var(--line)] rounded-md [box-shadow:var(--shadow-xl)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[768px]:hidden" role="tablist" aria-label="Filter by area">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`[font-family:inherit] text-[0.78rem] font-semibold rounded-sm py-2 px-4 [border:0] cursor-pointer whitespace-nowrap [transition:color_var(--dur)_ease,background-color_var(--dur)_ease] ${zone === t.id ? 'bg-cta text-white' : 'bg-transparent text-muted hover:text-ink hover:bg-cream'}`}
                aria-pressed={zone === t.id}
                onClick={() => setZone(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        {showStickyNav && <SectionSwitcher zones={chips} />}

        <section className={CATSEC}>
          <div className={LROW_LIST}>
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
            <p className="mt-6 text-muted text-center text-[0.9rem]">No {noun} match &ldquo;{query.trim()}&rdquo;.</p>
          )}
        </section>
      </section>

      <ProgramPromoSlider />

      {info && (
        <section className={INFO_SECTION_DETAIL}>
          <div className={INFO_CARD}>
            <h2 className={SECTION_TITLE}>{info.title}</h2>
            {/* The same chips transfer and airport use - this page had its own
                copy of the old bordered grid, so the two drifted as soon as one
                changed (Sep 2026). One component now. */}
            <InfoFacts items={info.facts} />
            {/* Included / excluded = the SAME <InfoBoxes> charter, transfer, airport
                and the tour/destination pages use (Sep 2026, Wayan: "samain kayak
                styling charter"). The data still carries the legacy hint string
                (cls: "info__list--yes" / "--no"), so it is mapped to a variant
                here rather than rewritten across every listing. variant must go to
                BOTH the box and the list - see CLAUDE.md. */}
            <InfoBoxes>
              {info.cols.map((c) => {
                const variant = String(c.cls).includes('no') ? 'no' : 'yes';
                return (
                  <InfoBox key={c.title} title={c.title} variant={variant}>
                    <InfoBoxList items={c.items} variant={variant} />
                  </InfoBox>
                );
              })}
            </InfoBoxes>
          </div>
        </section>
      )}
    </div>
  );
}
