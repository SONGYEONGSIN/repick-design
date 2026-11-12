# Candidate b — Gear Swap Terms

**Concept (one line):** A per-field, two-party negotiation screen for a camera trade where each of four swap terms (cash top-up, pickup method, pickup window, included extras) independently shows your proposed value vs. the other party's last counter, with accept/counter buttons per field and a bottom band that surfaces the next unresolved term — only fully agreed once all four are accepted by both sides.

- Screen: `GearSwapTermsScreen`
- Check-string heading: **"Gear Swap Terms"** (always-visible `<Text accessibilityRole="header">` at the top of the screen, not conditional on any state)
- Files: `native/src/evolve/r55/b/GearSwapTermsScreen.tsx`, `native/src/evolve/r55/b/data.ts`

## 브리프에 없던 것

1. **구체적 네고 도메인**
   - 결정 필요: 브리프는 "price AND pickup method AND timing" 같은 예시만 주고 실제 아이템/카운터파트는 미지정.
   - 결정: 카메라 기어 스왑("Canon EOS M50" ↔ "Sony ZV-1")으로, 네고 대상은 Cash Top-up / Pickup Method / Pickup Window / Included Extras 4개 필드.
   - 근거: dedup 목록의 "Propose an Item Swap"(단일 스왑 제안)과 "Bundle Deal Builder"(번들 구성 도구)와 구조적으로 겹치지 않도록 임의 선택. 둘 다 "필드별 양측 상태"를 다루지 않음.

2. **필드 값 편집 방식 (freeform text 없음)**
   - 결정 필요: 각 필드의 "counter" 액션이 실제로 값을 어떻게 바꾸는지 브리프에 미지정.
   - 결정: 필드마다 고정된 preset 값 배열(예: Cash Top-up = ["$0","$10","$20","$30","$40"])을 두고, Counter를 누르면 다음 preset으로 순환(상대 값과 겹치지 않게 skip).
   - 근거: TextInput 미사용 → 결정론(data.ts에 고정 literal) 유지가 쉽고, 타입 안전성도 보장. RN에 숫자 입력 컴포넌트가 따로 지정되지 않았으므로 가장 단순하고 테스트 가능한 방식을 임의로 선택.

3. **"다음 미해결 필드" 우선순위**
   - 결정 필요: bottom band가 agreed가 아닌 필드 중 어떤 걸 먼저 가리켜야 하는지 미지정.
   - 결정: "당신 차례(awaiting_you, 상대가 카운터해서 내 응답 필요)"를 "상대 응답 대기(awaiting_them)"보다 우선 노출.
   - 근거: 사용자가 지금 당장 행동할 수 있는 항목을 먼저 보여주는 것이 UX 상 합리적이라는 일반 원칙(단순 배열 순서가 아니라 행동 가능성 기준) — 임의 결정이지만 의도적.

4. **Reopen(재협상) 메커니즘과 UI**
   - 결정 필요: Open delta #2는 "이미 agreed인 필드를 되돌릴 수 있어야 하고, 그때 band는 항상 fresh하게 재계산돼야 한다"만 요구. 되돌리는 구체적 인터랙션은 미지정.
   - 결정: agreed 카드에 작은 텍스트 링크 "Reopen this term"을 추가. 누르면 당신 값만 다음 preset으로 순환 + status를 `awaiting_them`으로 전환 (상대방 값은 "직전 합의값"으로 유지).
   - 근거: 별도 지정이 없어 임의 선택. agreedCount/allAgreed/nextField를 전부 렌더마다 `fields` state에서 다시 계산(메모 없음)하도록 구현해 delta #2를 직접 만족시킴.

5. **"Cancel negotiation" 배치와 밴드 전환**
   - 결정 필요: DNA 접근성 규칙은 파괴적 액션에 confirm-step이 필요하다고 하지만, 어디에 둘지는 미지정. Open delta #1은 "두 밴드 형태를 결합할 경우 서로 배타적이게" 만들라고만 함.
   - 결정: Cancel 링크를 summary band 안에 넣고, 누르면 **같은 밴드 컨테이너**가 Cancel/Confirm 2버튼 상태로 flip. `phase`/`cancelPending`/`finalizedAcknowledged`를 하나의 파생 `bandMode` 값으로 합쳐서 summary/cancelConfirm/finalized/none이 항상 상호 배타적이 되게 구현.
   - 근거: 브리프의 open delta #1 예시("a selection-driven bar that then flips into a destructive-confirm")를 거의 그대로 재사용한 임의 선택.

6. **Finalize 이후 화면 상태**
   - 결정 필요: "fully agreed" 상태까지만 브리프가 다루고, 그다음(확정/취소) UI는 미지정.
   - 결정: 모든 필드가 agreed면 band에 "Finalize Swap" 버튼이 나타나고, 누르면 `phase='finalized'`로 전환해 각 필드의 최종 합의값을 recap 카드로 보여줌. "Done" 버튼으로 성공 밴드를 닫을 수 있음(로컬 state만 변경, 실제 동작).
   - 근거: 일반적인 체크아웃/완료 플로우 관행 차용 — 임의 결정이나 "모든 컨트롤이 실제로 뭔가 한다"는 요구를 만족시키기 위함.

7. **"jump to next unresolved" 구현 메커니즘**
   - 결정 필요: "jumps to the next unresolved point"만 요구되고 구체적 메커니즘 미지정.
   - 결정: `ScrollView` ref + 각 카드의 `onLayout`으로 y좌표를 저장해두고, band의 "Review" 버튼을 누르면 해당 좌표로 `scrollTo` + 1.6초간 테두리 하이라이트.
   - 근거: FlatList 대신 고정 소수 리스트를 직접 렌더링하는 것이 규칙에서 허용되어 있어([Sev medium 예외]), 그에 맞는 가장 단순한 스크롤 방식을 임의로 선택. 하이라이트는 보조 시각효과일 뿐이고 상태 의미는 텍스트 배지로만 전달(색상 단독 의존 금지 규칙 준수).

8. **Check-string 헤딩 문자열**
   - 결정 필요: "always-visible unique heading" 요구만 있고 정확한 문자열은 미지정.
   - 결정: "Gear Swap Terms"로 임의 결정 (화면명과 동일).
   - 근거: 게이트가 찾을 정확한 문자열이 필요하다는 요구를 만족시키기 위한 임의 선택.
