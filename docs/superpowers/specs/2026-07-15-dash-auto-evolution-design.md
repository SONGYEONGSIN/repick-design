# dash 루프 완전 자율 진화 (층 2) — 설계

- 날짜: 2026-07-15
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 선행 논의: 층 1(회전 자동화) vs 층 2(선별까지 자동화) 중 층 2 선택. R2~R7 랜딩 자율 라운드(`vault/30-ledger/AUTO-RUN-LOG.md`) 전례를 dash 루프에 격리·반증 장치를 더해 이식.

## 1. 배경과 목표

repick-design의 dash 루프는 지금까지 생성(자동)→선별(사람)으로 진화해 왔다. 이 설계는 선별(HUMAN GATE)을 AI judge 패널로 대체해 **무인 자율 진화**를 가능하게 하되, 사람의 취향이라는 외부 신호를 잃지 않도록 두 가지 장치를 넣는다:

1. **잠정 격리 + 주기 반증** — 자율 학습(delta)은 정본 brief를 직접 갱신하지 않고 격리 파일에만 쌓이며, 주 1회 사람이 일괄 승인/기각해야 정본에 편입된다. 취향 표류(model collapse)가 정본을 오염하지 못한다.
2. **지식 정제 게이트 + meta-기준 학습** — 유사/충돌 delta를 스스로 랭킹하되, 판단이 불확실하면 질문을 강제 생성한다. 사용자의 답 자체를 "어떤 기준으로 지식을 정제하는가"(meta-기준)로 축적해, 질문 없이 스스로 판단하는 범위가 매주 넓어진다.

## 2. 확정된 결정 사항

| 결정 | 선택 |
|---|---|
| 대상 루프 | dash (대시보드) — landing이 아님 |
| 학습 반영 | 잠정 격리 + 주기 반증 (즉시 반영 금지) |
| 기동 방식 | GitHub(private) 푸시 + 클라우드 routine (`/schedule`) |
| 심사 체계 | 하드게이트(자동 탈락) + 스크린샷 3렌즈 judge 패널 다수결 |
| git 반영 | `evolve/dash` 브랜치 누적 + 주 1회 반증 PR → squash merge |
| 주기 | 매일 밤 1라운드, 주 1회 반증 |

## 3. 전체 구조

```
[매일 밤, 클라우드 routine]                  [주 1회, 사람 + 반영 세션]
RETRIEVE → GENERATE(3) → HARD GATE          반증 PR 리뷰:
→ JUDGE 패널(3렌즈) → LEARN(격리)            ├ 후보 킵/드롭 → /dash 갤러리 승격
→ 지식 정제 게이트(질문 생성)                 ├ delta 승인/기각 → brief v3 편입
→ evolve/dash 커밋                          └ 질문 답변 → meta-기준 축적
```

- 정본 `vault/00-principles/dash-brief-v3.md`는 자율 라운드가 **절대 수정하지 않는다**.
- 라운드는 서로 독립 — 한 라운드 실패가 다음 라운드를 막지 않는다.

## 4. 라운드 파이프라인 (신규 스킬 `.claude/skills/dash-evolve/SKILL.md`)

### 4.1 RETRIEVE
- 정본 brief v3 전문.
- `vault/00-principles/dash-deltas-provisional.jsonl` (격리 delta 전체).
- `vault/00-principles/curation-criteria.md` (meta-기준 — judge·정제 프롬프트에 주입).
- `vault/30-ledger/dash-auto-ledger.jsonl` 최근 항목 (직전 라운드 학습·no-winner 탈락 사유 포함).
- 기존 `/dash` 갤러리 14종 + evolve/dash 브랜치 누적분의 레이아웃 아키타입 목록 (중복 금지용).

### 4.2 GENERATE
- designer 계열 에이전트 3병렬, 각자 서로 다른 레이아웃 아키타입을 명시 지시.
- 산출물은 `app/src/app/dash-evolve/r<N>/<variant>/page.tsx` — **격리 route**. 기존 `/dash` 갤러리는 승격 전까지 오염되지 않는다.

