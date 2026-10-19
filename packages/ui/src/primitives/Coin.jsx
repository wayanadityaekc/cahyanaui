function sizeClass(size) {
  if (size === 'sm') return 'w-[var(--icon-md)] h-[var(--icon-md)]';
  if (size === 'lg') return 'w-[64px] h-[64px]';
  if (size === 'xl') return 'w-[40px] h-[40px]';
  return 'w-[40px] h-[40px]';
}
const ROLL = 'animate-[cahyana-coinroll_6s_var(--ease)_infinite] motion-reduce:animate-none';

export default function Coin({ size = 'md', still = false, shine = false, src = '/images/cahyana-coin.webp' }) {
  if (shine) {
    return (
      <span className={`relative block flex-none ${sizeClass(size)}`} data-coin-stage>
        <img className={`block rounded-[50%] ${sizeClass(size)}`} src={src} alt="" aria-hidden="true" width="256" height="256" data-coin />
        <span className="cahyana-coin-shine" aria-hidden="true" data-coin-shine />
      </span>
    );
  }
  return (
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
