// Legal pages (Terms / Privacy / Cancellation) content.
// TW-B2 (#335): body moved from a raw HTML string (dangerouslySetInnerHTML) to a
// structured block array rendered by <Prose> (components/prose/Prose.jsx), the
// same schema guide articles use (content/schema/prose.js, TW-B1 #334). Text +
// order are byte-identical to the pre-migration HTML - only the outer wrapper +
// class attribute move from string to JSX. Block class names are kept ORIGINAL
// on purpose (converting them to utilities is B-FINAL, not this issue).
export const LEGAL = {
  "terms-conditions": {
    "heroClass": "subhero subhero--overlap",
    "heroStyle": "background-image: linear-gradient(135deg, rgba(31, 61, 43, 0.96), rgba(46, 90, 64, 0.94));",
    "title": "Terms & Conditions",
    "text": "The simple ground rules for booking and travelling with us - clear, upfront, and fair.",
    "metaTitle": "Terms &amp; Conditions | Cahyana Ubud Experience",
    "metaDesc": "The terms and conditions for booking tours, transfers, and experiences with Cahyana Ubud Experience in Ubud, Bali - booking, payment, changes, and your responsibilities.",
    "body": [
      { "type": "crumb", "html": "<a href=\"/\">Home</a> &rsaquo; Terms &amp; Conditions" },
      { "type": "para", "html": "<em>Last updated: 1 July 2026</em>" },
      { "type": "para", "html": "These Terms &amp; Conditions apply to every booking made with Cahyana Ubud Experience. By booking a tour, transfer, or experience with us - through this website, WhatsApp, email, or in person - you agree to the terms below. Please read them before you book." },
      { "type": "heading", "html": "1. Who we are" },
      { "type": "para", "html": "Cahyana Ubud Experience is a local travel service based in Ubud, Bali, offering private tours, driver and transfer services, and curated experiences. In these terms, \"we\", \"us\", and \"our\" refer to Cahyana Ubud Experience, operated by I Wayan Aditya Eka Cahyana, Ubud, Bali, Indonesia." },
      { "type": "heading", "html": "2. Booking &amp; confirmation" },
      { "type": "para", "html": "You can request a booking through our website, by WhatsApp, or by email. A booking is only confirmed once you make a deposit payment then we will contact you shortly. Payment can be made online by card (processed securely via a third-party payment provider), or later as agreed." },
      { "type": "list", "variant": "yes", "items": [
        "Please book with as much notice as possible, especially in high season.",
        "Give us an accurate pick-up location, date, time, and number of guests.",
        "Keep your WhatsApp or email reachable so we can confirm details and pick-up."
      ] },
      { "type": "heading", "html": "3. Prices &amp; payment" },
      { "type": "para", "html": "All prices shown on this website are indicative and confirmed at the time of booking. Tour prices are quoted <strong>per car</strong> (not per person) unless stated otherwise, and you can switch the currency shown at any time - the amount you pay is the amount you see." },
      { "type": "list", "variant": "yes", "items": [
        "<strong>Standard</strong> tours include car, driver, and fuel; entrance tickets are not included.",
        "<strong>Exclusive</strong> tours include everything in Standard plus entrance tickets for the listed attractions, priced per person.",
        "A $10 deposit may be requested to confirm certain bookings; the balance is paid on the day of your trip - either charged automatically or settled in person by cash or transfer after your tour.",
        "Prices may change for public holidays, special events, and has an additional pick up fee outside the Ubud area - we will always tell you before you confirm."
      ] },
      { "type": "heading", "html": "4. Changes &amp; cancellations" },
      { "type": "para", "html": "Need to change your date, timing, or group size? Message us as early as you can and we will do our best to accommodate you, subject to availability. Cancellations and refunds are covered in full by our <a href=\"/our-company.html#cancellation\">Cancellation &amp; Refund Policy</a>, which forms part of these terms." },
      { "type": "heading", "html": "5. Your responsibilities" },
      { "type": "list", "variant": "yes", "items": [
        "Be ready at the agreed pick-up point and time - late starts can shorten the day.",
        "Bring a valid ID or passport where needed, and cash for any items not included.",
        "Dress respectfully and follow local etiquette at temples and sacred sites.",
        "Follow your driver's and guide's safety instructions during activities."
      ] },
      { "type": "heading", "html": "6. Activities &amp; safety" },
      { "type": "para", "html": "Some experiences (trekking, ATV, rafting, swings, and similar) involve physical activity and a degree of risk. You take part at your own responsibility and should tell us in advance about any medical condition, pregnancy, mobility issue, or dietary need so we can advise on suitability." },
      { "type": "heading", "html": "7. Third-party services" },
      { "type": "para", "html": "Entrance tickets, performances, and adventure activities are often operated by third parties. We arrange and coordinate these on your behalf, but their own rules, schedules, and safety standards apply, and they may be non-refundable once booked." },
      { "type": "heading", "html": "8. Liability" },
      { "type": "para", "html": "We take great care to run every trip safely and smoothly. To the extent permitted by law, we are not liable for delays or changes caused by events beyond our control - traffic, weather, road closures, religious ceremonies, or third-party providers." },
      { "type": "heading", "html": "9. Insurance" },
      { "type": "para", "html": "We strongly recommend that all guests hold their own valid travel insurance covering the activities they plan to join." },
      { "type": "heading", "html": "10. Governing law" },
      { "type": "para", "html": "These terms are governed by the laws of the Republic of Indonesia, and any dispute will be handled in the courts of Bali, Indonesia." },
      { "type": "heading", "html": "11. Changes to these terms" },
      { "type": "para", "html": "We may update these Terms &amp; Conditions from time to time. The version published on this page at the time of your booking is the one that applies." },
      { "type": "heading", "html": "12. Contact" },
      { "type": "para", "html": "Questions about these terms? <a href=\"/our-company.html#contact\">Contact us</a> - we are happy to help before you book." }
    ]
  },
  "privacy-policy": {
    "heroClass": "subhero subhero--overlap",
    "heroStyle": "background-image: linear-gradient(135deg, rgba(31, 61, 43, 0.96), rgba(46, 90, 64, 0.94));",
    "title": "Privacy Policy",
    "text": "What we collect, why we collect it, and how we keep it safe - in plain language.",
    "metaTitle": "Privacy Policy | Cahyana Ubud Experience",
    "metaDesc": "How Cahyana Ubud Experience collects, uses, and protects your information when you book a tour, transfer, or experience in Ubud, Bali.",
    "body": [
      { "type": "crumb", "html": "<a href=\"/\">Home</a> &rsaquo; Privacy Policy" },
      { "type": "para", "html": "<em>Last updated: 1 July 2026</em>" },
      { "type": "para", "html": "Your privacy matters to us. This policy explains what information Cahyana Ubud Experience collects when you contact or book with us, how we use it, and the choices you have. We only ever ask for what we need to plan and run your trip." },
      { "type": "heading", "html": "1. Who we are" },
      { "type": "para", "html": "Cahyana Ubud Experience is a local travel service in Ubud, Bali, operated by I Wayan Aditya Eka Cahyana. If you have any question about your data, you can reach us at <a href=\"mailto:cahyanabaliexperience@gmail.com\">cahyanabaliexperience@gmail.com</a>." },
      { "type": "heading", "html": "2. Information we collect" },
      { "type": "para", "html": "When you make a booking or enquiry, we may collect:" },
      { "type": "list", "variant": "yes", "items": [
        "Your name and contact details (WhatsApp number and/or email address).",
        "Your trip details - service, date, number of guests, and pick-up location.",
        "Any notes you send us (special requests, dietary needs, accessibility)."
      ] },
      { "type": "para", "html": "We do <strong>not</strong> collect or store your payment card details on this website." },
      { "type": "heading", "html": "3. How we use your information" },
      { "type": "list", "variant": "yes", "items": [
        "To confirm your booking and arrange your driver, guide, and any tickets.",
        "To contact you about your trip before, during, and after it.",
        "To answer your questions and improve the service we offer."
      ] },
      { "type": "heading", "html": "4. Who we share it with" },
      { "type": "para", "html": "We only share your details when it is needed to deliver your booking - for example, giving your driver your pick-up point, or booking an entrance ticket or activity with a third-party provider on your behalf. We do <strong>not</strong> sell your personal information to anyone." },
      { "type": "heading", "html": "5. Cookies &amp; local storage" },
      { "type": "para", "html": "This website does not use advertising or third-party tracking cookies. To make your visit smoother, we store a few small settings directly in your browser (your chosen currency and your saved itinerary). This stays on your device and is not sent to us. If we ever add analytics or similar tools in the future, we will update this policy first." },
      { "type": "heading", "html": "6. How long we keep it" },
      { "type": "para", "html": "We keep your booking information only for as long as needed to run your trip and for our normal record-keeping, then remove it." },
      { "type": "heading", "html": "7. Your rights" },
      { "type": "para", "html": "You can ask us to see, correct, or delete the personal information we hold about you at any time. Just contact us at <a href=\"mailto:cahyanabaliexperience@gmail.com\">cahyanabaliexperience@gmail.com</a> and we will take care of it." },
      { "type": "heading", "html": "8. Children's privacy" },
      { "type": "para", "html": "Our services are booked by adults. We do not knowingly collect personal information directly from children; bookings that include children are made by a parent or guardian." },
      { "type": "heading", "html": "9. Changes to this policy" },
      { "type": "para", "html": "We may update this Privacy Policy from time to time. The version shown on this page is the one that currently applies." },
      { "type": "heading", "html": "10. Contact" },
      { "type": "para", "html": "Questions about your privacy? <a href=\"/our-company.html#contact\">Contact us</a> - we are glad to help." }
    ]
  },
  "cancellation-policy": {
    "heroClass": "subhero subhero--overlap",
    "heroStyle": "background-image: linear-gradient(135deg, rgba(31, 61, 43, 0.96), rgba(46, 90, 64, 0.94));",
    "title": "Cancellation &amp; Refund Policy",
    "text": "Plans change - here is exactly how cancellations, reschedules, and refunds work.",
    "metaTitle": "Cancellation &amp; Refund Policy | Cahyana Ubud Experience",
    "metaDesc": "How to cancel or reschedule a booking with Cahyana Ubud Experience - free-cancellation window, deposits, refunds, no-shows, and bad-weather options.",
    "body": [
      { "type": "crumb", "html": "<a href=\"/\">Home</a> &rsaquo; Cancellation &amp; Refund Policy" },
      { "type": "para", "html": "<em>Last updated: 1 July 2026</em>" },
      { "type": "para", "html": "We keep cancellations simple and fair, whether you paid a deposit, in full, or nothing yet. Cancelling with enough notice is quick and free - the details below explain the timings, deposits, and refunds so there are no surprises." },
      { "type": "heading", "html": "1. How to cancel or reschedule" },
      { "type": "para", "html": "Just message us on WhatsApp or by email as early as you can, with your name and the date of your booking. We will confirm the cancellation or the new date in writing." },
      { "type": "heading", "html": "2. Free-cancellation window" },
      { "type": "para", "html": "Cancel at least 24 hours before your scheduled start time and there is nothing to pay - and any deposit you paid is fully refunded." },
      { "type": "heading", "html": "3. Deposits &amp; refunds" },
      { "type": "para", "html": "Where a $10 deposit was taken to confirm your booking or if you choose to make a full payment, refunds work as follows:" },
      { "type": "list", "variant": "yes", "items": [
        "Cancel more than 24 hours before start: full refund of the deposit.",
        "Cancel within 24 hours before start: the deposit is non-refundable.",
        "Balance for the tour itself is only due once the service is delivered.",
        "Refunds are returned to your original payment method - your card via our third-party payment provider, or bank transfer if you paid that way - and typically take 7-14 business days to arrive."
      ] },
      { "type": "heading", "html": "4. No-shows" },
      { "type": "para", "html": "If no one is at the pick-up point at the agreed time and we cannot reach you, the booking is treated as a no-show and any deposit is non-refundable." },
      { "type": "heading", "html": "5. Rescheduling" },
      { "type": "para", "html": "Want to move your trip to another day instead of cancelling? We are happy to reschedule as often as you need, at no extra cost and subject to availability. Bali's weather can be unpredictable, so we keep this flexible." },
      { "type": "heading", "html": "6. Weather &amp; events beyond control" },
      { "type": "para", "html": "If heavy weather, a road closure, a religious ceremony, or another event outside our control makes a trip unsafe or impossible, we will offer you a reschedule or a full refund of anything you have paid." },
      { "type": "heading", "html": "7. If we cancel" },
      { "type": "para", "html": "In the rare case that we have to cancel on our side, you will always be offered a full refund or an alternative date - your choice." },
      { "type": "heading", "html": "8. Third-party tickets &amp; activities" },
      { "type": "para", "html": "Some entrance tickets, performances, and adventure activities are booked with third-party providers and may be non-refundable once purchased. We will tell you clearly before booking anything that carries its own cancellation terms." },
      { "type": "heading", "html": "9. How refunds are paid" },
      { "type": "para", "html": "Approved refunds are returned to your original payment method - your card via our third-party payment provider, or bank transfer if you paid that way - within 7-14 business days." },
      { "type": "heading", "html": "10. Contact" },
      { "type": "para", "html": "Need to cancel or have a question? <a href=\"/our-company.html#contact\">Contact us</a> - the sooner you tell us, the more flexible we can be." }
    ]
  }
};
