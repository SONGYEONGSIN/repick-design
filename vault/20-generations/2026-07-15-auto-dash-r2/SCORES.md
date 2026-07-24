# auto-dash-r2 — HARD GATE 결과

라운드: `auto-dash-r2`. 3후보 생성(a/b/c) — 3개 전원 하드게이트 최종 생존(직전 라운드는 2/3 생존).

## 정적 검사 (`dash-static-check.mjs`)
전체 37개 .tsx 파일 대상, 위반 0건 — **전원 pass**.

## sweep (`dash-sweep.mjs`, 1264~1920 desktop + 390 mobile, 스크롤바 -16px 여유폭 포함)

| 후보 | 1차 결과 | 결함 | 수정 | 재검사 |
|---|---|---|---|---|
| a (Cadence) | **실패** | 전 desktop 폭 고정 19px + mobile 27px page-overflow | `Sparkline`(ui.tsx) SVG가 `width`/`height` prop을 실제 렌더 크기에 미적용(viewBox만 설정) → 브라우저 기본 대체 크기(~266×95px)로 렌더되어 QueueRail 채널 행이 컨테이너보다 넓어짐. `style={{width,height}}` 추가로 수정. | **pass** |
| b (Pulse) | pass | — | — | pass |
| c (Relay) | **실패** | mobile 390 49px overflow + desktop 1264~1440 테이블/오버플로 div 6~19px overflow | HistoryTable 상태 배지 컬럼(8%)이 "발송 완료" 배지(79px) 대비 좁음 → 12%로 확장(캠페인/세그먼트 컬럼에서 흡수). Topbar 검색 버튼에 `min-w-0` 누락 + ⌘K 힌트 모바일 미숨김으로 헤더 총 폭 초과 → `min-w-0` 추가 + `sm:` 이상에서만 힌트 노출. | **pass** |

**1회 수정 기회 규칙 적용 — a·c 모두 1회 수정 후 재검사 통과, 탈락 없음.**

## Lighthouse (`--only-categories=performance,accessibility --preset=desktop`, dev 서버 측정)

| 후보 | 1차 a11y | 1차 perf | 결함 | 수정 | 최종 a11y | 최종 perf |
|---|---|---|---|---|---|---|
| a (Cadence) | 95 | 96 | 하드게이트(≥95) **통과** — 수정 불필요 | — | 95 | 94 |
| b (Pulse) | 90 | 96 | **탈락 기준 미달** — button-name(아바타 메뉴 버튼 접근 가능한 이름 없음) + color-contrast(`text-zinc-500` on 다크 표면, 다수 캡션/보조텍스트, 3.48~4.12:1 — 4.5:1 미달) | 버튼에 `aria-label` 추가, `text-zinc-500`→`text-zinc-400` 전면 교체 | **100** | 95 |
| c (Relay) | 92 | 96 | **탈락 기준 미달** — button-name(계정 메뉴 버튼) + color-contrast(`text-zinc-400` on 라이트 표면, 2.51~2.62:1 — 4.5:1 미달) | 버튼에 `aria-label` 추가, `text-zinc-400`→`text-zinc-500` 전면 교체(사이드바/탑바/테이블/커맨드팔레트/ui 공용 input) | **100** | 96 |

**a11y는 하드게이트 — 1회 수정 기회 내 3후보 전원 ≥95 도달. perf는 기록만(탈락 사유 미적용, dev 서버 측정치 참고용).**

## 종합
| 후보 | static | sweep | a11y(하드) | perf(기록) | 생존 |
|---|---|---|---|---|---|
| a — Cadence (캘린더 중심) | pass | pass(1회 수정) | 95 | 94 | ✅ |
| b — Pulse (히어로+벤토) | pass | pass | 100 | 95 | ✅ |
| c — Relay (편집↔미리보기 워크벤치) | pass | pass(1회 수정) | 100 | 96 | ✅ |

3/3 생존 — JUDGE 패널로 진행.
