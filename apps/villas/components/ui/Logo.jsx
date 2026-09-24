// The shared Cahyana Ubud brand mark (same file as CUE's navbar logo) —
// Wayan wants one consistent logo across both sister sites, not a
// site-specific icon. No "Private Villas" text alongside it in the navbar
// per his instruction; the logo's own alt text carries the site name for
// accessibility/SEO.
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
