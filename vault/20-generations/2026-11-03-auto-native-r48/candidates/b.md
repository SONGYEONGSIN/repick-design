# Candidate B — Shipment Live Tracking

A read-only vertical milestone timeline (packed → picked up → in transit → out for delivery → delivered) under a compact carrier/ETA header card, with one always-visible "Contact carrier" action that actually flips a `supportRequestStatus` state and announces confirmation via a live region.

## 브리프에 없던 것

1. ① 배송 중 어느 시점을 "현재"로 고정할지 ② "Out for delivery"를 current로, "Delivered"는 upcoming으로 설정 ③ 오늘 날짜(2026-11-03)와 타임스탬프를 맞춰 화면이 실제로 열리는 시점과 서사가 어긋나지 않게 한 임의 선택.

2. ① 헤더 카드를 FlatList 안(ListHeaderComponent)에 넣을지 밖에 둘지 ② FlatList 밖, 별도 View로 분리 ③ 브리프의 "Above or around it"을 "항상 고정 노출"로 해석했고, 타임라인 스크롤과 헤더 정보 노출을 분리하는 쪽이 읽기 전용 기록화면의 정보 위계에 더 맞다고 판단한 일반 관행.

3. ① "Contact carrier" 버튼이 성공적으로 눌린 뒤 버튼 자체의 라벨/disabled 상태를 되돌릴지 말지 ② 배너 문구만 2.5초 후 자동 소거하고 버튼 라벨("Request sent to carrier")과 disabled는 영구 유지 ③ 실제로 요청을 보낸 뒤 같은 요청을 중복 전송할 수 있게 두는 것이 비현실적이라 판단한 일반 UX 관행(idempotent 액션).

4. ① 완료/현재/예정 마일스톤을 시각적으로 어떻게 구분할지(색상 매핑) ② completed=success, current=accent, upcoming=border/faint ③ 토큰 설명에 "success 컬러가 completed marker에 적합"이라 명시돼 있어 그대로 따르고, 유일한 accent는 "현재" 한 지점에만 아껴 사용.

5. ① carrier/tracking 정보를 헤더 카드 내부에서 어떤 레이아웃으로 배치할지 ② 2열 row(Carrier / Tracking number)로 나란히 배치 ③ 공간이 제한된 모바일 헤더 카드에서 라벨-값 쌍을 나열하는 일반적인 영수증/주문 상세 레이아웃 관행.
