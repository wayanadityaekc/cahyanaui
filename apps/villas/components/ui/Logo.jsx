// Shared Cahyana Ubud logo, same as CUE's; no "Private Villas" text beside it, the alt text carries the site name.
export default function Logo({ size = 30 }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo.webp"
      alt="Cahyana Ubud-Bali · Ubud Private Villas"
      width="1005"
      height="324"
      style={{ height: size, width: 'auto', display: 'block' }}
    />
  );
}
