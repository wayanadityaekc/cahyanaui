import { Camera, Car, Clock, Footprints, Landmark, MapPin, Shirt, Sunset, Ticket, Users, Waves } from 'lucide-react';

// "Good to know" on a destination page: the facts already in the page data,
// plus the practical notes a guest actually asks about. A destination is an
// information page, so this is the payload - it replaces the Include/Exclude
// lists, which describe a program and never belonged on a place.
//
// Icons are lucide-react per CLAUDE.md, each given an explicit size (lucide
// renders width/height=24 otherwise) and strokeWidth only where it differs
// from the default 2. Tips come from the page's own `tips` array so nothing
// here is invented for the sake of filling the section.
const TIP_ICONS = {
  tide: Waves,
  crowd: Users,
  temple: Landmark,
  walk: Footprints,
  drive: Car,
  ticket: Ticket,
  time: Clock,
  sun: Sunset,
  photo: Camera,
  sarong: Shirt,
};

const FACT_ICONS = {
  Area: MapPin,
  'Best time': Sunset,
  'Time here': Clock,
  Entrance: Ticket,
};

const ICON_WRAP = 'flex-none inline-flex w-[var(--icon-sm)] h-[var(--icon-sm)] text-cta [&>svg]:w-full [&>svg]:h-full';

export default function PlaceNotes({ facts = [], tips = [] }) {
  return (
    <div className="grid gap-6">
      {facts.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-[0.9rem] m-0 min-[769px]:grid-cols-4">
          {facts.map((f) => {
            const Icon = FACT_ICONS[f.label] || MapPin;
            return (
              <div key={f.label} className="flex items-start gap-[0.55rem]">
                <span className={ICON_WRAP} aria-hidden="true"><Icon strokeWidth={1.7} /></span>
                <span className="min-w-0">
                  <dt className="text-label font-medium tracking-[0.12em] uppercase text-muted">{f.label}</dt>
                  <dd className="m-0 mt-[0.15rem] text-strong font-semibold text-green">{f.value}</dd>
                </span>
              </div>
            );
          })}
        </dl>
      )}

      {tips.length > 0 && (
        <ul className="grid gap-[0.7rem] m-0 p-0 list-none">
          {tips.map((t, i) => {
            const Icon = TIP_ICONS[t.icon] || Clock;
            return (
              <li key={i} className="flex items-start gap-[0.6rem] py-[0.55rem] [border-bottom:1px_solid_var(--line)] last:[border-bottom:none]">
                <span className={ICON_WRAP} aria-hidden="true"><Icon strokeWidth={1.7} /></span>
                <span className="min-w-0 text-body leading-[var(--lh-body)] text-green">{t.text}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
