import DateTimeField from '@/components/ui/DateTimeField';
import DateField from '@/components/ui/DateField';
import { GROUP, LABEL, INPUT, BTN, FIELD_ERR } from '@/components/ui/modalClasses';
import { HINT } from './bookingModalClasses';

export default function DetailsStep({
  f: form,
  errors,
  set,
  setValue,
  view,
  lines,
  needsFlight,
  isAirportLine,
  lineDateTime,
  setDT,
  categoryOfLine,
  dtErr,
  onContinue,
}) {
  return (
    <>
      <div className={GROUP}>
        <label className={LABEL} htmlFor="booker-name">
          Your Name
        </label>
        <input
          className={INPUT}
          type="text"
          id="booker-name"
          placeholder="Enter your name"
          value={form.name}
          onChange={set('name')}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <small role="alert" className={FIELD_ERR}>
            {errors.name}
          </small>
        )}
      </div>
      <div className={GROUP}>
        <label className={LABEL} htmlFor="booker-phone">
          Phone Number
        </label>
        <input
          className={INPUT}
          type="tel"
          id="booker-phone"
          placeholder="e.g. +61 412 345 678"
          value={form.phone}
          onChange={set('phone')}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <small role="alert" className={FIELD_ERR}>
            {errors.phone}
          </small>
        )}
      </div>
      <div className={GROUP}>
        <label className={LABEL} htmlFor="booker-email">
          Email
        </label>
        <input
          className={INPUT}
          type="email"
          id="booker-email"
          placeholder="you@email.com"
          value={form.email}
          onChange={set('email')}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <small role="alert" className={FIELD_ERR}>
            {errors.email}
          </small>
        )}
      </div>
      <div className={GROUP}>
        <label className={LABEL} htmlFor="pickup">
          Pick-up Location
        </label>
        <input
          className={INPUT}
          type="text"
          id="pickup"
          placeholder="Hotel / villa name or area"
          value={form.pickup}
          onChange={set('pickup')}
          aria-invalid={!!errors.pickup}
        />
        {errors.pickup && (
          <small role="alert" className={FIELD_ERR}>
            {errors.pickup}
          </small>
        )}
      </div>
      {view.dropoffRequired !== false && (
        <div className={GROUP}>
          <label className={LABEL} htmlFor="dropoff">
            Drop-off Location
          </label>
          <input
            className={INPUT}
            type="text"
            id="dropoff"
            placeholder="Where should we drop you off?"
            value={form.dropoff}
            onChange={set('dropoff')}
            aria-invalid={!!errors.dropoff}
          />
          {errors.dropoff && (
            <small role="alert" className={FIELD_ERR}>
              {errors.dropoff}
            </small>
          )}
        </div>
      )}
      {needsFlight && (
        <div className={GROUP}>
          <label className={LABEL} htmlFor="flight-number">
            Flight Number
          </label>
          <input
            className={INPUT}
            type="text"
            id="flight-number"
            placeholder="e.g. QZ7501"
            value={form.flightNumber}
            onChange={set('flightNumber')}
            aria-invalid={!!errors.flightNumber}
          />
          {errors.flightNumber && (
            <small role="alert" className={FIELD_ERR}>
              {errors.flightNumber}
            </small>
          )}
        </div>
      )}

      {lines.map((line, index) =>
        isAirportLine(line) && index === 0 && needsFlight ? (
          <div className={GROUP} key={`dt${index}`}>
            <label className={LABEL} htmlFor="flight-datetime">
              Flight date &amp; time
            </label>
            <DateTimeField
              id="flight-datetime"
              label="Flight date & time"
              value={form.flightDatetime}
              onChange={setValue('flightDatetime')}
            />
            <small className={HINT}>We use this as your pick-up time, so you are collected for this flight.</small>
            {errors.flightDatetime && (
              <small role="alert" className={FIELD_ERR}>
                {errors.flightDatetime}
              </small>
            )}
          </div>
        ) : (
          <div className={GROUP} key={`dt${index}`}>
            <label className={LABEL} htmlFor={`bk-dt-${index}`}>
              {lines.length > 1 ? `${line.day_no ? `Day ${line.day_no} · ` : ''}${line.service}` : 'Date & time'}
            </label>
            <DateField
              id={`bk-dt-${index}`}
              label="Date & time"
              value={lineDateTime(index).date}
              onChange={(dateValue) => setDT(index, 'date', dateValue)}
              placeholder="Select date"
              withTime
              time={lineDateTime(index).time}
              onTimeChange={(timeValue) => setDT(index, 'time', timeValue)}
              category={categoryOfLine(line)}
              itemName={line.service}
            />
            {dtErr[index] && (
              <small role="alert" className={FIELD_ERR}>
                {dtErr[index]}
              </small>
            )}
          </div>
        ),
      )}

      <button className={BTN} onClick={onContinue}>
        Continue
      </button>
    </>
  );
}
