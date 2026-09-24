'use client';

import { useState, useEffect } from 'react';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import CatDropdown, { CAT_ITEM_TAP } from '@/components/ui/CatDropdown';
import Prose from '@/components/prose/Prose';
import { ABOUT, FAQ, PRIVACY } from '@/content/company';
import { CONTACT_EMAIL, CUE_LINK, WHATSAPP_LINK } from '@/lib/constants';
import { Button } from '@cahyana/ui';

// CUE's Our Company (components/sections/OurCompany.jsx there), reused shell and
// all: sticky text sidebar on desktop, the shared CatDropdown on mobile, and
// EVERY section in the DOM at once with only one visible via `hidden`.
//
// That last part is the bit worth not "simplifying" later. All the copy is in
// the markup so a crawler reads the whole page rather than just the default
// tab, but a hidden section is zero-height, so a guest cannot scroll from one
// into the next — moving between them is always a deliberate tap. The URL hash
// is kept in sync both ways so the footer's /our-company#faq style links land
// on the right one.
//
// FOUR TABS, NOT CUE'S SIX. Terms & Conditions and Cancellation & Refund are
// missing on purpose: they are commitments only Wayan can make, and inventing
// convincing ones would put promises on the site nobody agreed to. Add them to
// TABS and to content/company.js when the real policy exists.
const TABS = [
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact' },
  { id: 'faq', label: 'FAQ' },
  { id: 'privacy', label: 'Privacy Policy' },
];

function idFromHash() {
  if (typeof window === 'undefined') return null;
  const id = window.location.hash.replace('#', '');
  return TABS.some((t) => t.id === id) ? id : null;
}

// Same width as the contact panel rather than the narrower reading column, so
// the right-hand padding is the same on every tab.
const BODY_TEXT = '[&_p]:leading-[var(--lh-body)] [&_p]:m-0 [&_p]:mb-4 [&_p]:text-ink [&_p]:text-body';
const H1 = 'font-head text-h2 font-bold text-gold mb-4';

const FAQ_CARD = 'mb-3 border border-line rounded-md p-4';
const FAQ_Q = 'font-body text-[1rem] font-semibold text-green cursor-pointer';

const CONTACT_CARD = 'card p-6';
const CONTACT_H = 'flex items-center gap-2 text-h3 font-semibold text-gold';
const CONTACT_IC = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-gold';

function ContactBody() {
  return (
    <div className={BODY_TEXT}>
      <h1 className={H1}>Get in touch</h1>
      <p>One family, two villas, and the person who answers is the person who hosts you.</p>
      <div className="grid sm:grid-cols-3 gap-5 mt-6">
        <div className={CONTACT_CARD}>
          <h2 className={CONTACT_H}><MessageCircle className={CONTACT_IC} strokeWidth={1.8} aria-hidden="true" />WhatsApp</h2>
          <p className="text-small text-muted my-3">Fastest way to reach us. Dates, questions, or a photo of the road if you&rsquo;re lost.</p>
          <Button as="a" href={WHATSAPP_LINK} target="_blank" rel="noopener">Message us</Button>
        </div>
        <div className={CONTACT_CARD}>
          <h2 className={CONTACT_H}><Mail className={CONTACT_IC} strokeWidth={1.8} aria-hidden="true" />Email</h2>
          <p className="text-small text-muted my-3">Longer questions, long stays, or if you own a villa and want it managed.</p>
          <Button as="a" variant="ghost" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Button>
        </div>
        <div className={CONTACT_CARD}>
          <h2 className={CONTACT_H}><MapPin className={CONTACT_IC} strokeWidth={1.8} aria-hidden="true" />Where we are</h2>
          <p className="text-small text-muted my-3">North Ubud, Gianyar, Bali. Ten minutes from Ubud Palace, Monkey Forest and Tegallalang.</p>
          <Button as="a" variant="ghost" href={CUE_LINK} target="_blank" rel="noopener">Arrange a transfer</Button>
        </div>
      </div>
    </div>
  );
}

// Grouped by category, CUE's arrangement: the group headings are what make a
// long list scannable, and they come straight from the data's own order.
const FAQ_CATS = FAQ.map((g) => g.cat);

function FAQBody() {
  return (
    <div className={BODY_TEXT}>
      <h1 className={H1}>Frequently Asked Questions</h1>
      {FAQ.map((group) => (
        <div className="mb-8" key={group.cat}>
          <h2 className="m-0 mb-3 font-head text-h3 font-semibold text-green">{group.cat}</h2>
          {group.items.map(([q, a], i) => (
            <details className={FAQ_CARD} key={i}>
              <summary className={FAQ_Q}>{q}</summary>
              <div className="mt-2 [&_p]:text-body [&_p]:leading-[var(--lh-body)]"><p>{a}</p></div>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}

function ProseBody({ title, blocks }) {
  return (
    <div className={BODY_TEXT}>
      <h1 className={H1}>{title}</h1>
      <Prose blocks={blocks} headingVariant="company" />
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
    <div className="max-w-[1180px] mx-auto px-[var(--container-x)] pt-[1.9rem] pb-[var(--space-5)]">
      <div className="flex gap-10 items-start max-[992px]:flex-col max-[992px]:gap-3">
        {/* Desktop: plain sticky sidebar, no pills. */}
        <nav
          className="max-[992px]:hidden flex flex-col gap-[var(--space-2)] flex-none w-[200px] sticky top-[calc(var(--header-h,58px)+1.5rem)] self-start max-h-[calc(100vh-var(--header-h,58px)-3rem)] overflow-y-auto pr-[var(--space-3)] border-r border-line"
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

        {/* Mobile: the active tab, tapped to reach the rest. Same control the
            guide articles use, and floating rather than inline so opening it
            does not shove the section you were reading down the page. */}
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
            <ProseBody title="One family, two villas" blocks={ABOUT} />
          </section>
          <section id="contact" hidden={tab !== 'contact'}>
            <ContactBody />
          </section>
          <section id="faq" hidden={tab !== 'faq'}>
            <FAQBody />
          </section>
          <section id="privacy" hidden={tab !== 'privacy'}>
            <ProseBody title="Privacy Policy" blocks={PRIVACY} />
          </section>
        </div>
      </div>
    </div>
  );
}
