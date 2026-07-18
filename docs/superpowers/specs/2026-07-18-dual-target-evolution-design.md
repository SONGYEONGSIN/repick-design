# 자율 진화 이중 타깃화 + LLM Wiki 정렬 — 설계

- 날짜: 2026-07-18
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 선행: `2026-07-15-dash-auto-evolution-design.md`(층 2 자율 루프 — 가동 중, r4까지 완주)의 확장. Karpathy LLM Wiki 패턴([gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f), 2026-04) 대조 감사 결과 반영.

## 1. 목표 두 가지

1. **이중 타깃**: 야간 자율 라운드가 SaaS 대시보드만이 아니라 **랜딩페이지도 무작위로** 생성·심사·축적한다.
2. **위키 정렬**: vault 지식 체계를 Karpathy LLM Wiki 패턴의 공백 3개(index 카탈로그·정기 lint·ingest 파급)에 대해 보강한다.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 타깃 선택 | 라운드마다 무작위 50/50 (에이전트가 결정, ledger에 `target` 기록) |
| 랜딩 지식 계보 | 정본 = 기존 `design-principles.md`(R7 수렴 DNA) 재사용, 격리 = `landing-deltas-provisional.jsonl` 신설 |
| 주간 반증 | 단일 PR에 타깃별 섹션 (브랜치·routine·apply 절차 공유) |
| 스킬 이름 | `dash-evolve`/`dash-falsify` 유지 (rename 연쇄 비용 > 이득) — description에 이중 타깃 명시 |

## 3. 이중 타깃 파이프라인

### 3.1 타깃 선택 (dash-evolve SKILL §0 확장)
- 라운드 시작 시 target ∈ {dash, landing} 무작위 50/50 결정 — 방법: 오케스트레이터가 bash `$((RANDOM % 2))`로 결정(후보 페이지 코드의 결정론 금지 규칙은 생성물에 대한 것 — 오케스트레이션 난수는 무방하며 결과가 ledger에 기록되므로 재현성은 ledger가 담보). run id = `auto-<target>-r<N>`.
- N은 **타깃별 독립 시퀀스**: ledger에서 해당 target의 최대 라운드 번호 + 1 (dash는 r5부터 이어감, landing은 r1부터).

### 3.2 타깃 파라미터 테이블 (SKILL 본문에 표로 명시 — 파이프라인 골격은 공유)

| | dash | landing |
|---|---|---|
| 정본 brief | `vault/00-principles/dash-brief-v3.md` | `vault/00-principles/design-principles.md` |
| 격리 delta | `dash-deltas-provisional.jsonl` | `landing-deltas-provisional.jsonl` (신설) |
| 후보 route | `app/src/app/dash-evolve/r<N>/<v>/` | `app/src/app/landing-evolve/r<N>/<v>/` (신설 디렉토리) |
| 중복 금지 목록 | `/dash` 갤러리 + dash-evolve 누적 아키타입 | `/v1~v5` + landing-evolve 누적 **형태**(`landing-forms.jsonl` 계보 용어) |
| judge 렌즈 | brief 준수 / SaaS 완성도 / 아키타입 차별성 | DNA 준수 / 상용 랜딩 완성도 / 형태 차별성 |

- 하드게이트(정적 검사·그리드 sweep·Lighthouse a11y ≥95 하드 + perf 기록)·스크린샷 4폭(1280/1440/1920/390)·수리 1회 규칙·no-winner 허용은 두 타깃 동일.
- 랜딩 후보도 그리드 검증 룰(전 폭 오버플로 금지·여유 ≥16px)을 그대로 받는다.

### 3.3 ledger 통합
- `git mv vault/30-ledger/dash-auto-ledger.jsonl vault/30-ledger/auto-ledger.jsonl` (이력 보존 — append-only 위반 아님).
- 신규 entry부터 `target: "dash"|"landing"` 필드 필수. 기존 4 entry는 소급 수정 금지(round id `auto-dash-r*`로 target 유추 가능).
- 참조 갱신: dash-evolve·dash-falsify SKILL.md, 갤러리는 무관.

### 3.4 주간 반증 (dash-falsify 확장)
- **open**: PR 본문을 "## 대시보드" / "## 랜딩" 섹션으로 조립 — 각 섹션에 라운드 표·L3 delta 제안·잔류 요약·후보 링크. 질문 큐·위키 건전성(§4)은 공통 섹션.
- **apply 랜딩 경로**: delta 승인 → `design-principles.md` surgical 편입. 후보 킵 → `/v<다음 번호>`로 이동 등재 + `works.ts` `LANDING_WORKS`에 entry 추가 + `LAST_UPDATED` 갱신. **챔피언(`/`) 교체는 자동 승격 대상이 아님 — 사용자가 명시적으로 지시할 때만.**
- refute rate는 타깃 구분 없이 통합 계산(judge 체계가 동일하므로).

