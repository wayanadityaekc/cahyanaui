import Coin from '../primitives/Coin.jsx';

const STYLES = {
  row: 'inline-flex items-center gap-[0.35rem] text-left mt-[0.45rem] py-[0.2rem] pl-[0.25rem] pr-[0.6rem] rounded-pill border',
  cta: 'flex w-full min-w-0 items-center justify-center gap-[0.4rem] h-[var(--btn-h)] px-3 rounded-sm border whitespace-nowrap overflow-hidden [container-type:inline-size]',
};
const USE_TEXT =
  'font-body text-small font-semibold text-green cursor-pointer [transition:border-color_var(--dur)_var(--ease),background-color_var(--dur)_var(--ease)] ' +
  'hover:[border-color:var(--color-amber)] disabled:opacity-40 disabled:cursor-not-allowed';
const USE_OFF = 'border-line bg-white';
const USE_ON = 'border-amber bg-[rgba(201,164,92,0.1)]';
const LABEL = 'min-w-0 overflow-hidden text-ellipsis';
const LONG = 'min-w-0 overflow-hidden text-ellipsis [@container(max-width:10rem)]:hidden';
const SHORT = 'hidden [@container(max-width:10rem)]:inline';

export default function UseCoin({
  on = false,
  canUse = true,
  onToggle = () => {},
  useLabel = 'Use coin',
  countText = '',
  coinSrc,
  variant = 'row',
}) {
  const style = STYLES[variant] || STYLES.row;
  const label = on && countText ? `${useLabel} · ${countText}` : useLabel;
  const hasShortLabel = variant === 'cta' && on && countText;
  return (
    <button
      type="button"
      className={`${style} ${USE_TEXT} ${on ? USE_ON : USE_OFF}`}
      aria-pressed={on}
      aria-label={label}
      onClick={onToggle}
      disabled={!on && !canUse}
      data-use-coin
    >
      <Coin size="sm" still src={coinSrc} />
      {hasShortLabel ? (
        <>
          <span className={LONG} aria-hidden="true">
            {label}
          </span>
          <span className={SHORT} aria-hidden="true">
            {countText}
          </span>
        </>
      ) : (
        <span className={LABEL}>{label}</span>
      )}
    </button>
  );
}
