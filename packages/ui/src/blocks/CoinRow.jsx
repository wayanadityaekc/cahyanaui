export default function CoinRow({ coin = null, className = '', children }) {
  if (!coin) return className ? <div className={className}>{children}</div> : children;
  return (
    <div className={`grid grid-cols-2 gap-2 items-center ${className}`} data-coin-row>
      {coin}
      {children}
    </div>
  );
}
