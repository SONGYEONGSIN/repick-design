// native/src/evolve/r27/b/BlockedUsersScreen.tsx
//
// Blocked Users — a list of buyers/sellers the account holder has blocked
// from messaging or bidding on their listings. Bottom-band doctrine form #3
// (selection-driven contextual bar): the bar is absent at selection-count 0
// and mounts only once 1+ rows are selected.
//
// Domain-specific derived state layered on top of plain selection count:
// blocks come in two kinds — "manual" (the user blocked them directly) and
// "platform" (Trust & Safety enforced the block after a confirmed report).
// Only manual blocks can be lifted from this screen, so the bulk Unblock
// action is disabled whenever the current selection includes ANY
// platform-enforced block, not just when selection count is 0.
//
// The Unblock action also requires an explicit confirm step (destructive —
// it restores another user's ability to contact this account), implemented
// as a second tap inside the same bar rather than a native Alert. After a
// confirmed unblock, the selection bar unmounts (count returns to 0) and a
// separate, mutually-exclusive undo band takes its place — the two are
// never mounted at the same time.
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
  blockedUsers as initialBlockedUsers,
  isSelfLiftable,
  roleLabel,
  type BlockedUser,
} from "./data";

type BarMode = "selecting" | "confirmUnblock";

interface UndoInfo {
  ids: string[];
  names: string[];
}

