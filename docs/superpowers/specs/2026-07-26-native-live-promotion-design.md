# 네이티브 라이브 승격 (①) — Mobile 카테고리 PNG → 라이브 Expo 렌더

- 날짜: 2026-07-26
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위: Specimen 개편 후속 큐 ①. 선행 = G1·G2·G2.5·상세폴리시·②영문화 병합. 후속 = G3.
- 관련: [[repick-native-loop]] (S0~S5 인프라), [[specimen-gallery-redesign]]

## 1. 목표

갤러리 **Mobile 카테고리**를 정적 PNG(S3a) → **라이브 Expo web 렌더(iframe)**. `native/src`의 실존 3화면(watchlist·match·detail)을 영문화한 뒤 Expo web 정적 export를 Next `public/`에 서빙해 갤러리 카드/상세에서 라이브 iframe으로 표시. n1(notification-center, 소스 미존재 PNG)은 이 3화면으로 대체.

## 2. 확정된 결정 (일부 스파이크 검증 완료)

| 결정 | 선택 | 검증 |
|---|---|---|
| 대상 화면 | 기존 3화면 watchlist·match·detail (라이브 소스 존재) | native/src 확인 |
| 네이티브 영문화 | 예 (② 정합, screens.json check 포함) | — |
| 표시 | 정적 PNG → **라이브 iframe** (S3a img 분기 대체) | — |
| Expo web export | `npx expo export --platform web` → 정적 번들 | **✅ 스파이크: 516K, index.html+_expo 생성** |
| 서브패스 서빙 | `baseUrl="/native-app"` | **✅ 스파이크: 에셋 `/native-app/_expo/...` 접두 적용** |
| baseUrl 주입 | **env 조건부**(app.config.js) — native gate(evolve 루프)엔 미적용 | 게이트 안전 |
| 화면 선택 | 런타임 `?screen=<slug>` URL 쿼리 | 구현 시 검증 |

## 3. 네이티브 화면 영문화

- `native/src/watchlist/WatchList.tsx`·`native/src/detail/PriceDetail.tsx`·`native/src/MatchList.tsx`·`native/src/charts/*`·`native/src/data.ts`의 렌더 한글 UI + 코드 주석 → 영문 (② 규칙 동일: 로직/디자인/토큰 불변, 언어만).
- `native/screens.json` check 문자열 영문화: `{"watchlist":{"check":"Watchlist"},"match":{"check":"AI Match"},"detail":{"check":"Price history"}}` (gate.mjs native가 이 문자열로 렌더 검증 — 화면 UI의 실제 영문과 일치해야 함).
- `native/tokens.ts` 불변(색 hex). `screens.ts` 불변(컴포넌트 매핑).
- 검증: export 후 각 화면 렌더 HTML 한글 0.

## 4. 런타임 화면 선택 (App.tsx)

현재 `resolveScreen(process.env.EXPO_PUBLIC_SCREEN)`(빌드타임). 웹에서 런타임 `?screen=` 지원 추가:
```tsx
function currentSlug(): string | undefined {
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search).get("screen") ?? undefined;
  }
  return process.env.EXPO_PUBLIC_SCREEN;
}
// App: const Screen = resolveScreen(currentSlug());
```
- `resolveScreen`은 미지/누락 slug → `DEFAULT_SCREEN`(watchlist) 폴백(기존). 단일 번들이 `?screen=watchlist|match|detail` 3화면 서빙. `EXPO_PUBLIC_SCREEN`(빌드타임, native gate용)은 폴백으로 보존.

## 5. Expo web export → app/public/native-app/ (커밋 정적 아티팩트)

- **app.config.js 신설**(app.json 유지·확장): app.json을 읽어 `experiments.baseUrl = process.env.EXPO_PUBLIC_BASE_URL || undefined` 주입. → 갤러리 빌드만 subpath, native gate(baseUrl 미설정)는 무영향.
  ```js
  // native/app.config.js
  module.exports = ({ config }) => ({
    ...config,
    experiments: { ...(config.experiments||{}), baseUrl: process.env.EXPO_PUBLIC_BASE_URL || undefined },
  });
  ```
