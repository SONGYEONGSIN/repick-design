---
round: auto-native-r6
variant: c
target: native
screen: Seller Verification
slug: evolve-r6-c
---

# Candidate c — Seller Verification

## 브랜드/제품 프레이밍
repick 셀러(판매자) 온보딩의 KYC 단계. 판매자가 리스팅을 올리기 전에 신원(정부 신분증 + 셀피 대조)과
정산 계좌를 확인하고, 필수 서약(정보 정확성·세금 책임·금지 품목 정책 동의) 3건에 동의한 뒤
"Submit for review"로 심사에 제출하는 화면. `handoff`(대면 만남 확인)와는 다른 개념 — 이쪽은
온보딩/신원 심사 흐름이며, 종결 액션(최종 제출)이 있다는 점만 handoff·listing과 공유한다.

## 화면 구조
단일 스크롤 아코디언 — `listing/ListingCreateScreen`의 탭식 4스텝 위저드(스텝마다 전체 바디 교체)와는
의도적으로 다른 형태를 택했다: 4개의 스텝 카드가 하나의 `FlatList` 안에 세로로 쌓여 있고, 각 카드
헤더를 탭하면 그 자리에서 펼쳐지고/접힌다(`expandedStep` 단일 상태, 아코디언). 상단에 진행 핍(pip)
4개 + "N of 4 steps complete" 텍스트. 종결 액션이 있는 화면이므로 r3/r5 델타에 따라 하단 고정
밴드는 유지했다(핀 전체 제거는 하지 않음).

- Step 1 — Identity document: ID 앞면/뒷면/셀피 3개 항목, 각각 탭하여 confirm/un-confirm 토글.
- Step 2 — Payout method: 고정 목업 계좌(Kookmin Bank, `Ji-eun Park`) 표시 + "This is my payout
  account" 확인 토글.
- Step 3 — Attestations: 3개 필수 서약 체크박스(`accessibilityRole="checkbox"`).
- Step 4 — Review and submit: 세 섹션 요약 + 섹션별 "Edit" 버튼(탭하면 해당 스텝으로 점프+펼침) +
  제출 안내/제출완료 안내.

## 구현한 인터랙션 (상태기계 외 2~3개)
1. **스텝 카드 아코디언 펼침/접힘** — 카드 헤더 `Pressable`을 탭하면 `toggleExpand`
   (`SellerVerificationScreen.tsx:115-117`)가 그 스텝을 펼치거나 접는다(단일 `expandedStep` 상태).
   렌더는 `renderItem` 내 `expanded ? (...) : null`(`:399`).
2. **서약 체크박스 토글** — `toggleAttestation`(`:105-108`)이 개별 서약을 켜고 끄며, 3건 모두
   체크돼야 `step3Valid`가 참이 된다(`:59-60`, `attestationDoneCount`/`step3Valid` 계산).
3. **Review 스텝의 "Edit" → 되돌아가서 재개방, 상태가 정직하게 반응** — Review 카드의 각 "Edit"
   버튼(`jumpTo(0)` `:277`, `jumpTo(1)` `:296`, `jumpTo(2)` `:313`)은 해당 스텝으로 점프하며 펼친다
   (`jumpTo` 정의 `:110-113`). 완료 여부(`step1Valid`/`step2Valid`/`step3Valid`, `:51-60`)는 전부
   하위 상태(`documentConfirmed`, `payoutConfirmed`, `attestations`)에서 파생되므로, 사용자가 편집
   화면에서 항목 하나를 다시 un-confirm하면 그 스텝은 즉시 "Complete"에서 "In progress/Not
   started"로 강등된다 — 별도 플래그 없이 파생 상태이므로 항상 정직하다. 제출(`submitted`) 이후
   무엇이든 편집하면 `markEdited()`(`:91-93`)가 `submitted`도 `false`로 되돌린다
   (`toggleDocument` `:95-98`, `togglePayout` `:100-103`, `toggleAttestation` `:105-108` 각각 첫
   줄에서 호출).

## 상태기계 하단 밴드 + accessibilityRole="alert" / accessibilityLiveRegion="polite" 구현 확인
- 밴드 자체(`View`)에 `accessibilityLiveRegion="polite"`: `SellerVerificationScreen.tsx:452`
  (`<View style={styles.band} accessibilityLiveRegion="polite">`).
