# auto-dash-r38 — SCORES

Freeze hash (1차, 판정 전): `754469a74a035b371bd8f6bf687e35df6f630775`
(`cat app/src/app/dash-evolve/r38/{a,b,c}/*.ts app/src/app/dash-evolve/r38/{a,b,c}/*.tsx | shasum`)

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf | 1차 결과 | 1-fix 결과 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| a — Portcall (Box Plot 벤더 스코어카드, 재배정) | 통과 | 통과 | 통과 | **실패** | 통과 | **실패**(오버플로4) | 통과 | 통과 | 통과 | 통과 | 실패 | **통과(10/10)** |
| b — Ledgerline (Decomposition Tree) | 통과 | 통과 | 통과 | **실패** | 통과 | 통과 | 통과 | 통과 | **실패**(label-content-name-mismatch) | 통과 | 실패 | **재실패(동일 감사) → 탈락** |
| c — Isobar (Geographic Choropleth) | 통과 | 통과 | 통과 | **실패**(1 error 1 warning) | 통과 | **실패**(cell-overlap) | 통과 | 통과 | **실패**(96, button-name·color-contrast·target-size) | 통과 | 실패 | **재실패(color-contrast + 신규 label-content-name-mismatch) → 탈락** |

## 공통 1차 결함
세 후보 전원 독립적으로 동일한 `react-hooks/set-state-in-effect`(command-palette의 `open` 변화에 반응해 `setQuery("")`를 effect 안에서 동기 호출)에 걸렸다 — 격리된 세 에이전트의 진짜 우연한 수렴(과거 라운드에서도 반복된 패턴, `auto-dash-r33`·`r34` 등).

## 1-fix 결과
- **a**: 두 결함 모두 해소 — lint는 render-phase prevOpen 비교 패턴으로, sweep은 박스플롯 아이템 폭 축소(w-16→w-12, gap-3→gap-2, 14×(48+8)+40=816px, 1264px 뷰포트 가용폭 내)로. **재게이트 10/10 클린.**
- **b**: lint 해소, a11y label-content-name-mismatch 수정 시도("% of parent" → "% of {parentLabel}")했으나 **동일 감사가 재실패**. 재귀 컴포넌트의 모든 노드에 적용되는 공유 JSX를 고쳤음에도 재현 — 원인 미규명(다른 요소일 가능성). 스킬 §3 "재실패 시 탈락" 적용.
- **c**: lint·unused-var 해소, button-name·target-size 수정, label-content-name-mismatch 신규 발생(아마 c단계에서 추가한 `aria-label` 보강 조치 중 하나가 원인), color-contrast는 수정 주장에도 미해소. 재게이트 96점+2개 감사 실패. 스킬 §3 적용 탈락.

## 생존 후보
**a 단독 생존** → §4 "1개면 단독 심사로 승자/no-winner만 판정" 적용. 단독 리뷰 결과: **WINNER**(상세는 DECISION.md).
