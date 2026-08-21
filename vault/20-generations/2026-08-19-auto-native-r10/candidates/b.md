# auto-native-r10 · candidate b — Chat Inbox

`evolve-r10-b` is the messages list in front of the catalog's `offer-thread` — one row per
counterpart, no offer cards, no negotiation state — built as a single chrome-free FlatList
(title/tabs scroll away with the rows, matching the `notifications` precedent for a browse
screen with no terminal action, so no fixed bottom band). Each row carries an initials-monogram
avatar, name, the listing the thread is about, a one-line message preview, a relative time, and
an unread signal that is bold weight + a numeral badge + a dot together (never color alone).
Archive has two independent, both-functional paths: a real `PanResponder`+`Animated` swipe (RN
core only — no gesture-handler/reanimated is installed) that reveals a labelled action behind the
row, and an always-visible "More" press → inline Archive/Cancel sheet, which is the guaranteed
path for anyone who can't drag (the swipe backdrop is hidden from the accessibility tree on
purpose — see item 3). Archiving is reversible: an "Active"/"Archived" tab pair is seeded with one
thread already archived, so Unarchive is exercisable without requiring a prior Archive action
first. Tapping a row marks it read and swaps the screen body for a minimal, generic message
peek (plain bubbles, no negotiation UI, no persistent action bar) with a "Back to Messages"
button — a state transition standing in for navigation, deliberately thin so it can't be mistaken
for a re-implementation of `offer-thread`.

## 브리프에 없던 것

1. **아바타 색을 어떻게 "결정론적으로 팔레트에서 파생"시킬 것인가**
   ① 무엇을 정했나: 이름 문자열의 순수 해시값을 3으로 나눈 나머지로 accent-fill / ink2-fill /
   outline 세 가지 **토큰 조합** 중 하나를 고르게 했다. 새 색상(hue)을 도입하지 않았다.
   ② 무엇으로 정했나: `avatarStyleFor(name)`이라는 순수 함수(문자코드 합의 31진 해시 % 997, 그
   결과 % 3)를 `data.ts`에 두고, 세 조합은 전부 `tokens.color.accent/ink2/bg` + 대응 on-색만
   사용했다.
   ③ 왜 그렇게 정했나: GENERATION.md §3은 "순백 라이트 + near-monochrome + 단일 액센트"를 DNA로
   못박는다 — 채팅 앱에서 흔한 "이름마다 다른 hue"는 이 팔레트에 없다. `Math.random`도 금지라
   "결정론적으로 파생"이 요구하는 것은 무작위가 아니라 **같은 입력이 항상 같은 출력**이라는
   속성이지, 색상 다양성 자체가 아니다 — 그래서 다양성은 팔레트 안에서 조합(채움 vs 아웃라인,
   accent vs ink2)을 바꾸는 쪽으로 풀었다.

2. **미읽음을 색 하나로 전달하지 말라는 규칙을 정확히 몇 개 신호로 만족시킬지**
   ① 무엇을 정했나: 이름 굵기(볼드 vs 세미볼드) + 오른쪽 숫자 뱃지(정확한 미읽음 개수) + 이름 앞
   점(dot) 세 신호를 동시에 걸었다 — 요구된 최소 2종을 넘겼다.
   ② 무엇으로 정했나: `notifications` 화면이 이미 쓰던 "볼드 + New 태그 + 점" 3신호 조합을
   참고하되, "New"라는 정성적 라벨 대신 **정확한 미읬음 개수**(숫자 뱃지)를 썼다 — 채팅함은
   "새 알림이 있다/없다"가 아니라 "몇 통 밀렸는가"가 실제로 유용한 정보이기 때문이다.
   ③ 왜 그렇게 정했나: page-brief-core §2 "색만으로 의미 전달 금지"는 하한선이 2종이지 3종을
   요구하지 않지만, 숫자 뱃지 하나만으로는 시각장애가 아닌 저시력 사용자가 작은 숫자를
   놓칠 수 있어 볼드체(더 큰 지각 면적)를 겹쳐 안전 마진을 뒀다.

