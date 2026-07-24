# auto-dash-r4 — HARD GATE

| 후보 | 정적 검사 | sweep | Lighthouse a11y | Lighthouse perf (기록만) |
| --- | --- | --- | --- | --- |
| a (Ridgeline) | pass | pass (1회 수정 후 통과 — 그리드 detail-drawer 아님, ListRail의 ARIA listbox/option 구조 결함: `role="listbox"` 컨테이너 자식으로 `<ul>` 직접 배치 금지·`role="option"` 버튼의 필수 부모(`group`/`listbox`) 부재·`<ul>`에 `role="presentation"` 자식 배치 금지 — `<ul>/<li>` 제거하고 상태그룹을 `role="group"` div로 재구성. + color-contrast 2건: 선택 행(`bg-indigo-50`) 위 `text-zinc-500`가 인디고 배경 대비 4.31(미달) → `text-zinc-600`로 상향, 서브이슈 완료 취소선 텍스트 `text-zinc-400`(대비 2.62) → `text-zinc-500`로 상향) | 1차 85(위 4건 위반) → 수정 후 100 | 96 |
| b (Wardline) | pass | pass (1회 수정 후 통과 — 결함 2종: ① 닫힘 상태 상세 드로어가 `fixed` + `translate-x-full`로 시각적으로는 화면 밖이지만 Chromium이 document.scrollWidth에 여전히 포함시켜 전 데스크톱 폭 페이지 오버플로 유발 → `fixed inset-0 overflow-hidden` 클리핑 래퍼로 감싸고 내부를 `absolute`로 전환해 해결. ② 타일 그리드의 `<button>` 카드가 `flex` 컨테이너인데도 `w-full` 누락 — 폼 컨트롤 특유의 fit-content 사이징으로 그리드 트랙(275px)보다 넓게(332px) 렌더되어 전 타일이 페이지 오버플로 유발 → `w-full` 추가) | 100 | 96 |
| c (Parallax) | pass | pass (1차 통과, 수정 불요) | 100 | 96 |

- a11y ≥95 하드게이트: 전원 최종 생존 (a는 1회 수정 후, b/c는 즉시).
- perf는 기록만 — dev 서버 측정치는 참고용이며 탈락 사유로 쓰지 않음.
- sweep: 1280~1920px 전 구간 + 모바일 390px, 여유폭(SLACK) 포함 폭에서 page-overflow/table-overflow 0건(수정 후).
- 정적 검사(Math.random/Date.now/next-font/font-serif/이모지): 전원 0건, 1차 통과.
