# Candidate b — "Branch" (Trade-In Triage Tree)

Two SEQUENTIAL branching questions — not a fixed linear stepper. The second question's wording
and three options genuinely depend on the first answer (a phone is asked about battery charge, a
laptop about its screen, headphones about which side plays sound), highlighting a live path
through a fixed, fully pre-laid-out 1→3→9 tree. Choosing a different device clears the condition
answer (the question itself changed); a "different device" action prunes back to nothing chosen.
A third, independent toggle (urgency) swaps between two distinct channel/price offers for every
one of the nine leaves, not just the obviously-broken ones.

Theme/accent/face: light / lime (`#3F6212`, 7.08:1 on `#FFFFFF`, reusing r59/c's verified math for
this hue) / `--font-display-wide`.

Macro bucket: branching multi-step discrete-select → live-highlighted tree diagram → leaf lookup.
Distinct from this catalog's single-axis steppers (v6/v16), independent-toggle pipelines (v20),
and sequential swipe/vote devices (r56 Sift) — none of those have a SECOND question whose option
set changes based on the first answer; all of them ask the same question shape repeatedly or
toggle independent booleans.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 트리를 매 선택마다 레이아웃을 다시 계산할지, 고정 전체 트리를 두고
   경로만 하이라이트할지.
   **무엇으로 정했나**: 고정 전체 트리(9개 리프 전부 좌표 고정) + 경로 하이라이트.
   **왜**: 관행 — [[page-brief-core]] §3 "SVG 좌표는 결정론" 규율과 같은 이유로, 동적 레이아웃
   엔진 없이 매번 같은 픽셀이 나오게 하는 쪽을 택했다. 부수 효과로 "전체 지도"가 항상 보여
   아직 안 가본 가지가 있다는 걸 알 수 있다.

2. **무엇을 정해야 했나**: 비활성 리프(선택되지 않은 디바이스의 조건 옵션)에 텍스트 라벨을
   넣을지.
   **무엇으로 정했나**: 넣지 않음 — 점(circle)만, 선택된 디바이스의 3개 리프에만 텍스트.
   **왜**: 임의 — 9개 전부에 라벨을 넣으면 각 라벨의 대비를 "옅게" 칠하고 싶어지는데, axe의
   `color-contrast`는 보이는 텍스트 노드면 투명도와 무관하게 재므로([[page-brief-core]] §2
   "aria-hidden은 면제가 아니다"와 같은 함정), 안전하게 텍스트 자체를 안 그리는 쪽을 택했다.

3. **무엇을 정해야 했나**: urgency 토글이 "분명한 경우"(완전 고장)에서도 실제로 뭔가를 바꿔야
   하는지, 아니면 채널이 고정이면 토글을 숨겨야 하는지.
   **무엇으로 정했나**: 9개 리프 전부에서 rush/patient가 채널 또는 가격 중 최소 하나는
   다르게 — "완전 고장"도 rush=Recycle Credit 고정가, patient=Marketplace(parts) 범위로 분리.
   **왜**: [[curation-criteria]] Q8 판정("항상-노출 조작은 실제로 뭔가를 바꿔야 한다")과 같은
   정신 — 일부 리프에서만 토글이 죽은 조작이 되면 "가짜 라이브니스" 문제가 생긴다.
