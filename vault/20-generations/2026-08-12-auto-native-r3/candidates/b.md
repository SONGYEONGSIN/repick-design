# 후보 b — HandoffCheckScreen

**한 줄**: 거래 당일 눈앞의 물건을 리스팅과 6줄로 대조하는 화면. 답이 하나 채워질 때마다 진척·불일치 장부·하단 액션의 **문장**이 동시에 바뀌고, 하단 버튼은 비활성 대신 "무엇 때문에 아직인지"를 말한다.

- 배정: 화면유형 = **Handoff(거래 당일 인수인계 — 구매 이후 시점, native 최초)** / 실루엣 = **본문 스크롤 + 하단 고정 단일 액션(2밴드, 아래가 고정)**
- 게이트 검사 문자열: `Handoff check` (보조 헤딩 `Six lines to answer` · `Mismatch report`)
- 파일: `HandoffCheckScreen.tsx`(named export) · `data.ts`

## 인터랙션

| 조작 | 동시 갱신 |
|---|---|
| 행의 `Matches` | ① 행 마커(점선→액센트 채움) + 상태 문구 ② 상단 pip 세그먼트 ③ "N of 6 answered" + "Still open:" 남은 항목명 ④ 하단 액션 title/detail 재계산 ⑤ 전송 확인 라인 초기화 |
| 행의 `Differs` | 위 전부 + ⑥ 불일치 사유 노트 펼침 + "worth $35 off"(또는 "money cannot fix this") ⑦ 헤더 경고("2 mismatch recorded, 420 → 385") ⑧ Mismatch report 행 추가 + 개정가 합계 |
| 선택된 버튼 재누름 | 미확인으로 되돌리고 전 면이 역방향 갱신(3상태 순환). **"Press the same button again to clear it." 힌트를 화면에 노출 — 숨은 제스처 없음** |
| 하단 액션 · 미답 | `"3 lines left before you can pay / Next one is Battery health. Press to jump straight to it."` → `FlatList.scrollToIndex`로 첫 미답 행 이동. **비활성 버튼이 아니라 일을 하는 버튼** |
| 하단 액션 · 블로킹 불일치 | 톤 `stop` — `"Hold the handoff / …no discount makes that safe."` 가격으로 해결 불가한 불일치를 재협상 경로에서 분리 |
| 하단 액션 · 가격성 불일치만 | 톤 `revise` — `"Send revised offer, $385 / 2 mismatch takes $35 off."` 누르면 "Sent to Jiho K. at 4:38 PM" 추가 |
| 하단 액션 · 전부 일치 | `"Confirm handoff, $420 / All 6 lines match the listing."` |

상태 3중 표기: **형태**(점선 사각 / 액센트 채움+흰 점 / 흰 사각+잉크 가로바) + **텍스트**(Not checked / Matches listing / Differs from listing) + **색**. 터치 타겟 44pt + `hitSlop={8}`, `pressed`만 사용.

실루엣: 고정 헤더 없음. `SafeAreaView > [FlatList flex:1] + [band]` — **하단 밴드가 절대배치가 아니라 flex 형제**라 홈 인디케이터를 침범하지 않는다.

## 브리프에 없던 것

1. **상품 카테고리와 스펙** — ② iPad Air 11" M2 128GB, 합의가 $420 ③ 시리얼·배터리·액티베이션 락처럼 "리스팅과 다를 수 있는 것"이 자연히 6개 나오는 카테고리.
2. **통화** — ② USD ③ DNA의 "카피 영문 전용"에서 파생. **"영문 화면에 원화 표기는 어색하다고 판단했으나, repick이 한국 서비스라면 잘못된 선택일 수 있다. 브리프에 통화 규정이 없다."**
3. **불일치 → 재협상 금액의 산출 규칙** — ② 항목별 고정 `priceImpact` 단순 합산, 근거는 "38 comparable sales in the last 60 days" ③ 임의. **실제라면 AI 가격 모델이 줄 값인데 브리프에 산정 주체·근거 표기 규칙이 없다.**
4. **가격으로 해결 불가한 불일치(blocking) 개념** — ① 시리얼 불일치를 "$0 할인"으로 처리하면 논지가 무너진다 ② `blocking: true` 필드로 네 번째 톤(`stop`) 신설 ③ 자체 판단. **브리프는 3상태만 규정했고 불일치의 종류 구분은 없었다.**
5. **하단 액션의 미답 동작** — ② 눌리게 하고 첫 미답 행으로 스크롤 ③ 브리프의 "이유를 말하는 버튼"을 확장 해석 — **`disabled`를 아예 쓰지 않는 편이 더 강한 답이라고 봤다.**
6. **확인 전송 후 상태** — ② 밴드 위 "Sent to Jiho K. at 4:38 PM" + 버튼 문구 과거형, 체크를 다시 건드리면 해제 ③ 브리프가 액션 이후를 규정하지 않았다.
7. **고정 시각·장소·딜코드** — ② "Today at 4:30 PM", "Gongdeok Station Exit 5", "RP-7420" 상수 ③ 결정론 준수. **단 "Today"라는 상대 표현을 고정 문자열로 넣었다.**
8. **판매자 신뢰 지표** — ② "Jiho K., 12 deals, 0 disputes" ③ 구성요소 목록에 판매자 항목이 없었지만 **직거래 현장 화면에서 상대가 안 보이면 비현실적**이라 넣었다.
9. **검수 방법 힌트(`how`)** — ② 행마다 "Settings, then Battery…" 한 줄 ③ 브리프에 없지만 "그 자리에서 확인하게 한다"는 목표에 필요.
10. **불일치 기록 보존 문구** — ② "Repick keeps this report on the deal for 14 days" ③ **14일은 근거 없는 숫자다.**
11. **비ASCII 전면 회피** — ③ 게이트가 `(c)` 기호를 이모지로 오탐한 이력을 고려한 방어적 선택.
12. **동적 폭 대신 pip 세그먼트** — ② 인라인 `width: "%"` 대신 6칸 `flex:1` 세그먼트 ③ **"인라인 style 지양" 규칙을 지키기 위한 우회.** 결과적으로 항목별 상태까지 상단에서 보이는 이득.
