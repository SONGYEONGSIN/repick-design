#!/usr/bin/env bash
# Vercel `ignoreCommand` — exit 0 = 빌드 건너뜀, exit 1 = 빌드.
#
# 왜 있나: 이 레포는 매일 밤 자율 라운드가 커밋을 쌓고, 그 대부분이 **배포 결과를 바꾸지 않는
# 볼트 기록**(DECISION·SCORES·스크린샷·원장)이다. 설정이 없던 동안 커밋 SHA 마다 프리뷰 배포가
# 돌았다 — 2026-08-30 하루에 **35건**(차순위 날의 3.5배). `next build` 자체는 13초라 길이가
# 문제가 아니라 **횟수**가 문제였고, 매 빌드가 `.git` 264MB + `vault` 271MB(스크린샷 2,245장)를
# 클론한다.
#
# 규칙: **배포 산출물에 들어가는 경로가 바뀐 커밋만 빌드한다.** `vault/**` 만 바뀌었으면 건너뛴다.
# 판단이 서지 않으면(첫 배포·얕은 클론·이전 SHA 없음) **빌드한다** — 건너뛰어서 낡은 사이트가
# 남는 것보다 한 번 더 짓는 편이 안전하다.
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT" || exit 1

BASE="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$BASE" ]; then
  BASE="$(git rev-parse HEAD^ 2>/dev/null || true)"
fi
if [ -z "$BASE" ] || ! git cat-file -e "$BASE^{commit}" 2>/dev/null; then
  echo "이전 커밋을 특정할 수 없다 — 빌드한다"
  exit 1
fi

# 배포에 영향을 주는 경로. `app/` 은 소스, `package*.json` 은 설치, 스크립트는 이 파일 자신을 포함한다.
if git diff --quiet "$BASE" HEAD -- app/ package.json package-lock.json scripts/vercel-should-build.sh; then
  echo "이번 변경은 vault/문서 뿐이다 — 빌드 건너뜀 ($BASE..HEAD)"
  exit 0
fi

echo "app/ 이 바뀌었다 — 빌드한다 ($BASE..HEAD)"
exit 1
