export const CHARTER = {
  "heroClass": "charter-hero",
  "title": "Private Car Charter in Bali",
  "sub": "Your own car and local driver for the day - go anywhere, stop anywhere, at your own pace. Half or full day, petrol included, only a 20% deposit to book.",
  "boxId": "charter",
  "boxTitle": "Build your charter",
  // Full Day FIRST (Wayan, Sep 2026: "kalo paling depan taruh full day") - it is
  // the one marked Popular, and on a phone the first card is the only one a guest
  // sees without touching anything.
  //
  // Two points per card, not four. The card is meant to be short (Wayan: "buat card
  // lebih pendek"), so each line carries more: hours and distance on one, what the
  // price covers on the other. The terms trimmed out of here are not lost - they are
  // in the Included list further down the same page.
  "durations": [
    {
      "dur": "full",
      "badge": "Popular",
      "name": "Full Day",
      "points": [
        { "icon": "clock", "text": "10 hours, around 120 km" },
        { "icon": "car", "text": "Petrol, driver and parking, per car up to 5" }
      ]
    },
    {
      "dur": "half",
      "name": "Half Day",
      "points": [
        { "icon": "clock", "text": "5 hours, around 60 km" },
        { "icon": "car", "text": "Petrol, driver and parking, per car up to 5" }
      ]
    },
    {
      "dur": "extended",
      "name": "Extended",
      // One line only: the extra-hours field takes the second line's place, which
      // keeps this card close in height to the other two.
      "points": [
        { "icon": "clock", "text": "A full day plus the hours you add" }
      ]
    }
  ],
  // ONE details section (Wayan, Sep 2026: "details seperti include exclude dan
  // how charter works itu jadiin satu"). What used to be a loose "Good to know"
  // list above a separate article is now a single run of text in the Our Company
  // reading style: left-aligned headings, no centred underline.
  //
  // The list that mixed "included" and "not included" into one column of ticks is
  // split into the site's standard Included / Not included pair, which is the
  // format every tour and attraction page already uses.
  "info": [
    { "type": "heading", "sub": false, "html": "Charter Details" },
    { "type": "heading", "html": "What's included" },
    { "type": "list", "variant": "yes", "items": [
      "A private car with a local driver, yours for the booked hours",
      "Petrol, parking and road tolls",
      "Pick-up and drop-off at your accommodation",
      "One price per car for up to 5 guests, not per person",
      "Free cancellation up to 24 hours before the trip"
    ] },
    { "type": "heading", "html": "Not included" },
    { "type": "list", "variant": "no", "items": [
      "Entrance tickets to temples, waterfalls and attractions",
      "Meals and drinks for you and the driver",
      "Activities booked on the day, such as rafting or an ATV ride",
      "Hours past the time you booked, charged at the hourly rate"
    ] },
    { "type": "heading", "html": "How the day works" },
    { "type": "para", "html": "You get an air-conditioned car, a local driver, and a block of time. Pick a half day (5 hours, around 60 km) or a full day (10 hours, around 120 km). The driver collects you at your accommodation at the time you chose and the day is yours from there." },
    { "type": "para", "html": "There is no fixed route. Tell your driver in the morning where you want to go, or decide as you drive. Stop for photos, pull over for lunch at a warung, stay longer anywhere you like. Our drivers live here and will happily suggest routes and places to eat if you would rather not plan it yourself." },
    { "type": "para", "html": "If the day runs long, add hours at the hourly rate and settle it at the end. A 20% deposit confirms the date and the rest is paid after the trip. One honest warning: traffic in the south is slow in the afternoon, so plan fewer stops than the map suggests." },
    { "type": "heading", "html": "What a day can cover" },
    { "type": "para", "html": "Rough guides, not fixed packages. Ask your driver what fits the traffic on the day." },
    { "type": "list", "variant": "yes", "items": [
      "Half day around Ubud: rice terraces, a temple, the monkey forest",
      "Full day south: <a href=\"/guide/uluwatu-bukit.html\">Uluwatu &amp; the Bukit beaches</a>, back after sunset",
      "Full day west: Tanah Lot and the coast temples in late afternoon light",
      "Full day north: Handara Gate, the Twin Lakes and a waterfall",
      "Full day east: the water palaces at Tirta Gangga &amp; Taman Ujung",
      "A beach and cafe day in <a href=\"/guide/canggu.html\">Canggu</a> or Seminyak",
      "An airport run with a few stops on the way"
    ] },
    { "type": "heading", "html": "Charter or guided tour?" },
    { "type": "para", "html": "Both come with a private car and driver. The difference is who plans the day. Our <a href=\"/tour.html\">day tours</a> follow a set route and offer a Standard or Exclusive ticket option, so the day is worked out for you. A charter gives you the car, the driver and the hours, and leaves the route to you. First visit to Bali? A tour is the easier start. Know what you want to see? Charter it." }
  ],
  "metaTitle": "Private Car Charter Bali | Half & Full Day",
  "metaDesc": "Charter a private car with driver in Bali from Ubud - half day (5 hours) or full day (10 hours), extend by the hour, petrol included. Pick-up from anywhere on the island."
};
