# WO-FINISH report: cahyanaui

19 Oct 2026. Branches pushed, nothing merged. Preflight: `fix/security-gaps` is merged into `main` in every repo that had it (cahyana-api, cahyana-my, cahyana-ubud-experience, ubud-private-villas).

## Job 1: CLAUDE.md names (branch `docs/claude-md-names`)

Every line changed against `main`:

| File | | Line |
|---|---|---|
| `CLAUDE.md` | added | ## Exceptions to global |
| `CLAUDE.md` | added | \| Global rule \| What this repo does \| Reason \| |
| `CLAUDE.md` | added | \|---\|---\|---\| |
| `CLAUDE.md` | added | \| Tests in `tests/` \| `apps/cue` keeps CUE's 25 root `verify-*.mjs` and `tools/` harnesses; the library's own test is in `packages/ui/tests/`; one check in `tools/` \| `apps/cue` is a stale snapshot (see above), not changed. \| |
| `CLAUDE.md` | added | Anything not listed follows `CLAUDE-global.md`. `apps/cue` and `apps/villas` carry the exceptions of their source repos (`cahyana-ubud-experience/CLAUDE.md` section 12, `ubud-private-villas/CLAUDE.md`). |
| `apps/cue/package.json` | removed |     "lint": "next lint", |
| `apps/cue/package.json` | added |     "lint": "eslint .", |
| `apps/villas/package.json` | removed |     "lint": "next lint", |
| `apps/villas/package.json` | added |     "lint": "eslint .", |

## Job 4: branch cleanup

**No branch was deleted.** Pushing an archive tag is refused for this session (`git push origin refs/tags/archive/...` answers HTTP 403; branch pushes work). The rule is "never delete a branch whose tag failed to push", so every branch stays. The list below is what would be archived and deleted once tags can be pushed.

| Branch | Last commit | Archive tag | Deleted | Reason |
|---|---|---|---|---|
| `claude/cue-login-account-navbar-x524x8` | e5156ded (2026-09-28) | `archive/claude-cue-login-account-navbar-x524x8` (not pushed) | no | Archive tag push refused (HTTP 403), so the branch was kept |
| `claude/dreamy-knuth-6paxam` | 9bbec8dd (2026-10-02) | `archive/claude-dreamy-knuth-6paxam` (not pushed) | no | Archive tag push refused (HTTP 403), so the branch was kept |
| `claude/focused-shannon-l826rd` | a2149261 (2026-10-06) | `archive/claude-focused-shannon-l826rd` (not pushed) | no | Archive tag push refused (HTTP 403), so the branch was kept |
| `claude/pull-main-cue-yn2wxe` | 27da8174 (2026-09-29) | `archive/claude-pull-main-cue-yn2wxe` (not pushed) | no | Archive tag push refused (HTTP 403), so the branch was kept |
| `claude/villa-hero-b` | 410ae04c (2026-10-08) | `archive/claude-villa-hero-b` (not pushed) | no | Archive tag push refused (HTTP 403), so the branch was kept |
| `claude/wonderful-mendel-wdjfkn` | df2c3dad (2026-10-18) | `archive/claude-wonderful-mendel-wdjfkn` (not pushed) | no | Archive tag push refused (HTTP 403), so the branch was kept |
| `claude/work-tree-validation-vqexsf` | d28368fe (2026-10-01) | `archive/claude-work-tree-validation-vqexsf` (not pushed) | no | Archive tag push refused (HTTP 403), so the branch was kept |
| `docs/claude-md-names` | 54958af6 (2026-10-19) | none | no | Kept: protected name |
| `docs/claude-md-swap` | d4d6248c (2026-10-09) | `archive/docs-claude-md-swap` (not pushed) | no | Archive tag push refused (HTTP 403), so the branch was kept |
| `docs/global-rules-update` | 83c21452 (2026-10-19) | `archive/docs-global-rules-update` (not pushed) | no | Archive tag push refused (HTTP 403), so the branch was kept |
| `main` | 770733f8 (2026-10-19) | none | no | Kept: protected name |
| `refactor/global-rules` | 1806ff09 (2026-10-19) | `archive/refactor-global-rules` (not pushed) | no | Archive tag push refused (HTTP 403), so the branch was kept |
| `refactor/naming-convention` | 014d411f (2026-10-19) | `archive/refactor-naming-convention` (not pushed) | no | Archive tag push refused (HTTP 403), so the branch was kept |

## Tests, before and after

| Branch | Before | After |
|---|---|---|
| `docs/claude-md-names` | Quality green on `main` | lint, Prettier, comments pass locally; Quality (with build) green in CI. Only docs and the two apps' `lint` script changed |

## Recommended merge order

1. `cahyana-api` `refactor/api-block-functions` (test helpers and one admin filter; no behaviour change; API tests green).
2. `docs/claude-md-names` in all six repos, any order (docs, plus the `lint` script in CUE, the villa site and the two cahyanaui apps; no build output changes).
3. `cahyana-api` `docs/api-tests-manual` is now covered by `docs/claude-md-names` (same decision, written into section 7 and the exceptions table): merge one of them, not both, or they will conflict in section 7.
4. Nothing from Job 3 (no rebased coin branch was pushed).
