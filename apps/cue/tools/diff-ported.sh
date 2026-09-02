#!/usr/bin/env bash
# Every page that has been ported. itinerary/my-trips/settings are excluded
# until MIG-21 and MIG-22 land; south-bali-tour is a redirect stub, not a page.
set -euo pipefail
cd "$(dirname "$0")/.."
PAGES=$(
  { ls *.html; ls attractions/*.html; ls guide/*.html; } |
  grep -v -E '^(south-bali-tour|itinerary|my-trips|settings)\.html$' |
  grep -v '^guide/_template.html$'
)
exec node tools/diff-classes.js $PAGES
