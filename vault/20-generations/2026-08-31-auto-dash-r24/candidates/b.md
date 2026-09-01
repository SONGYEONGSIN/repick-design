# Candidate B — r24

**Product / brand:** Sluice — a feature-flag & experiment rollout console for engineering teams (invented brand; not affiliated with any real company).

**Concept:** A split workbench for shipping flags safely — a fixed-width left pane holds the flag list and that flag's targeting-rule editor, while the flex-1 right pane holds a single load-bearing mechanism: dragging the rollout-percentage control recomputes an SVG rollout curve and a sortable audience-segment breakdown live, with every count apportioned by largest-remainder rounding so segment sums always reconcile exactly to the current percentage.

**Applied interactions (5):**
1. Chart hover/keyboard crosshair — the rollout curve has a `role="slider"` overlay (mouse + arrow keys + Home/End) that previews any percentage's impacted-user count in a floating tooltip, entirely separate from the committed value (ephemeral preview vs. persistent commit, visibly split as two distinct markers: dashed hover line vs. solid accent marker).
2. Sortable audience-segment table — semantic `<table>` with `aria-sort`, click-to-sort on every column (Segment/Eligible/Included/Excluded/Coverage), plus a filter + sort control on the flag list.
3. Environment segmented control (Dev/Staging/Prod) — a real `radiogroup` with roving tabindex; switching environments re-derives totals for both the chart and the segment table from that environment's eligible population.
4. Selection→multi-widget sync — picking a flag re-keys the rule editor (fresh state) and feeds a new baseline into the single `deriveRollout()` re-encoding function that both the chart and segment table consume; no static block-swapping.
5. **Rollout-percentage control (primary, load-bearing)** — a slider + numeric stepper + presets that recomputes `deriveRollout(flag, env, pct)` on every change: total impacted = round(total × pct/100), and per-segment included/excluded are apportioned via a largest-remainder algorithm so `Σ segment.included === impactedTotal` and `Σ segment.eligible === totalEligible` exactly, at every percentage, for every flag/environment pair.

**Typography:** Body and all UI copy set in Pretendard (`font-sans`) throughout, including the rule editor's form labels and table cells. Headlines/wordmark (`h1` "Feature flags", sidebar wordmark "Sluice") use `var(--font-display-grotesk)` exclusively — no other display var, no serif, no new `next/font` imports. Numbers/percentages/IDs use `tabular-nums`.

**Theme / accent:** Dark (`zinc-950`/`zinc-900` surfaces, `border-white/10`, `zinc-50`/`zinc-400` text). Accent = **sky** (`sky-400`) used for the two allowed highlight purposes: interactive/selection state (selected flag row, active tab, focus rings, primary button, chart line + committed marker, rollout progress fill) and the "live" data highlight. Status badges use separate semantic colors (emerald=active, orange=paused, zinc=draft), each paired with an icon and text label, not color alone.

## 브리프에 없던 것

1. **결정할 것:** 좌측 패널의 정확한 폭.
   **결정:** 400px 고정.
   **근거:** 브리프가 준 범위(380–440px)의 중간값. 1280px 뷰포트에서 사이드바(256px)+좌측 패널(400px)을 뺀 우측 패널 실사용 폭(~534px)을 먼저 계산해, 세그먼트 테이블 컬럼의 실측 최소 폭(숫자 컬럼 ≥85px 등)이 그 안에서 겹치지 않고 들어맞는지 역산해서 정함(r22 사고 재발 방지).

2. **결정할 것:** flag-selection→multi-widget sync를 어떤 메커니즘으로 구현할지 (r23 경고 대상).
   **결정:** 단일 재인코딩 함수 `deriveRollout(flag, env, pct)`를 두고, 선택이 바뀌면 이 함수의 입력만 바뀌게 함. 규칙 편집기는 `key={flag.id}`로 리마운트해 내부 상태를 깨끗이 초기화하되, 이건 "단순 재렌더"로 남겨두고 진짜 신규 메커니즘은 롤아웃 슬라이더 쪽(호버=일시적 미리보기 vs 슬라이더=영구 커밋의 시각적 분리)에 둠.
   **근거:** 브리프가 명시적으로 제안한 두 가지 통과 패턴 중 (a) 재인코딩 함수 방식을 채택 — 이 화면의 실제 메커니즘("슬라이더가 움직이면 차트가 재계산된다")과 자연스럽게 맞아떨어짐.

3. **결정할 것:** 세그먼트 분류 체계(택소노미) 및 각 플래그별 분포.
   **결정:** Enterprise / SMB / Free tier / Trial / Internal·QA 5개 고정 세그먼트, 플래그마다 다른 `segmentShares`(합=1.00)를 부여(예: SSO 플래그는 Enterprise 82%, 나머지는 좀 더 고르게 분포).
   **근거:** B2B feature-flag 제품(LaunchDarkly/Statsig류)의 일반적인 오디언스 분류를 차용. 플래그별로 분포를 다르게 둔 것은 "합계가 항상 정확히 재계산된다"는 요구사항을 여러 케이스(엔터프라이즈 편중 vs 고른 분포)에서 실제로 검증 가능하게 하기 위함.

4. **결정할 것:** 8개 플래그의 이름/오너/규칙/활동 로그 등 구체적 더미 데이터.
   **결정:** 실제 SaaS에서 흔한 기능(체크아웃, AI 코파일럿, 다크모드, 가격 페이지, CSV 내보내기, 온보딩, SSO 강제, 검색 재랭킹)을 골라 각각 상태(active/paused/draft)를 다르게 부여하고, draft 플래그 하나(`onboarding-tooltips-v3`)는 규칙이 0개인 빈 상태로 남겨 "empty state with guidance" 요구사항의 실제 사례로 사용.
   **근거:** "no world-building skin" 지침에 따라 가상의 세계관 대신 실존 SaaS 대시보드에 흔한 기능 목록을 그대로 참조.

5. **결정할 것:** 규칙 삭제의 파괴적 액션 확인 방식.
   **결정:** 모달 대신, 행 자체가 "Remove this rule? [Cancel] [Confirm remove]" 형태로 인라인 치환되는 2단계 클릭 패턴.
   **근거:** 별도 다이얼로그/포털 없이 포커스 관리가 단순해지고, Coinbase/Linear류 프로덕션 SaaS에서 흔히 쓰는 인라인 확인 패턴을 참조.

6. **결정할 것:** 아바타 이미지 소스(결정론적이어야 함, `next/image` 필수).
   **결정:** `picsum.photos/seed/<fixed-seed>/...` — 시드 문자열을 각 오너 이름에 고정.
   **근거:** `next.config.ts`에 이미 허용된 remote pattern이고, 시드가 고정이므로 매 렌더 동일한 이미지가 나와 결정성 요구를 만족.

7. **결정할 것:** 우측 패널의 ultra-wide cap 값.
   **결정:** `max-w-[1800px]`.
   **근거:** 사이드바(256px)+좌측 패널(400px)+패딩을 뺀 1920px 기준 실사용 폭(~1214px)이 1800px보다 한참 작아 1920px에서는 전혀 개입하지 않고, 2560px 이상의 초광폭에서만 완만하게 제한되도록 역산.
