# auto-landing-r1 — HARD GATE SCORES

| 후보 | static | sweep | lighthouse a11y | lighthouse perf | 판정 |
|---|---|---|---|---|---|
| a (SCANLINE — 라이브 매칭 콘솔) | pass (0 위반) | pass | 95 (하드게이트 통과, ≥95) | 84 (기록만) | 생존 |
| b (궤도 — 세로 스크롤 여정 타임라인) | pass (0 위반) | pass | 96 (하드게이트 통과, ≥95) | 97 (기록만) | 생존 |

## 세부

### static (`node scripts/dash-static-check.mjs`)
- 대상: a/page.tsx, a/components/{ConsoleLandingClient,LiveConsole,ProductShowcase}.tsx, b/page.tsx, b/components/{JourneyClient,ProductMatchCard,ProgressRail}.tsx (glob 미지원 셸이라 전 파일 개별 나열)
- 결과: `[]` (위반 0건, 1회 수정 불요)

### sweep (`node scripts/dash-sweep.mjs --base http://localhost:3100 --routes /landing-evolve/r1/a /landing-evolve/r1/b`)
- 결과: `{"pass": true, "failures": []}` (1회 수정 불요)

### Lighthouse (desktop preset, performance+accessibility)
- a: `perf 84 / a11y 95` — a11y 하드게이트 정확히 통과선. accessibility audit 상세: `color-contrast` 항목 위반 1건(배경/전경 대비 부족) 확인됨 — 카테고리 점수는 95로 하드게이트는 통과하나 개선 여지로 기록.
- b: `perf 97 / a11y 96` — 무결점 통과, color-contrast 등 실패 audit 없음.
- 두 후보 모두 dev 서버(비프로덕션 빌드) 측정치이므로 perf는 판정에 쓰지 않고 기록만 함 (플레이북 §3 규칙).

## 결론
두 후보 모두 하드게이트 생존 → JUDGE 단계(3렌즈 블라인드 비교)로 진행.
