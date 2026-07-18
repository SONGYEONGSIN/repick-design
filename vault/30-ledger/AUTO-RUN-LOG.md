# 자율 모드 실행 로그 (2026-07-07, ~18:00 목표)

- 시작: 07:07
- 모드: 무인 자율 — 매 라운드 생성→자동채점(지표+심사)→AI 자동선택→학습→커밋
- 자동선택 기준: Lighthouse(perf/a11y) + 토큰준수 + comparator 심사 가중 종합 1위
- 사람 검토: 사후 (design-ledger.jsonl + 각 DECISION.md)

| 라운드 | run | 자동 승자 | 종합근거 | principle_delta |
|---|---|---|---|---|
| 1 (수동) | 2026-07-06-landing | C | 성능92+타이포+색절제 (사람 선택) | 타이포위계+near-mono; 웨이트3종 |
| 2 | 2026-07-07-auto-r2 | a | 심사20+perf84+토큰0+그라데이션無 | Hero 비대칭 초대형 스케일; accent 극소량 고정 |
| 3 | 2026-07-07-auto-r3 | a | 심사20+perf83+토큰0 | 에디토리얼 밀도>여백만; accent 정지 존재감 |
| 4 | 2026-07-07-auto-r4 | c | 심사20+perf84+토큰0 | 구조>테마(라이트 19:20); 라이트 유효 대안 |
| 5 | 2026-07-07-auto-r5 | b | 심사20+perf84+토큰0 | 수렴 도달; focus링+모바일clamp 요건; 세리프 거부 |
| — | (R6~) | — | 수렴 이후 탐색 편향 라운드 시작 (챔피언 정련은 baseline) | — |
| 6 | 2026-07-07-auto-r6 | b | 심사19(제품설득력) | 제품 프리뷰 섹션 표준 편입; 브루탈리스트 거부 |
| 7 | 2026-07-07-auto-r7 | a | 심사20+perf91 | 프리뷰 리치화(근거+신뢰)=표준; 라인아트 재감점 |

## 라운드 노트 (백링크)
- R1 (수동) *(기록: design-ledger.jsonl — 원 노트는 정리됨)*
- R2 *(기록: design-ledger.jsonl — 원 노트는 정리됨)*
- R3 *(기록: design-ledger.jsonl — 원 노트는 정리됨)*
- R4 *(기록: design-ledger.jsonl — 원 노트는 정리됨)*
- R5 *(기록: design-ledger.jsonl — 원 노트는 정리됨)*
- R6 *(기록: design-ledger.jsonl — 원 노트는 정리됨)*
- R7 *(기록: design-ledger.jsonl — 원 노트는 정리됨)*

홈: [[🏠 Design Evolution]] · DNA: [[design-principles]] · 인덱스: [[MEMORY]]

---

# dash 자율 진화 가동 (2026-07-15~)
- 모드: 클라우드 routine — 매일 03:00 KST 1라운드(/dash-evolve, repick-dash-evolve-nightly), 일요일 06:00 KST 반증 PR(/dash-falsify open, repick-dash-falsify-weekly)
- 격리: delta는 dash-deltas-provisional.jsonl, 정본 brief v3는 주간 apply에서만 갱신
- 사람: 주 1회 PR 리뷰(킵/드롭·delta 승인/기각·질문 답변) 후 /dash-falsify apply
- 스모크(r1, 로컬): 승자 b Keel — 게이트 조정: Lighthouse perf는 dev 서버 상한(73)으로 기록 전용, a11y ≥95만 하드게이트

- 2026-07-18: 이중 타깃 가동 — 야간 라운드가 dash/landing 무작위 50/50, ledger 통합(auto-ledger.jsonl, target 필드), 위키 lint 게이트(scripts/wiki-lint.mjs) 추가. LLM Wiki(Karpathy) 정렬: index.md 전수 카탈로그·기계 lint·ingest 파급 규칙. 랜딩 스모크 auto-landing-r1 승자 SCANLINE(evolve/dash).
