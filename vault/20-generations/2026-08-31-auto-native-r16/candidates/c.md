Report Listing — a deliberately lightweight, single-decision pre-purchase trust & safety form: non-interactive listing summary, single-select radio reason list (5 fixed reasons), optional free-text detail, and a submit button that stays disabled until a reason is picked, then replaces the form with a live-region-announced "Report submitted" confirmation summarizing what was reported — no blocked-workflow band, by design.

RENDER_CHECK: Report Listing

Export: default export `ReportListingScreen` in `native/src/evolve/r16/c/ReportListingScreen.tsx` (dummy data in `native/src/evolve/r16/c/data.ts`).

## 브리프에 없던 것

- ① 신고 사유 목록의 정확한 항목·개수·문구 ② 5개 고정: Counterfeit item / Misleading photos / Prohibited item / Scam or spam / Other, 각각 한 줄 설명 부제 포함 ③ 브리프가 "4-6개, e.g. counterfeit/misleading/prohibited/scam/other"로 예시만 주었으므로 그 예시를 그대로 5개로 확정하고, 각 항목에 판단 기준이 되는 짧은 설명을 붙여 라디오 그룹만으로도 자기설명적이게 함 (라벨만으로는 "misleading"이 뭘 뜻하는지 모호할 수 있어 안전 신고 UX 관행상 부연 필요).
- ② 신고 대상 리스팅의 구체적 값(제목/판매자/가격) ③ "Vintage Leather Camera Bag", seller_marina92, ₩68,000 ③ disputes/watchlist 등 기존 화면들이 쓰는 것과 겹치지 않는 임의의 고정 값 — 결정론 요건만 지키면 되므로 자유 선택.
- ① 사진 자리표시자를 실제 이미지 없이 어떻게 표현할지 ② 벡터 스타일의 프레임+산 모양 아이콘을 View만으로 그려 표시 ③ 브리프가 "no new npm dependencies", "no emoji", "vector/geometric icons only"라 지정했으므로 아이콘 라이브러리 없이 순수 View/보더로 이미지 자리표시자 아이콘을 흉내냄 (체크마크도 동일하게 회전된 View 두 개로 구현).
- ① 선택 표시의 비색상 신호를 정확히 무엇으로 할지 ② 라디오 원(채움 여부) + 보더 두께 변화(1→2px) + 우측 체크 배지(벡터로 그린 체크마크) 3중 신호 ③ 브리프 4절 "color is never the only signal ... pair with an icon/border/checkmark"를 문자 그대로 아이콘+보더 둘 다로 과할 정도로 명확히 충족.
- ① 원화 표기 방식 ② "₩ 68,000" (₩ 기호와 숫자 사이에 얇은 공백) ③ 브리프 1절이 제시한 3가지 선택지 중 (a) "small space between ₩ and digits"를 그대로 채택 — 임의 선택.
- ① 상세 설명 TextInput의 글자수 제한 ② 300자, 실시간 카운터 표시 ③ 브리프에 길이 제한 언급 없음; 신고 사유 상세는 짧아야 한다는 화면 취지("short free-text detail")에 맞춰 임의로 300자 상한을 두고 사용자에게 카운터로 가시화.
- ① 제출 후 폼을 완전히 대체할지, 폼 아래에 확인 카드만 추가할지 ② 완전히 대체(라디오 그룹·입력창·버튼을 언마운트하고 확인 카드로 교체) ③ "single-step-feeling form"이라는 브리프 취지상 제출 후 재수정 유도(예: "Edit" 버튼)를 만들지 않는 편이 이 라운드의 대비점(가벼움)에 부합한다고 판단; disputes 화면의 "제출 후 정적 확인 상태" 패턴과 결과적으로 유사하지만 상태 기계나 밴드 없이 훨씬 단순한 형태로 구현.
- ① 제출 직후 라디오 그룹/입력값을 그대로 화면에 남길지 초기화할지 ② useRef로 제출 시점의 사유·상세를 스냅샷해 확인 카드에 표시하고, 폼 자체는 언마운트하므로 별도 초기화 로직 불필요 ③ "submitted"를 boolean state로 두고 조건부 렌더링하는 가장 단순한 방식을 택함 — 여러 단계짜리 상태 기계를 피하라는 브리프 취지에 부합.
- ① React를 명시적으로 import할지 여부 ② import하지 않음(신규 JSX 런타임 사용) ③ 기존 `native/src/disputes/DisputeCenterScreen.tsx` 등 리포 내 실제 화면들이 `import { useState, ... } from "react"` 형태로 React 자체는 import하지 않는 컨벤션을 따름.
- ① FlatList를 실제로 쓸지 ② 쓰지 않음 — 5개 고정 사유를 View 안에 map으로 렌더 ③ 브리프가 "your reason list is short and fixed... a plain mapped list ... is fine too — your call"라 명시적으로 재량을 주었고, 쓰지 않는 FlatList를 import만 해두면 미사용 임포트로 타입체크 시 문제될 수 있어 제외.
