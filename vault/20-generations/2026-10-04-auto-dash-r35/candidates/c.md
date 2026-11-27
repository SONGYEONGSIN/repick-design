# Candidate C — Quadrant

**One-line concept:** Quadrant is a dark, single-orange-accent campaign-analytics console whose dominant visualization is a hand-built 35-campaign scatter/bubble chart (spend × conversion rate, bubble size = conversion volume, marker shape = channel) inside a filter-driven command deck — a top filter rail narrows which campaigns plot and live-recalculates a genuinely-computed Pearson correlation in a separate cohort panel, while clicking a bubble only pins that one label on a fully independent, narrower axis that never touches the filter/aggregate side.

## 적용한 인터랙션

1. **차트 호버/포커스 크로스헤어 + ephemeral 툴팁(키보드 포함)** — `scatter-chart.tsx`의 35개 투명 오버레이 `<button>`(점마다 1개, 24×24px 히트타겟)이 `onMouseEnter/onFocus`로 해당 점의 `hoveredId`를 세팅한다. 즉시 두 점선 크로스헤어 + 점 옆에 고정 앵커된 플로팅 카드(정확한 spend/rate/conversions/CPA) + 하단 `aria-live="polite"` 리드아웃이 뜨고, `onMouseLeave/onBlur`에 전부 사라진다 — 상태 변화가 전혀 영속되지 않는다.
2. **클릭 → 솔로 라벨 핀(독립 축)** — 같은 오버레이 버튼의 `onClick`이 `pinnedIds`(Set)를 토글해 그 캠페인 이름만 상시 라벨로 남긴다. 이 상태는 `aggregate-panel.tsx`·`data-table.tsx` 어느 쪽도 읽지 않는다 — 필터 패널이 재계산될 때도 핀은 그대로, 핀을 바꿔도 코호트 숫자는 1도 움직이지 않는다.
3. **필터 → 코호트 집계 재계산(선택→다중 위젯 동기화, 파급 범위 분리)** — `filter-rail.tsx`의 채널 멀티토글(5종, 모양+색 칩 = 범례 겸용) + 목표(Objective) 세그먼트 + 기간(7D/30D/90D) 세그먼트가 하나의 `filtered` 배열로 수렴하고, 그 배열만 `aggregate-panel.tsx`(총 스펜드·전환·블렌디드 전환율·평균 CPA·Pearson r)와 `data-table.tsx`에 흐른다. 채널 칩의 카운트는 "목표 필터만 적용한" 별도 집합(`countsSource`)에서 계산해, 채널을 꺼도 그 칩 숫자가 거짓으로 0이 되지 않게 했다.
4. **테이블 실제 정렬** — `data-table.tsx`가 Campaign/Spend/Clicks/Conversions/Rate/CPA 6열에 `aria-sort` 기반 클릭 정렬을 제공한다. 이 표는 charts.catalog가 요구하는 산점도의 필수 폴백이자, 호버 없이도 모든 값을 보여주는 완전 키보드 내비게이션 경로다.
5. **기간(Window) 토글** — 7D/30D/90D가 각 캠페인의 90일 베이스라인을 `days/90` 비율로 스케일링해 spend/clicks/conversions를 재계산하고, 축 도메인과 산점도 좌표·상관계수를 전부 다시 그린다 — 필터와는 다른, 데이터 자체의 "뷰" 축.
6. **⌘K 커맨드 팔레트(보너스)** — 35개 캠페인 전체 + 내비게이션 항목을 검색한다. 선택 시 필요하면 그 캠페인의 채널 칩을 켜고 목표 필터를 All로 되돌린 뒤 핀을 찍는다 — "점프해서 보여주기"라는 명시적 파워유저 단축키라 필터 상태를 건드리지만, 평범한 클릭-핀 축과는 분리된 의도적 예외임을 주석에 남겼다. `query`/`activeIndex`는 열릴 때마다 컴포넌트를 새로 마운트해(`{paletteOpen ? <CommandPalette/> : null}`) 초기화하므로, `useEffect`로 리셋하다 걸리는 `react-hooks/set-state-in-effect` 함정을 원천적으로 피했다.

## 브리프에 없던 것

