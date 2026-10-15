// A form's Book/Add button (children) with "Use coin" (coin) as an equal column on its LEFT (CUE FormCoin, Wayan 13 Oct 2026). Same row and the same height as the button, so the form keeps its size; with no coin to offer, the button stays full width.
export default function CoinRow({ coin = null, className = '', children }) {
  if (!coin) return className ? <div className={className}>{children}</div> : children;
  return (
    <div className={`grid grid-cols-2 gap-2 items-center ${className}`} data-coin-row>
      {coin}
      {children}
    </div>
  );
}
