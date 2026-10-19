const BRAND_COLOR = { Airbnb: '#FF5A5F', PayPal: '#003087', Booking: '#003580' };

const PATHS = {
  Airbnb: (
    <path
      fillRule="evenodd"
      d="M12 2.2c1.35 0 2.3.93 3.06 2.47 1.42 2.86 3.47 7.12 4.5 9.6.92 2.25.1 4.55-1.98 5.41-1.9.79-4.03.05-5.27-1.7l-.31-.44-.31.44c-1.24 1.75-3.37 2.49-5.27 1.7-2.08-.86-2.9-3.16-1.98-5.41 1.03-2.48 3.08-6.74 4.5-9.6C9.7 3.13 10.65 2.2 12 2.2Zm0 1.9c-.44 0-.83.36-1.36 1.42-1.39 2.8-3.42 7.02-4.42 9.43-.55 1.34-.12 2.5.93 2.94 1.08.45 2.32.02 3.02-.97l.5-.71-.48-.79c-.78-1.3-1.15-2.35-1.15-3.32A2.96 2.96 0 0 1 12 9.1a2.96 2.96 0 0 1 2.96 3c0 .97-.37 2.02-1.15 3.32l-.48.79.5.71c.7.99 1.94 1.42 3.02.97 1.05-.44 1.48-1.6.93-2.94-1-2.41-3.03-6.63-4.42-9.43C12.83 4.46 12.44 4.1 12 4.1Zm0 6.9c-.62 0-1.06.47-1.06 1.1 0 .56.25 1.3.83 2.28l.23.38.23-.38c.58-.98.83-1.72.83-2.28 0-.63-.44-1.1-1.06-1.1Z"
    />
  ),
  Booking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <text x="12" y="17.2" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif" fill="#fff" stroke="none">B</text>
    </>
  ),
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  WhatsApp: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  Facebook: <path d="M14 9h2V6h-2c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V9.6c0-.3.3-.6.6-.6H16" />,
  PayPal: (
    <>
      <path fill="#003087" d="M7.3 21.4H3.9a.5.5 0 0 1-.5-.6L6.2 3a.7.7 0 0 1 .7-.6h6.4c3.4 0 5.4 1.7 4.9 4.9-.6 3.7-3.1 5.5-6.7 5.5H9.6a.7.7 0 0 0-.7.6z" />
      <path fill="#009cde" d="M18.9 7.7c.6.8.8 1.9.6 3.3-.6 3.6-3 5.3-6.4 5.3h-1.4a.7.7 0 0 0-.7.6l-.8 4.8a.5.5 0 0 1-.5.4H7.3l.3-1.6 1.3-8.1a.7.7 0 0 1 .7-.6h1.9c3.6 0 6.1-1.8 6.7-5.5l.1-.7c.3.6.5 1.3.6 2.1z" />
    </>
  ),
};

export default function BrandIcon({ name, className = 'block w-[13px] h-[13px]' }) {
  const color = BRAND_COLOR[name];
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={color || 'none'}
      stroke={color ? 'none' : 'currentColor'}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] || null}
    </svg>
  );
}
