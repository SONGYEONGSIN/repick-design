# Candidate a — Buyer Protection Coverage

A read-only completed-record screen for a purchase-protection plan attached to a past order: coverage status (Active / Expiring Soon / Expired, computed from fixed coverage-window dates), what the plan does and doesn't cover, plan terms (max claim value, deductible, claims used), and a claim history list. Macro band-form is the "completed-record" band per GENERATION.md §3 — since there's no blocked step here, the bottom band is not a state machine; it's mounted only while a real action exists ("File a Claim", enabled because the plan is Active and has a remaining claim), and unmounts entirely once that allowance hits zero rather than sitting around as a decorative disabled button.

Default export component: ProtectionCoverageScreen (file: ProtectionCoverageScreen.tsx)
Check string (exact visible text on initial render): "Protection Coverage"

## 브리프에 없던 것

1. **"File a Claim" 버튼이 실제로 뭘 해야 하는가** — 브리프는 "activated when active/eligible and does something real"이라고만 했지 그 결과 화면까지는 정의하지 않았다. 네비게이션 컨텍스트가 없는 독립 컴포넌트라 다른 화면으로 못 넘어가므로, 버튼을 누르면 액션바 자신이 인라인 클레임 접수 폼(사유 선택 라디오 목록 + Cancel/Submit Claim)으로 바뀌고, 제출하면 실제로 `claims` 상태에 새 레코드가 추가되고 남은 청구 가능 횟수가 줄어드는 식으로 구현했다. 근거: GENERATION.md §3의 "파괴적 확인은 밴드 자신을 Cancel/Confirm 두 버튼 행으로 전환한다" 관용구를 파괴적이지 않은(하지만 소모성 있는— 청구 한도를 깎는) 액션에 원리만 빌려 재적용했고, 코드 표면(스타일 키 이름·문구)은 이 화면 도메인에서 새로 짰다(§3 "형태 선택과 구현을 분리" 조항).
2. **청구 가능 횟수·이미 있었던 청구 이력을 얼마로 둘지** — 브리프는 "claim history if any"라고만 했다. 화면이 상태 전환(청구 접수 시 남은 횟수 감소, 밴드 소멸)을 실제로 보여줄 수 있도록 `maxClaims: 2`, 기존 승인 완료 청구 1건으로 설정해 "이번이 마지막 남은 1회"라는 의미 있는 시나리오를 만들었다. 근거: 순수 정적 화면보다 실제 상태 변화를 보여주는 편이 "진짜로 완성된 화면"이라는 태스크 지시에 부합한다고 판단(임의 결정).
3. **"Expiring Soon" 임계값** — 브리프에 없어 30일을 기준으로 임의 설정했다(전자상거래/보험 UI에서 흔한 관행값). purchase 날짜를 2025-10-15, 오늘을 2026-09-21로 고정해 만료까지 24일 남은 "곧 만료" 상태를 실제로 트리거시켜, success/warning 두 톤 모두를 화면에서 보여줄 수 있게 했다.
4. **success/warning/accent-tint 토큰이 tokens.ts에 없었음** — "covered/eligible" 상태와 "expiring soon" 경고 톤, 그리고 라디오 선택 강조용 옅은 accent 배경색이 필요했는데 토큰 세트에 없어 `color.success`/`successBg`/`successBorder`, `color.warning`/`warningBg`/`warningBorder`, `color.accentBg`를 직접 추가했다(기존 `danger`/`dangerBg` 항목과 같은 패턴 — 흰 배경 대비 AA 비율을 주석에 명시). 근거: 브리프가 "토큰에 없으면 직접 추가하라"고 명시적으로 허용.
5. **KRW 표기 방식** — ₩ 글리치 이슈를 원천 차단하기 위해 ₩ 글자를 아예 쓰지 않고 `"KRW 389,000"` 형식만 사용했다(브리프가 제시한 두 안전한 선택지 중 더 단순한 쪽).
