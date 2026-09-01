# Candidate a — Seller Performance Scorecard

A private, read-only analytics screen where a seller reviews their own response time, on-time
shipping rate, rating trend (6- or 12-month chart, toggle-able), and progress toward their next
membership tier — distinct from `storefront` (public profile) and `membership` (tier pricing
tool), which it deliberately does not rebuild.

Exported component: `SellerScorecardScreen`
Main export path: `native/src/evolve/r17/a/SellerScorecardScreen.tsx`
Supporting files: `native/src/evolve/r17/a/data.ts` (deterministic dummy data), `native/src/evolve/r17/a/components.tsx` (MetricCard, RatingSummary, MonthDetailRow/Header, trend-arrow icon)

Check string (rendered heading text): **"Performance Scorecard"**

## 브리프에 없던 것

**① 이 화면에 하단 밴드가 필요한가, 필요하다면 어떤 형태인가**
브리프는 세 가지 확립된 밴드 형태 중 "reporting 화면엔 밴드가 없는 것도 유효한 답"이라고 명시했다.
② "Share scorecard" 하나짜리 persistent action bar(패턴 2)를 넣기로 했다 — 세팅 화면에 도달하는
이 화면이 정말 아무 행동도 유발하지 않는 순수 열람 화면인지, 아니면 회계사·대출 신청 등에 스냅샷을
넘기고 싶어할 만한 진짜 "standing action"이 있는 화면인지 판단해야 했다.
③ storefront의 Follow/Message 밴드처럼, 눌렀을 때 실제로 보이는 상태 변화(확인 문구 + live region
announcement)가 있는 진짜 액션 하나만 넣는 편이, 아무 밴드도 없는 것보다 이 화면의 판매자 정체성
(단순 열람이 아니라 "내 실적을 어딘가에 증명하고 싶은" 니즈)을 더 잘 보여준다고 판단했다. 두 번째
버튼(예: "Export as PDF")까지 넣는 것은 과잉이라 보고 하나로 제한했다.

**① 등급(티어) 진행률의 산정 기준을 무엇으로 할 것인가**
브리프는 "membership 화면의 티어 개념을 재구축하지 말고 하나의 통계로만 참조하라"고만 했지, 그
통계를 무엇으로 계산할지는 정하지 않았다.
② membership 화면의 수수료-최적화 로직(고정 월 거래액 사다리, break-even 지점)과는 완전히 분리된
독립적인 로컬 지표 — "trailing 90-day 판매액 대비 다음 등급(Elite) 문턱 금액" — 을 이 폴더 안에서만
새로 정의했다 (₩3,220,000 / ₩4,000,000 = 80.5%).
③ membership 화면의 내부 수식(feeRate, breakEven 등)을 그대로 가져다 쓰면 "membership을 재구축"하는
것과 다를 바 없어진다. 등급 이름(Plus → Elite)만 이어받고, 진행률 계산은 이 화면 고유의 단순한
volume-vs-threshold 비율로 완전히 독립시켜야 "하나의 통계로만 참조"라는 제약을 지킬 수 있었다.

**① 평점 추이 차트를 얼마나 상세히 보여줄 것인가 (압축 vs 전체)**
브리프는 "sparkline이나 작은 line chart가 어울릴 것"이라고만 했고, 기간 길이나 인터랙션 여부는
정하지 않았다.
② 기본값은 6개월 Sparkline(압축), "View full 12-month history"를 누르면 12개월 LineChart(축·툴팁
포함)로 전환되고 동시에 월별 상세를 담은 FlatList 표가 함께 펼쳐지도록 했다.
③ 정적 이미지 하나만 놓는 것보다, 기존 차트 프리미티브 두 개(Sparkline·LineChart)를 실제로 다른
목적(압축 개요 vs 상세 열람)에 맞게 각각 재사용하는 편이 "차트 렌더링을 새로 만들지 말고 재사용하라"는
브리프 취지에 더 맞고, `native/src/evolve/r17/a/components.tsx`의 FlatList 요구사항("리스트 모양
데이터가 있다면 FlatList로")도 이 토글에 자연스럽게 걸 수 있었다 — 억지로 리스트를 만들어 끼워 넣지
않고, 실제로 있는 월별 데이터를 정직하게 리스트로 노출하는 형태가 됐다.

**① 원화(₩) 기호를 어디서, 어떻게 쓸 것인가**
브리프는 원화를 보여줄 경우 세 가지 완화 옵션(간격, KRW 표기, 그대로 두기) 중 하나를 "의도적으로"
고르라고 했다.
② 옵션 (a) — `₩`와 숫자 사이에 리터럴 공백 하나 — 를 택했고, `formatWon()` 헬퍼 하나로 티어 진행률
섹션의 금액 세 곳(현재 판매액 / 문턱 금액 / 남은 금액)에 일관되게 적용했다. (storefront 후보가 쓴
"별도 Text + marginRight" 방식보다 더 단순한 구현이지만 같은 완화 원칙이다.)
③ 이 화면은 storefront처럼 카드형 좁은 공간에 가격을 촘촘히 배치하지 않고, 한 문단 안에 금액 세 개를
나열하는 형태라 시각적으로 더 여유가 있다 — 별도 Text 컴포넌트로 쪼개는 복잡성 없이 문자열 공백만으로
크로스바 충돌을 피하기에 충분하다고 판단했다.

**① 손익/실적 지표에 "긍정적"이 아닌 방향(하락)도 넣어야 하는가**
브리프는 상승/하락을 색이 아닌 아이콘+텍스트로 표현하라고만 했지, 세 지표의 방향을 섞으라고
요구하지는 않았다.
② 세 지표(응답 시간·정시 배송률·평점) 모두 "개선(improved: true)"으로 설정했다 — 단, 화살표 방향
자체는 응답 시간만 아래(분 감소 = 개선)이고 나머지 둘은 위(수치 증가 = 개선)라 시각적으로는 이미
방향이 섞여 있다.
③ 이 화면은 판매자가 "내 실적이 얼마나 좋아졌는지"를 확인하고 공유하고 싶어할 스코어카드라는 설정이라,
모든 지표가 개선된 스냅샷이 서사적으로 자연스럽다고 판단했다. 색상은 어차피 accent 하나만 쓰고
방향(화살표)·문구가 실제 신호를 담당하므로, 감정을 억지로 섞기보다 실제 있을 법한 좋은 분기의 스냅샷을
정직하게 보여주는 쪽을 택했다.
