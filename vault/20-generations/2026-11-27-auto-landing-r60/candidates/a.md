# Candidate a — "Horizon" (Resale Timing Dial)

One continuous dial (day 0–180) moves a live marker along a deterministic two-segment
price-decay curve (rise to a named day-45 peak, then decline). A second, independent toggle —
the verified condition certificate — rescales the ENTIRE curve by a fixed 12% premium, so
toggling it redraws the polyline/polygon, not just the payout number beside it. A named phase
(Rising / Peak window / Declining) and a recommendation sentence are both derived from the same
day value as the marker position. The fourth interaction is the Product Preview's sort control.

Theme/accent/face: dark / green (`#22C55E`, 8.73:1 on `#09090B`) / `--font-display-grotesk`.

Macro bucket: single continuous dial → animated SVG curve + marker + derived text. Distinct from
this catalog's slider→gauge (v8/v21), slider→scatter (v24), slider→band-width (v16), and
slider→multi-surface (v13/v15) precedents — none of those plot the control's own axis (time) as
the chart's x-axis with the control continuously sweeping across it; this one does.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 커브의 구체적 수치(day0/45/180 값, 인증서 프리미엄 %).
   **무엇으로 정했나**: day0=$420 → day45 peak=$480 → day180=$260, 인증서 +12%.
   **왜**: 임의(arbitrary) — 브리프에 리셀 타이밍 커브의 선례가 없어, "초반 수요 램프 후 정점,
   이후 통상 감가"라는 서사가 성립하는 범위 안에서 깔끔한 숫자를 골랐다.

2. **무엇을 정해야 했나**: Y축 도메인을 인증서 on/off 양쪽에 걸쳐 고정할지, 토글마다 재조정할지.
   **무엇으로 정했나**: 고정 도메인(240–560)으로 양쪽을 다 수용.
   **왜**: 관행 — [[page-brief-core]] §1의 "딱 맞음은 실패" 규율과 같은 정신으로, 토글할 때마다
   축이 재조정되면 독자가 "커브가 바뀌었다"와 "축이 바뀌었다"를 구분할 수 없게 된다.

3. **무엇을 정해야 했나**: `role="slider"` 네이티브 `<input type="range">`의 24px 탭타깃 보장 방법.
   **무엇으로 정했나**: 이 카탈로그의 기존 승격작(`/v24` `slider-row.tsx`)과 동일한
   `h-6` 래퍼 + `h-5 w-5` 섬 패턴을 그대로 재사용.
   **왜**: 다른 작품 참조 — 이미 승격을 통과한 패턴이라 재검증 없이 안전하게 재사용 가능.
