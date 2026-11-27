# Candidate a — "Grade Ladder"

**Theme / accent / face**: light / cyan (`#0E7490` text+fill, `#0891B2` large-only) / `--font-display-grotesk`

**One-line concept**: A vertical four-rung condition-grade ladder (A+/A/B/C) is the single
input-manipulation device. Clicking a rung recomputes three outputs at once — the price band, a
three-bar resale-value-horizon chart (3/6/12 months), and a defect-tolerance checklist that lists
exactly what that grade allows. A second, independent toggle ("include original accessories")
layers a small, consistent lift onto all three outputs without changing which grade is selected,
so the two causes of the number moving stay visually distinct. The Hero's single product-proof
card displays the ladder's LIVE grade selection in its Condition badge, not a static catalog
value, so the control's effect is visible before the visitor even scrolls.

**Archetype**: single-select ordinal ladder + independent boolean toggle -> price band + bar
chart + checklist. Not a slider, not a radial gauge, not a toggle-set — closest existing
catalog neighbor is the "Price Band" delta (`auto-landing-r14`, confirm-a-trait -> narrowing
range), but that device narrows a *range* by progressive confirmation; this one *selects* a
discrete rung and reads off three independently-plotted consequences.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 리치 디바이스(사진 없는 순수 UI 컨트롤)를 히어로 컴포넌트 **자기 안**에 두면서도, 모바일 390px 폴드 안에 매물 카드 4배지를 전부 넣는 레이아웃.
   **무엇으로 정했나**: 히어로 2열 중 2번째 열에 "컴팩트 디바이스(4개 rung 버튼 + 가격 1줄)" 다음 "컴팩트 프루프 카드(80px 정사각 썸네일 + 가로배치)"를 순서대로 쌓음 — 전폭 이미지를 쓰지 않음.
   **왜 그렇게 정했나**: `vault/00-principles/reassign-queue.md`의 `auto-landing-r57/a` 재배정 사례가 "전폭 이미지가 모바일 폴드 예산을 혼자 다 먹는다"는 실패를 기록해 둬서, 그 처방(작은 고정 썸네일 + 가로 배치)을 그대로 재사용했다.
2. **무엇을 정해야 했나**: accent `#0E7490`(cyan-700)의 대비 수치.
   **무엇으로 정했나**: 흰 배경 대비 5.36:1(본문 AA 통과), large-only 토큰 `#0891B2`은 3.68:1(대형/논텍스트 전용)로 분리.
   **왜 그렇게 정했나**: `design-principles.md` §Color Tokens가 "계열은 자유, 계산은 필수"라고 적어서 직접 sRGB→WCAG 공식으로 계산(스크립트로 검증, 코드 주석에 산출 과정 기재).
3. **무엇을 정해야 했나**: 본문 컨테이너 폭(75자 상한을 넘지 않는 값).
   **무엇으로 정했나**: 히어로 서브헤드 480px(16px 폰트 기준 68.2자), 체크리스트 300px 등 — `ch` 단위 대신 0.44em/glyph 상수로 역산.
   **왜 그렇게 정했나**: `design-principles.md` §Spacing가 `ch` 단위를 명시적으로 금지하고 0.44em 상수를 제공해서 그대로 계산.