- **빌드 스크립트** `native/scripts/build-gallery-web.sh`: `EXPO_PUBLIC_BASE_URL=/native-app npx expo export --platform web --output-dir ../app/public/native-app --clear`. (react-native-svg 설치 선행 — package.json 선언됨, `npx expo install` 로 node_modules 보장.)
- 산출 `app/public/native-app/{index.html,_expo/,...}` **커밋**(정적 — 프로덕션 런타임 Expo 의존성 불요). 네이티브 화면 변경 시 스크립트 재실행 후 재커밋.
- 검증: `/native-app/?screen=watchlist` 정적 서빙(Next public) + 렌더.

## 6. 갤러리 통합

- **works.ts `NATIVE_WORKS`**: n1(notification-center) 제거 → 3작품(전부 `category:"mobile"`, `image` 없음=라이브 iframe):
  ```
  { id:"n1", route:"/native-app/?screen=watchlist", brand:"Watchlist", desc:{en:"…",ko:"…"}, target:"native", category:"mobile", previewH:520 }
  { id:"n2", route:"/native-app/?screen=match", brand:"AI Match", desc:{…}, target:"native", category:"mobile", previewH:520 }
  { id:"n3", route:"/native-app/?screen=detail", brand:"Price Detail", desc:{…}, target:"native", category:"mobile", previewH:520 }
  ```
  desc는 이중언어(카드 태그라인, en/ko — 실제 화면 설명, 계획에서 작성).
- **native 표시 판정**: 기존 `category==="mobile"`로 WorkCard가 모바일 iframe 렌더(신규 필드 불요). `Work.image` 필드는 이제 미사용 → **`Work` 타입·WorkCard의 `image` 분기 제거**(S3a 잔재 정리, native가 유일 소비처였음).
- **WorkCard**(work-card.tsx): `image?img:iframe` 분기 → `category==="mobile" ? <모바일 iframe> : <웹 iframe>`. 모바일 iframe = 폭 390·폰 종횡비·previewH 높이·스케일 없이 ≈1:1(폰 폭 카드). 웹 iframe(1440 스케일)·카드→`/gallery/[id]` 라우팅 불변.
- **detail HeroPreview**(detail-client.tsx): `work.image?img:iframe` → `category==="mobile" ? 폰프레임 iframe(390) : 웹 iframe`. "View live" → `/native-app/?screen=<x>`.
- **specimen-specs 정리**: 기존 **n1(notification-center) rich 스펙 제거** + `SUBSET_IDS`에서 n1 제거(→ **14** 서브셋 = 웹 14작품). 3 native 작품(n1/n2/n3)은 상세 페이지에서 **coming-soon**(라이브 iframe 히어로 + "Full spec coming soon") — native rich 스펙은 후속. `specimen-subset-complete.test`·batch 게이트가 14로 정합.
- **정리**: `app/public/native/notification-center.png` 삭제(orphan PNG).

## 7. 검증

1. **native 영문화**: export 후 `/native-app/?screen={watchlist,match,detail}` 렌더 HTML 한글 0. screens.json check 영문이 실제 렌더와 일치.
2. **export/서빙**: `build-gallery-web.sh` 성공 → `app/public/native-app/index.html`+`_expo/` 생성 → `next build` 후 `/native-app/?screen=watchlist` 200·에셋 200(subpath 정합)·RN 화면 렌더.
3. **런타임 화면선택**: `?screen=match`/`detail` 각각 다른 화면 렌더, 미지 slug → watchlist 폴백.
4. **갤러리**: Mobile 카테고리에 3 native 작품, 카드가 **라이브 모바일 iframe**(PNG 아님) 렌더, 상세 페이지·"View live" 동작. 웹 작품 카드/상세 회귀 0.
5. **native gate 무영향**: `gate.mjs --target native`(baseUrl 미설정)로 screens.json 영문 check 재현 pass(evolve 루프 안전).
6. **비회귀**: `cd app && npx next build` · `node --test "scripts/**/*.test.mjs"` · 갤러리 웹 작품·상세·i18n 불변 · 프로덕션 200 · a11y.

## 8. 비범위

- notification-center(n1) 소스 복구 (사용자 선택상 제외 — smoke/native-r1에 보존).
- native evolve 루프(evolve/dash branch)·nightly native 라운드 — main 정본만 변경(screens.json 영문 check는 다음 rebase 시 루프 픽업).
- native 화면 신규 디자인·추가 화면 · G3 메인 랜딩.
- Expo 네이티브 앱 빌드(iOS/Android) — 웹 export만.
