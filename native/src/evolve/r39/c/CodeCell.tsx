// native/src/evolve/r39/c/CodeCell.tsx
//
// One fixed-size cell in the backup-codes grid. Purely presentational and
// non-interactive (no Pressable here — there is nothing to tap per code),
// so it is safe to mark the whole cell `accessible` with one combined
// label instead of letting a screen reader walk its child Text nodes one
// at a time.

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { tokens } from "../../../tokens";
import type { BackupCode } from "./data";

interface CodeCellProps {
  entry: BackupCode;
  position: number;
  total: number;
}

export function CodeCell({ entry, position, total }: CodeCellProps) {
  const statusWord = entry.used ? "Used" : "Available";
  const label = `Backup code ${position} of ${total}: ${entry.code}. ${statusWord}.`;

  return (
    <View
      style={[styles.cell, entry.used ? styles.cellUsed : styles.cellAvailable]}
      accessible
      accessibilityLabel={label}
    >
      <Text
        style={[styles.codeText, entry.used && styles.codeTextUsed]}
        // Text is already folded into the parent's accessibilityLabel.
        importantForAccessibility="no"
      >
        {entry.code}
      </Text>
      <View
        style={[
          styles.statusPill,
          entry.used ? styles.statusPillUsed : styles.statusPillAvailable,
        ]}
        importantForAccessibility="no"
      >
        <Text
          style={[
            styles.statusText,
            entry.used ? styles.statusTextUsed : styles.statusTextAvailable,
          ]}
        >
          {statusWord}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: "48%",
    minHeight: 88,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    marginBottom: tokens.space(3),
    justifyContent: "space-between",
  },
  cellAvailable: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  cellUsed: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
    opacity: 0.6,
  },
  codeText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1.5,
    color: tokens.color.ink,
    ...Platform.select({
      ios: { fontFamily: "Menlo" },
      android: { fontFamily: "monospace" },
      default: {},
    }),
  },
  codeTextUsed: {
    color: tokens.color.muted,
  },
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
    marginTop: tokens.space(2),
  },
  statusPillAvailable: {
    backgroundColor: tokens.color.successBg,
  },
  statusPillUsed: {
    backgroundColor: tokens.color.border,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextAvailable: {
    color: tokens.color.success,
  },
  statusTextUsed: {
    color: tokens.color.muted,
  },
});
