'use client';

import { useState } from 'react';
import { cn } from '../lib/cn.js';

export default function TabGallery({ items = [], label = '', className }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const [photo, setPhoto] = useState(0);
  if (!items.length) return null;
  const item = items.find((entry) => entry.id === activeId) || items[0];
  const images = item.images || [];
  const current = images[photo] || images[0];

  function choose(id) {
    setActiveId(id);
    setPhoto(0);
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="flex flex-wrap gap-2 mb-6">
        {items.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={entry.id === item.id}
            onClick={() => choose(entry.id)}
            className={cn(
              'h-[var(--btn-h)] px-4 rounded-pill font-body text-small font-medium cursor-pointer [border:1px_solid_var(--line)] transition-[background-color,color] duration-200 ease-[ease]',
              entry.id === item.id
                ? 'bg-gold text-white [border-color:var(--color-gold)]'
                : 'bg-surface-raised text-green hover:bg-cream',
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div className="grid gap-6 min-[993px]:grid-cols-[1.45fr_1fr] min-[993px]:gap-10 items-start">
        <div className="relative overflow-hidden bg-cream aspect-[16/10]">
          {current ? (
            <img
              src={current.src}
              alt={current.alt || ''}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div role="tabpanel" className="grid gap-4 content-start">
          <h3 className="text-h2 font-medium text-gold">{item.title}</h3>
          <p className="text-body leading-[var(--lh-body)] text-green m-0">{item.text}</p>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {images.slice(0, 5).map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                aria-label={image.alt}
                aria-current={index === photo}
                onClick={() => setPhoto(index)}
                className={cn(
                  'relative aspect-square overflow-hidden cursor-pointer p-0 border-0 bg-cream outline outline-2 outline-offset-2',
                  index === photo ? 'outline-[var(--color-gold)]' : 'outline-transparent',
                )}
              >
                <img src={image.src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
