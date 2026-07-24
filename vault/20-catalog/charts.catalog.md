---
tags: [catalog, charts]
source: ui-ux-pro-max (github.com/nextlevelbuilder/ui-ux-pro-max-skill)
license: MIT
attribution: Next Level Builder
fetched: 2026-07-21
platform: web(dash) — native 차트는 후속(react-native-svg 미도입). 아래 규칙은 웹 생성형 SVG 기준.
note: 외부 카탈로그를 repick DNA(생성형 SVG·결정론·접근성)에 맞게 재해석한 결정 규칙층
---

# Charts — 데이터 타입별 차트 선택 카탈로그

> 소비자: [[dash-brief-v3]] — dash 루프가 도메인 시각화를 고를 때 읽는 결정 규칙.
> 층위: 10-references(참조 [[README]])가 "브랜드 정성 해부"라면 이 노트는 "정량 결정 규칙". 정제 기준은 [[curation-criteria]].

## repick 적응 규칙 (원본과 다른 점 — 반드시 적용)
- **라이브러리 추천은 무시**한다. 브리프의 "외부 파일 0 · 생성형 SVG/CSS" 원칙이 우선 — 아래 표의 차트는 **손으로 SVG/CSS 생성**이 기본. 라이브러리는 아래 "라이브러리가 정당한 경우"에만.
- **결정론 유지**: 좌표는 삼각함수 소수 2자리 반올림(하이드레이션 안전), `Math.random`/`Date.now` 금지, 더미는 합계 정합.
- **접근성 필수**: A11y 등급 C/D 차트는 **단독 사용 금지** — 반드시 "필수 폴백"(데이터 테이블 등)을 함께 렌더. 색만으로 정보 전달 금지(색+텍스트/패턴 병행). 크로스헤어 툴팁은 키보드 접근 포함.
- **라이브러리가 정당한 경우**: 실시간 스트리밍(≥1Hz)·10k+ 포인트·3D 등 Canvas/WebGL이 강제되는 경우에 한해. 그 외 대시보드 차트는 생성형 SVG로 충분.

## dash 핵심 8종 (SaaS 대시보드 우선순위)
상용 대시보드에서 가장 자주 필요한 순서. 나머지는 아래 전체 표 참조.

| 데이터 의도 | 추천 차트 | 언제 쓰나 | 피할 때 |
|---|---|---|---|
| 시간 추세 | **Line / Area** | 시간축 + 상승·하락 추세 | 데이터 <4점(스탯 카드로) · 6계열 초과 |
| 범주 비교 | **Bar (가로/세로)** | 이산 범주 크기·랭킹, 범주 ≤15 | 범주 >15(테이블) · 시간축 존재 |
| 목표 대비 KPI | **Gauge / Bullet** | 단일 KPI vs 목표. 대시 요약 | 목표 없음 · 3+ KPI는 Bullet 그리드 |
| 누적 기여 | **Waterfall** | 개별 ± 요소가 총합으로(P&L·변동) | 비가산 · 12개 초과 |
| 강도/밀도 | **Heatmap** | 2D 그리드 강도(시×요일 활동) | 셀 <20(Bar) · 정확값 필요 |
| 전환/단계 | **Funnel / Sankey** | 순차 다단계 전환·드롭오프 | 비순차 · 단계 <3 |
| 분포/이상 | **Box Plot** | 중앙값·사분위·이상치, 그룹 비교 | 그룹당 <20점 |
| 다변량 비교 | **Radar** | 고정 속성셋으로 엔티티 비교 | 축 >8 · 정밀 비교 필요(Bar) |

## 전체 카탈로그 (25종)

