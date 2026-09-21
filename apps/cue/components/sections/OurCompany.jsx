'use client';

import { useState, useEffect } from 'react';
import { Building2, Mail, HelpCircle, FileText, Shield, XCircle, MessageCircle } from 'lucide-react';
import RailLayout from '@/components/ui/RailLayout';
import { RAIL_PAGE, RAIL_READ, RAIL_HELP, RAIL_HELP_TEXT, RAIL_HELP_BTN } from '@/components/ui/railClasses';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import AboutPage from './AboutPage';
import ContactSection from './ContactSection';
import { LEGAL } from '@/content/shared/legal';
import { FAQ } from '@/content/shared/faq';
import Prose from '@/components/prose/Prose';

// Every section stays in the DOM at once (good for crawlers - they read all six,
// not just the default) but only one is visible, via the `hidden` attribute.
// `split: true` starts the second group: the first three are about us, the last
// three are the small print, and six unbroken rows read as one long list.
const TABS = [
  { id: 'about', label: 'About Us', Icon: Building2 },
  { id: 'contact', label: 'Contact', Icon: Mail },
  { id: 'faq', label: 'FAQ', Icon: HelpCircle },
  { id: 'terms', label: 'Terms & Conditions', Icon: FileText, split: true },
  { id: 'privacy', label: 'Privacy Policy', Icon: Shield },
  { id: 'cancellation', label: 'Cancellation & Refund', Icon: XCircle },
];

function idFromHash() {
  if (typeof window === 'undefined') return null;
  const id = window.location.hash.replace('#', '');
  return TABS.some((t) => t.id === id) ? id : null;
}

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

function HelpCard({ className = '' }) {
  return (
    <div className={`${RAIL_HELP} ${className}`}>
      <p className={RAIL_HELP_TEXT}>Still not sure about something?</p>
      <a
        className={RAIL_HELP_BTN}
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener"
      >
        <MessageCircle strokeWidth={1.7} aria-hidden="true" />
        WhatsApp
      </a>
    </div>
  );
}

export default function OurCompany() {
  const [tab, setTab] = useState('about');
  // The phone has no room for a column, so the rail IS the first screen and a
  // section opens over it. false = the list. It must start the same on the
  // server and the client (this is a static export, one HTML for both widths),
  // so the hash is read in an effect, not in the initial value.
  const [reading, setReading] = useState(false);

  useEffect(() => {
    const applyHash = () => {
      const id = idFromHash();
      if (id) { setTab(id); setReading(true); }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const goTo = (id) => {
    setTab(id);
    setReading(true);
    window.history.replaceState(null, '', `#${id}`);
  };

  // Back drops the hash too, so a reload (or a shared link) lands on the list
  // rather than silently reopening the section the guest just left.
  const goBack = () => {
    setReading(false);
    window.history.replaceState(null, '', window.location.pathname);
  };

  return (
    <div className={RAIL_PAGE}>
      <RailLayout
        label="Our company"
        items={TABS}
        active={tab}
        onSelect={goTo}
        reading={reading}
        onBack={goBack}
        help={<HelpCard />}
      >
        <div className={RAIL_READ}>
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
      </RailLayout>
    </div>
  );
}
