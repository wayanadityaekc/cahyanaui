'use client';

import { useState } from 'react';
import DriverCard from '@/components/cards/DriverCard';
import Modal from '@/components/ui/Modal';
import { ABOUT } from '@/content/shared/about';

export default function AboutPage() {
  const [driver, setDriver] = useState(null);

  return (
    <div className="about">
      <section className="lhero lhero--plain">
        <div className="lhero__inner">
          <h1 className="lhero__title">{ABOUT.title}</h1>
          <p className="lhero__sub">{ABOUT.sub}</p>

          <div className="about-gallery">
            <div className="about-gallery__track">
              {ABOUT.gallery.map((label) => (
                <div className="about-gallery__slide" key={label}>
                  <div className="about-gallery__ph"><span>{label}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-intro">
            <div className="ahero-card">
              <p>{ABOUT.intro.text}</p>
              <div className="lbox__facts">
                {ABOUT.intro.facts.map((f) => (
                  <div className="lbox__fact" key={f.label}>
                    <span>{f.label}</span>
                    <strong>{f.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="arows">
        {ABOUT.arows.map((row) => (
          <section className="arow" key={row.heading}>
            <div className="arow__lab">
              <span className="arow__k">{row.kicker}</span>
              <h2 className="arow__h">{row.heading}</h2>
            </div>
            <div className="arow__body">
              {row.paras.map((p, i) => <p key={i}>{p}</p>)}
              {row.steps && (
                <ol className="anl">
                  {row.steps.map((st) => (
                    <li key={st.n}>
                      <span className="anl__n">{st.n}</span>
                      <div>
                        <b>{st.title}</b>
                        <p>{st.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              {row.list && (
                <ul className={row.list.cls}>
                  {row.list.items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              )}
              {row.drivers && (
                <div className="drivers-grid">
                  {row.drivers.map((d) => (
                    <DriverCard key={d.name} {...d} onOpen={setDriver} />
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <Modal open={!!driver} onClose={() => setDriver(null)} title={driver ? driver.name : ''}>
        {driver && (
          <div className="driver-modal__head">
            <span className="driver-card__avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="4" />
                <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
              </svg>
            </span>
            <div>
              <strong className="driver-card__name">{driver.name}</strong>
              <span className="driver-card__tagline">{driver.tagline}</span>
            </div>
          </div>
        )}
        {driver && <p>{driver.desc}</p>}
      </Modal>
    </div>
  );
}
