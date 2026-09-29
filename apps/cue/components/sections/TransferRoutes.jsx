'use client';

import Price from '@/components/Price';
import { SECTION_TITLE, ST_LEFT } from '@/components/ui/sectionTitle';
import { TRANSFER } from '@/content/shared/transfer';
import { useTransferRoute } from '@/components/sections/TransferRouteProvider';

// Route cards pre-fill the picker (r.key must match picker option names); Airport links to /airport-transfer instead.
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
          // Same CARD and Face for link and button, so only the tap behaviour differs.
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
