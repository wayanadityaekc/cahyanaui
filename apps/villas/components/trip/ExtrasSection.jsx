'use client';

import Link from 'next/link';
import { DateField, ExtrasPanel, Field, Input, Select } from '@cahyana/ui';
import { SERVICES } from '@/lib/bookingCart';
import { TIME_SLOTS, fmtTime } from '@/lib/timeSlots';
import {
  EXTRA_PROGRAMS, TRANSFERS, TRANSFER_KEY, extraId, extraProblem, isOffered, priceFor, slotsFor,
} from '@/lib/extras';

const PROGRAM_GROUPS = [
  { id: 'tours', title: 'Tours', note: 'Private day tours by Cahyana Ubud Experience, picked up at your villa. A small deposit now, the rest on the day.' },
  { id: 'activities', title: 'Activities', note: 'Booked through Cahyana Ubud Experience, with pickup at your villa. A small deposit now, the rest on the day.' },
];

// A missing value is a hint; a value that breaks a rule is an error the reader is told about.
function fieldNote(problem, word) {
  if (!problem.includes(word)) return {};
  return /inside|listed/.test(problem) ? { error: problem } : { hint: problem };
}

function timeOptions(slots) {
  return (slots || TIME_SLOTS).map((slot) => ({ value: slot, label: fmtTime(slot) }));
}

// Add-ons for a stay: CUE programs and airport transfers are priced from the API; villa services are paid at the villa.
export default function ExtrasSection({
  stay = null,
  extras = [],
  services = [],
  catalog = null,
  formatAmount = (amount) => String(amount),
  onToggleService = () => {},
  addExtra = () => {},
  removeExtra = () => {},
  updateExtra = () => {},
}) {
  const hasDates = !!(stay && stay.checkIn && stay.checkOut);
  const lineById = {};
  extras.forEach((line) => { lineById[extraId(line)] = line; });

  function priceLabel(extra) {
    const price = priceFor(extra, catalog);
    return price ? formatAmount(price.display) : '-';
  }

  function categoryOf(key) {
    return catalog && catalog.items[key] ? catalog.items[key].category : null;
  }

  function programRow(program) {
    const id = extraId({ kind: 'program', key: program.key });
    const line = lineById[id];
    const slots = slotsFor(program.key, categoryOf(program.key));
    const problem = line ? extraProblem(line, stay, categoryOf(program.key)) : '';
    function toggle() {
      if (line) { removeExtra(id); return; }
      addExtra({ kind: 'program', key: program.key, date: '', time: slots ? slots[0] : '' });
    }
    return {
      id,
      title: program.title,
      href: program.href,
      meta: slots && slots.length === 1 ? `Starts ${fmtTime(slots[0])}` : '',
      price: priceLabel({ kind: 'program', key: program.key }),
      added: !!line,
      onToggle: toggle,
      fields: line ? (
        <>
          <Field label="Date" htmlFor={`x-${program.key}-date`} {...fieldNote(problem, 'date')}>
            <DateField id={`x-${program.key}-date`} label="Date" value={line.date} min={stay.checkIn} max={stay.checkOut} onChange={(date) => updateExtra(id, { date })} />
          </Field>
          <Field label="Start time" htmlFor={`x-${program.key}-time`} {...fieldNote(problem, 'time')}>
            <Select id={`x-${program.key}-time`} label="Start time" value={line.time} placeholder="Pick a time" options={timeOptions(slots)} onChange={(time) => updateExtra(id, { time })} />
          </Field>
        </>
      ) : null,
    };
  }

  function transferRow(transfer) {
    const id = extraId({ kind: 'transfer', dir: transfer.id });
    const line = lineById[id];
    const problem = line ? extraProblem(line, stay, null) : '';
    function toggle() {
      if (line) { removeExtra(id); return; }
      addExtra({ kind: 'transfer', dir: transfer.id, key: TRANSFER_KEY, flight: '', time: '' });
    }
    return {
      id,
      title: transfer.title,
      meta: `${transfer.id === 'arrival' ? 'On your check-in day' : 'On your check-out day'} · per car`,
      price: priceLabel({ kind: 'transfer' }),
      added: !!line,
      onToggle: toggle,
      fields: line ? (
        <>
          <Field label="Flight number" htmlFor={`x-${transfer.id}-flight`}>
            <Input id={`x-${transfer.id}-flight`} type="text" placeholder="e.g. QZ 512" value={line.flight || ''} onChange={(event) => updateExtra(id, { flight: event.target.value })} />
          </Field>
          <Field label={transfer.id === 'arrival' ? 'Landing time' : 'Pickup time'} htmlFor={`x-${transfer.id}-time`} {...fieldNote(problem, 'time')}>
            <Select id={`x-${transfer.id}-time`} label="Time" value={line.time || ''} placeholder="Pick a time" options={timeOptions(null)} onChange={(time) => updateExtra(id, { time })} />
          </Field>
        </>
      ) : null,
    };
  }

  const groups = [];
  if (hasDates) {
    PROGRAM_GROUPS.forEach((group) => {
      const rows = EXTRA_PROGRAMS.filter((program) => program.group === group.id && isOffered(program.key, catalog)).map(programRow);
      if (rows.length) groups.push({ ...group, rows });
    });
    groups.push({ id: 'transfers', title: 'Airport transfer', note: 'Ngurah Rai airport to your villa and back, a private car for up to 5 guests.', rows: TRANSFERS.map(transferRow) });
  }
  groups.push({
    id: 'services',
    title: 'At the villa',
    note: 'Paid at the villa on the day, not charged in advance.',
    rows: SERVICES.map((service) => ({
      id: `service:${service.id}`,
      title: service.label,
      href: service.href,
      meta: 'Paid at the villa',
      price: null,
      added: services.includes(service.id),
      onToggle: () => onToggleService(service.id),
    })),
  });

  return (
    <div>
      {!hasDates && (
        <p className="m-0 mb-4 text-body text-muted">Pick your stay dates on a villa page to add tours, activities and airport transfers.</p>
      )}
      <ExtrasPanel groups={groups} linkAs={Link} />
    </div>
  );
}
