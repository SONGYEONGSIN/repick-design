# Candidate A — Storefront Profile Editor

A single-column settings form where a seller edits their public storefront presentation (name, bio, cover swatch, pinned-listing order, online/away badge), with a live preview card up top and a bottom save band that mounts only when the in-progress draft structurally diverges from the last-saved snapshot.

## 브리프에 없던 것

1. ① "Up to 3 pinned listings" 재정렬을 어떤 인터랙션으로 구현할지가 명시돼 있지 않았다. ② 고정된 3개 슬롯에 대해 항목별 위/아래(↑↓) 버튼으로 배열 내 순서를 swap하는 방식을 선택했다. ③ 드래그 앤 드롭 라이브러리 없이 ≤3개 고정 세트를 재정렬하는 가장 단순하고 접근성 친화적인 방법이며, 브리프가 이미 FlatList 예외로 "작은 고정 배열 map"을 허용했으므로 같은 원칙을 재정렬 버튼에도 확장했다.

2. ① 저장 직후 "Saved" 메시지가 사라지는 동안 밴드 자체를 계속 띄워둘지, 아니면 하단 바를 통째로 언마운트할지가 불명확했다. ② `hasUnsavedChanges || isConfirmationShowing`일 때만 밴드를 렌더링하고, 확인 메시지가 2.5초 뒤 꺼지면 두 조건이 모두 false가 되어 자연히 밴드도 사라지게 했다. ③ "변경 없으면 밴드 자체를 렌더링하지 않는다"는 브리프 규칙과 "저장 후 확인 메시지를 보여준다"는 요구가 동시에 성립해야 했기 때문에, 확인-표시 상태를 dirty 여부와 별도의 보조 상태로 분리하는 것이 가장 자연스러운 해석이었다.

3. ① 저장 버튼 활성/비활성 조건(빈 display name 방지 등 유효성 검사 범위)이 브리프에 없었다. ② display name이 공백만 있을 때 저장 버튼을 비활성화하는 최소한의 검증만 추가했다. ③ 폼 화면 일반 관행(필수 식별 필드 비어있으면 저장 막기) 수준의 임의 선택이며, 브리프가 요구한 범위를 넘어서는 복잡한 검증(예: 길이 하한, 금칙어)은 추가하지 않았다.

4. ① 커버 이미지 스와치를 고를 때 선택 표시를 어떻게 줄지가 명시돼 있지 않았다. ② 선택된 스와치 타일에 accent 테두리 + 체크 글리프(✓, 이모지 아님)를 얹는 방식을 선택했다. ③ "단일 accent는 강조에만 아껴 쓴다"는 DNA 규칙에 맞춰, 3개 중 1개만 선택되는 상태를 accent 테두리로 표시하는 것이 과하지 않은 최소 강조라고 판단했다.
