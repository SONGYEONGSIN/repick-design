Check string: "Schedule Return Pickup"

# Candidate b — Doorstep Return Pickup Scheduling

`native/src/evolve/r44/b/ScheduleReturnPickupScreen.tsx` + `PickupWindowRow.tsx`
+ `data.ts`.

## Concept

Doorstep return pickup scheduling: a seller/returner who has an
already-approved return picks a courier time window for an at-home
collection, distinct from `pickup/ShipmentPickupScreen` (listing-side
scheduling for a NEW sale, gated behind a weight/carrier prerequisite chain)
and `evolve/r40/b/ReturnDropoffScreen` (browsing drop-off POINTS the buyer
travels to, nothing to confirm). The macro layout is a genuine `FlatList` of
interchangeable pickup-window rows — there is no multi-stage prerequisite
chain for this task, so the screen deliberately carries **no persistent
bottom band at all**; a sticky `ListHeaderComponent` (return order summary:
item, reason, deadline) stays pinned above the scrolling rows via
`stickyHeaderIndices={[0]}`. The interaction mechanic generalizes this
catalog's "turn the confirming surface itself into Cancel/Confirm, in place"
idiom one level further than its prior generalization
(`sessions/SessionRow.tsx`, a *destructive* per-row confirm that removes the
row after a timeout): tapping "Request pickup" on a row flips that row (and
only that row — one shared `(activeWindowId, activePhase)` pair in the
parent guarantees it) into a Cancel/Confirm pair; Confirm flips it into a
*persistent, non-destructive* "Pickup confirmed for `<date>, <time range>`"
state (checkmark + success-toned card) with a "Change" link that reopens the
pending-confirm pair — nothing is ever removed from the list. What's
genuinely new versus the catalog: the domain (nobody else schedules an
at-home courier collection for a *return*), and the row-level confirm state
shape itself (default → pending → **confirmed-and-staying**, rather than
default → confirming → removed).

Export: named export `ScheduleReturnPickupScreen` (also re-exported as
`default`) from `ScheduleReturnPickupScreen.tsx`.

## 브리프에 없던 것

① 다른 행이 "Request pickup" 되었을 때, 이전에 이미 **confirmed** 상태였던
행도 리셋해야 하는지, 아니면 pending 상태였던 행만 리셋해야 하는지.
② confirmed 행도 포함해 리셋하도록 결정 — 화면 전체에서 활성 슬롯을
`(activeWindowId, activePhase)` 단 하나로만 모델링했다.
③ 브리프 문구가 "any other row"라고 명시했고, 이 화면의 현실적 의미상 한
번에 예약 가능한 수거 시간은 하나뿐이어야 자연스럽다 — 두 개의 confirmed
행을 동시에 허용하면 "어느 쪽이 실제 예약인가"라는 새로운 모호성이 생긴다.

① confirmed 상태의 시각적 처리를 어떤 토큰 팔레트로 할지 — 밴드 전환에
흔히 쓰이던 ink/neutral 계열(세션 화면의 "Signed out")을 재사용할지, 다른
의미 토큰을 쓸지.
② `tokens.color.success`/`successBg`/`successBorder`를 썼다 — pending은
`accent` 테두리.
③ 이 액션은 파괴적이지 않고 긍정적 결과(예약 성공)이므로, 이미 토큰에
정의된 success 3종(배경/테두리/글자)을 "승인됨" 의미로 그대로 재사용하는
것이 근몰입-단일 액센트 DNA에 맞고, SessionRow의 중립색과도 시각적으로
구분돼 코드/디자인 표면 중복을 피한다.

① "sticky-ish 헤더"를 FlatList의 `ListHeaderComponent` 전체(화면 제목 +
리드 문구 + 주문 요약)로 할지, 주문 요약만으로 좁힐지.
② 화면 제목/리드 문구는 FlatList 바깥의 완전히 고정된 `View`에 두고,
`ListHeaderComponent`는 주문 요약 카드(+ 섹션 라벨)만 담아 `stickyHeaderIndices={[0]}`로 고정했다.
③ 제목까지 스크롤 중 계속 고정되면 화면 상단을 과도하게 많이 차지해
목록이 보여줄 수 있는 행 수가 줄어든다 — 브리프가 요구한 건 "주문 요약이
보이는 sticky 헤더"이지 전체 크롬 고정이 아니므로, 꼭 필요한 컨텍스트
(아이템/이유/마감일)만 끈끈하게 두는 쪽이 더 정직한 구현이라고 판단했다.

① 확정된 pickup을 다시 "Change"했을 때, pending 프롬프트 문구를 최초
요청 시와 동일하게 쓸지, "변경"을 명시하는 다른 문구로 분기할지.
② 동일한 pending 프롬프트 문구를 재사용했다 (최초 요청이든 재오픈이든
"Request a courier pickup for … ?").
③ 상태 기계 관점에서 pending은 confirmed로 가기 전의 단일 체크포인트이고,
그 지점에서 사용자가 보는 질문("이 시간대로 수거를 요청할까요?")은 최초
진입이든 Change를 통한 재진입이든 사실관계가 똑같다 — 문구를 분기하면
state 두 개를 사실상 네 개로 늘리는 불필요한 복잡도가 생긴다.