| 데이터 타입 | 추천 차트 | 볼륨 임계 (SVG↔Canvas) | A11y | 필수 폴백 |
|---|---|---|:--:|---|
| Trend Over Time | Line (또는 Area) | <1000 SVG / ≥1000 Canvas+다운샘플 / >10k 구간집계 | AA | 계열별 선 스타일(실/파선/점선), 시각·값 데이터 테이블 |
| Compare Categories | Bar (가로/세로) | <20 세로 / 20–50 가로 / >50 페이지네이션 테이블 | AAA | 막대 값 라벨 상시, CSV 내보내기 |
| Part-to-Whole | Pie / Donut | 슬라이스 최대 6, 초과 시 100% 스택바 | **C** | 스택바 대안 + 퍼센트 데이터 테이블(필수) |
| Correlation / Distribution | Scatter / Bubble | <500 SVG / 500–5k Canvas / >5k hexbin | B | 그룹별 모양 마커, 상관계수 주석 테이블 |
| Heatmap / Intensity | Heatmap / Choropleth | ≤10k 셀, 캘린더 365셀/SVG | B | hover 수치 오버레이, 행·열 라벨 테이블 |
| Geographic | Choropleth / Bubble Map | <1000 SVG / ≥1000 Canvas·WebGL | B | 지역 텍스트 라벨, 정렬 가능 테이블 |
| Funnel / Flow | Funnel / Sankey | 3–8 단계, 초과 시 'Other' 묶음 | AA | 단계명+수+드롭오프% 리스트, 키보드 순회 |
| Performance vs Target | Gauge / Bullet | 게이지=단일, 3+ KPI는 Bullet 그리드 | AA | 값+목표% 텍스트, 실시간은 ARIA live |
| Time-Series Forecast | Line + Confidence Band | 이력 30–90일, 예측 ≤x축 30% | AA | 실측/예측 토글, 선 스타일 범례 |
| Anomaly Detection | Line + Highlights | 스트림 ≤60fps Canvas / 배치 ≤10k | AA | 이상 지점 모양 마커, 이상 이벤트 텍스트 주석 |
| Hierarchical / Nested | Treemap | <200 SVG / 200–1k Canvas / >1k 사전필터 | **C** | 접이식 트리 테이블을 주 뷰로, treemap은 보조 |
| Flow / Process | Sankey | <50 SVG / ≥50 Canvas / >200 'Other' 집계 | **C** | Source→Target→Value 테이블, 키보드 노드 순회 |
| Cumulative Changes | Waterfall | 4–12 막대, 초과 시 'Other' 집계 | AA | 러닝 합계 열 테이블, 방향 화살표 아이콘 |
| Multi-Variable | Radar / Spider | 데이터셋 2–3, 축 5–8 | B | Grouped Bar 대안(필수) + 원본 테이블 |
| Stock / Trading OHLC | Candlestick | 실시간 Canvas, 최대 500 캔들 | B | OHLC 테이블, 상승=채움/하락=빈칸 패턴 |
| Relationship / Network | Network Graph | ≤100 SVG / 101–500 Canvas / >500 클러스터링 | **D** | 인접 리스트 테이블(필수), 트리 뷰 |
| Distribution / Statistical | Box Plot | 임의 크기(집계 표현, 렌더 경량) | AA | min/Q1/중앙/Q3/max 요약 테이블, 이상치 수 주석 |
| Performance vs Target (Compact) | Bullet | 그리드 3–10개 이상적 | AAA | 값 상시 표시(hover 아님), 임계 텍스트 라벨 |
| Proportional / Percentage | Waffle | 10×10 표준, 5범주 초과 시 100% 스택바 | AA | 퍼센트 텍스트 상시, 셀 aria-label |
| Hierarchical Proportional | Sunburst | <100 SVG / 100–500 Canvas / >500 top-N | **C** | 접이식 들여쓰기 리스트+%, breadcrumb |
| Root Cause Analysis | Decomposition Tree | ≤5단계, 레벨당 20노드, 지연 로드 | AA | 키보드 확장/축소, SR가 노드 값+%기여 낭독 |
| 3D Spatial | 3D Scatter / Surface | WebGL 필수(Deck.gl 1M, Three.js LOD) | **D** | 2D 투영 뷰+테이블(필수). **제품 UI 주 차트 금지** |
| Real-Time Streaming | Streaming Area | Canvas/WebGL, 60–300s 버퍼 | B | 일시정지/재개(필수), 현재값 대형 텍스트 KPI, reduced-motion=정지 |
| Sentiment / Emotion | Word Cloud + Sentiment | 50–5000 단어, 초과 top-N | **C** | 빈도 정렬 리스트+감성 라벨 열, 워드클라우드는 보조 |
| Process Mining | Process Map / Graph | <30 SVG / 30–100 Canvas / >100 변형 필터 | B | 경로 요약 테이블, top3 병목 텍스트 주석 |

## 색 가이드 원칙 (원본 추출 — repick 절제 적용)
- 다계열은 **색만으로 구분 금지** → 선 스타일(실/파선/점선)·모양 마커·패턴 오버레이 병행(색맹 대응).
- 채움(fill)은 저투명(15–20%)으로. 히트맵/산점 밀도는 opacity 0.6–0.8.
- 증감 의미색(증가/감소)은 **색+방향 아이콘** 병행. 값 라벨은 hover 의존 말고 상시 노출을 우선.
- 팔레트 토큰은 [[colors.catalog]]의 AA 검증 슬롯을 사용.

## 관련
- [[dash-brief-v3]] · [[colors.catalog]] · [[ux-guidelines.catalog]] · [[curation-criteria]] · 홈 [[🏠 Design Evolution]]
