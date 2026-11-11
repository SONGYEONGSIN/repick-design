Trestle — a CI/CD build-health console whose centerpiece is a vertical/horizontal pipeline process map (checkout → … → production) with every failing build fanning into one "Failed Builds" node, backed by a sortable stage-to-stage path-summary table.

## 브리프에 없던 것

1. ① 제품/브랜드명과 보이스
   ② "Trestle" (철도 트레슬 다리 — 파이프라인의 각 구간을 지지한다는 은유), 태그라인 "Build pipeline reliability"
   ③ 브리프가 직접 지시한 항목("invent a believable product/brand name")이라 발명 자체는 요구사항 이행이지만, 구체적 이름/카피는 자의적 선택

2. ① 파이프라인 스테이지 구성 (몇 개, 무슨 이름)
   ② 8단계: Checkout → Install Deps → Lint & Typecheck → Unit Tests → Build → Integration Tests → Deploy Staging → Deploy Production
   ③ 일반 관행 — GitHub Actions/CircleCI류 CI 파이프라인에서 흔히 보는 단계 이름을 그대로 채용

3. ① 각 스테이지의 entered/passed/avgDuration/slaMin 수치
   ② 7일/30일 두 기간 세트를 손으로 작성, `failed = entered - passed`로 파생시켜 내부 일관성 보장 (Integration Tests가 두 기간 모두 최대 실패/최대 지속시간)
   ③ 임의 — 단 "브리프의 내부 일관성 규칙"(엣지/스테이지 수치가 서로 맞아야 함)을 지키도록 의도적으로 설계

4. ① "Top 3 bottleneck" 랭킹 공식
   ② `impactScore = failed × avgDurationMin` (실패 건수 × 머문 시간)로 정의, 내림차순 3개
   ③ 임의 — 브리프는 "worst edges/nodes by name"만 요구, 랭킹 산식은 명시 안 됨. 단순하고 코드 주석으로 바로 검증 가능한 공식을 선택

5. ① SLA 예산/배수("ratio exceeding natural ceiling") 적용처
   ② 스테이지별 `slaMin` 목표치를 부여하고 실제 평균 대비 배수를 "2.0× over SLA" 형태 텍스트로 노출 (바가 100%로 캡되지 않도록)
   ③ 브리프가 "if you use one"으로 예시만 들었을 뿐 강제하지 않음 — 일반적인 빌드 도구(SLO/SLA 개념)의 관행을 가져와 규칙을 실제로 트리거

6. ① 프로세스맵의 색상 인코딩
   ② 바이올렛 = 통과/전진 엣지, 앰버 = 실패/탈락 엣지, 범례에 텍스트로도 명시
   ③ 일반 관행(경고=앰버/레드 계열) + 브리프가 지정한 바이올렛 액센트와의 대비를 위한 임의 선택

7. ① 프로세스맵을 데스크톱/모바일에서 어떻게 다르게 그릴지
   ② 두 개의 고정 SVG 레이아웃을 두고 `lg` 기준으로 토글: 데스크톱은 가로 9열(스테이지+Released), 모바일은 세로 9행. 단일 가로 SVG를 390px로 그대로 축소하면 라벨이 읽을 수 없는 크기(스케일 0.29)까지 줄어들어, 가독성을 지키기 위해 별도 레이아웃을 만듦
   ③ 구조적 판단(arbitrary) — 브리프는 "simple, robust layout"만 요구했지 반응형 전략은 명시하지 않음. 두 SVG 모두 `aria-hidden`이라 중복 노출 문제는 없음

8. ① 폴백 테이블의 행 단위를 "엣지"로 할지 "스테이지"로 할지
   ② 행은 엣지(stage→stage)로 하되, 각 행의 From/To 스테이지명 자체를 버튼화해서 클릭하면 그 스테이지를 pin — "path-summary table (stage→stage)"와 "클릭해서 스테이지를 pin"이라는 두 요구를 동시에 충족
   ③ 브리프 안의 두 문장이 서로 다른 단위(엣지 vs 스테이지)를 전제하는 듯 보여 발생한 모호성을 직접 해소한 판단

