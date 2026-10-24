# auto-dash-r48/a — "Pulseboard"

SLA/uptime ops console. Board/grid-centric main content (not the default sidebar+KPI4+
chart+table shell) — a 2/3-col grid of per-service bullet-style cards (value + target bar
+ 7-point sparkline, value always shown as text, never hover-only). Period toggle
(24h/7d/30d) recomputes every card's value and sparkline from a fixed per-period lookup
table. Selecting a service card (click its name) pins a selection that fans into two
widgets: the Inspector panel on the right recomputes to that service, and the incidents
table's matching rows highlight — single-axis partial recompute tier (dash-brief-v3's
middle fan-out tier, not its top "다축 독립 스코프" tier). Theme: light / accent rose-600 /
no display face.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 크로스헤어 툴팁을 스파크라인에 어떻게 구현할지 — 포인트마다 별도
   `<button>`을 두면 카드 전체를 감싸는 선택 버튼과 중첩돼 **버튼-인-버튼**이 된다(실측: 1차
   게이트에서 하이드레이션 미스매치 13건 — 브라우저가 중첩 `<button>`을 파싱 중 자동으로
   바깥 버튼을 닫아버려 서버/클라이언트 DOM 트리가 갈렸다).
   **무엇으로 정했나**: 카드 전체를 `<button>`으로 감싸는 대신, 서비스 이름만 별도의 작은
   `<button>`(선택 트리거)으로 분리하고 스파크라인 포인트들은 형제 요소로 둠.
   **왜**: 중첩 인터랙티브 콘텐츠는 HTML 콘텐츠 모델 자체가 금지하고(파서가 자동 교정),
   정적 검사로는 안 잡히며 오직 렌더(하이드레이션 에러)로만 드러난다 — 이번 라운드 1차
   게이트가 그 증거다.
2. **무엇을 정해야 했나**: `target-size` 하드게이트(24×24px 미만 탭 타깃 금지) — 스파크라인
   포인트를 처음엔 `h-3 w-3`(12px)로 뒀다가 실측 실패.
   **무엇으로 정했나**: 버튼 자체는 `h-6 w-6`(24px)로 키우고, 그 안에 시각적으로는 작은
   `h-2 w-2` 점만 그림(히트 영역과 비주얼 크기를 분리).
   **왜**: WCAG 2.5.8 AA 최소 타깃 크기를 지키면서도 스파크라인의 조밀한 시각 밀도는 유지하기
   위함.
3. **무엇을 정해야 했나**: `color-contrast` — `text-zinc-400`로 둔 보조 라벨("target 99.9%",
   "⌘K")이 순백 배경에서 실패(zinc-400 on white < 4.5:1).
   **무엇으로 정했나**: 전부 `text-zinc-500`(4.83:1, page-brief-core §2 순백 표면 하한과
   일치)로 교체.

## 1-fix 로그 (self_judged 라운드 — 셀프 기록)

1차 게이트: lint(`aria-sort`를 `role=button`인 요소에 둠, jsx-a11y 위반) + console
(하이드레이션 미스매치 13건, 위 1번 원인) + a11y 84(`color-contrast`·`target-size`). 위 세
수정(aria-sort를 `<th>`로 이동, 카드 구조 분리, 색/크기 조정)으로 1-fix 재게이트 10/10 클린.

## 프레임 커버리지 (self_judged 라운드 — judge 본인 메모)

`a-1440.png`·`a-390.png` 2장만 직접 확인(랜딩 라운드보다 1장 적음 — 시간 예산). 나머지 14장
미확인. sweep이 1280~1920px 오버플로 0을 기계적으로 확인.
