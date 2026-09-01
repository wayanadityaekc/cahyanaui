# Phase 2 work packages — Next.js migration

20 issues, ready to create. Spec: [`../MIGRATION_PHASE1_ARCHITECTURE.md`](../MIGRATION_PHASE1_ARCHITECTURE.md).

Each file is one issue: first line is the title, the rest is the body. Every issue carries Objective, Scope, Out of Scope, Input, Dependencies, Acceptance Criteria and Definition of Done.

## Creating them

```bash
# preview only
DRY_RUN=1 docs/issues/create-issues.sh

# with the gh CLI installed and authenticated
docs/issues/create-issues.sh

# or with a personal access token (repo scope), no gh needed
GITHUB_TOKEN=ghp_xxx docs/issues/create-issues.sh
```

`gh` is not installed on this machine and `brew` is not available, so the token route is the shorter path.

## Order and parallelism

```
                    ┌─ MIG-01a  routing spike ──┐   DONE - PASSED
GATE 0              ├─ MIG-00   pricing API ────┤   (01a and 00 run in parallel)
                    ├─ MIG-01   skeleton+deploy ┤   (01 needs 01a to pass)
                    └─ MIG-02   tailwind config ┘
                                   │
        ┌──────────────┬───────────┼───────────┬──────────────┐
        │              │           │           │              │
   MIG-10 layout   MIG-11 UI    MIG-12     MIG-22 account  MIG-23 reviews
        │              kit        cards         │              │
        └──────────────┴───────────┴────────────┴──────────────┘
                                   │
                    ┌──────────────┼──────────────┐
              MIG-20 booking  MIG-21 cart    MIG-33 bespoke
                    └──────────────┴──────────────┘
                                   │
              MIG-30 tours · MIG-31 attractions · MIG-32 guides
                        (the repetitive Sonnet work, fully parallel)
                                   │
                            MIG-40 SEO
                                   │
              MIG-90 URL · MIG-91 links · MIG-92 visual · MIG-93 money
                                   │
                               CUTOVER
```

**Real dependencies only.** MIG-00 (backend) and MIG-01a (routing spike) run at the same time. MIG-02 needs neither. The three content-extraction issues are fully parallel with each other and are the bulk of the work.

**MIG-93 does not wait for the end.** Anything touching money is QA'd on merge, per the QA cadence — a broken layout can wait a day, a wrong price cannot.

## Before the first issue is picked up

1. `git pull` in the `cahyana-api` repo — the local checkout is 33 commits behind `origin/main` and the `server.js` on disk is not what is deployed.
2. Confirm the deploy pipeline choice in MIG-01 (option **a**, GitHub Action, is what is written up).
3. Decide the content file format: MDX for guides, JS objects for tours and attractions is the recommendation. Does not block Gate 0.

## Not in these issues

- **The contact-form bug is live right now and is losing guest messages.** It is folded into MIG-33, but it should be fixed on the current site immediately rather than waiting for the migration — see `../MIGRATION_PHASE1_ARCHITECTURE.md` §16.
- Xendit / payments — separate project once registration is approved. MIG-20 leaves the hook point.
- Image compression, the photo backlog, extensionless URLs, the Resend newsletter.
