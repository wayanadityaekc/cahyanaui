# Tests and checks

How to run each test and check, and what it needs. Moved here from the header comment of each file (comments are not allowed in code). Paths are relative to the repo root.

## apps/cue/tools/check-assets.js

Every asset the built pages reference must exist on disk, and every asset on
disk should be referenced by something. A missing image is invisible in the
class diff and only shows up as a broken picture in a browser.

## apps/cue/tools/check-classes.js

GATE: malformed Tailwind utilities in source.

A utility that is misspelt in one specific way - a variant prefix with nothing
after it (`hover:`), or the same prefix twice (`hover:hover:bg-cta-d`) - does not
generate ANY CSS. So it is invisible in the built stylesheet, invisible in the
browser, and invisible to every computed-style harness in this repo: there is no
element to measure, because the rule was never written. The only place the damage
exists is the source text, which is why this gate reads source and not `out/`.

It was written after a find-and-replace sweep (the Sep 2026 shadow removal) left
SIX of them behind, and two were worse than dead: in a concatenated class string
the dangling `hover:` glued onto the NEXT segment, so `min-[769px]:flex-col` became
`hover:min-[769px]:flex-col` and the desktop listing cards only took their column
layout while the pointer was over them. Four CI gates and three browser harnesses
all passed on that.

Rule of thumb for the next sweep over class strings: removing a token with a
variant prefix means removing the PREFIX TOO, and a token that was an entire
array entry or line means removing the line.

## apps/cue/tools/check-detail.js

The 71 bookable detail pages deliberately differ from the originals
(Wayan, 3 Sep 2026), so the class diff cannot police them. This checks the
shape they are meant to have instead, so a regression still fails the build.

## apps/cue/tools/check-motion.js

Catches transitions that quietly animate nothing.

Tailwind v4 compiles translate-/rotate-/scale- utilities to the STANDALONE
`translate:` / `rotate:` / `scale:` properties, not to `transform:`. The
keyword utility knows this - `transition-transform` expands to
"transform,translate,scale,rotate" - but a hand-written arbitrary value does
not: `transition-[transform]` is literally just `transform`, so it matches
nothing and the element teleports instead of animating. There is no error and
the build passes; the navbar drawer shipped like that and nobody noticed until
it was measured frame by frame.

Rule 1: an element transitions `transform`, sets translate/rotate/scale, and
        nothing on it sets `transform` -> dead transition.
Rule 2: a clickable declares its own transition list without `scale` -> the
        global press feedback in style.css snaps instead of easing.
Rule 3: a custom property defined as itself (--x: var(--x)) -> it resolves to
        nothing, and every shorthand using it collapses to `all 0s`.

Runs over out/, like the other gates. No browser needed.

## apps/cue/tools/check-pay-agree.mjs

The site shows a figure; the server bills one. They live in two repos and
must never disagree - a guest who agreed to $5 and is charged $15 is the
whole failure mode this feature has.

## apps/cue/tools/check-prices.js

Every listing card carries a `priceFallback` - the number shown until the live
catalog answers, and the one the sticky book bar reads through
priceFallbackFor(). It is a copy of the API's price, so it can drift: change a
price in cahyana-api and the card keeps quoting the old one for the first
moment of every page load.

This compares the two and names anything that has drifted. It is NOT a CI gate
(that runs on out/ alone and has no sibling repo to read); it is the check to
run by hand after touching prices - both repos are open in the same session
anyway. Run: node tools/check-prices.js

## apps/cue/tools/check-timeslots.js

Asserts the start-time schedule in content/shared/timeSlots.js against the real
catalog in cahyana-api/pricing-data.js.

Why this exists: RESTRICTED_SLOTS is keyed by catalog item name, and a key that
does not match ANY item restricts nothing at all - silently. There is no error,
no empty picker, nothing to notice: the item just keeps offering every slot. So a
typo here means a guest can book a sunrise trek for 2pm and the site looks fine.
Every rule Wayan gave is pinned below, so changing one by accident fails loudly.