**① 상관계수가 가리키는 서사와 채널별 숫자 설계**
- 무엇을 정해야 했나: "산점도가 상관계수 주석을 달아야 한다"는 요구는 숫자가 유의미하려면 데이터 자체에 진짜 분산이 있어야 한다. 35개 캠페인의 spend90/clicks90/conversions90을 전부 손으로 채워야 했다.
- 무엇으로 정했나: 채널별로 완전히 다른 경제성을 부여했다 — Search(고의도·중상 스펜드·견고한 전환율), Social(광범위·저의도), Display(최저 전환율), Affiliate(성과형·강한 전환율), Email(거의 무비용·최고 전환율). 그 결과 "스펜드가 큰 캠페인일수록 전환율도 높다"는 순진한 가정이 깨지는, 실제로 약하거나 음의 상관관계가 나오는 코호트가 됐다(런타임에 `pearsonR`로 실측, 하드코딩 아님).
- 왜: 상관계수가 데이터와 무관하게 "대충 그럴듯한 숫자"면 그 주석은 장식이다. 채널 간 경제성을 의도적으로 벌려서, 필터로 채널을 넣고 빼거나 기간을 바꿀 때 r 값이 실제로 유의미하게 움직이는 걸 보여주고 싶었다.

**② "필터 패널"을 범례로 겸용하기로 한 결정**
- 무엇을 정해야 했나: charts.catalog는 산점도에 "그룹별 모양 마커" 범례를 요구하는데, 브리프의 매크로 레이아웃도 별도의 필터 레일을 요구한다 — 둘 다 넣으면 같은 채널 목록이 화면에 두 번(범례 한 번, 필터 칩 한 번) 나타나는 중복이 생긴다.
- 무엇으로 정했나: 필터 레일의 채널 칩 자체를 범례로 설계했다 — 칩 안에 차트와 동일한 모양+색 글리프(`ChannelGlyph`)를 넣고, 꺼진 채널은 모양을 회색으로 죽여 "안 보인다"는 상태를 시각적으로도 전달한다.
- 왜: 중복 범례는 공간 낭비이자 "두 UI가 같은 사실을 다르게 보여주면 어느 쪽이 진실인지" 헷갈리게 만든다. 필터=범례로 합치면 한 곳만 보면 된다.

**③ 채널 칩 카운트의 분모 버그를 설계 단계에서 분리**
- 무엇을 정해야 했나: 필터 칩 옆 숫자가 "현재 필터링된 결과"를 그대로 쓰면, 채널을 끈 칩 자신이 0을 표시해 "이 채널엔 캠페인이 없다"처럼 보이는 거짓 정보가 된다.
- 무엇으로 정했나: 채널 카운트는 **목표(objective) 필터만** 적용한 별도 배열(`objectiveFiltered`)에서 계산하고, 코호트 패널 상단의 "N of 35 shown" 문구만 최종 `filtered.length`를 쓰도록 두 값을 분리했다.
- 왜: 같은 숫자처럼 보이는 두 개의 "카운트"가 실은 서로 다른 질문("이 채널엔 몇 개가 있나" vs "지금 몇 개가 보이나")에 답해야 한다는 걸 구현 중에 깨달았다 — 하나로 뭉치면 둘 중 하나는 항상 거짓말을 한다.

**④ 버블 크기 인코딩과 축 도메인의 분리된 안정성**
- 무엇을 정해야 했나: 버블 크기(전환수)와 X/Y축 도메인을 필터링된 부분집합 기준으로 재계산할지, 전체 코호트 기준으로 고정할지 — 둘 다 "필터가 차트를 바꾼다"는 요구를 만족시킬 수 있어 보였다.
- 무엇으로 정했나: 축 도메인·버블 크기 스케일은 **기간(period)에만** 반응하고 채널/목표 필터에는 반응하지 않도록 고정했다(`computeDomains`가 `withMetrics` 전체에서 계산, `filtered`가 아님). 필터는 오직 "어떤 점이 그려지는가"만 바꾼다.
- 왜: 채널 칩을 하나 끌 때마다 축 눈금과 버블 크기 기준이 재조정되면, 꺼진 채널 하나 때문에 남은 점들이 매번 다른 위치로 튀어 "방금 전엔 여기 있던 점이 왜 이동했지"라는 혼란을 준다. 필터는 가시성만 바꾸고 좌표계는 건드리지 않아야 비교가 안정적이다.
