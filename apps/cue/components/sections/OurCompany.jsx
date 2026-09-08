'use client';

import { useState } from 'react';
import AboutPage from './AboutPage';
import ContactSection from './ContactSection';
import { LEGAL } from '@/content/shared/legal';

const TABS = [
  { id: 'about', label: 'About Us' },
  { id: 'terms', label: 'Terms', legal: 'terms-conditions' },
  { id: 'privacy', label: 'Privacy', legal: 'privacy-policy' },
  { id: 'cancellation', label: 'Cancellation', legal: 'cancellation-policy' },
  { id: 'contact', label: 'Contact' },
];

function LegalBody({ data }) {
  return (
    <section className="info">
      <div className="info__container guide-article">
        <h1 className="company-heading">{data.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: data.bodyHtml }} />
      </div>
    </section>
  );
}

export default function OurCompany() {
  const [tab, setTab] = useState('about');
  const activeIndex = TABS.findIndex((t) => t.id === tab);
  const active = TABS[activeIndex];

  const step = (dir) => {
    const next = (activeIndex + dir + TABS.length) % TABS.length;
    setTab(TABS[next].id);
  };

  return (
    <div className="company-page">
      <div className="company-layout">
        <nav className="company-nav" role="tablist" aria-label="Our company">
          <p className="company-nav__title">Our Company</p>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`company-nav__item${tab === t.id ? ' is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="company-main">
          {tab === 'about' && <AboutPage company />}
          {active.legal && <LegalBody data={LEGAL[active.legal]} />}
          {tab === 'contact' && <ContactSection />}
        </div>
      </div>

      <div className="company-tabbar">
        <button type="button" className="company-tabbar__arrow" aria-label="Previous section" onClick={() => step(-1)}>
          &lsaquo;
        </button>
        <span className="company-tabbar__label">{active.label}</span>
        <button type="button" className="company-tabbar__arrow" aria-label="Next section" onClick={() => step(1)}>
          &rsaquo;
        </button>
      </div>
    </div>
  );
}
