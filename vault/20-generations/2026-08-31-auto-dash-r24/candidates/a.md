# r24 · candidate a

**Product/brand:** Harborline — a B2B support/ops case console (generic helpdesk SaaS, invented; not "repick").

**Concept (one line):** A master-detail support case console — a fixed case rail on the left, a dominant case workspace on the right (timeline/notes/activity tabs, customer panel, SLA response-time trend chart, and case actions) — in a light, near-white, teal-accented shell with no display typeface.

**Layout archetype:** Master-detail (assigned). Rail `344px` fixed, detail pane `flex-1 min-w-0`.

**Applied interactions (5 of the list, plus the bonus):**
1. **Chart hover crosshair tooltip (keyboard-accessible)** — `SlaChart.tsx`. Mouse-move over the SVG and a row of per-point focusable buttons both drive a shared `activeIndex`, drawing a crosshair line + dot and an ARIA `role="tooltip"` box; endpoint value and a live trend stat stay visible without any hover (completeness-bar "persistent value" rule).
2. **Real sort/filter on the case rail** — `CaseRail.tsx`. A segmented Priority/Age sort plus a status filter dropdown (`All/Open/Pending/Resolved`) both recompute the rendered list via `useMemo`.
3. **Period + tab view toggles** — `SlaChart.tsx` (7D/30D/90D segmented control swaps the plotted series) and `CaseDetail.tsx` (Timeline/Notes/Activity tablist with roving tabindex + arrow-key navigation).
4. **Selection → multi-widget sync, split into two real propagation paths** — clicking a rail row **pins** it (persistent `pinnedId` state lifted to `Console.tsx`), which re-renders the entire detail workspace (timeline, customer panel, SLA chart, related-cases table) and is surfaced as a visible, changeable UI element: a teal "Pinned" chip + filled pin icon on the rail row, and a matching "Pinned to this view" label in the detail header. Separately, **hovering** (or keyboard-focusing) a row that is *not* pinned arms a 120ms-debounced, fully local, ephemeral preview tooltip (`CaseRail.tsx`'s own `previewId` state — never touches the detail pane) that reverts on mouse-leave/blur. Two distinct state machines from the same rail, not one prop threaded to both.
5. **⌘K command palette (bonus)** — `CommandPalette.tsx`. Global `metaKey/ctrlKey+K` listener, combobox pattern (`aria-activedescendant`, arrow keys, Enter to commit), filters by subject/customer/case ID, and commits into the same `pinnedId` persistent path as a rail click.

Beyond the minimum: Resolve/Reopen, Escalate, and Assign are wired to real immutable state updates on the live `cases` array (rail badges and KPIs update in the same render), Resolve/Close routes through a real confirmation dialog, and the Timeline tab has a working reply composer that appends a new timeline entry.

**Typography:** Pretendard only (`font-sans`, inherited from the global body rule) — no `--font-display-*` variable is referenced anywhere in this candidate. Numbers/IDs/currency use `tabular-nums`; case IDs additionally use `font-mono` (the whitelisted system-mono stack, not a display face).

**Theme/accent:** Light only (`white`/`zinc-50` canvas, `zinc-200` hairlines, `shadow-sm` cards). Accent = teal (`teal-600/700/800`), chosen to sidestep this round's violet/indigo/rose/amber saturation.

## 브리프에 없던 것

- **① 정확히 무엇을 정해야 했는가:** 브랜드명·제품 아이덴티티.
  **② 무엇으로 정했는가:** "Harborline" (앵커/항구 모티프의 지원 콘솔).
  **③ 근거:** 브리프가 "generic support/ops tool, not repick"만 요구했으므로, 배정된 teal 악센트와 어울리는 항해/정박 은유를 골라 lucide의 `Anchor` 아이콘을 브랜드 마크로 그대로 재사용할 수 있게 했다(자의적 선택, 다만 아이콘 세트 제약과 맞물린 실용적 근거).

- **① 사이드바/레일의 정확한 픽셀 폭:** 브리프는 "roughly 320–380px" 레일과 "comfortable width" 사이드바만 지정.
  **② 정한 값:** 사이드바 256px(`w-64`), 레일 344px.
  **③ 근거:** Linear/Notion류 SaaS 셸의 관용적 사이드바 폭(240–260px)을 차용했고, 레일은 브리프가 준 범위의 중간값을 택해 1280px 폭에서도 detail 쪽에 넉넉한 여유가 남도록 역산했다.

- **① KPI 스트립을 넣을지 여부:** 마스터-디테일 아키타입 자체는 KPI 행을 요구하지 않음.
  **② 정한 것:** 화면 상단에 Open/Pending/SLA breached/Avg first response 4-up 카드 추가.
  **③ 근거:** completeness bar가 별도로 "4-up KPI row only from xl:" 패턴과 "explicit 12-col grid"를 요구하고 있어, "SaaS(General)/Analytics Dashboard" 카탈로그 컨벤션을 그대로 얹어 두 요구를 동시에 충족시켰다.

- **① 탭 구성(Timeline/Notes/Activity)의 명칭과 개수:** 브리프는 "timeline of events/messages"만 명시.
  **② 정한 것:** Zendesk/Intercom식 3분류(Timeline·Notes·Activity)로 확장.
  **③ 근거:** 실제 헬프데스크 제품들의 표준 스키마(고객 메시지 vs 내부 메모 vs 감사 로그)를 그대로 참조 — "production SaaS polish" 기준(Mercury/Asana류)에 맞추기 위함.

- **① 호버 프리뷰의 위치·트리거 방식:** 브리프는 "near the cursor"라고만 명시.
  **② 정한 것:** 커서 좌표를 실시간 추적하는 대신, 호버/포커스된 행 오른쪽에 고정 앵커된 카드(120ms 디바운스).
  **③ 근거:** Linear의 이슈 리스트 호버 피크 패턴을 참조 — 마우스 좌표를 매 프레임 재계산하는 것보다 접근성(키보드 포커스로도 동일하게 트리거)과 안정성이 높다는 실용적 판단.

- **① "destructive confirmation"을 어떤 액션에 걸지:** 브리프는 일반 원칙만 제시.
  **② 정한 것:** Resolve/Close case만 확인 다이얼로그를 거치고, Escalate·Assign은 즉시 반영.
  **③ 근거:** 상태를 종료시키는 동작(케이스 종결)만 되돌리기 번거롭다고 보고, 나머지는 몇 번이든 되돌릴 수 있는 가역적 토글로 분류 — 가이드라인의 "destructive-action confirmation dialog" 문구를 액션의 가역성 기준으로 해석.

- **① SLA 차트가 케이스별 데이터인지 팀 전체 데이터인지:** 브리프는 "SLA response-time trend chart"라고만 지정.
  **② 정한 것:** 핀된 케이스의 큐(queue) 응답시간 추이로 스코프를 좁혀, 케이스를 바꿀 때마다 차트도 함께 바뀌게 함.
  **③ 근거:** 셀렉션→멀티위젯 동기화 요구사항(④)을 차트에도 실질적으로 반영하기 위한 자의적 스코프 선택 — 정적 위젯이 아니라 진짜로 선택에 반응하게 만드는 쪽을 택했다.

- **① 고객사 이니셜 아바타 vs 상담원 사진 아바타를 나눌지:** 브리프는 "avatar cells"만 요구.
  **② 정한 것:** 내부 상담원 3명만 Unsplash 사진, 고객/요청자는 색상 이니셜 아바타.
  **③ 근거:** 실제 CRM 연동 헬프데스크에서 고객 사진은 보통 없고 직원 사진만 확보되는 것이 통상적이라는 도메인 관례를 참조.
