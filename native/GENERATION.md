# 네이티브(RN/Expo) 생성 가이드 — designer 입력

repick 자율 루프가 네이티브 타깃 화면을 생성할 때 designer가 따르는 규칙. 웹 brief(dash-brief-v3)의 네이티브 대응.

## 1. RN 관용구 (웹 코드 금지)
- `div` → `View`(flex 기본). 순수 텍스트 노드 불가 — **모든 텍스트는 `<Text>`로 감싼다**.
- 버튼/클릭 영역 → `Pressable`. 리스트 → `FlatList`(`.map()` 대신 data/renderItem).
- 최상위 래퍼 → `SafeAreaView`.
- 스타일 → `StyleSheet.create({...})`. 인라인 `style={{...}}` 지양.
- import: `import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";`
- **`fontVariant: ["tabular-nums"]` 는 자유롭게 써도 된다. ₩ 와 무관하다.** (2026-08-24 정정 — 아래 참조)
- **`₩`(U+20A9)는 원래 W 에 가로획이 그어진 글자다.** `-apple-system` 스택에서 그 획이 W 좌우로 삐져나와, 본문 크기에서 옆 숫자와 붙으면 **취소선처럼 읽힌다.** 이건 렌더링 버그가 아니라 **글자 모양**이므로 "피하는 방법"이 아니라 **선택**이다:
  - ₩ 와 숫자 사이에 **간격을 준다**(공백 문자나 별도 `Text` + `marginRight`) — 획이 숫자에 안 붙는다
  - **`KRW` 표기**를 쓴다 — 통화를 라틴 문자로
  - **그대로 받아들인다** — 한국 사용자에게 ₩ 는 익숙한 글자이고, 실제로 취소선이 아니다

  > **이 조항은 두 번 틀렸다가 통제 실험으로 정정됐다.** `auto-native-r4`(L1)는 *"₩ 를 형제 `Text` 로 분리하라"*, `auto-native-r6`(L2)는 *"형제 여부가 아니라 **중첩 깊이**가 기준"* 이라 적었다. **두 처방 모두 존재하지 않는 `fontVariant` 캐스케이드를 막으려던 것이다.**
  > `auto-native-r11` 이 통제 실험으로 확정했다 — 세 후보에 같은 구성을 다른 크기·굵기로 지시(`14/700` · `15/800` · `14/800`, 색 고정)한 결과 **세 셀 전부 재현**됐고(`15/800` 은 `r10` 에서 "깨끗했다"던 조합이다), DOM 계측에서 **`textDecorationLine: "none"`** 이었으며, 같은 문자열을 `tabular-nums` 유/무로 나란히 렌더한 A/B 에서 **두 조건이 동일**했고 **₩ 만 뺀 숫자는 완전히 깨끗**했다. 증거: `vault/20-generations/2026-08-23-auto-native-r11/shots/AB-tabular-nums.png`
  > 그래서 `r6/a` 가 정본을 따르고도 실패한 것은 **따를 것이 없어서**였고, `r10` 이 비중첩에서 재발한 것은 **중첩이 애초에 조건이 아니어서**였다.
  > **일반화**: 같은 조항이 두 번 반증되면 처방을 다시 쓰지 말고 **변수를 통제한다.** 반증 1회는 문면이 불충분한 것이고, 2회는 **무엇이 원인인지 모르는 것**이다([[curation-criteria]] "Q38 판정").

## 2. 토큰 (하드코딩 금지)
- 색·간격·radius는 `import { tokens } from "./tokens";`(또는 상대경로) 후 `tokens.color.*`/`tokens.space(n)`/`tokens.radius.*` 사용.
- 색 하드코딩(`#xxxxxx`) 금지 — 토큰에 없으면 토큰에 먼저 추가.

