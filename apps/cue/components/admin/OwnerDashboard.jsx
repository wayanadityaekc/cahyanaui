'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CalendarDays, History, HelpCircle, RefreshCw, LogOut } from 'lucide-react';
import RailLayout from '@/components/ui/RailLayout';
import { RAIL_PAGE } from '@/components/ui/railClasses';
import { BTN_SM } from '@/components/ui/btnClasses';
import { FIELD_INPUT } from '@/components/ui/formClasses';
import AdminLogin from './AdminLogin';
import BookingCard from './BookingCard';
import { readToken, logout, getJson, Unauthorized } from './adminApi';

// The owner's view of the bookings, on the site's own shell (Wayan: "gua mau
// dasboardnya kayak web frontend nya punya page tapi isinya data kita dan gak
// semua orang bisa masuk, harus login dulu").
//
// RailLayout is the shell Our Company, My Trips and the guide articles already
// use, so this page inherits the sticky rail, the phone's two screens and the
// page gutter without a fourth copy of any of it. The sections are the four
// buckets the API splits bookings into.

const SECTIONS = [
  { id: 'attention', label: 'Needs attention', Icon: AlertTriangle },
  { id: 'upcoming', label: 'Upcoming', Icon: CalendarDays },
  { id: 'past', label: 'Past', Icon: History },
  { id: 'undated', label: 'No date', Icon: HelpCircle, split: true },
];

const H1 = 'font-head font-medium tracking-[-0.01em] text-display text-green m-0 mb-[0.3rem]';
const SUB = 'font-body text-body text-muted m-0 mb-[var(--space-3)]';
const TOOLS = 'flex items-center gap-[var(--space-2)] mb-[var(--space-3)] flex-wrap';
const GHOST =
  `inline-flex ${BTN_SM} gap-[0.4rem] bg-white text-gold [border:1px_solid_var(--line)] cursor-pointer ` +
  '[&>svg]:w-[var(--icon-sm)] [&>svg]:h-[var(--icon-sm)] [&>svg]:shrink-0 ' +
  '[transition:background-color_var(--dur)_var(--ease),scale_var(--dur-fast)_var(--ease)] hover:bg-cream';
const EMPTY = 'font-body text-body text-muted m-0 py-[var(--space-3)]';
const ERR = 'font-body text-body text-err m-0 py-[var(--space-3)]';
const COUNT = 'ml-auto font-body text-small text-muted tabular-nums';

// A booking is searched by the things the owner actually has in hand when they
// go looking: a ref from an email, a name, a phone number.
function matches(g, q) {
  if (!q) return true;
  const hay = [g.ref, g.name, g.phone, g.email, ...g.lines.map((l) => l.service)]
    .filter(Boolean).join(' ').toLowerCase();
  return hay.includes(q);
}

export default function OwnerDashboard() {
  // null = we have not looked yet, '' = looked and there is no session. Starting
  // at null keeps the first paint identical to the prerendered HTML, which a
  // static export requires.
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState('upcoming');
  // Phone: land straight on the bookings, not on the menu. Same call My Trips
  // makes and for the same reason - this page HAS an obvious default (Upcoming),
  // and an owner opening it wants the bookings, not a list of section names.
  // Our Company starts on the list because it has no default. Back still reaches
  // the list from here.
  const [reading, setReading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => setToken(readToken() || ''), []);

  const load = useCallback(async (t) => {
    setBusy(true);
    setErr('');
    try {
      setData(await getJson('/admin/bookings', t));
    } catch (e) {
      if (e instanceof Unauthorized) {
        // An expired session is not an error to read: drop it and show the door.
        setToken('');
        setData(null);
      } else {
        setErr(e.message || 'Could not load bookings.');
      }
    }
    setBusy(false);
  }, []);

  useEffect(() => {
    if (token) load(token);
  }, [token, load]);

  if (token === null) return <div className={RAIL_PAGE} />;

  if (!token) {
    return (
      <div className={RAIL_PAGE}>
        <AdminLogin onToken={setToken} />
      </div>
    );
  }

  const query = q.trim().toLowerCase();
  const rows = data ? (data[tab] || []).filter((g) => matches(g, query)) : [];
  const items = SECTIONS.map((s) => ({
    ...s,
    label: (
      <>
        {s.label}
        {data && <span className={COUNT}>{(data[s.id] || []).length}</span>}
      </>
    ),
  }));

  return (
    <div className={RAIL_PAGE}>
      <h1 className={H1}>Dashboard</h1>
      <p className={SUB}>
        Bookings as they stand{data?.today ? ` - today in Bali is ${data.today}` : ''}.
      </p>

      <RailLayout
        label="Bookings"
        items={items}
        active={tab}
        onSelect={(id) => { setTab(id); setReading(true); }}
        reading={reading}
        onBack={() => setReading(false)}
      >
        <div className={TOOLS}>
          <input
            className={`${FIELD_INPUT} !w-auto flex-1 min-w-[180px]`}
            placeholder="Search ref, name, phone"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search bookings"
          />
          <button type="button" className={GHOST} onClick={() => load(token)} disabled={busy}>
            <RefreshCw strokeWidth={1.7} aria-hidden="true" />
            {busy ? 'Loading' : 'Refresh'}
          </button>
          {/* Sign out lives HERE, not in the rail's help card, because on a phone
              that card sits on the section list - so it would be hidden behind a
              menu tap. Measured: unreachable at 390 and 768. Signing out of an
              admin view is not something to bury. */}
          <button
            type="button"
            className={GHOST}
            onClick={async () => { await logout(token); setToken(''); }}
          >
            <LogOut strokeWidth={1.7} aria-hidden="true" />
            Sign out
          </button>
        </div>

        {err && <p className={ERR}>{err}</p>}
        {!err && !data && <p className={EMPTY}>Loading bookings...</p>}
        {!err && data && rows.length === 0 && (
          <p className={EMPTY}>
            {query ? 'Nothing matches that search.' : 'Nothing here.'}
          </p>
        )}
        {rows.map((g) => <BookingCard key={g.ref || g.id} g={g} />)}
      </RailLayout>
    </div>
  );
}
