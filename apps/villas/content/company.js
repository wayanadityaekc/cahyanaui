// Our Company content. Every line here is a fact already established on this
// site or in its real Airbnb listings — nothing about how the business operates
// is invented.
//
// DELIBERATELY ABSENT: Terms & Conditions and a Cancellation & Refund policy.
// CUE's Our Company carries both, but those are commitments only Wayan can set,
// and writing plausible-sounding ones would put promises on the site that
// nobody agreed to. The tab list below is the whole page — add the two entries
// to TABS in OurCompany.jsx and a block here once the real policy exists.

export const ABOUT = [
  { type: 'heading', html: 'Who we are' },
  { type: 'para', html: 'Cahyana Ubud is a family operation in north Ubud. Made and his wife opened Cahyana House first - three bedrooms around a private pool, inside the family compound. Wayan, born and raised here, followed with Cahyana Tibuah out in the rice fields.' },
  { type: 'para', html: 'Between them the two villas have collected over 300 reviews and a 4.96 average, and both carry Airbnb&rsquo;s Superhost and Guest Favourite badges. We still answer the messages ourselves.' },
  { type: 'heading', html: 'How we host' },
  { type: 'para', html: 'There&rsquo;s no reception and no uniform. At Cahyana House you&rsquo;re welcomed through the family compound; at Tibuah you let yourself in. Either way you get a phone number that answers, usually within the hour.' },
  { type: 'para', html: 'Breakfast is cooked in your kitchen. Massage comes to your pool. Housekeeping, fresh linens, airport pickup, a scooter if you need one - ask and we&rsquo;ll sort it. If you want a driver for the day, that&rsquo;s us as well: the same team runs Cahyana Ubud Experience.' },
  { type: 'heading', html: 'Where we&rsquo;re going' },
  { type: 'para', html: 'Two villas today. The plan is to look after other people&rsquo;s villas the same way - owners in Ubud who want their place hosted properly rather than listed and forgotten. If that&rsquo;s you, get in touch.' },
];

// Answers stick to what the villa pages, services pages and listings already
// say. Anything that would be a new commitment (deposit size, refund windows,
// minimum stay) is left out rather than guessed at.
export const FAQ = [
  {
    cat: 'The villas',
    items: [
      ['How many people can each villa sleep?', 'Cahyana House has three bedrooms and sleeps up to six. Cahyana Tibuah has two bedrooms and sleeps up to four. Both are booked as an entire house - you never share with other guests.'],
      ['Does each villa really have its own pool?', 'Yes. Each house has a private pool used only by the guests staying in it, with the garden around it.'],
      ['Is there a kitchen?', 'Both villas have a full kitchen, so you can cook for yourself. It is also where breakfast gets made if you order it.'],
      ['What is the difference between the two?', 'Cahyana House is the larger one, inside the family compound, and suits families or two couples. Cahyana Tibuah is smaller and sits out by the rice fields, which makes it quieter. The villas page compares them side by side.'],
    ],
  },
  {
    cat: 'Booking and payment',
    items: [
      ['How do I book?', 'Pick your dates on any villa page and add them to your booking. When you are ready, the booking opens a WhatsApp message with your dates, guests and the price already filled in, and we confirm from there.'],
      ['Is the price on the site what I pay?', 'The nightly rate and the service fee are both shown before you send anything, and the total is worked out on your dates. Rates do change by season - if the dates you picked fall in a different season we tell you before you commit, not after.'],
      ['Can I pay in my own currency?', 'The prices switch between USD, IDR, EUR, AUD and GBP from the currency picker in the menu. Those conversions are for reading only - the amount actually charged is settled in the conversation.'],
      ['Do you take bookings outside Airbnb?', 'Yes, and booking direct with us is why this site exists. Both villas are also on Airbnb if you would rather book there.'],
    ],
  },
  {
    cat: 'During your stay',
    items: [
      ['What time can I check in?', 'Tell us your arrival time in the booking message and we will confirm it. There is no front desk, so somebody meets you - we would rather agree a time than have you waiting at a gate.'],
      ['Is breakfast included?', 'It is a service you can add, not something bundled into the rate. It is cooked in your own kitchen. The breakfast page has what is on offer.'],
      ['Can I get a massage at the villa?', 'Yes - the therapist comes to you, poolside or indoors. Ask on the day with some notice. It is for staying guests only.'],
      ['Can you arrange a driver or airport pickup?', 'Yes. The same family runs Cahyana Ubud Experience, which does airport transfers, day tours and car charter with the prices published up front.'],
      ['Can I rent a scooter?', 'We can arrange one. Bring a licence that covers you to ride in Indonesia, and wear the helmet - the scooter rental page covers what to expect.'],
    ],
  },
  {
    cat: 'Getting here',
    items: [
      ['Where exactly are the villas?', 'North Ubud, in Gianyar. Ubud Palace, the Monkey Forest and Tegallalang are all around ten minutes away by car.'],
      ['How far is the airport?', 'Ngurah Rai (DPS) to Ubud is roughly an hour and a half, longer in afternoon traffic. We can have a driver meet you.'],
      ['Do I need a scooter or car to stay here?', 'Not strictly - but north Ubud is not a walk-everywhere location. Most guests either ride, or have us drive them. There are cafes and warungs within a short walk of both villas.'],
    ],
  },
];

// Written from what this site actually does in a browser, not from a template.
export const PRIVACY = [
  { type: 'heading', html: 'What this site collects' },
  { type: 'para', html: 'This site has no accounts, no sign-up and no tracking pixels. Nothing you type into it is sent to a server by the site itself.' },
  { type: 'para', html: 'The dates, guest count, currency and booking you build are saved in your own browser&rsquo;s local storage so the site remembers them if you come back. That data never leaves your device, and clearing your browser data removes it.' },
  { type: 'heading', html: 'What happens when you book' },
  { type: 'para', html: 'Sending a booking opens WhatsApp with a message already written out - your villa, dates, guests and the total. Nothing is transmitted until you press send in WhatsApp yourself. From that point the conversation is covered by WhatsApp&rsquo;s own privacy terms as well as ours.' },
  { type: 'para', html: 'What you send us - your name, your phone number and whatever you tell us about your stay - we keep only to arrange and host that stay. We do not sell it, and we do not pass it to anyone who is not part of hosting you.' },
  { type: 'heading', html: 'Other companies' },
  { type: 'para', html: 'If you book through Airbnb instead, Airbnb handles your data under its own policy and we see only what it shows a host. If you book a driver or a transfer, that is arranged through Cahyana Ubud Experience, run by the same family.' },
  { type: 'heading', html: 'Asking us about your data' },
  { type: 'para', html: 'Message us on WhatsApp or email hello@ubudprivatevillas.com and ask what we hold or ask us to delete it. It is a small family operation - you will be talking to the person who has the information.' },
];
