# Candidate c — 대담한 편집 변주 (Round 5, exploration)

## 방향
챔피언(R4 c, 12-col 그리드 + ghost 넘버 + 좌측정렬 pull-quote)과 뚜렷이 다른 편집 인상을 노리는 탐색 변주. 다크 near-mono·accent 극소량 정지 존재감 원칙은 그대로 유지하되, 두 가지 새 편집 장치를 도입했다:
1. **인덱스/목차형 히어로** — 히어로를 "표지 헤드라인 + 목차(TOC) 패널" 2분할로 구성. 우측 패널은 실제 잡지 목차처럼 `01 방식 / 02 신뢰 / 03 시작` 각 항목을 점선 리더(`border-dotted`)로 폴리오와 연결하고, 클릭하면 해당 섹션(#value/#proof/#cta)으로 앵커 이동한다. 히어로 자체가 사이트 내비게이션을 겸하는 구조.
2. **세리프 디스플레이 × 산세리프 본문 혼용** — 헤드라인(h1, h2)과 pull-quote는 `font-serif`(시스템 세리프 스택, 외부 폰트 로드 없음), 본문/라벨/버튼은 기존 산세리프 유지. Origin Financial 참조의 "세리프 디스플레이 = 감성, 산세리프 = UI" 3-voice 원칙에서 세리프/산세리프 2-voice로 축약 적용.
3. Value 3분할은 챔피언의 대형 ghost 넘버(01/02/03) 대신 **각주형 알파벳 마커**(A/B/C, `aria-hidden`, `text-white/25`)로 교체 — 같은 "정지 상태 넘버링" DNA를 유지하되 시각 언어를 바꿔 반복감을 줄였다.
4. 소셜프루프는 좌측정렬+세로 틱 방식 대신 **중앙정렬 pull-quote 스프레드**(상하 rule + 세리프 이탤릭 인용 + 하단 인라인 통계 4종)로 재구성 — 매거진 중간 스프레드 느낌.
5. 마무리 CTA는 magazine "colophon"(판권장) 톤으로 중앙정렬 종결.

## 참조
- `vault/10-references/origin-financial.design.md` (dark) — 세리프 디스플레이(Lyon Display, weight 300 whisper) + 산세리프 UI + 화이트-온-블랙 CTA. accent 컬러는 카테고리 타일에만 쓰는 절제 원칙 참고(단, repick 고유 토큰 `#6E56CF`는 그대로 유지).
- `vault/10-references/monopo-saigon.design.md` (light) — 목차 대신 참고했으나 최종 미채택: 0px/75px 이분법 radius 언어는 이번 dark near-mono 톤과 안 맞아 제외. 대신 "editorial silence + 단일 표현적 제스처" 철학만 차용.
- `vault/10-references/twomuch-studio.design.md` (light) — Project Index Row(넘버+타이틀+폴리오, hairline 구분) 패턴을 히어로 목차 패널 구조의 직접 참조로 사용.

## 핵심 결정
- 큰 구조(Hero → 가치 3분할 → 소셜프루프 → 마무리 CTA)는 유지, 각 섹션 내부의 "편집 장치"만 전면 교체.
- 색 토큰은 원칙(`design-principles.md`) 그대로 고정 — 이번 회차는 레이아웃/타이포 장치 탐색이 목적이라 색 실험은 배제.
- 그라데이션·라인아트 장식 없음. 구분은 전부 `border-white/10` hairline + 점선 리더 하나로 처리.
- accent(`#6E56CF`)는 h1/quote/CTA 헤드라인의 강조 단어와 목차 hover에 정지 상태로 노출 — 과거 학습("accent는 극소량이되 정지 상태 존재감 유지") 준수.

## Font weight (3종, 원칙 준수 확인)
- `font-normal` (400) — 세리프 디스플레이 헤드라인(h1/h2/blockquote), 산세리프 본문
- `font-semibold` (600) — 라벨, eyebrow, nav, 버튼, 목차 폴리오/분류 라벨
- `font-bold` (700) — 각주형 알파벳 마커(A/B/C), 목차 넘버(01/02/03), 통계 수치

## 색상 (원칙 토큰 그대로, 변경 없음)
- bg: `#0B0B0F`
- fg: `#FFFFFF`
- muted: `#A1A1AA`
- accent: `#6E56CF`
