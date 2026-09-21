'use client';

import Price from '@/components/Price';
import { SECTION_TITLE, ST_LEFT } from '@/components/ui/sectionTitle';
import { TRANSFER } from '@/content/shared/transfer';
import { useTransferRoute } from '@/components/sections/TransferRouteProvider';

// The six "Popular routes" cards. Split out of TransferSection so they can be
// client code (they need to drive the picker) while the details card below them
// stays server-rendered.
//
// These six had NO click handler until Sep 2026 - TransferSection is a server
// component, so the onClick the note promised could never have been attached.
//
// r.key is the bare area name ("Airport", "Canggu Area"), which is exactly what
// TransferPicker's options carry - catalog routes with the " – Ubud" suffix
// stripped. Keep those two in step if either side changes.
//
// THE AIRPORT CARD NOW LEAVES THE PAGE (Sep 2026, Wayan: "tulisan flying in or
// out delete aja bro, tapi kalo di klik airport ubud langsung mengarah ke page
// airport dan auto fill"). It links to /airport-transfer.html?dir=pickup, which
// arrives with the direction already set to arrival; guests rides along on its
// own because TripPrefs keeps it in localStorage.
//
// This REVERSES the earlier note here, which argued all six should behave the
// same ("making one card of six behave differently would be its own bug"). Wayan
// decided otherwise, and the reason holds up: the airport leg is the one that
// needs a flight number, and that field only exists on the other page. The prose
// line that used to say so is gone - the card says it by going there.
//
// The card is the ONLY link left from this page to /airport-transfer, so it also
// carries the internal link the split depends on. Its text already contains the
// keyword ("Airport → Ubud"), which is what the anchor-text rule asks for.
const CARD =
  'flex items-center gap-3 border border-line rounded-md py-[0.55rem] px-[0.85rem] bg-white cursor-pointer ' +
  'text-left font-body w-full no-underline transition-[border-color,scale] duration-[0.15s] hover:border-gold';

function Face({ r }) {
  return (
    <>
      <span className="w-[46px] h-[46px] rounded-md bg-cover bg-center shrink-0" style={{ backgroundImage: `url(/assets/images/${r.bg})` }} />
      <span className="flex flex-col">
        <span className="font-semibold text-green text-h3">{r.name}</span>
        <span className="text-muted text-small mt-[0.1rem]">{r.meta}</span>
      </span>
      <Price name={r.priceName} fallback={r.priceFallback} className="ml-auto text-amber font-semibold" />
    </>
  );
}

export default function TransferRoutes() {
  const { selectRoute } = useTransferRoute();
  return (
    <>
      <h2 className={`${SECTION_TITLE} ${ST_LEFT}`}>{TRANSFER.routesTitle}</h2>
      <p className="text-muted text-[0.8rem] mt-[0.2rem] mb-[1.4rem]">{TRANSFER.routesNote}</p>
      <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-[0.6rem] mb-[var(--space-5)]">
        {TRANSFER.routes.map((r) =>
          // Same CARD string and the same <Face> either way, so the two cannot
          // drift apart visually - only what the tap does differs.
          r.key === 'Airport' ? (
            <a className={CARD} href="/airport-transfer.html?dir=pickup" key={r.key}>
              <Face r={r} />
            </a>
          ) : (
            <button type="button" className={CARD} key={r.key} onClick={() => selectRoute(r.key)}>
              <Face r={r} />
            </button>
          ),
        )}
      </div>
    </>
  );
}
