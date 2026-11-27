# Candidate c — "Flagged Zones" (Self-Inspection Ledger)

Six fixed, always-visible zone chips (Screen / Frame corners / Ports / Battery / Buttons / Back
glass) — never freehand drawing or invisible hotspots — let a seller flag any combination (0 to
6) of concerns on one photo. Flagging a zone WIDENS the live price range and lowers its midpoint
— the inverse of this catalog's established "confirming a trait narrows the range" (v16): here,
raising a concern is what admits uncertainty. All six ledger rows are always rendered (never
conditionally shown/hidden); a second, independent toggle reframes every row between a seller's
disclosure voice and a buyer's "already accounted for" voice without moving any number.

Theme/accent/face: dark / orange (`#F97316`, 7.10:1 on `#09090B`) / none (Pretendard-only), the
deliberate counterpoint to this round's other two display-face candidates.

Macro bucket: fixed-zone variable-cardinality multi-select → bidirectional range (widen/narrow) +
always-visible ledger. Distinct from this catalog's variable-cardinality bundle-builder (v23,
which ADDS items and only ever narrows toward a discount) and its sequential pin-reveal (v9
Loupe, which is author-driven disclosure, not seller-chosen flags) — this is the first device
where the user's own uncertainty, not the AI's, is what the control encodes.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 플래그가 범위를 "좁히는" 쪽인지 "넓히는" 쪽인지 — 브리프의 기존
   선례(v16 Price Band)는 확인이 좁힌다.
   **무엇으로 정했나**: 반대 방향 — 플래그(우려 제기)는 넓히고, 클린 확인은 좁게 유지한다.
   **왜**: 다른 작품 참조 + 의미론 — v16과 정반대 의미(판매자가 "모른다"고 선언하는 것)이므로
   같은 메커니즘을 복제하면 의미가 틀려진다. 재배정 큐 항목(#26 등)과 무관한 독립 판단.

2. **무엇을 정해야 했나**: 6개 존의 가중치(deduction/widen) 구체 수치.
   **무엇으로 정했나**: screen 42/10, battery 35/9, backGlass 26/8, ports 22/8, buttons 18/7,
   frame 14/6 (deduction/widen, $).
   **왜**: 임의 — 실제 수리비 데이터가 없어, "화면·배터리가 가장 비싸다"는 상식적 위계를
   반영하는 범위 안에서 서로 겹치지 않는 깔끔한 정수를 골랐다.

3. **무엇을 정해야 했나**: 64개(2^6) 조합 전체를 참조 테이블로 보여줄지.
   **무엇으로 정했나**: 아니오 — "0개 플래그(ceiling)"와 "6개 전부(floor)" 두 경계값 +
   현재 행만 Value Split에 표로 제시.
   **왜**: 관행 — r58/b의 7행 lookup table 선례는 2^3=8(표시는 7, 전부 끄기 제외)까지가
   사람이 읽을 수 있는 한계였다. 2^6=64는 그 한계를 한참 넘어 표가 증명이 아니라 소음이 된다.
