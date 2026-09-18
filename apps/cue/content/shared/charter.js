export const CHARTER = {
  "heroClass": "charter-hero",
  "title": "Private Car Charter in Bali",
  "sub": "Your own car and local driver for the day - go anywhere, stop anywhere, at your own pace. Half or full day, petrol included, only a 20% deposit to book.",
  "boxId": "charter",
  "boxTitle": "Build your charter",
  // Full Day FIRST (Wayan, Sep 2026: "kalo paling depan taruh full day") - it is
  // the one marked Popular, and in a picker the top row is what a guest reads first.
  //
  // ONE sub line per plan, not a list of icon points (Wayan picked the card option
  // where the PRICE is the second thing you read). The points became a single
  // dot-separated line under the price: the same facts, one line instead of three,
  // which is what leaves room for the big number. Anything trimmed out of here is
  // still in the Included list further down the same page.
  "durations": [
    {
      "dur": "full",
      "badge": "Popular",
      "name": "Full Day",
      "sub": "10 hours \u00b7 around 120 km \u00b7 per car up to 5"
    },
    {
      "dur": "half",
      "name": "Half Day",
      "sub": "5 hours \u00b7 around 60 km \u00b7 per car up to 5"
    },
    {
      "dur": "extended",
      "name": "Extended",
      "sub": "A full day plus the hours you add"
    }
  ],
  // ONE details section (Wayan, Sep 2026: "details seperti include exclude dan
  // how charter works itu jadiin satu"). What used to be a loose "Good to know"
  // list above a separate article is now a single run of text in the Our Company
  // reading style: left-aligned headings, no centred underline.
  //
  // The body is two rows of BOXES (Sep 2026, Wayan picked option B off the marker
  // sheet, then: "pakai kolom termasuk yang dibawahnya how charter works dan lagi
  // satunya"). Row 1 = Included / Not included, row 2 = How the day works / What a
  // day can cover. The per-row marker is gone - see components/ui/InfoBoxes.jsx.
  // Pairing is by HEIGHT, not by topic: the three-paragraph explainer and the
  // seven-line list of route ideas are the two blocks that come out about level,
  // so the boxes sit square instead of one trailing white space. "Charter or
  // guided tour?" stays full width below them - it is the closing note, and a
  // lone box in a two-column row would read as a missing second box.
  "info": [
    { "type": "heading", "sub": false, "html": "Charter Details" },
    { "type": "boxes", "items": [
      { "title": "What's included", "variant": "yes", "list": [
        "A private car with a local driver, yours for the booked hours",
        "Petrol, parking and road tolls",
        "Pick-up and drop-off at your accommodation",
        "One price per car for up to 5 guests, not per person",
        "Free cancellation up to 24 hours before the trip"
      ] },
      { "title": "Not included", "variant": "no", "list": [
        "Entrance tickets to temples, waterfalls and attractions",
        "Meals and drinks for you and the driver",
        "Activities booked on the day, such as rafting or an ATV ride",
        "Hours past the time you booked, charged at the hourly rate"
      ] }
    ] },
    { "type": "boxes", "items": [
      { "title": "How the day works", "paras": [
        "You get an air-conditioned car, a local driver, and a block of time. Pick a half day (5 hours, around 60 km) or a full day (10 hours, around 120 km). The driver collects you at your accommodation at the time you chose and the day is yours from there.",
        "There is no fixed route. Tell your driver in the morning where you want to go, or decide as you drive. Stop for photos, pull over for lunch at a warung, stay longer anywhere you like. Our drivers live here and will happily suggest routes and places to eat if you would rather not plan it yourself.",
        "If the day runs long, add hours at the hourly rate and settle it at the end. A 20% deposit confirms the date and the rest is paid after the trip. One honest warning: traffic in the south is slow in the afternoon, so plan fewer stops than the map suggests."
      ] },
      { "title": "What a day can cover", "paras": [
        "Rough guides, not fixed packages. Ask your driver what fits the traffic on the day."
      ], "list": [
        "Half day around Ubud: rice terraces, a temple, the monkey forest",
        "Full day south: <a href=\"/guide/uluwatu-bukit.html\">Uluwatu &amp; the Bukit beaches</a>, back after sunset",
        "Full day west: Tanah Lot and the coast temples in late afternoon light",
        "Full day north: Handara Gate, the Twin Lakes and a waterfall",
        "Full day east: the water palaces at Tirta Gangga &amp; Taman Ujung",
        "A beach and cafe day in <a href=\"/guide/canggu.html\">Canggu</a> or Seminyak",
        "An airport run with a few stops on the way"
      ] }
    ] },
    { "type": "heading", "html": "Charter or guided tour?" },
    { "type": "para", "html": "Both come with a private car and driver. The difference is who plans the day. Our <a href=\"/tour.html\">day tours</a> follow a set route and offer a Standard or Exclusive ticket option, so the day is worked out for you. A charter gives you the car, the driver and the hours, and leaves the route to you. First visit to Bali? A tour is the easier start. Know what you want to see? Charter it." }
  ],
  "metaTitle": "Private Car Charter Bali | Half & Full Day",
  "metaDesc": "Charter a private car with driver in Bali from Ubud - half day (5 hours) or full day (10 hours), extend by the hour, petrol included. Pick-up from anywhere on the island."
};
