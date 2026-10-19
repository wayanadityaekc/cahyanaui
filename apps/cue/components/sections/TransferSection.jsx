import TransferPicker from '@/components/sections/TransferPicker';
import TransferRoutes from '@/components/sections/TransferRoutes';
import TransferRouteProvider from '@/components/sections/TransferRouteProvider';
import Prose from '@/components/prose/Prose';
import FormHero from '@/components/sections/FormHero';
import { detailBlocks } from '@/lib/detailBlocks';
import { TRANSFER } from '@/content/shared/transfer';

export default function TransferSection() {
  return (
    <TransferRouteProvider>
      <FormHero
        page="transfer"
        title={TRANSFER.title}
        sub={TRANSFER.desc}
        photo="coastal-road-beach-bali.webp"
        alt="A coastal road running along a beach on the south Bali cliffs"
        details={
          <>
            <TransferRoutes />
            <Prose blocks={detailBlocks('Transfer Details', TRANSFER.tinfo)} headingVariant="company" />
          </>
        }
      >
        <TransferPicker />
      </FormHero>
    </TransferRouteProvider>
  );
}
