'use client';

import Price from '@/components/Price';
import { SECTION_TITLE } from '@/components/ui/sectionTitle';
import { TRANSFER } from '@/content/shared/transfer';
import { useTransferRoute } from '@/components/sections/TransferRouteProvider';

// The six "Popular routes" cards. Split out of TransferSection so they can be
// client code (they need to drive the picker) while the details card below them
// stays server-rendered.
//
// These six had NO click handler until Sep 2026 - TransferSection is a server
// component, so the onClick the note promised could never have been attached.
// The markup below is unchanged from that dead version on purpose: this fixed
// the behaviour, not the look.
//
// r.key is the bare area name ("Airport", "Canggu Area"), which is exactly what
// TransferPicker's options carry - catalog routes with the " – Ubud" suffix
// stripped. Keep those two in step if either side changes.
export default function TransferRoutes() {
  const { selectRoute } = useTransferRoute();
  return (
    <>
      <h2 className={SECTION_TITLE}>{TRANSFER.routesTitle}</h2>
      <p className="text-center text-muted text-[0.8rem] mt-[0.2rem] mb-[1.4rem]">{TRANSFER.routesNote}</p>
      <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-[0.6rem] mb-[var(--space-5)]">
        {TRANSFER.routes.map((r) => (
          <button type="button" className="flex items-center gap-3 border border-line rounded-md py-[0.55rem] px-[0.85rem] bg-white cursor-pointer text-left font-body w-full transition-[border-color,scale] duration-[0.15s] hover:border-gold" key={r.key} onClick={() => selectRoute(r.key)}>
            <span className="w-[46px] h-[46px] rounded-md bg-cover bg-center shrink-0" style={{ backgroundImage: `url(/assets/images/${r.bg})` }} />
            <span className="flex flex-col">
              <span className="font-semibold text-green text-h3">{r.name}</span>
              <span className="text-muted text-small mt-[0.1rem]">{r.meta}</span>
            </span>
            <Price name={r.priceName} fallback={r.priceFallback} className="ml-auto text-amber font-semibold" />
          </button>
        ))}
      </div>
    </>
  );
}
