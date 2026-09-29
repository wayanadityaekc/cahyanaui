import { Car, Clock, MapPin } from 'lucide-react';
import { imageForProgram } from '@/lib/programImages';
import { MTC_ITEM_ICON, MTC_ITEM_ICON_PHOTO } from './myTripsClasses';

// Row thumbnail: the program photo for tour days, otherwise a kind icon.
export default function ItemIcon({ row }) {
  const img = row.kind === 'day' ? imageForProgram(row.service) : null;
  if (img) {
    return (
      <span
        className={MTC_ITEM_ICON_PHOTO}
        style={{ backgroundImage: `url(/assets/images/${img})` }}
        aria-hidden="true"
      />
    );
  }
  let glyph;
  if (row.kind === 'transfer') glyph = <Car strokeWidth={1.7} />;
  else if (row.kind === 'charter') glyph = <Clock strokeWidth={1.7} />;
  else glyph = <MapPin strokeWidth={1.7} />;
  return <span className={MTC_ITEM_ICON} aria-hidden="true">{glyph}</span>;
}
