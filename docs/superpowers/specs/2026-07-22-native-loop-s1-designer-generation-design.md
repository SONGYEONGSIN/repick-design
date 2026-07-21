# 멀티플랫폼 진화 루프 — S1: designer 네이티브 온디맨드 생성 증명 설계

- 날짜: 2026-07-22
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: 자율 진화 루프 멀티플랫폼 재설계. 선행 = S0(Expo PoC, `docs/superpowers/specs/2026-07-21-native-loop-s0-expo-poc-design.md`) — 통과. 이 문서는 **S1**만 다룬다.

## 0. 상위 프로그램 맥락

| # | 하위 프로젝트 | 상태 |
|---|---|---|
| S0 | Expo 단일 타깃 PoC (실현성 게이트) | ✅ 통과 |
| **S1** | **designer 네이티브 온디맨드 생성 증명** | ← 이 문서 |
| S2 | 검증 게이트 재설계 (웹↔네이티브 타깃 분기) | 후속 |
| S3 | 미리보기·갤러리 통합 | 후속 |
| S4 | 루프·ledger·스킬 재배선 (자율 라운드가 native 타깃 선택) | 후속 |
| S5 | 카탈로그 192색·98UX 전수 수용 | 후속 |

## 1. 목표

`designer`(또는 frontend-design-specialist) 에이전트가 **온디맨드로 RN 화면 1개를 자동 생성**하고, S0가 실증한 4개 게이트를 통과함을 증명한다. "designer가 RN을 게이트 통과하게 생성한다"만 증명 — 자율 라운드 재배선(S4)은 미수정.

**핵심 증명 방식**: PoC의 MatchList를 재생성(베끼기)하는 게 아니라 **다른 도메인 화면을 새로 생성**시켜 일반화를 증명한다.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| S1 범위 | 온디맨드 1회 생성 증명 (자율 루프 재배선 없음, tokens.ts 선행 포함) |
| 생성 화면 | MatchList와 다른 repick 도메인 화면(관심목록/알림 등) — 일반화 증거 |
| 스타일링 | 순수 `StyleSheet` 유지 (NativeWind 채택은 보류) |
| 게이트 | S0 4단계를 `validate.sh`로 스크립트화해 재사용 |

## 3. 신규 아티팩트

### 3.1 `native/src/tokens.ts` (선행 — DNA 토큰 추출)
S0가 실증한 repick DNA 값을 명시 상수로 추출해, designer가 매 생성마다 색값을 재추론하지 않고 import한다.
- `bg` `#ffffff` · `accent` `#4f46e5`(indigo-600) · 텍스트 계조 `ink`(#18181b)·`ink2`(#27272a)·`muted`(#52525b)·`faint`(#71717a) · `border` `#e4e4e7`
- 간격 리듬(4/8), radius, 타이포 위계(fontWeight/letterSpacing/lineHeight 조합) 상수.
- **기존 PoC MatchList도 이 토큰을 import하도록 리팩터** — 토큰 추출이 기존 화면을 안 깨뜨림을 회귀로 확인(하드코딩 값 → 토큰 참조).

### 3.2 `native/GENERATION.md` (네이티브 생성 가이드 = 네이티브 brief)
designer가 RN 생성 전 읽는 실행 가능 규칙. S0 인계 노트를 정식화:
- **RN 관용구 매핑**: `div→View`, 순수 텍스트→`Text`로 감싸기(필수), 버튼/클릭→`Pressable`, 리스트→`FlatList`(`.map()` 대신), 최상위→`SafeAreaView`. 인라인 style 대신 `StyleSheet.create()`.
- **a11y 매핑**: `role="button"→accessibilityRole="button"`, `aria-label→accessibilityLabel`.
- **결정론**: `Math.random`/`Date.now`/인자 없는 `new Date()` 금지.
- **토큰 규약**: 색·간격은 `tokens.ts`에서 import(하드코딩 금지). 이모지 금지(웹 루프처럼).
- **DNA**: 순백 라이트·near-monochrome + 단일 액센트·서비스급 절제.

### 3.3 `native/scripts/validate.sh` (4-게이트 스크립트)
S0의 4단계를 한 스크립트로 — designer 산출물 검증 + S2 네이티브 게이트 분기의 씨앗:
1. `cd native && npx tsc --noEmit` (컴파일)
2. `npx expo export --platform web --output-dir dist` (빌드)
3. 8091 서빙 + curl 200 + Playwright `document.body.innerText` 텍스트 검사(렌더) — **인자로 검사 문자열 받음**(생성 화면마다 다름)
4. `iframe-check.mjs` (갤러리 미리보기 통합)
- 승계 finding #2 반영: playwright를 절대경로 대신 `require.resolve('playwright')` 상대 해석으로(클라우드 이식성). 서버는 백그라운드 기동·종료 정리 포함.

## 4. 증명 절차 (온디맨드)

1. designer 에이전트 1개 dispatch: 입력 = `tokens.ts` + `GENERATION.md` + "repick 도메인의 **MatchList와 다른 화면**(관심목록/알림/판매 등록 중 1) 하나를 RN으로 생성, tokens.ts import·GENERATION.md 규칙 준수".
2. 산출: `native/src/<screen>/`(예: `native/src/watchlist/`) + 결정론 데이터.
3. `validate.sh`로 검증. 실패 시 designer에 **1회 수정**(웹 루프 하드게이트 규칙 계승) 후 재검증.
4. 통과 = S1 성공. `native/README.md`에 S1 결과·화면·검증 출력 추가.

## 5. 검증

1. `validate.sh <검사문자열>`이 designer 생성 화면에 4단계 전부 통과.
2. tokens.ts 회귀: PoC MatchList가 토큰 import로 리팩터된 뒤에도 렌더·tsc 불변(하드코딩 제거가 화면 안 깨뜨림).
3. 생성 화면이 MatchList와 **구조·도메인이 다름**(일반화 — 파일/컴포넌트 대조).
4. 웹 루프·프로덕션 무변경(`native/`만 diff) — `curl https://repick-design.vercel.app/` 200 유지.

## 6. 비범위

- 자율 라운드가 native 타깃을 뽑게 하는 SKILL 재배선·ledger·judge → **S4**
- 웹↔네이티브 게이트 타깃별 분기 정식화 → **S2**(validate.sh는 씨앗)
- NativeWind 채택, iOS 시뮬레이터 실렌더 → 보류/S3
- 카탈로그(192·98)의 RN 대응표 → S5
- 3병렬 생성·judge 심사(웹 루프의 GENERATE 3) → S1은 1개 온디맨드만
