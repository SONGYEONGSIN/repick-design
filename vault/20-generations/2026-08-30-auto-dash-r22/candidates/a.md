# Candidate a — Redoubt (security/audit-log console)

Vertical-chronological-event-stream macro (per [[dash-brief-v3]] "보안/감사 로그 콘솔" archetype) — not used by any dash/dash-evolve winner to date (calendar/gantt/waterfall/matrix/treemap/funnel/sankey/radial-dial/permission-matrix/kanban forms all appear in d29–d48 and r17–r21, but none is a timeline-list-as-main-stage). A single vertical timeline of security/audit events (48 hand-authored entries across ~44h, grouped by day, each with a severity dot + connector line) is the page's main stage.

Product: Redoubt, a security/audit console. Real dark theme (zinc-950/900, white/10 hairlines), rose accent, `--font-display-mono` (JetBrains Mono Display) for the wordmark, eyebrows, and every timestamp/ID readout — three rendered weights (400/500/600) throughout.

**Selection-blast-radius split** (per the 2026-08-29 L2 note): actor/type/severity filters are a *partial recompute* — they only re-derive `filteredEvents` in `RedoubtClient.tsx`, which feeds the stream list and the four summary count cards. Clicking an event opens an *ephemeral* inspector drawer (`EventInspector.tsx`) that reads whatever event it's handed and writes nothing back — no `selectedId` is threaded into the stream, the summary cards, or the independent Actor Risk Index panel. The Actor Risk Index (`ActorTable.tsx`) is a fully separate widget scoped only by its own 24h/7d/30d toggle, backed by a hand-authored per-window dataset rather than a live filter of the same event list, so the two halves of the page can never accidentally share a recompute path. Every file that touches this split says so in a code comment.

Interactions (4): ① hover/keyboard-focus on a stream row reveals a small quick-facts tooltip (IP/location/request ID) — visual-only, since the same content already lives in the row's `aria-label` ② real filters — severity chips, event-type chips, actor multi-select, free-text — narrow the stream and its four count cards only ③ the Actor Risk Index's own 24h/7d/30d segmented toggle, decoupled from the stream filters ④ ⌘K command palette that searches events (selecting one opens the ephemeral inspector) and actors (selecting one adds an actor filter) — its own `useState("")` is fresh on every mount, never reset inside a `useEffect`.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: "선택→다중 위젯 동기화 금지" 규칙을 이 아키타입에서 구체적으로 어디에 그을지 — 이벤트 클릭(인스펙터)과 ⌘K 이벤트 검색이 둘 다 "이벤트를 연다"는 같은 동작인데, 이걸 서로 다른 state로 만들지 하나로 합칠지.
   **무엇으로 정했나**: 인스펙터를 여는 모든 경로(행 클릭, 관련 이벤트 클릭, ⌘K 이벤트 검색)가 동일한 단일 `inspectorEvent` state 하나만 갱신하도록 통일 — 별도의 "하이라이트" state를 새로 만들지 않음.
   **왜**: r21이 커맨드팔레트에서 별도 `highlightedId`를 만들어 보드 컴포넌트에 prop으로 꽂았던 것과 달리, 여기서는 "이벤트를 연다"는 하나의 개념에 상태 하나만 대응시켜 파급 범위를 최소화 — 인스펙터 밖 어떤 위젯도 이 state를 읽지 않는다.
2. **무엇을 정해야 했나**: Actor Risk Index를 EVENTS 배열을 필터링해서 파생시킬지, 완전히 별도 데이터로 손으로 쓸지 — 전자가 더 "현실적"이지만 필터 state와 은근히 결합될 위험이 있음.
   **무엇으로 정했나**: `ACTOR_RISK`를 `data.ts`에 윈도우별(24h/7d/30d)로 손으로 쓴 완전히 독립적인 집계로 분리 — EVENTS를 참조하지 않음. 각 actor 내부적으로 24h≤7d≤30d 단조 증가 및 critical≤events 정합만 검증.
   **왜**: "부분 재계산 vs. 독립 위젯"의 경계를 코드 구조로 강제하기 위함 — 파생 데이터였다면 나중에 실수로 필터 state를 참조하는 리팩터가 생기기 쉽지만, 애초에 별도 상수 배열이면 그 결합이 물리적으로 불가능하다.
3. **무엇을 정해야 했나**: rose accent가 severity 5단계 중 "critical"의 색과 정확히 겹치는데(브랜드 accent = 위험색), 이게 "포커스 링/네비 활성 표시"와 "가장 심각한 이벤트 배지"를 시각적으로 혼동시키지 않는지.
   **무엇으로 정했나**: critical만 rose를 쓰고 high/medium/low/info는 각각 amber/sky/emerald/zinc로 분리 — accent(rose)를 쓰는 곳(포커스 링, 활성 nav, 버튼)과 severity 배지는 아이콘+텍스트 라벨을 항상 동반해 색만으로 구별하지 않게 함.
   **왜**: 보안 콘솔에서 "가장 위험한 상태 = 브랜드 강조색"은 관용적으로 자연스럽고(경쟁 대체용 hue를 억지로 고르는 것보다 낫다), 색 단독 의존 금지 규칙만 지키면 accent와 severity가 같은 hue를 공유해도 혼동 위험이 낮다고 판단.
4. **무엇을 정해야 했나**: accent hex와 흰색/어두운 잉크 대비 — 브리프가 "반드시 계산해 기록"하라고 명시.
   **무엇으로 정했나**: `rose-400 #fb7185` on `zinc-950 #09090b` = **7.39:1** (텍스트 캐리어: nav/링크/포커스링/critical 텍스트) · `rose-400` on `white #ffffff` = **2.69:1**(AA 텍스트 기준 미달 — 라이트 표면에는 절대 안 씀, 코드 주석에 명시) · `rose-600 #e11d48` on `zinc-950` = **4.24:1**(장식 전용, 텍스트 안 얹음) · `white` on `rose-600` = **4.70:1**(솔리드 버튼용, AA 통과). severity 배지(rose/amber/sky/emerald-300 텍스트 on 해당 950/40 배경)는 전부 8:1 이상으로 별도 계산.
   **왜**: WCAG 상대휘도 공식으로 직접 계산(Python 스크립트로 검증) — 다크 테마 전용이라 rose-400의 화이트 대비 실패(2.69:1)는 실사용 경로가 없지만, 브리프가 "양쪽 다" 요구했으므로 실패 값도 기록하고 "왜 안 쓰는지"를 tokens.ts 주석에 남김.
