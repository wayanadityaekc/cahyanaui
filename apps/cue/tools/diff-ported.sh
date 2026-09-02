#!/usr/bin/env bash
# Every page that has been ported. south-bali-tour is a redirect stub, not a page.
set -euo pipefail
cd "$(dirname "$0")/.."
PAGES=$(
  { ls *.html; ls attractions/*.html; ls guide/*.html; } |
  grep -v -E '^south-bali-tour\.html$' |
  grep -v '^guide/_template.html$'
)
exec node tools/diff-classes.js $PAGES
