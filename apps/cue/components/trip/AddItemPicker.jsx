'use client';

import { useMemo, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { SUB } from '@/components/ui/modalClasses';
import { usePricing } from '@/state/PricingProvider';
import { EXPLORE_OPTIONS } from '@/content/shared/explore-options';

// Bookable categories only (Destinations isn't sold as a standalone item - CLAUDE.md).
const LINK_OPTIONS = EXPLORE_OPTIONS.filter((o) => o.cat !== 'destination');
const PICK_CATS_SRC = [
  { key: 'tour', label: 'Tour Programs', cats: ['tour', 'combo'] },
  { key: 'experience', label: 'Activities & Performances', cats: ['experience', 'performance'] },
];

// Tailwind-native (migrasi Fase 2): .pick-cats/.pick-cat (isolated ke komponen ini)
// -> utilities, CSS-nya dihapus.
const PICK_CATS = 'flex flex-col gap-[0.6rem]';
const PICK_CAT = 'block w-full py-[0.95rem] px-4 text-center [border:1px_solid_#e6dfce] rounded-md bg-cream font-body font-semibold text-green no-underline transition-[border-color,background-color] duration-[var(--dur)] ease-[ease] hover:border-gold hover:bg-[#efe9db]';
const PICK_CAT_BTN = `${PICK_CAT} cursor-pointer [font-size:inherit]`;
const LINK_CAT = 'flex items-center gap-[0.85rem] w-full py-[0.85rem] px-4 text-left [border:1px_solid_#e6dfce] rounded-md bg-cream font-body text-green no-underline transition-[border-color,background-color] duration-[var(--dur)] ease-[ease] hover:border-gold hover:bg-[#efe9db]';
const LINK_ICON = 'flex-none w-9 h-9 grid place-items-center rounded-[50%] bg-white text-gold [&>svg]:w-[var(--icon-md)] [&>svg]:h-[var(--icon-md)]';
const LINK_NAME = 'font-semibold text-green';
const LINK_SUB = 'block text-small text-muted mt-[0.1rem]';

// Rombak (Sep 2026, Wayan) - dua mode:
//   mode="link" (default, My Trips): kategori -> diarahin ke halaman listing beneran
//     (foto/harga/detail). User pilih item di sana, buka detail page, klik Book ->
//     BookSidebar.jsx otomatis redirect balik ke /my-trips.html. Dulu popup nge-list
//     item LANGSUNG di dalam modal (instant-add tanpa tanggal/foto/detail) - diganti
//     karena user gak sempet liat apa yang mereka tambahin.
//   mode="pick" (ItineraryBuilder, "add to THIS day"): TETEP in-modal 2-step lama
//     (kategori -> item -> onPick(name)) - halaman itinerary nyimpen konteks "hari
//     keberapa" yang ilang kalau di-redirect keluar, jadi mode ini gak diubah.
export default function AddItemPicker({ open, onClose, onPick, mode = 'link' }) {
  const pricing = usePricing();
  const [cat, setCat] = useState(null);

  const catalog = pricing && pricing.catalog;
  const items = useMemo(() => {
    if (!catalog || !cat) return [];
    return catalog.items.filter((i) => cat.cats.includes(i.category) && i.active);
  }, [catalog, cat]);

  const close = () => {
    setCat(null);
    onClose();
  };

  if (mode === 'link') {
    return (
      <Modal open={open} onClose={onClose} title="Add to your trip">
        <p className={SUB}>Pick what you&apos;d like to add - you&apos;ll browse the real options and pick your item there.</p>
        <div className={PICK_CATS}>
          {LINK_OPTIONS.map((o) => (
            <a href={o.href} className={LINK_CAT} key={o.href}>
              <span className={LINK_ICON}><o.Icon strokeWidth={1.6} /></span>
              <span>
                <span className={LINK_NAME}>{o.name}</span>
                <span className={LINK_SUB}>{o.sub}</span>
              </span>
            </a>
          ))}
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={close} title="Add to your trip">
      {!cat ? (
        <>
          <p className={SUB}>Pick a category to add to your trip.</p>
          <div className={PICK_CATS}>
            {PICK_CATS_SRC.map((c) => (
              <button type="button" className={PICK_CAT_BTN} key={c.key} onClick={() => setCat(c)}>
                {c.label}
              </button>
            ))}
            <a href="/transfer.html" className={PICK_CAT}>Transfers</a>
            <a href="/charter.html" className={PICK_CAT}>Private Car Charter</a>
          </div>
        </>
      ) : (
        <>
          <p className={SUB}>{cat.label}</p>
          <div className={PICK_CATS}>
            {items.map((i) => (
              <button
                type="button"
                className={PICK_CAT_BTN}
                key={i.name}
                onClick={() => {
                  onPick(i.name);
                  close();
                }}
              >
                {i.name}
              </button>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
