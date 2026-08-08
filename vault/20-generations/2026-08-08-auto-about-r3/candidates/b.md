**b — Millrace**: 송장-결제 자동대사(reconciliation) SaaS의 About 페이지. 01~06 번호가 매겨진 챕터 스파인(문제→창업 계기→Values→Proof→People→전망)으로 서사를 구성 — 마일스톤-타임라인 센터피스(r1/a)와도, 다이어그램-호버 동기화(r1/c)와도 다른 구조. 인터랙션 3종: ① People 섹션의 클릭/포커스 조작 카드-플립(앞면 이름·직함, 뒷면 입사 전 이력+바이오, `backface-visibility` 기반 3D 회전 + `prefers-reduced-motion`에서 전환시간만 0으로) ② Values의 "무엇을 지향하는가/무엇을 거부하는가" 페어드-비교 토글(칩 필터나 아코디언이 아니라 세그먼트 버튼 하나로 4장 카드 전체의 실제 카피가 바뀜) ③ Proof 섹션의 카테고리 버튼 그룹(ARIA 탭리스트가 아닌 `aria-pressed` 플레인 버튼 3개로 통계 `dl` 전환). 라이트 테마, emerald 액센트, 별도 디스플레이 활자 없음(전 구간 기본 `--font-sans`/Pretendard, 웨이트 3종 `font-normal`/`font-medium`/`font-semibold`로 위계).

## 브리프에 없던 것

① **People 섹션의 사진/아바타 표현 방식** — 코어 브리프는 "무작위 이미지 서비스 금지"만 규정하고 구체적 대안은 지정하지 않는다. 결정론적 inline-SVG 모노그램 아바타(이름별 고정 이니셜+고정 hex 컬러)를 채택했다 — 기존 카탈로그(about r1/r2 전 후보)가 이미 이 방식을 표준으로 쓰고 있어 관행을 따랐다.

② **카드-플립 인터랙션의 reduced-motion 처리 수준** — 코어 브리프는 "`prefers-reduced-motion` 게이팅"만 요구하고 플립처럼 3D transform을 쓰는 인터랙션에 정지 상태로 대체할지 순간 전환으로 대체할지는 명시하지 않는다. `backface-visibility:hidden`으로 항상 정확한 면만 보이게 하고 `motion-reduce:transition-none`으로 애니메이션 지속시간만 0으로 만드는 방식을 택했다 — 상태 전환 자체(state·DOM)는 두 모드에서 완전히 동일하고 애니메이션 유무만 다르므로, 별도의 정적 폴백 UI를 새로 설계하는 것보다 결함 표면이 작다고 판단했다(임의 결정).

③ **CTA 링크의 실제 목적지** — 코어 브리프는 About 페이지가 커리어 CTA로 끝나야 한다는 관행(r1 전 후보 참조)은 있지만 그 링크가 실제로 어디로 가야 하는지는 지정하지 않는다. 이 레포에 채용 라우트가 없으므로 `mailto:careers@millrace.example` 고정 주소로 처리했다 — r1/a Portage가 쓴 "careers CTA band" 관행을 참조해 동일한 해법(mailto)을 그대로 따랐다.
