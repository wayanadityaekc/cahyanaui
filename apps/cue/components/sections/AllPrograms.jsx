'use client';

import { useState } from 'react';
import ExperienceCard from '@/components/cards/ExperienceCard';
import CharterPrice from '@/components/CharterPrice';
import { LISTINGS } from '@/content/shared/listings';
import { CHARTER_CARDS } from '@/content/shared/home';
import { TRANSFER } from '@/content/shared/transfer';

const TABS = [
  { id: 'tour', label: 'Tours' },
  { id: 'activities', label: 'Experiences' },
  { id: 'charter', label: 'Charter' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'destinations', label: 'Destinations' },
];

const flat = (key) => (LISTINGS[key] ? LISTINGS[key].cats : []).flatMap((c) => c.cards || []);

export default function AllPrograms() {
  const [tab, setTab] = useState('tour');
  const isCards = tab === 'tour' || tab === 'activities' || tab === 'destinations';

  return (
    <section className="aprog">
      <div className="aprog__inner">
        <div className="aprog__head">
          <h1 className="aprog__title">All Programs</h1>
          <p className="aprog__sub">
            Every way to explore Bali with Cahyana in one place - tours, experiences, charter,
            transfers, and single destinations. Tap a tab to compare.
          </p>
        </div>

        <div className="aprog__tabs" role="tablist" aria-label="Program categories">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`aprog__tab${tab === t.id ? ' is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="aprog__panel">
          {isCards && (
            <div className="aprog__grid">
              {flat(tab).map((c) => (
                <ExperienceCard key={c.href + c.name} {...c} width={c.w} height={c.hgt} />
              ))}
            </div>
          )}

          {tab === 'charter' && (
            <div className="aprog__grid">
              {CHARTER_CARDS.map((c) => (
                <a key={c.charter} className={c.cls} href={c.href}>
                  {c.badge && <span className="chcard__badge">{c.badge}</span>}
                  <h3 className="chcard__hours">{c.hours}</h3>
                  <p className="chcard__label">{c.label}</p>
                  <p className="chcard__price">
                    <span className="chcard__from">{c.from}</span>{' '}
                    <CharterPrice duration={c.charter} extra={c.extra} fallback={c.fallback} className="chcard__amt" />{' '}
                    <span className="chcard__unit">{c.unit}</span>
                  </p>
                  <p className="chcard__note">{c.note}</p>
                  <span className={c.btnCls}>{c.btnText}</span>
                </a>
              ))}
            </div>
          )}

          {tab === 'transfer' && (
            <div className="aprog__grid">
              {TRANSFER.routes.map((r) => (
                <ExperienceCard
                  key={r.key}
                  href="/transfer.html"
                  name={r.name}
                  img={r.bg}
                  alt={r.name}
                  meta={r.meta}
                  metaIcon="pin"
                  priceName={r.priceName}
                  priceFallback={r.priceFallback}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
