'use client';

import { useMemo, useState } from 'react';
import GuideCard from '@/components/cards/GuideCard';
import { GUIDE_HUB } from '@/content/shared/guide-hub';

export default function GuideHub() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const cats = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return GUIDE_HUB.cats;
    return GUIDE_HUB.cats
      .map((c) => ({ ...c, cards: c.cards.filter((x) => x.title.toLowerCase().includes(term) || (x.kw || '').includes(term)) }))
      .filter((c) => c.cards.length);
  }, [q]);

  return (
    <>
      <section className="subhero" style={{ backgroundImage: GUIDE_HUB.heroStyle.replace(/^background-image:\s*/, '').replace(/;$/, '') }}>
        <div className="subhero__content">
          <h1 className="subhero__title">{GUIDE_HUB.title}</h1>
          <p className="subhero__text">{GUIDE_HUB.text}</p>

          <div className="guide-hero-search">
            <div className="guide-cat-nav">
              <button className="guide-cat-toggle" type="button" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
                <svg className="gcat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Categories</span>
                <svg className="hs-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className="guide-cat-menu" hidden={!open}>
                {GUIDE_HUB.navItems.map((n) => (
                  <a href={`#${n.id}`} key={n.id} onClick={() => setOpen(false)}>
                    <span dangerouslySetInnerHTML={{ __html: n.icon }} />
                    {n.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="gsearch guide-hero-search__field">
              <div className="gsearch__box">
                <svg className="gsearch__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input type="text" className="gsearch__input" placeholder="Search" aria-label="Search guides" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="gsearch__sug" role="listbox" hidden />
            </div>
          </div>
        </div>
      </section>

      <section className={GUIDE_HUB.wrapClass}>
        {cats.map((c) => (
          <div className="guide-cat" id={c.id} key={c.id}>
            <h2 className="section__title guide-cat__title">{c.title}</h2>
            <div className="experience__grid experience__grid--slider guide-home__slider">
              {c.cards.map((card) => (
                <GuideCard key={card.href} href={card.href} img={card.img} alt={card.alt} title={card.title} tag={card.tag} cat={card.cat} w={card.w} hgt={card.hgt} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
