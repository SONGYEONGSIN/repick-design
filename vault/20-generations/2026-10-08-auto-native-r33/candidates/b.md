## b — Safety Recall Matches

Seller-facing compliance queue where repick's trust & safety system cross-references a seller's own live listings against public product-safety recall notices; sellers multi-select the flagged listings and either pull them from the marketplace (destructive, two-step confirm inside the bar) or flag a "possible" match for manual review (non-destructive, confidence-gated, so confirmed matches can never be disputed away).

## 브리프에 없던 것

1. ① 결정할 것: 대량 작업이 몇 개이고 어떤 종류인지, 그리고 서로 어떻게 상호작용하는지.
   ② 결정: 두 개의 버튼 — "Remove from Marketplace"(파괴적, 어떤 pending 항목에도 적용 가능)와 "Dispute Match"(비파괴적, confidence === "possible" 항목에만 적용 가능, confirmed 항목은 절대 해제 불가). 혼합 선택 시 Dispute는 가능한 항목만 처리하고 나머지는 선택 상태로 남긴다.
   ③ 근거: r29/b DraftListingsScreen의 "mixed selection을 솔직하게 처리" 원칙(ready/not-ready 분기)을 다른 축(confirmed/possible confidence 게이팅)에 적용 — 일반 원칙 재사용은 허용되지만 구현은 독립적으로 새로 설계함.

2. ① 결정할 것: 파괴적 동작(Remove) 확인 문구와 취소/확인 버튼 라벨.
   ② 결정: "Remove {n} listings from the marketplace now? Buyers won't see them again until you relist." / 버튼 라벨 "Cancel" · "Yes, Remove".
   ③ 근거: 금지된 두 템플릿("…This can't be undone from here.", "…will stop syncing.")을 피하기 위해 완전히 새로운 문장 구조(질문형 + 실제 효과를 구체적으로 명시)로 직접 작성.

3. ① 결정할 것: 라이브 리전의 "conditional alert + 5초 후 clear" 메커니즘을 어떤 상태로 구현할지.
   ② 결정: `liveMessage: string` 하나를 양쪽(표시 텍스트 + alert 트리거)으로 겸용 — 값이 있으면 `accessibilityRole="alert"`, 선택 토글/확인요청/취소/일부-스킵 안내 시마다 `announce()`가 재설정하고 5초 타이머로 다시 ""로 비운다. 전체 선택이 완전히 해소되면(선택 0개) 바 자체가 사라지므로 별도 알림을 남기지 않는다(토스트와의 상호배제를 시간적으로도 깨지 않기 위함).
   ③ 근거: 브리프가 준 예시 코드 `accessibilityRole={liveMessage ? "alert" : undefined}`를 문자 그대로 따른 것이며, 완전 성공 시 무음 처리는 r29/b DraftListingsScreen의 선례(퍼블리시 전부 성공 시 notice를 null로 둠)를 그대로 적용.

4. ① 결정할 것: 상태 배지(status pill) 4종(confirmed/possible/disputed/removed)에 어떤 시맨틱 토큰 색을 매핑할지 — 브리프 토큰 목록엔 "recall" 도메인에 대한 지정이 없음.
   ② 결정: confirmed→danger(실제 위험/필수 조치), possible→warning(주의/검토 필요), disputed→success(검토 중으로 보류되어 "안전한" 상태), removed→중립(border/faint, 종료된 상태).
   ③ 근거: 기존 레포 관례(r29/b의 ready=success/incomplete=warning, 그 외 화면들의 danger=파괴/위험)를 그대로 확장 적용한 임의 결정.

5. ① 결정할 것: 가격·통화 표기 방식 — 브리프는 ₩ 렌더링 이슈에 세 가지 선택지를 주었지만 이 화면이 달러/원 중 어느 쪽인지는 지정하지 않음.
   ② 결정: `$18.00` 형태의 "plain Latin-currency" 표기.
   ③ 근거: r29/b DraftListingsScreen `data.ts`의 `formatPrice` 주석("Formats whole cents as a plain Latin-currency string")과 동일한 관례를 그대로 따름 — 레포 내 기존 선례.

6. ① 결정할 것: 카드 썸네일에 쓸 아이콘/글리프를 어떻게 표현할지(아이콘 라이브러리 없음, 이모지 금지).
   ② 결정: SVG나 이모지 대신 카테고리 이니셜 한 글자(예: "Kids' Outerwear" → "K")를 스와치 박스 안에 `Text`로 표시.
   ③ 근거: 브리프의 "represent icons as simple geometric Views/Text glyphs" 지시를 가장 단순하고 결정론적으로 만족시키는 임의 선택 — 체크 표시는 브리프가 명시적으로 허용한 "✓"(U+2713) 글리프를 그대로 사용.