3. **스와이프 배경의 보관 버튼을 접근성 트리에 노출할지 여부**
   ① 무엇을 정했나: 스와이프로 드러나는 배경 레이어 전체를 `accessibilityElementsHidden` +
   `importantForAccessibility="no-hide-descendants"`로 접근성 트리에서 완전히 제외했다. 대신
   행마다 항상 보이는 "More" 아이콘 버튼(플레인 press, 제스처·타이밍 불필요)이 보관 액션의
   유일하고 보장된 접근 경로다.
   ② 무엇으로 정했나: 두 경로를 물리적으로 분리했다 — 스와이프 배경 버튼(숨김)과 More→시트의
   Archive 버튼(노출)은 같은 `onArchiveToggle` 콜백을 공유하지만 접근성 트리 상태만 다르다.
   ③ 왜 그렇게 정했나: 공유 브리프가 "롱프레스나 눌림으로 대체 상호작용을 두라"고 한 것 자체가
   제스처 단독 액션의 접근성 결함을 전제한 요구다 — 스와이프로만 드러나는 컨트롤을 접근성
   트리에 그대로 두면 스크린리더 사용자가 **화면에 보이지 않는데 포커스는 갈 수 있는** 컨트롤을
   만나게 된다(오히려 더 혼란). 감춰서 "제스처는 사용자가 화면을 보고 쓰는 보너스, 실제 보장
   경로는 항상 켜진 버튼"이라는 위계를 명확히 했다.

4. **행 탭 → 상세 이동 흉내를 얼마나 무겁게 만들지 (offer-thread 재탕 방지)**
   ① 무엇을 정했나: 전체 화면 바디를 짧은 메시지 피크(일반 말풍선 몇 개 + Back 버튼)로 교체하는
   상태 전환을 구현하되, 오퍼 카드·라운드 상태·정산 요약·하단 고정 액션 바 등 `offer-thread`의
   핵심 요소는 전부 뺐다.
   ② 무엇으로 정했나: `ThreadPreview`는 읽기 전용이고 되돌아가기 버튼 하나만 있다 — 협상 액션이
   전혀 없다.
   ③ 왜 그렇게 정했나: 공유 브리프가 이 화면을 "여러 대화의 목록"으로, `offer-thread`를 "단일
   대화 상세"로 명시적으로 구분했다. 탭 인터랙션을 아예 안 만들면 브리프가 예로 든 두 번째
   인터랙션 종류가 빠지고, 반대로 협상 UI까지 재현하면 카탈로그 재탕 금지 규칙을 어긴다 — 그
   사이에서 "존재는 하되 의도적으로 얕은" 미리보기로 절충했다.

5. **성공 피드백에 `alert`가 아니라 `polite`만 쓴 이유**
   ① 무엇을 정했나: 보관/보관 해제 시 상태 문구(`statusMessage`)를
   `accessibilityLiveRegion="polite"`로만 알리고 `accessibilityRole="alert"`는 걸지 않았다.
   ② 무엇으로 정했나: 라이브 리전은 헤더의 상태 문구 컨테이너 하나뿐이라(화면 전체에 정확히 1개),
   §4가 경고하는 "라이브 리전 2개 이상" 문제는 애초에 발생하지 않는다.
   ③ 왜 그렇게 정했나: GENERATION.md §3·§4는 `alert`+`polite` 조합을 "진행 가능 여부가 바뀌는
   지점"에 건다고 명시한다 — 이 화면에는 그런 지점이 없다(보관은 언제나 되돌릴 수 있고, 화면의
   다음 행동을 막지 않는다). 대신 page-brief-core Interaction/Feedback의 "성공 피드백" 항목(🟡,
   both)을 만족시키기 위해 `polite` 알림만 남겨, 무음 완료는 피하되 GENERATION의 `alert` 용례를
   과도하게 넓히지 않았다.

## 파일
- `native/src/evolve/r10/b/ChatInbox.tsx` (661줄)
- `native/src/evolve/r10/b/data.ts` (173줄)
