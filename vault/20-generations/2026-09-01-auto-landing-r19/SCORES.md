# auto-landing-r19 — SCORES

게이트: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 node scripts/gate.mjs --target web --routes /landing-evolve/r19/<v>` (세션 로컬 chromium 사전설치본 — playwright.dev CDN 다운로드가 프록시에서 차단됨, gate.mjs 자체는 무수정)

소스 동결 해시(§2 종료 시점, 1-fix 전): `1e1412782869b372bd3ce4bab32e5357ec555055`

## 후보 a — Editorial Data-Room ("The Case File") — **탈락**

1차 게이트: FAIL, 19 violations — `no-unlisted-font`(8, `DISPLAY_FONT` 식별자 간접참조가 정적검사 리터럴 매칭을 못 걸림) · `sweep` table-overflow(5, 1264/1280/1350px) · `focus` 3건(테스트모니얼 dot 버튼, 7×7px 타깃이라 표시가 사실상 안 보임) · `a11y` 93(<95) + `color-contrast`·`target-size` 하드페일 감사.

1-fix 적용: 8개 폰트 사이트를 리터럴 `var(--font-display-wide), var(--font-sans)`로 인라인 교체, `min-w-[560px]` 제거(`table-fixed`+`w-full`), 테스트모니얼 dot 버튼을 27×27px 히트타깃으로 재구조화(포커스링 별도 span), `mutedOnBg`→`mutedOnSurf` 표면별 분기(surface 위 4.13:1 실패 → 5.61:1).

재게이트: **FAIL, 9 violations** — `sweep` table-overflow **재발**(4건, 1264/1280/1350px, 동일 위치) + 신규 `cell-overlap` 4건(390px, "Confidence"↔"Recommended price" 21px 겹침 · 인스펙션 등급 3행 각 5px 겹침 — `table-fixed`로 전환하며 좁은 열에서 텍스트가 겹침). a11y는 100으로 해소, focus 0건, static/lint 0건.

**§3 규칙에 따라 재실패 → 탈락**(1회 수정 기회 소진). judge 패널 미진입.

## 후보 b — Reverse Auction Ledger — **생존**

1차 게이트: FAIL, 1 violation — `lint` `react-hooks/refs`(`Ledger.tsx:165`, `useMemo` 콜백 안에서 `prevOrderRef.current` 읽기 — 렌더 중 ref 접근).

1-fix 적용: ref 기반 이전-순위 추적을 React 공식 "adjust state during render" 패턴(`useState` 쌍 + 렌더 바디 조건부 `setState`)으로 교체, `useRef`/`useEffect` 제거.

재게이트: **PASS** — route OK · types 0 · static 0 · lint 0 · weights 3종 · sweep 오버플로 0 · focus 0건 누락 · console 26건·결함 0 · a11y 100(실패감사 bf-cache만, 비승격) · perf 63(기록만).

## 후보 c — Handoff Timeline — **생존**

1차 게이트: **PASS**(1-fix 불요) — route OK · types 0 · static 0 · lint 0 · weights 3종 · sweep 오버플로 0 · focus 0건 누락 · console 78건·결함 0 · a11y 100(실패감사 bf-cache만) · perf 69(기록만).

## 요약

| 후보 | 1차 | 1-fix 후 | 최종 |
|---|---|---|---|
| a | FAIL 19건 | FAIL 9건(재발+신규) | **탈락** |
| b | FAIL 1건(lint) | PASS | 생존 |
| c | PASS | — | 생존 |

judge 패널: 생존 후보 2개(b, c) — §4 규정대로 정상 3렌즈 다수결 진행(1개가 아니므로 단독심사 아님).
