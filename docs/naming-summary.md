# Naming work order, combined summary

WO-NAMING, 19 Oct 2026. Branch `refactor/naming-convention` in all six repos, pushed, not merged. Per-repo detail, skipped items and the full rename table are in each repo at `docs/naming-report.md`.

## Counts per rule

| Rule | cahyanaui | cahyana-my | ubud-private-villas | cahyana-dashboard | cahyana-api | cahyana-ubud-experience |
|---|---|---|---|---|---|---|
| 1. Short names | 1726 | 437 | 314 | 863 | 1643 | 1977 |
| 2. Booleans | 306 | 174 | 132 | 96 | 42 | 219 |
| 3. Functions verb + noun | 423 | 223 | 226 | 221 | 285 | 460 |
| 4. Event handlers | 66 | 22 | 26 | 34 | 0 | 35 |
| 5. Lists plural | 93 | 35 | 46 | 27 | 77 | 126 |
| 6. Magic numbers | 409 | 154 | 276 | 312 | 526 | 247 |
| 7. Named conditions / early returns | 77 named, 27 early returns | 38 named, 9 early returns | 35 named, 5 early returns | 16 named, 6 early returns | 39 named, 3 early returns | 64 named, 30 early returns |
| 8. Nested ternaries | 40 | 14 | 19 | 16 | 12 | 33 |
| 9. Loops | 4 | 0 | 3 | 2 | 4 | 0 |
| Rename-table rows | 3025 | 1056 | 1005 | 1461 | 2378 | 3084 |
| Skipped entries | 38 | 18 | 11 | 14 | 20 | 15 |

Rule 7 counts named conditions, then if-blocks turned into early returns. Rule 4 is 0 in cahyana-api (no JSX). Rule 9 counts converted loops; loops that await, break or return in the middle stay.

## Rename table

All 12,009 rows (repo, rule, file, old, new) are in `docs/naming-renames.tsv` for the Cahyana name dictionary. Rule 6 rows map number to constant, rule 7 condition to name, rule 8 nested ternary to helper.

## Tests, before and after

| Repo | Before | After every rule |
|---|---|---|
| cahyanaui | build, both apps' gates, money-parity 58671/58672, no-legacy-css, pill test, smoke 34 + 19 pages 0 errors | same; built HTML and CSS identical |
| cahyana-my | build, 5 harnesses (foundation, checkout-events 11, shared-cart 24, dashboard 29, villa-stay 24) | same; HTML and CSS identical; also passed against the renamed API |
| ubud-private-villas | build, 5 gates, 16 harnesses pass, 3 known failures, smoke 22 pages | same; HTML and CSS identical |
| cahyana-dashboard | build, dash2 68/71 (3 known), coins-dash 64, pill-taps 8 | same; HTML and CSS identical |
| cahyana-api | 43 tests all exit 0 | 43 tests all exit 0, same result lines; the 12 block functions unchanged |
| cahyana-ubud-experience | build, gates and checks, 55 harnesses (15 pass, 40 known failures) | same result for every harness; HTML and CSS identical; check-pay-agree 0 differences |

## Skipped across repos

- Names that leave the code: API fields, columns, routes, storage keys, env names, i18n keys, Next.js convention names, the published `@cahyana/ui` exports, CommonJS `module.exports` names in the API (111), the shared `cahyanaConfig` export.
- The 12 cahyana-api functions inside if/loop/try blocks: listed in its report, untouched.
- Shared lint files (`tools/eslint/*`, `tools/check-global.mjs`) in the five site repos: they are copies of this repo's `main`; renamed here only. Run `node tools/sync-global.mjs` after this branch is merged.

## Needs Wayan

1. Merge order: cahyanaui first, then sync the shared lint files, then the others. cahyana-api before any site.
2. Project files (CLAUDE.md) still name some functions by their old names (for example `apiFetch` in cahyana-my, `countPillTap`, `submitInquiry`): a docs-only follow-up.
3. Make the 111 API export renames, the 28 API loops and the 25 library exports their own work orders, if wanted.
