Bulk Relist: a seller's aging-inventory list where checking items reveals a hidden bottom bar (a third, selection-driven bottom-band form) to drop price 10% or bump-to-top in one batch action, with one live-region announcement per selection change and an undo affordance after the action fires.

RENDER_CHECK: Bulk Relist

Export: `BulkRelistScreen` (also default export) — `native/src/evolve/r16/b/BulkRelistScreen.tsx`. Data: `native/src/evolve/r16/b/data.ts`.

## 브리프에 없던 것

- ① 선택 후 배치 액션을 누르면 선택 상태를 유지할지 해제할지가 명시되지 않았다. ② 액션 적용 즉시 `selected`를 비우고(바가 사라짐) 대신 undo 배너를 띄우는 쪽을 택했다. ③ 커머스 이메일/장바구니류 벌크 액션 관용(적용 후 선택 해제)을 따랐고, 브리프의 "count returns to 0 → bar disappears" 요구를 자연스럽게 만족시키는 경로이기도 했다.
- ① "Bump to top"이 실제로 무엇을 의미하는지(정렬 로직) 브리프는 지정하지 않았다. ② 매 bump마다 증가하는 `bumpRank` 카운터를 부여해 bump된 항목을 항상 리스트 최상단에, 서로는 bump된 순서대로 배치했다 — 정렬 모드(Longest listed/Most viewed)와 무관하게 유지. ③ "bump to top"이라는 문구 자체가 정렬 순서와 독립적인 고정 배치를 암시한다고 판단; 임의 결정.
- ① 가격 10% 인하가 반복 선택 시 누적되는지 여부가 없었다. ② 매번 현재가 기준으로 10%씩 복리 인하(`currentPrice * 0.9`)되도록 했다 — 뱃지의 `-N%`는 원가 대비 누적 퍼센트를 계산해 보여준다. ③ "batch action button... visibly updates" 요구를 각 액션 클릭마다 실제로 값이 변해야 한다는 뜻으로 해석했고, 원가 고정 기준 재계산이 가장 단순하고 검증 가능한 규칙이라 임의로 정함.
- ① undo는 "nice to have"라고만 되어 있고 지속 시간/트리거가 없었다. ② 타이머 없이, 다음 배치 액션을 실행하거나 사용자가 ✕로 닫거나 Undo를 누를 때까지 계속 떠 있게 했다(자동 사라짐 없음). ③ `Date.now`/`setTimeout` 기반 자동소멸은 결정성·자동 렌더 체크와 상충할 여지가 있어 피했고, 명시적 닫기만 두는 편이 접근성 라이브 리전 이중 발화 위험도 낮췄다.
- ① 정렬 옵션(Longest listed / Most viewed)의 존재 자체가 브리프엔 "optional third interaction" 예시로만 언급됐다. ② 두 개의 토글 칩으로 구현하고 기본값은 "Longest listed"(가장 방치된 매물이 위로) 로 정했다. ③ 화면 목적(정체된 재고 관리)상 기본 정렬은 "가장 방치된 것"이 최우선으로 보이는 게 맞다고 임의 판단.
- ① 체크박스 외에 카드 전체를 눌러도 선택되게 할지 브리프는 "checkbox tap, or a dedicated select-mode toggle"로 양자택일만 제시했다. ② 카드 전체와 체크박스 둘 다 동일한 토글 핸들러를 갖게 해 별도 select-mode 토글 없이도 탭 타깃을 넓혔다. ③ 별도 모드 전환 단계를 추가하면 상호작용이 늘어나 오히려 배치 선택의 마찰이 커진다고 보고, 항상-체크박스-보임 방식(왓치리스트류 없음, 참고 화면과도 안 겹침)을 택함.
- ① 썸네일 자리표시자의 표현 방식이 없었다(실제 이미지 자산 없음). ② 2글자 라벨(`OD`, `WP` 등)을 `tokens.color.border` 배경 박스에 넣는 방식을 택함. ③ 새 아이콘/이모지/외부 자산 없이 결정론적으로 표현할 수 있는 가장 단순한 방법이라 임의 선택.
- ① 원화 표기 규칙 중 브리프가 제시한 3가지 옵션(공백/KRW 표기/그대로) 중 어느 것을 쓸지는 화면마다 자유. ② "₩ " + 천단위 콤마(`toLocaleString`) 방식, 옵션 (a) 공백 삽입을 택함. ③ 다른 두 옵션(KRW 라틴 표기, 무공백)보다 한국 사용자에게 친숙하면서도 글리프 겹침 이슈를 브리프가 명시한 방식으로 바로 해결하는 절충안이라 판단.
