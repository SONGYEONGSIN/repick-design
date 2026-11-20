# Candidate A — Customs Declaration Form

One-line concept: a seller fills in a customs declaration for an international shipment (a camera lens going to Canada) through four required field groups, with a bottom band acting as a blocked-workflow state machine that names the one incomplete group blocking progress and only becomes a tappable "Generate Label" action once every group is resolved.

- Component: `CustomsDeclarationScreen` (default export)
- Files:
  - `native/src/evolve/r60/a/CustomsDeclarationScreen.tsx`
  - `native/src/evolve/r60/a/data.ts`
- Render-check string: `"Customs Declaration"` (screen header, always rendered)

## 브리프에 없던 것

1. **무엇을 결정해야 했나:** 구체적인 품목/목적지/HS 코드 더미 데이터.
   **무엇으로 결정:** "Canon FD 50mm f/1.4 SSC Prime Lens" → Toronto, Canada, HS 9002.11 ("Photographic lenses, mounted").
   **왜:** 브리프는 "a camera lens being shipped to Canada" 예시만 제시하고 정확한 값은 명시하지 않음. HS 9002.11은 실제 사진용 렌즈 분류 코드 관행을 그대로 따서 사실성을 확보 — 임의 선택이지만 현실 규격 참조.

2. **무엇을 결정해야 했나:** 필수 필드 그룹의 정확한 개수·이름·순서.
   **무엇으로 결정:** 4개 — Item description → Declared value → Country of origin → Restricted contents, 이 순서로 고정.
   **왜:** 브리프는 "item description, declared value, HS-code-style category, country of origin, whether it contains batteries/liquids/etc." 를 개념적으로만 나열했고 그룹화·순서는 지정 안 함. 실제 통관 서류가 보통 품목 설명 → 가치 → 원산지 → 위험물 신고 순으로 받는 관행을 따름 (HS 코드는 품목 설명 카드에 보조 정보로 병합).

3. **무엇을 결정해야 했나:** 화면이 하나뿐인데 "필드 그룹을 완성한다"는 행위를 실제로 어떻게 구현할지.
   **무엇으로 결정:** Country of origin은 탭 선택 칩(Japan/Germany/China), Restricted contents는 체크박스 3개 + "Confirm restricted contents" 버튼으로 완료 처리. 완료 시마다 band의 blocked 메시지가 다음 그룹으로 자동 전환.
   **왜:** 브리프가 명시한 "탭하면 다음 미완료 그룹으로 진행" 상태 머신을 실제로 시연 가능한 상호작용으로 만들기 위한 임의 구현 선택 — 별도 입력 화면/네비게이션이 없는 단일 화면 제약 안에서.

4. **무엇을 결정해야 했나:** 어떤 그룹을 상호작용 가능하게 만들지(전부 vs 일부).
   **무엇으로 결정:** Item description과 Declared value는 이미 완료된 읽기 전용 카드로 두고, Country of origin과 Restricted contents만 실제 상호작용(선택/체크)으로 구현.
   **왜:** 네 그룹 모두에 전체 텍스트 입력 폼을 만드는 건 스코프 초과 — blocked→resolved→ready 체인을 보여주는 데는 2개 그룹의 실제 상태 전환으로 충분하다고 판단 (임의 스코프 결정).

5. **무엇을 결정해야 했나:** "Generate Label" 탭 이후 실제로 무슨 일이 일어나는지 (백엔드/네비게이션 없음).
   **무엇으로 결정:** 탭하면 band가 최종 성공 상태("Customs label generated for shipment to Canada.")로 전환되고 비활성화됨.
   **왜:** UX 가이드라인의 "로딩/제출 버튼은 비활성화되고 텍스트/스피너로 상태 변화를 보여줘야 한다"를 참조해, 눌렀을 때 아무 반응 없는 더미 버튼이 되지 않도록 결정.

6. **무엇을 결정해야 했나:** band의 3가지 상태(blocked/ready/done)에 어떤 토큰 색을 매핑할지.
   **무엇으로 결정:** blocked = warning(amber) 토큰, ready = accent(indigo) 단색 CTA, done = success(green) 토큰.
   **왜:** 브리프는 band 색상 매핑을 지정하지 않음. 토큰 세트에 이미 존재하는 success/warning의 의미(경고/완료)를 그대로 재사용 — accent는 "플러드 컬러로 쓰지 말 것"이라는 제약이 있었지만, 단일 CTA 버튼 배경은 플러드가 아닌 표준 버튼 용법으로 판단해 사용.

7. **무엇을 결정해야 했나:** "이모지 대신 간단한 벡터 도형/아이콘" 요구를 실제로 어떻게 구현할지 (아이콘 라이브러리 미설치).
   **무엇으로 결정:** lucide 등 아이콘 패키지를 추가하지 않고, border/transform만 쓰는 순수 `View` 조합으로 체크마크·자물쇠·링 아이콘을 직접 제작.
   **왜:** 네이티브 프로젝트 의존성에 아이콘 라이브러리가 있는지 확인할 수 없었고(터미널 접근 없음), 새 패키지를 추가하면 빌드가 깨질 위험이 있어 의존성 없는 방식을 택함.

8. **무엇을 결정해야 했나:** "파괴적 액션은 Alert 대신 인라인 Cancel/Confirm" 규칙 — 이 화면에 파괴적 액션(예: "선언 폐기")을 넣을지.
   **무엇으로 결정:** 넣지 않음.
   **왜:** 브리프 자체가 "if your screen has one"이라고 조건부로 명시 — 핵심 플로우(상태 머신 진행)에 필수적이지 않은 액션을 추가해 스코프와 접근성 리스크를 늘리지 않기로 결정.
