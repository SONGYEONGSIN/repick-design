# DECISION — auto-native-r21

target: native · round: auto-native-r21 · date: 2026-09-14 · run: `2026-09-14-auto-native-r21`

무인 2연속 실행(`/dash-evolve 2`)의 1라운드째 — 단, §0-0-1 미채움 큐 확정 결과 `PAGE_TYPES` 18종 전 미채움 0종이라 `N`이 2에서 1로 강제 하향됐다(2026-09-12 개정 규칙, 호출자가 2를 줬어도 로그에 남기고 1라운드만 진행). 오늘(2026-09-14)이 월요일이라 native 고정 주기가 걸려 타깃은 native로 확정.

## 편차 고지
`Agent` 도구는 이 세션에 실제로 존재했고, designer 3개·judge 3개를 각각 독립된 서브에이전트로 기동했다(오케스트레이터 자신이 후보를 만들거나 판정하지 않았음). 다만 이 환경에는 스킬이 이름으로 참조하는 전용 `designer`/`comparator` 에이전트 정의가 없어(`~/.claude/agents/` 부재), 범용 `general-purpose` 에이전트 타입을 대신 사용했다 — 툴 제약(Bash 금지 등)은 프롬프트로 명시했고, designer 프롬프트 로그 상 셋 다 의도치 않은 1회성 Bash 호출이 있었다고 자진 보고했으나(디렉토리 확인·tsconfig 확인 등 무해한 조회, 실제 코드 작성/검증 목적 아님) 게이트·검증을 직접 실행하지는 않았다. 판정 3개(judge)는 서로의 산출물을 보지 못한 채 완전 독립으로 수행됐다 — 블라인드·독립 전제는 유지됐다. `self_judged` 플래그는 불필요.

## 후보
- **a — Live Auction Bid**: 단일 아이템 실시간 경매(카운트다운·입찰 사다리·증분 스테퍼·프록시 최대입찰). `native/src/evolve/r21/a/LiveAuctionScreen.tsx`
- **b — Compare Items**: 워치리스트 2~3개 아이템 사이드바이사이드 스펙 비교(행별 최우수값 표시). `native/src/evolve/r21/b/ItemComparisonScreen.tsx`
- **c — Invite Friends**: 추천 코드 공유 + 마일스톤 리워드 사다리 + 초대자 로스터. `native/src/evolve/r21/c/ReferralProgramScreen.tsx`

## 하드게이트
12/12 전원 1차 클린(1-fix 불요). 상세는 `SCORES.md`. 환경 메모: 이 세션에 `native/node_modules` 미설치 상태로 시작해 `tsc`가 `expo/tsconfig.base`를 못 찾아 전 파일(기존 파일 포함) `TS17004` 대량 오탐 — `cd native && npm install` 후 재게이트로 해소(후보 코드 결함 아님). 샌드박스 Chromium 리비전 불일치는 `PW_CHROMIUM_PATH`/`CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome` + `PW_NO_SANDBOX=1`로 선례와 동일하게 우회.

## 스크린샷
`node scripts/gate.mjs` 통과 후 `EXPO_PUBLIC_SCREEN=evolve-r21-<v> npx expo export --platform web` → `npx serve` → 390/768 두 폭 캡처. **환경 메모**: 이 세션의 bare `npx playwright screenshot` CLI가 `PW_CHROMIUM_PATH`를 무시하고 자체 고정 리비전(1228 headless_shell, 미설치)을 요구해 실패 — `gate.mjs`/`capture-shots.mjs`와 동일한 방식(`chromium.launch({executablePath: process.env.PW_CHROMIUM_PATH})`)으로 `native/scripts/shot-evolve.mjs`를 즉석 작성해 우회(스킬·게이트 스크립트 자체는 무변경, 이 세션 한정 보조 스크립트). 6장(3후보 × 2폭) 전부 육안 확인 — blank 프레임 없음, 전원 정상 렌더.

## JUDGE 패널 (3렌즈 완전 독립·블라인드)

### 렌즈1 — DNA/접근성 준수
**순위: a > c > b**
- a: 라이브리전 1개+alert 1개 정확, 밴드폼(파괴적 확인 2단 커밋)이 정당하고 스타일 키(`bidBar*`/`ladder*`/`auction*`/`proxy*`) 전부 신규 — 기존 `bandBlocked*`/`bandReady*`와 grep 대조로 미충돌 확인. 결함 없음.
- c: 밴드 없음이 정당(공유를 막는 것이 없음). 단 라이브리전 컨테이너 1개 안에 `accessibilityRole="alert"` 텍스트 **2개**(티어 진행 + 최근 친구 상태)를 동시 배치 — "라이브리전 두 개 이상 금지"는 지켰으나 "전환 문장에만 alert" 규칙 위반(코드 주석이 이 이탈을 스스로 정당화하려 했으나 규칙 위반은 규칙 위반).
- b: 라이브리전 자체는 교과서적으로 정확(컨테이너 1개+alert 1개). 그러나 `columnHeaderCell`에 `accessible={true}`가 걸려 있고 그 하위에 중첩 `Pressable`(Remove 버튼)이 있어 — RN에서 `accessible` boolean이 서브트리를 단일 불투명 포커스 단위로 접어버려 **스크린리더로 그 Remove 버튼에 도달·조작 불가**(파일 내 유일한 다른 `accessible` 사용처는 중첩 Pressable이 없어 안전 — 이 헤더 셀만의 고립된 버그). 실질적 AT 접근 장벽으로 c의 "중복 알림" 결함보다 더 심각하다고 판정.

