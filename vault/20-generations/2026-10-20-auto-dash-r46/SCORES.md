# auto-dash-r46 — SCORES

Pre-fix freeze hash (GENERATE completion): `76654727829db406ce2038a51fa61e3d6173e0a9`
Post-fix freeze hash: `9739e1c9f33fbea54d69f417848118c1501ee9d9`

| gate | a (Threadline) | b (Relay) | c (Tidemark) |
|---|---|---|---|
| route | pass | pass | pass |
| types | pass (에러 0) | pass (에러 0) | pass (에러 0) |
| static | pass (위반 0) | pass (위반 0) | pass (위반 0) |
| lint | pass (위반 0, no fix needed) | pass (위반 0, no fix needed) | **1-fix** → pass |
| weights | pass (3종, 렌더 실측) | pass (3종, 렌더 실측) | pass (3종, 렌더 실측) |
| sweep | **1-fix** → pass | **1-fix** → pass | pass (오버플로 0, no fix needed) |
| focus | pass (누락 0건) | pass (누락 0건) | pass (누락 0건) |
| console | **1-fix** → pass (hydration mismatch) | pass (결함 0, no fix needed) | pass (결함 0, no fix needed) |
| a11y | unavailable (기록전용 pass) | unavailable | unavailable |
| perf | unavailable | unavailable | unavailable |

## 1-fix 상세 (오케스트레이터가 직접 수정 — 전부 기계적·소규모 패턴)

- **a (Threadline)**: 2개 독립 결함, 1회 수정 사이클로 함께 해소.
  1. **console (hydration mismatch)**: `bump-chart.tsx`의 데코레이티브(`aria-hidden="true"`) SVG 안에 리터럴 `<title>` 엘리먼트가 있었다. **React 19/Next.js 16은 `<title>` 태그를 문서 메타데이터로 특수 취급해 어디에 중첩돼 있든(SVG 내부 포함) 호이스팅을 시도**하고, 그 결과 서버 렌더와 클라이언트 하이드레이션의 DOM 위치가 달라져 하이드레이션 실패로 이어졌다. SVG가 이미 `aria-hidden`이라 그 `<title>`은 접근성상 불필요했으므로 — 통째로 제거. 이 라운드에서 새로 관측된 React 19 전용 함정이다(이 저장소 정본에 기존 기록 없음 — LEARN 절 참조).
  2. **sweep (table-overflow)**: `leaderboard-table.tsx`의 11열 매트릭스가 `min-w-[980px]`(px 고정) + `colgroup` px 폭으로 1264/1280px 데스크톱 폭에서 70~86px 넘침. `min-w` px 플로어를 제거하고 `colgroup`을 퍼센트 기반(18%/8%/10%/8%×8)으로 전환 — `table-fixed`가 실제 가용폭에 맞춰 압축되도록(이 저장소 기존 문서화된 처방 그대로, `auto-dash-r44/b` ExceptionsTable 사례와 동일 축).
- **b (Relay)**: **sweep (table-overflow)**: `handoff-table.tsx`가 이미 퍼센트 `colgroup`(22/22/18/18/20%)을 쓰고 있었으나 `<table>`에 남은 `min-w-[640px]` px 플로어가 1264/1280/1350px에서 1~58px 넘침 유발. 플로어 제거만으로 해소(퍼센트 colgroup은 그대로 유지).
- **c (Tidemark)**: **lint**: `topbar.tsx`의 플레인 텍스트 안 리터럴 큰따옴표(`"New alert"`) 2건이 `react/no-unescaped-entities`에 걸림 — `&ldquo;`/`&rdquo;`로 치환.

`blockedBy` 해당 없음 — 웹 타깃은 라우트별 격리.

## Note
`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` 환경변수 오버라이드를 이번 라운드도 그대로 사용(전 라운드와 동일 사유 — 사전설치 Chromium 리비전과 `playwright-core` 기대 리비전 불일치).
