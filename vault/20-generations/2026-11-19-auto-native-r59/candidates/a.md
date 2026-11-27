# Candidate a — Bulk Discount Campaign

One-line concept: a seller checks any number of 8 active listings with per-row checkboxes, dials one shared discount with a bounded +/- stepper, watches every selected row's new price recompute live, and a selection-count bar states the running total dollar savings until "Apply Campaign" locks everything into a read-only confirmation.

## 브리프에 없던 것

- **결정** 활성 리스팅 개수 = 8개 고정 (`cdc-1`~`cdc-8`, Outerwear/Footwear/Bags/Accessories/Knitwear/Bottoms/Tops/Dresses 각 1개씩). **이유**: 브리프가 "~8 active listings"로만 명시해 정확한 개수·카테고리 다양성은 위임됨. 카테고리를 전부 다르게 해 "bulk"가 단일 카테고리 세일이 아니라 임의의 재고 묶음에 적용되는 범용 도구임을 보이게 했다.
- **결정** 할인 스텝 크기 = 5%, 범위 0-50%, 기본값 15%. **이유**: 브리프가 "e.g. 5% at a time, bounded 0-50%"로 예시만 주고 정확한 스텝은 위임. 기본값을 0%가 아니라 15%로 둔 것은, 0% 기본값이면 체크 즉시 "$42 → $42 at 0% off"라는 무의미한 프리뷰가 뜨기 때문 — 15%는 5의 배수(스텝 경계와 정합)이면서 즉시 유의미한 프리뷰를 보여준다.
- **결정** 밴드 형태 = 선택-개수 파생 컨텍스추얼 바 (브리프가 지정). 코드 표면 차별화를 위해 상태/스타일 키를 전부 이 도메인 어휘로 새로 지음: `selectedIds`(Set, 미리 본 `r48/c`의 `selectedListingIds` 배열과 다르게 Set 사용), `discountPercent`, `phase`("building"/"applied"), 스타일 키 `discountPanel*`/`selectionPanel`/`selectionSummaryText`/`applyCampaignButton`/`confirmationPanel`/`confirmationDoneButton`. `bandBlocked*`/`bandReady*`/`contextBar`/`presetChip`류 기존 명명을 피함.
- **결정** "Apply" 이후 상태 = 화면 전체가 아니라 **행은 그대로 보이고 잠긴 채로 "In campaign" 태그만 추가**, 하단 밴드만 선택-바에서 확인 패널로 교체. **이유**: 과업 지시가 "transition the screen to a simple confirmation state"라고만 해서 정확한 범위(풀스크린 교체 vs 부분 교체)는 위임됨. 풀스크린으로 리스트를 지우면 "방금 뭘 체크했는지"를 다시 확인할 길이 없어져 세일즈 도구로서 신뢰도가 떨어진다고 판단, 리스트는 기록으로 남기고 밴드만 전환했다.
- **결정** 확인 패널에 "Start New Campaign" 버튼 추가(모든 state 리셋 — `selectedIds` 비움, `discountPercent` 기본값 복귀, `phase` building 복귀). **이유**: 브리프에 없는 추가 동작이지만, 없으면 화면이 "applied" 상태에서 영구히 멈춰 더미 데모를 다시 테스트할 길이 없는 막다른 화면이 됨. 진짜 동작(no-op 아님)이라 §4의 "약속 못 지키는 hint" 금지 규칙과 충돌하지 않음.
- **결정** 라이브 리전 컨테이너(`statusRegion`)를 `selectedCount > 0` / `phase === "applied"` 여부와 무관하게 **항상 마운트**, 그 안의 자식(선택 바 vs 확인 패널 vs 아무것도 없음)만 교체. **이유**: 밴드 자체는 "0 선택 시 부재, 1+ 선택 시 등장"해야 하는 선택-파생 바 doctrine을 만족시키면서도, 동시에 과업 지시의 "mount the live-region container before any state change happens — not conditionally rendered into existence at the same render as the content change" 요구를 글자 그대로 지키기 위해 컨테이너와 그 가시적 내용(패딩 없는 빈 View vs 실제 패널)을 분리했다. 두 요구가 표면적으로 충돌하는 것처럼 보였는데, "컨테이너는 항상 있고 내용만 비거나 찬다"로 풀었다.
- **결정** 할인 미리보기 텍스트는 각 선택된 행에서 **항상** 계산해 보여주되(`discountPercent === 0`이어도 "$X → $X at 0% off"로 그대로 표시), 0%일 때 숨기지 않음. **이유**: 과업이 "live-recomputes and displays ... for every currently-selected row"라고 했으므로, 0%라고 줄을 숨기면 "0%도 유효한 캠페인 설정값"이라는 사실이 가려진다고 판단해 정직하게 그대로 노출.

