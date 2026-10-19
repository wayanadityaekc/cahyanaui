import { Car, Clock, MapPin } from 'lucide-react';
import { findImageForProgram } from '@/lib/programImages';
import { MTC_ITEM_ICON, MTC_ITEM_ICON_PHOTO } from './myTripsClasses';

export default function ItemIcon({ row }) {
  const image = row.kind === 'day' ? findImageForProgram(row.service) : null;
  if (image) {
    return (
      <span
        className={MTC_ITEM_ICON_PHOTO}
        style={{ backgroundImage: `url(/assets/images/${image})` }}
        aria-hidden="true"
      />
    );
  }
  let glyph;
  if (row.kind === 'transfer') glyph = <Car strokeWidth={1.7} />;
  else if (row.kind === 'charter') glyph = <Clock strokeWidth={1.7} />;
  else glyph = <MapPin strokeWidth={1.7} />;
  return (
    <span className={MTC_ITEM_ICON} aria-hidden="true">
      {glyph}
    </span>
  );
}
