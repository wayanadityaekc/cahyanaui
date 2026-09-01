# [MIG-22] Account + session

**Agent:** Engine · **Depends on:** MIG-10

## Objective
Port the passwordless account system unchanged. Server logic is already correct and must not be touched.

## Scope
1. `AccountProvider` — token in `localStorage` key `cue_token`, `Authorization: Bearer`, `GET /api/account/session` on load, `hasUpcoming` from `GET /api/bookings/mine`.
2. Magic-link capture (`captureMagicToken`) — `?token=` on **`my-trips.html`**. That URL is hardcoded in the sign-in and booking emails the live API sends; it must not move.
3. `showCreateAccount`, `showSignIn` → `POST /api/account`, `POST /api/account/login`.
4. `settings.html` — profile view/edit via `PATCH /api/account`, plus `GET /api/accounts/count` for the trust stat.
5. Account dropdown panel, including the flag-based currency picker.
6. Auto-login after booking: `/api/inquiry` returns a token, stored when not already logged in.

## Out of scope
- **Any change to the auth model.** No cookies, no NextAuth, no refresh tokens. Static export has no server to hold a session, and the brief says migrate as-is.
- Changing identity matching (email OR phone, never duplicates) — that is server-side and already correct.

## Input
- `script.js` `acctFetchSession`, `acctRefreshUpcoming`, `acctCreate`, `acctRequestLogin`, `acctLogout`, `renderAccount`, `initAccount`, `initAccountMenu`, `initSettings`, `initTrustStat`, `captureMagicToken`.
- `cahyana-api` `origin/main:server.js` — account section.

## Acceptance criteria
1. A live magic link from a real sign-in email lands on `my-trips.html` and logs the user in.
2. A session created on the current site is still valid in the new build (same key, same token).
3. `my-trips.html` and `settings.html` carry `noindex`.
4. Logged-out state shows the guest UI with no console errors.
5. No account data or token is ever rendered into the statically built HTML.

## Definition of done
- PR merged; magic link verified end-to-end with a real email, not a mock.
