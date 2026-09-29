'use client';

import { useState, useEffect } from 'react';
import { Building2, Mail, HelpCircle, FileText, Shield, XCircle, MessageCircle, ChevronDown } from 'lucide-react';
import RailLayout from '@/components/ui/RailLayout';
import { RAIL_PAGE_SCROLL, RAIL_READ, RAIL_HELP, RAIL_HELP_TEXT, RAIL_HELP_BTN } from '@/components/ui/railClasses';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { crumbsFor } from '@/lib/crumbs';
import AboutPage from './AboutPage';
import ContactSection from './ContactSection';
import { LEGAL } from '@/content/shared/legal';
import { FAQ } from '@/content/shared/faq';
import Prose from '@/components/prose/Prose';

// All six sections stay in the DOM for crawlers, one shown via `hidden`; `split` starts the legal group.
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
      {/* No in-content breadcrumb here: the rail header trail is the only one, and the crumb block in legal.json is filtered out. */}
      <h1 className="font-head text-h2 font-bold text-gold mb-4">{data.title}</h1>
      <Prose blocks={data.body.filter((b) => b.type !== 'crumb')} headingVariant="company" />
    </div>
  );
}

// FAQ categories in first-appearance order (faq.js is already grouped by category).
const FAQ_CATS = [...new Set(FAQ.map((item) => item.cat))];

// FAQ uses native <details> (no accordion library): works before hydration and Ctrl+F finds collapsed answers.
const FAQ_CAT = 'font-body text-label font-medium tracking-[0.14em] uppercase text-muted m-0 mb-[var(--space-1)]';

// list-none plus the webkit rule remove the browser's default disclosure triangle.
const FAQ_Q =
  'list-none [&::-webkit-details-marker]:hidden flex items-center gap-[var(--space-2)] ' +
  'cursor-pointer py-[0.85rem] font-body text-h3 font-semibold text-gold';

// Transition `rotate`, not `transform`: Tailwind v4 compiles rotate-180 to the standalone rotate property.
const FAQ_CHEV =
  'ml-auto w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-muted ' +
  'transition-[rotate] duration-[var(--dur)] ease-[var(--ease)] group-open:rotate-180';

const FAQ_ROW =
  'group [border-bottom:1px_solid_var(--line)] first-of-type:[border-top:1px_solid_var(--line)]';

const FAQ_A =
  'pb-[var(--space-2)] pr-[var(--space-4)] [&_p]:m-0 [&_p]:text-body ' +
  '[&_p]:leading-[var(--lh-body)] [&_p]:text-ink [&_a]:text-gold [&_a]:font-medium';

function FAQBody() {
  return (
    <div className={BODY_TEXT}>
      <h1 className="font-head text-h2 font-bold text-gold mb-4">Frequently Asked Questions</h1>
      {FAQ_CATS.map((cat) => (
        <div className="mb-[var(--space-4)]" key={cat}>
          <h2 className={FAQ_CAT}>{cat}</h2>
          {FAQ.filter((item) => item.cat === cat).map((item, i) => (
            // Shared name="faq" means opening one answer closes the previous one.
            <details className={FAQ_ROW} name="faq" key={i}>
              <summary className={FAQ_Q}>
                {item.q}
                <ChevronDown className={FAQ_CHEV} strokeWidth={1.7} aria-hidden="true" />
              </summary>
              <div className={FAQ_A} dangerouslySetInnerHTML={{ __html: item.a }} />
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
  // Phone view: false = section list; must start false and read the hash in an effect, or hydration breaks.
  const [reading, setReading] = useState(false);

  useEffect(() => {
    function applyHash() {
      const id = idFromHash();
      if (id) { setTab(id); setReading(true); }
    }
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  function goTo(id) {
    setTab(id);
    setReading(true);
    window.history.replaceState(null, '', `#${id}`);
  }

  // Back also clears the hash, so a reload or shared link lands on the list.
  function goBack() {
    setReading(false);
    window.history.replaceState(null, '', window.location.pathname);
  }

  return (
    <div className={RAIL_PAGE_SCROLL}>
      <RailLayout
        label="Our company"
        items={TABS}
        active={tab}
        onSelect={goTo}
        reading={reading}
        onBack={goBack}
        help={<HelpCard />}
        collapsible
        breadcrumb={crumbsFor('our-company')}
        scrollContent
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
