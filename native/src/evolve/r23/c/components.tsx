// native/src/evolve/r23/c/components.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import type { ListingPhoto } from "./data";

const SWATCHES = [tokens.color.swatch1, tokens.color.swatch2, tokens.color.swatch3] as const;

// ---------------------------------------------------------------------------
// Grid cell for one uploaded photo
// ---------------------------------------------------------------------------
export function PhotoCell({
  photo,
  selected,
  onToggle,
}: {
  photo: ListingPhoto;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const swatch = SWATCHES[photo.swatchIndex];
  const stateWords = [
    photo.isCover ? "current cover photo" : null,
    selected ? "selected" : null,
  ]
    .filter(Boolean)
    .join(", ");
  const label = `Photo ${photo.order}, ${photo.label}${stateWords ? `, ${stateWords}` : ""}`;

  return (
    <View style={styles.cellOuter}>
      <Pressable
        onPress={() => onToggle(photo.id)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected }}
        style={({ pressed }) => [
          styles.cell,
          { backgroundColor: swatch },
          selected && styles.cellSelected,
          pressed && styles.cellPressed,
        ]}
      >
        <View style={styles.cellTopRow}>
          {photo.isCover ? (
            <View style={styles.coverBadge}>
              <Text style={styles.coverBadgeText}>Cover</Text>
            </View>
          ) : (
            <View />
          )}
          <View
            style={[styles.checkCircle, selected && styles.checkCircleOn]}
          >
            {selected ? <Text style={styles.checkMark}>✓</Text> : null}
          </View>
        </View>
        <Text style={styles.orderText}>{photo.order}</Text>
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Trailing "add photo" tile — placeholder only, no real upload behind it
// ---------------------------------------------------------------------------
export function AddPhotoCell({ remaining }: { remaining: number }) {
  return (
    <View style={styles.cellOuter}>
      <Pressable
        onPress={() => {}}
        accessibilityRole="button"
        accessibilityLabel={`Add photo, ${remaining} slot${remaining === 1 ? "" : "s"} remaining`}
        style={({ pressed }) => [
          styles.cell,
          styles.addCell,
          pressed && styles.cellPressed,
        ]}
      >
        <Text style={styles.addPlus}>+</Text>
        <Text style={styles.addLabel}>Add photo</Text>
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Selection-driven contextual bar — mounted only while selectedCount > 0
// ---------------------------------------------------------------------------
export function ContextualBar({
  selectedCount,
  canSetCover,
  onSetCover,
  onDelete,
  onCancel,
}: {
  selectedCount: number;
  canSetCover: boolean;
  onSetCover: () => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  return (
    <View style={styles.bar}>
      <Pressable
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel="Cancel selection"
        style={({ pressed }) => [styles.barCancel, pressed && styles.cellPressed]}
      >
        <Text style={styles.barCancelText}>Cancel</Text>
      </Pressable>

      <View style={styles.barActions}>
        <Pressable
          onPress={onSetCover}
          disabled={!canSetCover}
          accessibilityRole="button"
          accessibilityLabel="Set as cover photo"
          accessibilityState={{ disabled: !canSetCover }}
          style={({ pressed }) => [
            styles.barButton,
            !canSetCover && styles.barButtonDisabled,
            pressed && canSetCover && styles.cellPressed,
          ]}
        >
          <Text
            style={[
              styles.barButtonText,
              !canSetCover && styles.barButtonTextDisabled,
            ]}
          >
            Set as cover
          </Text>
        </Pressable>

        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${selectedCount} selected photo${selectedCount === 1 ? "" : "s"}`}
          style={({ pressed }) => [
            styles.barButton,
            styles.barButtonDanger,
            pressed && styles.cellPressed,
          ]}
        >
          <Text style={styles.barButtonDangerText}>{`Delete ${selectedCount}`}</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Post-delete undo overlay — mounted only while the bar is NOT (mutually
// exclusive bottom surfaces; the screen renders at most one of the two)
// ---------------------------------------------------------------------------
export function UndoStrip({
  count,
  onUndo,
  onDismiss,
}: {
  count: number;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  return (
    <View style={styles.undoStrip}>
      <Text style={styles.undoText}>{`${count} photo${count === 1 ? "" : "s"} deleted`}</Text>
      <View style={styles.undoActions}>
        <Pressable
          onPress={onUndo}
          accessibilityRole="button"
          accessibilityLabel="Undo delete"
          style={({ pressed }) => [styles.undoButton, pressed && styles.cellPressed]}
        >
          <Text style={styles.undoButtonText}>Undo</Text>
        </Pressable>
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={({ pressed }) => [styles.undoDismiss, pressed && styles.cellPressed]}
        >
          <Text style={styles.undoDismissText}>Dismiss</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cellOuter: {
    flex: 1 / 3,
    padding: tokens.space(1),
  },
  cell: {
    aspectRatio: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.space(2),
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "transparent",
  },
  cellSelected: {
    borderColor: tokens.color.accent,
  },
  cellPressed: {
    opacity: 0.85,
  },
  cellTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  coverBadge: {
    backgroundColor: tokens.color.ink,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  coverBadgeText: {
    color: tokens.color.onInk,
    fontSize: 11,
    fontWeight: "600",
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1.5,
    borderColor: tokens.color.onInkMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleOn: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  checkMark: {
    color: tokens.color.onAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  orderText: {
    alignSelf: "flex-start",
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "700",
    backgroundColor: "rgba(24,24,27,0.55)",
    paddingHorizontal: tokens.space(1.5),
    paddingVertical: 2,
    borderRadius: tokens.radius.sm,
  },
  addCell: {
    borderWidth: 2,
    borderColor: tokens.color.border,
    borderStyle: "dashed",
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  addPlus: {
    fontSize: 26,
    color: tokens.color.faint,
    fontWeight: "300",
  },
  addLabel: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  bar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  barCancel: {
    paddingVertical: tokens.space(2),
    paddingRight: tokens.space(3),
  },
  barCancelText: {
    color: tokens.color.muted,
    fontSize: 14,
    fontWeight: "500",
  },
  barActions: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  barButton: {
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.ink,
  },
  barButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  barButtonText: {
    color: tokens.color.onInk,
    fontSize: 14,
    fontWeight: "600",
  },
  barButtonTextDisabled: {
    color: tokens.color.faint,
  },
  barButtonDanger: {
    backgroundColor: tokens.color.danger,
  },
  barButtonDangerText: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "600",
  },
  undoStrip: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.ink,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  undoText: {
    color: tokens.color.onInk,
    fontSize: 13,
  },
  undoActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  undoButton: {
    paddingVertical: tokens.space(1),
  },
  undoButtonText: {
    color: tokens.color.accent,
    fontSize: 13,
    fontWeight: "700",
  },
  undoDismiss: {
    paddingVertical: tokens.space(1),
  },
  undoDismissText: {
    color: tokens.color.onInkMuted,
    fontSize: 13,
  },
});
