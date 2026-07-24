# 멀티플랫폼 진화 루프 — S7: native Bar (매칭 점수 분해)

- 날짜: 2026-07-24
- 상태: 사용자 승인 완료 (스펙+구현 동시 진행)
- 상위 프로그램: 선행 S0~S6 ✅ 병합(S6에서 react-native-svg 도입·스파크라인). 이 문서는 **S7**(Bar 차트)만 다룬다.

## 0. 맥락
S6이 react-native-svg 패턴·검증 흐름·툴체인을 확립했다. S7은 그 위에서 **Bar 차트**를 추가 — match 화면에 "AI가 왜 골랐나"를 근거별 막대로 시각화(repick 가치제안 직결). charts.catalog "Compare Categories".

## 1. 목표
`AI 매칭 결과`(match) 화면의 각 카드에 **매칭 근거 분해 Bar**를 추가. 단일 `score`를 컨디션·가격·희소성·수요 등 3~4개 factor로 분해해 가로 막대로 보여준다.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 차트 | 가로 Bar (react-native-svg `<Rect>` 트랙+채움) |
| 통합 위치 | match 화면 각 카드, price 아래 |
| 데이터 | `Match.factors: {label,value}[]` 추가(결정론 고정값, score ≈ factor 평균) |
| 색 | **단일 액센트 단색**(한 매물의 factor 비교라 색 구분 불요 — 길이+값으로 구분) |
| 값 라벨 | **상시 노출**(charts.catalog AAA, hover 아님) |
| 정렬 | **내림차순**(charts.catalog "always sort descending by value") |
| 애니메이션 | 없음(정적·결정론) |

## 3. 컴포넌트
- `native/src/charts/BarBreakdown.tsx` — 재사용. props `{ data: {label,value}[]; max?: number(=100); accessibilityLabel: string; barWidth?: number }`.
- 각 행 = 라벨(RN `<Text>`) + 바(`<Svg><Rect track><Rect fill></Svg>`) + 값(RN `<Text>`, tabular). 텍스트는 RN Text로(네이티브 선명), 바만 SVG.
- `sortDesc()` 순수함수(원본 불변). 채움 폭 = `value/max*barWidth`, 소수 2자리 반올림(결정론).

## 4. 데이터
`native/src/data.ts`의 `Match`에 `factors` 추가. 각 항목 4 factor(컨디션·가격·희소성·수요), 결정론 고정값, 평균 ≈ 기존 score.

## 5. a11y
- BarBreakdown 컨테이너 `accessible` + `accessibilityRole="image"` + 라벨("매칭 근거: 컨디션 94, 가격 88, 희소성 82, 수요 90"). 내부 SVG 개별 낭독 억제(컨테이너 통합).
- 값 텍스트가 시각 대안(charts.catalog Compare Categories 폴백 + "색만으로 전달 금지" — 여기선 단색이라 값 텍스트가 유일 판별).

## 6. 배선/구조
- 신규: `native/src/charts/BarBreakdown.tsx`.
- 수정: `native/src/MatchList.tsx`(카드에 `<BarBreakdown>` + "매칭 근거" 캡션), `native/src/data.ts`(factors).
- screens 등록 불요(기존 match 화면 내부에 추가). charts.catalog platform 헤더는 S6에서 이미 native 도입 반영 → 추가 편집 불요.

## 7. 검증
- `bash native/scripts/validate.sh "AI 매칭 결과" match` 4-게이트. Windows에선 게이트 개별 실행(validate.sh는 npx serve 프롬프트로 멈춤 — memory 참조).
  - tsc · expo export(match) · render(svg rect ≥ factor수, 값 텍스트, 단일 accent fill) · iframe.
- 결정론(`Math.random`/`Date.now` 부재) · 루트 npm test 무회귀.

## 8. 비범위
축·눈금 정식 Bar · Line/Area · 애니메이션(Reanimated) → 후속(S8+).
