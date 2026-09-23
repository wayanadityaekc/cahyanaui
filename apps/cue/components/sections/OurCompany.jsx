'use client';

import { useState, useEffect } from 'react';
import { Building2, Mail, HelpCircle, FileText, Shield, XCircle, MessageCircle, ChevronDown } from 'lucide-react';
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
      {/* Pattern A: the trail sits above the heading, not under it. It arrives as
          the first prose block, so it is pulled out here rather than rendered in
          place. */}
      <Prose blocks={data.body.filter((b) => b.type === 'crumb')} headingVariant="company" />
      <h1 className="font-head text-h2 font-bold text-gold mb-4">{data.title}</h1>
      <Prose blocks={data.body.filter((b) => b.type !== 'crumb')} headingVariant="company" />
    </div>
  );
}

// FAQ grouped by category (Sep 2026, Wayan: tambah pertanyaan + kategori buat SEO).
// FAQ.cat udah urut per kelompok di faq.js, jadi ngambil kategori unik dalam
// urutan kemunculan cukup buat bikin heading per grup - gak perlu sort/data baru.
const FAQ_CATS = [...new Set(FAQ.map((item) => item.cat))];

// Native <details>, deliberately - not an accordion library (Sep 2026, Wayan sent a
// React Aria accordion snippet and asked how it compared). Everything that snippet
// adds over <details> is either free here or not worth a dependency: one-open-at-a-time
// is the HTML `name` attribute, the chevron and the sizes are CSS. What <details>
// gives back is what a FAQ page actually needs - it works before hydration, and
// browser find-in-page opens a collapsed answer, which a JS accordion hides from
// Ctrl+F. The two things we give up are an open/close animation (native only
// animates in Chrome) and arrow-key movement between questions.
//
// Typography is all tokens, no raw sizes (Wayan: "typography ngikutin global"):
// category = the site's group-label (same as the rail's "OUR COMPANY"), question =
// --fs-h3 at 600, answer = --fs-body. Three tiers, each already used elsewhere.
const FAQ_CAT = 'font-body text-label font-medium tracking-[0.14em] uppercase text-muted m-0 mb-[var(--space-1)]';

// list-none + the webkit rule kill the browser's default triangle; it was the one
// place on the site not using a Lucide chevron.
const FAQ_Q =
  'list-none [&::-webkit-details-marker]:hidden flex items-center gap-[var(--space-2)] ' +
  'cursor-pointer py-[0.85rem] font-body text-h3 font-semibold text-gold';

// Transition `rotate`, not `transform`: Tailwind v4 compiles rotate-180 to the
// standalone rotate property, so naming transform here would animate nothing.
// Same string CatDropdown uses.
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
            // One shared name across all four groups: opening any answer closes the
            // one before it, so the page never becomes a wall of open text.
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
