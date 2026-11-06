# auto-native-r44 · candidate a — Authenticity Escalation Case

## Concept

A buyer who has already received an order and suspects the item is counterfeit opens this screen to build and file an **Authenticity Escalation Case** directly with repick's authentication team — distinct from `report-listing` (a pre-purchase policy flag against a live listing) and `report-buyer` (seller-side misconduct about a buyer's behavior), because this screen is anchored to one *completed order* and foregrounds that order's **prior repick authentication record**: in this data, the item was already certified by Repick Labs before it was listed (`certId: "RPK-00482"`), so the case the buyer is filing is a request to re-examine a result repick's own lab already signed off on — a sharper, more domain-specific stake than "report this listing." The macro layout is a single-focus `ScrollView` (order summary card → prior-authentication card → optional issue-area chips → evidence-photo grid → description text area → read-only submitted-case summary), justified in a code comment: this is a short, bounded record-building form, not a long virtualizable list, so `ScrollView` is correct and not a workaround. The band mechanic is the blocked/ready/done state machine required by the brief, implemented with this screen's own key family (`caseBand` / `caseBandLocked*` / `caseBandReady*` / `caseBandFiled*`) and its own copy, gated on exactly two requirements specific to "filing a case": at least one evidence photo AND a written description of what's wrong. Pressing the band while locked scrolls to whichever requirement is still unmet; once both are satisfied the same control reads "Submit for Review"; pressing it transitions the band to a filed confirmation (fixed case reference `ESC-48217`) and swaps the form body for a read-only case summary.

## Export

Named export `AuthenticityEscalationScreen` (also re-exported as the file's `default`) from `native/src/evolve/r44/a/AuthenticityEscalationScreen.tsx`. Dummy data lives in `native/src/evolve/r44/a/data.ts`.

**Render-check string**: `Authenticity Escalation Case` (the screen's main `accessibilityRole="header"` title, always on screen regardless of band stage).

## 브리프에 없던 것

1. ① 밴드 상태 머신의 구체적 트리거 두 가지 — ② "증거 사진 1장 이상" + "설명 20자 이상"(`MIN_PHOTOS=1`, `MIN_DESCRIPTION_LENGTH=20`)을 직접 정함 — ③ 브리프는 "사진 1장 AND 설명"만 못박았고 구체적 글자수 하한은 안 정해서, `disputes/DisputeCenterScreen.tsx`가 자유텍스트 필드에 명시적 최소 글자수(`MIN_DESCRIPTION_LENGTH`)를 쓰는 기존 관용구를 그대로 따 숫자만 이 도메인에 맞게 임의로 선택했다.
2. ① 사전 인증 기록(prior authentication record)의 상태값 — ② `"certified"`(사전에 Repick Labs가 인증해 리스팅됐던 아이템)로 정함, `"none"`이 아니라 — ③ 브리프가 "이력이 있을 수도 없을 수도"라고만 했는데, 이미 인증된 아이템이 위조로 의심받는 쪽이 서사적으로 더 날카롭고(자사 인증을 재검증 요청) 이 화면을 `certificate`/`authentication` 카탈로그 화면들과 의미 있게 연결하므로 임의로 더 강한 쪽을 선택.
3. ① 밴드가 잠겼을 때 "점프" 구현 방식 — ② `ScrollView.scrollTo` + 각 섹션의 `onLayout`으로 y좌표를 저장해 미해결 필드로 스크롤 — ③ 브리프/카탈로그의 기존 예시(`disputes/DisputeCenterScreen.tsx`)는 `FlatList.scrollToIndex`를 쓰지만 이 화면은 `FlatList`가 아니라 `ScrollView`라서 그 API가 없고, RN 관용구상 `ScrollView`에서 섹션으로 점프하는 표준 방법이 `onLayout` 캡처 + `scrollTo`라 그걸 채택.
4. ① 증거 사진 영역을 렌더하는 컴포넌트 선택 — ② `FlatList`를 쓰지 않고 평범한 `View` 행(row)으로 구현 — ③ 브리프가 "a few items... acceptable without FlatList"라고 명시적으로 허용했고, 이미 `disputes/DisputeCenterScreen.tsx`가 같은 선택을 한 전례가 있어 그 판단을 그대로 따름(단 스타일 키 이름은 전부 새로 지음: `evidenceRow`/`evidenceTile`/`evidenceAdd` 등).
5. ① 이슈 영역(issue-area) 칩을 단일선택이 아니라 다중선택으로 만들 것 — ② 체크박스(`accessibilityRole="checkbox"`, `Set<string>` 상태)로 구현, 라디오그룹이 아님 — ③ 브리프는 이 분류 자체를 요구하지 않았음(제출을 막지 않는 선택적 필드로 내가 추가); 위조 의심 항목은 보통 한 곳 이상(로고+스티칭 등)에서 동시에 발견되는 경우가 많다는 일반적 도메인 지식에 근거해 임의로 다중선택을 선택했고, `disputes`의 단일선택 라디오그룹과 상호작용 패턴을 다르게 해 코드 표면 중복도 줄였다.
