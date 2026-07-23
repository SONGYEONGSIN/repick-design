# 멀티플랫폼 진화 루프 — S3b: falsify native 킵/드롭 자동 승격

- 날짜: 2026-07-24
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: 자율 진화 루프 멀티플랫폼 재설계. 선행 = S0·S1·S2·S4a·S4b·S4c·S3a 전부 ✅ 병합. 이 문서는 **S3b**만 다룬다.

## 0. 상위 프로그램 맥락

| # | 하위 프로젝트 | 상태 |
|---|---|---|
| S0~S2·S4a~S4c | native 실행·학습 | ✅ 병합 |
| S3a | 갤러리 native 표시 | ✅ 병합 |
| **S3b** | **falsify native 킵/드롭 자동 승격** | ← 이 문서 |
| S5 | 카탈로그 192색·98UX 전수 수용 | 후속 |

> S3b는 native 라이프사이클의 마지막 조각 — 승자 자동 승격(permanent 화면 + 갤러리 등재). 이후 native = run→gate→judge→learn→승격/표시 완비.

## 1. 목표

주간 dash-falsify apply가 native 승자를 permanent 화면으로 승격(evolve 후보 → 영구 native 화면 + main screens 등재 + 스크린샷 복사 + `NATIVE_WORKS` append)하고 탈락 후보는 드롭한다. S4c/S3a에서 "미지원(S3)"로 이월한 native 후보 킵/드롭을 구현. 변경은 dash-falsify SKILL prose만.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 승격 화면 naming | **semantic 폴더명** (watchlist/match 관례 — 도메인 도출, 예 알림센터→`notifications`) |
| 승격 대상 | 코드(`native/src/<name>/`)+main screens 등재 + 갤러리(스크린샷+NATIVE_WORKS) 둘 다 |
| 레지스트리 정리 | 라운드 evolve 슬러그를 승격/드롭으로 전부 소진(evolve/dash screens 무한 축적 방지) |
| champion 개념 | **없음** — native는 화면 집합만(웹의 `/` 챔피언 대응물 없음) |
| 검증 | throwaway dry-run(스모크 승자 a 승격) |

## 3. §4 native keep/drop (웹 keep 병렬)

dash-falsify apply §4에 native 케이스 추가:

### 3.1 keep (승자 승격)
1. **화면 이동**: `git mv native/src/evolve/r<N>/<v> native/src/<name>/` — `<name>`은 semantic(watchlist/match 관례; 승자 화면 도메인에서 도출).
2. **main screens 등재**: `native/screens.ts`에 import + `COMPONENTS["<name>"] = <컴포넌트>` 추가, `native/screens.json`에 `"<name>": {"check": "<검사문자열>"}` 추가. 이동 전 evolve 슬러그(`evolve-r<N>-<v>`) 등록은 제거(→ permanent 슬러그로 대체).
3. **스크린샷 복사**: `vault/20-generations/<run>/shots/<v>-390.png` → `app/public/native/<name>.png`.
4. **갤러리 등재**: `NATIVE_WORKS`에 `{ id:'n<다음>', route:'/native/<name>.png', brand:'<한글명>', desc:'… (auto-native-r<N> 승자)', target:'native', image:'/native/<name>.png', status:'winner', round:'auto-native-r<N>', previewH:420 }` append + `LAST_UPDATED` 오늘 날짜 갱신.

### 3.2 drop (탈락)
- `native/src/evolve/r<N>/<v>` 디렉토리 삭제 + 해당 evolve 슬러그를 `native/screens.ts`(import+COMPONENTS)·`native/screens.json`에서 제거.

### 3.3 레지스트리 정리 불변식
- 한 라운드의 evolve 슬러그(`evolve-r<N>-{a,b,c}`)는 falsify 후 **전부 소진**된다(승자는 permanent 슬러그로 대체, 탈락은 제거) — evolve/dash `screens.{ts,json}`에 evolve 슬러그가 남지 않게.

## 4. open §2 native 섹션 — 후보 킵/드롭 노출

- `## 네이티브` 섹션(S4c): "**후보 킵/드롭 제안은 생략(S3)**" 문구 제거 → 라운드 표에 후보별 status(승자/탈락/대기) 노출해 사람이 킵/드롭 판단하게.
- `## 리뷰 방법`: S4c의 "(네이티브는 delta 승인/기각·질문만 — 후보 킵/드롭 미지원)" 제거 → native도 후보 킵/드롭 대상.
- apply §4의 "**네이티브 후보 킵/드롭은 미지원(S3) …**" 노트 제거(→ §3.1/§3.2 메커니즘으로 대체).

## 5. 검증

throwaway 브랜치 — dry-run 산출물(승격 화면·screens·스크린샷·NATIVE_WORKS)은 미병합, **dash-falsify SKILL만 main**.

1. **keep dry-run**: 스모크 승자 a(smoke/native-r1의 `native/src/evolve/r1/a/`)를 §3.1대로 `native/src/notifications/`로 `git mv` + `native/screens.{ts,json}`에 `notifications` 등재(evolve-r1-a 제거) + `shots/a-390.png` → `app/public/native/notifications.png` + `NATIVE_WORKS` append.
2. **정합 검증**: `cd native && npx tsc --noEmit` 통과(등재 정합) + `node scripts/gate.mjs --target native --screens notifications` → tsc/export/render/iframe 통과(승격 화면 게이트 생존) + `cd app && npx next build` 통과(NATIVE_WORKS 확장).
3. **drop dry-run**: 남은 evolve 후보(b/c) 디렉토리 삭제 + screens에서 제거 → tsc 통과 + evolve 슬러그 0 확인(레지스트리 소진 불변식).
4. **웹 falsify 무영향**: dash/landing 킵/드롭·delta·질문 경로 diff 0(native 케이스만 추가). `npm test` 44/44.
5. **비회귀**: 변경 = `dash-falsify/SKILL.md` 단독. gate.mjs·dash-evolve·works.ts(런타임 falsify가 수정, SKILL diff엔 없음)·native 정본 diff 0. main 무영향(`curl` 200).

## 6. 비범위

- native champion(단일 대표 화면) → 없음(화면 집합).
- 갤러리 native 인터랙티브 미리보기(Expo 번들 iframe) → 보류.
- native 후보 킵/드롭의 works.ts/screens 편집을 스크립트화 → 불요(falsify는 에이전트 prose 실행, 웹과 동일).
- S5 카탈로그 → 후속.
