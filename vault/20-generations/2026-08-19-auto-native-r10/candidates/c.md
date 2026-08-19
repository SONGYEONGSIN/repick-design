# auto-native-r10 · candidate c — Report Listing / User

`evolve-r10-c` is a trust & safety report screen, a domain no prior round has touched.
Opened from a listing detail page, so a single read-only target card carries both
identities the report can be about — the listing (thumbnail, price, category) and its
seller (name, handle, rating) — instead of a listing/user toggle, which would read as a
tab switch (the exact shape r8's rejected profile-header/tabs candidate used). Below the
target card sits a vertical single-select reason list (radio rows with a helper line
under each label, not the horizontal reason-chip row disputes/r7 used for its own
single-select), a reason==="other"-gated free-text field with an always-visible label, a
static "what happens next" privacy/irreversibility notice, and a fixed bottom band. The
band is a genuine state machine per GENERATION.md §3/§4 because submitting a report is a
real terminal action: blocked names its blocker in a sentence and, tapped, scrolls to and
(for the text field) focuses the unfinished input; ready submits; submitted is a static
confirmation. Blocked and submitted messages carry `accessibilityRole="alert"` inside the
band's one `accessibilityLiveRegion="polite"` container — ready does not, matching the
established r5/r6c/r7/r8 convention of only alerting on messages that change
reachability. No confirm dialog (a report isn't a destructive delete), but both the
band's ready hint and the submitted confirmation state in words that submitting can't be
undone. Macro shape is otherwise a flat non-collapsing scroll form, distinct from every
recent skeleton: no accordion (r6), no FlatList-timeline+band (r7), no multi-step wizard
(r8), no header+tabs+dual-body (r8, rejected), no chrome-0 grid (r9).

## 브리프에 없던 것

1. ① 브리프 제목이 "Report Listing / User" 두 대상을 함께 지칭하는데, 실제 화면을 하나(리스팅
   신고)로 할지 대상 전환 UI를 넣을지 정해야 했다. ② 리스팅 상세에서 진입한다고 전제하고, 신고
   사유 목록 자체에 리스팅 품질 사유(가품 의심·부적절한 사진)와 판매자 행동 사유(사기 시도·연락
   두절)를 함께 담아 대상 카드 하나가 양쪽 정체성을 동시에 보여주게 했다. ③ 별도 토글/탭을
   넣으면 r8에서 이미 탈락한 "헤더+탭전환+이원바디" 골격을 사실상 재현하게 되고, 실제 마켓플레이스
   신고 시트도 리스팅과 판매자 사유를 한 목록에서 고르게 하는 쪽이 흔한 패턴이라 더 간단하고
   골격도 더 달라진다.

2. ① 하단 밴드의 "차단 지점으로 이동" 인터랙션을 어떤 메커니즘으로 만들지가 브리프에 없었다 —
   기존 화면들(disputes·listing)은 FlatList의 `scrollToIndex`를 썼지만 이 화면은 항목이 4~5개뿐인
   플랫 폼이라 FlatList가 아니다. ② 일반 `ScrollView` + 각 섹션에 `onLayout`으로 y좌표를 기록해
   두고 밴드 press 시 `scrollTo({y})`로 이동, "기타" 필드가 타깃이면 추가로 `TextInput.focus()`까지
   호출하도록 했다. ③ ScrollView에는 `scrollToIndex`가 없으니 좌표 기반 스크롤이 유일한 정공법이고,
   텍스트 필드는 스크롤만으로는 커서가 안 잡히므로 focus 호출을 더해야 "미완료 지점으로 포커스
   이동"이라는 브리프 요구를 글자 그대로 만족시킨다.

3. ① 차단된 섹션을 시각적으로 강조할 방법이 브리프에 없었고, disputes가 쓴 방식(테두리 폭을
   1→1.5로 키우며 패딩을 0.5만큼 줄여 박스 크기를 거의 고정)을 그대로 재현할지, 배경색으로 강조할지
   골라야 했다. ② disputes와 같은 "테두리만 accent로 바꾸고 패딩을 미세 보정" 방식을 택하고, 배경
   틴트는 쓰지 않았다. ③ tokens.ts에는 강조용 배경 틴트 색이 없고(라운드 중 정본 수정 금지), 새
   hex를 하드코딩하면 색 금지 규칙을 어기게 된다 — 이미 검증된 테두리 강조 패턴을 그대로 재사용하는
   쪽이 팔레트 제약 안에서 가장 안전했다.

4. ① "기타" 사유를 골랐을 때 최소 글자 수를 얼마로 할지 브리프에 없었다. ② `data.ts`에
   `OTHER_DETAILS_MIN_LENGTH = 10`, `OTHER_DETAILS_MAX_LENGTH = 280`을 고정 상수로 두고 밴드 차단
   메시지가 "Add N more characters…" 형태로 부족분을 정확히 말하게 했다. ③ 0자 허용은 사실상
   빈 신고를 통과시켜 "기타"를 고른 의미가 없어지고, 너무 높은 하한(예: 50자 이상)은 짧지만 유효한
   상황 설명("Paid outside the app, no delivery")까지 차단한다 — review 화면의 별점 필수 규칙과
   같은 강도로, 실제로 심사에 필요한 최소 정보량만 요구하는 값을 택했다.
