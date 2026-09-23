'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Tag, ShieldCheck, CalendarDays, Info, Car } from 'lucide-react';
import { promoFor } from '@/content/shared/promo';

// Promo strip ABOVE the navbar, on every page (Sep 2026, Wayan: "coba trip bar di
// taruh di atas navbar dan hilang saat di scroll"). It has no scroll behaviour of
// its own any more - it is a plain strip, and the header slides it off the top edge
// once the guest scrolls (see Navbar). The collapse it used to animate here
// (grid-template-rows 0fr<->1fr) changed the header's height, which made Navbar's
// ResizeObserver rewrite --header-h on :root on every frame of the animation, and
// that recalculated the style of every element on the page 12 times in a row.
// Measured: 48-139ms of style recalc per collapse vs ~1ms on a page with no bar.
//
// It is on every page (Wayan, Sep 2026 - dibalikin ke semua halaman; sebelumnya
// sempat homepage-only). Isinya PER HALAMAN, lihat content/shared/promo.js. Teksnya sengaja kecil & tipis: ini pengumuman, bukan
// headline - jangan dibikin setebal nav.
// SATU BARIS, selalu (Wayan, Sep 2026 - "gua gamau ada 2 line"). Copy-nya
// ditulis pendek di promo.js, TAPI panjang teks beda-beda per font/bahasa, jadi
// bar-nya juga diklem di sini: `whitespace-nowrap` + `truncate` (butuh `min-w-0`
// di flex parent, kalau nggak anaknya gak mau nyusut). Efeknya kalau kepanjangan
// dia kepotong "...", BUKAN turun ke baris kedua & bikin header melar.
const BAR = 'flex items-center justify-center gap-2 w-full py-[0.5rem] px-5 [border-bottom:1px_solid_#ececec] bg-cream text-[0.72rem] font-normal leading-[1.3] text-muted no-underline whitespace-nowrap [@media(max-width:560px)]:gap-[0.35rem] [@media(max-width:560px)]:px-[0.9rem]';
const CTA = 'ml-2 shrink-0 text-gold underline [@media(max-width:560px)]:ml-[0.3rem]';
// The fade only carries the text swap on a rotating bar; a single-message page
// never triggers it. motion-reduce kills the fade, the swap itself still happens
// (it is content, not decoration).
const FADE = 'flex items-center min-w-0 max-w-full gap-2 [transition:opacity_var(--dur)_var(--ease)] motion-reduce:transition-none [@media(max-width:560px)]:gap-[0.35rem]';

// Lucide needs an explicit size or it renders at 24px.
const ICON = 'w-[var(--icon-sm)] h-[var(--icon-sm)] shrink-0 text-gold';
const ICONS = { tag: Tag, shield: ShieldCheck, calendar: CalendarDays, info: Info, car: Car };

const ROTATE_MS = 7000;
const FADE_MS = 200;

export default function TripBar() {
  const pathname = usePathname();
  const messages = promoFor(pathname);
  const [idx, setIdx] = useState(0);
  const [dim, setDim] = useState(false);
  const timers = useRef([]);

  const count = messages.length;
  useEffect(() => {
    setIdx(0);
    if (count < 2) return undefined;
    // Fade out, swap while invisible, then fade the new text back in on the
    // NEXT frame - setting idx and clearing `dim` in the same tick would paint
    // the new line at full opacity and the swap would pop instead of fade.
    const tick = setInterval(() => {
      setDim(true);
      const t = setTimeout(() => {
        setIdx((i) => (i + 1) % count);
        requestAnimationFrame(() => setDim(false));
      }, FADE_MS);
      timers.current.push(t);
    }, ROTATE_MS);
    return () => {
      clearInterval(tick);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [count, pathname]);

  if (!count) return null;

  const msg = messages[Math.min(idx, count - 1)];
  const Icon = ICONS[msg.icon] || Tag;
  const inner = (
    <span className={`${FADE} ${dim ? 'opacity-0' : 'opacity-100'}`}>
      <Icon className={ICON} strokeWidth={1.7} aria-hidden="true" />
      <span className="truncate">{msg.text}</span>
      {msg.cta && <span className={CTA}>{msg.cta}</span>}
    </span>
  );

  return msg.href ? (
    <a className={`${BAR} cursor-pointer`} id="tripbar" href={msg.href}>{inner}</a>
  ) : (
    <div className={`${BAR} cursor-default`} id="tripbar">{inner}</div>
  );
}
