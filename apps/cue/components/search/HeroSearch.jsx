'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { useTripPrefs } from '@/state/TripPrefsProvider';
import { usePricing } from '@/state/PricingProvider';
import { useReferral } from '@/state/ReferralProvider';
import { withSymbol, withDeemphasizedThousands } from '@/components/Price';
import useMobile from '@/components/ui/useMobile';
import DragSheet from '@/components/ui/DragSheet';
import Overlay from '@/components/ui/Overlay';
import CurrencyPicker from '@/components/layout/CurrencyPicker';
import { REFMSG } from '@/components/ui/modalClasses';
import FlagDefs from '@/components/layout/FlagDefs';
import InfoPopover from '@/components/ui/InfoPopover';
import Select from '@/components/ui/Select';
import PickupAreaSelect from '@/components/ui/PickupAreaSelect';
import { CONTROL, CHEV, CONTROL_VAL, CONTROL_VAL_PLACEHOLDER, panelMenu, PANEL_HEAD_MENU, PANEL_HEAD_H3, PANEL_CLOSE_SHEET, PANEL_BODY_MENU, optMenu, HS_OPT_IC, HS_OPT_NM, HS_OPT_PR } from '@/components/ui/hsClasses';
import { EXPLORE_OPTIONS } from '@/content/shared/explore-options';

const GUESTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// .hsearch__field > label (dulu di style.css) - dipake berkali di file ini.
const FIELD_LABEL = 'block text-small font-medium text-green mb-[0.4rem] font-body tracking-normal normal-case';