### 4.3 HARD GATE (자동 탈락 — 하나라도 실패 시 심사 진출 불가)
1. **그리드 sweep** (`scripts/dash-sweep.mjs`): playwright로 1280/1366/1440/1536/1680/1920 + 모바일 390 폭에서 pageOverflow/tableOverflow 실측, 여유 ≥16px. 실패 후보는 **1회 자체 수정 기회** 후 재실패 시 탈락.
2. **정적 검사**: Pretendard 단일 폰트(+ tabular-nums, mono는 코드성 데이터만), 순백 라이트, brief 팔레트 준수 (벗어난 hex 개수 0).
3. **Lighthouse**: 후보 route perf ≥80, a11y ≥95 (R2~R7 실측 분포 perf 83~91 / a11y 95 기반). 클라우드에서 Lighthouse 불가 시 playwright 기반 대체 지표(§7)로 폴백.

### 4.4 JUDGE 패널
- 생존 후보의 다중 폭 스크린샷을 캡처, 파일명·순서를 익명화(a/b/c)해 편향 차단.
- 3렌즈 심사위원 병렬: ① 브리프 준수 ② 시각 완성도(상용 SaaS — Mercury/Asana/n8n/Coinbase 대비) ③ 아키타입 차별성.
- 다수결로 승자 결정. **전원 탈락 판정 허용** — 억지 승자를 만들지 않고 no-winner 라운드로 기록하며, 탈락 사유를 다음 라운드 RETRIEVE에 전달한다(실패도 학습).

### 4.5 LEARN (격리)
- 승자 판정 사유에서 재사용 가능한 delta 1개를 추출해 `dash-deltas-provisional.jsonl`에 **append만** 한다. 정본 brief 불변.
- entry 형식: `{round, variant, delta, evidence, judge_votes, confidence, status: "provisional"}`.

### 4.6 지식 정제 게이트 (매 라운드 말미)
- 누적 provisional delta 전체를 클러스터링: 유사 delta 병합 제안, 상호 충돌 감지, 가치 랭킹(승자 판정에 기여한 빈도·일반성 기준).
- **지식 레벨 체크리스트** (수동 폴더 정리 대신 규칙에 의한 자기 조직화): 각 delta에 레벨을 책정한다.
  - **L1 관찰** — 1회 발생, 특정 후보에 종속.
  - **L2 패턴** — 2개 라운드 이상 재현되었거나 하드게이트로 기계 검증 가능.
  - **L3 원칙 후보** — 특정 후보/아키타입을 넘는 일반성 + 기존 원칙과 무충돌 + 반증 가능한 서술.
- **승격 규칙**: L3만 주간 반증 PR의 "brief 편입 제안" 목록에 오른다. L1/L2는 provisional에 남아 후속 라운드가 재현하면 레벨이 오른다 — 정본(위키)에는 검증된 지식만, 나머지는 로그에 잔류.
- 이 체크리스트가 `curation-criteria.md`의 초기 seed이며, 질문 답변으로 계속 정교화된다.
- **질문 강제 생성 조건**: ① delta 간 충돌이 감지됐거나 ② 병합/랭킹 판단을 기존 meta-기준(`curation-criteria.md`)으로 정당화할 수 없을 때. 질문은 `vault/00-principles/questions-queue.md`에 적재하며, 배경(충돌 delta 인용)과 AI의 잠정 가설을 첨부한다.
- meta-기준(`curation-criteria.md`)으로 이미 판단 가능한 유형은 질문하지 않는다 — 같은 유형의 질문 반복 금지.

### 4.7 커밋
- conventional commit으로 `evolve/dash`에 누적 (예: `feat(dash-evolve): r3 승자 b — <아키타입>`).

## 5. 주간 반증 PR

주 1회 별도 주간 routine이 `evolve/dash` → `main` PR을 생성한다 (야간 라운드 routine과 분리 — 라운드 실패가 PR 생성을 막지 않도록). PR 본문에 자동 정리되는 것: 주간 승자 스크린샷 요약, provisional delta 레벨·랭킹·클러스터, 질문 큐, judge 판정 근거, no-winner 라운드 사유, vault 링크 그래프 요약(신규 지식의 `[[링크]]` 수, 고아 노트 목록).

