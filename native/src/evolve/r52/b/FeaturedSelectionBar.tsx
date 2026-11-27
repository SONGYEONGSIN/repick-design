// native/src/evolve/r52/b/FeaturedSelectionBar.tsx
//
// The selection-count-derived contextual bar, mounted by the caller only
// while featuredCount > 0 — never an independent open/closed flag. It adds
// two things CombineShipments's bar form didn't need: a *cap* (so the
// count sentence must describe "N of CAP" and explain itself once full,
// not just "you have N selected") and *unsaved-draft* framing (so a Save
// action — and a destructive discard of that draft — lives here instead of
// an immediate commit-on-confirm).
//
// The discard confirm reuses the sanctioned flip — Cancel/Confirm swapped
// into this same already-`polite` container — rather than a native Alert.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";

export type BarPhase = "editing" | "confirmingDiscard";

type Props = {
  announcement: string;
  phase: BarPhase;
  hasUnsavedChanges: boolean;
  canSave: boolean;
  onRequestDiscard: () => void;
  onCancelDiscard: () => void;
  onConfirmDiscard: () => void;
  onSave: () => void;
};

export function FeaturedSelectionBar({
  announcement,
  phase,
  hasUnsavedChanges,
  canSave,
  onRequestDiscard,
  onCancelDiscard,
  onConfirmDiscard,
  onSave,
}: Props) {
  return (
    <View style={styles.bar} accessibilityLiveRegion="polite">
      <Text accessibilityRole="alert" style={styles.announceLine}>
        {announcement}
      </Text>

      {phase === "confirmingDiscard" ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={onCancelDiscard}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            accessibilityHint="Keeps your unsaved featured changes as they are."
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
          >
            <Text style={styles.secondaryButtonLabel}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={onConfirmDiscard}
            accessibilityRole="button"
            accessibilityLabel="Discard changes"
            accessibilityHint="Restores the last saved featured selection and order."
            style={({ pressed }) => [styles.dangerButton, pressed && styles.dangerButtonPressed]}
          >
            <Text style={styles.dangerButtonLabel}>Discard</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <Pressable
            onPress={onRequestDiscard}
            disabled={!hasUnsavedChanges}
            accessibilityRole="button"
            accessibilityLabel="Discard unsaved changes"
            accessibilityState={{ disabled: !hasUnsavedChanges }}
            accessibilityHint={
              hasUnsavedChanges ? "Opens a confirmation step before reverting your changes." : undefined
            }
            style={({ pressed }) => [
              styles.secondaryButton,
              !hasUnsavedChanges && styles.secondaryButtonDisabled,
              pressed && hasUnsavedChanges && styles.secondaryButtonPressed,
            ]}
          >
            <Text
              style={[styles.secondaryButtonLabel, !hasUnsavedChanges && styles.secondaryButtonLabelDisabled]}
            >
              Reset
            </Text>
          </Pressable>
          <Pressable
            onPress={onSave}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityLabel="Save featured items"
            accessibilityState={{ disabled: !canSave }}
            accessibilityHint={canSave ? "Publishes this featured selection and order to your storefront." : undefined}
            style={({ pressed }) => [
              styles.primaryButton,
              !canSave && styles.primaryButtonDisabled,
              pressed && canSave && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonLabel}>Save</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  announceLine: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
    fontVariant: ["tabular-nums"],
  },
  actionRow: {
    flexDirection: "row",
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    flex: 1,
    marginRight: tokens.space(3),
  },
  secondaryButtonDisabled: {
    opacity: 0.45,
  },
  secondaryButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  secondaryButtonLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  secondaryButtonLabelDisabled: {
    color: tokens.color.faint,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    flex: 1,
  },
  primaryButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  primaryButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  primaryButtonLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  dangerButton: {
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    flex: 1,
  },
  dangerButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  dangerButtonLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});

export default FeaturedSelectionBar;
