import { Car, Clock, MapPin } from 'lucide-react';
import { findImageForProgram } from '@/lib/programImages';
import { MTC_ITEM_ICON, MTC_ITEM_ICON_PHOTO } from './myTripsClasses';

const ICON_STROKE_WIDTH_REGULAR = 1.7;

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
  if (row.kind === 'transfer') glyph = <Car strokeWidth={ICON_STROKE_WIDTH_REGULAR} />;
  else if (row.kind === 'charter') glyph = <Clock strokeWidth={ICON_STROKE_WIDTH_REGULAR} />;
  else glyph = <MapPin strokeWidth={ICON_STROKE_WIDTH_REGULAR} />;
  return (
    <span className={MTC_ITEM_ICON} aria-hidden="true">
      {glyph}
    </span>
  );
}
