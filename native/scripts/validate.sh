#!/usr/bin/env bash
# native/scripts/validate.sh — S1 4-게이트. 사용: bash native/scripts/validate.sh "<렌더 검사 문자열>"
set -euo pipefail
CHECK="${1:?사용: validate.sh <렌더 검사 문자열>}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NATIVE="$ROOT/native"
PORT=8091

cleanup() { lsof -ti :$PORT 2>/dev/null | xargs -r kill 2>/dev/null || true; }
trap cleanup EXIT

echo "[1/4] tsc"
( cd "$NATIVE" && npx tsc --noEmit )

echo "[2/4] expo export (web)"
( cd "$NATIVE" && npx expo export --platform web --output-dir dist >/dev/null 2>&1 )

echo "[3/4] serve + render"
cleanup
( cd "$NATIVE" && npx serve dist -l $PORT >/dev/null 2>&1 & )
for i in $(seq 1 30); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT/ 2>/dev/null)" = "200" ] && break
  sleep 1
done
[ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT/)" = "200" ] || { echo "serve 200 실패"; exit 1; }
node -e "
const { createRequire } = require('node:module');
const req = createRequire('$ROOT/');
const { chromium } = req('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:$PORT/', { waitUntil: 'load' }); await p.waitForTimeout(1500);
  const t = await p.evaluate(() => document.body.innerText); await b.close();
  if (!t.includes('$CHECK')) { console.error('렌더 검사 실패: \"$CHECK\" 없음'); process.exit(1); }
  console.log('render OK');
})();
"

echo "[4/4] iframe"
node "$NATIVE/scripts/iframe-check.mjs" "http://localhost:$PORT/" "$CHECK"

echo "✅ validate 4/4 통과"
