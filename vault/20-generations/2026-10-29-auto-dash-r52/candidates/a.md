# a — Nightshift

On-call incident coverage console for a platform/edge engineering org. Macro layout: calendar-centric
— a 5-week (35-day) coverage heatmap is the dominant visualization (not a card row + single chart),
with density color + always-visible incident count + sev1 marker per cell. Theme light / accent sky /
display face Archivo ("wide").

**Structure**: app shell (sidebar + topbar, 44px controls) → KPI row (4 cards, period-toggle-aware) →
calendar heatmap (xl:col-span-3) + incident log table (xl:col-span-2), table scoped to the pinned day.

**Interactions (5)**: ① hover/focus a calendar cell → ephemeral readout panel (date, incident count,
sev1 count, on-call engineer) — crosshair-equivalent, keyboard accessible via `onFocus`/`onBlur` ②
click a cell → pins that day, which scopes the incident table (click again to clear) ③ table sort by
severity or time (real `aria-sort` + re-render) ④ table status filter segmented control (All/Open/
Resolved) ⑤ "This month / Last month" period toggle swaps the KPI header's headline figures between a
reconciled October total and a fixed September baseline.

**Diversity**: accent sky (underused, 5/65 before this round) and theme light are both away from the
immediately preceding dash winners (r47 emerald/grotesk, r48 violet/mono, r49 orange/none, r51
green/mono) — face "wide" (Archivo) has not been a winner's face in the last 4 real (non-dropped)
rounds either.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 캘린더 셀의 "크로스헤어 툴팁"을 실제 플로팅 툴팁(커서 추적)으로 할지,
   고정 위치의 "리드아웃 레일"로 할지 브리프는 구체 UI를 지정하지 않는다.
   **무엇으로 정했나**: 캘린더 카드 상단에 고정된 리드아웃 바(hover/focus된 날짜 정보를 표시)로
   구현 — 플로팅 툴팁의 위치 계산/오버플로 리스크를 피하면서도 "크로스헤어 툴팁" 요구(상시 텍스트,
   키보드 접근)를 동일하게 만족한다.
   **왜 그렇게 정했나**: 과거 라운드들의 sr-only/포지션 앵커 버그가 전부 "플로팅 요소가 클리핑
   컨테이너를 벗어나는" 패턴에서 났다 — 고정 위치 패널은 그 결함 클래스 자체가 성립하지 않는다
   (anti-slop 안전책, 관행 아님).
2. **무엇을 정해야 했나**: "히어로 숫자+보조지표, 인라인 스탯 등 변주" 지시가 캘린더형 대시보드에
   어떻게 적용되는지 — 캘린더가 지배 시각화이면 히어로가 따로 필요한가?
   **무엇으로 정했나**: 별도 히어로 섹션 없이 KPI 4카드 행만 두고 캘린더를 즉시 본문으로 진입시켰다.
   **왜 그렇게 정했나**: 브리프의 "레이아웃 아키타입 다양화" 목록에 "캘린더/보드 중심: 대형
   캘린더·칸반이 화면 주인공"이 명시돼 있어, 캘린더 자체가 히어로를 대체하는 것으로 해석했다(다른
   아키타입 관행 참조, 임의 아님).
3. **무엇을 정해야 했나**: 월 전환(이전/다음 달) 네비게이션을 실제로 구현할지, 고정 1개월 뷰로 할지.
   **무엇으로 정했나**: 고정 10월 뷰 + "This month/Last month" 비교 토글만 구현(달 전환 화살표 없음).
   **왜 그렇게 정했나**: 임의 — 5번째 인터랙션(기간 토글)이 이미 최소 요구를 충족하고, 월 전환까지
   더하면 9월분 일별 데이터를 전부 만들어야 해 예산 대비 가치가 낮다고 판단했다.
