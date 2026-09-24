# [MIG-91] Release gate: link / button / card click-through diff

**Agent:** QA · **Depends on:** all content issues · **Blocks cutover**

## Objective
Prove every link, button and card click-through goes to the same place and behaves the same way.

## Scope
1. Script over the 117 current HTML files + `script.js`, extracting every navigation target — `href`, `data-href`, `window.location` assignments, `window.open`, card-body click handlers — into `docs/link-manifest.json`.
2. Same extraction against `out/` plus the built JS.
3. Diff.
4. Manually verify the behaviours that a static diff cannot see, per architecture §12: card photo/body navigates but the tour-type toggle and heart do not; Book Now opens a modal rather than navigating; stop links carry `?from=`; zone chips anchor without filtering; hero search "Go" navigates to the chosen category; "Leave a review" goes to `my-trips.html`; WhatsApp links keep their prefilled message.

## Acceptance criteria
1. Manifest diff empty.
2. Every behaviour in the §12 table verified by hand and recorded.
3. No dead `href="#"` introduced where a real target existed.

## Definition of done
- Manifest diff plus the behaviour checklist attached to the issue.
