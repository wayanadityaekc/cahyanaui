'use client';

import { useMemo, useState } from 'react';
import Slider from '@/components/ui/Slider';
import CardImage from '@/components/cards/CardImage';
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
                className="experience__card experience__card--more guide-home__card"
                aria-label={c.aria}
                style={{ backgroundImage: `url(/assets/images/${c.bg})` }}
              >
                <span className="experience__more-inner">
                  <span className="experience__more-arrow" aria-hidden="true">&rarr;</span>
                  <span className="experience__more-title">{c.title}</span>
                  <span className="experience__more-sub">{c.sub}</span>
                </span>
              </a>
            ) : (
              <a className="experience__card guide-home__card" data-cat={c.cat} href={c.href} key={c.href}>
                <CardImage img={c.img} alt={c.alt} width={c.w} height={c.hgt} />
                <div className="experience__body">
                  <span className="guide-home__tag">{c.tag}</span>
                  <h3 className="experience__name">{c.title}</h3>
                  <p className="experience__desc">{c.desc}</p>
                </div>
              </a>
            ),
          )}
        </Slider>
      </div>
    </section>
  );
}
