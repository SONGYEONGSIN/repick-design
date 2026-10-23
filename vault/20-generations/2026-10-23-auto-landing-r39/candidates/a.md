# auto-landing-r39/a — "Fairline"

Dark / near-monochrome landing for the AI-verified resale product. Hero carries the
headline, subhead, CTA and both product-preview cards (Alpine Shell Jacket, Trail Runner
Boots) in one component — badges (condition, verified seller, discount) sit in a row
below the generative SVG art frame, never overlaid on it. The one interaction axis is a
single continuous slider weighting "AI photo analysis" against "seller history"; it
recomputes one blended match-score number live, and that same live number is what the
closing CTA quotes ("Alpine Shell Jacket scores {blended}%") — the manipulation state
survives to the end of the page rather than being restated as a static number. Product
cards also carry a per-card "Why this matched" disclosure (keyboard-toggle, not hover-only)
exposing two evidence lines. Theme: dark `#0B0B0F` / accent sky `#0EA5E9` / display face
`--font-display-grotesk`.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: accent 계열(hue)을 무엇으로 할지 — 정본 기본값은 보라(`#6E56CF`)이고 최근 랜딩 승자들이 violet·rose·teal·blue·cyan을 써서 그 다섯이 사실상 소진돼 보였다.
   **무엇으로 정했나**: sky(`#0EA5E9`).
   **왜**: `catalog-variety.mjs` 집계에서 sky가 5건으로 중간 빈도이고(teal·amber 8건보다 낮음), 최근 5라운드(r34~r38: violet/rose/teal/blue/cyan)와 겹치지 않는 계열이라 직접적인 "직전 라운드가 쓴 축" 회피에도 해당한다. 대비는 직접 계산했다 — `#0EA5E9` on `#0B0B0F` = **7.09:1**(본문 크기 AA 통과, 소형 텍스트에 그대로 써도 안전), 채움 배경 위에는 흰색(2.77:1, 실패)이 아니라 어두운 잉크(`#0B0B0F`, 7.09:1)를 텍스트로 썼다.

2. **무엇을 정해야 했나**: 본문 폭/줄당 글자수 — design-principles §Spacing이 요구하는 65~75자 상한을 어떤 컨테이너 폭·폰트 크기 조합으로 지킬지.
   **무엇으로 정했나**: `max-w-[460px]` 컨테이너에 `text-base`(16px) 본문.
   **왜**: 공식 상수(`0.44em` 평균 자폭)로 역산 — `460 ÷ (0.44 × 16) ≈ 65.3자`. 상한 75자에 10자 여유를 둬 "딱 맞음"을 피했다(폭 검증과 같은 태도를 본문 줄 길이에도 적용).

3. **무엇을 정해야 했나**: 포커스 표시 패턴 — 코어 §2가 명시적으로 경고한 두 죽은 관용구(`outline-none`+`ring`/`ring-offset`, `outline-none`+`focus-visible:outline`)를 피해야 했다.
   **무엇으로 정했나**: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]` — `outline-none`을 어디에도 쓰지 않음.
   **왜**: 레포 관례(기존 승격작 `r38/c`)에서 검증된 안전 패턴을 그대로 재사용. 게이트 `focus` 관문이 0건 누락으로 확인.

## 프레임 커버리지 (self_judged 라운드 — judge 본인 메모)

1440px(s0)·1440px(s70)·390px(s0) 3장을 직접 확인. 1280/1920/1440-s35/1440-s100/390-s35/390-s70/390-s100은 육안 미확인 — `sweep` 게이트가 1280~1920 전 구간 오버플로 0을 기계적으로 확인했으므로 레이아웃 붕괴 위험은 낮다고 판단했으나, 시각적 확인은 아니다.
