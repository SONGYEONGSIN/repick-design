# Specimen 갤러리 — G2: 작품 상세 페이지 (refero MVP)

- 날짜: 2026-07-25
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: `/gallery` 개편 → Specimen(AI 에이전트용 디자인 시스템 갤러리). 선행 = G1(그리드+정체성+i18n) ✅ 병합. 이 문서는 **G2**(작품 상세 페이지)만. 후속 = G3(메인 랜딩).

## 0. 상위 맥락

| # | 하위 | 상태 |
|---|---|---|
| G1 | 갤러리 그리드 refero식 + Specimen + i18n | ✅ 병합 |
| **G2** | **작품 상세 페이지 (refero design-system spec MVP)** | ← 이 문서 |
| G3 | 메인 랜딩 (tasteskill 히어로) | 후속 |

## 1. 목표

Specimen 갤러리에서 작품 카드 클릭 시 **styles.refero.design/style/<id> 느낌의 상세 페이지**로 이동한다 — 큰 미리보기 + 디자인 시스템 스펙(팔레트·타이포·스페이싱) + Do/Don't + **Agent Prompt / DESIGN.md**(핵심 — AI 에이전트가 이 디자인을 재현하는 프롬프트) + More like this. 작품별 데이터는 **하이브리드**(기계 추출 + LLM 해석)로 생성해 정적 저장한다.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 데이터 소스 | **하이브리드** — 기계(Tailwind/tokens→hex 팔레트·스페이싱, 전 작품 baseline) + LLM(팔레트 역할·철학·Do/Don't·Agent Prompt, 서브셋 rich) |
| 첫 컷 범위 | **집중 MVP** — 핵심 섹션만, **서브셋 ~15 먼저** rich 생성(나머지 baseline만·후속 배치). 다형식 탭(Tailwind/CSS Vars/Tokens)·컴포넌트 섹션 비범위 |
| 심층 스펙 언어 | **영문 전용**(AI 에이전트 대상·refero 정합). 상세 페이지 크롬 헤더/라벨만 gallery-i18n 이중언어 |
| 서브셋(15) | dash 10(d29·d30·d31·d32·d33~d38) + landing 4(v0·v6·v7·v8) + native 1(n1) |
| 라우트 | `/gallery/[id]` 동적 페이지. work-card → 상세로. 상세에서 "View live" → work.route |

## 3. 데이터 파이프라인 (하이브리드)

### 3.1 기계 추출 — `scripts/extract-palette.mjs` (신규, 전 작품 baseline)
- 각 작품의 소스(웹: `app/src/app/<route>/**/*.tsx`; native: `native/src/**` + `tokens.ts`) 파싱.
- **팔레트**: Tailwind 색 클래스(`(bg|text|border|ring|fill|stroke)-<color>-<shade>`) 수집 → Tailwind 기본 색맵으로 hex 변환(고정 맵 내장), 빈도순 정렬. native는 tokens.ts hex 직접.
- **스페이싱**: 4/8 리듬(공통 DNA) + 관측된 radius 클래스.
- 결정론(입력 동일 → 출력 동일). 출력 = 작품별 `{ palette: {hex,count,klass}[], radius, ... }`.

### 3.2 LLM 해석 — 배치(서브셋 15, 1작품당 1 에이전트)
- 입력: 작품 소스 경로 + 대표 스크린샷(갤러리 미리보기 캡처 or 라이브 iframe 참조) + 3.1 baseline 팔레트 + (있으면) 생성 기록(DECISION/컨셉).
- 출력(영문): `philosophy`(1~2문장) · `palette` 역할·용도(baseline hex에 role/desc 부여) · `typography`(글꼴·위계) · `dosDonts`({do,dont}[]) · **`agentPrompt`**(이 디자인을 재현하는 DESIGN.md/프롬프트, 마크다운) · `similar`(같은 카테고리 힌트).
- **결정론 주의**: LLM은 비결정. 출력을 **정적 파일로 커밋**해 이후 빌드는 재생성 안 함(1회성).

### 3.3 저장 — `app/src/lib/specimen-specs.ts` (생성·커밋)
- `export const SPECS: Record<string, WorkSpec>` — baseline(전 작품) + rich(서브셋 병합). 상세 페이지는 이걸 읽어 렌더(런타임 추출·LLM 없음).

