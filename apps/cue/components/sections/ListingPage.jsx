'use client';
import { BTN_SM } from '@/components/ui/btnClasses';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { crumbsFor } from '@/lib/crumbs';

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
import { SECTION_TITLE, ST_LEFT } from '@/components/ui/sectionTitle';

function SearchIcon() { return <Search strokeWidth={1.8} aria-hidden="true" />; }
function CloseIcon() { return <X aria-hidden="true" />; }
function CarIcon() { return <Car strokeWidth={1.7} aria-hidden="true" />; }
function UserIcon() { return <UserRound strokeWidth={1.7} aria-hidden="true" />; }
function CheckIcon() { return <Check aria-hidden="true" />; }
function PinIcon() { return <MapPin strokeWidth={1.7} aria-hidden="true" />; }

// Search placeholder noun per listing page.
const NOUN = { tours: 'tours', activities: 'experiences', destinations: 'destinations' };

export default function ListingPage({ data, page }) {
  const { heroBg, title, sub, listTitle, sectionId, chips, cats, info } = data;
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('all'); // 'all' | category id (desktop dim filter)

  const term = query.trim().toLowerCase();
  const noun = NOUN[sectionId] || 'programs';

  // One flat grid; the first shown card of each category carries the anchor id for the switcher.
  const allCards = [];
  cats.forEach((cat) => {
    // Anchor goes on the first card shown, since parked tours are dropped.
    const shown = cat.cards.filter((card) => !isHiddenTour(card.href));
    shown.forEach((card, i) => allCards.push({ card, catId: cat.id, anchor: i === 0 ? cat.id : null }));
  });
  const shownCards = term ? allCards.filter((x) => x.card.name.toLowerCase().includes(term)) : allCards;
  const tabs = [{ id: 'all', label: listTitle }, ...chips];

  // Sticky nav only shows once the hero's Browse-all button scrolls away, so they never show together.
  const browseRef = useRef(null);
  const [heroInView, setHeroInView] = useState(true);
  useEffect(() => {
    const browse = browseRef.current;
    if (!browse) { setHeroInView(true); return undefined; }
    const observer = new IntersectionObserver(([e]) => setHeroInView(e.isIntersecting));
    observer.observe(browse);
    return () => observer.disconnect();
  }, [term]);
  const showStickyNav = !term && !heroInView;

  return (
    <div className="tourprog pb-20">
      {/* Split hero: text left and photo right on desktop, photo over a white sheet on mobile; search filters cards. */}
      {/* Mobile photo gradient is a [.tourprog_&]:after utility; keep the `tourprog` ancestor as its hook. */}
      <section className="min-[769px]:grid min-[769px]:grid-cols-[45%_55%] min-[769px]:items-stretch min-[769px]:min-h-[62vh] min-[769px]:pt-[6.5rem]">
        <div
          className="min-h-[48vh] bg-green bg-cover bg-center min-[769px]:order-1 min-[769px]:min-h-0 max-[768px]:[.tourprog_&]:relative max-[768px]:[.tourprog_&]:after:content-[''] max-[768px]:[.tourprog_&]:after:absolute max-[768px]:[.tourprog_&]:after:inset-0 max-[768px]:[.tourprog_&]:after:[background:linear-gradient(to_bottom,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0)_32%,rgba(0,0,0,0.58)_100%)]"
          style={{ backgroundImage: `url(/assets/images/${heroBg})` }}
        />
        <div className="relative z-[1] -mt-7 pt-9 px-[var(--container-x)] pb-3 bg-white rounded-t-[var(--r-xl)] flex flex-col items-start text-left
          min-[769px]:mt-0 min-[769px]:pt-12 min-[769px]:pr-12 min-[769px]:pb-12 min-[769px]:pl-[max(var(--container-x),calc(50vw_-_var(--container)/2_+_var(--container-x)))]
          min-[769px]:bg-transparent min-[769px]:rounded-none min-[769px]:justify-center">
          {/* Visible breadcrumb matching the JSON-LD trail; hidden while a search is open, like the title. */}
          {!term && <Breadcrumb items={crumbsFor(page)} className="mb-2 self-start" />}
          {!term && <h1 className={`${SUBHERO_TITLE} mb-3`}>{title}</h1>}
          {/* was .tour-hero__desc (CSS dihapus, migrasi Fase 2) -> utilities inline */}
          {!term && <p className="max-w-[460px] m-0 text-[#3d3d3d]">{sub}</p>}
          <div className="flex items-center gap-[6px] w-full max-w-[430px] mt-6 h-[2.9rem] pl-[18px] pr-[6px] bg-white [border:1px_solid_var(--line)] rounded-md max-[768px]:absolute max-[768px]:left-[1.2rem] max-[768px]:right-[1.2rem] max-[768px]:top-[-3.9rem] max-[768px]:w-auto max-[768px]:z-[4] max-[768px]:mt-0 max-[768px]:max-w-none">
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
              aria-label={term ? 'Clear search' : 'Search'}
              onClick={() => term && setQuery('')}
            >
              {term ? <CloseIcon /> : <SearchIcon />}
            </button>
          </div>
          {!term && (
            <ul className="list-none mt-6 p-0 flex flex-col gap-[0.7rem] text-left self-start [&>li]:flex [&>li]:items-center [&>li]:gap-[10px] [&>li]:text-[0.82rem] [&>li]:font-medium [&>li]:leading-[1.3] [&>li]:whitespace-nowrap [&>li]:text-ink [&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:text-cta [&_svg]:flex-none">
              <li><CarIcon />Fixed price per car (standard or exclusive)</li>
              <li><UserIcon />Private driver, just for your group</li>
              <li><PinIcon />Free pickup in the Ubud area</li>
              <li><CheckIcon />Free cancellation up to 24h before your tour</li>
            </ul>
          )}
          {!term && <a ref={browseRef} href={`#${sectionId}`} className={`inline-flex mt-4 ${BTN_SM} bg-cta text-white no-underline [transition:background-color_var(--dur)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d max-[768px]:flex max-[768px]:w-full max-[768px]:mt-[1.25rem]`}>All {noun}</a>}
        </div>
      </section>

      <section className="bg-white py-[var(--section-gap)] px-[var(--container-x)]" id={sectionId}>
        <div className="max-w-[calc(var(--container)-2*var(--container-x))] mx-auto mb-[1.6rem] pt-2 text-left max-[768px]:hidden">
          <h2 className={`${SECTION_TITLE} ${ST_LEFT} !text-[1.5rem] max-[768px]:hidden`}>{listTitle}</h2>
        </div>

        {/* Desktop floating area tabs that dim cards outside the chosen area; phones get SectionSwitcher instead. */}
        {showStickyNav && (
          <div className="fixed left-1/2 [transform:translateX(-50%)] bottom-[1.3rem] z-50 flex items-center gap-[4px] p-[6px] max-w-[calc(100vw-2rem)] bg-white [border:1px_solid_var(--line)] rounded-md overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[768px]:hidden" role="tablist" aria-label="Filter by area">
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
              const dim = !term && zone !== 'all' && catId !== zone;
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
          {term && shownCards.length === 0 && (
            <p className="mt-6 text-muted text-center text-[0.9rem]">No {noun} match &ldquo;{query.trim()}&rdquo;.</p>
          )}
        </section>
      </section>

      <ProgramPromoSlider />

      {info && (
        <section className={INFO_SECTION_DETAIL}>
          <div className={INFO_CARD}>
            <h2 className={`${SECTION_TITLE} ${ST_LEFT}`}>{info.title}</h2>
            {/* Same fact chips as transfer and airport. */}
            <InfoFacts items={info.facts} />
            {/* Shared InfoBoxes; legacy cls maps to a variant, which must go to BOTH InfoBox and InfoBoxList. */}
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
