#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
exec node tools/diff-classes.js $(node tools/ported-pages.js)
