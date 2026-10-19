import { formatRupiah } from '@/lib/currency';
import { formatDate, formatTime } from '@/lib/timeSlots';
import { priceFor, findProgramByKey, findTransferById } from '@/lib/extras';

function buildExtraLine(extra, stay, catalog, formatAmount) {
  const price = priceFor(extra, catalog);
  const amount = price ? formatAmount(price.display) : '-';
  if (extra.kind === 'transfer') {
    const transfer = findTransferById(extra.dir);
    const date = transfer ? transfer.dateOf(stay) : '';
    const flight = extra.flight ? `, flight ${extra.flight}` : '';
    return `- ${transfer ? transfer.title : 'Airport transfer'}: ${formatDate(date)}, ${formatTime(extra.time)}${flight} - ${amount}`;
  }
  const program = findProgramByKey(extra.key);
  return `- ${program ? program.title : extra.key}: ${formatDate(extra.date)}, ${formatTime(extra.time)} - ${amount}`;
}

export function buildBookingMessage({
  stay,
  villa,
  nights,
  shown,
  breakdown,
  inRupiah,
  extras = [],
  totals = null,
  catalog = null,
  services = [],
  formatAmount,
}) {
  const lines = [stay && villa ? `Hi! I'd like to book ${villa.name}.` : "Hi! I'd like to ask about staying with you."];
  if (stay) {
    lines.push(`Check-in: ${stay.checkIn || '-'}`, `Check-out: ${stay.checkOut || '-'}`, `Guests: ${stay.guests}`);
  }
  if (breakdown && nights > 0) {
    lines.push(`${nights} night(s) x ${formatAmount(shown.nightly)} = ${formatAmount(shown.subtotal)}`);
    lines.push(
      `Stay total (paid in full): ${formatAmount(shown.total)}${inRupiah ? '' : ` (exact price ${formatRupiah(breakdown.totalIdr)})`}`,
    );
  }
  if (extras.length && stay) {
    lines.push('', 'Cahyana Ubud Experience extras:');
    extras.forEach((extra) => lines.push(buildExtraLine(extra, stay, catalog, formatAmount)));
    if (totals) {
      lines.push(
        `Extras total: ${formatAmount(totals.total)} (deposit ${formatAmount(totals.deposit)} now, ${formatAmount(totals.rest)} on the day)`,
      );
    }
  }
  if (services.length) {
    lines.push('', `At the villa (paid there): ${services.map((service) => service.label).join(', ')}`);
  }
  return lines.join('\n');
}
