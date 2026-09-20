export const CHARTER = {
  "title": "Private Car Charter in Bali",
  "sub": "Your own car and local driver for the day. You choose the route, your driver knows the roads. Five, ten or twelve hours, petrol included, 20% deposit to book.",
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
    // 12 hours is the longest one sold (Sep 2026, Wayan: "di charter kita ganti
    // konsep bro, jangan pakai extended pakai 12 jam aja yang max"). It replaces
    // "Extended", which was a full day plus however many hours the guest added in
    // a second field - so the price only settled after two choices, and the row
    // could not state what it cost. A fixed block states it.
    //
    // Its price is a real tier in the API (CHARTER.long = full + 2 hourly), so
    // nothing here computes it - see useCharterTier in CharterPlans.jsx.
    // 140 km is the same 12 km/h the other two lines use (5h/60, 10h/120), not a
    // rounder number picked by eye.
    {
      "dur": "long",
      "name": "12 Hours",
      "sub": "12 hours \u00b7 around 140 km \u00b7 per car up to 5"
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
  // guided tour?" is STACKED UNDER the left one (Sep 2026, Wayan picked option a)
  // rather than sitting full width below the row - see the note on that item.
  "info": [
    { "type": "heading", "sub": false, "html": "Charter Details" },
    { "type": "boxes", "items": [
      { "title": "What's included", "variant": "yes", "list": [
        "A private car and a local driver, for the hours you book",
        "Petrol, parking and road tolls",
        "Pick-up and drop-off at your accommodation",
        "One price per car, up to 5 guests - not per person",
        "Free cancellation up to 24 hours before the trip"
      ] },
      { "title": "Not included", "variant": "no", "list": [
        "Entrance tickets to temples, waterfalls and attractions",
        "Meals and drinks, for you and for the driver",
        "Activities booked on the day, such as rafting or an ATV ride",
        "Hours past the ones you booked - added at the hourly rate"
      ] }
    ] },
    { "type": "boxes", "items": [
      // LEFT COLUMN = two stacked blocks (Sep 2026, Wayan picked option a).
      // "Charter or guided tour?" used to be a full-width heading + paragraph
      // BELOW this row, which left ~80px of white under this column and then
      // more content after it - white in the middle of a row reads as a hole.
      // Stacked here the left column runs longer than the right, so whatever
      // white is left sits at the very END of the card, next to its own bottom
      // padding, where it reads as the end of the text.
      { "stack": [
      { "title": "How the day works", "paras": [
        "You get an air-conditioned car, a local driver and a block of time. Half day is 5 hours, full day is 10, and the longest block is 12.",
        "There is no fixed route. Tell your driver in the morning, or decide as you go. They live here, so ask them if you would rather not plan it yourself.",
        "Running long? Add hours at the hourly rate and settle at the end. A 20% deposit confirms the date; the rest is paid after the trip.",
        "One honest warning: traffic in the south is slow in the afternoon, so plan fewer stops than the map suggests."
      ] },
      { "title": "Charter or guided tour?", "paras": [
        "Both come with a private car and driver. The difference is who plans the day. Our <a href=\"/tour.html\">day tours</a> follow a set route, with a Standard or Exclusive ticket option, so it is worked out for you. A charter hands you the car, the driver and the hours, and leaves the route to you. First visit to Bali? Start with a tour. Already know what you want to see? Charter it."
      ] }
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
    ] }
  ],
  "metaTitle": "Private Car Charter Bali | Half & Full Day",
  "metaDesc": "Charter a private car with driver in Bali from Ubud - half day (5 hours), full day (10 hours) or 12 hours, petrol included. Pick-up from anywhere on the island."
};
