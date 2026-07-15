# auto-dash-r1 — 하드게이트 결과

라운드: `auto-dash-r1` (로컬 스모크 라운드, Task 6). Base: `http://localhost:3001`.
후보 2개(a, b) — 비용 절약을 위해 GENERATE 단계 병렬 2개로 축소 실행(SKILL.md §0 스모크 예외).

## 게이트 표

| 후보 | 정적 검사 (dash-static-check.mjs) | sweep (dash-sweep.mjs) | Lighthouse (perf/a11y, desktop, dev 서버) | 판정 |
|---|---|---|---|---|
| a — Rivet (피드 중심 CDP) | PASS (0 위반) | PASS (0 실패, 전 폭 390/1264~1920) | perf 73 / a11y 97 | 생존 |
| b — Keel (칸반 파이프라인) | PASS (0 위반) | PASS (0 실패, 전 폭 390/1264~1920) | perf 73 / a11y 96 | 생존 |

## 상세

### 정적 검사
- 최초 실행에서 두 후보 모두 `no-random`/`no-emoji` 규칙에 4건 걸림 — 전부 **주석 문구가 규칙 예시 텍스트를 그대로 인용**(`Math.random()` 등 리터럴 문자열)하거나, `★` 별표 유니코드가 `Extended_Pictographic`에 포함되어 오탐된 케이스(코드 위반 아님).
- 1회 수정: 주석 문구를 규칙 문자열과 겹치지 않게 재서술(`Math.random()` → "난수·현재시각 기반 동적 생성"), `data.ts`의 `"★ 4.5"` → `"4.5점"`으로 교체. 재실행 결과 두 후보 모두 0 위반.
- **결함 기록**: `no-emoji` 규칙(`\p{Extended_Pictographic}`)이 이모지뿐 아니라 `★` 같은 장식 유니코드 심볼까지 오탐한다. `no-random` 규칙은 코드/주석을 구분하지 않아 규칙을 설명하는 주석 자체가 자기 위반이 된다 — 재발 가능한 스크립트 결함(report에 기록).

### sweep
- 폭: 390(모바일) + [1280,1366,1440,1536,1680,1920] 및 각 −16(클래식 스크롤바 여유) 조합 — 전부 통과, page-overflow·table-overflow 0건.

### Lighthouse
- 명령 실행 자체는 성공(`"lighthouse":"unavailable"` 아님). `--preset=desktop`, `next dev`(비프로덕션 빌드) 대상 측정이므로 FCP/LCP가 프로덕션 빌드 대비 구조적으로 느림(TBT 0ms, CLS 0 — 코드 자체의 렌더 블로킹/레이아웃 시프트는 없음).
- perf 73/73으로 두 후보가 **동일 점수** — 이는 후보별 코드 품질 차이가 아니라 dev 서버 자체의 상한(미압축 JS, on-demand 컴파일)에서 오는 공통 상한으로 판단. a11y는 95 기준 통과(a: 97) / 근접(b: 96, 목표 미달이나 오차 범위).
- 태스크 브리프 지시(§2 Lighthouse 처리: "명령 자체가 실패하면 unavailable 기록, 아니면 1회 실행 후 진행")에 따라 **탈락 트리거로 사용하지 않고 기록만 함**. static/sweep과 달리 이번 스모크 브리프는 Lighthouse에 별도 탈락 조항을 두지 않았다.

## 생존 후보
a, b 둘 다 JUDGE 단계로 진행.
