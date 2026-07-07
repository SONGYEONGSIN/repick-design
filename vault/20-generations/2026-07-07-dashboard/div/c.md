# Dashboard — div/c — 다크 프로 SaaS

Linear/Vercel 대시보드 아키타입을 끝까지 밀어붙인 로그인 후 앱 화면. 배경은 zinc-950 딥 차콜, 카드는 `bg-white/5 + border-white/10`의 미세한 유리질 패널, 데이터는 Geist Mono `tabular-nums`로 정렬해 표(table) 같은 밀도를 낸다. 좌측 고정 사이드바(홈·추천·찜·설정, 활성 항목만 indigo 강조)와 상단 sticky 유틸리티 바(⌘K 검색, 알림, 아바타)로 "실제로 매일 켜는 도구" 느낌을 만들었다.

핵심 장치:
- 요약 스탯 4카드 — 오늘의 추천/찜/누적 절약액은 7일 CSS 바 스파크라인, AI 매칭률은 conic-gradient 링 게이지로 표현해 숫자 나열이 아닌 미니 시각화 대시보드로 구성.
- "오늘의 AI 추천" 리스트 — 상품 사진 대신 카테고리별 인라인 SVG 아이콘 + 그라데이션 틴트 타일(오프라인 렌더 대응), 매칭률 뱃지·상태·위치·가격을 한 줄 밀도로 압축.
- 우측 사이드 패널 — 알림/최근 활동을 dot-timeline으로 분리, indigo/emerald/amber로 이벤트 성격만 절제된 컬러로 구분.
- 모바일(375~)은 사이드바를 숨기고 상단에 pill 형태 수평 스크롤 네비로 전환, 데스크톱(lg~)에서 248px 고정 사이드바 그리드로 확장.

컴포넌트: `app/src/app/pages/dashboard/div/c/page.tsx`, default export `Landing`.
