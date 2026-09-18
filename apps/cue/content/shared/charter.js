export const CHARTER = {
  "heroClass": "charter-hero",
  "title": "Private Car Charter in Bali",
  "sub": "Your own car and local driver for the day - go anywhere, stop anywhere, at your own pace. Half or full day, petrol included, only a 20% deposit to book.",
  "boxId": "charter",
  "boxTitle": "Build your charter",
  // Each plan is a card in the builder, and each card has to stand on its own:
  // on a phone you only see one at a time, so it carries what makes it different
  // (hours, driving range) plus its own price and Book button. `note` replaces the
  // old "10h + extra" shorthand, which read as a spec rather than a sentence.
  // The fine print shared by all three (per car, tickets, meals) sits once under
  // the slider instead of three times inside it.
  "durations": [
    {
      "dur": "half",
      "name": "Half Day",
      "hours": "5 hours",
      "note": "Around 60 km of driving. Enough for one area - Ubud and its rice terraces, or a temple run."
    },
    {
      "dur": "full",
      "badge": "Popular",
      "name": "Full Day",
      "hours": "10 hours",
      "note": "Around 120 km of driving. Enough to cross the island and still get back for dinner."
    },
    {
      "dur": "extended",
      "name": "Extended",
      "hours": "10 hours + extra",
      "note": "Start from a full day and add hours at the hourly rate. Good for sunset stops and late returns."
    }
  ],
  // Shown once under the plan cards - the terms that are the same whichever plan
  // you pick, so they are not repeated in every card.
  "planTerms": "One price per car, up to 5 guests. Petrol, driver and parking are included.",
  // Good to know: the short, checkable facts a guest wants before booking. Kept
  // to one line each so the list scans, and the last two are the honest limits
  // rather than more selling.
  "notes": [
    "Petrol, driver and parking are included in the price",
    "One price per car, for up to 5 guests",
    "Half day covers around 60 km, full day around 120 km",
    "Entrance tickets, meals and activities are not included",
    "Running late? Add hours on the day at the hourly rate",
    "A 20% deposit confirms the date, the rest is paid after the trip",
    "Traffic in the south is slow in the afternoon, so plan fewer stops than the map suggests"
  ],
  "info": [
    { "type": "heading", "sub": false, "html": "How a Charter Day Works" },
    { "type": "para", "html": "You get an air-conditioned car, a local driver, and a block of time. Pick a half day (5 hours, around 60 km) or a full day (10 hours, around 120 km). Petrol, parking and the driver are included, and the price is per car for up to 5 guests." },
    { "type": "para", "html": "There is no fixed route. Tell your driver in the morning where you want to go, or decide as you drive. Stop for photos, pull over for lunch at a warung, stay longer anywhere you like. Our drivers live here and will happily suggest routes and places to eat if you would rather not plan it yourself." },
    { "type": "para", "html": "If the day runs long, add hours at the hourly rate and settle it at the end. Entrance tickets and meals stay in your hands, so you only pay for the places you actually go in." },
    { "type": "heading", "html": "What a Day Can Cover" },
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
    { "type": "heading", "html": "Charter or Guided Tour?" },
    { "type": "para", "html": "Both come with a private car and driver. The difference is who plans the day. Our <a href=\"/tour.html\">day tours</a> follow a set route and offer a Standard or Exclusive ticket option, so the day is worked out for you. A charter gives you the car, the driver and the hours, and leaves the route to you. First visit to Bali? A tour is the easier start. Know what you want to see? Charter it." }
  ],
  "metaTitle": "Private Car Charter Bali | Half & Full Day",
  "metaDesc": "Charter a private car with driver in Bali from Ubud - half day (5 hours) or full day (10 hours), extend by the hour, petrol included. Pick-up from anywhere on the island."
};