## 4. 스펙 데이터 shape

```ts
export type Swatch = { hex: string; role?: string; usage?: string }; // role/usage는 rich만
export type WorkSpec = {
  id: string;
  palette: Swatch[];               // baseline: hex만; rich: role/usage 포함
  radius?: string; spacingBase?: string;
  rich?: {                          // 서브셋만
    philosophy: string;             // EN
    typography: string;             // EN
    dosDonts: { do: string; dont: string }[]; // EN
    agentPrompt: string;            // EN, 마크다운(재현 DESIGN.md)
  };
};
```

## 5. 상세 페이지 — `app/src/app/gallery/[id]/page.tsx`

- **동적 라우트** `/gallery/[id]`. `generateStaticParams`로 전 작품 id 정적 생성. `id`로 works(단일 배열) + `SPECS[id]` 조회, 없으면 `notFound()`.
- **레이아웃**(refero MVP, 화이트 에디토리얼):
  - **브레드크럼**: `Specimen / <카테고리>` + 뒤로.
  - **히어로 미리보기**: 큰 iframe(웹 `work.route`) / img(네이티브 `work.image`), + 이름·태그라인(desc[lang]) + **"View live"**(→ work.route).
  - **Palette**: 스와치 그리드(hex + role·usage(rich) + **Copy** 버튼(hex 복사)).
  - **Typography / Spacing**: 공통 DNA(Pretendard·4/8 리듬) + rich typography.
  - **Guidelines (Do / Don't)**: rich `dosDonts` 2열. (baseline만이면 섹션 생략.)
  - **Agent Prompt / DESIGN.md**: rich `agentPrompt` 마크다운 렌더 + **Copy** 버튼. (핵심 — "recreate with an AI agent".)
  - **More like this**: 같은 category 작품 3~4 카드(G1 WorkCard 재사용, `/gallery/<id>` 링크).
  - **baseline만 작품**: 팔레트·미리보기·More like this + "Full spec coming soon" 배지(rich 섹션 생략).
- **i18n**: 섹션 헤더/라벨(Palette·Typography·Guidelines·Agent Prompt·More like this·View live·Copy·Full spec coming soon)은 `gallery-i18n.ts` STRINGS 확장(EN/KO). rich 본문(philosophy·dosDonts·agentPrompt)은 **영문 고정**.
- 클라이언트 상호작용(Copy 버튼·lang)은 작은 client 컴포넌트로 분리(페이지는 서버).

## 6. 카드 라우팅

- `work-card.tsx`: `href={work.route}` → **`href={`/gallery/${work.id}`}`**(상세로). (개별 라이브 작품은 상세의 "View live"에서.)

## 7. 검증

1. **기계 추출 결정론**: `node scripts/extract-palette.mjs` 2회 실행 동일 출력. 서브셋+비서브셋 작품 팔레트 hex 산출(d29 등 Tailwind→hex 정합).
2. **서브셋 상세**: `/gallery/d29`·`/gallery/v6`·`/gallery/n1` 등 렌더 — 미리보기·팔레트(role/Copy)·Do/Don't·**Agent Prompt**(copy 가능)·More like this. 영문 심층 스펙.
3. **baseline 작품**: 서브셋 아닌 작품(예 `/gallery/d7`) — 팔레트·미리보기·"Full spec coming soon", rich 섹션 없음, 에러 없음.
4. **라우팅**: 갤러리 카드 클릭 → `/gallery/<id>`, "View live" → work.route. 없는 id → 404.
5. **i18n**: 상세 크롬 EN/KO 토글, rich 본문 영문 고정.
6. **비회귀**: `cd app && npx next build`(전 작품 상세 정적 생성) · `npm test` 통과 · Lighthouse a11y ≥95 · gate.mjs·SKILL 무변경 · 프로덕션 200.

## 8. 비범위

- 다형식 탭(Preview/DESIGN.md/Tailwind v4/CSS Vars/Design Tokens) · 컴포넌트 스펙 섹션 → 후속.
- 나머지 ~46작품(f*·v1~v5·d7~d28 중 서브셋 외) rich 배치 → 후속(파이프라인 재사용).
- 심층 스펙 KO 번역 → 후속(현재 영문 고정).
- 정적 스크린샷 생성(라이브 iframe 유지) · 개별 작품 페이지 de-brand(G1과 동일 범위 밖).
