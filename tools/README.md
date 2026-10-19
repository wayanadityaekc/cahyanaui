# Tools

What each tool does and how to run it. Moved here from the header comment of each file.

## apps/cue/tools/make-icons.js

Rebuild the favicon set from one source logo:
  node tools/make-icons.js path/to/logo.png

Not a CI gate - run it by hand when the logo changes, then commit what it
writes into public/assets/icons/. The <link> tags in app/layout.jsx already
point at these filenames and carry a content hash, so nothing else to touch.

sharp comes in transitively with Next (it is not in package.json). If a future
install drops it, `npm i -D sharp` and run this again.

## apps/cue/tools/serve-out.js

Serve the built site locally, exactly as Hostinger does.

Why this exists and `npm run dev` does not do the job: every internal link on
this site ends in `.html` (`/ubud-tour.html`), because that is what the static
export writes and what the canonical URLs, the sitemap and the redirects all
use. `next dev` does not serve those - it serves `/ubud-tour` and answers 404
(or 500) for the `.html` form. So in dev, clicking any card lands on an error
page. Nothing is wrong with the site; dev is just not serving the artifact we
actually ship.

  npm run build && node tools/serve-out.js     ->  http://localhost:4000

Use this for anything that involves clicking through the site, and for testing
checkout end to end.

## apps/cue/tools/tw/diff.mjs

tools/tw/diff.mjs — Tailwind migration verifier (epic #321).
Compares two computed-style snapshots (from tools/tw/snap.mjs). Prints "IDENTICAL"
(exit 0) or the exact per-element property diffs (exit 1). A conversion is only
safe to keep — and its old CSS only safe to delete — when this says IDENTICAL.

Usage: node tools/tw/diff.mjs <before.json> <after.json>

NOTE: element count MUST match. Class->utility conversions keep the DOM structure,
so the index-aligned compare is valid. If counts differ, you changed structure —
re-check (or use a selector that captures the same subtree in both builds).

## apps/cue/tools/tw/diffx.mjs

tools/tw/diffx.mjs — diff for snapx.mjs snapshots (element main + ::before + ::after).
Prints "IDENTICAL" (exit 0) or per-element/pseudo property diffs (exit 1).
Usage: node tools/tw/diffx.mjs <before.json> <after.json>

## apps/cue/tools/tw/remove-fam.mjs

tools/tw/remove-fam.mjs — Tailwind migration helper (epic #321).
Removes CSS rules for a "dead" class family from a stylesheet, comment/string-safe.
A style rule is dropped when EVERY selector in its list references a class matching
<deadRegex> (unless it also matches <keepRegex>). Grouped rules keep their live
selectors. @media/@supports are recursed; emptied media blocks are dropped.

Usage:
  node tools/tw/remove-fam.mjs <file.css> "<deadRegex>" ["<keepRegex>"]

REGEX GOTCHA: use a negative-lookahead boundary `(?![a-z0-9])`, NOT `\b`.
`\b` does NOT sit between `q` and `_`, so `\.faq\b` misses `.faq__container`.
`\.faq(?![a-z0-9])` matches `.faq`, `.faq__x`, `.faq-x` but not a different `.faqx`.

Example (drop the whole .booking/.book-bar/.summary family; grid engine + tokens are
left alone automatically because they don't match the regex):
  node tools/tw/remove-fam.mjs style.css "\\.(booking|book-bar|booksidebar|bookcard|summary)(?![a-z0-9])"

keepRegex protects a selector you must NOT drop yet — e.g. a grouped rule that also
styles content HTML (`.faq__a p` alongside `.subhero__text`). If your component
already restyles that part via `[&_p]:` utilities, you don't need keepRegex.
  node tools/tw/remove-fam.mjs style.css "\\.faq(?![a-z0-9])" "\\.faq__a"

ALWAYS: verify computed-style diff = 0 (tools/tw/snap.mjs + diff.mjs) BEFORE running
this, and re-verify + check `{}` brace balance AFTER. Idempotent — safe to re-run
after a rebase if a sibling PR already removed part of the family.

## apps/cue/tools/tw/snap-cart.mjs

Seeded snapshot of the My-Trips cart (client-rendered from localStorage).
Usage: node tools/tw/snap-cart.mjs <out.json>

## apps/cue/tools/tw/snap-modal.mjs

Interaction snapshot for the driver profile modal (portaled, opens on click).
Usage: node tools/tw/snap-modal.mjs <page.html> <out.json>

## apps/cue/tools/tw/snap.mjs

tools/tw/snap.mjs — Tailwind migration verifier (epic #321).
Snapshots computed styles of every element under a selector, across 3 viewports
(1280 desktop / 560 tablet / 390 mobile), from the built static export in `out/`.
Serves `out/` over a local http server + drives headless Chromium (headless_shell)
via playwright-core. Writes a JSON snapshot to compare with tools/tw/diff.mjs.

Usage:
  node tools/tw/snap.mjs <page.html> "<cssSelector>" <out.json>
Example:
  node tools/tw/snap.mjs faq.html ".faq" /tmp/before.json
  node tools/tw/snap.mjs guide/ubud.html ".guide-more" /tmp/after.json

Client-rendered UI (itinerary/cart/modal) won't be in static HTML — for those,
write a small custom script that seeds localStorage / clicks to open, then reuses
the same PROPS/serve logic. See tools/tw/README.md.

Requires: playwright-core (devDependency) + headless_shell under /opt/pw-browsers.

## apps/cue/tools/tw/snapx.mjs

tools/tw/snapx.mjs — like snap.mjs but ALSO captures ::before/::after pseudo-element
computed styles for every matched element. Needed to verify pseudo-driven UI
(section-title underline `::after`, section dividers `::before`) that snap.mjs misses.
Usage: node tools/tw/snapx.mjs <page.html> "<selector>" <out.json>

## apps/villas/tools/app-import.js

Shared by the gates: imports one of the app's own ESM files (lib/routes.js, lib/villas.js) so a gate reads the real list instead of a regex copy.

## tools/sync-ui.mjs

Push the monorepo's villa app + library into the STANDALONE villa repo, which
is what actually deploys the site today.

WHY THIS EXISTS. The villa site is served from wayanadityaekc/ubud-private-villas
and its CI runs `npm ci`. npm cannot resolve a pnpm workspace package that
lives in a different repository, so the library is vendored there and
referenced as `file:packages/ui`. That is a COPY, and a copy drifts - so
copying is mechanical and one-way, never by hand, and never in reverse.

This goes away when Hostinger is pointed at the monorepo. That is a change in
the hosting panel, not in code.

  node tools/sync-ui.mjs [path-to-villa-repo]

TWO THINGS DIFFER BETWEEN THE REPOS, and both fail SILENTLY if missed:
  1. package.json      workspace:*  ->  file:packages/ui
  2. globals.css       the @source path is one level shorter
A wrong @source does not error: every class used inside a library component
is purged and the component renders unstyled.
