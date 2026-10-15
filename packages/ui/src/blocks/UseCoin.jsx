import { Minus, Plus } from 'lucide-react';
import Coin from '../primitives/Coin.jsx';

// CUE UseCoin look. row: the pill on My Booking rows. cta: button height and full width, the second column beside a Book/Add button; both states keep that one height, so a tap never moves anything. Colour-only hover, nothing changes size.
const STYLES = {
  row: {
    use: 'inline-flex items-center gap-[0.35rem] text-left mt-[0.45rem] py-[0.2rem] pl-[0.25rem] pr-[0.6rem] rounded-pill border',
    stepper: 'inline-flex items-center gap-[0.4rem] mt-[0.45rem] py-[0.2rem] px-[0.3rem] rounded-pill border border-amber bg-[rgba(201,164,92,0.1)]',
  },
  cta: {
    use: 'flex w-full min-w-0 items-center justify-center gap-[0.4rem] h-[var(--btn-h)] px-3 rounded-sm border whitespace-nowrap overflow-hidden',
    stepper: 'flex w-full min-w-0 items-center justify-between h-[var(--btn-h)] px-[4px] rounded-sm border border-amber bg-[rgba(201,164,92,0.1)]',
  },
};
const USE_TEXT =
  'font-body text-small font-semibold text-green cursor-pointer [transition:border-color_var(--dur)_var(--ease),background-color_var(--dur)_var(--ease)] ' +
  'hover:[border-color:var(--color-amber)] disabled:opacity-40 disabled:cursor-not-allowed';
const USE_OFF = 'border-line bg-white';
const USE_ON = 'border-amber bg-[rgba(201,164,92,0.1)]';
const STEP_BTN =
  'grid place-items-center w-[24px] h-[24px] rounded-pill border-none bg-white text-green cursor-pointer ' +
  '[transition:background-color_var(--dur)_var(--ease)] hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed';
const STEP_TEXT = 'min-w-[4.5em] text-center text-small font-semibold text-green';
const ICON = 'w-[var(--icon-sm)] h-[var(--icon-sm)]';
// The label truncates in a narrow cta column rather than wrap: a wrapped label would make the form taller.
const LABEL = 'min-w-0 overflow-hidden text-ellipsis';
// cta toggle: the button is its own size container; under 10rem it shows the coin count only ("1 coin"), full label in aria-label.
const CTA_BOX = '[container-type:inline-size]';
const LONG = 'min-w-0 overflow-hidden text-ellipsis [@container(max-width:10rem)]:hidden';
const SHORT = 'hidden [@container(max-width:10rem)]:inline';

// Cart row control. Stepper mode (default): "Use coin", then - n coins +. Toggle mode (`toggle`): one pill, "Use coin · 2 coins", pressed while on (a villa service covered by coins).
export default function UseCoin({
  coins = 0,
  canAdd = true,
  onChange = () => {},
  toggle = false,
  on = false,
  onToggle = () => {},
  useLabel = 'Use coin',
  countText = '',
  lessLabel = 'One coin less',
  moreLabel = 'One coin more',
  coinSrc,
  variant = 'row',
}) {
  const style = STYLES[variant] || STYLES.row;
  if (toggle) {
    const label = countText ? `${useLabel} · ${countText}` : useLabel;
    return (
      <button type="button" className={`${style.use} ${USE_TEXT} ${on ? USE_ON : USE_OFF} ${variant === 'cta' ? CTA_BOX : ''}`} aria-pressed={on} aria-label={label} onClick={onToggle} disabled={!on && !canAdd} data-use-coin-toggle>
        <Coin size="sm" still src={coinSrc} />
        {variant === 'cta' && countText
          ? <><span className={LONG} aria-hidden="true">{label}</span><span className={SHORT} aria-hidden="true">{countText}</span></>
          : <span className={LABEL}>{label}</span>}
      </button>
    );
  }
  if (!coins) {
    return (
      <button type="button" className={`${style.use} ${USE_TEXT} ${USE_OFF}`} onClick={() => onChange(1)} disabled={!canAdd} data-use-coin>
        <Coin size="sm" still src={coinSrc} />
        <span className={LABEL}>{useLabel}</span>
      </button>
    );
  }
  return (
    <span className={style.stepper} data-coin-stepper>
      <button type="button" className={STEP_BTN} aria-label={lessLabel} onClick={() => onChange(coins - 1)}>
        <Minus className={ICON} strokeWidth={2} aria-hidden="true" />
      </button>
      <span className={STEP_TEXT} aria-live="polite">{countText}</span>
      <button type="button" className={STEP_BTN} aria-label={moreLabel} disabled={!canAdd} onClick={() => onChange(coins + 1)}>
        <Plus className={ICON} strokeWidth={2} aria-hidden="true" />
      </button>
    </span>
  );
}
