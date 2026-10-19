const DEFAULT_LOGO_SIZE_PX = 30;

export default function Logo({ size = DEFAULT_LOGO_SIZE_PX }) {
  return (
    <img
      src="/images/logo.webp"
      alt="Cahyana Ubud-Bali · Ubud Private Villas"
      width="1005"
      height="324"
      style={{ height: size, width: 'auto', display: 'block' }}
    />
  );
}
