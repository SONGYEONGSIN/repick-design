// native/src/evolve/r39/c/BackupCodesScreen.tsx
//
// Two-Factor Backup Codes — account security screen.
//
// Macro layout: the 8 codes are NOT a list. They sit in a fixed 2-column
// wrapped grid built from plain `View`s with `flexWrap: "wrap"` — every
// cell is the same size whether its code is used or not.
//
// Band mechanic: "Regenerate Codes" is a single global, destructive,
// one-shot action (it replaces all 8 codes at once, not one row at a
// time). There is no native Alert. The bottom band itself swaps its own
// contents in place: idle button -> inline Cancel/Confirm row -> a
// "regenerated" confirmation state. The whole band lives inside ONE
// container carrying accessibilityLiveRegion="polite" for the entire
// screen, and the confirmation/result text inside it carries
// accessibilityRole="alert" so that same live region announces both the
// "are you sure" prompt and the eventual "codes regenerated" result.

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { CodeCell } from "./CodeCell";
import {
  currentBackupCodes,
  refreshedBackupCodes,
  totalCodeCount,
  countUnused,
  type BackupCode,
} from "./data";

type BandPhase = "idle" | "confirming" | "justRegenerated";

export function BackupCodesScreen() {
  const [codes, setCodes] = useState<BackupCode[]>(currentBackupCodes);
  const [bandPhase, setBandPhase] = useState<BandPhase>("idle");

  const unusedCount = countUnused(codes);

  const handleRegeneratePress = useCallback(() => {
    setBandPhase("confirming");
  }, []);

  const handleCancel = useCallback(() => {
    setBandPhase("idle");
  }, []);

  const handleConfirmRegenerate = useCallback(() => {
    setCodes(refreshedBackupCodes);
    setBandPhase("justRegenerated");
  }, []);

  const handleDismissResult = useCallback(() => {
    setBandPhase("idle");
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text accessibilityRole="header" style={styles.heading}>
          Two-Factor Backup Codes
        </Text>
        <Text style={styles.subheading}>
          Use one of these codes to sign in if you lose access to your
          regular two-factor method. Each code works exactly once.
        </Text>

        <Text style={styles.remainingLine}>
          {unusedCount} of {totalCodeCount} codes still available
        </Text>

        <View style={styles.grid}>
          {codes.map((entry, index) => (
            <CodeCell
              key={entry.id}
              entry={entry}
              position={index + 1}
              total={codes.length}
            />
          ))}
        </View>

        <Text style={styles.footnote}>
          Store these codes somewhere safe, such as a password manager.
          Repick never shows a used code's original value again.
        </Text>
      </ScrollView>

      <View
        style={styles.band}
        accessibilityLiveRegion="polite"
      >
        {bandPhase === "idle" && (
          <Pressable
            onPress={handleRegeneratePress}
            accessibilityRole="button"
            accessibilityLabel="Regenerate codes"
            accessibilityHint="Shows a confirmation step before any codes are changed."
            style={({ pressed }) => [
              styles.dangerButton,
              pressed && styles.dangerButtonPressed,
            ]}
          >
            <Text style={styles.dangerButtonText}>Regenerate Codes</Text>
          </Pressable>
        )}

        {bandPhase === "confirming" && (
          <View style={styles.confirmBlock}>
            <Text accessibilityRole="alert" style={styles.confirmPrompt}>
              Regenerate all {totalCodeCount} codes? Your current codes,
              used and unused, will stop working immediately. This cannot
              be undone.
            </Text>
            <View style={styles.confirmRow}>
              <Pressable
                onPress={handleCancel}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                accessibilityHint="Returns without changing any codes."
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.cancelButtonPressed,
                ]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirmRegenerate}
                accessibilityRole="button"
                accessibilityLabel="Confirm regenerate"
                accessibilityHint="Invalidates all current codes and replaces them with a new set."
                style={({ pressed }) => [
                  styles.confirmButton,
                  pressed && styles.confirmButtonPressed,
                ]}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        )}

        {bandPhase === "justRegenerated" && (
          <View style={styles.resultBlock}>
            <Text accessibilityRole="alert" style={styles.resultText}>
              All {totalCodeCount} codes regenerated. Your previous codes
              are now invalid.
            </Text>
            <Pressable
              onPress={handleDismissResult}
              accessibilityRole="button"
              accessibilityLabel="Done"
              accessibilityHint="Closes this confirmation and returns to the regenerate action."
              style={({ pressed }) => [
                styles.doneButton,
                pressed && styles.doneButtonPressed,
              ]}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  subheading: {
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
    marginBottom: tokens.space(4),
  },
  remainingLine: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  footnote: {
    fontSize: 12,
    color: tokens.color.faint,
    lineHeight: 17,
    marginTop: tokens.space(1),
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(5),
  },
  dangerButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(3),
  },
  dangerButtonPressed: {
    opacity: 0.85,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.danger,
  },
  confirmBlock: {
    gap: tokens.space(3),
  },
  confirmPrompt: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink,
  },
  confirmRow: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  cancelButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(3),
  },
  cancelButtonPressed: {
    opacity: 0.7,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  confirmButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.danger,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(3),
  },
  confirmButtonPressed: {
    opacity: 0.85,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  resultBlock: {
    gap: tokens.space(3),
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink,
    fontWeight: "600",
  },
  doneButton: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(3),
  },
  doneButtonPressed: {
    opacity: 0.7,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
});
