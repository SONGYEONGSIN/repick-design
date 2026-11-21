Check string: "Ended Listings"

# Candidate c — Ended Listings (Bulk Relist)

`native/src/evolve/r46/c/BulkRelistScreen.tsx` (named export `BulkRelistScreen`,
also the default export) + `native/src/evolve/r46/c/data.ts`

## Concept

A seller-side cleanup screen for listings of their own that ran out without
selling — either `Expired` or drew `No offers`. The screen is a single
`FlatList` of nine ended listings (title, original price, end reason badge,
a days-run meta line, and a text-mark thumbnail placeholder), each row one
leaf `Pressable` acting as its own checkbox (`accessibilityRole="checkbox"`,
`accessibilityState={{ checked }}`) — tapping anywhere on the row toggles it,
there is no drag-and-drop and no separate nested checkbox control.

Band mechanic: this is GENERATION.md §3's third band shape — a **selection-
derived contextual band**, not a blocked-workflow state machine and not an
always-on action bar for a read-only record screen. The bottom tray does not
exist in the tree at selection count 0; `pickedCount` is read directly off
`picked.size` (a `Set<string>`) every render, and `trayShown = pickedCount > 0`
is that derived boolean, not a separately-set flag anything could leave out
of sync with the actual selection. The tray's container carries
`accessibilityLiveRegion="polite"`, and its count line ("N items picked")
carries `accessibilityRole="alert"`. The primary action, "Relist N items",
is a real state transition: `relistPicked` filters the picked ids out of the
`pool` state (they leave the ended-listings list for good, standing in for
having moved to the seller's active inventory), increments a running
`relistedTotal` tally shown in the header, and clears `picked` — not a no-op
button.

Mutual exclusivity with an undo overlay: clearing `picked` inside
`relistPicked` makes `pickedCount` fall back to 0, which unmounts the tray in
the same state update that mounts the confirmation panel
(`!trayShown && confirmation`). The two bottom affordances are rendered from
mutually exclusive conditions, never together, so the screen never carries
more than one `accessibilityLiveRegion` at a time — whichever region is on
screen (the tray's count or the confirmation's sentence) is the only one, and
only its own alert text is marked `accessibilityRole="alert"`. The
confirmation panel is dismissed by an explicit "Done" button rather than a
timer, so it never races the tray or leaves two competing bottom bars visible
during a transition.

Naming was written fresh for this screen rather than reused from
`native/src/relist/BulkRelistScreen.tsx` (an existing bulk-relist screen in
this same catalog, discovered while reading the repo, that already uses a
selection-derived tray for a *different* action — price-drop/bump on aging-
but-still-live inventory, with its own undo bar). This candidate's state
names (`pool`, `picked`, `pickedCount`, `trayShown`, `togglePick`,
`clearPicks`, `relistPicked`, `confirmation`, `relistedTotal`) and style keys
(`row`/`rowPicked`/`mark`/`markFilled`/`preview`/`reasonBadge`/`tray`/
`trayCountWrap`/`trayGhostButton`/`trayPrimaryButton`/`confirmPanel`/
`confirmDoneButton`, …) share no key names or copy with that screen's
(`items`/`selected`/`selectedCount`/`toggleSelect`/`clearSelection`/
`applyDropPrice`/`applyBump`/`undo`, `card`/`checkbox`/`bar`/`barCountWrap`/
`barButtonGhost`/`undoBar`, …) despite both being the same §3 band shape on
a bulk-relist-flavored seller screen; the domain (ended-and-eligible listings
being relisted outright, vs. live-and-aging listings being price-adjusted or
bumped) and every identifier were written independently for this candidate.

Copy is English-only throughout, including all nine dummy listings. Palette
stays near-monochrome with the single `tokens.color.accent` reserved for the
picked-row border/background, the checkmark fill, and the "Relist N items"
button; the end-reason badges use the existing `warning`/neutral tokens, not
a new color. No emoji — the checkmark is the plain "✓" glyph as a `<Text>`
leaf, matching this catalog's existing text-mark convention, not an icon
font (none is installed — checked `native/package.json` first). No wrapper
has `accessible={true}`; each row is a single `Pressable` leaf, so there is
no nested-interactive-under-accessible-wrapper risk to begin with. Prices use
`KRW 128,000` (Latin letters) rather than the `₩` glyph, sidestepping the
documented ₩/tabular-nums rendering question entirely. No `Math.random`,
`Date.now()`, or bare `new Date()` — all nine listings are fixed literals in
`data.ts`, and the running relisted tally is a deterministic counter derived
from actual selection sizes, not a random or time-based value.

## 브리프에 없던 것

1. **① 끝난 사유(end reason)의 범주를 몇 가지로, 어떤 이름으로 둘지** — 브리프는
   "Expired 같은 것, No offers 같은 것"이라는 예시만 줬다. ② `Expired`와
   `No offers` 두 가지로만 고정했다(세 번째 범주 — 예를 들어 "Buyer canceled" —
   는 넣지 않았다). ③ 두 사유만으로도 "시간이 다 됨" vs "관심이 없었음"이라는
   서로 다른 재상장 동기를 충분히 구분해 보여줄 수 있고, 범주를 늘릴수록
   `reasonBadge` 색상 분기(현재 `warning`/중립 토큰 두 가지)도 늘어나 토큰을
   추가해야 하는 압력이 생긴다 — 기존 팔레트 안에서 끝낼 수 있는 가장 단순한
   선택.

2. **① 전부 선택(select-all) 컨트롤을 둘지** — 9개 항목이면 사용자가 "전부
   재상장"을 원할 수도 있다. ② 두지 않았다. 한 줄씩 탭하는 것만 지원한다.
   ③ 전부-선택을 넣으려면 헤더 어딘가에 새 터치 타겟과 라벨("Select all" ↔
   "Clear all")이 필요해지고, 이미 트레이에 있는 "Clear" 버튼과 역할이 겹치는
   두 번째 전체-토글을 만드는 셈이다 — 선택-파생 밴드라는 형태 자체를 입증하는
   데는 행 단위 토글만으로 충분하다고 보고 범위를 좁혔다.

3. **① 재상장된 항목이 모두 사라져 리스트가 빈 상태가 됐을 때 무엇을 보여줄지**
   — 브리프는 끝난-목록 화면이라는 전제만 줬지 빈 상태를 명시하지 않았다.
   ② `FlatList`의 `ListEmptyComponent`로 "No ended listings right now."라는
   중립적인 문장을 두고, 헤더 부제도 `pool.length === 0`일 때
   "All caught up — every ended listing has been relisted."로 바뀌도록 했다.
   ③ 빈 배열에 아무 것도 렌더링하지 않으면 화면이 깨진 것처럼 보이고, 확인
   패널이 사라진 뒤에도 사용자가 "다 끝났다"는 것을 알 길이 없어진다 — 결정론
   규칙을 지키면서(고정 문자열) 실제로 전부 비울 수 있는 상태를 다루는 가장
   단순한 방법.

4. **① 확인 패널을 사라지게 하는 방식 — 타이머로 자동 소멸시킬지, 수동 버튼을
   둘지** — 브리프는 "성공 확인을 잠깐 보여준다"고만 했다. ② 타이머
   (`setTimeout`) 대신 "Done" 버튼으로 수동 해제하도록 했다. ③ 자동 소멸
   타이머는 트레이가 다시 나타나는 시점(사용자가 확인 패널이 떠 있는 동안 다른
   행을 다시 고르기 시작하는 경우)과 경합할 수 있어, 두 하단 표면이 동시에
   화면에 있으려는 짧은 순간을 만들 위험이 있다 — §3의 상호배타 요구를 코드로
   더 확실히 지키려면 전환을 사용자 입력으로만 트리거하는 쪽이 안전하다고
   판단했다.

5. **① 트레이에 "Clear" 보조 버튼을 둘지, 아니면 재상장 버튼 하나만 둘지** —
   브리프는 주 액션("Relist N items")만 명시했다. ② 선택을 모두 해제하는
   "Clear" 고스트 버튼을 추가했다. ③ 되돌릴 수 없는 재상장 액션 하나만 누를 수
   있는 유일한 하단 버튼이면, 실수로 고른 항목을 빼려는 사용자가 행을 하나씩
   다시 눌러야 한다 — 되돌릴 수 없는 액션일수록 선택 자체를 가볍게 철회할 수
   있는 길을 남겨두는 쪽이 사용자에게 공정하다고 판단했다(이 버튼은 되돌리기가
   아니라 아직 실행 전인 선택의 취소이므로 §3의 "사후 undo 오버레이와
   상호배타" 규칙과는 겹치지 않는다).
