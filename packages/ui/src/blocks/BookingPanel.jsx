'use client';

import { cn } from '../lib/cn.js';
import Card from './Card.jsx';
import { BTN_SM } from '../primitives/btnClasses.js';


export const SECONDARY_BTN =
  `flex w-full gap-2 ${BTN_SM} [border:1px_solid_var(--line)] bg-transparent text-gold font-body ` +
  'no-underline cursor-pointer transition-[color,border-color,scale] duration-200 ease-in-out ' +
  'hover:[border-color:var(--color-gold)] hover:text-gold';

export default function BookingPanel({
  as,
  title = null,
  price = null,
  fields = null,
  cta = null,
  secondary = null,
  note = null,
  sticky = true,
  className,
  panelRef,
  children,
  ...rest
}) {
  return (
    <aside
      className={cn('flex flex-col gap-5', sticky && 'lg:sticky lg:top-24', className)}
      {...rest}
    >
      <Card as={as} ref={panelRef} className="p-6">
        {title ? <h2 className="m-0 mb-2 text-strong font-semibold text-gold">{title}</h2> : null}
        {price}
        {fields ? <div className="mt-5">{fields}</div> : null}
        {cta ? <div className="mt-4">{cta}</div> : null}
        {secondary ? <div className="mt-2 flex flex-col gap-2">{secondary}</div> : null}
        {note ? <div className="text-label text-muted text-center mt-3">{note}</div> : null}
      </Card>
      {children}
    </aside>
  );
}
