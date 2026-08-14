---
name: design-evolve
description: 디자인 진화 루프 1회 실행 — 볼트 지식으로 반응형 Next.js 랜딩 후보 N개 생성 → 자동 채점(perf/a11y/블라인드 비평) → 상위 2~3개 사람에게 제시 → 최종 선택을 볼트/ledger에 기록. "디자인 생성", "랜딩 후보 뽑아줘", "/design-evolve" 시 사용. 인자: 타깃(기본 landing), N(기본 3).
---

# Design Evolve — 5단계 루프

인자: `$TARGET`(기본 `landing`), `$N`(기본 3). 볼트 루트 `vault/`, 앱 `app/`(Next.js src-dir → 페이지는 `app/src/app/...`).

## 1. RETRIEVE
- `vault/00-principles/design-principles.md` 전문을 읽는다(현재 디자인 DNA).
- `vault/10-references/`에서 `$TARGET` 관련 참조 3~5개를 읽는다. 부족하면 Refero 커뮤니티 MCP(`refero_search`로 `$TARGET` 스타일 검색 → `refero_design_md`로 DESIGN.md 획득)로 조회해 `vault/10-references/<brand>.design.md`로 캐시 후 읽는다.
- `node scripts/design-loop.mjs`의 `recentDecisions(5, "vault/30-ledger/design-ledger.jsonl")` 결과를 컨텍스트에 포함(최근 학습 반영). 예:
  `node -e "import('./scripts/design-loop.mjs').then(m=>console.log(JSON.stringify(m.recentDecisions(5,'vault/30-ledger/design-ledger.jsonl'))))"`
- run 디렉토리 생성: `newRun($TARGET, "vault/20-generations", <오늘 YYYY-MM-DD>)`.

## 2. GENERATE
- `designer`(또는 `frontend-design-specialist`) 에이전트를 $N회 병렬 호출. 각 호출에 RETRIEVE 컨텍스트(원칙+참조+최근 결정)를 전달하고 서로 다른 방향을 지시(예: A=여백 중심, B=대비 중심, C=타이포 중심).
- 각 후보를 `app/src/app/candidates/<run>/<variant>/page.tsx`로 저장(반응형, Tailwind, 원칙의 토큰 사용). variant ∈ {a,b,c...}.
- 각 후보 소스 사본과 한 줄 컨셉을 `vault/20-generations/<run>/candidates/<variant>.md`에 기록.

## 3. AUTO-SCORE (자동 1차 필터)
- `app`에서 dev 서버를 백그라운드로 띄운다. 각 후보 URL에 대해:
  - 객관: `/perf-audit http://localhost:3000/candidates/<run>/<variant>` (Lighthouse: Perf/LCP/CLS/TBT).
  - 접근성/UX: `/web-design-guidelines`로 후보 소스 감사(위반 수).
  - 토큰 준수: 후보에서 쓰인 색상 hex가 `design-principles.md` Color Tokens 안에 있는지 점검(벗어난 hex 개수).
- 심사: `comparator` 에이전트로 후보들을 블라인드 A/B 랭킹 + `design-principles.md` 대조 비평(한 줄씩).
- 위 결과를 표로 `vault/20-generations/<run>/SCORES.md`에 기록하고 종합 상위 2~3개를 선정. dev 서버는 종료.

## 4. HUMAN GATE
- 사용자에게 상위 2~3개만 제시: 각 후보의 렌더 URL + 점수 요약 + 심사 한 줄. `npm run dev`로 직접 보라고 안내.
- 사용자의 승자 선택 + 한 줄 이유를 받는다. (사용자 응답 없이 다음 단계로 진행 금지.)
- `vault/20-generations/<run>/DECISION.md`에 승자/이유/탈락 사유를 기록.

## 5. LEARN
- 승자의 "이유"에서 재사용 가능한 규칙을 1개 추출해 `design-principles.md`를 surgical하게 갱신(있으면 강화, 없으면 추가). 무관한 부분은 건드리지 않는다.
- ledger append:
  `node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({run:'<run>',candidate:'<variant>',won:true,reason:'<한 줄>',metrics:{perf:0,a11y:0,lcp_ms:0},principle_delta:'<추가/강화한 규칙>'},'vault/30-ledger/design-ledger.jsonl'))"`
- `00-principles/MEMORY.md`에 한 줄 추가(200줄 cap 유지).
- 승자 페이지를 `app/src/app/page.tsx`로 승격(현재 최선의 랜딩).
- 완료 요약을 사용자에게 보고: 무엇이 이겼는지, 원칙이 어떻게 바뀌었는지.

## 금지
- 사람 선택 없이 원칙/ledger를 갱신하지 않는다(사람이 최종 신호).
- 과거 ledger entry 수정 금지(append-only).
- 요청 타깃 외 페이지 생성 금지(랜딩 루프 검증 우선).
