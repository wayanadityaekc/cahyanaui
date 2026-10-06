'use client';

import { useState } from 'react';
import { cn } from '../lib/cn.js';

/**
 * A row of photo panels where the chosen one opens wide and the rest stay as
 * narrow strips. From 993px they sit side by side and open sideways; on a phone
 * they stack and the chosen one opens downward, the others staying 64px strips
 * with a plus sign. Tapping a strip opens it and closes the previous one.
 *
 *   items   [{ id, label, title, text, images: [{ src, alt }] }]  first image is the panel photo
 *   label   accessible name for the group
 */
export default function ExpandPanels({ items = [], label = '', className }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  if (!items.length) return null;

  return (
    <div role="group" aria-label={label} className={cn('flex flex-col gap-2 min-[993px]:flex-row min-[993px]:gap-3 min-[993px]:h-[28rem]', className)}>
      {items.map((item) => {
        const open = item.id === activeId;
        const photo = item.images?.[0];
        return (
          <button
            key={item.id}
            type="button"
            aria-expanded={open}
            onClick={() => setActiveId(item.id)}
            className={cn(
              'relative overflow-hidden rounded-lg p-0 border-0 text-left text-white bg-cream cursor-pointer min-w-0',
              '[transition:height_var(--dur-slow)_var(--ease),flex-grow_var(--dur-slow)_var(--ease)] motion-reduce:transition-none',
              open ? 'h-[19rem] min-[993px]:h-auto min-[993px]:flex-[5_1_0%]' : 'h-16 min-[993px]:h-auto min-[993px]:flex-[1_1_0%]',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {photo ? <img src={photo.src} alt={open ? photo.alt || '' : ''} loading="lazy" className="absolute inset-0 w-full h-full object-cover" /> : null}
            <span className={cn('absolute inset-0 transition-[background-color] duration-200', open ? 'bg-[linear-gradient(transparent_45%,rgba(20,19,15,0.78))]' : 'bg-[rgba(20,19,15,0.42)]')} />
            {/* Closed: the name (sideways on desktop) and a plus on a phone. */}
            <span className={cn('absolute flex items-center justify-between inset-x-4 top-0 h-16 text-strong font-semibold min-[993px]:hidden', open && 'hidden')}>
              {item.label}
              <span aria-hidden="true">+</span>
            </span>
            <span className={cn('absolute left-4 bottom-4 hidden text-strong font-semibold [writing-mode:vertical-rl] rotate-180 min-[993px]:block', open && 'min-[993px]:hidden')}>{item.label}</span>
            {/* Open: the name, its headline and the words. */}
            <span className={cn('absolute inset-x-5 bottom-5 flex-col gap-1', open ? 'flex' : 'hidden')}>
              <b className="text-h3 font-semibold">{item.label}</b>
              <span className="text-small text-white/90 leading-[1.5] max-w-[48ch]">{item.title}</span>
              <span className="hidden min-[993px]:block text-small text-white/80 leading-[1.55] max-w-[56ch] mt-1">{item.text}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
