'use client';

import { useMemo, useState } from 'react';
import Slider from '@/components/ui/Slider';
import GuideCard from '@/components/cards/GuideCard';
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
    <section className="guide-home" id="guides" aria-labelledby="guide-home-title">
      <div className="guide-home__inner">
        <div className="guide-home__head">
          <h2 className="section__title" id="guide-home-title">Guides &amp; Information</h2>
          <p className="guide-home__sub">Free local guides to Bali - search a topic, or swipe through below.</p>
        </div>

        <div className="gsearch">
          <div className="gsearch__box">
            <svg className="gsearch__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              className="gsearch__input"
              placeholder="Search"
              aria-label="Search guides"
              autoComplete="off"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="gsearch__sug" role="listbox" hidden />
        </div>

        <Slider gridClassName="experience__grid experience__grid--slider guide-home__slider">
          {shown.map((c) =>
            c.more ? (
              <a
                key={c.href}
                href={c.href}
                className="experience__card group relative flex items-center justify-center min-h-[260px] no-underline text-white bg-cover bg-center after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(rgba(40,36,30,0.55),rgba(40,36,30,0.72))]"
                aria-label={c.aria}
                style={{ backgroundImage: `url(/assets/images/${c.bg})`, backgroundColor: 'var(--color-green)' }}
              >
                <span className="relative z-[1] flex flex-col items-center gap-[0.9rem] p-8 text-center">
                  <span className="flex items-center justify-center w-14 h-14 border-2 border-[rgba(255,255,255,0.9)] rounded-[50%] text-[1.5rem] transition-[background-color,color] duration-200 ease-[ease] group-hover:bg-white group-hover:text-green" aria-hidden="true">&rarr;</span>
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
