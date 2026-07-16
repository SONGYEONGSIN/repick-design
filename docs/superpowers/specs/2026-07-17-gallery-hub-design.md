# 통합 갤러리 `/gallery` — 설계

- 날짜: 2026-07-17
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 목적: 랜딩·SaaS 대시보드·자유 창작·자율 루프 후보로 흩어진 40여 개 페이지 결과물을 **1개 페이지에서 카테고리 구분해 열람**.

## 1. 확정된 결정

| 결정 | 선택 |
|---|---|
| 라우트 | `/gallery` 신설 (main — 프로덕션 노출) |
| 미리보기 | 라이브 iframe 축소 카드 (기존 /dash 방식 계승) |
| 데이터 | 중앙 레지스트리 `app/src/lib/works.ts` 단일 출처 |
| 시각 방향 | **전시 도록 카탈로그** — 순백 라이트, 도록 번호 체계, 거대 활자 인덱스 |
| 부하 제어 | 선택된 카테고리 탭의 카드만 마운트 + iframe lazy |

## 2. 정보 구조

### 카테고리 (탭 4개, 도록 목차 표기 Ⅰ~Ⅳ)
1. **Ⅰ 랜딩** — 챔피언 `/` + `/v1`~`/v5` + `/lab`
2. **Ⅱ SaaS 대시보드** — `/dash/d7~d32` 16종 + `/dash-rg`(Ridge) + 제품 대시보드
3. **Ⅲ 자유 창작** — `/free/f1`~`/f17`
4. **Ⅳ 자율 루프 후보** — `/dash-evolve/r<N>/<v>` (동적: 아래 §4)

구현 시 라우트 인벤토리를 전수 확인해 실험/중복 라우트(`/pages/dashboard`, `(app)/dashboard` 등)는 포함/제외를 판단하고 레지스트리 주석에 사유를 남긴다.

### 중앙 레지스트리 `app/src/lib/works.ts`
- entry: `{ id, route, brand, desc, category, previewHeight?, scale? }`.
- 기존 `/dash/page.tsx`의 16종 배열과 `/free/page.tsx` 인덱스 배열을 이 파일로 이전하고, 두 페이지는 import만 하도록 수정(렌더 결과 불변 — 회귀 기준).
- 랜딩 v1~v5·lab·dash-rg 등은 신규 등재(한 줄 컨셉은 git 히스토리·기존 문서에서 발췌).

## 3. 시각 디자인 — 전시 도록 카탈로그 (STELE·LINEAGE 계보)

- **테마**: 순백 라이트 고정(`bg-white`/`zinc-50`, 다크모드 없음 — 도록은 지면). 헤어라인 `zinc-200`, 텍스트 zinc-900/600/500, 강조 잉크 1색(채도 절제).
- **헤더(도록 표지)**: 거대 활자 컬렉션 타이틀 + 발행 정보풍 메타 라인(총 작품 수·카테고리 수는 레지스트리 배열 길이에서 산출, 최근 갱신일은 레지스트리에 상수 문자열로 기록 — `new Date()`/`Date.now()` 동적 호출 금지, brief 결정론 규칙 준수).
- **목차(탭)**: Ⅰ~Ⅳ 로마 숫자 + 카테고리명 + 작품 수(tabular). active는 잉크 밑줄, 키보드 접근 가능(role=tablist, aria-selected).
- **작품 카드**: 흰 카드 + 헤어라인 보더, 상단 라이브 iframe 미리보기(1440px 기준 축소, 카테고리별 previewHeight — 랜딩은 상단부 위주), 하단 캡션 존: 도록 번호 배지(mono tabular — d7·f12·r3/a), 작품명(굵게), 한 줄 컨셉. hover 시 보더 진해짐 + 캡션 2줄 확장(line-clamp 해제). 카드 전체가 링크(새 탭 아님, 같은 탭 이동).
- **타이포 규율**: Pretendard 단일(전역 font-sans), 레이블 11px uppercase tracking 통일, 숫자 tabular-nums. 세리프·장식 폰트 금지.
- **그리드 크래프트**: 12-col 리듬, 카드 그리드 아이템 `min-w-0`, 390~1920 전 폭 오버플로 금지(여유 ≥16px) — brief v3 검증 룰 준수.

## 4. 자율 루프 후보 탭 (동적)

- `/gallery/page.tsx`는 **서버 컴포넌트**: `fs`로 `src/app/dash-evolve/` 하위 `r*/<variant>/page.tsx` 존재를 열거해 entry를 런타임 생성(라벨 `r<N>/<v>`, desc 없음 — vault 메타는 비범위).
- 디렉토리가 없으면(=main·프로덕션) 탭 자체를 렌더하지 않는다 — 깨진 링크 원천 차단. evolve/dash 체크아웃 로컬에선 자동 노출.

## 5. 기술 구조

| 파일 | 역할 |
|---|---|
| `app/src/lib/works.ts` | 레지스트리(카테고리별 배열 export) — 단일 출처 |
| `app/src/app/gallery/page.tsx` | 서버 컴포넌트 — 레지스트리 + evolve fs 스캔 → 클라이언트에 전달 |
| `app/src/app/gallery/gallery-client.tsx` | `'use client'` — 탭 상태, 선택 탭만 카드 그리드 마운트 |
| `app/src/app/gallery/work-card.tsx` | 도록 카드 (iframe 미리보기 + 캡션) |
| `app/src/app/dash/page.tsx` · `app/src/app/free/page.tsx` | 배열 제거, works.ts import로 교체 (렌더 불변) |

## 6. 검증

1. `cd app && npx next build` 통과.
2. `node scripts/dash-sweep.mjs --base http://localhost:3100 --routes /gallery` — 전 폭 오버플로 0.
3. `node scripts/dash-static-check.mjs app/src/app/gallery/*.tsx app/src/lib/works.ts` — 위반 0.
4. 회귀: `/dash`·`/free` 200 + 카드 수 불변(레지스트리 이전 전후 동일).
5. 탭 전환 시 미선택 카테고리 iframe이 DOM에 없음(개발자 도구/HTML 확인) — 부하 제어 검증.

## 7. 비범위

- 검색/필터/정렬, 정적 스크린샷 썸네일.
- evolve 후보의 vault 메타(judge 판정·승자 표시) 연동.
- `/dash`·`/free` 기존 페이지의 시각 개편(레지스트리 import 교체만).
- 갤러리 자동 갱신 훅(자율 루프가 승격 시 레지스트리 갱신은 주간 apply 절차에서 사람이 확인).
