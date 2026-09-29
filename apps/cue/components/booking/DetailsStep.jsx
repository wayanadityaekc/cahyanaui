import DateTimeField from '@/components/ui/DateTimeField';
import DateField from '@/components/ui/DateField';
import { GROUP, LABEL, INPUT, BTN, FIELD_ERR } from '@/components/ui/modalClasses';
import { HINT } from './bookingModalClasses';

// Step 1: contact fields, then one date and time control per line (the airport leg uses its flight date/time).
export default function DetailsStep({
  f, errors, set, setValue, view, lines, needsFlight, isAirportLine, lineDateTime, setDT, categoryOfLine, dtErr, onContinue,
}) {
  return (
    <>
      <div className={GROUP}>
        <label className={LABEL} htmlFor="booker-name">Your Name</label>
        <input className={INPUT} type="text" id="booker-name" placeholder="Enter your name" value={f.name} onChange={set('name')} aria-invalid={!!errors.name} />
        {errors.name && <small role="alert" className={FIELD_ERR}>{errors.name}</small>}
      </div>
      <div className={GROUP}>
        <label className={LABEL} htmlFor="booker-phone">Phone Number</label>
        <input className={INPUT} type="tel" id="booker-phone" placeholder="e.g. +61 412 345 678" value={f.phone} onChange={set('phone')} aria-invalid={!!errors.phone} />
        {errors.phone && <small role="alert" className={FIELD_ERR}>{errors.phone}</small>}
      </div>
      <div className={GROUP}>
        <label className={LABEL} htmlFor="booker-email">Email</label>
        <input className={INPUT} type="email" id="booker-email" placeholder="you@email.com" value={f.email} onChange={set('email')} aria-invalid={!!errors.email} />
        {errors.email && <small role="alert" className={FIELD_ERR}>{errors.email}</small>}
      </div>
      <div className={GROUP}>
        <label className={LABEL} htmlFor="pickup">Pick-up Location</label>
        <input className={INPUT} type="text" id="pickup" placeholder="Hotel / villa name or area" value={f.pickup} onChange={set('pickup')} aria-invalid={!!errors.pickup} />
        {errors.pickup && <small role="alert" className={FIELD_ERR}>{errors.pickup}</small>}
      </div>
      {view.dropoffRequired !== false && (
        <div className={GROUP}>
          <label className={LABEL} htmlFor="dropoff">Drop-off Location</label>
          <input className={INPUT} type="text" id="dropoff" placeholder="Where should we drop you off?" value={f.dropoff} onChange={set('dropoff')} aria-invalid={!!errors.dropoff} />
          {errors.dropoff && <small role="alert" className={FIELD_ERR}>{errors.dropoff}</small>}
        </div>
      )}
      {needsFlight && (
        <div className={GROUP}>
          <label className={LABEL} htmlFor="flight-number">Flight Number</label>
          <input className={INPUT} type="text" id="flight-number" placeholder="e.g. QZ7501" value={f.flightNumber} onChange={set('flightNumber')} aria-invalid={!!errors.flightNumber} />
          {errors.flightNumber && <small role="alert" className={FIELD_ERR}>{errors.flightNumber}</small>}
        </div>
      )}

      {lines.map((l, i) =>
        isAirportLine(l) && i === 0 && needsFlight ? (
          // Airport leg: one flight date/time control with real minutes; do not add a second date field here.
          <div className={GROUP} key={`dt${i}`}>
            <label className={LABEL} htmlFor="flight-datetime">Flight date &amp; time</label>
            <DateTimeField id="flight-datetime" label="Flight date & time" value={f.flightDatetime} onChange={setValue('flightDatetime')} />
            <small className={HINT}>We use this as your pick-up time, so you are collected for this flight.</small>
            {errors.flightDatetime && <small role="alert" className={FIELD_ERR}>{errors.flightDatetime}</small>}
          </div>
        ) : (
          <div className={GROUP} key={`dt${i}`}>
            <label className={LABEL} htmlFor={`bk-dt-${i}`}>
              {lines.length > 1 ? `${l.day_no ? `Day ${l.day_no} · ` : ''}${l.service}` : 'Date & time'}
            </label>
            <DateField
              id={`bk-dt-${i}`}
              label="Date & time"
              value={lineDateTime(i).date}
              onChange={(v) => setDT(i, 'date', v)}
              placeholder="Select date"
              withTime
              time={lineDateTime(i).time}
              onTimeChange={(v) => setDT(i, 'time', v)}
              category={categoryOfLine(l)}
              itemName={l.service}
            />
            {dtErr[i] && <small role="alert" className={FIELD_ERR}>{dtErr[i]}</small>}
          </div>
        ),
      )}

      <button className={BTN} onClick={onContinue}>Continue</button>
    </>
  );
}
