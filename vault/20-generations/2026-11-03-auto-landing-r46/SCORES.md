# auto-landing-r46 — SCORES

source hash (frozen after designer handoff, before 1st gate): `8e0071fc6e29f58a7b527f7777ff898007b6952c`

## Candidates
- **a** — "Credit Stack" — Trade-In / Instant-Offer Credit Calculator. Condition selector + price slider → live instant-credit number, visualized as a two-row icon-array (isotype) pictogram (not a bar/dumbbell/gauge/receipt/ladder — all already used in the catalog, confirmed via a pre-build collision grep documented in `candidates/a.md`). Dark / sky / `--font-display-grotesk`.
- **b** — AI Listing Copywriter Preview. Tone toggle × category select → live-regenerating marketing paragraph + extracted keyword chips (click-to-highlight-in-text). Light / teal / `--font-display-mono`.
- **c** — "Payout Speed Race" — two horizontal payout tracks (Instant vs Standard) racing to completion at genuinely different real-time speeds, triggered by a "Simulate a sale" action. Light / rose / no display face (Pretendard only, deliberate).

## Hard gate — 1st pass (`node scripts/gate.mjs --target web --routes /landing-evolve/r46/a /landing-evolve/r46/b /landing-evolve/r46/c`, then re-run per-candidate individually to localize the combined-run's a11y attribution ambiguity — `worstLighthouse` doesn't attribute a11y failures to a specific route when multiple routes are gated together)

| candidate | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a | ✅ | ✅ | ✅ | ✅ | ✅ (3종) | ✅ | ✅ | ✅ | ✅ 100 | ✅ 80 |
| b | ✅ | ✅ | ✅ | ✅ | ✅ (3종) | ✅ | ❌ 29건 | ✅ | ❌ 96 (`color-contrast`) | ✅ 88 |
| c | ✅ | ✅ | ✅ | ✅ | ✅ (3종) | ✅ | ❌ 11건 | ✅ | ✅ 100 | ✅ 83 |

**a: clean on first pass, 0 violations — no fix needed.**

**b 1차 실패 상세 (두 건)**:
1. `focus` 29건 — 모든 버튼/링크가 `outline-none`과 `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]`를 함께 쓰고 있었다. 직접 Playwright로 실제 Tab 포커스 후 `getComputedStyle` 확인: `outlineWidth:2px`·`outlineColor:rgb(15,118,110)`는 정확히 계산됐지만 **`outlineStyle: none`** — `page-brief-core.md` §2가 이미 문서화한 죽은 포커스 관용구(Tailwind v4의 공유 `--tw-outline-style` 커스텀 프로퍼티를 `outline-none`이 `none`으로 선점해, 이후 `focus-visible:outline-*`가 같은 변수를 다시 읽어도 `none`인 채로 남는다)와 정확히 일치. 같은 라운드의 자매 후보 `a`(`PriceSlider.tsx`)가 애초에 `outline-none`을 쓰지 않는 방식으로 이 함정을 회피해 둔 것이 대조군.
2. `a11y` `color-contrast` (score 0, 하드페일 승격 감사) — Lighthouse 직접 재실행으로 노드 특정: `GeneratedCopy.tsx:82`의 실시간 재생성 태그라인 `<p>`가 `text-[#0d9488]`(디자이너 자신이 3.75:1로 계산해 둔 베이스 틸)를 `text-xl`(20px)에 썼는데 실측 3.74:1 — 본문 크기 AA(4.5:1) 미달(20px·weight 600은 대형 텍스트 예외 조건인 ≥24px 또는 ≥19px bold(700+) 어느 쪽도 충족 못함).

**c 1차 실패 상세**: `focus` 11건 — 동일한 `outline-none` + `focus-visible:outline*` 죽은 관용구. b와 달리 c는 모든 인터랙티브 요소가 `tokens.ts`의 공유 `FOCUS` 상수 하나를 쓰고 있어 원인이 한 곳에 집중돼 있었다.

## 1-fix
- **b**: ① `outline-none` 토큰을 `Hero.tsx`·`ToneToggle.tsx`·`GeneratedCopy.tsx`·`ClosingCTA.tsx`·`CategorySelect.tsx` 5곳에서 전부 제거(`focus-visible:*`는 그대로 유지) ② `GeneratedCopy.tsx:82`의 `text-[#0d9488]` → `text-[#0f766e]`(5.48:1, 이미 다른 곳에 쓰던 값)로 교체. 그 외 변경 없음.
- **c**: `tokens.ts`의 공유 `FOCUS` 상수 한 줄에서 `outline-none` 토큰만 제거(`focus-visible:*`는 그대로 유지). 모든 인터랙티브 요소가 이 상수를 공유해 한 곳 수정으로 11건 전부 해소. 그 외 변경 없음.

## 하드게이트 — 재게이트 (수정 후, 후보별 개별 실행)

| candidate | 결과 |
|---|---|
| a | `pass: true`, 0 violations (변경 없었음, 재확인) |
| b | `pass: true`, 0 violations — focus 0건, a11y 100 |
| c | `pass: true`, 0 violations — focus 0건, a11y 100 |

**9/9(= 3후보 × 각 9게이트 중 실질 신규/재확인 항목) 클린 — 생존 후보 3개(a, b, c) 전원 판정 패널 진입.**

재게이트 후 소스 해시 (판정이 보는 실제 상태): `44b0c33869b324fd090f236fb4ec8e5a66e31fd0`
