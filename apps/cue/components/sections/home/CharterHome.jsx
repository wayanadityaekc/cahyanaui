'use client';

import Slider from '@/components/ui/Slider';
import CharterPrice from '@/components/CharterPrice';
import { CHARTER_CARDS } from '@/content/shared/home';

export default function CharterHome() {
  return (
    <section className="charter-home" id="charter-promo">
      <div className="charter-home__in">
        <div className="charter-home__head">
          <span className="charter-home__k">One more way to explore</span>
          <h2 className="charter-home__t">Charter a car for the whole day</h2>
          <p className="charter-home__lead">
            Private car and driver, yours for the day. Pick a length, build your own route. Petrol included, pick up
            anywhere on the island.
          </p>
        </div>

        <Slider gridClassName="charter-home__slider experience__grid--slider">
          {CHARTER_CARDS.map((c) => (
            <article className={c.cls} key={c.hours}>
              {c.badge && <span className="chcard__badge">{c.badge}</span>}
              <h3 className="chcard__hours">{c.hours}</h3>
              <p className="chcard__label">{c.label}</p>
              <p className="chcard__price">
                <span className="chcard__from">{c.from}</span>{' '}
                <CharterPrice duration={c.charter} extra={c.extra} fallback={c.fallback} className="chcard__amt" />{' '}
                <span className="chcard__unit">{c.unit}</span>
              </p>
              <p className="chcard__note">{c.note}</p>
              <a className={c.btnCls} href={c.href}>{c.btnText}</a>
            </article>
          ))}
        </Slider>

        <p className="charter-home__foot">
          Only a <b>10% deposit</b> to book &middot; prices per car, pick-up outside Ubud +$7
        </p>
      </div>
    </section>
  );
}
