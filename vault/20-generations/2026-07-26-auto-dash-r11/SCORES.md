# auto-dash-r11 — HARD GATE 결과

타깃: **dash**. 3후보 전원 생존.

| 후보 | 제품 | 아키타입 | static | sweep | a11y (Lighthouse) | perf (기록만) |
|---|---|---|---|---|---|---|
| a | Palisade | Access & Permissions Console — role×permission 매트릭스 (dash-evolve 신규 아키타입) | pass (위반 0) | pass — **1회 수정**: `OwnerLockedCell`의 sr-only "Always allowed, locked" span에 포지션 앵커(`relative`)가 없어 테이블의 `overflow-x-auto` 클리핑을 벗어나 390px에서 document.scrollWidth +103px 누출(19행 × Owner열 반복) → 래핑 span에 `relative` 추가, 재sweep 통과 | 100 | 97 |
| b | Amberline | Revenue/P&L Bridge Cockpit — waterfall(항상-표시 값) | pass (위반 0) | pass (1차 통과) | 93→**100** (1회 수정: 세그먼트 컨트롤 미선택 텍스트 zinc-500 on zinc-100 4.39:1→zinc-600 교체·`<dl>` 직계 자식 div>span/p→dt/dd 재구성·bar 버튼 aria-label을 시각 span과 동일 compact 포맷+순서로 재배열) | 97 |
| c | Sourcemark | Faceted Search & Compare Console — 카드그리드+facet+비교트레이 (dash-evolve 신규 아키타입) | pass (위반 0) | pass (1차 통과) | 96 (잔여 color-contrast 마이너 1건, 임계 95 상회로 수정 불요) | 96 |

**Lighthouse 실행 환경 노트**: 이 샌드박스의 사전 설치 Chromium(rev 1194)이 root 권한에서 `--no-sandbox` 없이 기동 불가(`ECONNREFUSED`) — gate.mjs 자체 dispatcher 호출은 이 플래그를 안 넘기므로 a11y/perf가 `unavailable`(비-하드페일)로 판정됨. 정확한 실측을 위해 커밋 대상이 아닌 별도 수동 실행(`CHROME_PATH=/opt/pw-browsers/chromium npx lighthouse <url> --chrome-flags="--headless --no-sandbox --disable-gpu"`)으로 위 표의 실제 점수를 얻었다 — r3/r9 라운드와 동일한 선례(스크립트 자체는 미수정, 커밋에 미포함).

전 후보 하드게이트 통과 → JUDGE 패널로 진행.
