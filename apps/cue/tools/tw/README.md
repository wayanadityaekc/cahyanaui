# tools/tw — Tailwind migration harness (epic #321)

Shared tooling so every agent verifies conversions the **same** way: zero visual
change, proven by headless computed-style diff. **Never delete CSS before `diff.mjs`
says `IDENTICAL`.**

Requires `playwright-core` (devDependency) + `headless_shell` under `/opt/pw-browsers`
(both present in the standard session env). `snap.mjs` auto-locates `headless_shell`.

## The loop (per issue)

```bash
# 0. start from latest main
git checkout main && git pull origin main
git checkout -b refactor/tw-<family>

# 1. BASELINE — snapshot the affected page(s) BEFORE any change
npm run build
node tools/tw/snap.mjs <page.html> "<selector>" /tmp/before.json
#   repeat snap for every page/section this family renders on

# 2. Convert the COMPONENT(s) to utilities — DO NOT touch style.css yet
#    (edit className strings in components/…, put shared strings in a *Classes.js module)
npm run build
node tools/tw/snap.mjs <page.html> "<selector>" /tmp/after.json
node tools/tw/diff.mjs /tmp/before.json /tmp/after.json      # MUST print IDENTICAL

# 3. Only now remove the dead CSS for YOUR family (pull main first!)
git pull origin main
#   REGEX: use (?![a-z0-9]) as the boundary, NOT \b — \b misses BEM `.faq__container`.
node tools/tw/remove-fam.mjs style.css "\\.(faq|contact)(?![a-z0-9])"   # your family
#   protect a content/shared selector you can't drop yet with a keepRegex (3rd arg):
#   node tools/tw/remove-fam.mjs style.css "\\.faq(?![a-z0-9])" "\\.faq__a"
npm run build
node tools/tw/snap.mjs <page.html> "<selector>" /tmp/after2.json
node tools/tw/diff.mjs /tmp/before.json /tmp/after2.json      # STILL IDENTICAL

# 4. Gates + brace balance, then PR
node -e "const s=require('fs').readFileSync('style.css','utf8');process.exit((s.match(/{/g)||[]).length===(s.match(/}/g)||[]).length?0:1)" && echo "braces OK"
node tools/check-urls.js && node tools/check-detail.js && node tools/check-assets.js
# open PR, link the issue. Before merge: git pull origin main again; on style.css
# conflict -> rebase + re-run remove-fam.mjs (idempotent) + re-verify.
```

## Scripts
- **snap.mjs** `<page> "<selector>" <out.json>` — computed-style snapshot of the
  selector's subtree across 1280/560/390.
- **diff.mjs** `<before.json> <after.json>` — `IDENTICAL` (exit 0) or exact diffs (exit 1).
- **remove-fam.mjs** `<file.css> "<deadRegex>" ["<keepRegex>"]` — drops rules whose
  selectors all reference the dead family; comment/string-safe; keeps grouped-live
  selectors; idempotent.

## Client-rendered UI (itinerary / cart / modal)
Not in static HTML — seed state / open via interaction. Copy `snap.mjs`'s serve+PROPS
block into a small script, `page.evaluate(() => localStorage.setItem(...))` or click the
trigger, then snapshot. Compare with `diff.mjs` the same way.

## Hard rules (all agents)
- diff = `IDENTICAL` @ 3 viewports BEFORE deleting any CSS.
- Never touch: grid engine `.experience__grid*`, `@theme`/`:root` tokens, reset `*{}`,
  another issue's family, price/booking logic, copy/text.
- Money issues (#322/#324/#331): a second agent re-verifies (diff + `node
  tools/pricing-spec-test.js`) before merge.
