export const CHARTER = {
  "heroClass": "charter-hero",
  "title": "Private Car Charter in Bali",
  "sub": "Your own car and local driver for the day - go anywhere, stop anywhere, at your own pace. Half or full day, petrol included, only a 20% deposit to book.",
  "boxId": "charter",
  "boxTitle": "Build your charter",
  "durations": [
    {
      "dur": "half",
      "name": "Half Day",
      "sub": "5 hours",
      "from": "from"
    },
    {
      "dur": "full",
      "badge": "Popular",
      "name": "Full Day",
      "sub": "10 hours",
      "from": "from"
    },
    {
      "dur": "extended",
      "name": "Extended",
      "sub": "10h + extra",
      "from": "from"
    }
  ],
  // Good-to-know list (TW-B4 #337): was notesHtml raw string -> items array.
  // The .itn__subtitle heading + .info__list--yes ul + .charter__notes->utilities
  // wrapper live in CharterSection. .itn__subtitle (TW-B3) / .info__list (B-FINAL)
  // kept as classes.
  "notes": [
    "Petrol, driver, and parking all included",
    "Price is per car - up to 5 passengers",
    "Half day covers roughly a 60 km range, full day roughly 120 km",
    "Entrance tickets and meals are not included",
    "Extend on the day if you need more time - just pay the hourly rate",
    "Book now, pay after - only a 20% deposit to confirm"
  ],
  // Info body (TW-B4 #337): was infoHtml raw string -> Prose blocks. Rendered
  // inside <section.info><div.info__container> (both classes kept - shared/B-FINAL).
  // List items keep inline <a>/&amp; markup verbatim (rendered via Prose).
  "info": [
    { "type": "heading", "sub": false, "html": "How a Charter Day Works" },
    { "type": "para", "html": "A charter is the simplest way to see Bali on your own terms: one air-conditioned car, one local driver, and your plan. Choose a half day (5 hours, roughly a 60 km range) or a full day (10 hours, roughly 120 km), and the car is yours - petrol, parking, and the driver are all included, priced per car for up to 5 passengers." },
    { "type": "para", "html": "There's no fixed route. Hand your driver a wishlist in the morning, or decide as you go - stop for a photo when a rice terrace appears, pull over for lunch at a warung, stay longer wherever you're happy. Our drivers know the island well and are glad to suggest routes, shortcuts, and places to eat along the way." },
    { "type": "para", "html": "If the day runs long, no problem: extend hour by hour at the rate shown in the calculator above, decided on the day. Entrance tickets and meals stay in your hands, so you only spend on what you actually visit." },
    { "type": "heading", "html": "Charter Ideas from Ubud" },
    { "type": "list", "variant": "yes", "items": [
      "Sunset run to <a href=\"/guide/uluwatu-bukit.html\">Uluwatu &amp; the Bukit beaches</a>",
      "Tanah Lot &amp; the west coast temples at golden hour",
      "North loop: Handara Gate, the Twin Lakes &amp; waterfalls",
      "East Bali water palaces: Tirta Gangga &amp; Taman Ujung",
      "A cafe-and-beach day in <a href=\"/guide/canggu.html\">Canggu</a> or Seminyak",
      "An airport run with sightseeing on the way"
    ] },
    { "type": "heading", "html": "Charter or Guided Tour?" },
    { "type": "para", "html": "Both come with a private car and driver - the difference is structure. Our <a href=\"/tour.html\">day tours</a> follow a curated route with a local guide and a Standard / Exclusive ticket option, so the whole day is designed for you. A charter is pure freedom: transport, driver, and time, with the itinerary left entirely to you. If it's your first visit, a tour makes a great introduction; once you know what you love, a charter lets you chase it." }
  ],
  "metaTitle": "Private Car Charter Bali | Half & Full Day",
  "metaDesc": "Charter a private car with driver in Bali from Ubud - half day (5 hours) or full day (10 hours), extend by the hour, petrol included. Pick-up from anywhere on the island."
};
