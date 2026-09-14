'use client';

import { INFO_CONTAINER_ARTICLE } from '@/components/ui/infoClasses';
import { useState, useEffect } from 'react';
import AboutPage from './AboutPage';
import ContactSection from './ContactSection';
import { LEGAL } from '@/content/shared/legal';
import { FAQ } from '@/content/shared/faq';
import Prose from '@/components/prose/Prose';

const TABS = [
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact' },
  { id: 'faq', label: 'FAQ' },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'cancellation', label: 'Cancellation Policy' },
];

// Rombak total (Sep 2026, Wayan): satu page, SEMUA section di DOM sekaligus
// (bagus buat SEO - crawler baca semuanya, bukan cuma tab default) tapi cuma
// satu yang keliatan lewat `hidden` (UA default [hidden]{display:none}) -
// pindah section WAJIB klik tab, gak bisa di-scroll nembus ke section lain
// (section yang hidden = 0 tinggi, gak ada apa-apa buat di-scroll ke sana).
// URL hash tetap disinkronkan (footer dkk link ke /our-company.html#faq)
// via `hashchange` + `history.replaceState`, sama seperti sebelumnya.
function idFromHash() {
  if (typeof window === 'undefined') return null;
  const id = window.location.hash.replace('#', '');
  return TABS.some((t) => t.id === id) ? id : null;
}

function LegalBody({ data }) {
  return (
    <div className={INFO_CONTAINER_ARTICLE}>
      <h1 className="font-head text-h2 font-bold text-gold mb-4">{data.title}</h1>
      <Prose blocks={data.body} headingVariant="company" />
    </div>
  );
}

function FAQBody() {
  return (
    <div className={INFO_CONTAINER_ARTICLE}>
      <h1 className="font-head text-h2 font-bold text-gold mb-4">Frequently Asked Questions</h1>
      {FAQ.map((item, i) => (
        <details className="mb-3 border border-line rounded-md p-4" key={i}>
          <summary className="font-body text-[1rem] font-semibold text-green cursor-pointer">{item.q}</summary>
          <div className="mt-2 [&_p]:text-body [&_p]:leading-[var(--lh-body)]" dangerouslySetInnerHTML={{ __html: item.a }} />
        </details>
      ))}
    </div>
  );
}

export default function OurCompany() {
  const [tab, setTab] = useState('about');

  useEffect(() => {
    const applyHash = () => {
      const id = idFromHash();
      if (id) setTab(id);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const goTo = (id) => {
    setTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-[var(--container-x)] pt-[calc(var(--header-h,104px)+1.9rem)] pb-[var(--space-5)]">
      <div className="flex gap-10 items-start max-[992px]:flex-col max-[992px]:gap-6">
        {/* Desktop: plain sticky full-height sidebar. Mobile: plain wrapping row on top. */}
        <nav
          className="flex flex-col gap-3 flex-none w-[200px] sticky top-[var(--header-h,104px)] self-start h-[calc(100vh-var(--header-h,104px))] overflow-y-auto pr-6 border-r border-line max-[992px]:static max-[992px]:h-auto max-[992px]:w-auto max-[992px]:flex-row max-[992px]:flex-wrap max-[992px]:gap-x-6 max-[992px]:gap-y-2 max-[992px]:pr-0 max-[992px]:pb-4 max-[992px]:border-r-0 max-[992px]:border-b"
          role="tablist"
          aria-label="Our company"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => goTo(t.id)}
              className={`p-0 bg-transparent border-none cursor-pointer text-left font-body text-body ${tab === t.id ? 'font-semibold text-gold' : 'text-muted'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0">
          <section id="about" hidden={tab !== 'about'}>
            <AboutPage />
          </section>
          <section id="contact" hidden={tab !== 'contact'}>
            <ContactSection company />
          </section>
          <section id="faq" hidden={tab !== 'faq'}>
            <FAQBody />
          </section>
          <section id="terms" hidden={tab !== 'terms'}>
            <LegalBody data={LEGAL['terms-conditions']} />
          </section>
          <section id="privacy" hidden={tab !== 'privacy'}>
            <LegalBody data={LEGAL['privacy-policy']} />
          </section>
          <section id="cancellation" hidden={tab !== 'cancellation'}>
            <LegalBody data={LEGAL['cancellation-policy']} />
          </section>
        </div>
      </div>
    </div>
  );
}