### 3.5 갤러리 연동
- `app/src/app/gallery/page.tsx`의 `evolveWorks()`가 `src/app/landing-evolve/`도 스캔. 라벨 prefix로 구분(`DASH R5 · A` / `LANDING R1 · A`). Ⅳ 탭 하나에 통합, 존재 시에만 노출(기존 규칙 동일).

### 3.6 routine 갱신
- nightly routine(trig_01LpWcnPq9kGhdqVtjTqWwEX) 프롬프트에 타깃 무작위 결정·타깃별 파라미터 준수를 반영 (RemoteTrigger update).

## 4. LLM Wiki 정렬 (Karpathy 패턴 공백 보강)

vault는 이미 3계층(raw=`10-references`/wiki=`00-principles`/로그=ledger)·[[링크]] 그래프·미검증 격리·분업 구조가 카파시 패턴과 동형이다. 공백 3개만 보강한다:

### 4.1 `vault/index.md` 신설 (카파시의 index.md)
- 전 vault 노트의 한 줄 요약 카탈로그 — 카테고리(원칙/레퍼런스/세대 기록/원장)별 정리.
- **갱신 의무 지점**: 자율 라운드 §7(기록+커밋 — 신규 run 디렉토리 등재)과 apply(승격·신규 노트 등재). 홈 MOC(🏠)는 큐레이션 목차로 유지(역할 분리: index=전수, 홈=선별).

### 4.2 위키 lint — "not optional"
- **기계 검사** `scripts/wiki-lint.mjs` 신설(TDD, 기존 스크립트 패턴): ① 고아 노트(vault 전체에서 인바운드 [[링크]] 0인 .md — jsonl·raw 제외) ② 깨진 링크([[대상]] 실존 파일 없음) ③ index.md 등재 누락. JSON 출력 + 위반 시 exit 1.
- **판단 검사**(에이전트): 페이지 간 모순·stale 주장(최신 delta가 정본과 충돌) — falsify open이 PR 조립 시 수행.
- **실행 지점**: 주간 반증 PR의 "위키 건전성" 섹션(기존 "링크 그래프 요약" 대체·확장) + apply 마지막 단계에서 재실행(승격이 만든 위반 즉시 감지).

### 4.3 ingest 파급 규칙 (apply 확장)
- delta를 정본에 편입할 때 **해당 내용을 참조하는 관련 노트의 상호참조도 동반 갱신**한다(예: 그리드 룰 강화 시 curation-criteria의 관련 항목에서 [[링크]] 연결). "1건 편입 = 관련 페이지들 터치"를 apply 절차에 명문화.
- 위생 1건 즉시 처리: 🏠 홈 MOC "핵심 노트"에 `[[dash-brief-v3]]` 링크 추가.

## 5. 변경 파일 요약

| 파일 | 변경 |
|---|---|
| `.claude/skills/dash-evolve/SKILL.md` | 타깃 선택 §0 + 파라미터 테이블 + ledger 경로 + index 갱신 의무 |
| `.claude/skills/dash-falsify/SKILL.md` | 타깃별 섹션 조립 + 랜딩 apply 경로 + 위키 lint/건전성 섹션 + ingest 파급 |
| `scripts/wiki-lint.mjs` (+test) | 신설 — 기계 lint 3종 |
| `vault/index.md` | 신설 — 전수 카탈로그 |
| `vault/00-principles/landing-deltas-provisional.jsonl` | 신설(빈 파일) |
| `vault/30-ledger/auto-ledger.jsonl` | git mv rename |
| `vault/🏠 Design Evolution.md` | dash-brief-v3 링크 위생 |
| `app/src/app/gallery/page.tsx` | landing-evolve 스캔 |
| nightly routine 프롬프트 | 이중 타깃 반영 (RemoteTrigger) |

## 6. 검증

1. `npm test` — wiki-lint 신규 테스트 포함 전체 통과.
2. `node scripts/wiki-lint.mjs` — 현 vault 위반 0 (위생 처리 후).
3. **로컬 landing 스모크**: target=landing 강제 1라운드(후보 2, evolve/dash 브랜치) 완주 — landing-deltas append·auto-ledger target 필드·`/landing-evolve/r1/*` 게이트 통과·**정본 design-principles.md 불변식 0 diff** 확인.
4. 갤러리: evolve/dash 체크아웃에서 Ⅳ 탭에 DASH·LANDING 라벨 공존 확인.
5. dash 경로 회귀는 다음 야간 라운드가 자연 검증(ledger rename 후 r5 정상 append 확인).

## 7. 비범위

- 챔피언(`/`) 자동 교체 (명시 승인 시만).
- `/free` 루프 확장, 타깃 빈도 가중 조정.
- 개념별 엔티티 페이지 일괄 분해 — apply 시점에 점진 적용(ingest 파급 규칙이 자연 유도).
- 기존 ledger entry 소급 수정.
