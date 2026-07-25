# Specimen 갤러리 — 정리 + 도메인 카테고리 + 브랜드 마크 (G2.5)

- 날짜: 2026-07-25
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: `/gallery` → Specimen 개편. 선행 = G1(그리드+i18n)·G2(상세페이지) ✅ 병합. 이 문서는 **G2.5 정리·브랜딩 패스**. 후속 = G3(메인 랜딩).

## 1. 목표

Specimen 갤러리를 **큐레이션된 15작품**(전부 풀 상세 스펙 보유)으로 과감히 정리하고, 필터를 **타입(dashboard/landing/…) → 도메인/목적 기반**으로 재구성하며, 브라우저 탭·헤더 로고를 낡은 "RE:" 마크에서 **Specimen 브랜드 마크**로 교체한다.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 정리 범위 | **60 → 15** (풀 스펙 보유작만): dash d29~d38, landing v0·v6·v7·v8, native n1 |
| 정리 방식 | 갤러리 delist(works.ts) **+ 라우트 디렉토리 삭제** (참조 없음 확인된 것만) |
| 카테고리 | 타입 → **7 도메인**: Project · Scheduling · Ops · Finance · Analytics · Landing · Mobile |
| Winners 칩 | **제거** (정리 후 15 전부 선별작) |
| 로고 | 미니멀 레터마크 — zinc-900 라운드 타일 + 흰 "S" |

## 3. 작품 정리 (60 → 15)

### 3.1 유지 (15, 도메인 부여)
| id | 작품 | 도메인 `category` |
|---|---|---|
| d29 | Waypoint (project collab) | `project` |
| d33 | Keel (kanban pipeline) | `project` |
| d30 | Slotted (scheduling) | `scheduling` |
| d31 | Conduit (workflow automation) | `ops` |
| d34 | Pulse (SLA live-ops) | `ops` |
| d38 | Wavelength (on-call rotation) | `ops` |
| d32 | Meridian (asset portfolio) | `finance` |
| d35 | Tessera (allocation treemap) | `finance` |
| d36 | Chute (conversion funnel) | `analytics` |
| d37 | Currents (revenue Sankey) | `analytics` |
| v0 | Champion editorial landing | `landing` |
| v6 | Reveal (before/after) | `landing` |
| v7 | Comparison table | `landing` |
| v8 | Dial gauge | `landing` |
| n1 | Notification center (mobile) | `mobile` |

### 3.2 works.ts 편집
- `LANDING_WORKS` → v0·v6·v7·v8만 (v1~v5 제거). 각 entry에 `category`.
- `DASH_LAB_WORKS` → d29~d38만 (d7~d28 제거). 각 entry에 `category`.
- `DASH_WORKS` → catalogWorks(3.3)가 DASH_LAB만 쓰고 `/dash` 인덱스도 `DASH_LAB_WORKS`를 import하므로 **소비처 0** → `DASH_WORKS` export·`rg`(Ridge)·`app`(/dashboard) entry **삭제**(정리 태스크). `/dashboard` 라우트는 works.ts entry와 독립이라 유지됨.
- `FREE_WORKS` → **삭제**(export 제거, /free 인덱스 삭제와 동반).
- `NATIVE_WORKS` → n1 유지, `category: "mobile"`.
- `Work.category` 타입 재정의: `"project"|"scheduling"|"ops"|"finance"|"analytics"|"landing"|"mobile"`.

### 3.3 catalogWorks() (works.ts)
- 자동 태깅(`.map(w=>({...w, category:"…"}))`) 제거 — 각 entry가 자기 `category`를 가지므로 **`[...LANDING_WORKS, ...DASH_LAB_WORKS, ...NATIVE_WORKS]`** 스프레드만. (DASH_WORKS 아님 — `app` 제품 링크는 갤러리에서 제외됨.) 결과 = 정확히 15작품.

### 3.4 라우트 디렉토리 삭제 (참조 0 확인됨)
- `app/src/app/free/` (전체 — f1~f30 + 인덱스)
- `app/src/app/dash/{d7,d9,d12,d16,d20,d22,d23,d24,d25,d26,d27,d28}/`
- `app/src/app/dash-rg/`
- `app/src/app/(marketing)/{v1,v2,v3,v4,v5,lab}/`

### 3.5 삭제 안 함 (load-bearing)
- `app/src/app/(marketing)/page.tsx`·`landing-client.tsx`·`layout.tsx` — 챔피언 랜딩 `/`(=v0 본체) + 공유.
- `app/src/app/(app)/dashboard/` (`(app)` 라우트 그룹 — URL은 `/dashboard`) — v0 CTA(`href="/dashboard"` 4곳) 대상. 갤러리에서만 제외(works.ts `app` entry 삭제), 라우트 유지.
- `app/src/app/dash/page.tsx` (/dash 인덱스) — 유지. 잔존 10작품만 표시(imports 정합 확인).
- dash/d29~d38, (marketing)/v6·v7·v8, native.

