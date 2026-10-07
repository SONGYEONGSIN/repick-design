# Candidate a — Northbound

An infrastructure-ops incident-response console whose hero is one full-width anomaly timeline (not a small-multiples wall) — dark, n8n/Coinbase-level product-dark with a single cyan accent, no side rail and no persistent detail pane, with an intentionally unsynced runbook checklist below it.

## 브리프에 없던 것

① 구체적 제품/브랜드명과 3개 지표의 실제 도메인 — 브리프는 "error rate / latency p99 / request volume" 예시만 제시, 회사명·수치는 전부 비워둠
② "Northbound"라는 ops 콘솔 브랜드와 checkout-api·payments-gateway·auth-service·search-index·notification-worker·billing-sync 6개 가상 서비스를 만들고, 3지표×3기간(24h/7d/30d) = 9개 시계열을 전부 리터럴 배열로 작성
③ 세 지표가 서로 다른 단위(%, ms, req/s)를 쓰는 편이 메트릭-셀렉터 전환이 "그냥 라벨만 바뀌는" 게 아니라 실제로 다른 그래프처럼 보이게 하고, 과거 round history(delta #3)가 "behavior-axis 추가가 fanout/novelty를 완전히 대체하진 못한다"고 지적한 점을 감안해 세 지표를 최대한 이질적으로 설계

① 이상치(anomaly) 판정 임계값과 그 방향성 — 브리프는 "플래그만 있으면 됨", 숫자 경계는 미지정
② `classify(metric, value)`를 지표당 3단 임계값(error-rate: 0.8/1.5/3.5%, latency: 260/350/650ms)으로, volume은 "낮을수록 나쁨"으로 방향을 반전시켜(900/700/400) 구현. 9개 시계열 전체를 실제로 분류해보고 플래그 개수가 각각 3/4/5개(3-6 범위 안)로 나오는지, 베이스라인 구간에는 false positive가 없는지 전부 수치로 검증
③ anomalies를 손으로 따로 리스트하지 않고 이 함수 하나로 포인트 배열에서 **파생**시킴 — 차트 마커·테이블·현재 상태 배지가 서로 어긋날 수 없게 단일 소스로 고정

① 각 이상치의 "always-visible" 텍스트를 마커 위에 직접 겹쳐 그릴지, 차트 아래 목록으로만 보여줄지
② 최종적으로 둘 다 채택: 마커 바로 위/아래(시간순 인덱스 패리티로 번갈아 배치)에 11px 칩으로 "값만" 짧게 표시하고, timestamp는 x축 틱으로(이상치 인덱스는 항상 틱을 표시) 보여주고, service/incident-id/권장조치 같은 긴 정보는 hover/focus 시 ephemeral 팝오버로 분리
③ 390px 모바일에서 가장 촘촘한 24h 뷰(이상치 간 최소 3포인트 간격)의 실제 픽셀 간격을 계산(≈50-55px)해보고, 11px 짧은 값 칩이 그 안에서 겹치지 않는지, 겹치더라도 above/below 교대 배치로 수직 분리되는지 직접 역산해서 확정

① 아노말리 마커를 실제 포커스 가능한 24×24 버튼으로 만들지, aria-hidden 포인터 레이어+필수 폴백 리스트로 갈지
② 9개 뷰 전체에서 인접 이상치 간 최소 간격(포인트 개수)을 스크립트로 계산 → 모든 뷰에서 최소 3포인트 이상 떨어짐 확인 → 390px 최악 케이스에서도 ≈50px 이상 간격이 나와 24px 타깃에 충분한 여유가 있다고 판단해 아이콘-only 포커스 가능 버튼으로 채택 (텍스트+aria-label 불일치 리스크도 없음 — 버튼에 보이는 텍스트 자체가 없으므로)
③ 이 카탈로그가 이미 두 번(밀집 스캐터, 밀집 그래프 노드) target-size로 걸린 전례가 있어, "확인 안 하면 aria-hidden+폴백"이 기본값이어야 한다는 브리프의 경고를 그대로 따르되, 직접 계산해 안전함을 확인한 경우에만 포커스 가능 버튼을 쓰기로 함

① 말풍선(ephemeral tooltip)의 가로 위치가 차트 가장자리에서 넘치지 않게 하는 정확한 방법
② `left: clamp(96px, {xPct}%, calc(100% - 96px))` + `translateX(-50%)`로, 툴팁 너비(w-48=192px)의 절반을 CSS `clamp()` 하한/상한으로 박아 넣어 좌우 어느 쪽에도 컨테이너 밖으로 나가지 않게 함. 이걸 마커별 래퍼 div 안에 넣으면 그 래퍼가 모든 자식이 `position:absolute`라 자기 자신은 폭이 0으로 계산돼 `calc(100%...)`가 엉뚱한 기준(0px)으로 깨진다는 걸 발견해, 툴팁만 Fragment로 분리해 차트 전체 컨테이너의 직계 자식으로 끌어올림
③ 가로 오버플로는 이번 라운드의 하드게이트 규칙(390px 포함 전 구간 zero horizontal overflow)이라 가장 보수적으로, 컨테이너 폭 변화와 무관하게 수학적으로 항상 안에 들어오는 CSS `clamp()` 공식을 택함 — 근사치 추측이 아니라 식 자체가 경계값을 보장하도록 설계

① KPI 스트립 숫자와 차트 자체 텍스트(현재값 readout, 이상치 칩) 간의 상대 폰트 크기
② 현재값 readout `text-4xl`(36px) > 이상치 칩 `text-xs`(12px) > KPI 스트립 숫자 `text-[11px]`로 3단 엄격 하향 고정. 테이블의 "Reading" 열 숫자도 혹시 "엘스웨어 서머리"로 해석될까봐 보수적으로 11px까지 낮춤
③ 이번 라운드 delta 지시 #4("KPI-row subordination은 실제 렌더된 Tailwind 텍스트 크기 클래스로 비교된다")를 글자 그대로 따름 — 해석 여지를 없애려고 "같은 크기"가 되는 경우조차 피하고 전부 엄격하게 다른 단계로 분리

① 정확한 cyan 액센트 색조와, 어디까지 "그래픽/대형 전용 3:1"로 두고 어디서부터 "소형 텍스트 4.5:1"을 요구할지
② 소형 텍스트(포커스 링, 활성 nav, 세그먼트 텍스트)에는 전부 `cyan-300`/`cyan-400`만 사용하고 직접 WCAG 상대휘도 공식으로 계산 — zinc-950 배경 대비 cyan-400 ≈10:1, 심각도 색(rose-300 등 가장 어두운 축) 중 최악 케이스인 rose-300도 ≈10.5:1로 계산해 전부 AA 소형 텍스트 기준(4.5:1)을 넉넉히 통과함을 확인
③ 브리프가 "직접 검증하라"고 명시했으므로 Tailwind 팔레트 추측이 아니라 실제 sRGB→상대휘도 변환식을 손으로 계산해 수치로 남김 — 같은 계산 방식을 zinc-400 바닥선(대 zinc-950/900 둘 다 ≈7-8:1)에도 적용해 교차 검증

① 초광폭(1920px) 캡의 정확한 수치
② 이 쉘의 사이드바(w-64=256px) + lg:px-8 좌우 패딩(32px×2)을 역산: 1920px에서 가용폭 1920-256-64=1600px, 캡을 1680px로 설정해 1920px에서는 캡이 걸리지 않고(자연폭 1600<1680) 오른쪽 여백이 패딩(32px)만 남도록, 그보다 넓은 화면(2560px~)에서만 부드럽게 캡이 걸리도록 함
③ 다른 후보의 숫자를 베끼지 않고 "이 쉘 기준으로 직접 계산하라"는 브리프 지시를 그대로 수행 — 사이드바 폭이 다른 두 후보(마스터-디테일이 아니므로 사이드바가 있는지조차 다를 수 있음)와 다를 것이므로 숫자가 같을 이유가 없다고 판단

① 체크리스트 7단계의 구체적 문구와 초기 체크 상태
② "Acknowledge the page" → "Confirm severity/commander" → "Open channel" → "Check deploys" → "Mitigate" → "Notify stakeholders" → "Postmortem" 순으로, 첫 2개만 기본 체크됨(마치 이미 대응 중인 인시던트처럼) 상태로 하드코딩
③ SRE 업계의 표준 인시던트 대응 플로우(ack → triage → communicate → mitigate → notify → postmortem)를 그대로 따르되, 브리프의 핵심 요구("타임라인 선택과 무관하게 항상 같은 체크리스트")를 코드 주석으로 명시적으로 검증 가능하게 남김 — `RunbookChecklist` 컴포넌트는 `metric`/`range`/`hoveredAnomaly` 중 어떤 prop도 받지 않음
