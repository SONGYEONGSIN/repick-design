# 네이티브(RN/Expo) 생성 가이드 — designer 입력

repick 자율 루프가 네이티브 타깃 화면을 생성할 때 designer가 따르는 규칙. 웹 brief(dash-brief-v3)의 네이티브 대응.

## 1. RN 관용구 (웹 코드 금지)
- `div` → `View`(flex 기본). 순수 텍스트 노드 불가 — **모든 텍스트는 `<Text>`로 감싼다**.
- 버튼/클릭 영역 → `Pressable`. 리스트 → `FlatList`(`.map()` 대신 data/renderItem).
- 최상위 래퍼 → `SafeAreaView`.
- 스타일 → `StyleSheet.create({...})`. 인라인 `style={{...}}` 지양.
- import: `import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";`

## 2. 토큰 (하드코딩 금지)
- 색·간격·radius는 `import { tokens } from "./tokens";`(또는 상대경로) 후 `tokens.color.*`/`tokens.space(n)`/`tokens.radius.*` 사용.
- 색 하드코딩(`#xxxxxx`) 금지 — 토큰에 없으면 토큰에 먼저 추가.

## 3. DNA
- 순백 라이트(`tokens.color.bg`), near-monochrome + **단일 액센트**(`tokens.color.accent`)만 강조.
- 서비스급 절제 — 연극적 발광·장식 금지. 이모지 금지(아이콘 필요 시 벡터/텍스트).

## 4. 접근성
- `aria-label` → `accessibilityLabel`, `role="button"` → `accessibilityRole="button"`, 헤딩 → `accessibilityRole="header"`.

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
