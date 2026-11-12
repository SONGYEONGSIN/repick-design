# auto-native-r48 — SCORES

source hash (frozen before gate, `cat native/src/evolve/r48/*/*.tsx native/src/evolve/r48/*/*.ts | shasum`): `375711c46377cfa7590cc1fa8d18f7601170943c` (taken after designer handoff, before any gate run — the 1-fix below changed the tree; see note)

## Candidates
- **a** — Storefront Profile Editor (`StorefrontProfileScreen.tsx`) — settings-form macro layout, dirty-state-snapshot-diff derived save band
- **b** — Shipment Live Tracking (`ShipmentTrackingScreen.tsx`) — read-only milestone timeline, working "Contact carrier" always-visible action
- **c** — Bulk Price Drop (`BulkPriceDropScreen.tsx`) — 2-col multi-select grid, selection-count-derived contextual bar + 3rd-state applied-row with inline revert-confirm

## Hard gate — 1st pass (`node scripts/gate.mjs --target native --screens evolve-r48-a evolve-r48-b evolve-r48-c`)

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r48-a | ✅ | ✅ | ✅ | ✅ |
| evolve-r48-b | ✅ | ✅ | ❌ | 미실행 (blockedBy: render 실패) |
| evolve-r48-c | ✅ | ✅ | ✅ | ✅ |

**b 1차 실패 상세**: render 검사 실패 — 등록 check 문자열 `"Shipment tracking"`이 `document.body.innerText`에 없음. 직접 Playwright capture로 원인 확인: `headerEyebrow` 스타일의 `textTransform: "uppercase"`가 렌더 시 실제 텍스트를 `"SHIPMENT TRACKING"`으로 바꿔 리터럴 매치가 깨짐(소스 코드의 글자 자체는 정확했다 — CSS 렌더 변환이 깬 것). iframe은 render 실패로 인한 연쇄 미실행(`blockedBy`), b 자신의 결함 1건으로 집계.

## 1-fix
b designer에게 violations 전달 — "headerEyebrow의 textTransform: uppercase 제거, 그 외 변경 금지" 1건만 지시. 다른 스타일(fontSize/fontWeight/letterSpacing/color)은 그대로 유지, 다른 파일 변경 없음.

## 하드게이트 — 재게이트 (수정 후)

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r48-a | ✅ | ✅ | ✅ | ✅ |
| evolve-r48-b | ✅ | ✅ | ✅ | ✅ |
| evolve-r48-c | ✅ | ✅ | ✅ | ✅ |

**12/12 클린 — 생존 후보 3개(a, b, c) 전원 판정 패널 진입.**

재게이트 후 소스 해시 (판정이 보는 실제 상태): 아래 참조.
`2f3cbd13fcb42a556b03cba705c4f26cd3819449`
