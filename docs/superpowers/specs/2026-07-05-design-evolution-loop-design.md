# Design Evolution Loop — 설계 문서

- 날짜: 2026-07-05
- 상태: 승인 대기 (spec review)
- 구축 깊이: **Lean (Approach A)** — 별도 앱 없이 Obsidian 볼트 + Claude Code + 기존 vibe-flow 자산으로 시작

## 1. 목적 (한 줄)

Obsidian 볼트를 "디자인 지식의 제2의 뇌"로 두고, Claude Code 에이전트가 그 지식을 읽어 **반응형 Next.js/React 랜딩페이지**를 생성 → 심사 AI + 객관 지표로 자동 1차 필터 → 사람이 최종 선택 → 그 결정을 볼트에 되돌려 기록함으로써 **생성할수록 스스로 개선되는 디자인 피드백 루프**를 만든다.

## 2. 배경 / 근거

- 참고 영상 2편의 공통 아키텍처: "옵시디언(plain markdown) = 어떤 AI 에이전트든 MCP/CLI로 붙어 읽고 쓰는 벤더 독립 지식 허브".
- 이 루프는 사용자 글로벌 룰의 **AHE(evaluate→analyze→improve) + decision-observability(예측→실측 반증) 폐루프**를 "디자인" 도메인에 그대로 적용한 것과 동형이다.
- 씨앗 소스 `styles.refero.design`은 원래부터 "AI가 읽는 DESIGN.md" 2,000개+ 및 **Refero MCP**(150K+ 실제 앱 스크린, 6K+ 유저 플로우)를 제공한다.

## 3. 핵심 결정 사항 (확정)

| 항목 | 결정 |
|---|---|
| 산출물 | 반응형 Next.js(App Router) + React 코드 (3D는 `@react-three/fiber` 선택 레이어) |
| "학습"의 의미 | RAG/컨텍스트 주입 + **자기개선 피드백 루프** (모델 파인튜닝 아님) |
| 평가 신호 | 심사 AI(비평) + 객관 지표(자동 1차 필터) → **사람이 최종 결정** |
| 씨앗 소스 | **Refero MCP** 연결 (수동 복사 아님) |
| 구축 깊이 | Lean(A) — 볼트 + Claude Code만. 이후 B(스튜디오 앱)→C(자율) 단계적 확장 |
| 볼트 위치 | **프로젝트 폴더와 통합** (`repick-design/vault/`) |
| 첫 생성 타깃 | **랜딩페이지** |

## 4. 볼트 구조

```
repick-design/
├─ vault/                          # Obsidian 볼트 (AI가 읽고 쓰는 제2의 뇌)
│  ├─ 00-principles/
│  │  ├─ design-principles.md      # 현재의 "우리 디자인 DNA" (색·타이포·간격·톤·보이스)
│  │  └─ MEMORY.md                 # 학습 인덱스 (200줄 cap, 한 줄 = 한 학습)
│  ├─ 10-references/               # 씨앗: Refero에서 고른 DESIGN.md (MCP 조회 결과 캐시)
│  │  └─ <brand>.design.md
│  ├─ 20-generations/
│  │  └─ YYYY-MM-DD-landing/
│  │     ├─ candidates/            # 생성된 Next.js/React 후보 (candidate-a/, candidate-b/ ...)
│  │     ├─ SCORES.md              # 지표 + 심사 점수 표
│  │     └─ DECISION.md            # 사람 최종 선택 + 한 줄 이유
│  └─ 30-ledger/
│     └─ design-ledger.jsonl       # append-only 결정 로그 (audit-ledger.jsonl과 동형)
└─ app/                            # Next.js(App Router)+Tailwind(+shadcn/ui base) — 후보 렌더 대상
```

## 5. 루프 — `/design-evolve` 스킬이 5단계를 순차 실행

