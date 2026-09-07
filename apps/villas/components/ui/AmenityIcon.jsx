// Icon set for the confirmed, real amenities used in lib/villas.js. Kept to
// exactly the amenities the original site content actually mentions — no
// invented items (e.g. no "Free WiFi" / "Air Conditioning", which the
// mockup showed as examples but neither villa's real content confirms).
const ICONS = {
  'Private Pool': <path d="M3 16c1.5-1 2.5-1 4 0s2.5 1 4 0 2.5-1 4 0 2.5 1 4 0M3 12c1.5-1 2.5-1 4 0s2.5 1 4 0 2.5-1 4 0 2.5 1 4 0M6 12V7a2 2 0 0 1 2-2h1v2" />,
  'Full Kitchen': <><path d="M4 3v6M8 3v6M4 6h4" /><path d="M14 3v18M14 9h6M17 9v12" /></>,
  'Smart TV': <><rect x="3" y="5" width="18" height="12" rx="1.5" /><path d="M9 21h6" /></>,
  'Ensuite Bathrooms': <><rect x="3" y="9" width="18" height="11" rx="1.5" /><path d="M7 9V6a2 2 0 0 1 4 0" /><circle cx="17" cy="14" r="1" fill="currentColor" stroke="none" /></>,
  'Home Garden': <><path d="M12 21V10" /><path d="M12 14c-3-1-5-3.5-5-7 3.5 0 6 2 7 5" /><path d="M12 11c3-1 5-3.5 5-7-3.5 0-6 2-7 5" /></>,
  'Motorbike Parking': <><circle cx="6" cy="17" r="2.4" /><circle cx="18" cy="17" r="2.4" /><path d="M6 17 10 8h4l3 5h-3M10 8 8 5" /></>,
  'Outdoor Shower': <><path d="M6 8h11a2 2 0 0 1 0 4H6" /><path d="M9 12v8M13 12v8" /><path d="M6 8V6" /></>,
  'Scooter Parking': <><circle cx="6" cy="18" r="2.2" /><circle cx="17" cy="18" r="2.2" /><path d="M6 18 9 10h5l2.5 4H19M9 10 8 6h3" /></>,
};

export default function AmenityIcon({ name, size = 22 }) {
  const path = ICONS[name] || <circle cx="12" cy="12" r="8" />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
}
