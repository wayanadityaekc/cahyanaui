'use client';

import { AvailabilityCalendar, Container, Section } from '@cahyana/ui';
import { STAY_RULES } from '@/lib/availability';

const NOTE = 'mb-5 p-4 rounded-md bg-cream text-small text-green';

// The villa's own calendar, full width: open nights to pick, booked nights struck through (Airbnb + our own bookings).
export default function VillaAvailability({ villa = null, value = {}, onChange = () => {}, availability = { status: 'loading', busy: [] }, today = '' }) {
  if (!villa) return <p className="text-body text-muted">Sorry, we could not load this information. Please try again.</p>;
  const unknown = availability.status === 'unknown';
  return (
    <Section bare id="availability" className="scroll-mt-[var(--header-h,72px)]">
      <Container>
        <h2 className="text-h2 font-medium text-gold mb-1">Availability</h2>
        <p className="text-small text-muted mb-6">
          Pick your check-in, then your check-out. Booked nights are struck through; the minimum stay is {STAY_RULES.minNights} nights.
        </p>
        {/* Drawn only once today's Bali date is known in the browser; a build-time "today" would be stale. */}
        {!today ? <div className="min-h-[420px]" aria-busy="true" /> : <AvailabilityCalendar
          value={value}
          onChange={onChange}
          busy={availability.busy}
          today={today}
          minNights={STAY_RULES.minNights}
          maxNights={STAY_RULES.maxNights}
          maxDaysAhead={STAY_RULES.maxDaysAhead}
          loading={availability.status === 'loading'}
          note={unknown ? (
            <p role="status" className={NOTE} data-availability="unknown">
              We can&apos;t load {villa.name}&apos;s live calendar right now. You can still pick dates - our team will confirm them by hand on WhatsApp.
            </p>
          ) : null}
        />}
      </Container>
    </Section>
  );
}
