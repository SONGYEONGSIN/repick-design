# auto-dash-r38 — DECISION

**타깃**: dash · **라운드**: r38 · **날짜**: 2026-10-08 · **결과**: **a("Portcall") 승자, 단독 심사**

편차 고지: 없음(`Agent` 도구 가용 확인됨, §0-0 통과). 세 후보 모두 블라인드·독립 생성.

## 타깃 선택
미채움 큐 0종(native 라운드 1에서도 동일 확인, 변동 없음) → dash/landing/native 균등 난수(독립 재추첨, 이 레포의 기존 관행) → **dash**.

## 재배정 처리
`reassign-queue.md` #10(`auto-dash-r37/b` "Baseline" 박스플롯 벤더 스코어카드, 2연속 하드게이트 탈락)을 후보 a에 세 가지 구체 지시와 함께 배정. 나머지 2후보는 카탈로그 미시도 차트타입 자유탐색 — b: Decomposition Tree(최초 시도), c: Geographic Choropleth(최초 시도, 기존 방사형 허브-스포크 지도와 구별).

## 후보 요약
| v | 컨셉 | 차트타입 | 매크로셸 |
|---|---|---|---|
| a — Portcall | 벤더 API 성능 스코어카드 (재배정) | Box Plot | 전폭 히어로, 사이드레일 없음 |
| b — Ledgerline | RevOps/FinOps 분산 원인 분석 | Decomposition Tree (카탈로그 최초) | 마스터-디테일(플랫 KPI 레일+트리 상세) |
| c — Isobar | 멀티리전 엣지/CDN 인프라 콘솔 | Geographic Choropleth (카탈로그 최초) | 피드중심(7/12 스파인+5/12 지도 패널) |

## 하드게이트
- **1차**: 세 후보 전원 독립적으로 동일한 `react-hooks/set-state-in-effect`(command-palette의 `open` 변화에 반응해 effect 안에서 `setQuery("")` 동기 호출)에 걸렸다 — 격리된 세 에이전트의 진짜 우연한 수렴(이 레포에서 반복 관측된 패턴, `auto-dash-r33`·`r34` 등과 동형). 추가로 a는 sweep(박스플롯 스트립 데스크톱 폭 1264~1366px에서 오버플로), b는 a11y `label-content-name-mismatch`(분해트리 노드), c는 추가 lint(미사용 변수) + sweep `cell-overlap` + a11y 92점(button-name·color-contrast·target-size).
- **1-fix**: a는 두 결함 모두 완전 해소 — **재게이트 10/10 클린**. b는 lint 해소했으나 a11y 동일 감사 **재실패**(재귀 컴포넌트 전체에 적용되는 수정을 가했음에도 재현, 원인 미규명). c는 lint·unused-var·button-name·target-size는 해소했으나 color-contrast 미해소 + 신규 label-content-name-mismatch 발생(수정 중 추가한 `aria-label`이 원인으로 추정).
- 스킬 §3 "재실패 시 탈락" 그대로 적용 — **b·c 탈락**, `reassign-queue.md` #11·#12로 신규 등재(같은 라운드에 2건 동시 등재, 다음 라운드는 그중 1개만 배정).

## 단독 심사 (생존 후보 1개 — §4 "1개면 단독 심사로 승자/no-winner만 판정")
독립 리뷰어가 코드(전 파일 읽음)와 스크린샷(1280/1920/390, 스크롤 0/35/70%)을 직접 대조해 검증. 결론: **WINNER**.

핵심 검증 결과:
- 박스플롯 at-a-glance 가독성 확인됨(중앙값·이상치 칩 상시 텍스트, hover 불필요) — 스크린샷 직접 확인.
- 벤더 테이블이 five-number-summary(min/Q1/median/Q3/max)를 실제 정렬 가능 컬럼으로 담음 — `vendor-table.tsx:13-24` 직접 확인(장식 아님).
- 클릭→핀(카드 1개만 터치)/호버→비영속 툴팁 분리가 코드대로 정확히 구현됨 — `box-plot-panel.tsx`·`kpi-section.tsx` 직접 대조.
- 재배정문의 세 지시(모든 조상 `min-w-0`·`table-fixed`+`colgroup`% 100 합·콘텐츠기반 명칭) 전부 코드에서 검증됨(설명만이 아니라 실제 소스로 확인).
- 비치명적 결함 1건 기록: `Export report`/알림벨/일부 nav 항목이 시각적으로는 완결됐으나 `onClick` 없음(기능적으로 비어 있는 크롬) — 승격을 막을 정도는 아니나 다음 라운드 학습 노트로 남김.

## LEARN — delta
승자 있음 → §5 delta 1건 추출(초안이 쉘 백틱 이스케이프로 손상돼 `supersedes`로 즉시 정정 — `dash-deltas-provisional.jsonl` 최신 entry 참조): 데스크톱 전용 가로스크롤 스트립(테이블이 아니어도)은 sweep 게이트가 테이블과 동일하게 잡는다는 것, 그리고 그 해법은 조상 `min-w-0`가 아니라 **아이템 폭 자체를 가장 좁은 데스크톱 폭(1264px)에 맞춰 줄이는 것**이라는 점 — 이번이 이 재배정 계보(r36→r37→r38)의 세 번째이자 마지막 교정이었다.

## 질문 큐
신규 등재 없음(날카로운 원칙 충돌 없음 — b·c의 재실패 원인 미규명은 reassign-queue 항목에 다음 배정 시 직접 렌더 실측으로 특정하라는 지시로 처리, 별도 질문 큐 대상 아님).

## 정제 게이트
클러스터링 대상 신규 delta 1건 — L1 그대로(재현 1회, 승격 보류).

## 원장
`auto-ledger.jsonl` entry: `target:dash round:auto-dash-r38 winner:a no_winner:false`.

## vault/index.md
이번 run 등재 예정.
