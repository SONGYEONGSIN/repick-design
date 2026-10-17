# auto-landing-r33 — SCORES

Frozen source hash (post-fix, all 3 candidates): `8e8644a81ad31a595e052a381bb67b5fb0a92488`
(`cat app/src/app/landing-evolve/r33/*/*.tsx app/src/app/landing-evolve/r33/*/*.ts | shasum`)

Dev server: localhost:3100. Chromium: `/opt/pw-browsers/chromium` via `PW_CHROMIUM_PATH`/`CHROME_PATH` (sandbox has no network access to download Playwright's own browser build; pre-installed Chromium substituted, `PW_NO_SANDBOX=1`).

## Candidate a — "Priority Orbit System" (dark / orange / grotesk)

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | 포커스 표시 0건 누락 |
| console | ✅ | 메시지 86건 · 결함 0 |
| a11y | ✅ | 100 · 실패 감사 bf-cache |
| perf | ✅ | 68 |

1-fix: not needed. Clean first pass.

## Candidate b — "Ledger Calendar" price-history heatmap (light / green / wide)

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | 포커스 표시 0건 누락 |
| console | ✅ | 메시지 100건 · 결함 0 |
| a11y | ✅ | 100 · 실패 감사 bf-cache |
| perf | ✅ | 54 |

1-fix: not needed. Clean first pass.

## Candidate c — "Pulse" verification confidence waveform (dark / sky / mono)

| gate | pass (1차) | pass (재게이트) | detail |
|---|---|---|---|
| route | ✅ | ✅ | 1개 라우트 응답 OK |
| types | ✅ | ✅ | 에러 0 |
| static | ✅ | ✅ | 위반 0 |
| lint | ✅ | ✅ | 위반 0 |
| weights | ✅ | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | ✅ | 포커스 표시 0건 누락 |
| console | ✅ | ✅ | 메시지 97→114건 · 결함 0 |
| a11y | ❌ 96 | ✅ 100 | 1차: `color-contrast` 실패(해당 노드: 히어로 CTA 버튼, 흰 글자 on `#2FB6FF` 채움 = 2.26:1, AA 4.5 미달) → 1-fix로 그 CTA/클로징 CTA 버튼 채움 전용 신규 토큰 `ACCENT_BUTTON_FILL=#1478AE`(흰 글자 대비 4.85:1) 도입, `ACCENT`(#2FB6FF) 자체는 변경 없음(웨이브폼 스트로크·토글 보더 등 비텍스트 용도는 그대로) → 재게이트 100 |
| perf | ✅ 54 | ✅ 53 | |

1-fix: used (a11y color-contrast, resolved, see above). §3-1 정제 조치는 아래 DECISION.md 참조.

## 집계

3후보 전원 하드게이트 전 항목 통과(c는 1-fix 1회 사용). judge 패널(§4)로 진행.
