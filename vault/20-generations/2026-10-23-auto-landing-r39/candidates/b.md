# auto-landing-r39/b — "Marked Down"

Light landing built around a category toggle (Sneakers / Bags / Watches) that live-recomputes
a three-stat comparison panel (avg. resale %, avg. verification time, avg. savings vs. new)
from a deterministic per-category lookup table. The savings stat sits in a tinted callout
card to draw the eye. Hero carries two product-preview cards (Canvas Tote, Field
Chronograph) with badges below the art frame. Closing CTA quotes the currently-selected
category and its live average-savings number. Theme: light `#FFFFFF` / accent orange
`#C2410C` (`-700`) / display face `--font-display-mono`.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 라이트 테마에서 accent 계열 — 최근 랜딩 승자 중 라이트가 r36(teal)·r37(blue)·r38(cyan) 셋이라 그 계열들은 회피 대상으로 봤다.
   **무엇으로 정했나**: orange.
   **왜**: `catalog-variety.mjs` 집계에서 orange는 3건뿐(teal·amber 8건 대비 적음)이라 과다사용 축이 아니다. 대비는 직접 계산했다 — 본문 크기 텍스트에는 `orange-500`(2.80:1)·`orange-600`(3.56:1) 둘 다 AA 미달이라 버렸고, **`orange-700`(`#C2410C`) on `#FFFFFF` = 5.18:1**로 AA를 넘겨 그걸 본문·필 배경 모두에 썼다. 채움 배경 위 흰 텍스트도 5.18:1로 안전. 강조용 더 짙은 수치에는 `orange-800`(7.31:1)을 썼다(평균 저축 숫자).

2. **무엇을 정해야 했나**: 틴트 표면(주황 카드) 위 보조텍스트의 대비 하한 — 코어 §2가 "순백이 아니라 틴트 표면은 zinc-600 하한"이라고 적어 뒀다.
   **무엇으로 정했나**: 틴트 카드("Avg. savings vs. new")의 레이블·숫자 모두 `orange-800`(7.31:1, 틴트 표면 기준도 넉넉히 통과)을 직접 지정했고, 범용 `MUTED`(zinc-500) 클래스를 그 카드 안에는 쓰지 않았다.
   **왜**: zinc-500이 순백 위에서는 안전(4.83:1)해도 주황 틴트 배경 위에서는 재계산 없이 재사용하면 위험하다고 판단해, 애초에 그 표면에는 muted 클래스를 재사용하지 않고 accent 색을 직접 지정하는 쪽으로 피해 갔다.

3. **무엇을 정해야 했나**: 카테고리 토글이 바꾸는 범위 — 통계 패널만 바꿀지, 히어로의 제품 카드 2장도 선택된 카테고리에 맞춰 바꿀지 브리프에 없었다.
   **무엇으로 정했나**: 통계 패널만 바꾸고 히어로 카드 2장(Bag·Watch)은 고정해 뒀다.
   **왜**: 시간 예산상 카드 자체를 카테고리별로 교체하는 데이터셋까지는 만들지 않았다. **이것이 이번 라운드 자가판정에서 렌즈1이 실제로 감점한 지점이다** — design-principles §3 "조작 상태는 끝까지 살아 있어야" 원칙을 통계에는 지켰지만 카드 선택에는 적용하지 않아, "Sneakers"를 눌러도 화면엔 가방·시계가 남는 인과 불일치가 생겼다. 다음 라운드가 이 형태를 다시 쓴다면 카드도 카테고리에 종속시켜야 한다.

## 프레임 커버리지 (self_judged 라운드 — judge 본인 메모)

1440px(s0)·1440px(s70)·390px(s0) 3장을 직접 확인. 1280/1920/나머지 스크롤 지점 미확인 — a와 동일.
