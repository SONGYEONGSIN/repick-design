# Features · div · e — 리소그래프(Risograph) 진(zine)

**아키타입**: 리소그래프 인쇄 — 형광 핑크 + 블루 2색 오버프린트로 찍은 인디 진(zine) 감성. `text-shadow` 이중 오프셋으로 표제 글자가 살짝 어긋나 보이는 "미스레지스트레이션" 효과, `radial-gradient` 반복 패턴 + `mix-blend-mode: multiply`로 만든 하프톤 도트, 카드 테두리는 핑크/블루 오프셋 `box-shadow`로 겹쳐 찍힌 인쇄판처럼 표현. SVG `feTurbulence` data URI를 전체 화면에 깔아 종이 그레인 질감을 더했다. 모서리엔 마스킹테이프 조각, 페이지 중간엔 "✂ 오려보세요" 절취선까지 넣어 손으로 만든 진 느낌을 강조.

## 구성
- 헤더: `repick` 워드마크(미스레지스트레이션 텍스트섀도)+ "무료로 시작하기" 아웃라인 버튼
- 히어로: "REPICK ZINE · ISSUE NO.04 · FEATURES" 배지, h1 "당신이 찜한 순간, 우리는 겹쳐 찍습니다"(핑크·블루 오프셋 섀도), 서브카피, CTA 2개. 배경엔 핑크 halo(멀티플라이 블렌드) + 모서리 레지스트레이션 마크(✛)
- 절취선 디바이더: "✂ 여기서부터 한 장씩 오려보세요"
- 4개 기능 스프레드(01~04, 좌우 교대 배치): 취향 학습(하트 그리드) / AI 매칭(대조 그리드 + 하이라이트 매물) / 신뢰 검증(이중 원형 스탬프) / 실시간 알림(벨 + 펄스 링). 각 비주얼은 마스킹테이프로 고정된 프레임 안에서 하프톤 도트 배경 위에 렌더
- 마무리 CTA: 블루 프레임 포스터 패널, "지금, 취향을 첫 장으로 인쇄해보세요" + CTA 2개
- 푸터: 진 임프린트 스타일 크레딧 라인

## 기술 메모
- 컴포넌트명 `Landing`, 서버 컴포넌트(인터랙션 상태 없음, 순수 CSS/구조만)
- 색상은 oklch 팔레트(paper/ink/pink/pink-deep/blue/blue-deep), `<style>` 태그로 스코프(`.riso-*` 클래스)
- 표제 오프셋 효과는 `text-shadow` 이중 컬러(핑크 -3px/-3px, 블루 3px/3px)로 구현 — 접근성상 텍스트 노드 중복 없이 단일 헤딩 유지
- 하프톤은 `radial-gradient` 반복 + `mix-blend-mode: multiply`, 그레인은 SVG `feTurbulence` data URI를 `position: fixed` 오버레이로 전체 페이지에 저투명도 적용(외부 요청 없음, 오프라인 렌더 충족)
- 버튼은 오프셋 `box-shadow`(핑크/블루) + hover 시 살짝 떠오르고 active 시 눌리는 "도장 찍기" 인터랙션(순수 CSS)
- 폰트: 시스템 스택(`font-mono`/기본 sans), 이모지로 장식(♥ ✓ 🔔 ✛ ✂ 🖨️), 외부 이미지/CDN 없음
- 펄스 링 애니메이션은 `prefers-reduced-motion: reduce`에서 정지
- 반응형: 모바일 세로 스택 → md 이상 좌우 교대(`md:flex-row-reverse`) 지그재그 레이아웃
- focus-visible: `.riso-focus`로 잉크색 3px 아웃라인 통일 적용

## 상태
완료. 경로: `app/src/app/pages/features/div/e/page.tsx`
