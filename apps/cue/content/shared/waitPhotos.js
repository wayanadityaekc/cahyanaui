// Photos for the "waiting for your confirmation" screen after a payment.
//
// A hand-written list, NOT `imageForProgram()`: that helper imports the whole
// LISTINGS dataset, and this screen is reached from BookConfirmModal, which is
// mounted on every page - importing the dataset here would ship it to all of
// them (the same trap documented for TripBar and TOUR_CONTENT).
//
// Every file is a real photo already used elsewhere on the site, of a place we
// actually take guests. Do not add stock photography or a place we don't visit.
export const WAIT_PHOTOS = [
  { src: '/assets/images/lempuyang-edited.webp', alt: 'Lempuyang Temple gates with Mount Agung behind' },
  { src: '/assets/images/ulun-danu-beratan-temple-bali.webp', alt: 'Ulun Danu Beratan temple on Lake Bratan' },
  { src: '/assets/images/jatiluwih-terrace-walk.webp', alt: 'Walking path through the Jatiluwih rice terraces' },
  { src: '/assets/images/tirta-gangga-photo-spot.webp', alt: 'Stepping stones across the pool at Tirta Gangga' },
  { src: '/assets/images/tegenungan.webp', alt: 'Tegenungan waterfall near Ubud' },
];

// How long each photo holds before the next one fades in.
export const WAIT_SLIDE_MS = 5000;
