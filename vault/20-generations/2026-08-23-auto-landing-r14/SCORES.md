# auto-landing-r14 — 하드게이트

**판정 대상 해시**: `547272086106fdc18a30db4424f83011a3816e84` (1-fix 후)
1-fix 이전: `ccec87bc0988c9975b578b2a4a4b2b1fddda0172`

**명령**: `node scripts/gate.mjs --target web --routes /landing-evolve/r14/<v>`

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf | 결과 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **a** | ✓ | ✓ | ✓ | ✓ | 3종 | 0 | 0 누락 | 0 | 92→**100** | 75 | **1-fix 후 생존** |
| **b** | ✓ | ✓ | ✓ | ✓ | 3종 | 0 | 0 누락 | 0 | 94→**100** | 75 | **1-fix 후 생존** |
| **c** | ✓ | ✓ | ✓ | ✓ | 3종 | 0 | 0 누락 | 0 | **100 (감사 실패)** | 74 | **재실패 — 탈락** |

**세 후보 전원이 1차에서 `a11y` 하나로 걸렸고 나머지 9관문은 전부 통과했다.**

## 1차 실패 내역

**a — 92 · `color-contrast` + `target-size`**
```
sel : div.mx-auto > div > div.flex > span.select-none
snip: <span aria-hidden="true" class="select-none text-[clamp(3rem,7vw,5rem)] font-extrabold …">
why : contrast 1.15 (fg #1c1c20, bg #0b0b0f, 80px bold) — Expected 3:1

sel : div.lg:sticky > … > button.absolute
snip: <button aria-label="Comparable sale $902, Mint condition, inside your range">
why : Target has insufficient size (16px by 94px, should be at least 24px by 24px)
```

**b — 94 · `color-contrast` + `landmark-one-main`**
```
sel : section#why > div.relative > span.pointer-events-none   (그리고 section#listings 동일)
why : contrast 1.08 (fg #15151c, bg #0b0b0f, 150px bold) — Expected 3:1
sel : html.h-full
why : Document does not have a main landmark
```

**c — 100 · `label-content-name-mismatch`** (6 노드)
```
sel : div.lg:col-span-7 > ul.mt-2 > li.border-t > button.w-full
snip: <button aria-pressed="true" aria-label="Authenticity call reversed. 34 cases, 27 caught by us, 7…">
why : Text inside the element is not included in the accessible name
```

## 1-fix 결과

**a — 통과.** ghost 넘버를 `#6B6B78`(3.74:1)로 올리고 **크기·웨이트·자간으로 위계를 되찾았다**(80px/800 → 32px/500 + `tracking-[0.12em]`). comp tick 12개는 `<button>` → `aria-hidden` 장식 `<span>` 으로 강등하고, 사라진 판독 라인을 **밴드 상태 연동 라이브 문장**으로 대체해 증거면 수를 유지했다.

**b — 통과.** ghost 넘버를 `#626269`(3.25:1)로 올리고 `110/150px` → `52/68px` 폴리오 숫자로 성격을 바꿔 죽였다. `<main>` 을 `</header>` 직후~`<footer>` 직전에 1개 추가.

**c — 재실패.** `aria-label` 을 보이는 문구로 시작하게 고치고 인덱스·마커·퍼센트 캡션에 `aria-hidden` 을 걸었으나 **버튼 안 건수 열이 보이는 텍스트로 남았다.** `PreviewDeck` 카드 4개에 같은 변환을 선제 적용하면서 **실패 노드가 6 → 10 으로 증가.** §3 "재실패 → 탈락".

## ★ 점수 100 짜리 탈락

c 는 처음부터 끝까지 a11y **100** 이었다. 떨어뜨린 것은 승격 감사 하나다 — [[page-brief-core]] §1 이 *"점수 95는 절대 규칙을 강제하지 못한다 … 가중치 0인 감사는 총점 100을 받고도 실패한다"* 고 적어 둔 경로가 **처음으로 후보를 실제로 탈락시켰다.**

## ★ 오케스트레이터가 준 값이 틀렸고 designer 둘이 각자 잡았다

1-fix 지시에서 ghost 넘버 대안으로 `#52525b ≈ 4.0:1` 을 제시했다. **실제 2.54:1 이다.**

- a: *"코디네이터 제시 `#52525b` 는 내 실측 2.54:1 로 여전히 미달이라 채택하지 않았다"*
- b: *"지적하신 `#52525b` 는 내 계산상 2.54:1 로 미달이라 채택하지 않고 한 단계 더 밝은 값으로 올렸다"*

검산: `#52525b` L=0.0857 · `#0b0b0f` L=0.00345 → **2.54:1**. **그대로 따랐으면 둘 다 1-fix 를 쓰고 재실패했을 것이다.**

## designer 예산 — 스킬 §2 수정 2회차 확인

| 후보 | 도구 호출 | 산출 |
|---|---|---|
| a | 5 | 완성 |
| b | 4 | 완성 |
| c | 20 | 완성 |

`auto-landing-r11`(수정 전, 같은 landing 타깃)은 **31·35·37회를 쓰고 3후보 중 2개가 파일 0개**로 끊겼다. 같은 타깃에서 직접 비교되는 첫 사례다.
