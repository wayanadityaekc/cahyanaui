// Guide articles.
//
// House style, same as CUE's: plain and useful, not poetic. Short sentences,
// concrete facts a guest can act on - distances, timings, trade-offs, what it
// actually costs you. No glorify words (stunning, breathtaking, magical,
// unforgettable, paradise...). Say the awkward parts out loud; that is the bit
// people believe.
//
// Everything below is either general Bali/Ubud knowledge or a fact already on
// this site (north Ubud location, ~10 min to Ubud Palace, ~1.5h from DPS, the
// two villas' sizes, the services we run). Nothing claims a price, a partner
// or a guarantee that has not been set.

export const CATEGORIES = [
  { id: 'getting-around', label: 'Getting around' },
  { id: 'the-area', label: 'The area' },
  { id: 'planning', label: 'Planning' },
  { id: 'staying', label: 'Where to stay' },
];

export const ARTICLES = [
  {
    slug: 'getting-around-ubud',
    cat: 'getting-around',
    title: 'Getting around Ubud when you are staying north of town',
    sub: 'Scooter, driver, or on foot - what each one is actually like from this side of Ubud, and when you need which.',
    read: 6,
    body: [
      { type: 'para', html: 'North Ubud is quiet, which is the point of staying here. It is also not a walk-everywhere address. Ubud Palace, the Monkey Forest and the main restaurant streets are about ten minutes away by car, and that ten minutes is the thing to plan around.' },

      { type: 'heading', html: 'Scooter' },
      { type: 'para', html: 'A scooter is the cheapest and fastest way to move, and it is what most long-stay guests end up on. Ten minutes into town, and you park for almost nothing instead of circling for a car space on Jalan Raya.' },
      { type: 'para', html: 'The honest version: Bali traffic does not forgive inexperience, the roads north of town have gravel and dogs on them, and rain turns the surface slick within seconds. If you have never ridden, Ubud is a poor place to learn. Ride with a helmet on, and carry a licence that actually covers you in Indonesia - your travel insurance will ask for it if anything happens.' },
      { type: 'para', html: 'We can arrange a scooter for your stay. The <a href="/services/scooter-rental">scooter rental page</a> covers what to expect.' },

      { type: 'heading', html: 'A driver for the day' },
      { type: 'para', html: 'If you are doing temples, waterfalls or rice terraces, hire a car and driver for the day rather than stringing rides together. It works out cheaper than four separate trips, you leave your bags in the car, and somebody who knows the roads decides when to skip a spot because three coaches just pulled in.' },
      { type: 'para', html: 'That is the other half of what this family does - <a href="https://cahyanaubudexperience.com" target="_blank" rel="noopener">Cahyana Ubud Experience</a> runs the cars, with the prices published before you book.' },

      { type: 'heading', html: 'Ride-hailing apps' },
      { type: 'para', html: 'Grab and Gojek both work in Ubud and are the easiest way to get home after dinner. Two things to know. Coverage thins out the further north you are, so a car can take a while to accept at night. And a number of areas around Ubud restrict app drivers from picking up, which is enforced by local transport co-operatives rather than by the app - you will sometimes be asked to walk a street or two to meet the driver.' },

      { type: 'heading', html: 'Walking' },
      { type: 'para', html: 'There are cafes and warungs within a short walk of both villas, and that is genuinely pleasant in the morning. Walking the whole way into central Ubud is possible but not recommended: no footpath for long stretches, no lighting after dark, and drainage ditches at the road edge.' },

      { type: 'heading', html: 'So what should you do' },
      { type: 'para', html: 'Most guests who stay a week land on the same mix: a scooter or an app ride for dinner and cafes, a driver for the one or two big sightseeing days, and feet for the morning coffee. Decide the driver days early - the good ones are booked out in July and August.' },
    ],
  },

  {
    slug: 'whats-near-the-villas',
    cat: 'the-area',
    title: 'What is actually near the villas',
    sub: 'Coffee, dinner, a swim, a supermarket - what is within walking distance of north Ubud and what needs the ten-minute ride.',
    read: 5,
    body: [
      { type: 'para', html: 'This is the question guests ask most often before they book, and the honest answer has two halves: a fair amount is walkable, and the famous things are not.' },

      { type: 'heading', html: 'Within a walk' },
      { type: 'para', html: 'There are warungs and small cafes on the lanes around both villas - the kind that open early, cook to order, and cost a fraction of the places in town. Small shops sell water, snacks, SIM top-ups and cold beer. This is the part of Ubud you only see if you stay outside the centre, and most guests end up eating here more than they expected.' },
      { type: 'para', html: 'Rice fields start more or less at the door. Walking out into them early, before the heat, is the single best thing about this location and it costs nothing.' },

      { type: 'heading', html: 'The ten-minute ride' },
      { type: 'para', html: 'Central Ubud - Ubud Palace, the market, Monkey Forest, the restaurant strip along Jalan Hanoman and Jalan Dewi Sita - is about ten minutes by car or scooter. Tegallalang rice terrace is a similar distance in the other direction, which is why staying north is convenient if the terraces are on your list.' },
      { type: 'para', html: 'Campuhan Ridge Walk, the yoga studios and the bigger supermarkets are all in or near the centre, so the same ride.' },

      { type: 'heading', html: 'What is further than people expect' },
      { type: 'para', html: 'Tegenungan and the other waterfalls, Tirta Empul, Mount Batur for sunrise, and the coast are all day-trip distance, not evening-out distance. Batur in particular means leaving around two in the morning. Group them into one day with a driver rather than doing them piecemeal.' },

      { type: 'heading', html: 'Things worth knowing' },
      { type: 'para', html: 'Traffic in central Ubud is bad from late morning until early evening, and a ten-minute drive can double. If you are going in for dinner, either go early or accept the crawl. Going the other way - north and out - stays clear.' },
      { type: 'para', html: 'Not everywhere takes cards. Carry some cash for the warungs and the parking attendants.' },
    ],
  },

  {
    slug: 'best-time-to-visit-bali',
    cat: 'planning',
    title: 'The best time to visit Bali, and what each season is really like',
    sub: 'Dry season, wet season, the crowded months and the cheap ones - with the trade-off each one asks of you.',
    read: 6,
    body: [
      { type: 'para', html: 'Bali has two seasons and about four different experiences inside them. There is no single best month; there is a best month for what you want.' },

      { type: 'heading', html: 'Dry season: April to October' },
      { type: 'para', html: 'Less rain, lower humidity, more reliable sun. This is when the walks, the volcano sunrises and the beach days are most likely to go to plan.' },
      { type: 'para', html: 'July and August are the peak inside the peak. Everything is busier, the roads around Ubud are slower, the popular spots have queues, and accommodation is at its most expensive and books out earliest. If you are coming then, decide your dates and your driver days well ahead.' },

      { type: 'heading', html: 'Wet season: November to March' },
      { type: 'para', html: 'It rains, but usually not all day - the pattern is a heavy downpour in the afternoon and a clear morning either side of it. Everything is greener, the rice terraces look their best, and there are far fewer people.' },
      { type: 'para', html: 'The trade-offs are real. Waterfalls run high and can close. Some roads flood briefly. Humidity is heavy, and a scooter in a downpour is genuinely unpleasant. January and February are the wettest.' },

      { type: 'heading', html: 'The shoulder months' },
      { type: 'para', html: 'May, June and September are what most repeat visitors quietly recommend: mostly dry, noticeably fewer people than the July and August crush, and prices below the peak. If your dates are flexible, start here.' },

      { type: 'heading', html: 'Dates worth checking before you book' },
      { type: 'para', html: 'Nyepi, the Balinese day of silence, usually falls in March. For one full day the whole island stops - no flights, no traffic, no going outside, lights kept low after dark. Staying in a villa with a pool and a kitchen is about the most comfortable way to spend it, but you have to know it is coming.' },
      { type: 'para', html: 'Galungan and Kuningan move around the Balinese calendar and are worth seeing if your trip overlaps: decorated <em>penjor</em> poles along every road, and families in temple dress. Some businesses close.' },
      { type: 'para', html: 'Christmas, New Year and Chinese New Year each bring a short, sharp spike in both price and crowds, wet season or not.' },

      { type: 'heading', html: 'Short version' },
      { type: 'para', html: 'Want the most reliable weather: June or September. Want it quiet and cheap and do not mind afternoon rain: November or February. Want July or August: that is fine, just book early and plan around traffic.' },
    ],
  },

  {
    slug: 'villa-or-hotel-in-ubud',
    cat: 'staying',
    title: 'Villa or hotel in Ubud: which one suits your trip',
    sub: 'What you get and what you give up with each - written by people who run villas, so read it with that in mind.',
    read: 5,
    body: [
      { type: 'para', html: 'We rent villas, so take the framing for what it is. What follows is still the comparison we would give a friend, including the cases where a hotel is the better answer.' },

      { type: 'heading', html: 'What a private villa gets you' },
      { type: 'para', html: 'The whole house is yours. Your own pool, with nobody else in it and no towel rules. A kitchen, which over a week is a real saving and a real convenience when somebody wants breakfast at six and somebody else at ten. Space to spread out - Cahyana House has three bedrooms, Cahyana Tibuah has two.' },
      { type: 'para', html: 'For a group, the arithmetic usually favours a villa: one house split four or six ways against three or four hotel rooms. It is also a great deal quieter, especially out towards the rice fields.' },

      { type: 'heading', html: 'What you give up' },
      { type: 'para', html: 'There is no reception desk and no lobby. Nobody is on site at three in the morning. There is no restaurant downstairs, no gym, no daily turndown - housekeeping happens on a schedule, not on demand.' },
      { type: 'para', html: 'A villa outside the centre also means you are committing to that ten-minute ride every time you go into town. Some people love that. Some people, after three days, wish they could walk to dinner.' },

      { type: 'heading', html: 'When a hotel is the better choice' },
      { type: 'para', html: 'One or two nights in transit: do not bother with a villa, you will spend the stay unpacking. Travelling alone and wanting people around: a hotel or guesthouse is friendlier by design. Wanting a gym, a spa on site and a buffet breakfast without arranging anything: that is what a resort is for.' },

      { type: 'heading', html: 'How we try to close the gap' },
      { type: 'para', html: 'The things a hotel does well, we arrange instead of building. Breakfast is cooked in your own kitchen. A massage therapist comes to the villa. Airport pickup, a driver for the day, a scooter, fresh linen - you ask, we sort it. It is not a front desk, but it is a phone number that answers, usually within the hour.' },

      { type: 'heading', html: 'The short version' },
      { type: 'para', html: 'Group, or staying four nights or more, or you want a pool to yourself: villa. Solo, a short stop, or you want everything on site without asking: hotel. Anything in between comes down to whether the ten minutes into town bothers you.' },
    ],
  },
];

export function articleBySlug(slug) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}

export function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || '';
}
