#!/usr/bin/env bash
set -euo pipefail

REPO="wayanadityaekc/CUE"
DIR="$(cd "$(dirname "$0")" && pwd)"
DRY="${DRY_RUN:-0}"

order=(MIG-01a MIG-00 MIG-01 MIG-02 MIG-10 MIG-11 MIG-12 MIG-20 MIG-21 MIG-22 MIG-23 MIG-30 MIG-31 MIG-32 MIG-33 MIG-40 MIG-90 MIG-91 MIG-92 MIG-93)

have_gh=0
command -v gh >/dev/null 2>&1 && have_gh=1
if [ "$have_gh" -eq 0 ] && [ -z "${GITHUB_TOKEN:-}" ] && [ "$DRY" != "1" ]; then
  echo "Need either the gh CLI, or GITHUB_TOKEN set to a token with 'repo' scope." >&2
  echo "Run with DRY_RUN=1 to preview titles without creating anything." >&2
  exit 1
fi

for key in "${order[@]}"; do
  file=$(ls "$DIR/${key}-"*.md 2>/dev/null | head -1)
  [ -n "$file" ] || { echo "skip: no file for $key" >&2; continue; }
  title=$(head -1 "$file" | sed 's/^# *//')
  body=$(tail -n +2 "$file")

  if [ "$DRY" = "1" ]; then
    printf '%s\n' "[dry-run] $title"
    continue
  fi

  if [ "$have_gh" -eq 1 ]; then
    gh issue create --repo "$REPO" --title "$title" --body "$body"
  else
    payload=$(python3 - "$title" "$file" <<'PY'
import json,sys
title=sys.argv[1]
body=open(sys.argv[2]).read().split("\n",1)[1]
print(json.dumps({"title":title,"body":body}))
PY
)
    curl -sS -X POST \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/$REPO/issues" \
      -d "$payload" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("html_url") or d)'
  fi
  sleep 1
done
