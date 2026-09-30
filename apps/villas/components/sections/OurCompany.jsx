'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import CatDropdown, { CAT_ITEM_TAP } from '@/components/ui/CatDropdown';
import Prose from '@/components/prose/Prose';
import { ABOUT, FAQ, PRIVACY } from '@/content/company';
import { CANCELLATION_BLOCKS, TERMS_BLOCKS } from '@/content/policies';
import { CONTACT_EMAIL, CUE_LINK, WHATSAPP_LINK } from '@/lib/constants';
import { Button, Card, Breadcrumb } from '@cahyana/ui';
import { COMPANY_CRUMBS } from '@/lib/crumbs';

// Every section stays in the DOM (one shown via `hidden`) so crawlers read it all; do not simplify to one mounted tab.
const TABS = [
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact' },
  { id: 'faq', label: 'FAQ' },
  { id: 'terms', label: 'Booking Terms' },
  { id: 'cancellation', label: 'Cancellation' },
  { id: 'privacy', label: 'Privacy Policy' },
];

function idFromHash() {
  if (typeof window === 'undefined') return null;
  const id = window.location.hash.replace('#', '');
  return TABS.some((item) => item.id === id) ? id : null;
}

// Same width as the contact panel, so the right-hand padding matches on every tab.
const BODY_TEXT = '[&_p]:leading-[var(--lh-body)] [&_p]:m-0 [&_p]:mb-4 [&_p]:text-ink [&_p]:text-body';
const HEADING = 'font-head text-h2 font-bold text-gold mb-4';

const FAQ_CARD = 'mb-3 border border-line p-4';
const FAQ_Q = 'font-body text-[1rem] font-semibold text-green cursor-pointer';


const CONTACT_H = 'flex items-center gap-2 text-h3 font-semibold text-gold';
const CONTACT_IC = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-gold';

function ContactBody() {
  return (
    <div className={BODY_TEXT}>
      <h1 className={HEADING}>Get in touch</h1>
      <p>One family, two villas, and the person who answers is the person who hosts you.</p>
      <div className="grid sm:grid-cols-3 gap-5 mt-6">
        <Card className="p-6">
          <h2 className={CONTACT_H}><MessageCircle className={CONTACT_IC} strokeWidth={1.8} aria-hidden="true" />WhatsApp</h2>
          <p className="text-small text-muted my-3">Fastest way to reach us. Dates, questions, or a photo of the road if you&rsquo;re lost.</p>
          <Button as="a" href={WHATSAPP_LINK} target="_blank" rel="noopener">Message us</Button>
        </Card>
        <Card className="p-6">
          <h2 className={CONTACT_H}><Mail className={CONTACT_IC} strokeWidth={1.8} aria-hidden="true" />Email</h2>
          <p className="text-small text-muted my-3">Longer questions, long stays, or if you own a villa and want it managed.</p>
          <Button as="a" variant="ghost" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Button>
        </Card>
        <Card className="p-6">
          <h2 className={CONTACT_H}><MapPin className={CONTACT_IC} strokeWidth={1.8} aria-hidden="true" />Where we are</h2>
          <p className="text-small text-muted my-3">North Ubud, Gianyar, Bali. Ten minutes from Ubud Palace, Monkey Forest and Tegallalang.</p>
          <Button as="a" variant="ghost" href={CUE_LINK} target="_blank" rel="noopener">Arrange a transfer</Button>
        </Card>
      </div>
    </div>
  );
}

// Grouped by category, CUE's arrangement: the group headings keep a long list scannable.
const FAQ_CATS = FAQ.map((group) => group.cat);

function FAQBody() {
  return (
    <div className={BODY_TEXT}>
      <h1 className={HEADING}>Frequently Asked Questions</h1>
      {FAQ.map((group) => (
        <div className="mb-8" key={group.cat}>
          <h2 className="m-0 mb-3 font-head text-h3 font-semibold text-green">{group.cat}</h2>
          {group.items.map(([question, answer], i) => (
            <details className={FAQ_CARD} key={i} name="faq">
              <summary className={FAQ_Q}>{question}</summary>
              <div className="mt-2 [&_p]:text-body [&_p]:leading-[var(--lh-body)]"><p>{answer}</p></div>
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
      <h1 className={HEADING}>{title}</h1>
      <Prose blocks={blocks} headingVariant="company" />
    </div>
  );
}

export default function OurCompany() {
  const [tab, setTab] = useState('about');
  const active = TABS.find((item) => item.id === tab);

  useEffect(() => {
    function applyHash() {
      const id = idFromHash();
      if (id) setTab(id);
    }
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  function goTo(id) {
    setTab(id);
    window.history.replaceState(null, '', `#${id}`);
  }

  return (
    <div className="max-w-[1180px] mx-auto px-[var(--container-x)] pt-[1.9rem] pb-[var(--space-5)]">
      <div className="flex gap-10 items-start max-[992px]:flex-col max-[992px]:gap-3">
        {/* Desktop: plain sticky sidebar, no pills. */}
        <nav
          className="max-[992px]:hidden flex flex-col gap-[var(--space-2)] flex-none w-[200px] sticky top-[calc(var(--header-h,58px)+1.5rem)] self-start max-h-[calc(100vh-var(--header-h,58px)-3rem)] overflow-y-auto pr-[var(--space-3)] border-r border-line"
          aria-label="Our company"
        >
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={tab === item.id || undefined}
              onClick={() => goTo(item.id)}
              className={`p-0 bg-transparent border-none cursor-pointer text-left font-body text-body ${tab === item.id ? 'font-semibold text-gold' : 'text-muted'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile: shared CatDropdown, floating so opening it does not push the section you are reading down. */}
        <CatDropdown
          className="min-[993px]:hidden w-full pb-[var(--space-1)] border-b border-line"
          label={active.label}
          ariaLabel="Our company"
        >
          {(close) =>
            TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={tab === item.id || undefined}
                onClick={() => { goTo(item.id); close(); }}
                className={`p-0 bg-transparent border-none cursor-pointer ${CAT_ITEM_TAP(tab === item.id)}`}
              >
                {item.label}
              </button>
            ))
          }
        </CatDropdown>

        <div className="flex-1 min-w-0">
          <Breadcrumb items={COMPANY_CRUMBS} linkAs={Link} className="mb-2" />
          <section id="about" hidden={tab !== 'about'}>
            <ProseBody title="One family, two villas" blocks={ABOUT} />
          </section>
          <section id="contact" hidden={tab !== 'contact'}>
            <ContactBody />
          </section>
          <section id="faq" hidden={tab !== 'faq'}>
            <FAQBody />
          </section>
          <section id="terms" hidden={tab !== 'terms'}>
            <ProseBody title="Booking Terms" blocks={TERMS_BLOCKS} />
          </section>
          <section id="cancellation" hidden={tab !== 'cancellation'}>
            <ProseBody title="Cancellation &amp; Refunds" blocks={CANCELLATION_BLOCKS} />
          </section>
          <section id="privacy" hidden={tab !== 'privacy'}>
            <ProseBody title="Privacy Policy" blocks={PRIVACY} />
          </section>
        </div>
      </div>
    </div>
  );
}
