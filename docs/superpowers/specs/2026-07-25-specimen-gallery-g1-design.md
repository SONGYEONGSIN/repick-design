# Specimen 갤러리 개편 — G1: 그리드 + 정체성

- 날짜: 2026-07-25
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: `/gallery` 전면 개편 — "AI 에이전트용 디자인 시스템 갤러리(Specimen)"로 재포장. 참고: tasteskill.dev(메인 느낌)·styles.refero.design(갤러리·상세 느낌). 하위 분해: **G1 그리드+정체성** → G2 상세 페이지(refero style spec) → G3 메인 랜딩(tasteskill). 이 문서는 **G1**만.

## 0. 상위 프로그램 맥락

| # | 하위 프로젝트 | 상태 |
|---|---|---|
| **G1** | **갤러리 그리드 refero식 개편 + Specimen 정체성 + i18n** | ← 이 문서 |
| G2 | 작품 상세 페이지 (refero design-system spec + Agent Prompt Guide) | 후속 |
| G3 | 메인 랜딩 (tasteskill식 히어로 캐러셀) | 후속 |

## 1. 목표

`/gallery`를 styles.refero.design 느낌(화이트 에디토리얼 디지털 뮤지엄, 통합 카드 그리드+검색+필터)으로 개편하고, `repick` 브랜드를 제거해 **Specimen**으로 재정체화한다. **기본 영문 + 한/영 토글**(i18n)을 도입해 국제 포지셔닝(refero/tasteskill 정합)을 확보한다. 상세 페이지·메인 랜딩은 G2/G3.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 이름 | **Specimen** (repick/RE:픽 제거) |
| 태그라인 | EN(기본) "Interface design systems, auto-evolved for AI agents." / KO "AI 에이전트를 위한 인터페이스 디자인 시스템 — 매일 스스로 진화." |
| 레이아웃 | refero식 — 단일 통합 카드 그리드 + 검색 + 필터 칩 (카테고리 탭 분리 폐기) |
| i18n | 기본 영문 + EN/KO 토글(localStorage), 크롬+카드 desc 이중언어 |
| 미리보기 | 기존 iframe(웹)·img(네이티브) 유지(정적 썸네일 생성은 비범위) |

## 3. i18n (기본 영문 + 한/영 토글)

- 신규 `app/src/app/gallery/gallery-i18n.ts`: `type Lang = "en" | "ko"`; `STRINGS: Record<Lang, {...}>` — 크롬 문자열(워드마크 태그라인, 검색 placeholder, 필터 라벨 All/Dashboard/Landing/Free/Native/Winners, 채택/탈락/대기 배지, "N works" 등) 사전. `DEFAULT_LANG = "en"`.
- **상태**: `GalleryClient`에 `const [lang, setLang] = useState<Lang>("en")`. `useEffect`로 마운트 시 `localStorage.getItem("specimen-lang")` 읽어 반영(하이드레이션 안전 — 서버·초기 페인트는 `en`, 저장값 있으면 클라이언트에서 전환). 토글 시 `setLang` + `localStorage.setItem`.
- **토글 UI**: 헤더 우측 `EN / KO` 세그먼트(현재 언어 강조, `aria-pressed`).
- **카드 desc**: `work.desc[lang]`.

## 4. 데이터 모델 — works.ts

- `Work.desc: string` → **`Work.desc: { en: string; ko: string }`**. 기존 ~61작품 전부 `en` 신규 작성(현 한글 → 영문 번역, 카드 태그라인 품질로). `ko`는 기존 문자열 이관.
- `Work`에 `category` 추가 안 함 — **page.tsx 조립 시 태깅**(각 배열 → `{...w, category}`)해 61 entry 개별 편집 회피. (단 desc는 개별 편집 불가피.)
- **de-brand**: `v0` brand `"RE:픽 — 챔피언"` → `"V0 — 챔피언 랜딩"`(제네릭), desc의 "RE:픽/repick" 문자열 제거. 그 외 작품 brand는 유지(영문 코드네임·V/d 라벨).
- `evolveWorks()`(page.tsx) 동적 생성 desc도 `{en, ko}` 형태로.

