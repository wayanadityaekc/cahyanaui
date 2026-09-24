'use client';

import { Search } from 'lucide-react';
import { SECTION_TITLE, SECTION_TITLE_SUB, ST_LEFT } from '@/components/ui/sectionTitle';
import { GRID_SLIDER } from '@/components/ui/gridClasses';
import { useMemo, useState } from 'react';
import Slider from '@/components/ui/Slider';
import GuideCard from '@/components/cards/GuideCard';
import { CARD_FRAME } from '@/components/ui/cardClasses';
import { GUIDE_CARDS } from '@/content/shared/home';

export default function GuideHome() {
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return GUIDE_CARDS;
    return GUIDE_CARDS.filter(
      (c) => c.more || c.title.toLowerCase().includes(term) || (c.kw || '').includes(term),
    );
  }, [q]);

  return (
    <section className="px-[var(--container-x)]" id="guides" aria-labelledby="guide-home-title">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-left mb-7">
          <h2 className={`${SECTION_TITLE} ${ST_LEFT}`} id="guide-home-title">Guides &amp; Information</h2>
          <p className="max-w-[600px] mt-[0.6rem] text-left text-muted text-body leading-[var(--lh-body)]">Free local guides to Bali - search a topic, or swipe through below.</p>
        </div>

        <div className="relative max-w-[560px] mt-6 mx-auto mb-[1.7rem]">
          <div className="flex items-center gap-[0.7rem] py-[0.85rem] px-[1.1rem] [border:1.5px_solid_var(--color-gold)] rounded-lg bg-white [box-shadow:var(--shadow-md)]">
            <Search className="w-[var(--icon-md)] h-[var(--icon-md)] shrink-0 text-gold-d" aria-hidden="true" />
            <input
              type="text"
              className="flex-1 border-none border-current [outline:none] bg-transparent font-body text-field text-green placeholder:text-muted"
              placeholder="Search"
              aria-label="Search guides"
              autoComplete="off"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white [border:1px_solid_var(--line)] rounded-lg [box-shadow:0_16px_40px_rgba(31,61,43,0.14)] overflow-hidden z-[6] [&[hidden]]:hidden" role="listbox" hidden />
        </div>

        <Slider gridClassName={GRID_SLIDER}>
          {shown.map((c) =>
            c.more ? (
              <a
                key={c.href}
                href={c.href}
                className={`${CARD_FRAME} group flex flex-col items-center justify-center min-h-[260px] bg-cover bg-center after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(rgba(40,36,30,0.55),rgba(40,36,30,0.72))]`}
                aria-label={c.aria}
                style={{ backgroundImage: `url(/assets/images/${c.bg})`, backgroundColor: 'var(--color-green)' }}
              >
                <span className="relative z-[1] flex flex-col items-center gap-[0.9rem] p-8 text-center">
                  <span className="flex items-center justify-center w-14 h-14 border-2 border-[rgba(255,255,255,0.9)] rounded-[50%] text-[1.5rem] transition-[background-color,color,scale] duration-200 ease-[ease] group-hover:bg-white group-hover:text-green" aria-hidden="true">&rarr;</span>
                  <span className="font-semibold text-h2">{c.title}</span>
                  <span className="text-small opacity-90">{c.sub}</span>
                </span>
              </a>
            ) : (
              <GuideCard key={c.href} href={c.href} img={c.img} alt={c.alt} title={c.title} tag={c.tag} cat={c.cat} w={c.w} hgt={c.hgt} />
            ),
          )}
        </Slider>
      </div>
    </section>
  );
}
