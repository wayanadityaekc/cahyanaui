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

  return (
    <Modal open={open} onClose={close} title="Add to your trip">
      {!cat ? (
        <>
          <p className={SUB}>Pick a category to add to your trip.</p>
          <div className="pick-cats">
            {CATS.map((c) => (
              <button type="button" className="pick-cat" key={c.key} onClick={() => setCat(c)}>
                {c.label}
              </button>
            ))}
            <a href="/transfer.html" className="pick-cat">Transfers</a>
            <a href="/charter.html" className="pick-cat">Private Car Charter</a>
          </div>
        </>
      ) : (
        <>
          <p className={SUB}>{cat.label}</p>
          <div className="pick-cats">
            {items.map((i) => (
              <button
                type="button"
                className="pick-cat"
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
