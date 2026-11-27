Check string: "Seller Reputation Tier"

# Candidate c — Seller Reputation Tier

`native/src/evolve/r44/c/SellerBadgeTrackerScreen.tsx` (default export) +
`native/src/evolve/r44/c/data.ts` + `native/src/evolve/r44/c/components.tsx`

## Concept

A read-only, seller-side reputation record screen — not a buyer-facing paid
tier picker (`membership-tiers`) and not a points ledger/transaction history
(`loyalty-points`): nothing on this screen is purchasable and nothing is a
transaction log. The summary header (above the grid) shows the seller's
current tier name/level inside a card outlined in the single indigo accent
(`tokens.color.accent` — the brief's suggested accent use), a progress bar
filled in that same accent toward the next tier, and a "pts to next tier"
line plus an earned-badge count. Below that, the macro layout is a
grid-first `FlatList numColumns={2}` of 10 deterministic achievement badges
(6 earned, 4 locked), not the sticky-header+rail-of-rows shape used
elsewhere in this catalog. Earned badges render as a solid `ink`-filled icon
circle; locked badges desaturate to `border`/`faint` tones (no new hex) and
each carries its own explicit unlock requirement as plain text, so lock
state is never color-only.

Band mechanic: per GENERATION.md §3's read-only-record carve-out, this
screen has no blocked workflow to unblock, so there is no
`statusFor()`/`jumpTo()` state machine and no `bandBlocked*`/`bandReady*`
family. The bottom bar (`ActionBar`, styles rooted at `actionBar*` — no
shared key names with any blocked-band screen) is always mounted and does
one genuinely working thing: "View All Perks" toggles an already-mounted
`TierPerksSection` (the `FlatList`'s `ListFooterComponent`) from
"your current tier only" to "the full 4-tier perk ladder, future tiers
visibly dimmed," then scrolls the list to it with
`scrollToEnd({animated:true})` inside `requestAnimationFrame`. Pressing it
again collapses the section back — a real, reversible UI state change, not
a no-op or dead link. The toggle also updates one `accessibilityLiveRegion
="polite"` region's `alert` text ("Showing perks for every tier." /
"Showing only your current tier's perks.") — not mechanically required for
a static record screen per the brief, but included because this one control
does cause a real on-screen content change worth announcing.

No wrapper has `accessible={true}`; badge grid cells contain no nested
`Pressable` at all (they are plain record cells, not controls), so the
hazard the spec warns about does not arise. The `ActionBar`'s
`accessibilityHint` is conditional on `expanded` so it only ever describes
the action that press will actually perform, never the opposite one. All
tier names, points, badge requirements and perk text are literals in
`data.ts`; no `Math.random`, no bare `Date.now()`/`new Date()`.

## 브리프에 없던 것

1. **① 리더보드/티어 체계에 들어갈 실제 이름.** ② "Starter / Rising Seller /
   Trusted Seller / Elite Seller" 4단계로 정함. ③ `membership-tiers`가 이미
   구매형 플랜에 "Gold/Silver/Bronze" 류 네이밍을 쓸 가능성이 있어, 판매자
   평판 트랙은 의도적으로 금속 등급명을 피하고 역할 기반 이름으로 분리했다.

2. **① "포인트"를 무엇으로 부를지 — `loyalty-points` 화면의 적립금과 혼동
   않게.** ② 화면 카피에서 그냥 "pts"/"points"로만 쓰고 "reputation score"
   임을 헤딩("Seller Reputation Tier")으로 맥락화했다. ③ 브리프가 "구매 불가·
   거래 로그 아님"을 명시했으므로, 별도 전용 명사를 새로 만들기보다 기존
   `loyalty-points` 화면과 레이아웃(원장/내역)이 다르다는 점으로 구분이
   충분하다고 판단.

3. **① 뱃지 그리드 셀이 탭 가능해야 하는지.** ② 탭 불가, 순수 기록 카드로
   결정(내부에 `Pressable` 없음). ③ 도메인 자체가 "read-only record" —
   브리프가 명시한 분류 — 이고, 뱃지를 눌렀을 때 보여줄 추가 상세 화면이
   정의돼 있지 않아 가짜 인터랙션(no-op)을 만들지 않기 위해 처음부터
   비대화형으로 설계.

4. **① 하단 액션바를 둘지, 두면 어떤 동작을 시킬지.** ② "View All Perks"가
   이미 마운트된 perks 섹션을 확장 + 스크롤하는 토글로 결정. ③ GENERATION.md
   §3이 read-only 기록 화면의 밴드는 "상시 노출 액션바(눌리면 실제 결과를
   내는 진짜 액션)"여야 한다고 명시했고, 과제 설명에 예시로 든 "View All
   Perks가 이미 렌더된 perks 섹션을 펼치고 스크롤" 패턴을 그대로 구현하는 것이
   가장 안전하고 검증된 선택이었다.

5. **① 티어 사다리 전체(4단계)를 접힌 상태에서도 다 보여줄지, 현재 티어만
   보여줄지.** ② 접힌 기본 상태는 현재 티어 혜택만, 펼치면 전체 사다리(미래
   티어는 dim 처리)로 결정. ③ 접힌 상태에서 전체를 다 보여주면 "View All
   Perks" 버튼이 할 일이 없어져 버튼이 no-op처럼 보일 위험이 있었다 — 버튼이
   실제로 콘텐츠를 더 드러내야 "진짜 액션"이라는 §3 기준을 만족시키기
   위함이다.
