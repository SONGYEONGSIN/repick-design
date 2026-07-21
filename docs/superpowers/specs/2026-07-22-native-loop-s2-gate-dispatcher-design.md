# 멀티플랫폼 진화 루프 — S2: 게이트 디스패처 + 공통 판정 계약 설계

- 날짜: 2026-07-22
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: 자율 진화 루프 멀티플랫폼 재설계. 선행 = S0(Expo PoC ✅)·S1(designer 네이티브 생성 ✅). 이 문서는 **S2**만 다룬다.

## 0. 상위 프로그램 맥락

| # | 하위 프로젝트 | 상태 |
|---|---|---|
| S0 | Expo 단일 타깃 PoC | ✅ 통과 |
| S1 | designer 네이티브 온디맨드 생성 | ✅ 통과 |
| **S2** | **검증 게이트 재설계 (웹↔네이티브 타깃 분기 + 공통 계약)** | ← 이 문서 |
| S3 | 미리보기·갤러리 통합 | 후속 |
| S4 | 루프·ledger·스킬 재배선 (SKILL이 gate.mjs 채택) | 후속 |
| S5 | 카탈로그 192색·98UX 전수 수용 | 후속 |

## 1. 목표

웹(dash-static-check·dash-sweep·Lighthouse)과 네이티브(validate.sh)로 갈라진 검증 게이트를 **단일 디스패처 `scripts/gate.mjs`**로 통일한다. `--target web|native`로 분기하되 **동일한 JSON 판정 계약**을 반환해, dash-evolve(S4)·사람이 한 줄 호출로 판정을 얻는다. 기존 웹 스크립트는 재작성 없이 감싼다. S1 이월 3건(복수 화면 게이트·검사문자열 하드닝·공통 계약)을 여기서 해소.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 통일 방식 | 단일 디스패처 `gate.mjs`(기존 스크립트 감싸기, 재작성 없음) |
| 판정 계약 | 공통 JSON `{target, pass, gates[], violations[]}` + exit 0/1 |
| SKILL 재배선 | **비범위 — S4**. S2는 디스패처 제작 + 양 타깃 증명만 |

## 3. 공통 판정 계약

양 타깃이 반환하는 동일 스키마:
```json
{
  "target": "web" | "native",
  "pass": true,
  "gates": [
    { "name": "static", "pass": true, "detail": "위반 0" },
    { "name": "sweep",  "pass": true, "detail": "전 폭 오버플로 0" },
    { "name": "a11y",   "pass": true, "detail": "100" }
  ],
  "violations": []
}
```
- exit 0(pass) / 1(fail — `pass:false`).
- `gates[]`는 타깃별로 이름이 다름(web: static·sweep·a11y·perf(기록); native: tsc·export·render·iframe). 스키마는 동일.
- `violations[]`는 실패 게이트의 상세(파일:라인·failures JSON 등) 병합 — designer 수정 입력.

## 4. 분기 내부

### 4.1 web 브랜치 (`--target web --routes <r...>`)
- dash-static-check(`node scripts/dash-static-check.mjs <files>` → 위반 JSON), dash-sweep(`--base http://localhost:3100 --routes <r>` → failures JSON), Lighthouse(a11y ≥95 하드·perf 기록·불가 시 `unavailable`)를 각각 실행.
- 각 출력을 공통 gate 항목으로 **정규화**(순수함수). 기존 웹 게이트 동작·기준·스크립트 불변 — gate.mjs가 호출·정규화만.
- dev 서버 3100 전제(기존과 동일).

### 4.2 native 브랜치 (`--target native --screens <s...>`)
각 화면에 validate.sh 실행 후 공통 항목으로 정규화. **S1 이월 3건 해소**:
- **M1 (복수 화면 게이트)**: Expo 엔트리를 `SCREEN` 환경변수로 파라미터화 — `native/App.tsx`가 `process.env.SCREEN`(또는 Expo 공개 env)을 읽어 렌더 화면 선택(screen 레지스트리). gate.mjs가 화면별로 `SCREEN=<s>` 세팅해 export·검증 → MatchList·watchlist 모두 게이트 대상(현재는 App.tsx 렌더 1개만).
- **#3 (검사문자열 하드닝)**: validate.sh의 render 게이트가 `$CHECK`를 node -e 문자열 보간 대신 `CHECK=<s> node -e '…process.env.CHECK…'` **env 전달**(따옴표·특수문자 안전).
- **공통 계약**: validate.sh 4단계(tsc·export·render·iframe) 결과를 gate.mjs가 JSON으로 정규화.

## 5. 신규/변경 파일

| 파일 | 변경 |
|---|---|
| `scripts/gate.mjs` (+`scripts/gate.test.mjs`) | 신설 — 디스패처 + 서브게이트 출력→공통 판정 정규화(순수함수 TDD) |
| `native/App.tsx` | `SCREEN` env로 렌더 화면 선택(screen 스위처, 기본값 유지) |
| `native/src/screens.ts` (신규) | screen 레지스트리(slug→컴포넌트·검사문자열) — App.tsx·gate가 공유 |
| `native/scripts/validate.sh` | 검사문자열 env 전달(#3) + SCREEN 반영(M1) |
| `scripts/dash-static-check.mjs`·`dash-sweep.mjs` | **무변경** (gate.mjs가 감쌈) |
| `.claude/skills/dash-evolve/SKILL.md` | **무변경** (S4가 gate.mjs 채택) |

## 6. 증명

1. **웹 타깃**: `node scripts/gate.mjs --target web --routes /dash/d29` → 공통 JSON `pass:true`, gates(static·sweep·a11y) 정규화, 기존 웹 게이트와 동일 판정(회귀 — d29는 통과작).
2. **네이티브 타깃**: `node scripts/gate.mjs --target native --screens match watchlist` → 두 화면 모두 공통 JSON `pass:true`(M1 — 복수 화면 게이트 성립).
3. **계약 동형**: 두 타깃 출력이 같은 스키마(`target`·`pass`·`gates[]`·`violations[]`)·같은 exit 계약.
4. **정규화 순수함수 TDD**: 각 서브게이트 출력(위반 JSON·failures·validate 로그) → 공통 gate 항목 변환을 node:test로 검증(실제 실행 없이 파싱 정합).
5. **회귀**: 기존 웹 스크립트 테스트(node:test 31개) 불변, 웹 게이트 기준(a11y≥95·오버플로 0) 불변. `native/App.tsx` SCREEN 파라미터화가 기본 렌더(현 화면) 안 깨뜨림.
6. **웹 루프·프로덕션 무변경**: `app/`·`vault/`·SKILL diff 0(gate.mjs·native/·scripts 신규만). `curl https://repick-design.vercel.app/` 200.

## 7. 비범위

- dash-evolve SKILL의 HARD GATE를 gate.mjs 호출로 교체 → **S4**.
- ledger·judge·타깃 무작위 선택(자율 라운드가 native 타깃 뽑기) → **S4**.
- 갤러리에 native 후보 미리보기 통합 → **S3**.
- iOS 시뮬레이터 실렌더 게이트, NativeWind → 보류.
- 웹 게이트 스크립트 자체 재작성(gate.mjs는 감싸기만).
