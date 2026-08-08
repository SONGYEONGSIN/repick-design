# Candidate a — Isoline

Isoline is a fictional B2B SaaS running global payroll and compliance infrastructure for distributed teams ("pay and regulate a team in fourteen countries without fourteen separate vendors"). The page makes geography the primary browsing structure rather than a filter bolted onto a flat list: an ARIA tablist of offices ("All offices" + Austin/HQ, Lisbon, Singapore, Remote) drives the whole roles section, and the default "All offices" tab already renders all fourteen open roles grouped by city with real job titles visible on load — no click required, satisfying the careers content contract by construction. Roles render as single-column cards, not a wide table, so there is no table-crowding risk at 390px. On top of the office axis, a native `<select>` narrows by team (five departments) and a text input narrows by keyword — neither ever hides the list to zero without a "clear filters" affordance. A fourth, non-decorative interaction lives in the sidebar: a deterministic timezone-overlap panel (built from fixed UTC-hour integers, never the visitor's clock) recomputes per office selection, showing exactly how many hours a given office's workday overlaps with HQ's — including the honest case (Singapore) where the answer is zero and the copy says so. Theme is light with a single amber accent (amber-600/700/800 text and amber-500/600 fills, both checked against white and zinc-50 for AA); display type uses `--font-display-grotesk` for the h1/logo only, with exactly three font-weight classes route-wide (font-normal, font-semibold, font-black). Static complements: a four-step hiring-process list and a benefits grid, both non-interactive by design so they don't compete with the office/role/timezone mechanism for attention.

## 브리프에 없던 것

1. **무엇을 결정해야 했나**: "오피스 레일/탭 구조"라는 지시는 있었지만, 오피스를 선택했을 때 사이드바에 무엇을 보여줄지는 브리프에 없었다.
   **무엇을 결정했나**: 순수 장식이 아니라 HQ(Austin) 대비 근무시간 겹침을 보여주는 결정론적 타임존 바 차트를 넣었고, 겹침이 0시간인 싱가포르 사례를 굳이 포함했다.
   **왜**: "지리를 부차적 필터가 아니라 페이지의 주 구조로 삼으라"는 지시를 인터랙션 개수 채우기가 아니라 실제로 지리가 정보를 바꾸는 사례로 증명하고 싶었다. 겹침 0시간을 숨기지 않고 "비동기 핸드오프"로 정직하게 표기해, 색만으로 의미를 전달하지 않는다는 원칙도 같이 만족시켰다.

2. **무엇을 결정해야 했나**: 팀(부서) 축을 오피스 축과 어떻게 결합할지 — Fathom/Talus의 다중 체크박스, Ridgeline의 텍스트 검색, Harborlight의 세그먼트 토글이 이미 쓰인 상태에서 겹치지 않는 메커니즘이 필요했다.
   **무엇을 결정했나**: 순정 시맨틱 `<select>` 단일 선택으로 처리했다(별도 ARIA 롤 없이 네이티브 접근성에 의존).
   **왜**: 이미 세 가지 다른 필터 메커니즘(체크박스, 콤보박스, 세그먼트 토글)이 쓰였고, 커스텀 ARIA 위젯을 하나 더 추가하면 오피스 탭리스트라는 이번 라운드의 진짜 차별점이 흐려진다고 판단했다. 네이티브 select는 구현 리스크가 없고, 어떤 스크린리더/키보드 환경에서도 검증이 필요 없을 만큼 견고하다.

3. **무엇을 결정해야 했나**: Remote 오피스의 "UTC 오프셋"을 어떻게 표현할지 — 실제 원격 인력은 고정된 하나의 시간대가 없다.
   **무엇을 결정했나**: Remote를 지어낸 단일 UTC 오프셋이 아니라 "core hours 9am–5pm ET" 같은 서술형 라벨과, 겹침 계산용으로는 별도의 대표 근무시간 밴드(13:00–21:00 UTC)를 부여해 타임존 바에도 자연스럽게 태웠다.
   **왜**: Remote를 오피스 목록에서 제외하면 "오피스 우선" 골격이 원격 인력을 이등 시민으로 만들고, 반대로 가짜 정밀 오프셋을 지어내면 거짓 정확도가 된다. 서술형 라벨 + 계산용 밴드를 분리해 카피는 정직하게, 시각화는 여전히 일관되게 유지했다.
