# Refactor report: global rules (cahyanaui)

Work order WO-REFACTOR, branch `refactor/global-rules` (from `docs/global-rules-update`), 19 Oct 2026. Not merged, not on `main`.

## 1. What changed, per rule

| Commit | Rule | Numbers |
|---|---|---|
| `chore: add ESLint, Prettier and the quality workflow` | Tooling (sections 1, 8) | `eslint` 10 and `prettier` 3 as root dev dependencies (nothing else installed). `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.github/workflows/quality.yml` (install, ESLint, Prettier check, CSS comment check, build). Shared files that the sync script copies to every repo: `tools/eslint/cahyana-rules.mjs` (the Cahyana ESLint rules), `tools/eslint/css-comments.mjs`, `tools/check-global.mjs` (fails when a repo's copy differs from the master on `main`). `tools/sync-global.mjs` now copies those four files. `pnpm-lock.yaml` was already out of date with `package.json` (`motion` peer); `pnpm install` refreshed it |
| `refactor: remove all code comments` | Zero comments | 3,228 JS/JSX comments in 485 files, 100 CSS comments in 4 files. The header comments of 38 test and check files went to `tests/README.md`, those of 11 tools to `tools/README.md` |
| `refactor: template literals instead of string concatenation` | Template literals | 30 concatenations in 16 files |
| `refactor: named function declarations instead of assigned functions` | Function declarations | 31 in 14 files |
| `refactor: descriptive names instead of abbreviations` | Naming | 143 names in 74 files: `res` to `response` (fetch result, request handler) or `result`, `err` to `error`, `el` to `element`, `r` from `fetch` to `response`, `d` from `.json()` to `data`, array callback parameters named for the item (`rows.map((r) =>` to `row`) |
| `style: format with Prettier` | Prettier | 407 files formatted. JSON, Markdown, YAML and lock files are left out on purpose (`.prettierignore`): the dashboard rewrites content JSON with its own formatting |
| `docs: ...` | CLAUDE.md line 1 | `@CLAUDE-global.md` is now line 1 |

Already compliant, nothing to change: catch variable (every `catch` uses `e` or no binding), `switch` (none), `.then()` (none).

## 2. Tested, before and after

Run before the first change and after every commit:

| Check | Before | After every commit |
|---|---|---|
| `pnpm build` (both apps) | pass | pass |
| Built HTML of `apps/cue/out` (100 pages) and `apps/villas/out` (19 pages), scripts and asset hashes removed | baseline | identical |
| Built CSS | baseline | same rules, except utilities Tailwind had generated only from words inside comments (27 in villas, 5 in cue). None of them is used by any page or script. After Prettier, the unminified `style.css` copy differs only in quote style and line breaks |
| Browser smoke (Chromium, 34 cue pages, 19 villas pages: load, page errors, text length) | 0 errors | 0 errors, identical results |
| `check-urls`, `check-detail`, `check-assets`, `check-motion`, `check-classes` (both apps) | pass | pass |
| `tools/money-parity-test.mjs` | 58671/58672 (1 failure: currency list) | same, pre-existing |
| `tools/check-no-legacy-css.mjs apps/villas/out` | 53/53 | 53/53 |
| `packages/ui/tests/my-cahyana-pill-test.mjs` | all passed | all passed |
| ESLint | 3,785 problems | 0 errors, 319 warnings (below) |
| Prettier check, CSS comment check | n/a | clean |

Not run: the `verify-*.mjs` browser harnesses in `apps/cue` (they need the API dev servers and are part of the stale snapshot), `tools/check-policy.mjs` (needs a served site). The GitHub workflow itself has not run yet (it runs on the first push of the branch).

## 3. Not done, and why

| Item | Count | Why |
|---|---|---|
| Single-letter names `c`, `d`, `r`, `p`, `q`, `dt` | 302 (276 in `apps/cue`) | A good name needs the meaning; only names the code itself reveals were changed. Lint warning `cahyana/descriptive-names` |
| `for` / `for...in` loops | 17 | Most use `break`/`return`/`continue`: global rule says these get their own work order. Lint warning |
| Booleans without is/has/can/should | about 111 `useState(true/false)` | Renaming touches the setter and every caller; not automated |
| API verb `fetch…` | 4 `get…`/`load…` functions | Exported from the library (`packages/ui`) and imported by sites: protected name |
| Magic numbers, early returns, named conditions, `handle…` handlers | not counted | Need judgment per line; no safe codemod |
| `export default function` components | 0 missing | Nothing to do |
| `tests/` location, test header comments | | Existing tests stay where they are (global rule); run instructions are now in `tests/README.md` |

Protected names (never renamed): every export of `packages/ui` (sites import them), API fields, storage keys (`cue_*`, `upv_*`), URLs, env vars, CSS classes.

Behaviour risks: none found. Converting `const f = () =>` to `function f()` skipped any function that uses `this`, `arguments` or `super`, and any inside an `if`/loop block.

## 4. Gaps between this repo's CLAUDE.md and the global rules

- No "Exceptions to global" section, while the repo has several: tests at `apps/*/verify-*.mjs` and `packages/ui/tests/`, not `tests/`; `apps/cue` is a frozen snapshot.
- `apps/cue` and `apps/villas` keep `"lint": "next lint"`, which Next 16 no longer has. The new lint runs from the root (`pnpm run lint:code`).
- `.github/workflows/publish-ui.yml` still has YAML comments (configuration, not code; left as is).
- `tools/sync-ui.mjs` is described as obsolete and unsafe; it is still in the repo (deleting needs Wayan).
- The global file says the sync script copies the master; that is now `tools/sync-global.mjs` (`pnpm run sync:global`), and it also copies the lint rules.

## 5. Decisions for Wayan

1. Merge `refactor/global-rules` after `docs/global-rules-update`.
2. Make the `Quality` check required on `main` (GitHub settings, branch protection), so "lint and checks must pass before any merge" is enforced.
3. Whether the 302 short names and 17 loops get their own work orders, or are accepted as exceptions in the stale `apps/cue`.
4. Whether to add an "Exceptions to global" section to this CLAUDE.md (tests location, `apps/cue` snapshot).
