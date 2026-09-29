import { CalendarDays, Clock, Info, Languages, MapPin, UserCheck, Users } from 'lucide-react';

// The fact pill used by detail heroes and the transfer/airport/activities fact strips; one string everywhere.
export const CHIP =
  'inline-flex items-center gap-[0.4rem] py-[0.35rem] px-3 rounded-sm [border:1px_solid_var(--line)] ' +
  'font-body text-small text-green whitespace-nowrap [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-muted';
// Success-coloured chip for the free-cancellation promise.
export const CHIP_OK = 'text-ok [border-color:rgba(46,125,84,0.35)] [&>svg]:text-ok';

// Icon per fact label (chips print only the value); CHIP's [&>svg] sizes them, else Lucide renders 24px.
const ICONS = {
  Duration: Clock,
  'Time here': Clock,
  Availability: CalendarDays,
  Capacity: Users,
  Group: Users,
  'Pick-up': MapPin,
  Area: MapPin,
  'Meet & greet': UserCheck,
  Language: Languages,
};
export function chipIcon(label) { return ICONS[label] || Info; }
