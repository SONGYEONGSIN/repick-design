# Candidate a — Setpoint

An OKR console for a B2B SaaS company whose hero is a grid of hand-built bullet/gauge charts — one per department goal — with current value, target and status always rendered as text, light-theme with a single AA-safe violet accent and no persistent side pane.

## 브리프에 없던 것

① 구체적 도메인과 8개 지표의 실제 수치/부서 — 브리프는 "OKR progress by department"류 예시만 제시, 숫자는 전부 비워둠
② Sales/Marketing/Product/Engineering/CS/Support/Finance/People 8개 부서에 각각 ARR·파이프라인·기능 채택률·배포 빈도·NRR·SLA·마진·eNPS를 배정하고 Q3/Q2 두 분기치를 전부 리터럴로 작성 (achievement 88.75%~96.91%/76.36% 등 상태가 on-track/at-risk/behind 세 가지 모두 나오도록 역산)
③ Mercury/n8n류 참고 대시보드들이 보통 부서 간 지표 유형(화폐/퍼센트/카운트/점수)을 섞어 쓰는 관행을 따름 — 한 가지 단위로만 채우면 불릿 그리드가 단조로워 "히어로"로서의 설득력이 떨어진다고 판단

① 불릿 차트의 "품질 구간(band)" 경계값(poor/satisfactory/good)과 스케일 min/max — 브리프는 밴드 존재만 요구, 경계 수치는 명시 없음
② 지표마다 개별 scaleMin/scaleMax/poorMax/satisfactoryMax를 수동 설정 (예: NRR은 90~120 스케일, 나머지는 0부터) — 실제 현재값/목표값이 전부 그 범위 안에 들어오는지 손으로 검증
③ Stephen Few의 bullet graph 관행(스케일을 실제 데이터 분포에 맞춰 타이트하게 잡는다)을 따름 — 0부터 시작하면 NRR 같은 지표는 밴드가 전부 한쪽에 몰려 무의미해짐

① 불릿 카드가 펼쳐질 때(아코디언) 안의 구성(breakdown) 수치와 분기별 합산값
② 부서별로 Q3/Q2 각각 3개 항목의 리터럴 breakdown을 작성하고 합계가 정확히 일치하도록 역산 (예: Sales Q3 Enterprise 1,680,000 + Mid-market 760,000 + SMB 400,000 = 2,840,000) — 화면에 보이는 "Total" 행은 하드코딩 없이 reduce로 런타임 계산
③ 브리프의 "Subtotals must sum to totals exactly" 규칙을 글자 그대로 지키기 위한 선택 — 합계를 따로 적지 않고 항상 계산값을 보여줘서 드리프트 가능성 자체를 없앰

① 전체 OKR 평균 완료율("Avg. completion") chip의 글자 크기와 불릿 현재값 글자 크기의 상대 크기
② chip은 text-lg(18px), 불릿 카드의 현재값은 text-2xl(24px)로 명시적으로 더 크게 설정
③ 이번 라운드 delta 노트 #4("KPI-row subordination은 렌더된 폰트 크기로 측정된다")를 그대로 따른 결정 — 임의로 고른 게 아니라 라운드 지시를 직접 수치화한 것

① violet 액센트의 정확한 색상값(브리프는 "#6E56CF는 쓰지 말고 직접 검증하라"고만 함)
② text-violet-700(#6d28d9)을 모든 작은 텍스트/포커스 링/버튼에 사용, violet-300/100은 장식적 배경(아바타, 미니바)에만 사용
③ 직접 WCAG 상대휘도 공식으로 계산: violet-700 on white ≈ 7.10:1 (AAA급), violet-600은 ≈5.70:1(AA는 통과하지만 여유가 적어 소형 텍스트엔 violet-700만 채택)

① 초광폭(ultra-wide) 캡 수치
② `max-w-[2240px]`로 설정
③ 이 레이아웃 자체의 사이드바(256px) + xl: 좌우 패딩(40px×2)을 역산: 1920px에서 가용폭 1584px < 2240px(캡이 안 걸림), 2560px에서 가용폭 2224px로 캡이 겨우 16px 차이로 "gently" 걸리기 시작 — 브리프가 명시한 "본인 쉘 기준으로 직접 계산하라"는 규칙을 그대로 수행, 다른 후보의 숫자를 베끼지 않음

① 불릿 차트의 상태(on-track/at-risk/behind) 판정 임계값
② achievement(현재/목표 비율) ≥95%→ on-track, ≥80%→at-risk, 그 외→behind로 3단계 분류
③ 임의 선택이지만 8개 지표 모두 계산해보고 세 상태가 전부 등장하도록 역으로 확인 — 한 상태로만 쏠리면 "color is never the sole signal" 검증이나 스크린샷 다양성이 빈약해지므로 의도적으로 분산시킴

① 보조 테이블(두 번째 위젯)이 무엇을 보여줄지 — 브리프는 "sortable table or activity log" 중 택1만 요구
② 전체 8개 목표를 팀/지표/소유자/현재/목표/달성률/상태로 보여주는 정렬·필터 가능한 테이블로 결정, 활동 로그는 채택 안 함
③ 불릿 그리드가 이미 "선택→단일 위젯 내 확장"이라는 서사를 완결하므로, 두 번째 위젯은 반대로 "선택과 완전히 무관"하다는 대비를 보여주는 편이 delta #2 지시("독립성을 코드 주석으로 서술하라")를 더 선명하게 증명한다고 판단
