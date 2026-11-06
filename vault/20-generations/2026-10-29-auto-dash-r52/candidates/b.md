# b — Ledgercheck

Vendor spend governance / procurement console for a finance & procurement org. Macro layout: KPI-hero
+ inline-stat variant — no single dominant chart; instead a 6-card Bullet grid (charts.catalog's
compact KPI-vs-target chart, "3–10개 이상적") carries the page, each card its own bullet-bar + target
marker + 8-week sparkline. Theme dark / accent lime / no added display face (plain Pretendard,
tabular-nums).

**Structure**: app shell → period toggle + bullet grid (full width) → two-column: approvals queue
(xl:col-span-2) + vendor table (xl:col-span-3), vendor table scoped to the pinned metric.

**Interactions (5)**: ① hover/focus a bullet card → readout bar with the quarter-over-quarter
comparison figure ② click a card → pins that spend category, filtering the vendor table (approvals
feed is NOT affected — independently scoped from the pin, per this catalogue's documented
dual-independent-axis pattern) ③ approve/flag buttons in the approvals feed are real state transitions
(pending → approved/flagged, with the pending counter updating) ④ vendor table sort by spend or risk
tier + risk-tier filter ⑤ "This quarter / Last quarter" toggle swaps both the bullet grid's headline
value and its comparison baseline to a true prior-period pair (not just a caption change) — wired via
a `valueTwoQuartersAgo` field so the comparison is honest in both toggle states.

**Diversity**: accent lime is the single most underused hue in the catalogue (2/65 before this round,
tied with nothing else this low) — a dark theme is roughly balanced against light across the catalogue
already. No display face keeps this candidate's typographic voice apart from the three winners
immediately before it (grotesk, mono, mono).

## 브리프에 없던 것

1. **무엇을 정해야 했나**: "3+ KPI는 Bullet 그리드"(charts.catalog)가 각 불릿의 목표선을 어떻게
   시각화할지는 지정하지 않는다 — 수직 틱 마커 vs 배경 구간 음영 등.
   **무엇으로 정했나**: 트랙 위 수직 틱(목표 100% 지점)+필채움 바(현재값)로 구현, 과다 시 바 색을
   rose로 전환.
   **왜 그렇게 정했나**: charts.catalog가 "값+목표% 텍스트, 실시간은 ARIA live"를 필수 폴백으로
   요구하길래, 시각 인코딩은 가장 단순한 형태로 두고 텍스트(배지+퍼센트)를 항상 병기하는 쪽을
   택했다(관행 — 대시보드 KPI 카드의 표준 불릿 패턴).
2. **무엇을 정해야 했나**: "선택→다중 위젯 동기화"에서 두 번째로 독립 스코프될 위젯이 무엇이어야
   하는지(브리프는 "다중 위젯"만 말하고 어느 위젯이 비연동이어야 하는지는 말하지 않는다).
   **무엇으로 정했나**: 승인 피드를 의도적으로 KPI 핀에 비연동으로 뒀다(승인 피드는 자기 자신의
   승인/반려 상태만 바꾼다).
   **왜 그렇게 정했나**: dash-brief-v3가 이미 "파급을 나누는 것 + 나뉜 축이 서로 다른 지배 위젯에
   살면 한 단계 더 이긴다"는 L2 지식을 명시하고 있어 그 처방을 그대로 따랐다(다른 작품 참조 —
   r26/c의 "독립 스코프 pin 둘" 패턴).
3. **무엇을 정해야 했나**: 다크 테마에서 lime 액센트가 필 버튼(배경) 위 텍스트 색을 무엇으로 할지 —
   브리프는 "금색 등 어두운 텍스트" 예시만 든다.
   **무엇으로 정했나**: `bg-lime-400` 위에 `text-zinc-950`(흰색이 아니라 어두운 잉크).
   **왜 그렇게 정했나**: questions-queue Q29 판정("실측이 사람 작성 정본을 반증하면 그쪽이
   이긴다")과 동일 원리 — lime-400은 매우 밝아 흰 텍스트가 AA를 통과하지 못할 것이 명백해(계산 없이도
   밝기로 판단 가능), 애초에 흰 텍스트 조합을 시도하지 않았다.
