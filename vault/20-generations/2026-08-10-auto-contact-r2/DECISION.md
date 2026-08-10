# DECISION — auto-contact-r2

타깃: `contact`, 2라운드째. 프로파일 문서 없음 — `page-brief-core` + `page-brief-repo` + r1이 남긴 provisional 판정 기준으로 생성.

## 후보

r1의 3개 기존 아키타입(Culvert 디스패치보드 / Havelock 시계축 파이프라인 / Tessera 디플렉션 퍼널, 승자)과 겹치지 않는 3개, r1 전원이 수렴했던 "발신시각 시뮬레이터"(요일/타임존 select + 0-23시간 슬라이더) 장치를 명시적으로 회피하도록 배정했다.

- **a — Sole Trace / Escalation Ladder**: 4단계 에스컬레이션 사다리(Help desk → 전문 데스크 → Trust & escalations → 긴급 직통)를 세로 연결선으로 상시 전체 노출. 상황 칩은 해당 단계에 배지만 붙이고 아무것도 숨기지 않음. 축 = **에스컬레이션 계층**
- **b — repick / Trust Tier Console**: 방문자의 계정 관계(Guest/Verified buyer/Verified seller)를 축으로 채널을 재정렬. 기본 상태에도 baseline 채널 2개는 항상 노출. 축 = **신뢰/검증 단계**
- **c — Overrun / Desk Directory**: 6개 데스크를 검색창+카테고리 칩으로 실시간 좁히는 스태프 디렉토리형 목록, 좌 스티키 필터 레일. 축 = **질의 기반 데스크 탐색**

세 후보 모두 시계/타이머 장치를 쓰지 않았다 — r1의 수렴 결함이 이번엔 재현되지 않았다.

## 하드게이트

`node scripts/gate.mjs --target web --routes /contact-evolve/r2/<v>` (후보별 개별 실행) → **3/3 전원 1차 통과**. 1-fix 루프 불요. 상세는 SCORES.md.

**판정 대상 해시**: `b2ed540111f02d04797ff962e17676c97e68f7ea` — 게이트 전/후 동일 확인.

**환경 메모**: 샌드박스 chromium 리비전 불일치(native r2와 동일 원인) — `PW_CHROMIUM_PATH`/`CHROME_PATH`/`PW_NO_SANDBOX=1` 환경변수로 우회, 게이트 로직 무변경.

## JUDGE 패널 (3렌즈, 블라인드 — X/Y/Z = b/c/a)

프레임: 후보당 4장(1440·1440-s70·390·390-s100).

### 렌즈1 — 정본 준수
**1위 a · 2위 c · 3위 b.**

세 후보 모두 §1 기계 규칙(결정론·이미지·이모지·폰트 화이트리스트·다크저대비) 전원 통과했고, r1 델타(mailto/tel 작동 링크)의 문자 그대로도 전원 지켰다. 갈린 것은 그 델타의 **정신**이다 — b(tier console)는 tier 선택 시 `CHANNELS.filter`(`tier-console.tsx:30-32`)로 6채널 중 3채널(buyer-disputes·seller-payouts·seller-appeals)이 기본 상태에서 DOM에 아예 없다. r1 승자 c(Tessera)의 "데스크 보드 4장 항상 렌더"와 정반대 방향. c(directory)는 상시 노출은 완벽하나 전화번호 표시에 `tabular-nums`가 반복 누락(`c/page.tsx:96-101`, `directory-client.tsx:195-203`). a(ladder)는 `TIERS.map`이 무조건 렌더(`escalation-client.tsx:96-192`)해 위반 0건.

### 렌즈2 — 상용 완성도
**1위 c · 2위 a · 3위 b.**

