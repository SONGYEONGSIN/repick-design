# auto-landing-r31 — SCORES

타깃: landing · 라운드 2/2 (이번 스케줄 실행) · 날짜 2026-10-09

## 후보 요약
| v | 브랜드 | 입력×출력 조합 | 상태 |
|---|---|---|---|
| a | (concept a.md) | 클릭형 지도 리전 선택 → 상시갱신 통계패널+바차트 | **생존** |
| b | (concept b.md) | 스와이프 카드덱(좌/우) → 상시 재드로우 선호도 레이더 | **생존** |
| c | (concept c.md) — 셀러向 | 멀티스텝 칩 위저드 → 상시 재계산 항목별 지급액 | **생존** |

## 하드게이트 1차
- a: a11y 97 — `color-contrast`(ProductCardRow 원가 line-through `text-white/40` on `#121216` ≈3.83:1 <4.5:1, 3개 카드 공통)
- b: lint 2건 — `react-hooks/set-state-in-effect`(레이더 애니메이션 effect 안 reduced-motion 분기에서 동기 `setDisplayScores` 호출) + `react-hooks/refs`(일반 함수 `renderSwipeCard({...})`를 JSX 없이 렌더 중 직접 호출하면서 ref 클로저를 캡처한 핸들러를 전달 — "함수에 ref를 전달하면 렌더 중 읽을 수 있다"로 판정) + a11y 96 `color-contrast`(`text-neutral-500` on `#0b0b0f` ≈4.14:1, 6곳 공통)
- c: static 4건 `no-unlisted-font` — `style={{fontFamily: DISPLAY_FONT}}`(변수 간접참조, 정적검사기는 `fontFamily:` 바로 다음 토큰이 `var(--font-display-*)` 리터럴인지만 정규식으로 보기 때문에 상수를 통한 간접참조를 "목록 밖"으로 오판)

## 1-fix (오케스트레이터 직접 수정)
- a: `text-white/40` → `text-zinc-400`(레포 표준 다크서피스 보조텍스트 하한 토큰)
- b: ① reduced-motion 분기를 effect 밖으로 — `useState` 기반 "렌더 중 상태 조정" 패턴(`snappedTarget`)으로 전환, `fromScoresRef`(ref)도 `animFrom`(state)으로 교체해 애니메이션 재개 시점의 ref-쓰기도 제거 ② `renderSwipeCard` 일반함수 호출 → `<SwipeCard .../>` 정식 JSX 컴포넌트 호출로 전환(두 호출부 모두) ③ `text-neutral-500`→`text-neutral-400` 전역 6곳
- c: `style={{fontFamily: DISPLAY_FONT}}` 4곳을 리터럴 `"var(--font-display-grotesk), var(--font-sans)"`로 인라인(정적검사기가 변수 간접참조를 못 따라가므로 소스에 리터럴이 직접 보여야 함) + 이제 미사용된 `DISPLAY_FONT` import 3곳 제거

## 재게이트 최종
| v | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|
| a | 0 | 0 | 3종 | 0 | 0건 | 결함0 | 100 | 62 |
| b | 0 | 0 | 3종 | 0 | 0건 | 결함0 | 100 | 67 |
| c | 0 | 0 | 3종 | 0 | 0건 | 결함0 | 100 | 55 |

**3후보 전원 클린 재게이트 — 이번 라운드는 탈락 후보 없음.**

## 상태 동결 해시 (게이트 통과 후, 캡처 전)
- a: `655572c347d6e8d6e33b6114f90e3326b18ff654`
- b: `49e2052ab676e10520a6c156177b28c9e2486468`
- c: `8b654fc8cfc999c3d03ec59665d1f56d406cfb2e`

## 스크린샷
후보별 4폭(390/1280/1440/1920) × 스크롤 0/35/70/100% (총 48장), `blank:false` 전수 확인 — `vault/20-generations/2026-10-09-auto-landing-r31/shots/`.
