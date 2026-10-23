const WAS = 'mr-2 text-small font-normal text-muted';

export default function CoinPrice({ was = '', now = '', className = '' }) {
  if (!was) return <span className={className}>{now}</span>;
  return (
    <span className={className} data-coin-price>
      <s className={WAS} data-coin-was>
        {was}
      </s>
      <span data-coin-now>{now}</span>
    </span>
  );
}