c가 가장 "실제 회사" 같다 — 실명 데스크 리드, 검색 무매치 시 진짜 빈 상태(대체 mailto 포함, `directory-client.tsx:259-282`), "Medians, not promises" 정직성 카피. a는 모든 단계가 "다음 단계로 가라"는 사슬을 명시(`escalation-client.tsx:179-187`)해 근소한 2위. b는 접근성 구현(네이티브 fieldset/radio)은 최고였으나 헤더에 연락 CTA가 없고 모바일에서 baseline 채널의 실제 주소 텍스트가 `sm:inline`으로 숨겨짐(`b-390.png`).

### 렌즈3 — 아키타입 차별성
**1위 a · 2위 b · 3위 c.**

a는 카탈로그 전체에서 세로-연결선 계층형 러그북 패턴의 선례가 없고, 유일하게 게이팅 없는 설계다. b는 신원-축 자체는 새로우나 실제로는 `CHANNELS.filter`로 좁히는 필터 장치라 c와 메커니즘이 겹치고, r1의 "필터는 게이트가 아니라 강조여야" 규범에도 저촉. **c는 이미 카탈로그에 등재된 두 타입과 골격·관용구 수준에서 겹친다** — `catalog`(`ct1`, 좌 필터 레일+좁혀지는 그리드)와 `careers`(`cr1`/`cr2`, 칩 필터가 상시-오픈 목록을 좁힘)와 사실상 동일 구조이고, 빈 상태 카피("No desk matches your filters.")가 `catalog`·`careers-2`의 카피와 거의 축자적으로 같다. 이 관측은 Q22에 신규 사례로 기록했다 — 수렴이 이번엔 다음 라운드/다음 층위가 아니라 **이미 승격된 타입의 골격**으로 착지했다.

## 승자 — a (Sole Trace — Escalation Ladder)

1위 표: **a 2표(렌즈1·렌즈3) · c 1표(렌즈2)** — 단순 다수결, tie-break 불요.

렌즈2가 완성도에서 c를 1위로 꼽았으나(차별성↔완성도 상충의 익숙한 패턴), 렌즈1·렌즈3이 c의 두 가지 실결함 — 반복된 `tabular-nums` 누락, 그리고 이미 카탈로그에 있는 두 타입과의 골격 수렴 — 을 각각 지목해 다수를 이뤘다.

## 비승자 결함 기록 (참고, 재현 1회 — 승격 대상 아님)

- **b — 채널 게이팅**: `tier-console.tsx:30-32`. r1 델타의 "core proof 상시 노출" 정신을 위반하는 구체적 사례로, 이번 라운드 신규 델타의 반대 증거로 함께 인용했다(정제 게이트 참조).
- **b — 모바일 주소 텍스트 은닉**: `page.tsx:101-106`(`hidden … sm:inline`), `b-390.png`에서 확인. 링크는 작동하나 "어느 주소인지"가 탭 전에는 안 보인다.
- **c — `tabular-nums` 누락**: `page.tsx:96-101`, `directory-client.tsx:195-203`. 같은 파일 다른 곳(카운트·시간)엔 정상 적용.

## 정제 게이트

- `contact-deltas-provisional.jsonl` 전체 로드(2줄: r1 링크-작동성 델타, r2 신규 게이팅-금지 델타). 두 델타는 서로 다른 구체적 축(작동성 vs 게이팅)이라 병합하지 않고 별도 L1로 유지 — 재현 2라운드 임계 미달, L2 승격 보류.
- 충돌 쌍 없음.
- **질문 큐 갱신**: Q22("수렴이 층위를 옮겨 계속되는가")에 이번 라운드 관측(c의 카탈로그 전체 골격 수렴)을 신규 사례로 append — 새 질문 생성이 아니라 기존 pending 질문에 데이터 포인트 추가.

## 다양성 축

`catalog-variety.mjs` banList(최근 3라운드): face=`grotesk` 금지 — 세 후보 전원 준수(a=Pretendard만, b=`--font-display-wide`, c=`--font-display-mono`). 테마·액센트 제한 없음(a=light/blue, b=light/blue... 실제 확인 필요 없음 — 승자 a variety는 라운드 종료 시 아래 원장에 기록).
