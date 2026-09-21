// Data-layer buat blok "guide-more" di bawah tiap artikel guide (dulu HTML hardcoded
// + diduplikat di tiap guide). Di-render <GuideMore>. Harga = referensi API (priceName).

// "See our tours" - IDENTIK di semua 15 guide (dulu di-hardcode 15x). Satu sumber.
export const SEE_OUR_TOURS = {
  kind: 'tours',
  cls: 'guide-more tourprog',
  title: 'Our tours',
  cards: [
    { href: '/ubud-tour.html', img: 'tour-hero.jpg', name: 'Ubud Tour', meta: 'Approx. 10 hours', priceName: 'Ubud Tour', priceFallback: '$45' },
    { href: '/ubud-culture-day.html', img: 'ubud-culture-day-card.jpg', name: 'Ubud Culture Day', meta: '6-8 hours', priceName: 'Ubud Culture Day', priceFallback: '$55' },
  ],
};
