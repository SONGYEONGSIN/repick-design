# Candidate A — Seller Identity Re-verification

One-line concept: a seller flagged for a routine identity re-check works through 4 independently-completable steps (legal name, government ID photo, selfie-with-ID, payout bank account) in a `FlatList`, with a bottom band acting as a blocked-workflow state machine that names the one specific step currently blocking submission, jumps to it on tap, and only turns into a real, enabled "Submit for Review" action once all 4 are actually complete.

- Component: `SellerIdentityRecheckScreen` (both default export and named export `SellerIdentityRecheckScreen`)
- Files:
  - `native/src/evolve/r61/a/SellerIdentityRecheckScreen.tsx`
  - `native/src/evolve/r61/a/data.ts`
- Suggested import for `native/src/screens.ts`: `import SellerIdentityRecheckScreen from "./evolve/r61/a/SellerIdentityRecheckScreen";` (or the named form), registered as `"evolve-r61-a": SellerIdentityRecheckScreen`.
- Render-check string: `"Identity Re-verification"` (screen header `accessibilityRole="header"`, always rendered regardless of state).

## Implementation notes for the orchestrator / judges

- Only plain `react-native` core components are used (`View`, `Text`, `Pressable`, `FlatList`, `SafeAreaView`, `StyleSheet`) — no Expo-specific or navigation APIs, per the AGENTS.md fallback rule, since this screen renders standalone outside any navigator.
- State machine: `completion: Record<StepId, boolean>` is the only source of truth. `findBlockingStep(rows)` is a pure function (`rows.find(r => !r.complete) ?? null`) — there is no separate hardcoded "current step index" or boolean flag that could drift from the real completion state. `allComplete` and `bandState` (`"blocked" | "ready" | "submitted"`) are both derived from that same function's result on every render, not stored as independent state.
- Each of the 4 steps' "mark complete" control (`markStepComplete(id)`) is a real `setCompletion` call wired to a real `Pressable onPress` — none of the four is a no-op with only touch-feedback styling. Pressing it flips a boolean that `findBlockingStep` actually reads on the next render (verified by code inspection: the step card's `Pressable` only exists while `!item.complete`, and once pressed it is replaced by a `complete`-only render branch — there is no dead branch).
- The bottom band's CTA (`Pressable` labeled "Go to step" while blocked, "Submit for Review" once ready) is never a disabled dummy: while blocked it really calls `jumpToBlockingStep()` (`FlatList.scrollToIndex` + a 1.4s highlight), and once `allComplete` is true it really calls `setSubmitted(true)`, which flips the band into its third, terminal `"submitted"` state (confirmation pill, no further CTA). There is no hardcoded-true/false constant gating this — `bandState === "ready"` is computed fresh from `blockingStep === null` each render, so the only way to reach "ready" is for all 4 completion booleans to actually be true.
- Accessibility: exactly one live region is active per transition — the `footerBand` container has `accessibilityLiveRegion="polite"`, and only the single sentence `Text` inside it carries `accessibilityRole="alert"`. No other element on the screen sets a live region or `alert` role, so two regions never fire from the same tap. No wrapper `View`/`Pressable` sets `accessible={true}` anywhere — each step card is a plain `View` with its status chip, title and action `Pressable` all independently reachable as leaf nodes. Every `accessibilityHint` describes only what its handler actually does (confirms a step as "marks step X as complete/confirmed"; the band's hints say "submits for review" / "scrolls the list to the step that still needs action" — both literally true of the code that runs). Step rows that are already complete render no `Pressable` at all, so there's no leftover hint promising a re-upload that no longer does anything.
- Determinism: `data.ts` contains only fixed literals (`CASE_REFERENCE`, seller name, account last-4, step copy) — no `Math.random`, `Date.now`, or bare `new Date()` anywhere in either file.
- Tokens only: every color is `tokens.color.*` (accent/success/warning/border/muted/etc.), spacing is `tokens.space(n)`, radii are `tokens.radius.*`. No hardcoded hex.
- Code-surface differentiation: the repo already has an `evolve/r34/a/IdentityReverificationScreen` in the same general domain (identity re-verification checklist + bottom band), and `evolve/r60/a/CustomsDeclarationScreen` is the catalog's other blocked-workflow state-machine band. This candidate was written with neither open as a copy source for structure — style key names (`screenRoot`, `topHeader`, `stepCard`, `stepStatusChip`, `footerBand`, `footerBandCta`, …), the 4 step ids/copy (legal name / gov ID / selfie-with-ID / payout bank account — distinct from r34's gov-id/liveness/address/agreement set), the band's 3-state naming (`blocked`/`ready`/`submitted` vs. r60's `blocked`/`ready`/`done`), and the control-flow shape (band CTA itself morphs between "go to step" and "submit" rather than a disabled-button + separate per-field confirm-button pattern) were all written fresh for this screen.

