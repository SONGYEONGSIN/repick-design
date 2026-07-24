# 멀티플랫폼 진화 루프 — S8: native Line/Area (축·툴팁 · 가격 히스토리 상세)

- 날짜: 2026-07-24
- 상태: 사용자 승인 완료 (스펙+구현 동시 진행)
- 상위 프로그램: 선행 S0~S7 ✅ 병합(S6 스파크라인·S7 Bar). 이 문서는 **S8**(정식 Line/Area)만 다룬다.

## 0. 맥락
S6 스파크라인(인라인 compact line)의 정식 확장. 새 요소 = **축·눈금·영역채움 + 터치 툴팁**(PanResponder). react-native-svg 패턴·툴체인 재사용(신규 의존성 없음).

## 1. 목표
신규 `detail`(가격 히스토리) 화면에서 제품 1개의 14일 가격 추이를 **정식 Line/Area 차트**로 보여준다. 축·눈금·영역채움 + 터치로 값을 읽는 크로스헤어 툴팁.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 차트 | Line + Area(영역채움), 축·눈금 있음 |
| 화면 | 신규 `detail` 화면(screens 등록) |
| 툴팁 | PanResponder 터치/드래그 → 최근접점 크로스헤어+값 버블. **기본 최신점 표시**(상시 가시·테스트 가능) |
| 색 | 단일 액센트 라인 + 저투명 영역채움(12~16%). 축/그리드 = faint/border |
| 데이터 | 14포인트 결정론 고정값 |
| 애니메이션 | 없음(툴팁은 상호작용, 애니 아님). 결정론(좌표 소수 2자리) |

## 3. 컴포넌트
- `native/src/charts/LineChart.tsx` — 재사용. props `{ points: {day,price}[]; width; height; accessibilityLabel; formatY?: (n)=>string }`.
- SVG 구성: 영역(`<Polygon>` 베이스라인까지) + 라인(`<Polyline>`) + Y 그리드/눈금(`<Line>`+`<Text>` min/mid/max) + X 라벨(첫/중/끝) + 툴팁(active index: `<Line>` 크로스헤어 + `<Circle>` 점 + `<Rect>`+`<Text>` 버블).
- 터치: 래퍼 `<View>` PanResponder(`onStartShouldSetPanResponder`) → `evt.nativeEvent.locationX` → 최근접 index(round((x-padL)/stepX), 클램프) → `setActive`.
- 순수함수 `scaleX`/`scaleY`/`nearestIndex`(결정론 소수 2자리, 테스트 가능하게 export).

## 4. 데이터
- `native/src/detail/data.ts` — 1개 제품(제목·등급·14포인트 history{day,price}). 결정론 고정값, 마지막 = 현재가.

## 5. 화면
- `native/src/detail/PriceDetail.tsx` — 헤더(제목·현재가·등락%) + "14일 가격 추이" 캡션 + `<LineChart>`.

## 6. 배선
- `native/src/screens.ts`: COMPONENTS에 `detail: PriceDetail` 추가.
- `native/src/screens.json`: `"detail": { "check": "가격 히스토리" }`.
- App 라우팅은 EXPO_PUBLIC_SCREEN 그대로.

## 7. a11y
- 차트 컨테이너 `accessible` + `accessibilityRole="image"` + 요약 라벨(기간·시작가·현재가·등락%). 축 라벨·툴팁 텍스트가 시각 대안. 툴팁 상호작용은 보조(요약이 정보 보장).

## 8. 검증
- 신규 slug `detail`로 4-게이트(개별 실행 — validate.sh는 Windows에서 npx serve 프롬프트로 멈춤).
  - tsc · expo export(detail) · render(polyline + polygon + 축 텍스트 + 기본 툴팁 값) · iframe.
  - **터치 상호작용**: playwright로 차트 특정 x에 mousedown → 툴팁 값이 해당 점으로 바뀌는지 확인.
- 결정론(`Math.random`/`Date.now` 실호출 0) · 루트 npm test 무회귀.

## 9. 비범위
애니메이션(Reanimated) · 멀티 계열 · 핀치 줌 · Y축 0-기준 옵션 → 후속.