export default function HeroSearch({ onClose, sheetOpen = false }) {
  const { guests, setGuests, currency } = useTripPrefs();
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
    const isIdr = currency === 'IDR';
    const loc = isIdr ? 'id-ID' : 'en-US';
    const fmt = (n) => withSymbol(symbol + n.toLocaleString(loc));
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
      // Only the low end carries the "Rp"/"$" symbol (unchanged shape) - the
      // bare high-end number still gets the small-thousands treatment for IDR
      // so both ends of the range read consistently.
      const hiText = isIdr ? withDeemphasizedThousands(hi.toLocaleString(loc)) : hi.toLocaleString(loc);
      out[cat] = lo === hi ? <>from {fmt(lo)}</> : <>{fmt(lo)}–{hiText}</>;
    }
    return out;
  }, [catalog, symbol, currency]);

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
            <span className={HS_OPT_IC}><o.Icon strokeWidth={1.6} /></span>
            <span className={HS_OPT_NM}>
              {o.name}
              <small>{o.sub}</small>
            </span>
            <span className={HS_OPT_PR}>{ranges[o.cat] || ''}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <DragSheet
      enabled={isMobile && sheetOpen}
      onDismiss={onClose}
      className={`relative flex-shrink-0 w-[420px] bg-white rounded-lg shadow-xl p-6 text-green
        animate-[heroCardIn_0.5s_var(--ease)_backwards] motion-reduce:animate-none
        max-[992px]:fixed max-[992px]:left-0 max-[992px]:right-0 max-[992px]:bottom-0 max-[992px]:z-[45] max-[992px]:w-auto
        max-[992px]:max-h-[90vh] max-[992px]:overflow-y-auto max-[992px]:[scrollbar-width:none] max-[992px]:[&::-webkit-scrollbar]:hidden max-[992px]:rounded-t-[var(--r-xl)] max-[992px]:rounded-b-none
        max-[992px]:pt-[1.9rem] max-[992px]:animate-none
        max-[992px]:[transition:translate_var(--dur-slow)_var(--ease),visibility_var(--dur-slow)]
        max-[992px]:shadow-[0_-12px_48px_rgba(26,26,26,0.28)]
        max-[992px]:before:content-[''] max-[992px]:before:absolute max-[992px]:before:top-[0.6rem] max-[992px]:before:left-1/2
        max-[992px]:before:[transform:translateX(-50%)] max-[992px]:before:w-10 max-[992px]:before:h-1 max-[992px]:before:rounded-full
        max-[992px]:before:bg-[#d9d5cc]
        ${sheetOpen ? 'max-[992px]:translate-y-0 max-[992px]:visible' : 'max-[992px]:translate-y-full max-[992px]:invisible'}`}
      id="hero-search"
    >
      {onClose && (
        <button
          type="button"
          className="absolute top-[0.9rem] right-[0.9rem] w-[30px] h-[30px] flex items-center justify-center border border-line
            rounded-[50%] bg-white text-green text-[1.2rem] leading-none cursor-pointer min-[993px]:hidden"
          aria-label="Close"
          onClick={onClose}
        >
          &times;
        </button>
      )}
      <h2 className="font-head text-h3 font-medium tracking-[-0.01em] leading-[1.15] text-center text-gold mb-6">Plan your trip</h2>

      <div className="mb-[0.8rem] relative" ref={ddRef}>
        <label className={FIELD_LABEL}>
          How do you want to explore?
          <InfoPopover variant="hero">
            <p className="!mb-[0.6rem] pb-[0.6rem] [border-bottom:1px_solid_#f2efe7] !font-semibold !text-green">
              Pick what you want to do, choose your dates, set how many guests and where we pick you up, then choose
              your currency. Tap Explore to see the options with real prices.
            </p>
            <p>On each program page you can choose Standard or Exclusive when you book.</p>
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
          <ChevronDown className={CHEV} />
        </button>
        {/* Portal-mounted once mobile+mounted (not gated on `open`) so the sheet has a
            "closed" frame to transition FROM instead of popping in already-open. */}
        {mounted && isMobile && createPortal(panel, document.body)}
        {mounted && isMobile && <Overlay open={open} onClose={() => setOpen(false)} />}
        {(!isMobile || !mounted) && panel}
      </div>

      <div className="mb-[0.8rem]">
        <label className={FIELD_LABEL} htmlFor="hs-referral">Referral code</label>
        <div className="flex gap-2">
          <input
            type="text"
            id="hs-referral"
            className="[flex:1_1_auto] min-w-0 border border-line rounded-md px-[0.85rem] py-0 h-[var(--field-h)] bg-white font-body
              font-medium text-field text-green uppercase [transition:border-color_var(--dur-fast)_ease,box-shadow_var(--dur-fast)_ease]
              placeholder:text-muted placeholder:normal-case placeholder:font-normal
              focus:outline-none focus:[border-color:var(--color-gold)] focus:[box-shadow:var(--focus-ring)]
              disabled:bg-cream disabled:text-gold-d disabled:[border-color:rgba(34,32,28,0.5)]"
            placeholder="Have a code?"
            autoComplete="off"
            spellCheck="false"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="button"
            className="flex-none border-none rounded-pill py-[0.72rem] px-[1.15rem] bg-cta text-white font-body font-semibold
              text-[1rem] cursor-pointer [transition:background_var(--dur-fast)_ease,scale_var(--dur-fast)_var(--ease)] hover:bg-cta-d"
            onClick={applyCode}
          >
            Apply
          </button>
        </div>
        {refMsg && <small className={REFMSG}>{refMsg}</small>}
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-[0.8rem]">
        <div className="mb-[0.8rem]">
          <label className={FIELD_LABEL} htmlFor="hs-guests">Guests</label>
          <Select
            id="hs-guests"
            label="Guests"
            value={guests || 2}
            onChange={setGuests}
            options={GUESTS.map((n) => ({ value: String(n), label: `${n} ${n === 1 ? 'guest' : 'guests'}` }))}
          />
        </div>
        <div className="mb-[0.8rem]">
          <label className={FIELD_LABEL} htmlFor="hs-stay">Pickup area</label>
          <PickupAreaSelect id="hs-stay" />
        </div>
      </div>

      <div className="mb-[0.8rem]">
        <label className={FIELD_LABEL}>Show prices in</label>
        <FlagDefs />
        <CurrencyPicker variant="hero" />
      </div>

      <button
        type="button"
        className="w-full mt-[0.4rem] bg-cta text-white border-none rounded-pill p-[0.9rem] font-body font-semibold text-strong cursor-pointer
          [transition:translate_var(--dur)_var(--ease-out),box-shadow_var(--dur)_var(--ease-out),background-color_var(--dur)_var(--ease-out),scale_var(--dur-fast)_var(--ease)] hover:-translate-y-0.5 hover:shadow-lg hover:bg-cta-d"
        onClick={go}
      >
        Explore
      </button>
    </DragSheet>
  );
}
