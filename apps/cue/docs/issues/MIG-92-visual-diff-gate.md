# [MIG-92] Release gate: visual diff, every page

**Agent:** QA · **Depends on:** all styling and content issues · **Blocks cutover**

## Objective
Prove the hard constraint: the site is pixel-identical to today.

## Scope
1. Capture full-page screenshots of all 117 current pages at 390 / 768 / 1440, using the headless Chromium already set up per CLAUDE.md.
2. Capture the same from the new build.
3. Diff each pair; triage every non-empty diff.

## Acceptance criteria
1. Every page diff is clean, or the difference is explicitly accepted and recorded with a reason.
2. Special attention, since these are the known risk areas:
   - image slots (`height: auto` + `aspect-ratio`)
   - the booking sidebar's JS-measured offsets (`--side-offset`, `--title-shift`)
   - section dividers — present off-homepage, off on the homepage, and never doubled
   - the 36px homepage section rhythm
   - the 23 rules affected by the `--dur-fast` fix, which will now animate where they previously did not — expected, and must be confirmed as an improvement rather than a regression
   - anti-CLS placeholder heights: no layout shift on load
3. Colour roles verified: amber only on stars/prices/badges, `cta` green only on primary buttons.

## Definition of done
- Diff report attached, with every accepted difference justified in writing.
