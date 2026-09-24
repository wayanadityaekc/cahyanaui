import { CalendarDays, Clock, Info, Languages, MapPin, UserCheck, Users } from 'lucide-react';

// The pill that states one fact. Written for the detail-page hero (Duration,
// Group, Free cancellation) and shared from here since Sep 2026, when the spec
// strip on transfer, airport and the activities listing became chips too
// (Wayan: "box untuk availability, capacity dll ganti bro gua gamau isi box
// gitu"). One string, so a chip is a chip everywhere.
export const CHIP =
  'inline-flex items-center gap-[0.4rem] py-[0.35rem] px-3 rounded-sm [border:1px_solid_var(--color-line)] ' +
  'font-body text-small text-green whitespace-nowrap [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-muted';
// The one chip that answers a doubt rather than states a spec, so it carries the
// success colour. Same promise as the book bar and every card - not a new claim.
export const CHIP_OK = 'text-ok [border-color:rgba(46,125,84,0.35)] [&>svg]:text-ok';

// Icon per fact LABEL. The labels come from the page's own data, and the chip
// prints the VALUE, so this is what keeps "24 / 7" from arriving unannounced.
// Lucide renders width/height=24 unless sized - CHIP's [&>svg] does that.
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
export const chipIcon = (label) => ICONS[label] || Info;