NOT a CI gate: it needs cahyana-api checked out next to this repo, and CI only
has out/. Run it by hand whenever timeSlots.js or the catalog changes.

## apps/cue/tools/form-rules-test.mjs

Locks the form rules in lib/schemas.js to the behaviour the site shipped before
they became Zod schemas. The expectations below are the original if-chains from
ContactForm / AuthModal / ReviewModal / BookConfirmModal, written out longhand;
every combination of representative values is run through both and compared on
validity AND on the exact message shown.

Run it after touching lib/schemas.js: `node tools/form-rules-test.mjs`. A change
here should only ever be deliberate - e.g. swapping the email regex for z.email()
would start rejecting addresses the booking flow accepts today.

## apps/cue/tools/tw/verify-mytrips.mjs

Functional verification for the My Trips revamp (not a diff=0 migration -
this is new/changed behavior, so verify by interaction, not computed-style diff).

## apps/cue/tools/tw/verify-scroll-lock.mjs

Verify the global scroll-lock (hs-locked on <html> AND <body>) actually applies
across popups, and specifically on the Add Program popup that was reported broken
(Wayan, Sep 2026 - background scroll wasn't locked on iPhone).

## apps/cue/verify-account.mjs

The two places a returning guest used to be handed someone's login.

The server (cahyana-api, tools/account-door-test.js) no longer gives a
browser the session of an account that already existed - it emails that
account a sign-in link. This harness pins the other half: the SITE tells the
guest which inbox to check, and never ends up holding a login it was not
given. Run against the built pages:
  npm run build && npm run serve   (port 4000)
  node verify-account.mjs

## apps/cue/verify-bcm-otp.mjs

Run against the built pages: npm run build && npm run serve (port 4000), then node verify-bcm-otp.mjs
Ad-hoc check: BookConfirmModal's own sign-in note now takes an interactive
6-digit code instead of a passive "check your email" line (wired in 28 Sep
2026, after AuthModal). Exercises a SIGNED-IN guest whose typed contact
email belongs to a DIFFERENT existing account - the one case where the
server still answers a booking with signin_sent instead of a token.

## apps/cue/verify-fx-pay.mjs

The payment step prices with the server's live rate (29 Sep 2026).
  API: node ../cahyana-api/tools/chat-dev-server.js (4599)
  build with NEXT_PUBLIC_API_BASE=http://127.0.0.1:4599/api, serve on 4000.
A cart of one Ubud Tour in AUD and in JPY: the deposit row must read the
catalog's deposit (never a rate the site keeps), and pay-in-full must be the
quote total the server would charge.

## apps/cue/verify-fx.mjs

Live-rate pricing on the built site (29 Sep 2026).

  node ../cahyana-api/tools/chat-dev-server.js                 # API on 4599
  NEXT_PUBLIC_API_BASE=http://127.0.0.1:4599/api npm run build
  node tools/serve-out.js                                      # site on 4000
  node verify-fx.mjs

Checks, at 390 and 1280:
  - the HTML already carries the API's price (build-time catalog), so first
    paint is not a stale fallback;
  - the currency picker offers all 12 currencies, each with a drawn flag, and
    the open list stays on screen;
  - picking a new currency (JPY, SGD) reprices the page in that currency, and
    every price on it reads as a clean ladder number;
  - no page errors, no horizontal overflow.

## apps/cue/verify-gate.mjs

WO2: booking needs an account; browsing and the cart do not.
Sign-in is by a 6-digit CODE now (28 Sep 2026, Wayan), not a link - the whole
thing happens in one popup, on the same page, with no navigation at all.
Drives the built pages (npm run build && npm run serve, port 4000):
  A. logged out -> Pay now = sign-in popup, NOT the booking form; cart untouched
  C. send code -> wrong code shows an error, does not sign in -> right code
     signs in AND opens the held booking, right there, no navigation
  B. create account on an email that already has one -> lands in the SAME
     code stage (one door, whichever way it's reached) -> right code opens
     the held booking
  G. create a genuinely NEW account -> signs in immediately, no code needed
  D. signed in already -> Pay now opens the form, no popup
  E. dismissing the popup opens nothing; the cart is untouched
  F. a stale resume marker (> 1h) does NOT yank a guest off the homepage -
     dead code on the code-entry path now (nothing sets that marker's
     redirect in motion any more), kept for regression insurance since the
     mechanism itself is untouched.

## apps/cue/verify-live.mjs

The live chat, end to end, in a real browser against the real server.

WHY THIS HARNESS HAD TO EXIST. Every earlier check on the chat mocked the
API's HTTP responses, because Railway is not reachable from here. A mocked
response cannot test a WebSocket at all: the upgrade, the ticket, the
heartbeat, a reconnect and the catch-up after it only happen against a server.
So this one starts cahyana-api itself (server.js, unmodified - only the
database is in memory) and lets the page connect for real.

It asserts the two things that are the whole point, and it is careful about the
difference between them:
  1. LIVE - a reply lands without a poll. Proved by counting requests, not by a
     stopwatch: a 5s poll can coincidentally look fast.
  2. STILL WORKS WHEN IT IS NOT LIVE - a guest whose network will not carry a
     WebSocket, and a guest whose socket dropped while Wayan was answering.
     Those are not edge cases; they are most phones on a bad day.

Run:  node ../cahyana-api/tools/chat-dev-server.js   (port 4599)
      NEXT_PUBLIC_API_BASE=http://127.0.0.1:4599/api npm run build
      node tools/serve-out.js                        (port 4000)
      node verify-live.mjs

## apps/cue/verify-rail-sidebar.mjs

Collapsible rail + breadcrumb-in-header on My Trips/Our Company/Settings
(Sep 2026, Wayan: "make it like shadcn's sidebar-08" - picked the
collapsible toggle and the header breadcrumb, applied to all three account
pages). Run against the built pages: npm run build && npm run serve.

## apps/cue/verify-rail.mjs

Card (DOKU) is the default payment rail; PayPal is the guest's choice
(29 Sep 2026). Run against the built site + the local API:
  PAYPAL_CLIENT_ID=x PAYPAL_SECRET=x DOKU_CLIENT_ID=BRN-x DOKU_SECRET=SK-x \
    node ../cahyana-api/tools/chat-dev-server.js        # 4599, both rails "on"
  NEXT_PUBLIC_API_BASE=http://127.0.0.1:4599/api npm run build
  node tools/serve-out.js                               # 4000
  node verify-rail.mjs

Per currency x width, at the payment step of a real checkout:
  - two rail choices, Card checked by default;
  - Card + a non-rupiah currency: every amount is the EXACT rupiah figure the
    server bills (quote lines' rupiah + the catalog's rupiah deposit), the
    guest's own figure beside it as an estimate, and the note says so;
  - Card + rupiah: no estimate, no note;
  - PayPal: amounts in the guest's own currency, no rupiah (IDR -> told USD);
  - after Book Now, the checkout shown is the CHOSEN rail's, and the DOKU
    request carries only booking_ref + option (never an amount).
Plus: an experience page says "for 2 guests", never "per person".

## apps/cue/verify-review.mjs

The review popup, in the browser, on the built pages.

What is being pinned: a submit that partly succeeds must SAY so. It used to
throw on the first refusal, so reviews already published were reported as a
single red error - the guest read "nothing happened", tried again, and got
"you've already submitted a review for this tour".
Run it against the BUILT pages, not `next dev`:
  npm run build && npm run serve   (port 4000)
  node verify-review.mjs

## apps/cue/verify-reviewgroup.mjs

One review posted for 3 trips: one card on mixed lists ("Ubud Tour + 2 more"), its own copy on each trip's page.
Run: npm run build && npm run serve, then node verify-reviewgroup.mjs

## apps/cue/verify-reviewkey.mjs

Reviews show on the page they belong to, and each page has one Write review button.
Run: npm run build && npm run serve, then node verify-reviewkey.mjs
Reviews are stored under the booking name (bookItem); every lookup (list, hero stars, card stars) must use it.

## apps/cue/verify-reviews-page.mjs

Reviews page redesign (Sep 2026, Wayan: "use the template of listing page
... H1 white ... don't need extra text ... put review also in the menu").
Pins: "Reviews" reachable from both nav surfaces, hero H1 actually renders
white (not the shared SUBHERO_TITLE's near-invisible soft-black on this
page's dark photo), the old marketing paragraph is gone, and the content
section lines up with the listing pages' own left edge, not a stray 0/32px.
Run against the built pages: npm run build && npm run serve (port 4000).

## apps/cue/verify-reviews-slider.mjs

Homepage reviews section, Sep 2026 (Wayan: "reviews section need to be as a
slider side, not scrolling to bottom because it's too long ... create a fix
box per review and it can see details when got clicked, button see all
reviews go to the page review"). Pins: uniform card height, the section is
a horizontal slider (not a grid that grows with review count), clicking a
card opens the full text in a popup, "See all reviews" actually links to
/all-reviews.html (was missing `.html`, a straight 404 on this static
export), and that page's own cards are click-to-detail too.
Run against the built pages: npm run build && npm run serve (port 4000).

## apps/cue/verify-reviews3.mjs

Reviews on the three pages that are not detail pages, and the email link that
has to land ON the review rather than near it.

## apps/cue/verify-sale.mjs

The seasonal sale, as a guest sees it. The server side is pinned by
promo-test.js in cahyana-api; this is only about what reaches the screen.

THE RULE BEING TESTED is "strike it through only when the two numbers really
differ" - not "a sale is running". A card that crosses a number out because a
flag was set somewhere is exactly the invented discount BookBar deliberately
refused to copy from GetYourGuide.

## apps/cue/verify-settings.mjs

WO3 (Sep 2026): settings page grows a large avatar, "My reviews", and
"Delete account" (deletes the account, keeps bookings + reviews - the
confirmation modal has to say so plainly, per the brief). Run against the
built pages: npm run build && npm run serve (port 4000).

## apps/cue/verify-signin-prompt.mjs

Logged-out empty state on Settings + My Trips (Sep 2026, Wayan: "match it to
My Trips's shape, then upgrade both together"). Before this Settings was a
bare unstyled <p> with no button anywhere on the page, and My Trips had a
lead+sub shape but no button either. Both now share components/account/
SignInPrompt.jsx: same copy shape, and a real "Sign in" button that opens
AuthModal in place. Run against the built pages: npm run build && npm run serve.

## apps/cue/verify-slider-arrows.mjs

Slider arrows show only when they can move (hover on desktop). Run: npm run build && npm run serve, then node verify-slider-arrows.mjs
The bug this guards: the arrows were hidden with the `hidden` attribute, which loses to their own `min-[993px]:flex` class.

## apps/cue/verify-wo5-fixedfooter.mjs

Follow-up on WO5 (Sep 2026, Wayan: "whichever page has compact footer, the
footer needs to be sticky at the bottom, only the content scrolled"). The
compact footer goes from "last thing on the page" to fixed at the viewport
bottom on Settings/My Trips/Our Company. Run against the built pages:
npm run build && npm run serve (port 4000).

## apps/cue/verify-wo5.mjs

WO5 (Sep 2026): compact footer on Settings/My Trips/Our Company, sticky
sidebar reusing RailLayout on My Trips + Our Company (legal pages live
inside Our Company), and My Trips' duplicate title trimmed to one.
Run against the built pages: npm run build && npm run serve (port 4000).

## apps/cue/verify-wo7.mjs

WO7 - the fixes from the component audit, measured in a real browser.

  npm run build && cp -r out /tmp/out-after          (the build under test)
  (a build of the previous main, copied to /tmp/out-before)
  BEFORE=/tmp/out-before AFTER=/tmp/out-after node verify-wo7.mjs

Two builds are served side by side (ports 4711 / 4712) so "what changed" is a
measurement, not a claim. Sections:
  1. borders   - histogram of every computed border colour, before vs after: the
                 off-token hairline shades must be GONE and --line must gain exactly
                 what they lost; page heights must not move.
  2. cards     - hover a card: it must not move (and on the BEFORE build it DID -
                 proves the check can fail).
  3. menus     - disclosure, not role=menu; aria-expanded/controls; Escape returns focus.
  4. tabs      - the programs tab page is gone, so the site has no role=tab at all;
                 jump-nav and rail are navigation, not tabs.
  5. dialogs   - role/label, focus lands inside, Tab trapped, Escape closes,
                 focus returns to the opener. Modal (AuthModal) + ModalPresence (review).
  6. live      - toast region always mounted; form errors are role=alert.

## apps/villas/tools/check-assets.js

GATE (ported from CUE): every local file the built pages reference exists in out/, and every page carries a favicon link.
A missing image is invisible to the build and only shows up as a broken picture in a browser.

## apps/villas/tools/check-classes.js

GATE (ported from CUE): malformed Tailwind utilities in SOURCE, the only place they exist.
A dangling prefix (`hover:`) or a doubled one (`hover:hover:bg-cta`) generates no CSS at all, so out/ and every browser check are blind to it.
In a concatenated class string a dangling `hover:` also glues onto the next segment and turns it into a hover-only rule.

## apps/villas/tools/check-detail.js

GATE (villa version of CUE's check-detail): every villa page keeps the shape that sells the stay.
Per villa in lib/villas.js: the booking panel, the flush mobile book bar, an h1 with the villa name, a LodgingBusiness JSON-LD with an IDR Offer at the villa's own rate, and a BreadcrumbList that ends on this page.

## apps/villas/tools/check-motion.js

GATE (ported from CUE): transitions that quietly animate nothing. Runs over out/, no browser.
Tailwind v4 compiles translate-/rotate-/scale- to the standalone `translate:`/`rotate:`/`scale:` properties, so `transition-[transform]` matches nothing and the element jumps.
Rule 1 DEAD : an element transitions `transform`, sets translate/rotate/scale, and nothing on it sets `transform`.
Rule 2 SNAP : a clickable declares its own transition list without `scale`, so the global press feedback in app/globals.css snaps.
Rule 3 CYCLE: a custom property defined as itself (--x: var(--x)) resolves to nothing and every shorthand using it collapses to `all 0s`.

## apps/villas/tools/check-urls.js

GATE (villa version of CUE's check-urls): links, sitemap, canonicals and robots.txt all agree with what the build wrote.
Every internal link lands on a built page, out/sitemap.xml lists exactly lib/routes.js indexablePaths(), every sitemap URL was built, every indexable page's canonical is its own sitemap URL, and robots.txt points at the sitemap.

## packages/ui/tests/my-cahyana-pill-test.mjs

MyCahyanaPill: one link to my., person | bag, the dot only until seen, no count, onTap wired, the EN button's box.
Run: node packages/ui/tests/my-cahyana-pill-test.mjs [node_modules dir]
Needs a node_modules with @swc/core, react, react-dom, lucide-react and clsx; default: the sibling villa repo's
(../ubud-private-villas/node_modules next to this repo). Measured layout is checked in each site's verify-my-pill.mjs.

## packages/ui/tests/program-card-test.mjs

ProgramCard is CUE's HomepageCard: 22px corners and the 4:5 shape, no tint over the photo, CUE's green accent, New until rated,
score and count once rated, the currency symbol set apart and rupiah thousands set smaller, CUE's green gradient without a photo.
Run: node packages/ui/tests/program-card-test.mjs [node_modules dir] (same needs as my-cahyana-pill-test). Proven to fail on 1.1.0's card.

## tools/check-no-legacy-css.mjs

Phase 3's own gate: the component CSS classes are GONE, from the stylesheet
and from the markup. Without this, a single hand-written className="card"
quietly reintroduces the second definition the whole exercise removed.

## tools/check-policy.mjs

The policy numbers, the gallery and the cross-sell. Policy is checked as a
RULE - the figures a guest reads must be the ones in content/policies.js, and
must be the same wherever they appear. A site that states two refund windows
is worse than one that states none.

## tools/money-parity-test.mjs

Compares @cahyana/ui lib/money.js with cahyana-api fx.js; needs the cahyana-api clone beside this repo.
