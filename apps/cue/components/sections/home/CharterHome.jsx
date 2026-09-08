'use client';

import Slider from '@/components/ui/Slider';
import CharterPrice from '@/components/CharterPrice';
import { CHARTER_CARDS } from '@/content/shared/home';

export default function CharterHome() {
  // Tailwind-native (migrasi Fase 2): wrapper `.charter-home__*` (section/in/head/
  // k/t/lead/slider/foot) -> utilities, CSS-nya dihapus dari style.css. KEPT sbagai
  // primitif kartu shared (content-driven `c.cls`/`c.btnCls` + `.chcard__badge` juga
  // dipake ExperienceCard): keluarga `.chcard*` TETEP CSS. Slider dulu `.charter-home__
  // slider experience__grid--slider`; keduanya di-inline jadi utilities self-contained
  // (flex+scroll-snap+scrollbar-hide) - `.experience__grid--slider` (grid engine) gak
  // dipake di sini lagi, jadi gak ada tabrakan cascade sama style.css (yg load belakangan).
  return (
    <section className="max-w-[var(--container)] my-[var(--space-5)] mx-auto px-[var(--container-x)]" id="charter-promo">
      <div className="bg-white border border-line rounded-lg shadow-md p-[var(--space-5)] max-[560px]:p-[var(--space-4)_var(--space-3)]">
        <div className="text-center mb-[var(--space-3)]">
          <span className="block uppercase tracking-[0.14em] text-label text-muted mb-[0.4rem]">One more way to explore</span>
          <h2 className="font-head text-h2 font-medium tracking-[-0.01em] mb-[0.6rem] text-gold">Charter a car for the whole day</h2>
          <p className="text-body leading-[1.6] text-ink mx-auto max-w-[60ch]">
            Private car and driver, yours for the day. Pick a length, build your own route. Petrol included, pick up
            anywhere on the island.
          </p>
        </div>

        <Slider gridClassName="flex gap-[var(--space-3)] overflow-x-auto overflow-y-hidden [scroll-snap-type:x_mandatory] [touch-action:pan-x_pan-y] mt-[var(--space-4)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

        <p className="text-center mt-[var(--space-4)] text-small text-muted">
          Only a <b className="text-gold font-semibold">10% deposit</b> to book &middot; prices per car, pick-up outside Ubud +$7
        </p>
      </div>
    </section>
  );
}