### 렌즈2 — 모바일 앱 완성도
**순위: a > b > c**
- a: 실제 라이브 카운트다운(`setInterval`), 클램프된 스테퍼가 실시간 최소입찰값을 갱신하고 확정 시 사다리·리더 상태까지 재계산 — 장식이 아니라 전부 기능적으로 연결. 독립 클램프를 가진 프록시 입찰 스테퍼까지 이중 인터랙션.
- b: `bestByRow` useMemo 재계산 등 기능은 실재하나, **768px에서 3컬럼(456px)이 `flex:1` 스크롤 컨테이너를 못 채워 우측에 빈 테두리 사각형이 그대로 노출**(`gridRow`+`columnsScroll` 스타일 조합 결함) — "이대로 배포하면 반려당할" 수준의 레이아웃 결함으로 실측.
- c: 티어 사다리는 실제 계산값(`qualifiedCount`) 기반이라 정당하나, Copy/Share가 일방향 라벨 전환뿐 되돌릴 토글이 없어 세 후보 중 인터랙션 깊이가 가장 얕음. 768 확대도 구조 적응 없이 단순 스트레치.

### 렌즈3 — 화면유형 차별성
**순위: b > a > c**
- 3후보 모두 서로 다른 매크로 실루엣(카운트다운+사다리 / 다중컬럼 그리드 / 마일스톤사다리+로스터)이라 2파전 축소는 없음 — 완전한 3파전.
- b: 처음부터 끝까지 그리드 문법 하나로 일관, 카탈로그 전역에 반복되는 "세로 리스트+우측 배지" 골격을 전혀 쓰지 않은 유일한 후보.
- a: 자체 헤더 코멘트가 밴드 하단부의 "확인 전 커밋" 발상이 payout/withdraw와 "rhyme"한다고 자진 고지 — 다만 스타일 키 신규성은 확인됨(폼 재사용이지 코드 표면 재사용 아님), 그래서 감점은 경미.
- c: 상단 절반(추천코드+마일스톤사다리)은 신규 문법이나, 하단 "초대자 목록"이 "아바타+이름+날짜+우측 상태 배지" — 카탈로그에서 가장 흔한 골격과 형태적으로 가장 가깝다(문자열/키 단위 충돌은 없음, 순수 실루엣 문제).

## 집계
1위 표: **a 2표(렌즈1·렌즈2)· b 1표(렌즈3)· c 0표**. 완전 동률이 아니므로 tie-break 예외 불요 — 단순 다수결로 **승자 a (Live Auction Bid)**.

## 정제 조치
없음 — 승자 a는 세 렌즈 중 규칙 위반이 지적되지 않았다(렌즈1이 a는 "결함 없음"으로 명시). 판정 후 수정 불요.

## LEARN 메모 (참고용, delta는 아래 별도 append)
- 패자 b의 두 결함(렌즈1의 `accessible` 중첩-Pressable AT 차단, 렌즈2의 768px flex 빈 공간)은 재배정 판단 대상 검토 — 둘 다 **형태가 아니라 규칙/구현 결함**이므로 `reassign-queue.md`에 등재 자격이 있으나, 그 큐는 라운드당 1개만 받고 이미 landing 쪽 1건이 대기 중이라(2026-09-12 등재, 소진 전) 이번엔 등재하지 않는다 — b의 그리드 형태(사이드바이사이드 비교) 자체는 렌즈3 1위를 받을 만큼 가치가 있었으므로, 다음에 landing 대기 항목이 소진되면 b를 후보로 재고한다.
- 패자 c의 결함(라이브리전 이중 alert)은 재배정보다 delta로 직접 편입(아래).

## 미확인 범위 (판정 3개 전원 자진 신고 종합)
- 390/768 외 폭(360 미만, 태블릿 랜드스케이프) 미확인
- `data.ts` 3파일 전체 라인 미확인(스크린에서 소비되는 형태로만 간접 확인)
- 실제 VoiceOver/TalkBack 세션 미실행 — a11y 결함(특히 b의 unreachable Pressable)은 RN `accessible` prop의 문서화된 시맨틱에서 정적으로 추론, 런타임 미검증
- `tokens.ts`의 타이포 스케일 등 color/space/radius 외 카테고리 미점검
- 기존 카탈로그 24개 화면 소스 재오픈 없이 라운드 브리프의 비충돌 서술에 의존(렌즈3)
