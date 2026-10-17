// native/src/evolve/r25/c/SavedSearchManagerScreen.tsx — auto-native-r25 candidate c.
//
// Saved Search Manager: a buyer's list of standing searches (e.g. "iPhone 13 Pro, under a
// price ceiling, like-new"), each showing how many new matching listings appeared since it was
// last checked. This is a new domain in the catalog — nothing existing models a *standing
// query that keeps watching the whole marketplace*: `watchlist` tracks individual items the
// buyer already found, `following-feed` tracks specific sellers, and neither has a query the
// buyer never has to re-type. The buyer manages these searches, they don't browse listings here.
//
// Band form (GENERATION.md §3, form 3 — selection-driven contextual bar): absent at
// selectedCount === 0, mounted only once it's > 0, and structurally exclusive with the
// post-delete recovery row below (an if/else-if chain guarantees at most one bottom surface is
// ever mounted). Per the codebase's own accumulated lesson, the bar mechanism alone is not
// enough — the real differentiation is the domain-specific logic layered on top of it:
//
//  1. Pause/Resume is not a single always-available bulk toggle. `pauseEnabled` is computed
//     from the *selected set's own pause state*: enabled only when every selected search is
//     currently active (label reads "Pause") or every one is currently paused (label reads
//     "Resume"). A mixed selection makes the button unavailable and the dock says why — the
//     bulk action set genuinely changes shape depending on per-item state, not just its count.
//  2. Merge is enabled only when selectedCount === 2 AND the two share a category
//     (`canMergePair`, data.ts). It doesn't just flip a flag — it computes a real new saved
//     search (`buildMergedSearch`): the wider of the two price ceilings, the shared condition
//     (or "Any condition" if they disagree), and a summed new-matches count, then replaces the
//     two originals with that one row.
//  3. Bulk delete never opens a native Alert. Pressing Delete converts the dock itself into a
//     Cancel/Confirm row inside the same already-live-region-wrapped container, and only a
//     Confirm press removes anything.
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CATEGORY_LABELS,
  INITIAL_SAVED_SEARCHES,
  buildMergedSearch,
  canMergePair,
  formatPriceCeiling,
  plural,
  type SavedSearch,
} from "./data";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

type DockMode = "actions" | "confirmDelete";

type UndoEntry = {
  previous: SavedSearch[];
  removedCount: number;
};

function SearchRow({
  item,
  selected,
  onToggle,
}: {
  item: SavedSearch;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const statusWord = item.paused
    ? "paused"
    : item.newMatchesCount > 0
      ? `${plural(item.newMatchesCount, "new match")}`
      : "no new matches";
  const label = `${item.title}, ${CATEGORY_LABELS[item.category]}, ${item.conditionLabel}, ${formatPriceCeiling(item.maxPriceKrw)}, ${statusWord}, ${selected ? "selected" : "not selected"}`;

  return (
    <Pressable
      onPress={() => onToggle(item.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.searchRow,
        selected && styles.searchRowSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.checkDot, selected && styles.checkDotOn]}>
        {selected ? <Text style={styles.checkMark}>✓</Text> : null}
      </View>

      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.rowMeta} numberOfLines={1}>
          {CATEGORY_LABELS[item.category]} · {item.conditionLabel} ·{" "}
          {formatPriceCeiling(item.maxPriceKrw)}
        </Text>
        <Text style={styles.rowChecked}>{item.lastCheckedLabel}</Text>
      </View>

      <View style={styles.rowStatus}>
        {item.paused ? (
          <View style={styles.pausedPill}>
            <Text style={styles.pausedPillText}>Paused</Text>
          </View>
        ) : item.newMatchesCount > 0 ? (
          <View style={styles.matchPill}>
            <Text style={styles.matchPillText}>{`+${item.newMatchesCount} new`}</Text>
          </View>
        ) : (
          <Text style={styles.noMatchText}>No new matches</Text>
        )}
      </View>
    </Pressable>
  );
}

