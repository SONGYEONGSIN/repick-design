#!/usr/bin/env bash
# native/scripts/validate.sh — 4-게이트. 사용: bash native/scripts/validate.sh "<렌더 검사 문자열>" [screen]
set -euo pipefail
CHECK="${1:?사용: validate.sh <렌더 검사 문자열> [screen]}"
SCREEN="${2:-}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NATIVE="$ROOT/native"
PORT=8091

cleanup() { lsof -ti :$PORT 2>/dev/null | xargs -r kill 2>/dev/null || true; }
trap cleanup EXIT

echo "[1/4] tsc"
( cd "$NATIVE" && npx tsc --noEmit )
echo "GATE_STEP:tsc:ok"

echo "[2/4] expo export (web)"
# --clear 필수: Metro 번들러 캐시는 파일 내용만으로 키를 잡아 EXPO_PUBLIC_SCREEN 변경을
# 반영하지 않는다 → --clear 없으면 화면별 연속 export가 stale 번들을 재사용해 잘못된 화면을 서빙(M1 거짓통과).
( cd "$NATIVE" && EXPO_PUBLIC_SCREEN="$SCREEN" npx expo export --platform web --output-dir dist --clear >/dev/null 2>&1 )
echo "GATE_STEP:export:ok"

echo "[3/4] serve + render"
cleanup
( cd "$NATIVE" && npx serve dist -l $PORT >/dev/null 2>&1 & )
for i in $(seq 1 30); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT/ 2>/dev/null)" = "200" ] && break
  sleep 1
done
[ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT/)" = "200" ] || { echo "serve 200 실패"; exit 1; }
CHECK="$CHECK" ROOT="$ROOT" PORT="$PORT" node -e '
const { createRequire } = require("node:module");
const req = createRequire(process.env.ROOT + "/");
const { chromium } = req("playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto("http://localhost:" + process.env.PORT + "/", { waitUntil: "load" });
  await p.waitForTimeout(1500);
  const t = await p.evaluate(() => document.body.innerText); await b.close();
  if (!t.includes(process.env.CHECK)) { console.error("렌더 검사 실패: " + process.env.CHECK + " 없음"); process.exit(1); }
  console.log("render OK");
})();
'
echo "GATE_STEP:render:ok"

echo "[4/4] iframe"
node "$NATIVE/scripts/iframe-check.mjs" "http://localhost:$PORT/" "$CHECK"
echo "GATE_STEP:iframe:ok"

echo "✅ validate 4/4 통과"
