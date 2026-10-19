'use client';

import { useMemo, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { SUB } from '@/components/ui/modalClasses';
import { usePricing } from '@/state/PricingProvider';
import { EXPLORE_OPTIONS } from '@/content/shared/explore-options';

const ICON_STROKE_WIDTH_LIGHT = 1.6;

const LINK_OPTIONS = EXPLORE_OPTIONS.filter((exploreOption) => exploreOption.cat !== 'destination');
const PICK_CATS_SRC = [
  { key: 'tour', label: 'Tour Programs', cats: ['tour', 'combo'] },
  { key: 'experience', label: 'Activities & Performances', cats: ['experience', 'performance'] },
];

const PICK_CATS = 'flex flex-col gap-[0.6rem]';
const PICK_CAT =
  'block w-full py-[0.95rem] px-4 text-center [border:1px_solid_var(--line)] rounded-md bg-cream font-body font-semibold text-green no-underline transition-[border-color,background-color,scale] duration-[var(--dur)] ease-[ease] hover:border-gold hover:bg-[#efe9db]';
const PICK_CAT_BTN = `${PICK_CAT} cursor-pointer [font-size:inherit]`;
const LINK_CAT =
  'flex items-center gap-[0.85rem] w-full py-[0.85rem] px-4 text-left [border:1px_solid_var(--line)] rounded-md bg-cream font-body text-green no-underline transition-[border-color,background-color,scale] duration-[var(--dur)] ease-[ease] hover:border-gold hover:bg-[#efe9db]';
const LINK_ICON =
  'flex-none w-9 h-9 grid place-items-center rounded-[50%] bg-white text-gold [&>svg]:w-[var(--icon-md)] [&>svg]:h-[var(--icon-md)]';
const LINK_NAME = 'font-semibold text-green';
const LINK_SUB = 'block text-small text-muted mt-[0.1rem]';

export default function AddItemPicker({ open, onClose, onPick, mode = 'link' }) {
  const pricing = usePricing();
  const [cat, setCat] = useState(null);

  const catalog = pricing && pricing.catalog;
  const items = useMemo(() => {
    if (!catalog || !cat) return [];
    return catalog.items.filter((item) => cat.cats.includes(item.category) && item.active);
  }, [catalog, cat]);

  function handleClose() {
    setCat(null);
    onClose();
  }

  if (mode === 'link') {
    return (
      <Modal open={open} onClose={onClose} title="Add to your trip">
        <p className={SUB}>
          Pick what you&apos;d like to add - you&apos;ll browse the real options and pick your item there.
        </p>
        <div className={PICK_CATS}>
          {LINK_OPTIONS.map((linkOption) => (
            <a href={linkOption.href} className={LINK_CAT} key={linkOption.href}>
              <span className={LINK_ICON}>
                <linkOption.Icon strokeWidth={ICON_STROKE_WIDTH_LIGHT} />
              </span>
              <span>
                <span className={LINK_NAME}>{linkOption.name}</span>
                <span className={LINK_SUB}>{linkOption.sub}</span>
              </span>
            </a>
          ))}
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add to your trip">
      {!cat ? (
        <>
          <p className={SUB}>Pick a category to add to your trip.</p>
          <div className={PICK_CATS}>
            {PICK_CATS_SRC.map((category) => (
              <button type="button" className={PICK_CAT_BTN} key={category.key} onClick={() => setCat(category)}>
                {category.label}
              </button>
            ))}
            <a href="/transfer.html" className={PICK_CAT}>
              Transfers
            </a>
            <a href="/charter.html" className={PICK_CAT}>
              Private Car Charter
            </a>
          </div>
        </>
      ) : (
        <>
          <p className={SUB}>{cat.label}</p>
          <div className={PICK_CATS}>
            {items.map((item) => (
              <button
                type="button"
                className={PICK_CAT_BTN}
                key={item.name}
                onClick={() => {
                  onPick(item.name);
                  handleClose();
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
