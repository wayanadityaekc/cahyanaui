export const AIRPORT = {
  "title": "Bali Airport Transfer",
  "sub": "Private car to or from Ngurah Rai Airport (DPS), fixed price. Add your flight number and time so your driver knows when to be there.",
  "boxId": "airport-transfer",
  "boxTitle": "Book Your Airport Transfer",
  // Info body (TW-B4 #337): was infoHtml raw string -> Prose blocks. Rendered
  // inside <section.info><div.info__container> (both classes kept - shared/B-FINAL).
  // TWO PLAIN COLUMNS, not a run of full-width prose (Sep 2026, Wayan). Capped at
  // --container-read and left-aligned, four paragraphs only filled the left half of
  // a 1200px container and left the right half of the page empty. Same { type:
  // 'boxes' } pattern the charter page uses for its explainers - no variant, so no
  // frame and no tint, just two columns. The two blocks are a natural pair: two
  // paragraphs each, and they come out close in height.
  //
  // Titles in sentence case to match charter's boxes ("How the day works").
  "info": [
    { "type": "boxes", "items": [
      { "title": "Why we ask for flight details", "paras": [
        "Domestic and international flights land at different terminals, and delays happen. Your flight number and scheduled time let your driver track the actual landing time instead of guessing, so they're waiting when you clear immigration and baggage claim rather than parking and watching the clock.",
        "For a departure drop-off, the same details help time the pick-up from your hotel or villa so you reach the airport with enough buffer for check-in and security, without sitting around too early."
      ] },
      { "title": "How it works", "paras": [
        "Fill in the direction, date, and guest count, then your hotel or villa address and flight details. Confirm the booking with only a $10 deposit, and the rest is settled directly with your driver. You'll get a booking confirmation by email with everything you entered - if a flight changes, reply to that email or message us on WhatsApp and we'll pass it on to your driver.",
        "Need the return leg too? Book it separately closer to your departure date, once your flight is confirmed - the direction picker above covers both pickup and drop-off."
      ] }
    ] }
  ],
  "metaTitle": "Bali Airport Transfer Booking | Flight Details Form",
  "metaDesc": "Book your private Bali airport transfer to or from Ubud. Add your flight number and time so your driver tracks delays and is ready when you land or need pickup.",
  // Good-to-know (TW-B4 #337): was tinfoHtml raw string -> data for <DetailTinfo>.
  "tinfo": {
    "facts": [
      { "label": "Availability", "value": "24 / 7" },
      { "label": "Capacity", "value": "Up to 5 pax" },
      { "label": "Meet & greet", "value": "Meet & greet at arrivals" },
      { "label": "Language", "value": "English-speaking driver" }
    ],
    "included": [
      "Private air-conditioned car and fuel",
      "Professional English-speaking driver",
      "Meet & greet with a name board at arrivals",
      "Flight tracking, so your driver adjusts for delays",
      "Luggage assistance",
      "Free bottled water"
    ],
    "excluded": [
      "Extra stops beyond the airport and your address",
      "Waiting time beyond a reasonable grace period if flight details are missing or change without notice",
      "Meals and personal expenses",
      "Tips and gratuities (optional)"
    ]
  }
};