사람이 하는 일은 4가지뿐이다:
1. **후보 킵/드롭** — 킵된 대시보드만 `/dash` 갤러리로 승격.
2. **delta 승인/기각** — L3 제안분만 심사, 승인분만 brief v3에 편입, 기각분은 ledger에 `refuted`로 기록(사유 포함).
3. **질문 답변** — 답변에서 meta-기준을 추출해 `curation-criteria.md`에 축적.
4. **연결 모니터링** — 링크 그래프 요약에서 고아 노트 확인. 승격되는 지식은 관련 노트로의 `[[링크]]` 1개 이상 필수(고아 승격 금지).

리뷰 반영은 로컬 반영 세션이 수행하고 squash merge로 닫는다 (git 규칙 정합).

### 폐루프 2개
- **judge 반증**: 사람이 judge 승자를 기각한 비율(refute rate)을 `dash-auto-ledger.jsonl`에 기록. 임계 초과 시 judge 렌즈/프롬프트 자체를 개선 대상에 올린다 — AHE `predicted→actual` 반증을 취향 판정에 적용.
- **meta-기준 학습**: 질문→답변→기준 축적→다음 라운드 프롬프트 주입. "무엇을 배웠나"(delta)와 "어떤 기준으로 정제하는가"(meta)를 분리 저장한다.

### 지식 조직 원칙 (vault)
- 지식은 에이전트별이 아니라 **업무 카테고리별**(landing 루프 / dash 루프)로 나눈다 — 에이전트 귀속은 ledger 로그가 이미 기록하므로 별도 분류 축으로 쓰지 않는다.
- 루프 공통 지식(예: 그리드 크래프트 함정, 폰트 글리프 이슈)은 `00-principles`의 공용 노트 1곳에만 두고 각 brief가 `[[링크]]`로 참조한다 — 복사 금지, 링크로 연결.
- 폴더 정리는 사람이 하지 않는다 — §4.6의 레벨 체크리스트와 링크 규칙이 조직화를 대신하고, 사람은 연결 건전성만 모니터링한다.

## 6. 신규 파일

| 파일 | 역할 |
|---|---|
| `.claude/skills/dash-evolve/SKILL.md` | 라운드 파이프라인 정의 (클라우드 routine이 호출) |
| `scripts/dash-sweep.mjs` | 그리드 다중 폭 실측 하드게이트 (메모리의 playwright sweep 패턴 재작성) |
| `vault/00-principles/dash-deltas-provisional.jsonl` | 격리된 잠정 학습 (append-only) |
| `vault/00-principles/curation-criteria.md` | 질문 답변에서 축적되는 meta-기준 |
| `vault/00-principles/questions-queue.md` | 정제 게이트가 생성하는 질문 큐 |
| `vault/30-ledger/dash-auto-ledger.jsonl` | 라운드·판정·반증(refute rate) 기록 (append-only) |

## 7. 선행 작업과 리스크

1. **GitHub private repo 생성 + push** — 클라우드 routine의 전제.
2. **클라우드 dry-run 1회 필수** — dev 서버 기동, playwright 스크린샷/sweep, Lighthouse가 클라우드 샌드박스에서 도는지 검증. Lighthouse 불가 시 폴백: playwright 실측 지표(LCP proxy, 레이아웃 시프트 관찰)로 대체하고 하드게이트 기준을 재조정.
3. **비용** — 라운드당 생성 3 + 하드게이트 + judge 3 + 정제 1 에이전트. 주 7라운드 누적이므로 초기 2주 운용 후 빈도 재평가.
4. **dev 서버 포트** — dash 검증은 3100 사용(`npm run dev -- -p 3100`), `.next` 잠금 충돌로 중복 기동 금지.
5. **실패 처리** — routine 실행 실패는 로그만 남기고 다음 라운드에 영향 없음. 하드게이트 전원 탈락도 정상 종료(no-winner).

## 8. 비범위 (이번 구현에서 하지 않는 것)

- landing 루프의 자율화 개편 (기존 design-evolve는 그대로 둠).
- 공통 인프라로의 일반화 (dash 전용으로 먼저 검증).
- `/dash` 갤러리 페이지 자체의 자동 갱신 (승격은 반증 세션에서 사람 확인 후).
- judge 프롬프트의 자동 자기 수정 (refute rate는 기록·경보까지만, 수정은 사람 개입).