- 차단 상태일 때 상태 문구에 `accessibilityRole="alert"`: `SellerVerificationScreen.tsx:464`
  (`<Text style={styles.bandBlockedTitle} accessibilityRole="alert">{blocking.message}</Text>`).
- 상태기계 로직: `blocking`(`useMemo`, `:61-84`)이 미완료 스텝을 순서대로 검사해
  "N identity items left to confirm" / "Confirm your payout account" / "N attestations left to
  agree to" 중 하나를 문장으로 반환한다. 밴드가 차단 상태면 탭 시 `jumpTo(blocking.step)`
  (`:455`)이 그 스텝으로 스크롤(`listRef.scrollToIndex`, `:112`)하고 펼친다. 모든 스텝이 유효해지면
  밴드는 활성 "Submit for review" 버튼으로 바뀌고(`:478-489`), 탭하면 `handleSubmit`(`:119-126`)이
  `submitted`를 켠다. 제출 후 밴드는 "Submitted for review" 확인 상태로 바뀐다(`:469-474`).
  `disabled` 정적 버튼은 어디에도 없다.
- `hitSlop`: 모든 탭 가능 컨트롤이 `HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 }`
  (`SellerVerificationScreen.tsx:35`)을 공유 — 문서 항목 토글, payout 토글, 서약 체크박스, Edit
  버튼, 스텝 카드 헤더, 밴드 버튼 전부 8pt 이상.

## 토큰/SafeArea 확인
- 색은 전부 `tokens.color.*`(`bg`, `accent`, `onAccent`, `ink`, `ink2`, `muted`, `faint`,
  `border`)만 사용 — `#` 하드코딩 없음(`import { tokens } from "../../../tokens";`,
  `SellerVerificationScreen.tsx:23`). 새 색이 필요한 지점은 없었다.
- 최상위 래퍼는 `SafeAreaView`(`SellerVerificationScreen.tsx:308`,
  `<SafeAreaView style={styles.screen}>` ... `</SafeAreaView>`, `:377`에서 닫힘) — r1 델타가 지적한
  결함을 처음부터 피했다.

## 브리프에 없던 것
- **① 무엇을 결정해야 했나**: 신원 확인 문서 종류(어떤 문서? 몇 장?)와 정산 계좌 정보의 구체적
  필드가 브리프에 없었다. `handoff` 화면처럼 6개 체크리스트로 만들 수도, `listing` 화면처럼 4스텝
  탭 위저드로 만들 수도 있어 화면 구조 자체도 결정 대상이었다.
  **② 무엇으로 결정했나**: 정부 신분증 앞/뒤 + ID를 든 셀피(3항목)로 신원 확인을 구성했고, 정산
  계좌는 은행명·마스킹된 계좌번호·예금주·계좌종류 4필드의 고정 목업(Kookmin Bank, ****4471,
  Ji-eun Park, Checking)으로 채웠다. 화면 구조는 `listing`(탭 위저드, 이미 이번 라운드에 존재할
  가능성이 있는 후보 b/기존 카탈로그와 유사)과 명시적으로 다르게, 단일 스크롤 리스트 안의
  아코디언 카드 4개로 설계해 화면유형 차별성을 확보했다.
  **③ 왜 그렇게 결정했나**: 실제 마켓플레이스 셀러 KYC(당근마켓·번개장터류 정산 계좌 인증,
  국내 결제대행사 KYC 플로우)에서 흔한 조합이라 "그럴듯한 3-5단계"라는 지시에 부합하고, 통화
  표시가 전혀 필요 없어(정산 "계좌" 자체는 금액이 아니라 식별정보) r4 델타가 지적한
  `tabular-nums` + `₩` 렌더링 아티팩트 리스크를 아예 만들지 않을 수 있었다. 아코디언 구조는
  "탭해서 섹션을 펼쳐 검토"라는 브리프의 인터랙션 요구를 리스트 형태로 자연스럽게 만족시키면서,
  이미 검증된 `listing`의 탭-스와핑 위저드 패턴을 그대로 복제하지 않는 선택이었다.