## 3. DNA
- **카피 언어: 영문 전용** — 화면 텍스트·헤딩·라벨·더미 데이터 전부 영어. 한글·혼합 금지. 게이트 검사 문자열(check)도 영문 헤딩.
- 순백 라이트(`tokens.color.bg`), near-monochrome + **단일 액센트**(`tokens.color.accent`)만 강조.
- 서비스급 절제 — 연극적 발광·장식 금지. 이모지 금지(아이콘 필요 시 벡터/텍스트).
- **하단 고정 밴드는 개수가 아니라 그 밴드가 일을 하는지로 판정한다.** 유효한 밴드는 (a) 지금 왜 진행 불가한지 **문장으로 말하고** (b) 눌리면 **다음 미완료 지점으로 이동**시킨다 — 즉 상태기계다. 비활성 버튼을 놓아두고 사용자가 이유를 찾게 하는 밴드는 감점 대상이고, 밴드가 아예 없는 것도 유효한 선택이다(할 일이 없으면 자리를 비운다).
  스텝 전환은 `accessibilityRole="alert"` + `accessibilityLiveRegion="polite"` 로 알린다 — 위치가 곧 의미인 흐름에서 시각 변화만 두면 따라갈 수 없다.
  **3라운드 독립 재현으로 L3 편입** (2026-08-17): `auto-native-r3`(단일 체크리스트, 3-0) → `r5`(멀티스텝 위저드, 2-1) → `r6`(아코디언 본인확인, 3-0). 서로 다른 화면 유형에서 같은 패턴이 이겼고, `r6/c` 는 위 a11y 두 속성까지 정확히 재현했다. 반대 방향(`r2/c` 의 "고정 밴드를 없애라")과의 관계는 [[questions-queue]] Q25 — **화면유형이 가른다**는 가설이 이 재현으로 강해졌다.

## 4. 접근성
- `aria-label` → `accessibilityLabel`, `role="button"` → `accessibilityRole="button"`, 헤딩 → `accessibilityRole="header"`.
- **종결 액션이 있는 화면에서 상태 전환 알림은 선택이 아니다 (2026-08-19 L2 편입).** 진행 가능/불가가 바뀌는 지점은 `accessibilityRole="alert"`, 그 지점을 담는 컨테이너는 `accessibilityLiveRegion="polite"` 로 낸다(§3 참조). **빠뜨리면 그 결여만으로 감점된다** — 4라운드 연속 이 둘을 건 후보가 렌즈1 에서 이기거나 결정적 우위를 얻었고, 같은 라운드에서 빠뜨린 경쟁 후보(`r5/b`)는 *"상태 전환이 스크린리더 관점에서 무음 DOM 교체"* 로 지목됐다(`r5` 확립 → `r6/c` → `r7/a` → `r9/c` 재현).
  **밴드에만 거는 규칙이 아니다.** `r9/c` 는 고정 밴드 없이 이겼는데도 같은 쌍을 걸었다 — 인스펙터 컨테이너에 `polite`, 발송 확인 헤드라인에만 `alert`. 규칙이 붙는 자리는 *화면 하단*이 아니라 **진행 가능 여부가 바뀌는 지점**이다.
  **라이브 리전을 두 개 이상 두지 마라.** 한 조작에 두 영역이 동시에 낭독되면 어느 쪽이 새 정보인지 알 수 없다 — 컨테이너 하나에 `polite`, 전환 문장에만 `alert` 가 검증된 조합이다.

## 5. 결정론
- 더미 데이터에 `Math.random`/`Date.now`/인자 없는 `new Date()` 금지. 고정값·계산.

## 6. 산출 구조
- `native/src/<screen-slug>/` 폴더에 화면 컴포넌트 + `data.ts`(결정론 더미). `App.tsx`가 렌더하도록 연결(또는 화면 export).

## 7. 검증 (생성 후 반드시 통과)
- `bash native/scripts/validate.sh "<화면의 대표 텍스트>"` 4-게이트(tsc·export·렌더·iframe) 통과.

## 8. 참조 카탈로그 (결정 규칙 — 복사 금지·경로 참조)
생성 시 아래 카탈로그를 씨앗으로 읽는다. 웹 brief(dash-brief-v3)가 카탈로그를 참조하는 것과 같되, `native/`는 vault 위키 그래프 밖이라 **경로 참조**(`[[wikilink]]` 아님).
- `vault/20-catalog/ux-guidelines.catalog.md` → **## Native / Mobile 섹션**(터치 타겟·SafeArea·FlatList·네이티브 a11y 관용구·제스처·결정론) + `Plat=both` 공통 항목(a11y 대비·헤딩 위계·모션 민감 등).
- **anti-slop 필터 우선**: 카탈로그 항목이 §1~5(RN 관용구·토큰·DNA·a11y·결정론)와 충돌하면 이 문서가 이긴다.
