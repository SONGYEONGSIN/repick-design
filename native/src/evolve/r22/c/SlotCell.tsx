// native/src/evolve/r22/c/SlotCell.tsx
import React, { useCallback } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import type { TimeSlot } from "./data";

interface SlotCellProps {
  slot: TimeSlot;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function SlotCell({ slot, selected, onSelect }: SlotCellProps) {
  const handlePress = useCallback(() => {
    if (!slot.available) return;
    onSelect(slot.id);
  }, [slot.available, slot.id, onSelect]);

  const accessibilityLabel = slot.available
    ? `${slot.label}${selected ? ", selected" : ""}`
    : `${slot.label}, fully booked`;

  return (
    <Pressable
      onPress={handlePress}
      disabled={!slot.available}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityState={{ disabled: !slot.available, selected }}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.cell,
        !slot.available && styles.cellFull,
        selected && styles.cellSelected,
        pressed && slot.available && styles.cellPressed,
      ]}
    >
      <Text
        style={[
          styles.cellTime,
          !slot.available && styles.cellTimeFull,
          selected && styles.cellTimeSelected,
        ]}
      >
        {slot.label}
      </Text>
      {!slot.available && <Text style={styles.cellNote}>Full</Text>}
      {selected && <Text style={styles.cellNoteSelected}>Selected</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    minWidth: 132,
    minHeight: 44,
    paddingVertical: tokens.space(2),
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    marginRight: tokens.space(2),
    marginBottom: tokens.space(2),
    alignItems: "center",
    justifyContent: "center",
  },
  cellPressed: {
    backgroundColor: tokens.color.border,
  },
  cellSelected: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  cellFull: {
    borderStyle: "dashed",
    opacity: 0.55,
  },
  cellTime: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  cellTimeFull: {
    color: tokens.color.muted,
    textDecorationLine: "line-through",
  },
  cellTimeSelected: {
    color: tokens.color.onAccent,
  },
  cellNote: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
  },
  cellNoteSelected: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.onAccent,
    textTransform: "uppercase",
  },
});