1. **RETRIEVE** — `00-principles/*` + 관련 `10-references/*` + 최근 `30-ledger` 결정을 컨텍스트로 로드. 참조가 부족하면 Refero MCP로 관련 스타일 조회 후 `10-references`에 캐시.
2. **GENERATE** — `designer`/`frontend-design-specialist` 에이전트가 N개(기본 3개) 랜딩 후보를 `app/` 위에서 동작하는 반응형 Next.js/React 코드로 생성, `20-generations/<run>/candidates/`에 저장.
3. **AUTO-SCORE** (자동 1차 필터)
   - 객관: `perf-audit`(Lighthouse: Perf/LCP/CLS/TBT) + `web-design-guidelines`(접근성·UX 100+ 룰) + `00-principles` 토큰 준수 체크.
   - 심사: `comparator` 에이전트가 블라인드 A/B 랭킹 + `00-principles` 대조 비평.
   - → `SCORES.md` 작성, 상위 2~3개만 통과.
4. **HUMAN GATE** — 사람이 상위 2~3개만 로컬 렌더로 확인 → 승자 + 한 줄 이유를 `DECISION.md`에 기록.
5. **LEARN** — 그 이유를 `00-principles/design-principles.md`에 반영(surgical update) + `design-ledger.jsonl`에 1 entry append + `MEMORY.md` 인덱스 갱신. → 다음 RETRIEVE가 이 결정을 읽어 루프가 닫힘.

### ledger 1 entry 스키마
```json
{"run": "2026-07-05-landing", "candidate": "b", "won": true,
 "reason": "히어로 여백이 넓어 CTA 대비가 살았다",
 "metrics": {"perf": 96, "a11y": 100, "lcp_ms": 1200},
 "principle_delta": "hero 상하 패딩 최소 96px 규칙 추가"}
```

## 6. 기존 vibe-flow 자산 매핑 (Lean이 가능한 이유)

| 루프 단계 | 재사용 자산 |
|---|---|
| RETRIEVE / LEARN 메모리 | `.claude/memory` 패턴 + `/learn` 스킬 |
| GENERATE | `designer` / `frontend-design-specialist` 에이전트 |
| 심사(블라인드) | `comparator` 에이전트 |
| 객관 지표 | `perf-audit`(Lighthouse) + `web-design-guidelines`(접근성) |
| 결정 관측성 | `audit-ledger.jsonl` 패턴 → `design-ledger.jsonl` |
| 오케스트레이션(향후 C) | `/auto-build`(Ralph loop) 재사용 가능 |

## 7. 새로 만들 것 (딱 두 덩어리)

1. **볼트 씨앗**
   - Refero MCP 연결: `claude mcp add --transport http refero https://api.refero.design/mcp --header "Authorization: Bearer <token>"` (첫 호출 시 브라우저 로그인)
   - `00-principles/design-principles.md` v0 작성 (랜딩 대상 브랜드 톤 초안)
2. **`/design-evolve` 오케스트레이터 스킬** — 5단계를 엮는 skill (기존 에이전트/스킬을 호출하는 얇은 배선 레이어)
   - 나머지(Next.js `app/` 스캐폴드 포함)는 표준 부트스트랩.

## 8. 범위 밖 (YAGNI — 지금 안 만든다)

- 스튜디오 앱(B) / 자율 cron 루프(C) — 검증 후 단계적 확장.
- 모델 파인튜닝.
- Refero 2,000개 통째 스크래핑(ToS 위험 + 노이즈). MCP 라이브 조회 + 선별 캐시로 대체.
- 랜딩 외 페이지(가격표·대시보드 등) — 랜딩 루프 검증 후 동일 패턴 복제.

## 9. 성공 기준

- `/design-evolve "landing"` 1회 호출로 3후보 생성 → 자동 점수 → 상위 2~3 제시 → 사람 선택 → `design-ledger.jsonl`에 entry 1개 append 까지 무중단 완주.
- 2회차 실행 시 RETRIEVE가 1회차 `DECISION.md`/ledger를 실제 컨텍스트로 반영(예: 추가된 principle이 후보에 나타남)함을 확인 = 폐루프 성립.

## 10. 리스크 / 유의

- **평가 신호 빈약화**: 초기 참조가 적으면 후보가 단조로워짐 → 1회차 전 Refero MCP로 랜딩 스타일 5~10개 확보 권장.
- **토큰/시간 비용**: N=3 + 심사 병렬은 비용 발생 → 기본 N=3 고정, 필요 시 조정.
- **git 미초기화**: 현재 폴더는 git repo 아님. 볼트 이력 추적을 위해 `git init` 권장(별도 확인).
