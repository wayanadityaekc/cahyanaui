'use client';

import { useState, useEffect } from 'react';
import CatDropdown, { CAT_ITEM, CAT_ITEM_TAP } from '@/components/ui/CatDropdown';
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
  { id: 'cancellation', label: 'Cancellation & Refund Policy' },
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

// Sama lebar dengan ContactSection (bukan dibatasin --container-read lagi, Sep 2026
// Wayan: biar padding kanan semua tab konsisten - Contact ngisi penuh lebar kolom,
// yang lain jangan malah lebih sempit).
const BODY_TEXT = '[&_p]:leading-[var(--lh-body)] [&_p]:m-0 [&_p]:mb-4 [&_p]:text-ink [&_p]:text-body';

function LegalBody({ data }) {
  return (
    <div className={BODY_TEXT}>
      <h1 className="font-head text-h2 font-bold text-gold mb-4">{data.title}</h1>
      <Prose blocks={data.body} headingVariant="company" />
    </div>
  );
}

// FAQ grouped by category (Sep 2026, Wayan: tambah pertanyaan + kategori buat SEO).
// FAQ.cat udah urut per kelompok di faq.js, jadi ngambil kategori unik dalam
// urutan kemunculan cukup buat bikin heading per grup - gak perlu sort/data baru.
const FAQ_CATS = [...new Set(FAQ.map((item) => item.cat))];

function FAQBody() {
  return (
    <div className={BODY_TEXT}>
      <h1 className="font-head text-h2 font-bold text-gold mb-4">Frequently Asked Questions</h1>
      {FAQ_CATS.map((cat) => (
        <div className="mb-8" key={cat}>
          <h2 className="m-0 mb-3 font-head text-h3 font-semibold text-green">{cat}</h2>
          {FAQ.filter((item) => item.cat === cat).map((item, i) => (
            <details className="mb-3 border border-line rounded-md p-4" key={i}>
              <summary className="font-body text-[1rem] font-semibold text-green cursor-pointer">{item.q}</summary>
              <div className="mt-2 [&_p]:text-body [&_p]:leading-[var(--lh-body)]" dangerouslySetInnerHTML={{ __html: item.a }} />
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function OurCompany() {
  const [tab, setTab] = useState('about');
  const active = TABS.find((t) => t.id === tab);

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
    <div className="max-w-[1180px] mx-auto px-[var(--container-x)] pt-[calc(var(--header-h-max,104px)+1.9rem)] pb-[var(--space-5)]">
      <div className="flex gap-10 items-start max-[992px]:flex-col max-[992px]:gap-3">
        {/* Desktop: plain sticky full-height sidebar. */}
        <nav
          className="max-[992px]:hidden flex flex-col gap-[var(--space-2)] flex-none w-[200px] sticky top-[var(--header-h,104px)] self-start h-[calc(100vh-var(--header-h,104px))] overflow-y-auto pr-[var(--space-3)] border-r border-line"
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

        {/* Mobile: the active tab, tapped to reach the rest. Shared with the guide
            articles' category nav, and floating rather than inline - see CatDropdown. */}
        <CatDropdown
          className="min-[993px]:hidden w-full pb-[var(--space-1)] border-b border-line"
          label={active.label}
          ariaLabel="Our company"
        >
          {(close) =>
            TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-current={tab === t.id || undefined}
                onClick={() => { goTo(t.id); close(); }}
                className={`p-0 bg-transparent border-none cursor-pointer ${CAT_ITEM_TAP(tab === t.id)}`}
              >
                {t.label}
              </button>
            ))
          }
        </CatDropdown>

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
