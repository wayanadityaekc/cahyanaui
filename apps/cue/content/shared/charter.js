export const CHARTER = {
  "heroClass": "charter-hero",
  "title": "Private Car Charter in Bali",
  "sub": "Your own car and local driver for the day - go anywhere, stop anywhere, at your own pace. Half or full day, petrol included, only a 20% deposit to book.",
  "boxId": "charter",
  "boxTitle": "Build your charter",
  // One plan = one card, and on a phone one card fills the screen with nothing
  // peeking beside it (Wayan, Sep 2026: "kelihatan 1 card emang bener-bener satu
  // card"). So each card has to answer everything on its own - hence `points`
  // rather than a paragraph, written the way a listing card writes its meta row:
  // a short line with an icon in front (Wayan: "point dengan logo seperti card
  // listing"). `icon` maps to a Lucide component in CharterBuilder.
  //
  // The last two points repeat across all three cards on purpose. Listing cards
  // repeat "Private driver" and "Free cancellation" the same way: with one card
  // on screen, terms kept somewhere else are terms the guest never reads.
  "durations": [
    {
      "dur": "half",
      "name": "Half Day",
      "hours": "5 hours",
      "points": [
        { "icon": "clock", "text": "5 hours with the car" },
        { "icon": "route", "text": "Around 60 km, enough for one area" },
        { "icon": "car", "text": "Petrol, driver and parking included" },
        { "icon": "users", "text": "One price per car, up to 5 guests" }
      ]
    },
    {
      "dur": "full",
      "badge": "Popular",
      "name": "Full Day",
      "hours": "10 hours",
      "points": [
        { "icon": "clock", "text": "10 hours with the car" },
        { "icon": "route", "text": "Around 120 km, enough to cross the island" },
        { "icon": "car", "text": "Petrol, driver and parking included" },
        { "icon": "users", "text": "One price per car, up to 5 guests" }
      ]
    },
    {
      "dur": "extended",
      "name": "Extended",
      "hours": "10 hours + extra",
      "points": [
        { "icon": "clock", "text": "10 hours, plus the hours you add" },
        { "icon": "route", "text": "Hourly rate after the tenth hour" },
        { "icon": "car", "text": "Petrol, driver and parking included" },
        { "icon": "users", "text": "One price per car, up to 5 guests" }
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
