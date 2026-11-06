# Firebreak — reliability/incident-management SaaS, hero SLA number + dense inline-stat bullet grid

## Structure

Macro layout is **hero-number + inline-stats, no dominant centerpiece visualization**, as assigned.

- **App shell**: fixed 256px light sidebar (brand lockup, workspace switcher, 5-item nav with pill active state, bottom user card) + sticky topbar (⌘K search trigger, "New incident" primary button, notifications, avatar menu). Mobile collapses the sidebar into a drawer behind a hamburger button.
- **Row 1 — Hero**: one card containing a single giant number, **SLA compliance rate** (e.g. `72.7%`), with a period label, a vs-prior-period delta badge, an on/below-target badge, a one-line "X of Y incidents" explainer, and a small supporting chip ("N incidents logged / N were P1"). This is the one unmissable number on the page.
- **Row 2 — Inline stats**: a single card holding an 11-tile bullet/sparkline grid (`grid-cols-2` → `sm:grid-cols-3` → `lg:grid-cols-4`, two tiles always `col-span-2` for width variety): MTTR, MTTA, P1 count, customer-facing count, a weekly-incident-volume sparkline, an MTTR sparkline, change failure rate, postmortem completion, pages-per-engineer, mean-time-between-incidents, error-budget-consumed. Presentation is deliberately mixed: some tiles are bullet-bar-against-target, two are sparkline+trend, all print the real number as text regardless of hover state.
- **Row 3 — Secondary widgets (no centerpiece)**: a compact horizontal bar list of "incidents by service" (2/5 width on `xl`) next to a real sortable/filterable incidents table with a severity segmented-control filter, `aria-sort`, and a hover/focus incident-preview strip (3/5 width). Neither is allowed to dominate — the bar chart is ~140px tall, the table body caps at 420px with internal scroll.
- Mobile (<1024px / `lg`): the table becomes a stacked card list instead of a cramped table — no horizontal scrollbars anywhere on the page, desktop or mobile.

## Interactions (6 implemented)

1. **Period toggle** (This month / Last month, segmented control) — recomputes the hero number, every inline-stat tile, and the table's base record set together as one scope (Axis A).
2. **Table sort** — click any sortable column header (ID, Service, Severity, Resolved, SLA); real `aria-sort`, toggles asc/desc, keyboard-operable via the header button.
3. **Table severity filter** — segmented control (All/P1/P2/P3) filtering the incident rows live, independent of sort and of period.
4. **Row hover/focus → ephemeral preview** (Axis B) — hovering a row, or Tab-focusing its ID button, fills a preview strip above the table with that incident's owner, service, severity, SLA status and ack/resolve times. This state is local to the table card and is never read by the hero or the stat tiles, and vice versa — see the code comments in `FirebreakClient.tsx` and `IncidentsTable.tsx` marking Axis A vs Axis B explicitly.
5. **⌘K command palette** — opens via trigger button or Cmd/Ctrl+K, filters a combined list of "switch period" and "jump to incident" commands, full keyboard nav (↑/↓/Enter/Esc) with a correctly-wired `aria-activedescendant` listbox pattern. Selecting an incident re-uses the same Axis-B preview state (demonstrating the two trigger paths converge on one piece of state without touching Axis A).
6. **Sparkline hover/focus crosshair tooltip** — the weekly-volume and MTTR sparkline tiles have an invisible focusable button per data point; hovering OR tabbing to a point shows an exact-value tooltip with a crosshair line. The headline number next to each sparkline is always visible as plain text regardless.

## 브리프에 없던 것

