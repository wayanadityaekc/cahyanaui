'use client';

import { useState } from 'react';
import DriverCard, { driverAvatarClasses } from '@/components/cards/DriverCard';
import Modal from '@/components/ui/Modal';
import RegistrationBlock from '@/components/sections/RegistrationBlock';
import { ABOUT } from '@/content/shared/about';

// Tailwind-native (migrasi Fase 2, TW-A7 #328): keluarga .arow*/.arows/.about*
// (kecuali .about-gallery -> dipertahankan render tapi disembunyiin lewat
// `hidden` di company mode, bukan dihapus dari DOM)/.driver*/.drivers* ->
// utilities 1:1, CSS-nya udah dihapus dari style.css.
//
// GOTCHA disengaja: div pembungkus paling luar TETAP pakai literal className
// "about" (bukan cuma utility) - itu bukan sisa lupa dihapus. `.lhero`/
// `.lhero__inner`/`.lhero__title`/`.lhero__sub` di section di bawahnya itu
// primitif SHARED (dipakai listing/guide/dll, family issue LAIN, belum
// dikonversi) dan style.css masih punya override khusus About yang
// nyasumsiin ancestor `.about` ada (hero dipendekin, foto dibuang, warna judul
// beda) - `.about .lhero`, `.about .lhero__title`, `.about .lhero__sub`, plus
// varian `.company-page .about .lhero*`. Kalau token "about" dicabut dari DOM,
// override itu berhenti match diam-diam (regresi visual) padahal CSS-nya
// bukan family aku buat dihapus. Jadi class "about" dibiarin nempel murni
// sebagai hook lintas-family - begitu `.lhero` family dikonversi (issue lain),
// hook ini juga bisa dicabut sekalian.
export default function AboutPage({ company = false }) {
  const [driver, setDriver] = useState(null);
  // Modal di-portal ke <body> (di LUAR .company-page), jadi baseline avatar-nya
  // SELALU ukuran base (.driver-card__avatar 60px) - shrink company (46px) cuma
  // buat kartu driver yang beneran nested di .company-page, bukan modal ini.
  const modalAvatar = driverAvatarClasses(false);

  // GOTCHA (kejadian pas migrasi ini): JANGAN nempelin `${cond ? ... : ''}` LANGSUNG
  // abis token utility tanpa spasi (mis. `...px-4${x}`) - Tailwind v4 content-scanner
  // baca teks source APA ADANYA (bukan run-time), jadi `px-[var(--x)]${company` numpuk
  // jadi SATU "kata" gak valid & utility-nya gak ke-generate sama sekali (diam-diam,
  // gak ada error build). Ketauan pas headless diff (bukan cuma "harusnya begini").
  // Solusinya: dua string LENGKAP terpisah lewat ternary (pola DriverCard/RegistrationBlock),
  // bukan nyambung suffix ke base string.
  const wrap = company
    ? 'about py-[var(--space-5)] px-[var(--space-3)] max-[768px]:-mt-4 pt-0'
    : 'about py-[var(--space-5)] px-[var(--space-3)] max-[768px]:-mt-4';
  const intro = company
    ? 'max-w-none mx-0 px-0'
    : 'max-w-[var(--container-mid)] mx-auto px-[var(--container-x)]';
  const heroCard = company
    ? 'relative z-[3] mt-0 max-w-none mx-0 text-left bg-transparent rounded-none [box-shadow:none] p-0'
    : 'relative z-[3] mt-[0.5rem] max-w-[560px] mx-auto text-left bg-white rounded-xl shadow-xl py-[1.4rem] px-[1.3rem]';
  const driversGrid = company
    ? 'flex flex-wrap justify-start gap-4 max-[768px]:flex-nowrap max-[768px]:max-w-full max-[768px]:overflow-x-auto max-[768px]:overflow-y-hidden max-[768px]:[touch-action:pan-x_pan-y] max-[768px]:[scroll-snap-type:x_mandatory] max-[768px]:pb-2 max-[768px]:justify-center max-[768px]:[&>*]:flex-[0_0_78%] max-[768px]:[&>*]:[scroll-snap-align:start] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
    : 'flex flex-wrap justify-start gap-6 max-[768px]:flex-nowrap max-[768px]:gap-4 max-[768px]:max-w-full max-[768px]:overflow-x-auto max-[768px]:overflow-y-hidden max-[768px]:[touch-action:pan-x_pan-y] max-[768px]:[scroll-snap-type:x_mandatory] max-[768px]:pb-2 max-[768px]:justify-center max-[768px]:[&>*]:flex-[0_0_78%] max-[768px]:[&>*]:[scroll-snap-align:start] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

  return (
    <div className={wrap}>
      <section className="lhero lhero--plain">
        <div className="lhero__inner">
          <h1 className="lhero__title">{ABOUT.title}</h1>
          <p className="lhero__sub">{ABOUT.sub}</p>

          <div className={`relative max-w-[640px] mt-[0.6rem] mx-auto ${company ? 'hidden' : ''}`}>
            <div className="flex gap-[0.6rem] overflow-x-auto [scroll-snap-type:x_mandatory] [scrollbar-width:none] [-ms-overflow-style:none] [touch-action:pan-x_pan-y] rounded-lg [&::-webkit-scrollbar]:hidden">
              {ABOUT.gallery.map((label) => (
                <div className="flex-[0_0_100%] [scroll-snap-align:center]" key={label}>
                  <div className="flex items-center justify-center aspect-[4/3] rounded-lg border border-dashed border-line bg-[linear-gradient(160deg,#f3f1ea,#e9e6dd)] text-muted text-small tracking-[0.04em]"><span>{label}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className={intro}>
            <div className={heroCard}>
              <p className="mb-4 text-body leading-[1.6] text-ink">{ABOUT.intro.text}</p>
              <div className="flex border border-line rounded-md overflow-hidden mb-[1.1rem]">
                {ABOUT.intro.facts.map((f) => (
                  <div className="flex-1 text-center py-[0.55rem] px-[0.4rem] border-r border-r-line last:border-r-0" key={f.label}>
                    <span className="block text-small text-muted">{f.label}</span>
                    <strong className="block mt-[0.15rem] font-body text-h3 font-medium text-ink">{f.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={intro}>
        {/* py = var(--section-gap), BUKAN var(--space-5): CSS lama `.arow{padding:var(--space-5) 0}`
            sebenernya udah ke-override diam-diam sama rule global "Snap padding vertikal section
            konten" (`.experience,.info,...,.arow,.guide-more{padding-top/bottom:var(--section-gap)}`,
            sama specificity, muncul belakangan di style.css -> menang). Efektifnya SELALU
            --section-gap (36px) di semua lebar, bukan --space-5 (48px) - baru ketauan pas
            ngelacak cascade buat migrasi ini, bukan salah baca .arow doang. */}
        {ABOUT.arows.map((row) => (
          <section
            className="grid grid-cols-[240px_1fr] max-[768px]:grid-cols-[1fr] gap-[2.5rem] max-[768px]:gap-4 [align-items:start] py-[var(--section-gap)] [&+&]:border-t [&+&]:border-t-line before:content-none"
            key={row.heading}
          >
            <div className="sticky max-[768px]:static top-[6.5rem]">
              <span className="block mb-2 text-small font-medium text-muted">{row.kicker}</span>
              <h2 className="m-0 font-head text-h2 font-medium tracking-[-0.01em] leading-[1.15] text-green">{row.heading}</h2>
            </div>
            <div>
              {row.paras.map((p, i) => <p className="mb-4 last:mb-0 max-w-[62ch] text-body leading-[1.75] text-ink" key={i}>{p}</p>)}
              {row.steps && (
                <ol className="list-none m-0 p-0">
                  {row.steps.map((st) => (
                    <li className="flex gap-4 py-4 [&+&]:border-t [&+&]:border-t-line" key={st.n}>
                      <span className="flex items-center justify-center flex-[0_0_34px] h-[34px] rounded-[50%] bg-cream border border-line font-head font-semibold text-gold-d">{st.n}</span>
                      <div>
                        <b className="block mb-[0.15rem] text-h3 font-semibold text-green">{st.title}</b>
                        <p className="m-0 text-small leading-[1.5] text-muted">{st.text}</p>
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
                <div className={driversGrid}>
                  {row.drivers.map((d) => (
                    <DriverCard key={d.name} {...d} onOpen={setDriver} company={company} />
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <RegistrationBlock company={company} />

      <Modal open={!!driver} onClose={() => setDriver(null)} title={driver ? driver.name : ''}>
        {driver && (
          <div className="flex items-center gap-4 mb-5">
            <span className={`flex items-center justify-center ${modalAvatar.box} rounded-[50%] font-head font-semibold text-white bg-[linear-gradient(135deg,var(--color-amber),var(--color-amber-d))]`}>
              <svg className={modalAvatar.svg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="4" />
                <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
              </svg>
            </span>
            <div>
              <h3 className="font-body text-h3 font-semibold tracking-normal">{driver.name}</h3>
              <span className="block text-body text-muted">{driver.tagline}</span>
            </div>
          </div>
        )}
        {driver && <p className="mb-6 leading-[1.6] text-ink text-body">{driver.desc}</p>}
      </Modal>
    </div>
  );
}
