// sm = the 20px icon step (buttons, inline rows); lg = balance cards; xl = the Coin Rewards strip (40px); anything else = 40px.
function sizeClass(size) {
  if (size === 'sm') return 'w-[var(--icon-md)] h-[var(--icon-md)]';
  if (size === 'lg') return 'w-[64px] h-[64px]';
  if (size === 'xl') return 'w-[40px] h-[40px]';
  return 'w-[40px] h-[40px]';
}
const ROLL = 'animate-[cahyana-coinroll_6s_var(--ease)_infinite] motion-reduce:animate-none';

// The Cahyana coin (Wayan's artwork, CUE Coin): rolls one full turn, rests, rolls again. Reduced motion keeps it still.
// `shine` (Coin Rewards panel only): the coin stays still and a metal shine sweeps its face (.cahyana-coin-shine in tokens.css).
export default function Coin({ size = 'md', still = false, shine = false, src = '/images/cahyana-coin.webp' }) {
  if (shine) {
    return (
      <span className={`relative block flex-none ${sizeClass(size)}`} data-coin-stage>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`block rounded-[50%] ${sizeClass(size)}`} src={src} alt="" aria-hidden="true" width="256" height="256" data-coin />
        <span className="cahyana-coin-shine" aria-hidden="true" data-coin-shine />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`block flex-none rounded-[50%] ${sizeClass(size)} ${still ? '' : ROLL}`}
      src={src}
      alt=""
      aria-hidden="true"
      width="256"
      height="256"
      data-coin
    />
  );
}
