'use client';

import { useMemo, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { SUB } from '@/components/ui/modalClasses';
import { usePricing } from '@/state/PricingProvider';

const CATS = [
  { key: 'tour', label: 'Tour Programs', cats: ['tour', 'combo'] },
  { key: 'experience', label: 'Activities & Performances', cats: ['experience', 'performance'] },
];

export default function AddItemPicker({ open, onClose, onPick }) {
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

  // Tailwind-native (migrasi Fase 2): .pick-cats/.pick-cat (isolated ke komponen ini)
  // -> utilities, CSS-nya dihapus. `button.pick-cat` (font-size:inherit + cursor) di-
  // gabung ke varian tombol; <a> pakai varian dasar.
  const PICK_CATS = 'flex flex-col gap-[0.6rem]';
  const PICK_CAT = 'block w-full py-[0.95rem] px-4 text-center [border:1px_solid_#e6dfce] rounded-md bg-cream font-body font-semibold text-green no-underline transition-[border-color,background-color] duration-[var(--dur)] ease-[ease] hover:border-gold hover:bg-[#efe9db]';
  const PICK_CAT_BTN = `${PICK_CAT} cursor-pointer [font-size:inherit]`;
  return (
    <Modal open={open} onClose={close} title="Add to your trip">
      {!cat ? (
        <>
          <p className={SUB}>Pick a category to add to your trip.</p>
          <div className={PICK_CATS}>
            {CATS.map((c) => (
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
