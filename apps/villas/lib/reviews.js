// Real guest-review content for the homepage reviews section, ported as-is
// from the original site. There are no reviewer names or photos in the real
// source data (Airbnb reviews there are only ever attributed as "Airbnb
// guest") — the mockup's named/pictured reviewer cards are illustrative, not
// real guests, so this data intentionally has no name/photo fields to fill.
export const OVERALL_RATING = '4.96';
export const OVERALL_REVIEW_COUNT = 306;

export const REVIEW_SCORES = [
  ['Cleanliness', '5.0'],
  ['Accuracy', '5.0'],
  ['Check-in', '5.0'],
  ['Communication', '5.0'],
  ['Location', '4.8'],
  ['Value', '4.9'],
];

export const REVIEW_CARDS = [
  {
    type: 'quote',
    stars: 5,
    text: 'The place is very clean, comfortable, and peaceful - perfect for a family getaway. There are many great cafes and restaurants near the villa. The owners, Pak Made and his wife, are incredibly kind.',
    source: 'Airbnb guest · Cahyana House',
  },
  {
    type: 'themes',
    heading: 'What guests mention most',
    themes: [
      ['Hospitality', 241],
      ['Cleanliness', 107],
      ['Getting around', 101],
      ['Pool', 85],
      ['Location', 89],
    ],
    source: 'Across both listings',
  },
  {
    type: 'quote',
    stars: 5,
    text: '100% of guests from Australia rated Cahyana Tibuah five stars in the past year - one of the reasons Airbnb marks it as top rated.',
    source: 'Airbnb listing highlight · Cahyana Tibuah',
  },
];