### 3.6 파급
- `gallery/page.tsx` — `evolveWorks()` 유지. `catalogWorks()` 시그니처 불변(반환만 축소).
- `/free` 인덱스 삭제로 `FREE_WORKS` 소비처 소멸 확인. `/dash` 인덱스가 `DASH_WORKS`/`DASH_LAB_WORKS` 중 무엇을 import하는지 확인해 컴파일 정합 유지.
- 상세 "coming soon" 분기: 15 전부 스펙 보유라 미실행 → **유지**(향후 스펙 없는 작품 안전망, harmless).

## 4. 도메인 카테고리 (필터 칩)

- `gallery-i18n.ts`: `FilterKey` 재정의 `"all"|"project"|"scheduling"|"ops"|"finance"|"analytics"|"landing"|"mobile"`. `winners` 제거.
- `STRINGS.en/ko`의 `filters` 사전 갱신 (EN: Project/Scheduling/Ops/Finance/Analytics/Landing/Mobile; KO: 프로젝트/일정/운영/금융/분석/랜딩/모바일). `categoryLabel()` 정합.
- `gallery-client.tsx`: `FILTERS` 배열 = `["all", …7도메인]`. `winners` 필터 분기 제거. 검색·`aria-live`·그리드 로직 불변.
- `work-card.tsx`: 카테고리 칩(`categoryLabel`)은 유지. **StatusBadge 유지**(승격작 provenance — 범위 최소화, 칩만 제거).

## 5. Specimen 로고/파비콘 (미니멀 레터마크)

- **`app/src/app/icon.svg` 교체** (현재: `rx=22` 주황 `#C2410C` 타일 + 흰 "RE:"):
  - 새 마크: `viewBox 0 0 100 100`, `rx=22` **zinc-900 `#18181b`** 타일 + 흰 `#ffffff` 대문자 **"S"** (기하학적/모노 그로테스크, `font-weight 700`, 광학 센터링). 에디토리얼·Specimen 워드마크 정합, 라이트/다크 탭 대비 확보.
- **`app/src/app/favicon.ico`** (RE: 25931B): 삭제 → Next가 `icon.svg`를 파비콘으로 서빙 (또는 icon.svg 기반 재생성). 삭제 후 브라우저 탭에 새 마크 확인.
- **갤러리 헤더 워드마크**(gallery-client): "Specimen" 텍스트 좌측에 동일 "S" 타일 마크(약 28~32px) 배치(선택 — 워드마크 정체성 강화). a11y: `aria-hidden`(장식) + 워드마크 텍스트 유지.

## 6. 검증

1. **빌드**: `cd app && npx next build` 성공 — `/gallery` 200, 카드 15개, `/gallery/<id>` 15 상세 SSG. 삭제로 정적 페이지 수 감소.
2. **카테고리**: 필터 칩 All+7도메인 노출, 각 칩이 해당 도메인만 필터, Winners 칩 부재. i18n EN/KO 토글.
3. **정리 검증**: `/free`·`/lab`·`/v1`·`/dash-rg`·`/dash/d7` = 404(삭제됨). `/`(챔피언)·`/dashboard`(CTA 대상)·`/dash`(인덱스 10)·`/gallery/d29` = 200. 삭제 라우트 내부링크 0(grep).
4. **로고**: `/gallery` 탭 파비콘이 Specimen "S" 마크(RE: 아님), 헤더 마크 렌더(배치 시). curl `icon.svg`에 "RE:" 문자열 0.
5. **비회귀**: `node --test "scripts/**/*.test.mjs"` 통과(삭제가 스크립트 테스트에 영향 없는지 — gate/static-check가 dash/*를 스캔하면 잔존 10만 대상). works.ts 타입 tsc 0. 프로덕션 배포 후 200.

## 7. 비범위

- G3 메인 랜딩(tasteskill) → 후속.
- 나머지 ~46작품 rich 스펙 배치 → **불필요해짐**(정리로 제거).
- `/dashboard`·`/dash` 인덱스 자체의 de-brand/개편 → 별도(개별 작품 라우트, G2.5 범위 밖).
- StatusBadge·`status` 필드 제거 → 하지 않음(칩만 제거, 최소 변경).
- 삭제 작품 git 복구는 히스토리에 보존(되돌리기 가능).
