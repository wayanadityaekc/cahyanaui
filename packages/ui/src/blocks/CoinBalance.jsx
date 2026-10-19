import Coin from '../primitives/Coin.jsx';

const CARD = 'flex items-center gap-4 rounded-lg bg-cream border border-line p-4';
const LEAD = 'text-label font-medium text-muted m-0';
const COUNT = 'font-semibold text-[1.125rem] text-green leading-tight m-0';
const NOTE = 'text-small text-muted m-0 mt-[0.2rem] leading-[var(--lh-body)]';
const ROW = 'inline-flex items-center gap-2';
const ROW_TEXT = 'text-small font-semibold text-green';

export default function CoinBalance({ lead = '', countText = '', notes = [], variant = 'card', coinSrc }) {
  if (variant === 'row') {
    return (
      <span className={ROW} data-coin-balance>
        <Coin size="sm" src={coinSrc} />
        <span className={ROW_TEXT}>{countText}</span>
      </span>
    );
  }
  return (
    <div className={CARD} data-coin-balance>
      <Coin size="lg" src={coinSrc} />
      <div className="min-w-0">
        {lead ? <p className={LEAD}>{lead}</p> : null}
        <p className={COUNT}>{countText}</p>
        {notes.filter(Boolean).map((note) => <p key={note} className={NOTE}>{note}</p>)}
      </div>
    </div>
  );
}
