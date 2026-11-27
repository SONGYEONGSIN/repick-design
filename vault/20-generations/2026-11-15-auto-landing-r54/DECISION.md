# DECISION — auto-landing-r54 (target: landing)

## 0. 연속 라운드 맥락

이 라운드는 같은 무인 실행의 **두 번째** 바깥 반복이다. 첫 번째(`auto-dash-r62`, target dash)의 delta·questions-queue append가 이미 디스크에 반영된 상태에서 시작했다(§1 RETRIEVE가 그 갱신분을 읽었다). `round-budget.mjs "2"` → N=1(미채움 0종) — 이 반복도 스킬 내부적으로는 1라운드.

## 0-0. 서브에이전트 가용성

오케스트레이터 본인이 `Agent` 도구 보유 — 이번에도 designer 3·judge 3을 직접 병렬 스폰해 완주. no-round 조건 미해당.

## 0-1. 타깃 선택

```
IS_NATIVE_DAY = 0 (일요일)
미채움 PAGE_TYPES → 0종
TARGET = ['dash','landing','native'] 균등 난수 → landing
```

`reassign-queue.md` 확인: `target:landing` 대기 중 없음(라운드 1에서 추가된 것은 `target:dash` #23 뿐, landing 큐는 그대로 비어 있음).

라운드 번호: `target:landing` 최대 round+1 = **54**. run id `auto-landing-r54`.

## 1. RETRIEVE

- `design-principles.md` 전문, `page-brief-core.md`·`page-brief-repo.md`(라운드 1에서 이미 전문 로드, 내용 불변이므로 재인용), `reassign-queue.md`(landing 비어있음 확인), `curation-criteria.md`(재인용).
- `landing-deltas-provisional.jsonl` 최근분 — "선택→다중위젯 동기화" 계열 원칙과 "조작 상태가 페이지 끝까지 생존해야 한다"·"출력 매체는 조건이 아니라 인과적 일관성이 조건" delta를 designer 프롬프트에 직접 반영.
- `auto-ledger.jsonl`의 `target:landing` 최근 5개: r49(b, dark/blue) · r50(b, light/orange/wide) · r51(c, dark/cyan/mono) · r52(a, dark/amber/grotesk) · r53(a, light/rose/grotesk).
- `app/src/lib/works.ts`의 landing 카탈로그(v6~v26, 약 20편) 전수 열람 — 기존 input×output 조합(가중치 재정렬·토글 번들빌더·연속슬라이더→다이얼/레이더/2D산점도·게이트체인 토글·트랙체인지 문서·협상 트랜스크립트·레이어인스펙터·가격밴드 좁히기·예산슬라이더→스펙그리드·이산필터 히스토그램·트리맵·분해레이어스택·런닝렛저)를 금지 목록으로 3 designer에게 명시.
- **다양성 금지 축**: 최근 2승자(r52 dark/amber/grotesk, r53 light/rose/grotesk)가 둘 다 grotesk — 이번 라운드는 grotesk 금지, mono·wide·무활자(Pretendard-only) 배정. accent는 최근 5라운드 사용분(blue/orange/cyan/amber/rose) + 전역 과다축(amber/teal/violet-hex) 회피, 저사용축(emerald/indigo/green) 배정.

## 2. GENERATE — 3병렬

| 후보 | 디바이스(입력×출력) | 테마/액센트/활자 | 산출 |
|---|---|---|---|
| a | 드래그로 고정합 재분배(스택바 디바이더, 제로섬) → 구성비 + fit점수, 클로징 CTA까지 생존 | light / emerald / `--font-display-wide` | "Switchback" — 트레일기어 리셀 스포트라이트 크레딧 배분기 |
| b | 과거 타임라인 위 드래그 리사이즈 브러시 윈도우 → 실제 데이터 서브셋(Before/Inside/After) 비교 | dark / indigo / Pretendard-only | "Reclaimed Trail" — 카메라 가격history 타임라인 브러시 |
| c | 아이템 카드를 라벨된 버킷 3개로 개별 드래그앤드롭 → 구성 차트 + 판정 문장 | light / green / `--font-display-mono` | "repick Sort" — 클로짓 아이템 처분 소터 |

세 designer는 서로의 폴더를 열지 않았음(c가 b·c의 브랜드명을 git log에서 우연히 봤으나 내용은 안 읽었다고 명시 — 디자인에 영향 없음). 각 candidates/<v>.md 작성 완료, 대비·줄길이 산술 포함.

**동결+해시**: `667358212eef69f29c2715165be8fa1246e19dfa`.

## 3. HARD GATE

### a (Switchback) — 1-fix 생존
1차: `static` 위반 2건(`no-unlisted-font` — `fontFamily: DISPLAY_FONT` 변수 참조, 정규식이 리터럴 `var(--font-X)`만 인식). 나머지 9게이트 클린.
1-fix: 변수 참조를 리터럴 `"var(--font-display-wide)"`로 치환 + 미사용 import 제거. 재게이트 **10/10 클린**.

### b (Reclaimed Trail) — 1차 클린
전 게이트 1차 통과(1-fix 불요). `console` 결함 0 — 지난 라운드(dash r62)에서 발견한 `Intl.NumberFormat` compact-notation trailing-zero ICU 불일치 경고를 이번 세 designer 전원에게 명시했고, 이 라운드에서 해당 결함군은 **0건 재현** — 경고가 즉시 효과를 봤다.
### c (repick Sort) — 1-fix 생존
1차: `static` 위반 7건(동일 결함군, `Client.tsx`·`CompositionPanel.tsx`·`ListingPreviewCard.tsx` 3개 파일). 1-fix: 전부 리터럴 `"var(--font-display-mono)"`로 치환 + 미사용 import 3곳 제거. 재게이트 **10/10 클린**.

**생존 3개(a, b, c) — 이번 라운드는 하드게이트 탈락 없음.**

상세: `SCORES.md`.

## 4. JUDGE 패널 — 3렌즈 블라인드, 3자 비교

스크린샷: 각 16프레임 전수 캡처(48장), blank 0. judge에게 4프레임씩(1440-top·1440-s70·390-top·390-s100) 제공.

| 렌즈 | 1위 | 2위 | 3위 | 핵심 근거 |
|---|---|---|---|---|
| 1 (DNA 준수) | **a** | c | b | "증명은 히어로 컴포넌트 안" 규칙을 **실제 PNG 치수 확인**(1440×900 검증)으로 재검증 — a만 디바이스+배지달린 매물카드가 히어로 자체에 있음. **c는 자진고지한 위반**(매물카드가 분리 섹션, 35% 스크롤에야 등장)이 확인됐고, **b는 같은 위반을 자진고지 없이 더 심하게**(폴드 안에 매물카드 자체가 0개, 35~70% 구간에야 등장) 저질렀다는 것을 독립 재검증으로 발견 — 자진고지 여부가 아니라 위반의 실측 심도로 순위를 매겼다. |
| 2 (상용 완성도) | **a** | c | b | a는 터치세이프 드래그(`touchAction:none`+완전한 ARIA slider)·배분%가 100 합산·데드스페이스 없음. c는 네이티브 HTML5 DnD(터치 미지원)를 버튼 폴백으로 보완한 의도적 설계가 가점, 단 모노스페이스 활자가 소비자 리세일 맥락에 다소 과감. b는 히어로 우측 절반이 데드스페이스 + 브러시 핸들에 `touchAction` 미설정으로 터치 드래그가 스크롤과 충돌할 위험. |
| 3 (구조 차별성) | **c** | b | a | c의 "항목별 개별 드래그 분류"는 연속위치×파생값 패밀리(a·b 포함, 기존 슬라이더/밴드류와 동형) 밖의 유일한 입력 축 — 코드 추적으로 직접 확인. a는 "제로섬 재분배"가 기존 예산슬라이더→스펙그리드와 입력×출력 조합상 동형(스킨 차이)으로 판정. b는 "드래그가 실제 데이터 서브셋을 바꾼다"는 기존 price-band-narrowing의 점증적 진화로 판정, 더해 카메라 리세일 도메인이 `r49/a`와 일부 겹침(디바이스는 다름)을 직접 대조 확인. |

**집계: 1위 표 a=2(렌즈1·2) · c=1(렌즈3) · b=0 → 다수결 승자 = a.** 완전동률 아님, no-winner 아님.

이 결과는 §dash-r62와 같은 라운드 안에서 **두 번째로** "완성도 다수결 우선"(렌즈1+2 vs 렌즈3) 패턴을 재현했다 — 기존 L2/L3 원칙의 반복 확인이라 문구 변경·질문 추가 불필요.

## 5. LEARN — 격리 적재

`landing-deltas-provisional.jsonl`에 1건 append(L1, judge_votes 포함): "자진고지는 위반이 그 후보에만 있다는 증거가 아니다 — 렌즈1이 실제 픽셀 치수로 재검증해 c의 자진고지 위반과 동형인 미고지 위반을 b에서(더 심한 형태로) 찾아냈고, 그 결과가 b·c의 상대 순위를 갈랐다." §7 참조.

## 6. 지식 정제 게이트

- 클러스터링: 이번 delta는 기존 "게이트 탈락은 형태 판정이 아니다"·"계측을 만들 때는 계측 자신을 반증해야 한다"(둘 다 "증거 없이 신뢰하지 않는다"는 같은 상위 원리) 계열과 무충돌 — 보강.
- 충돌 쌍: 없음. 신규 질문: 없음(이번 발견은 이미 기존 judge 지시가 의도한 대로 작동한 성공 사례라 미해결 판단 지점이 아님).
- 재배정 큐: 신규 없음 — 이번 라운드는 하드게이트 탈락이 0건이라 재배정 대상이 없다. b의 히어로/증명 분리 위반은 **판정 단계에서 드러난 완성도 결함**(게이트 위반 아님)이므로 재배정 큐(게이트 탈락 전용)에는 해당하지 않는다.

## 7. 기록 + 커밋

- `auto-ledger.jsonl` append: `target:'landing', round:'auto-landing-r54', winner:'a', no_winner:false, judges:{lens1:'a',lens2:'a',lens3:'c'}, variety:{theme:'light',accent:'emerald',face:'wide'}`.
- `vault/index.md` "세대 기록"에 등재.
- 정본(design-principles.md·page-brief-core.md 등)·`/dash` 갤러리·`/v1~v5`(landing 카탈로그는 `app/src/lib/works.ts`의 데이터일 뿐 코드 경로 자체가 없음, 수정 없음 확인) 무변경.
- `git commit` → `evolve/dash` → push.