9. ① pin 상태를 StageDetailCard "하나"에만 연결하라는 규칙과, 트리거 자체의 active-state 표시(강조 링/배경) 사이의 경계
   ② StageDetailCard를 유일한 "파생 데이터 뷰" 소비자로 유지하되, pin을 건 버튼/노드 자체에는 가벼운 시각 피드백(바이올렛 테두리·배경)을 허용 — 이건 "같은 데이터를 보여주는 3번째 위젯"이 아니라 "방금 누른 컨트롤의 토글 상태 표시"로 해석
   ③ 일반 UX 관행(활성 토글 표시) — 브리프의 금지 대상("3 sibling 컴포넌트가 동일 selectedId로 파생 뷰를 그리는 것")과는 범주가 다르다고 판단했지만, 경계선에 있는 해석이라 투명하게 기록

10. ① 폴백 테이블을 항상 노출할지, 키보드 접근 가능한 토글 뒤에 둘지
    ② 항상 노출(토글 없음)
    ③ 브리프가 양자택일로 명시(둘 다 허용) — 상태 하나를 더 두지 않는 쪽이 접근성 리스크가 적다고 보고 임의로 단순한 쪽 선택

11. ① 3개 폰트 weight(400/500/600)를 텍스트 역할별로 어떻게 배분할지
    ② 400=본문/캡션/데이터값, 500=필드 라벨·내비·보조 헤더, 600=페이지 타이틀·카드 타이틀·헤드라인 숫자·주요 버튼
    ③ 임의 — 브리프는 "정확히 3개"만 강제, 매핑은 지정하지 않음

12. ① 바이올렛/앰버/에메랄드의 정확한 색상 값과 틴트 투명도(6%/7% 등)
    ② Tailwind 기본 팔레트의 violet-400(#a78bfa)/amber-400(#fbbf24)/emerald-400(#34d399) 그대로 사용, 카드 배경 틴트는 6~7% 불투명도
    ③ 일반 관행(Tailwind 기본값) — 수동으로 WCAG 대비(상대휘도 공식)를 계산해 모든 텍스트 조합이 AA를 넘는지 확인한 뒤 확정

13. ① 커맨드 팔레트에 어떤 구체적 명령을 넣을지
    ② "View last 7/30 days", "Pin {bottleneck} (top bottleneck)", "Clear pinned stage", "Jump to path summary table" 5개
    ③ 임의 — 브리프는 "실제로 뭔가를 하면 인정"이라고만 함

14. ① 사이드바 내비 항목, 워크스페이스 이름, 유저 이름/직함, 알림 패널 내용
    ② Overview/Pipelines/Builds/Branches/Incidents, "Platform Engineering" 등 3개 워크스페이스, "Reyes Marchetti · Release engineer", 알림 2건
    ③ 임의 — 커머셜 SaaS 신뢰도를 위한 더미 플레이버 텍스트

15. ① 반응형 분기점을 몇 개로, 어디에 둘지
    ② 사이드바 노출, 모바일 드로어, 테이블 min-w 세이프티넷, 프로세스맵 가로/세로 전환을 전부 Tailwind `lg`(1024px) 하나로 통일
    ③ 구조적 판단(arbitrary) — 분기점이 여러 군데 흩어지면 "정확히 이 폭에서 뭐가 바뀌는지" 검증이 어려워지므로 하나로 묶음

16. ① 아바타를 실제 이미지로 할지 이니셜로 할지
    ② 이니셜("RM") 텍스트 아바타만 사용, 외부 이미지 전혀 미사용
    ③ 임의 — 브리프가 아바타 사진을 "있다면"으로 선택적으로만 언급했고, 외부 호스트 의존을 줄이는 쪽을 택함
