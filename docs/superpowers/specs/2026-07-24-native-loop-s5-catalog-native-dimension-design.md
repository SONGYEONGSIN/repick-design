# 멀티플랫폼 진화 루프 — S5: 카탈로그 병합 + native 차원 확장

- 날짜: 2026-07-24
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: 자율 진화 루프 멀티플랫폼 재설계. 선행 = S0·S1·S2·S3a·S3b·S4a·S4b·S4c 전부 ✅ 병합(native 라이프사이클 완성). 이 문서는 **S5**(프로그램 마지막 조각)만 다룬다.

## 0. 상위 프로그램 맥락

| # | 하위 프로젝트 | 상태 |
|---|---|---|
| S0~S4 · S3a · S3b | native 실행·학습·표시·승격 | ✅ 병합 |
| **S5** | **카탈로그 병합 + native 차원 확장** | ← 이 문서 (마지막) |

## 1. 목표

미병합 카탈로그(`feat/20-catalog-uupm` e1022ed — charts/colors/ux-guidelines + 배선)를 main으로 들이고, **native/모바일 차원을 추가**해 ui-ux-pro-max 흡수를 완성한다. 원본(192색·98UX) 재페치는 불요·비범위 — 색 12종 큐레이션은 DNA(near-monochrome·단일 액센트) 원칙이라 유지하고, "web-only UX" 한계는 native/모바일 UX 섹션을 **repick native DNA에서 저작**해 해소한다. platform 확장(S0~S4)이 열어준 축을 카탈로그에 반영.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 방향 | 카탈로그 병합 + native 차원 확장(원본 재페치 아님) |
| 카탈로그 import | `git cherry-pick e1022ed` (배선 파일 main에서 무변경 → 충돌 없음) |
| native UX 출처 | repick native DNA(GENERATION.md·S0~S4) 저작 — 외부 원본 불요 |
| 색/차트 platform | web(dash) 표기 — native 색=`tokens.ts`, native 차트=후속 |
| 색 12종 | DNA 큐레이션 유지(비비드·네온 제외는 원칙, 사유 문서화됨) |

## 3. 카탈로그 import (cherry-pick)

- `git cherry-pick e1022ed` → 착지물:
  - `vault/20-catalog/charts.catalog.md`(차트 25종 선택 규칙), `colors.catalog.md`(AA 12팔레트 뱅크), `ux-guidelines.catalog.md`(Web do/don't 체크리스트).
  - 배선: `dash-brief-v3.md` "참조 카탈로그" 절(+6), `curation-criteria.md` 외부 카탈로그 L2 규칙(+2/-1), `index.md` 20-catalog 등재(+5).
- 배선 파일 3개는 e1022ed 이후 main에서 0 커밋 변경 → cherry-pick 충돌 없음(확인됨).

## 4. platform 태그 차원

- **ux-guidelines.catalog.md**: 각 do/don't 표에 `platform` 열 추가 — `web`(스킵링크·div수프·hover) / `native`(터치·제스처·SafeArea) / `both`(a11y 대비·헤딩 위계·모션 민감 등). 기존 항목은 대부분 `both` 또는 `web`.
- **colors.catalog.md**: frontmatter/헤더에 "platform: web(dash) — native 색은 `native/src/tokens.ts`(단일 indigo DNA), 팔레트 선택 대상 아님" 1줄 명시.
- **charts.catalog.md**: 헤더에 "platform: web(dash) — native 차트는 후속(react-native-svg 미도입)" 1줄.

## 5. native/모바일 UX 섹션 신설

`ux-guidelines.catalog.md`에 `## Native / Mobile (모바일 전용)` 섹션 추가. 원본 제외분(Touch·제스처·공간)을 **repick native DNA에서 저작** — GENERATION.md RN 관용구·a11y 매핑·S0~S4 학습 근거. 항목(Do/Don't/좋은 예/Sev/platform=native):
- **터치 타겟**: 최소 44×44pt / ✗ 작은 탭 영역. (`Pressable` 히트슬롭)
- **hover 부재**: 터치엔 hover 없음 — 상태를 press/active로 / ✗ hover 의존 정보.
- **SafeArea/노치**: `SafeAreaView` 래핑 / ✗ 상태바·홈인디케이터 침범.
- **리스트**: `FlatList`(가상화) / ✗ 대량 `.map()`.
- **네이티브 관용구**: `accessibilityRole`/`accessibilityLabel` 매핑(GENERATION.md §4) / ✗ 웹 aria 그대로.
- **제스처 어포던스**: 스와이프·당겨서 새로고침은 시각 힌트 동반 / ✗ 숨은 제스처만.
- **결정론/이모지**: 더미 결정론·이모지 금지(GENERATION.md §3·§5 — 카탈로그에서 재확인).

## 6. native 배선

- **`native/GENERATION.md`**: "## 8. 참조 카탈로그" 절 추가 — `vault/20-catalog/ux-guidelines.catalog.md`의 Native/Mobile 섹션을 **경로로** 참조(복사 금지, anti-slop 필터 우선), dash-brief-v3가 카탈로그 참조하듯. **`[[wikilink]]` 아님** — GENERATION.md는 `native/`(vault 위키 그래프 밖)라 wikilink는 lint 위반. 경로 참조로 배선.
- **`colors.catalog.md`**: §4의 native 색 명시로 갈음(native는 tokens.ts).
- **주의**: ux-guidelines Native/Mobile 섹션이 GENERATION.md를 언급할 때도 **경로**(`native/GENERATION.md`)로 — vault 밖 노드라 `[[GENERATION]]` wikilink 금지(wiki-lint 위반 방지).

## 7. 정합 마감

- `index.md`: 20-catalog 등재(cherry-pick) + native 차원 반영 확인.
- `curation-criteria.md`: 외부 카탈로그 L2 규칙(cherry-pick) 유지.
- `node scripts/wiki-lint.mjs` 위반 0 — cherry-pick·등재·vault 내 [[링크]] 정합. **vault↔native 크로스-경계 참조는 경로(비-wikilink)** 라 lint 대상 아님(위반 회피). native 섹션 신규 [[링크]]는 vault 내부(예: [[dash-brief-v3]] 공통 a11y)만.

## 8. 검증

1. **cherry-pick 클린**: `git cherry-pick e1022ed` 충돌 0, 3개 카탈로그 + 배선 3파일 착지.
2. **platform 태그 + native 섹션**: ux-guidelines에 platform 열·Native/Mobile 섹션 존재. colors/charts에 platform 1줄.
3. **native 배선**: GENERATION.md "참조 카탈로그" 절이 ux-guidelines를 [[링크]], anti-slop 우선.
4. **위키 정합**: `node scripts/wiki-lint.mjs` 위반 0(깨진 링크·미등재 0).
5. **비회귀**: `npm test` 44/44. `cd app && npx next build` 통과(앱 무관, 회귀 확인). gate.mjs·SKILL·app 코드 diff 0(vault + GENERATION.md만). 프로덕션 무영향(`curl` 200).

## 9. 비범위

- 원본 192색·98UX 전수 재페치(WebFetch) → 별건(옵션2, 필요 시 후속).
- 미흡수 축 Motion 16·Font 74·Styles 84·Icons 104 → 후속.
- native 차트 렌더(react-native-svg 도입) → 후속.
- 색 12종 확대 → DNA 원칙상 안 함(비비드·네온 제외 유지).
