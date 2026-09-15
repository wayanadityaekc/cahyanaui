'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { Collapse } from '@/components/ui/Reveal';
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
  const [menuOpen, setMenuOpen] = useState(false);
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
    setMenuOpen(false);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-[var(--container-x)] pt-[calc(var(--header-h,104px)+1.9rem)] pb-[var(--space-5)]">
      <div className="flex gap-10 items-start max-[992px]:flex-col max-[992px]:gap-3">
        {/* Desktop: plain sticky full-height sidebar. */}
        <nav
          className="max-[992px]:hidden flex flex-col gap-3 flex-none w-[200px] sticky top-[var(--header-h,104px)] self-start h-[calc(100vh-var(--header-h,104px))] overflow-y-auto pr-6 border-r border-line"
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

        {/* Mobile: dropdown toggle showing the active tab, tap to expand the category list.
            Icon = 2x2 grid (categories), not the 3-line hamburger navbar already uses. */}
        <div className="min-[993px]:hidden w-full pb-3 border-b border-line">
          <button
            type="button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center justify-between w-full gap-2 p-0 bg-transparent border-none cursor-pointer font-body text-body font-semibold text-gold"
          >
            <span className="flex items-center gap-[0.6rem]">
              <LayoutGrid className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
              {active.label}
            </span>
            <ChevronDown className={`w-4 h-4 shrink-0 text-muted transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          <Collapse open={menuOpen}>
          <div className="mt-3 gap-1 flex flex-col" role="tablist" aria-label="Our company">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => goTo(t.id)}
                className={`p-0 py-[0.35rem] bg-transparent border-none cursor-pointer text-left font-body text-body ${tab === t.id ? 'font-semibold text-gold' : 'text-muted'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          </Collapse>
        </div>

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
