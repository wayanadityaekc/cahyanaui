'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useReferral } from '@/state/ReferralProvider';
import useMobile from '@/components/ui/useMobile';
import Overlay from '@/components/ui/Overlay';
import CurrencyPicker from '@/components/layout/CurrencyPicker';
import { REFMSG } from '@/components/ui/modalClasses';
import FlagDefs from '@/components/layout/FlagDefs';
import InfoPopover from '@/components/ui/InfoPopover';
import Select from '@/components/ui/Select';
import { CONTROL, CHEV, CONTROL_VAL, CONTROL_VAL_PLACEHOLDER, panelMenu, PANEL_HEAD_MENU, PANEL_HEAD_H3, PANEL_CLOSE_SHEET, PANEL_BODY_MENU, optMenu } from '@/components/ui/hsClasses';
import { EXPLORE_OPTIONS } from '@/content/shared/explore-options';

const GUESTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function HeroSearch({ onClose, sheetOpen = false }) {
  const { guests, setGuests, stay, setStay, currency } = useTripPrefs();
  const pricing = usePricing();
  const { apply } = useReferral();
  const isMobile = useMobile();

  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(null);
  const [code, setCode] = useState('');
  const [refMsg, setRefMsg] = useState('');
  const [mounted, setMounted] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || isMobile) return;
    const onDoc = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [open, isMobile]);

  const catalog = pricing && pricing.catalog;
  const symbol = (catalog && catalog.symbol) || '$';

  const ranges = useMemo(() => {
    const out = {};
    if (!catalog) return out;
    const fmt = (n) => symbol + n.toLocaleString(currency === 'IDR' ? 'id-ID' : 'en-US');
    const byCat = (cats) => catalog.items.filter((i) => cats.includes(i.category)).map((i) => i.standard.display);
    const sets = {
      tour: byCat(['tour', 'combo']),
      experience: byCat(['experience']),
      destination: byCat(['place']),
      transfer: catalog.transfers.map((t) => t.display),
      charter: catalog.charters.map((c) => c.display),
    };
    for (const [cat, arr] of Object.entries(sets)) {
      if (!arr.length) continue;
      const lo = Math.min(...arr);
      const hi = Math.max(...arr);
      out[cat] = lo === hi ? 'from ' + fmt(lo) : fmt(lo) + '–' + hi.toLocaleString(currency === 'IDR' ? 'id-ID' : 'en-US');
    }
    return out;
  }, [catalog, symbol, currency]);

  const stayOptions = useMemo(() => {
    const base = [{ value: 'ubud', label: 'Ubud & nearby' }];
    if (!catalog) return base;
    return base.concat(catalog.transfers.map((t) => ({ value: t.route, label: t.route })));
  }, [catalog]);

  const applyCode = async () => {
    const pct = await apply(code);
    setRefMsg(pct ? `Referral applied - ${pct}% off!` : 'Code not valid.');
  };

  const go = () => {
    if (picked) window.location.href = picked.href;
  };

  const panel = (
    <div className={panelMenu(open)}>
      <div className={PANEL_HEAD_MENU}>
        <h3 className={PANEL_HEAD_H3}>How to explore</h3>
        <button type="button" className={PANEL_CLOSE_SHEET} aria-label="Close" onClick={() => setOpen(false)}>&times;</button>
      </div>
      <div className={PANEL_BODY_MENU}>
        {EXPLORE_OPTIONS.map((o) => (
          <button
            type="button"
            key={o.href}
            className={optMenu(picked && picked.href === o.href)}
            onClick={() => {
              if (o.all) {
                window.location.href = o.href;
                return;
              }
              setPicked(o);
              setOpen(false);
            }}
          >
            <span className="hs-opt__ic" dangerouslySetInnerHTML={{ __html: o.icon }} />
            <span className="hs-opt__nm">
              {o.name}
              <small>{o.sub}</small>
            </span>
            <span className="hs-opt__pr">{ranges[o.cat] || ''}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`hero__search${sheetOpen ? ' is-open' : ''}`} id="hero-search">
      {onClose && (
        <button type="button" className="hero__search-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
      )}
      <h2 className="hsearch__title">Plan your trip</h2>

      <div className="hsearch__field hsearch__dd" ref={ddRef}>
        <label>
          How do you want to explore?
          <InfoPopover>
            <p className="binfo__lead">
              Pick what you want to do, choose your dates, set how many guests and where we pick you up, then choose
              your currency. Tap Explore to see the options with real prices.
            </p>
            <p className="binfo__note">On each program page you can choose Standard or Exclusive when you book.</p>
          </InfoPopover>
        </label>
        <button
          type="button"
          className={CONTROL}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={picked ? CONTROL_VAL : CONTROL_VAL_PLACEHOLDER}>{picked ? picked.name : 'Choose'}</span>
          <svg className={CHEV} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {mounted && isMobile && open && createPortal(panel, document.body)}
        {mounted && isMobile && <Overlay open={open} onClose={() => setOpen(false)} />}
        {(!isMobile || !mounted) && panel}
      </div>

      <div className="hsearch__field hsearch__ref">
        <label htmlFor="hs-referral">Referral code</label>
        <div className="hsearch__refrow">
          <input
            type="text"
            id="hs-referral"
            className="hsearch__refinp"
            placeholder="Have a code?"
            autoComplete="off"
            spellCheck="false"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="button" className="hsearch__refbtn" onClick={applyCode}>Apply</button>
        </div>
        {refMsg && <small className={REFMSG}>{refMsg}</small>}
      </div>

      <div className="hsearch__row2">
        <div className="hsearch__field">
          <label htmlFor="hs-guests">Guests</label>
          <Select
            id="hs-guests"
            label="Guests"
            value={guests || 2}
            onChange={setGuests}
            options={GUESTS.map((n) => ({ value: String(n), label: `${n} ${n === 1 ? 'guest' : 'guests'}` }))}
          />
        </div>
        <div className="hsearch__field">
          <label htmlFor="hs-stay">Pickup area</label>
          <Select
            id="hs-stay"
            label="Pickup area"
            value={stay || 'ubud'}
            onChange={setStay}
            options={stayOptions}
          />
        </div>
      </div>

      <div className="hsearch__field hsearch__cur">
        <label>Show prices in</label>
        <FlagDefs />
        <CurrencyPicker />
      </div>

      <button type="button" className="hsearch__go" onClick={go}>Explore</button>
    </div>
  );
}
