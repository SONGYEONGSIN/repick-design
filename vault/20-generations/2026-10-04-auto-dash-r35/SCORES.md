# auto-dash-r35 — hard gate

Source freeze SHA-1 (surviving candidates a+b, post-fix, all .tsx/.ts concatenated with c's dropped files): `caf992e77777594409596338e5c4ea4f978af97d`

| route | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a (Fluxgate — candlestick/feed) | 통과 | 통과 | 통과 | 통과 | 3종 | 통과 | 통과 | 통과 | 100 | 53 |
| b (Fluxgate — streaming ops) | 통과 | 통과 | 통과 | 1차 실패→1-fix 통과 | 3종 | 통과 | 통과 | 통과 | 100 | 39 |
| c (Quadrant — scatter command-deck) | — | — | — | **탈락** | — | — | — | — | — | — |

- **a**: 1차부터 10/10 클린. a11y 100(실측 — `CHROME_PATH`/`PW_CHROMIUM_PATH` 지정 후 lighthouse 실제 구동, `unavailable` 아님).
- **b**: 1차 lint 2건 실패 — `react-hooks/set-state-in-effect`(`prefersReducedMotion`을 effect 안에서 동기 `setState`) + `react/no-unescaped-entities`(아포스트로피). `useSyncExternalStore`로 전환 + `&apos;` 이스케이프로 1-fix 재통과, 10/10 클린.
- **c (탈락)**: 1차 복합 실패(lint 2건 + 하이드레이션 불일치 + a11y target-size) → 1-fix 시도(아포스트로피 이스케이프 + `formatCompactUsd` 0 특수처리 + 산점도 점을 포인터 전용으로 전환해 핀 액션을 테이블 Pin 열로 이전) → **재게이트 재실패**(colgroup 재분배가 만든 신규 390px cell-overlap 7px + 정렬헤더 버튼 높이 미달로 target-size 재발, 산점도 점과 무관한 별도 원인). 스킬 §3 "재실패 시 탈락" 적용 — `reassign-queue.md` #8로 정밀 진단과 함께 등재.

CHROME_PATH 노트: 이 세션은 `PW_CHROMIUM_PATH`만 지정했을 때 lighthouse가 Chrome을 못 찾아 a11y/perf가 `unavailable`(=pass 취급, 미실측)로 떨어지는 것을 발견 — `CHROME_PATH`를 함께 지정하면 실측된다. 이후 모든 게이트 호출에 둘 다 지정.
