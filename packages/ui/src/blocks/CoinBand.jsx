import Button from '../primitives/Button.jsx';
import Coin from '../primitives/Coin.jsx';

const WRAP = 'max-w-[var(--container)] mx-auto px-[var(--container-x)] mt-[var(--space-3)]';
const PANEL =
  'flex items-center gap-[var(--space-2)] rounded-md bg-cream py-3 px-[var(--space-2)] max-[768px]:flex-wrap';
const TEXT_BOX = 'flex-1 min-w-0 max-[768px]:basis-[calc(100%-56px)]';
const TITLE =
  'inline m-0 mr-[var(--space-1)] text-[0.875rem] leading-[1.4] font-semibold text-gold max-[768px]:block max-[768px]:mr-0';
const TEXT = 'inline m-0 text-body leading-[1.6] text-green max-[768px]:block';
const SIDE = 'flex flex-none items-center gap-[var(--space-2)]';
const BALANCE = 'm-0 whitespace-nowrap text-body text-green';
const BIG = 'font-semibold text-gold';

export default function CoinBand({
  hook = '',
  title = '',
  text = '',
  learnLabel = '',
  learnHref = '',
  balance = null,
  balanceLabel = '',
  linkAs = 'a',
  coinSrc,
  className = '',
}) {
  const hasBalance = balance !== null && balance !== undefined;
  return (
    <section className={`${WRAP} ${className}`} data-coin-band aria-label={hook || undefined}>
      <div className={PANEL} data-coin-panel>
        <Coin size="xl" shine still src={coinSrc} />
        <div className={TEXT_BOX}>
          <h2 className={TITLE}>{title}</h2>
          {text ? <p className={TEXT}>{text}</p> : null}
        </div>
        <div className={SIDE} data-coin-side>
          {hasBalance ? (
            <p className={BALANCE}>
              <span className={BIG} data-coin-balance-big>
                {balance}
              </span>{' '}
              {balanceLabel}
            </p>
          ) : null}
          {learnHref ? (
            <Button as={linkAs} href={learnHref} variant="ghost" data-coin-learn>
              {learnLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
