# 멀티플랫폼 진화 루프 — S6: native 차트 렌더 (react-native-svg · 스파크라인 PoC)

- 날짜: 2026-07-24
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: 자율 진화 루프 멀티플랫폼. 선행 = S0·S1·S2·S3a·S3b·S4a·S4b·S4c·S5 전부 ✅ 병합. 이 문서는 **S6**(native 차트 렌더 도입)만 다룬다.

## 0. 상위 프로그램 맥락

| # | 하위 프로젝트 | 상태 |
|---|---|---|
| S0~S5 | native 실행·학습·표시·승격·카탈로그 차원 | ✅ 병합 |
| **S6** | **native 차트 렌더 (react-native-svg 도입)** | ← 이 문서 |

`charts.catalog.md`는 `platform: web(dash) — native 차트는 후속(react-native-svg 미도입)`으로 명시돼 있다. S6이 그 "후속"을 착수해 **react-native-svg 패턴을 확립**하고 charts.catalog를 native로 확장하는 첫 조각을 만든다.

## 1. 목표

관심목록(watchlist) 화면의 각 제품 항목에 **인라인 스파크라인**(가격 추세)을 추가한다. 축·툴팁 없는 압축 라인 1개 — `charts.catalog.md`의 "Trend Over Time → Line/Area"의 압축형. 첫 native 차트 PoC로서 **재사용 가능한 Sparkline 컴포넌트 + react-native-svg 도입 + DNA/a11y/결정론 준수**를 실증한다.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 첫 차트 | 스파크라인 (compact line, 축·툴팁 없음) |
| 통합 위치 | 기존 `watchlist` 화면의 각 항목 인라인 (신규 화면 아님) |
| 의존성 | `npx expo install react-native-svg` (SDK 57 호환 버전 자동 — 임의 npm 버전 금지) |
| 상승/하락 표현 | **단일 액센트 stroke 단색** + 등락은 **텍스트 %+부호로 병기** (2색 = 단일 액센트 DNA 위반이라 색 구분 안 함) |
| 데이터 | 결정론 고정 배열 (`Math.random`/`Date.now` 금지) |
| 애니메이션 | 없음 (정적·결정론) |
| 검증 | `npm install` → `validate.sh` 4-게이트 (tsc·export·render·iframe) |

## 3. 의존성 도입

- **AGENTS.md 준수**: 코드 작성 전 `https://docs.expo.dev/versions/v57.0.0/` 및 react-native-svg 관련 문서 확인.
- `cd native && npx expo install react-native-svg` — Expo가 SDK 57(RN 0.86)에 맞는 버전을 고른다. `package.json`/`package-lock.json` 갱신. 웹 렌더(react-native-web)에서도 SVG가 그려지는지 확인(iframe 게이트가 웹 export 기준).

## 4. Sparkline 컴포넌트

- 경로: `native/src/charts/Sparkline.tsx` (재사용 컴포넌트).
- Props: `{ data: number[]; width: number; height: number; accessibilityLabel: string; strokeWidth?: number }`.
- 구현: react-native-svg `<Svg><Polyline points=.../></Svg>`. 좌표 = data를 width/height에 정규화(min/max 스케일), **소수 2자리 반올림**(하이드레이션·결정론).
- DNA:
  - stroke = `tokens.color.accent` 단색. 색 하드코딩 금지(GENERATION.md §2).
  - 채움 없음 — **PoC는 stroke(라인)만**. 극미 베이스라인 채움은 후속 선택지. 발광·그라데이션 금지.
  - 정적 — 애니메이션·랜덤 없음.
- RN 관용구: `View` 래퍼 + `StyleSheet`. 순수 텍스트 노드 금지.

## 5. 데이터 (결정론)

- `native/src/watchlist/data.ts`의 각 항목에 `priceSeries: number[]`(예: 최근 12~30포인트 고정값) + `changePct: number` 추가.
- 값은 **손으로 고정하거나 계산**(랜덤·현재시각 금지). 등락% = (마지막−처음)/처음, 소수 1자리.

## 6. 접근성 (native 관용구)

- Sparkline 컨테이너: `accessibilityRole="image"` + `accessibilityLabel="가격 추세, 최근 N일, 등락 −4.2%"`(GENERATION.md §4 — 웹 aria 그대로 X).
- **텍스트 대안 = 행에 이미 표시되는 현재가 + 등락% 텍스트**(`charts.catalog.md` compact 차트 폴백 원칙 + ux-guidelines `Native/Mobile`·"색만으로 전달 금지"). 등락 텍스트는 부호(▲/▼ 또는 +/−)로도 방향 표기.
- react-native-svg 내부 요소는 `accessibilityElementsHidden`/`importantForAccessibility="no-hide-descendants"`로 개별 낭독 억제, 컨테이너 라벨 하나로 통합.

## 7. 배선 / 구조

- 신규: `native/src/charts/Sparkline.tsx`.
- 수정: `native/src/watchlist/WatchList.tsx`(각 행에 `<Sparkline>` 삽입), `native/src/watchlist/data.ts`(시계열·등락 추가).
- `native/GENERATION.md`: §8 참조 카탈로그가 이미 charts.catalog를 가리키므로 추가 배선 불요. 단 charts.catalog `platform` 헤더의 "native 차트는 후속(미도입)"을 "스파크라인 도입(S6) — 축·툴팁 차트는 후속"으로 갱신(정합).
- screens.ts/screens.json: 기존 watchlist 화면 재사용이라 신규 등록 불요(화면 자체는 그대로, 내부에 차트만 추가).

## 8. 검증

1. **설치**: `cd native && npm install` (또는 `npx expo install react-native-svg` 포함) 성공.
2. **4-게이트**: `bash native/scripts/validate.sh "관심목록"` — tsc(타입) · export(빌드) · render(대표 텍스트 존재) · iframe(웹 렌더) 전부 통과.
3. **렌더 확인**: iframe/스크린샷에서 스파크라인 라인이 **실제로 그려지는지** 눈으로 확인(빈 SVG 제출 금지 — charts.catalog "차트는 실제 렌더 확인" 원칙).
4. **DNA**: 단색 accent stroke·발광 없음·등락 텍스트 병기 확인.
5. **결정론**: 데이터·좌표에 `Math.random`/`Date.now` 부재(grep).
6. **비회귀**: `npm test`(repick 루트) 무영향(native는 별 워크스페이스), 웹 앱 diff 0.

## 9. 비범위

- 축·눈금·툴팁이 있는 **정식 Line/Area 차트** → 후속(S7 후보).
- **Bar(매칭 점수 분해)** 및 다른 차트 타입 → 후속.
- 차트 **애니메이션**(그리기 연출) → 후속(motion.catalog native 축 = Reanimated 도입 필요).
- charts.catalog를 native 전용으로 분기(별도 노트) → 불요(현행 platform 헤더 갱신으로 갈음).