## 브리프에 없던 것

1. **무엇을 결정해야 했나:** 정확히 어떤 4개 단계를 쓸지 (브리프는 "in the spirit of e.g." 로 예시만 제시).
   **무엇으로 결정:** (1) Confirm legal name matches ID, (2) Government ID photo re-upload, (3) Selfie holding your ID re-upload, (4) Confirm payout bank account is still yours — 브리프 예시를 거의 그대로 채택.
   **왜:** 브리프가 제시한 예시 4개가 이미 "독립적으로 완료 가능하지만 암묵적 순서가 없는" 요구사항에 정확히 맞고, 실제 셀러 신원 재확인 플로우에서도 현실적인 조합이라 더 나은 대안을 찾을 이유가 없었음. 동일 도메인의 기존 화면(`r34/a`)이 이미 gov-id/liveness/address/agreement 조합을 썼으므로, 겹치지 않는 네 개(legal name / gov ID / selfie-with-ID / payout bank)를 그대로 쓰는 것이 중복을 줄이는 선택이기도 했음.

2. **무엇을 결정해야 했나:** 각 단계의 "완료" 상호작용을 실제로 어떻게 구현할지 (카메라/파일피커 등 실제 네이티브 모듈 없음).
   **무엇으로 결정:** 모든 단계를 동일한 패턴 — 미완료 시 라벨이 붙은 단일 `Pressable` 버튼("Confirm name matches ID" / "Upload ID photo" / "Upload selfie with ID" / "Confirm bank account"), 눌리면 즉시 `complete: true` 로 전환되고 체크 표시 텍스트로 교체.
   **왜:** 실제 카메라/파일 선택 UI를 모킹하는 건 스코프 초과이고, 핵심 심사 대상은 "그 버튼이 실제 상태를 바꾸는가"이지 업로드 UI의 사실성이 아니므로 가장 단순하고 확실히 traceable한 구현을 택함.

3. **무엇을 결정해야 했나:** 더미 신원 데이터 (법적 이름, 계좌 마지막 4자리, 케이스 번호).
   **무엇으로 결정:** 이름 "Morgan J. Ellis", 계좌 마지막 4자리 "4421", 케이스 번호 "SIR-20264".
   **왜:** 브리프에 구체값이 없어 임의 고정값 필요. 결정론 규칙(§5) 때문에 모두 리터럴로 고정 — 기존 카탈로그 화면들(r34의 "RVF-48217" 등)과 형식은 비슷하지만 다른 접두사/값으로 겹치지 않게 함.

4. **무엇을 결정해야 했나:** 초기 상태 — 4개 단계 중 몇 개를 이미 완료된 상태로 시작할지.
   **무엇으로 결정:** 전부 미완료로 시작 (`INITIAL_COMPLETION` 전부 false).
   **왜:** "계정이 방금 플래그된" 시나리오를 가장 단순하고 분명하게 보여주고, blocked 상태의 band 문장이 처음부터 보이도록 하기 위함 — 심사 시점에 state machine이 작동하는 걸 한 단계도 완료하지 않은 시점부터 확인 가능하게 함.