## 5. page.tsx — 단일 works + category

- 기존 `categories`(landing/dash/free/native 탭 배열) 폐기. 대신 **단일 works 배열** 조립: `[...LANDING_WORKS.map(w=>({...w,category:"landing"})), ...DASH_WORKS.map(..."dashboard"), ...FREE_WORKS.map(..."free"), ...NATIVE_WORKS.map(..."native"), ...evolveWorks()]`. `GalleryClient`에 `works` + `lastUpdated` 전달.
- 메타데이터 `title` → `"Specimen — Interface design systems for AI agents"`.

## 6. gallery-client.tsx — refero 헤더·검색·필터·통합 그리드

- **헤더**: 워드마크 **Specimen** + 태그라인(lang) + 우측 EN/KO 토글. 화이트 배경, 에디토리얼 타이포 위계.
- **검색바**: `useState(query)` — 작품 이름(brand)·desc(현재 lang) 대소문자 무시 부분일치 필터.
- **필터 칩**: `All · Dashboard · Landing · Free · Native · Winners`(status winner). `useState(filter)`. 칩 클릭 → 해당 category(또는 winners) 만. All=전체.
- **통합 카드 그리드**: 검색·필터 적용된 works를 refero식 반응형 그리드(`grid` 3~4열, `gap` 넉넉)로. 카테고리 탭·groupByRound·CollectionMark·winnersOnly 세그먼트 제거(단일 그리드로 대체).
- 상단 요약: "Specimen · N works · Rev <lastUpdated>"(lang).
- a11y: 검색 `role=searchbox`/label, 필터 칩 `aria-pressed`, 결과 그리드 `aria-live`(검색 결과 수 안내).

## 7. work-card.tsx — refero 카드

- 상단 **미리보기**(기존 iframe 웹 / img 네이티브 — S3a 분기 유지) + 하단 정보: **이름**(brand) + **태그라인**(`desc[lang]`) + **태그 칩**(카테고리 라벨 + 채택 배지). 은은한 보더·라운드, hover 리프트(기존 유지). `href={work.route}`.
- StatusBadge(채택/탈락/대기)는 lang 반영. 태그 칩 스타일 refero식(작은 pill, 뉴트럴).

## 8. 검증

1. **빌드·렌더**: `cd app && npx next build` 성공 → `/gallery` 200, "Specimen" 워드마크·통합 그리드·검색·필터칩 노출, repick/RE:픽 문자열 0(`curl | grep -c "repick\|RE:픽"` = 0).
2. **i18n**: 기본 EN 렌더(태그라인·필터·desc 영문), EN/KO 토글 시 크롬+카드 desc 전환, localStorage 지속. 하이드레이션 경고 없음.
3. **검색·필터**: 이름/desc 검색으로 결과 좁혀짐, 필터 칩(카테고리·Winners) 동작, All=전체(~61).
4. **미리보기 회귀**: 웹 iframe·네이티브 img 카드 렌더 불변.
5. **a11y**: Lighthouse a11y ≥95(갤러리 도그푸딩 유지), 검색·필터·토글 키보드/aria.
6. **비회귀**: `npm test` 45/45. gate.mjs·SKILL·개별 작품 라우트(page.tsx들) 무변경 — 변경 = `works.ts`·`page.tsx`·`gallery-client.tsx`·`work-card.tsx` + 신규 `gallery-i18n.ts`. 프로덕션 200.

## 9. 비범위

- **G2 상세 페이지**(클릭 시 refero design-system spec·Agent Prompt Guide) → 후속.
- **G3 메인 랜딩**(tasteskill 히어로) → 후속.
- 정적 썸네일 생성(iframe 유지) · 검색 서버사이드/퍼지 · 작품 자체 디자인 수정.
- collection-mark.tsx 제거 여부: 통합 그리드로 미사용 시 정리(구현 판단).
