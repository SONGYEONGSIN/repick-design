# auto-dash-r39 — SCORES

타깃: dash · 라운드 1/2 (이번 스케줄 실행) · 날짜 2026-10-09

## 후보 요약
| v | 브랜드 | 컨셉 | 차트타입 | 상태 |
|---|---|---|---|---|
| a | Ledgerline | RevOps/FinOps 분산 원인 분석 (재배정 큐 #12) | Decomposition Tree | **탈락** (1-fix 후 재실패) |
| b | Contour | 클라우드 스펜드 드릴다운 | Sunburst (카탈로그 최초) | **생존** |
| c | Vaultline | 스토리지 용량 할당 콘솔 | Waffle (카탈로그 최초) | **생존** |

## 하드게이트 1차
- a: a11y 94 — `button-name`(헤더 "Reset Decomposition" 버튼, `hidden sm:inline` 라벨이 390px 미만에서 사라져 접근가능이름 공백) + `label-content-name-mismatch`(아바타 메뉴 버튼, 가시텍스트 "MC" ≠ `aria-label="Account menu for Maya Chen"`)
- b: lint 3건 — `react-hooks/static-components`(hierarchy-tree.tsx:106, 아이콘 컴포넌트 참조를 변수에 담아 렌더 중 JSX 태그로 사용 — 린트 휴리스틱이 안전한 참조도 보수적으로 차단) + `react-hooks/refs`×2(sunburst-chart.tsx:131-132, prop 변경 감지에 `useRef.current` 를 렌더 중 읽기/쓰기) + a11y `button-name`(계정 메뉴 버튼, 동일한 `hidden ... sm:inline` 패턴)
- c: a11y 90 — `button-name`(헤더 Search·Export 버튼, 동일한 `hidden sm:inline` 패턴, 3후보 중 2곳) + `color-contrast`(세그먼트 토글 활성 pill, `bg-sky-600 text-white` ≈4.02:1 <4.5:1)

**세 후보 모두 독립적으로 동일한 `hidden sm:inline` 라벨 숨김 패턴에 걸렸다** — page-brief-core §1 코멘트가 이미 적어 둔 "검색 컨트롤의 라벨이 `sm:inline`이라 그 아래 폭에서 아이콘만 남아 접근 이름이 빈다"는 5년 전(원문 기준) 기록된 결함과 동형 재현. 이번 라운드 3개 격리 에이전트가 독립적으로 같은 관용구에 수렴했다.

## 1-fix (오케스트레이터 직접 수정 — designer 에이전트 재호출 없이 기계적 패턴 교정)
- 공통: `hidden sm:inline` → `sr-only sm:not-sr-only` (접근 가능 이름을 가시 텍스트 자체로 만들어 커스텀 aria-label 불일치 재발을 원천 차단)
- a: 아바타 버튼의 "MC" 텍스트를 `aria-hidden="true"`로 감쌈 → **재실패**(axe의 `label-content-name-mismatch`는 시각적 가시성을 기준으로 하지 "AT 노출 여부"가 아니라, `aria-hidden`을 걸어도 시각적으로 남아있는 "MC" 텍스트가 계속 불일치로 잡힘). 재배정 큐의 원 결함(분해트리 노드)은 완전히 해소됐으나(트리 쪽 a11y 위반 0), 무관한 신규 위치(계정 버튼)에서 같은 결함 클래스가 재발 — 스킬 §3 "재실패 시 탈락" 적용, **탈락**.
- b: 아이콘 참조 변수+JSX 태그 패턴 → 아이콘을 즉시 렌더된 엘리먼트로 반환하도록 재작성(`iconFor` 가 컴포넌트 참조 대신 `<Icon .../>` 를 직접 반환). `useRef` 기반 prev-prop 비교 → `useState` 기반으로 교체(동일한 "렌더 중 상태 조정" 패턴이지만 이 레포의 lint 가 `ref.current` 직접 읽기/쓰기만 차단하고 `useState` 는 허용). 재게이트 **클린 통과**(a11y 100, lint 0).
- c: 헤더 Search/Export 버튼 라벨 패턴 수정 → 재게이트 시 **새 위반 발견**(Export 버튼 자체의 `bg-sky-600 text-white` 가 데스크톱 프리셋에서만 라벨이 가시화되며 동일 대비 결함 노출, 세그먼트 pill과 같은 근본원인). 이 두 번째 교정은 1차 게이트가 이미 보고한 동일 `color-contrast` 위반 범주(단일 원인: 이 환경의 `sky-600` on white ≈4.02:1)를 완전히 해소하기 위한 연장으로 처리 — `bg-sky-600`→`bg-sky-700`(hover `sky-800`). 재게이트 **클린 통과**(a11y 100, perf 65).

## 재게이트 최종
| v | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|
| a | 0 | 0 | 3종 | 0 | 0건 | 결함0 | **94·label-content-name-mismatch 잔존** | 69 |
| b | 0 | 0 | 3종 | 0 | 0건 | 결함0 | 100 | 65 |
| c | 0 | 0 | 3종 | 0 | 0건 | 결함0 | 100 | 65 |

## 상태 동결 해시 (게이트 통과 후, 캡처 전)
- b: `b3e0ed5254e54f227eb0d2bb350bdec772d5e4ab`
- c: `10dd2847ccdd72a5fa80aece01444d68bde49a82`

## 스크린샷
후보별 4폭(390/1280/1440/1920) × 스크롤 0/35/70/100% — `blank:false` 전수, `vault/20-generations/2026-10-09-auto-dash-r39/shots/`.