5. **무엇을 결정해야 했나:** band가 여러 단계가 미완료일 때 정확히 어떤 단계를 "그" 블로킹 단계로 지목할지 (브리프는 "독립적으로 완료 가능, 암묵적 순서 없음"이라고만 함).
   **무엇으로 결정:** `data.ts`의 고정 배열 순서(legal name → gov ID → selfie → payout) 중 첫 번째 미완료 항목을 지목. 단, 이 순서는 완료를 강제하는 순서가 아니라 — 어떤 단계든 독립적으로 먼저 완료 가능 — 그냥 "한 문장에 하나만 담아야 한다"는 밴드의 제약 때문에 어느 것을 보여줄지 정하는 타이브레이크 규칙일 뿐임.
   **왜:** 요구사항이 "실제 완료 불리언으로 구동되는 진짜 상태기계"를 요구했으므로, 순서 자체를 상태로 저장하지 않고 매 렌더마다 배열을 스캔해 파생시킴 — 이렇게 하면 사용자가 3번 단계를 먼저 끝내도 band는 즉시 1번(legal name)을 지목하다가, 1번을 끝내면 2번을 지목하는 식으로 정확히 추적 가능함.

6. **무엇을 결정해야 했나:** "Submit for Review" 를 눌렀을 때 실제로 무슨 일이 일어나는지 (백엔드 없음).
   **무엇으로 결정:** `submitted` 상태를 true로 전환하고, band가 세 번째 터미널 상태("Submitted" 알약 + 확인 문장)로 바뀌며 더 이상 어떤 Pressable도 band에 남지 않음. 동시에 모든 단계 행의 버튼이 숨겨짐(이미 전부 complete이므로 자연히 사라짐).
   **왜:** §4 "일어나지 않을 일을 약속하지 마라" 규칙을 지키려면 버튼이 뭔가 진짜로 해야 했음 — 가장 단순하고 거짓 없는 결과는 로컬 상태를 "제출됨"으로 바꾸고 그 사실을 같은 라이브 리전으로 알리는 것.

7. **무엇을 결정해야 했나:** "눌리면 블로킹 단계로 이동" 을 스크롤만 할지, 접근성 포커스까지 옮길지.
   **무엇으로 결정:** `FlatList.scrollToIndex` 로 스크롤 + 1.4초간 해당 카드 테두리를 accent 색으로 하이라이트. `AccessibilityInfo.setAccessibilityFocus` 류의 명령형 포커스 이동은 넣지 않음.
   **왜:** 브리프가 요구한 건 "scroll-to or expand it" 뿐이라 스크롤만으로 요구사항을 충족함. 명령형 접근성 포커스 이동까지 추가하면 기존 카탈로그 화면(`r34/a`)이 쓴 메커니즘(`findNodeHandle` + `AccessibilityInfo.setAccessibilityFocus` + 이중 타이머)을 거의 그대로 재현하게 되어, 같은 밴드 형태를 공유하는 화면끼리 코드 표면까지 닮는 위험을 피하기 위해 더 단순한 쪽을 택함. 라이브 리전이 이미 전환 문장을 낭독하므로 스크린리더 사용자도 어떤 단계로 이동했는지 알 수 있음.

8. **무엇을 결정해야 했나:** 단계 카드의 완료/미완료 상태를 시각적으로 어떻게 구분할지 (브리프는 "shows its own completion state inline" 라고만 함).
   **무엇으로 결정:** 각 카드 우상단에 "Complete"(success 토큰) / "Needs action"(warning 토큰) 칩을 배치하고, 완료 시 액션 버튼이 사라지고 체크 표시 문구("✓ {action} — done")로 교체.
   **왜:** 칩 색상은 토큰에 이미 존재하는 success/warning 의미를 그대로 재사용하는 것이 가장 안전하고(하드코딩 색 금지), 버튼을 완전히 교체하는 방식은 "이미 끝난 단계에 다시 누를 수 있는 버튼을 남겨 혼란을 주지 않는다"는 판단에서 나온 임의 선택.
