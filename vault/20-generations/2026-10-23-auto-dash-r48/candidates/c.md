# auto-dash-r48/c — "Vantage"

Vendor scorecard console, master-detail main content. Left rail = sortable vendor table
(name/category/overall score). Right pane = a 5-axis radar chart (Quality/Price/Delivery/
Support/Compliance) for the selected vendor, with every axis value **also** printed as a
redundant always-visible text list below the SVG (not hover-only). A second, independently
-scoped mechanic — per-row "Cmp." checkboxes (up to 2) — overlays other vendors' radar
shapes on the same chart without changing which vendor is "selected" for the detail text;
this reaches dash-brief-v3's own named **top** fan-out tier ("다축 독립 스코프": selection
drives the detail panel, compare-overlay drives the chart overlay, neither depends on the
other). Theme: light / accent violet-600 / display face `--font-display-mono`.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 레이더 축 5개의 선택 파급 구조 — 선택된 벤더 하나가 디테일 패널과
   차트 둘 다를 바꾸는 단일축 설계로 할지, 비교 오버레이를 별도 독립 축으로 뺄지.
   **무엇으로 정했나**: 독립 축으로 분리(위 설명대로).
   **왜**: `dash-brief-v3.md` §완성도 기준이 "축의 서열이 생겼다 — 전면 재계산 < 단일 축 부분
   재계산 < **다축 독립 스코프**"를 명시하고, `r26/c` 선례가 그 최상위 티어로 판정에서 이겼다고
   적어 뒀다. 같은 구조를 이 도메인(벤더 스코어카드)에 새로 적용했다.
2. **무엇을 정해야 했나**: 레이더 SVG `viewBox`와 라벨 반경 — 5축 레이블을 차트 바깥 어디에
   둘지, 얼마나 여유를 둘지.
   **무엇으로 정했나**: `R=80`, `CX=110, CY=100`, 라벨 반경 `R+22=102`, `viewBox="0 0 220
   210"`.
   **왜**: 시간 예산상 각 라벨의 실제 렌더 폭을 역산하지 않고 고정 여유값을 뒀다. **이것이
   틀렸다** — 아래 "자가 발견 결함" 참조.

## 자가 발견 결함 — 레이더 상단 라벨 클리핑 (`auto-dash-r45` delta의 재현)

**"Quality" 축 라벨이 SVG `viewBox` 상단 경계에서 잘린다.** 5축은 `-90°`에서 시작해 72°씩
도는데, 축 0("Quality")의 라벨 좌표는 `y = CY + (R+22)·sin(-90°) = 100 - 102 = -2` —
`viewBox`가 `y=0`에서 시작하므로 **라벨 전체가 음수 좌표로 캔버스 밖에 그려진다.** 스크린샷
(`c-1440.png`·`c-390.png`)에서 실제로 "QUALITY" 라벨이 상단에서 잘려 보인다.

이것은 **`auto-dash-r45`의 기존 L1 delta를 정확히 재현한다** — 그 delta는 *"고정 라벨 반경이
있는 원형/방사형 차트(코드 다이어그램, **그리고 같은 기하로 sunburst·donut·radar도**)는
viewBox 가장자리까지 충분한 여유를 둬야 한다"* 고 **radar를 명시적으로 일반화 대상에
포함**시켜 뒀다. 이번 라운드가 그 일반화를 독립적으로(다른 세션·다른 차트 인스턴스에서)
재현한 것이다. DECISION.md §6에서 이 delta를 L1→L2로 승격한다.

**완화 요인**: r45의 코드 다이어그램과 달리, 이 레이더는 축 값이 차트 **아래의 상시-노출
텍스트 리스트**("QUALITY 88" 등)에도 중복 표시되므로, "always-visible-value" 요구사항
자체는 (SVG 라벨이 아니라 그 리스트를 통해) 충족된다 — r45처럼 유일한 값 전달 경로가
잘린 것은 아니다. 그래도 지배 시각화 자체의 완성도 결함은 실재한다.

## 프레임 커버리지 (self_judged 라운드 — judge 본인 메모)

`c-1440.png`·`c-390.png` 2장 확인. 라벨 클리핑은 두 프레임 모두에서 확인됨(폭에 무관하게
재현 — SVG `viewBox` 좌표 문제이므로 당연하다).