function SelectionDock({
  mode,
  selectedCount,
  pauseLabel,
  pauseEnabled,
  mixedPauseState,
  mergeEnabled,
  mergeBlocked,
  onCancelSelection,
  onPauseResume,
  onMerge,
  onDeletePress,
  onConfirmDelete,
  onCancelDelete,
}: {
  mode: DockMode;
  selectedCount: number;
  pauseLabel: "Pause" | "Resume";
  pauseEnabled: boolean;
  mixedPauseState: boolean;
  mergeEnabled: boolean;
  mergeBlocked: boolean;
  onCancelSelection: () => void;
  onPauseResume: () => void;
  onMerge: () => void;
  onDeletePress: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  if (mode === "confirmDelete") {
    return (
      <View style={styles.dock}>
        <Text style={styles.dockConfirmText}>
          {`Delete ${plural(selectedCount, "saved search")}? This can't be undone from here.`}
        </Text>
        <View style={styles.dockConfirmRow}>
          <Pressable
            onPress={onCancelDelete}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Cancel delete"
            style={({ pressed }) => [styles.dockSecondaryBtn, pressed && styles.pressed]}
          >
            <Text style={styles.dockSecondaryBtnText}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={onConfirmDelete}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`Confirm delete of ${plural(selectedCount, "saved search")}`}
            style={({ pressed }) => [styles.dockDangerBtn, pressed && styles.pressed]}
          >
            <Text style={styles.dockDangerBtnText}>Confirm</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.dock}>
      <View style={styles.dockTopRow}>
        <Pressable
          onPress={onCancelSelection}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Clear selection"
          style={({ pressed }) => [styles.dockCancel, pressed && styles.pressed]}
        >
          <Text style={styles.dockCancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.dockCount}>{plural(selectedCount, "selected")}</Text>
      </View>

      <View style={styles.dockActionsRow}>
        <Pressable
          onPress={onPauseResume}
          disabled={!pauseEnabled}
          accessibilityRole="button"
          accessibilityState={{ disabled: !pauseEnabled }}
          accessibilityLabel={
            pauseEnabled
              ? `${pauseLabel} ${plural(selectedCount, "search")}`
              : `${pauseLabel} unavailable, selection mixes active and paused searches`
          }
          style={({ pressed }) => [
            styles.dockActionBtn,
            !pauseEnabled && styles.dockActionBtnDisabled,
            pressed && pauseEnabled && styles.pressed,
          ]}
        >
          <Text
            style={[styles.dockActionBtnText, !pauseEnabled && styles.dockActionBtnTextDisabled]}
          >
            {pauseLabel}
          </Text>
        </Pressable>

        <Pressable
          onPress={onMerge}
          disabled={!mergeEnabled}
          accessibilityRole="button"
          accessibilityState={{ disabled: !mergeEnabled }}
          accessibilityLabel={
            mergeEnabled
              ? "Merge the two selected searches into one"
              : "Merge unavailable for this selection"
          }
          style={({ pressed }) => [
            styles.dockAccentBtn,
            !mergeEnabled && styles.dockActionBtnDisabled,
            pressed && mergeEnabled && styles.pressed,
          ]}
        >
          <Text
            style={[styles.dockAccentBtnText, !mergeEnabled && styles.dockActionBtnTextDisabled]}
          >
            Merge
          </Text>
        </Pressable>

        <Pressable
          onPress={onDeletePress}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${plural(selectedCount, "search")}`}
          style={({ pressed }) => [styles.dockDangerBtn, pressed && styles.pressed]}
        >
          <Text style={styles.dockDangerBtnText}>Delete</Text>
        </Pressable>
      </View>

      {mixedPauseState ? (
        <Text style={styles.dockNote}>
          Select only active or only paused searches to pause or resume them together.
        </Text>
      ) : mergeBlocked ? (
        <Text style={styles.dockNote}>
          These two searches are in different categories — merge needs a matching category.
        </Text>
      ) : null}
    </View>
  );
}

function RecoveryRow({
  removedCount,
  onUndo,
  onDismiss,
}: {
  removedCount: number;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  return (
    <View style={styles.recoveryRow}>
      <Text style={styles.recoveryText}>{`${plural(removedCount, "saved search")} deleted`}</Text>
      <View style={styles.recoveryActions}>
        <Pressable
          onPress={onUndo}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Undo delete"
          style={({ pressed }) => [styles.recoveryBtn, pressed && styles.pressed]}
        >
          <Text style={styles.recoveryBtnText}>Undo</Text>
        </Pressable>
        <Pressable
          onPress={onDismiss}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={({ pressed }) => [styles.recoveryDismiss, pressed && styles.pressed]}
        >
          <Text style={styles.recoveryDismissText}>Dismiss</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function SavedSearchManagerScreen() {
  const [searches, setSearches] = useState<SavedSearch[]>(INITIAL_SAVED_SEARCHES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dockMode, setDockMode] = useState<DockMode>("actions");
  const [pendingUndo, setPendingUndo] = useState<UndoEntry | null>(null);
  const [liveMessage, setLiveMessage] = useState<string>("");

  const selectedCount = selectedIds.length;
  const selectedItems = useMemo(
    () => searches.filter((s) => selectedIds.includes(s.id)),
    [searches, selectedIds],
  );

  const allSelectedActive = selectedCount > 0 && selectedItems.every((s) => !s.paused);
  const allSelectedPaused = selectedCount > 0 && selectedItems.every((s) => s.paused);
  const mixedPauseState = selectedCount > 0 && !allSelectedActive && !allSelectedPaused;
  const pauseLabel: "Pause" | "Resume" = allSelectedPaused ? "Resume" : "Pause";
  const pauseEnabled = allSelectedActive || allSelectedPaused;

  const mergeEnabled =
    selectedCount === 2 && canMergePair(selectedItems[0], selectedItems[1]);
  const mergeBlocked = selectedCount === 2 && !mergeEnabled;

  const activeCount = searches.filter((s) => !s.paused).length;
  const pausedCount = searches.filter((s) => s.paused).length;
  const totalNewMatches = searches
    .filter((s) => !s.paused)
    .reduce((sum, s) => sum + s.newMatchesCount, 0);

  const toggleSelect = (id: string) => {
    setPendingUndo(null);
    setDockMode("actions");
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setLiveMessage(
        next.length === 0 ? "Selection cleared." : `${plural(next.length, "search")} selected.`,
      );
      return next;
    });
  };

  const cancelSelection = () => {
    setSelectedIds([]);
    setDockMode("actions");
    setLiveMessage("Selection cleared.");
  };

  const pauseOrResumeSelected = () => {
    if (!pauseEnabled) return;
    const toPause = !allSelectedPaused;
    setSearches((prev) =>
      prev.map((s) => (selectedIds.includes(s.id) ? { ...s, paused: toPause } : s)),
    );
    setLiveMessage(
      `${plural(selectedCount, "search")} ${toPause ? "paused" : "resumed"}.`,
    );
    setSelectedIds([]);
  };

  const mergeSelected = () => {
    if (!mergeEnabled) return;
    const [a, b] = selectedItems;
    const merged = buildMergedSearch(a, b);
    setSearches((prev) => [merged, ...prev.filter((s) => s.id !== a.id && s.id !== b.id)]);
    setLiveMessage(`Merged "${a.title}" and "${b.title}" into one search.`);
    setSelectedIds([]);
  };

  const requestDelete = () => {
    setDockMode("confirmDelete");
    setLiveMessage(
      `Delete ${plural(selectedCount, "saved search")}? Confirm to remove them, or cancel.`,
    );
  };

  const cancelDelete = () => {
    setDockMode("actions");
    setLiveMessage("Delete cancelled.");
  };

  const confirmDelete = () => {
    const previous = searches;
    const removedCount = selectedIds.length;
    setSearches((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
    setPendingUndo({ previous, removedCount });
    setSelectedIds([]);
    setDockMode("actions");
    setLiveMessage(`${plural(removedCount, "saved search")} deleted.`);
  };

  const undoDelete = () => {
    if (!pendingUndo) return;
    setSearches(pendingUndo.previous);
    setPendingUndo(null);
    setLiveMessage("Delete undone.");
  };

  const dismissUndo = () => {
    setPendingUndo(null);
    setLiveMessage("");
  };

  const header = (
    <View style={styles.header}>
      <Text style={styles.h1} accessibilityRole="header">
        Saved Searches
      </Text>
      <Text style={styles.sub}>
        {plural(activeCount, "active search")} · {plural(pausedCount, "paused")} ·{" "}
        {plural(totalNewMatches, "new match")}
      </Text>

      <View accessibilityLiveRegion="polite" style={styles.announcer}>
        {liveMessage ? (
          <Text accessibilityRole="alert" style={styles.announcerText}>
            {liveMessage}
          </Text>
        ) : null}
      </View>
    </View>
  );

  const empty = (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyText}>
        No saved searches yet. Save a search from any listing feed to get notified when new
        matches appear.
      </Text>
      <Pressable
        onPress={() => {}}
        accessibilityRole="button"
        accessibilityLabel="Browse listings"
        style={({ pressed }) => [styles.emptyBtn, pressed && styles.pressed]}
      >
        <Text style={styles.emptyBtnText}>Browse Listings</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={searches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SearchRow
            item={item}
            selected={selectedIds.includes(item.id)}
            onToggle={toggleSelect}
          />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {selectedCount > 0 ? (
        <SelectionDock
          mode={dockMode}
          selectedCount={selectedCount}
          pauseLabel={pauseLabel}
          pauseEnabled={pauseEnabled}
          mixedPauseState={mixedPauseState}
          mergeEnabled={mergeEnabled}
          mergeBlocked={mergeBlocked}
          onCancelSelection={cancelSelection}
          onPauseResume={pauseOrResumeSelected}
          onMerge={mergeSelected}
          onDeletePress={requestDelete}
          onConfirmDelete={confirmDelete}
          onCancelDelete={cancelDelete}
        />
      ) : pendingUndo ? (
        <RecoveryRow
          removedCount={pendingUndo.removedCount}
          onUndo={undoDelete}
          onDismiss={dismissUndo}
        />
      ) : null}
    </SafeAreaView>
  );
}

export default SavedSearchManagerScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(8),
  },

  header: {
    paddingTop: tokens.space(6),
    paddingBottom: tokens.space(3),
  },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: tokens.space(1), fontSize: 13, color: tokens.color.faint },

  announcer: { marginTop: tokens.space(3) },
  announcerText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginTop: tokens.space(3),
    minHeight: 44,
  },
  searchRowSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  pressed: { opacity: 0.8 },

  checkDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(1),
  },
  checkDotOn: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  checkMark: { color: tokens.color.onAccent, fontSize: 13, fontWeight: "700" },

  rowBody: { flex: 1, gap: 3 },
  rowTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink, lineHeight: 20 },
  rowMeta: { fontSize: 12, color: tokens.color.muted },
  rowChecked: { fontSize: 11, color: tokens.color.faint, marginTop: 2 },

  rowStatus: { alignItems: "flex-end", justifyContent: "center", minWidth: 84 },
  matchPill: {
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
  },
  matchPillText: { color: tokens.color.onAccent, fontSize: 11, fontWeight: "700" },
  pausedPill: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
  },
  pausedPillText: { color: tokens.color.faint, fontSize: 11, fontWeight: "700" },
  noMatchText: { color: tokens.color.faint, fontSize: 11, textAlign: "right" },

  emptyWrap: {
    marginTop: tokens.space(8),
    paddingVertical: tokens.space(8),
    alignItems: "center",
    gap: tokens.space(4),
  },
  emptyText: {
    fontSize: 13,
    color: tokens.color.faint,
    textAlign: "center",
    maxWidth: 280,
  },
  emptyBtn: {
    minHeight: 44,
    paddingHorizontal: tokens.space(5),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBtnText: { color: tokens.color.onInk, fontSize: 14, fontWeight: "700" },

  // Selection-driven dock — mounted only while selectedCount > 0 (SavedSearchManagerScreen).
  dock: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
  },
  dockTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dockCancel: { minHeight: 44, justifyContent: "center" },
  dockCancelText: { fontSize: 14, fontWeight: "500", color: tokens.color.muted },
  dockCount: { fontSize: 13, fontWeight: "700", color: tokens.color.ink },

  dockActionsRow: {
    flexDirection: "row",
    gap: tokens.space(2),
    marginTop: tokens.space(2),
  },
  dockActionBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  dockActionBtnDisabled: { backgroundColor: tokens.color.border },
  dockActionBtnText: { color: tokens.color.onInk, fontSize: 13, fontWeight: "700" },
  dockActionBtnTextDisabled: { color: tokens.color.faint },

  dockAccentBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  dockAccentBtnText: { color: tokens.color.onAccent, fontSize: 13, fontWeight: "700" },

  dockDangerBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  dockDangerBtnText: { color: tokens.color.onAccent, fontSize: 13, fontWeight: "700" },

  dockSecondaryBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  dockSecondaryBtnText: { color: tokens.color.ink2, fontSize: 14, fontWeight: "700" },

  dockNote: {
    marginTop: tokens.space(3),
    fontSize: 12,
    color: tokens.color.faint,
  },

  dockConfirmText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  dockConfirmRow: { flexDirection: "row", gap: tokens.space(2) },

  // Post-delete recovery row — mutually exclusive with the dock (render order in the screen
  // guarantees only one of the two is ever mounted at a time).
  recoveryRow: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.ink,
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recoveryText: { color: tokens.color.onInk, fontSize: 13 },
  recoveryActions: { flexDirection: "row", alignItems: "center", gap: tokens.space(4) },
  recoveryBtn: { minHeight: 44, justifyContent: "center" },
  recoveryBtnText: { color: tokens.color.onInk, fontSize: 13, fontWeight: "700" },
  recoveryDismiss: { minHeight: 44, justifyContent: "center" },
  recoveryDismissText: { color: tokens.color.onInkMuted, fontSize: 13 },
});