export default function BlockedUsersScreen() {
  const [users, setUsers] = useState<BlockedUser[]>(initialBlockedUsers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [notedIds, setNotedIds] = useState<Set<string>>(new Set());
  const [barMode, setBarMode] = useState<BarMode>("selecting");
  const [undoInfo, setUndoInfo] = useState<UndoInfo | null>(null);

  const selectedUsers = useMemo(
    () => users.filter((u) => selectedIds.has(u.id)),
    [users, selectedIds]
  );
  const selectedCount = selectedIds.size;
  const hasNonLiftableSelected = useMemo(
    () => selectedUsers.some((u) => !isSelfLiftable(u)),
    [selectedUsers]
  );
  const canUnblock = selectedCount > 0 && !hasNonLiftableSelected;

  const manualCount = useMemo(
    () => users.filter((u) => u.reason === "manual").length,
    [users]
  );
  const platformCount = users.length - manualCount;

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // Composition changed — never leave a stale confirm prompt standing.
    setBarMode("selecting");
  }

  function clearSelection() {
    setSelectedIds(new Set());
    setBarMode("selecting");
  }

  function handleTagAsNoted() {
    setNotedIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(id));
      return next;
    });
    clearSelection();
  }

  function handlePressUnblock() {
    if (!canUnblock) return;
    setBarMode("confirmUnblock");
  }

  function handleConfirmUnblock() {
    const ids = selectedUsers.map((u) => u.id);
    const names = selectedUsers.map((u) => u.displayName);
    setUsers((prev) => prev.filter((u) => !selectedIds.has(u.id)));
    setSelectedIds(new Set());
    setBarMode("selecting");
    setUndoInfo({ ids, names });
  }

  function handleCancelConfirm() {
    setBarMode("selecting");
  }

  function handleUndo() {
    if (!undoInfo) return;
    const restoreIds = new Set(undoInfo.ids);
    setUsers((prev) => {
      const restored = initialBlockedUsers.filter((u) => restoreIds.has(u.id));
      const merged = [...prev, ...restored];
      // Keep the screen's original, stable row order.
      return initialBlockedUsers.filter((u) =>
        merged.some((m) => m.id === u.id)
      );
    });
    setUndoInfo(null);
  }

  function handleDismissUndo() {
    setUndoInfo(null);
  }

  const summaryText =
    barMode === "confirmUnblock"
      ? `Unblock ${selectedCount} ${
          selectedCount === 1 ? "user" : "users"
        }? They will be able to message you and bid on your listings again.`
      : hasNonLiftableSelected
      ? `${selectedCount} selected · Unblock unavailable — includes a Trust & Safety enforced block`
      : `${selectedCount} selected`;

  const showSelectionBar = selectedCount > 0;
  const showUndoBand = !showSelectionBar && undoInfo !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Blocked Users
        </Text>
        <Text style={styles.subtitle}>
          People who can't message you or bid on your listings.
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total blocked</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statNumber}>{manualCount}</Text>
            <Text style={styles.statLabel}>Manual</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statNumber}>{platformCount}</Text>
            <Text style={styles.statLabel}>Platform-enforced</Text>
          </View>
        </View>
        <Text style={styles.helperText}>
          Select one or more users below to tag them or lift a manual block.
        </Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const selected = selectedIds.has(item.id);
          const noted = notedIds.has(item.id);
          const liftable = isSelfLiftable(item);
          return (
            <Pressable
              onPress={() => toggleSelect(item.id)}
              style={({ pressed }) => [
                styles.row,
                selected && styles.rowSelected,
                pressed && styles.rowPressed,
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${item.displayName}, ${roleLabel(
                item.role
              )}, ${
                liftable ? "manual block" : "platform-enforced block"
              }, ${item.blockedOnLabel}${noted ? ", tagged as noted" : ""}`}
              accessibilityHint="Double tap to select this user for a bulk action."
            >
              <View
                style={[styles.checkbox, selected && styles.checkboxChecked]}
              >
                {selected ? (
                  <Text style={styles.checkboxMark}>{"✓"}</Text>
                ) : null}
              </View>

              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>{item.initial}</Text>
              </View>

              <View style={styles.rowBody}>
                <Text style={styles.rowName}>{item.displayName}</Text>
                <Text style={styles.rowMeta}>
                  {roleLabel(item.role)} {"·"} {item.blockedOnLabel}
                </Text>
                <Text style={styles.rowDetail}>{item.reasonDetail}</Text>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.badge,
                      liftable ? styles.badgeManual : styles.badgePlatform,
                    ]}
                  >
                    <Text
                      style={
                        liftable
                          ? styles.badgeManualText
                          : styles.badgePlatformText
                      }
                    >
                      {liftable ? "Manual" : "Platform-enforced"}
                    </Text>
                  </View>
                  {noted ? (
                    <View style={[styles.badge, styles.badgeNoted]}>
                      <Text style={styles.badgeNotedText}>Noted</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
          );
        }}
      />

      {showSelectionBar ? (
        <View
          style={styles.selectionBar}
          accessibilityLiveRegion="polite"
        >
          <View style={styles.selectionBarTopRow}>
            <Pressable
              onPress={clearSelection}
              style={styles.clearButton}
              accessibilityRole="button"
              accessibilityLabel="Clear selection"
              accessibilityHint="Deselects all selected users."
            >
              <Text style={styles.clearButtonText}>{"✕"}</Text>
            </Pressable>
            <Text
              style={styles.selectionSummary}
              accessibilityRole="alert"
            >
              {summaryText}
            </Text>
          </View>

          {barMode === "confirmUnblock" ? (
            <View style={styles.actionRow}>
              <Pressable
                onPress={handleCancelConfirm}
                style={[styles.actionButton, styles.secondaryButton]}
                accessibilityRole="button"
                accessibilityLabel="Cancel unblock"
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirmUnblock}
                style={[styles.actionButton, styles.primaryButton]}
                accessibilityRole="button"
                accessibilityLabel="Confirm unblock"
                accessibilityHint="Removes the block so these users can contact you again."
              >
                <Text style={styles.primaryButtonText}>Confirm Unblock</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.actionRow}>
              <Pressable
                onPress={handleTagAsNoted}
                style={[styles.actionButton, styles.secondaryButton]}
                accessibilityRole="button"
                accessibilityLabel="Tag selected users as noted"
                accessibilityHint="Applies a Noted tag to the selected users for your own reference."
              >
                <Text style={styles.secondaryButtonText}>Tag as Noted</Text>
              </Pressable>
              <Pressable
                onPress={handlePressUnblock}
                disabled={!canUnblock}
                style={[
                  styles.actionButton,
                  styles.primaryButton,
                  !canUnblock && styles.primaryButtonDisabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel={
                  canUnblock
                    ? `Unblock ${selectedCount} selected users`
                    : "Unblock unavailable for this selection"
                }
                accessibilityState={{ disabled: !canUnblock }}
                accessibilityHint={
                  canUnblock
                    ? "Opens a confirmation before lifting the block."
                    : "At least one selected user was blocked by Trust & Safety and can't be unblocked here."
                }
              >
                <Text
                  style={
                    canUnblock
                      ? styles.primaryButtonText
                      : styles.primaryButtonTextDisabled
                  }
                >
                  Unblock
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : null}

      {showUndoBand && undoInfo ? (
        <View style={styles.undoBand} accessibilityLiveRegion="polite">
          <Text style={styles.undoText} accessibilityRole="alert">
            {`Unblocked ${undoInfo.ids.length} ${
              undoInfo.ids.length === 1 ? "user" : "users"
            }.`}
          </Text>
          <View style={styles.undoActions}>
            <Pressable
              onPress={handleUndo}
              style={styles.undoButton}
              accessibilityRole="button"
              accessibilityLabel="Undo unblock"
              accessibilityHint="Restores the block on the users you just unblocked."
            >
              <Text style={styles.undoButtonText}>Undo</Text>
            </Pressable>
            <Pressable
              onPress={handleDismissUndo}
              style={styles.undoDismiss}
              accessibilityRole="button"
              accessibilityLabel="Dismiss"
            >
              <Text style={styles.undoDismissText}>{"✕"}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  statsRow: {
    flexDirection: "row",
    gap: tokens.space(2),
    marginTop: tokens.space(3),
  },
  statChip: {
    flex: 1,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "center",
  },
  helperText: {
    marginTop: tokens.space(3),
    fontSize: 12,
    color: tokens.color.faint,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(6),
  },
  separator: {
    height: tokens.space(2),
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  rowSelected: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  rowPressed: {
    opacity: 0.85,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
    marginTop: 2,
    backgroundColor: tokens.color.bg,
  },
  checkboxChecked: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  checkboxMark: {
    color: tokens.color.onAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  avatarLetter: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  rowBody: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  rowMeta: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.faint,
  },
  rowDetail: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  badgeRow: {
    flexDirection: "row",
    gap: tokens.space(1),
    marginTop: tokens.space(2),
  },
  badge: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: 3,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  badgeManual: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  badgeManualText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  badgePlatform: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  badgePlatformText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.warning,
  },
  badgeNoted: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  badgeNotedText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.success,
  },
  selectionBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  selectionBarTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.space(3),
  },
  clearButtonText: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  selectionSummary: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  actionRow: {
    flexDirection: "row",
    gap: tokens.space(2),
    marginTop: tokens.space(3),
  },
  actionButton: {
    flex: 1,
    paddingVertical: tokens.space(3),
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: tokens.color.accent,
  },
  primaryButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  primaryButtonTextDisabled: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  secondaryButton: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  undoBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
  },
  undoText: {
    flex: 1,
    fontSize: 13,
    color: tokens.color.ink,
  },
  undoActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  undoButton: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  undoButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  undoDismiss: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  undoDismissText: {
    fontSize: 12,
    color: tokens.color.faint,
  },
});
