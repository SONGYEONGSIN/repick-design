# SCORES — auto-dash-r62 (target: dash)

Freeze hash (all 3 candidates, pre-gate): `6af45ebb73561d472df2f876ebd57fd992aa1ce3`

## Candidate a — "Stagebook" (calendar/board console, light/orange/`--font-display-wide`)

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | 포커스 표시 0건 누락 |
| console | ❌ | 13건 — Hydration failed (server/client text mismatch) |
| a11y | ✅ | 100 |
| perf | ✅ | 72 |

**1차 실패 원인**: `Intl.NumberFormat({notation:"compact", maximumFractionDigits:1})`(`usdCompactFmt`)가 서버(Node ICU)와 클라이언트(브라우저 ICU) 사이에서 trailing-zero 표시가 갈린다 — 예: `November 3, 1 booking, $480` (서버) vs `$480.0` (클라이언트). 13개 캘린더 셀의 sr-only aria 텍스트 전부에서 재현.

**1-fix 시도**: 원인을 "480이 1000 미만이라 compact 분기가 불필요하게 걸린다"로 오진단 — `formatRevenueCompact(n) = n < 1000 ? usdFmt : usdCompactFmt` 래퍼로 수정. **재실패** — 같은 결함군이 더 큰 값(`November 6, 2 bookings, $7K` 서버 vs `$7.0K` 클라이언트, 1000 이상)에서 재현돼 진단이 근본 원인을 못 짚었던 것으로 드러남. 스킬 §3 "재실패 시 탈락" 적용 — **탈락, 판정 패널 미진입**.

**사후 확인된 진짜 원인** (후보 c의 1-fix에서 확증, 아래 참조): ICU `compact` notation의 trailing-zero 처리는 명시 지정이 없으면 구현/버전에 맡겨지고(ECMA-402 `trailingZeroDisplay` 기본값 `"auto"`의 구현 종속), Node와 브라우저의 ICU가 서로 다르게 정한다. `trailingZeroDisplay: "stripIfInteger"`를 명시하면 양쪽이 합의한다. Stagebook 자신에게는 이미 1-fix를 소진해 적용하지 않음(규칙상 두 번째 수정 불허) — 재배정 큐에 이 정확한 처방으로 등재.

## Candidate b — "Dockwise" (hero-metric + ranked-bar ops console, light/green/`--font-display-grotesk`)

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | 포커스 표시 0건 누락 |
| console | ✅ | 메시지 90건 · 결함 0 |
| a11y | ✅ | 100 |
| perf | ✅ | 89 |

**1차부터 10/10 클린 통과** (1-fix 불요). 생존.

## Candidate c — "Clearcall" (master-detail call-intelligence console, dark/sky, Pretendard-only+grotesk wordmark)

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | 포커스 표시 0건 누락 |
| console (1차) | ❌ | 13건 — Hydration failed, 동일 결함군(`$86K` 서버 vs `$86.0K` 클라이언트) |
| console (재게이트) | ✅ | 메시지 103건 · 결함 0 |
| a11y | ✅ | 100 |
| perf | ✅ | 91 |

**1-fix 조치**: `Intl.NumberFormat` 컴팩트 통화 포매터에 `trailingZeroDisplay: "stripIfInteger"` 명시 추가(값·의미 변경 없음, 포맷 옵션 1줄 보강) — 규칙 위반 해소에 한정된 수정. 재게이트 10/10 클린. **생존**.

## 생존 후보: b, c (2개) — §4 JUDGE 정상 진입 (1개가 아니므로 단독 심사 아님)
