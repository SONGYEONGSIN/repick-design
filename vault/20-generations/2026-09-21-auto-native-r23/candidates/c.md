# Candidate c — Listing Photo Manager

A grid screen for managing the photo set already attached to a seller's listing: a 3-column `FlatList` grid of ten placeholder photos, one marked as the current cover. Tapping a photo toggles its selection; as soon as one or more photos are selected, a bottom contextual bar appears with "Set as cover" (enabled only for a single, non-cover selection) and "Delete N" (destructive). The bar and a post-delete "undo" strip are mutually exclusive bottom surfaces — deleting clears the selection (unmounting the bar) and mounts the undo strip instead; picking a new photo dismisses any pending undo. A single `accessibilityLiveRegion="polite"` container announces selection-count changes, cover updates, deletes, and undos through one shared alert text.

Default export component: PhotoManagerScreen (file: PhotoManagerScreen.tsx)
Check string (exact visible text on initial render, zero-selection state): "Manage Photos"

## 브리프에 없던 것

① 삭제된 사진 중 커버 사진이 포함된 경우 새 커버를 어떻게 정할지, 그리고 undo 시 이전 상태를 어떻게 정확히 복원할지가 브리프에 명시되어 있지 않았다.
② 삭제 시 남은 사진 중 순서상 첫 번째(order 최솟값)를 자동으로 새 커버로 지정하고, undo는 삭제 직전의 전체 `photos` 배열 스냅샷을 통째로 복원하는 방식(부분 병합이 아닌 완전 스냅샷)으로 구현했다.
③ 부분 병합(잘라낸 사진들을 원래 순서 위치에 다시 끼워 넣는 방식)은 커버 플래그·순서 번호 재계산에서 엣지케이스가 많아 버그 위험이 크다. 스냅샷 복원은 "실행 취소는 정확히 이전 상태로 되돌린다"는 사용자 기대를 가장 단순하고 확실하게 충족시킨다. 새 커버 자동 지정은 "커버 없는 리스팅"이라는 불가능한 상태를 만들지 않기 위한 안전장치다.