1. **① 브랜드/도메인** — 브리프는 "any B2B domain"만 요구. **결정**: SRE/인시던트 신뢰성 관리 SaaS "Firebreak". **근거**: 카탈로그에 이미 과다한 `-line`/`-ledger`/`-ward` 접미사 네이밍 패턴(Ledgerline, Flowline, Riskline, Ledgercheck 등)을 피하고, 지정된 orange 계열과 자연스럽게 어울리는(화재 진압) 독립적인 이름을 임의로 선택.
2. **② 히어로 지표의 정의** — 브리프는 "a headline KPI"라고만 하고 구체적 지표/공식을 특정하지 않음. **결정**: "SLA compliance rate" = (severity별 SLA 시간 내 해결된 인시던트 수) / (전체 인시던트 수) × 100. **근거**: PagerDuty/Atlassian 류 인시던트 관리 제품의 통상적인 1차 KPI 관행을 참조해 임의로 선정.
3. **③ Severity별 SLA/ACK 목표 시간** — P1 30분/P2 60분/P3 180분 해결 목표, ACK 5/10/30분. 브리프에 수치 지정 없음. **결정**: 업계에서 흔히 보이는 등급별 SLA 비율(약 1:2:6)을 참조해 임의로 설정, `data.ts` 상단에 상수로 고정.
4. **④ 인라인 통계 8종의 타깃값** — MTTR≤90분, MTTA≤10분, P1≤2건, 고객영향≤4건, 변경실패율≤5%, 포스트모템 완료율=100%, 엔지니어당 페이지≤12, 사고간 평균시간≥48시간, 에러버짓 소진≤100%. 브리프는 "value vs target" bullet만 요구하고 구체적 목표는 미지정. **결정**: 각각 그럴듯한 SRE 업계 관행 수치를 임의로 설정(코드 주석에 "business thresholds, not derived from the ledger"로 명시).
5. **⑤ 레코드에서 도출 불가능한 운영 입력값** — 기간별 배포 건수(160/182), 페이지 건수(104/96), 엔지니어 수(6), 에러버짓 분량(600분). 인시던트 레코드만으로는 계산할 수 없는 값들. **결정**: 실제 제품이라면 배포 시스템/페이저 시스템에서 가져올 별도 운영 입력으로 간주, `PERIOD_CONTEXT` 상수로 분리 선언(인시던트 배열과 혼동되지 않도록 주석 명시).
6. **⑥ "단일 accent" 해석** — 브리프는 orange를 "SINGLE accent color"로 요구. 하지만 상태 배지(성공/위험/경고)에는 emerald/rose/amber도 사용함. **결정**: "single accent"는 브랜드/인터랙션 강조색(버튼·포커스링·active nav)에만 적용되고, 관례적인 의미색(semantic status color)은 별개 레이어로 해석. **근거**: 동일 카탈로그의 기존 후보(r49/c, r52/b "Ledgercheck")가 이미 "단일 accent + 별도 semantic 배지 스케일" 조합을 채택한 선례를 참조.
7. **⑦ 텍스트용 orange 음영 선택** — 브리프가 예시로 든 `#EA580C`(orange-600)는 백색 배경에서 직접 계산해보니 대비비 ≈3.56:1로 본문 텍스트 AA(4.5:1)에 미달. **결정**: 모든 "텍스트/아이콘" 용도는 orange-700(≈5.18:1)로, orange-600/500은 텍스트가 아닌 채움(바, 액티브 필 배경, 스파크라인 선)에만 한정. **근거**: WCAG 상대휘도 공식으로 직접 계산(코드 주석에 수치 명시).
8. **⑧ 히어로 숫자 자체의 색** — "accent used sparingly...for key data"가 accent 사용을 허용하지만 강제하지는 않음. **결정**: 히어로 숫자(56–64px)는 orange가 아닌 zinc-900으로. **근거**: orange-600은 거대 텍스트에 대한 WCAG large-text 예외(3:1)만 통과하고 일부 엄격한 자동 검사기가 적용할 수 있는 4.5:1 일반 기준은 못 통과하므로, 모든 검사 기준에서 확실히 통과하는 쪽을 임의로 선택(orange는 대신 아이콘 칩과 배지로 프레이밍).
9. **⑨ 데스크톱 표 vs 모바일 처리 방식** — 브리프는 "mobile-only horizontal scroll" 패턴을 허용하되 요구하지는 않음. **결정**: `lg`(1024px) 기준으로 표 전체를 카드 리스트로 치환(가로 스크롤 완전 배제). **근거**: "두 개의 overflow-x-auto 컨테이너 금지"/"sr-only + 가로스크롤" 함정을 원천적으로 피하기 위한 보수적 선택.
10. **⑩ 울트라와이드 캡 수치** — 사이드바 256px + lg 패딩 양쪽 32px 기준, 1920px에서 가용폭 1600px(우측 여백 32px ≤ 40px 기준 통과)을 계산 후 `max-w-[1920px]`를 완만한 상한으로 설정(2240px 근방부터 체감 작동). **근거**: 브리프가 요구한 산식을 내 실제 셸 치수로 직접 계산.
11. **⑪ 온콜 담당자 6인의 이름·아바타** — 브리프는 "실제 고정 Unsplash photo-id" 사용만 요구, 인물 특정은 없음. **결정**: 가상 인물 6명(Mia Chen, Daniel Osei, Priya Nair, Marcus Webb, Elena Kade, Tomas Rivera)과 고정 `images.unsplash.com/photo-<id>` 6개를 임의 배정.
12. **⑫ "higher-is-better" 지표의 bullet 인코딩** — 브리프는 bullet이 "value vs target"이라고만 설명, 방향이 반대인 지표(사고 간 평균 시간 — 길수록 좋음)의 표현법은 미지정. **결정**: `BulletBar`에 `higherIsBetter` 불리언을 추가해 틱 라벨을 "Target"→"Floor"로 바꾸고 on-target 판정 로직만 반전, 시각적 바는 동일하게 유지. **근거**: 브리프에 선례가 없어 가장 단순한 확장으로 임의 설계.
13. **⑬ 통화 표기 회피** — 브리프는 `₩` 사용 시의 렌더링 함정을 경고하되 사용을 강제하지 않음("if you use it"). **결정**: 이 도메인(신뢰성/인시던트)에는 금전 지표가 없으므로 통화 기호를 전혀 사용하지 않음. **근거**: 함정 자체를 회피하는 가장 안전한 선택.