## Dedup check

- `native/src/evolve/r48/c` (**BulkPriceDropScreen** + `PriceDropGridCell`): 가장 근접한 선례. 둘 다 "여러 리스팅 다중선택 + 퍼센트 할인 + 선택-개수 파생 바"다. 구조적 차이:
  - r48/c는 **프리셋 칩**(`-10%`/`-20%`/`-30%`, `DISCOUNT_PRESETS.map`)을 눌러 **즉시 각 선택 항목에 커밋**하고, 적용된 셀은 영구적인 3번째 시각 상태(취소선 가격 + Undo/Confirm revert 행 단위 확인)로 전환된다 — 할인율은 행마다 다를 수 있다(여러 번 다른 프리셋을 적용 가능).
  - 이 후보는 **연속 +/- 스테퍼**(이산값, 드래그 없음)로 **화면 전체에 공유되는 단일 할인율**을 올리고, 체크된 행들은 그 공유값으로 **커밋 전에 실시간 프리뷰**만 본다(취소선 없음, 아직 적용 안 됨). "Apply"는 셀 단위가 아니라 **화면 전체 1회 전환**(`phase: building→applied`)이고, 이후 행 단위 Undo/Revert 확인 UI가 전혀 없다 — 되돌리려면 "Start New Campaign"으로 전체 리셋뿐이다.
  - 따라서 행 단위 영구 적용+개별 Undo(r48/c) vs 화면 단위 1회 커밋+공유 할인율 실시간 프리뷰(이 후보)로 메커닉이 명확히 다르고, 스타일 키(`contextBar`/`presetChip`/`cellApplied`/`revertConfirmRow` 등)도 전혀 재사용하지 않았다.
- `native/src/evolve/r52/b` (**CurateFeaturedItemsScreen** + `FeaturedSelectionBar`): 선택-개수 파생 바라는 점은 같지만 도메인이 전혀 다르다(피처 슬롯 순서 재배열, cap 차단, 저장/디스카드 드래프트-vs-last-saved 비교) — 가격·할인 개념이 전무하고 체크박스가 아니라 순위(rank) 토글이다. 코드 표면 중복 없음.
- `native/src/evolve/r51`, `r53`~`r58` 전체를 `selectedCount|multi-select|checkbox|stepper|discount` 키워드로 스캔: `r54/a` TradeInPayoutEstimatorScreen은 가격 산정이지만 단일 품목 추정이라 다중선택이 없고, `r56/b` PriceDropAlertSettingsScreen은 "할인 알림" 설정이지 캠페인 적용이 아니다(알림 임계값 설정, 다중선택 없음). 그 외 매칭은 "discount"/"stepper" 단어가 무관한 맥락(라벨 문구 등)에서 우연히 걸린 것으로, 구조적 중복 없음.
- `native/src/*`(evolve 밖 정식 화면) 전체에서 "bulk"/"campaign"/"discount"/다중선택+스테퍼 조합 매칭 0건 — 이 도메인 자체가 정식 카탈로그에 아직 없음.
