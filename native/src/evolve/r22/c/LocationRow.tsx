// native/src/evolve/r22/c/LocationRow.tsx
import React, { useCallback } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import type { DropoffLocation } from "./data";

interface LocationRowProps {
  location: DropoffLocation;
  distanceLabel: string;
  closedToday: boolean;
  hoursLabel: string | null;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function LocationRow({
  location,
  distanceLabel,
  closedToday,
  hoursLabel,
  selected,
  onSelect,
}: LocationRowProps) {
  const handlePress = useCallback(() => {
    if (closedToday) return;
    onSelect(location.id);
  }, [closedToday, location.id, onSelect]);

  const accessibilityLabel = closedToday
    ? `${location.name}, ${distanceLabel} away, closed today, not selectable`
    : `${location.name}, ${distanceLabel} away, open today ${hoursLabel ?? ""}${
        selected ? ", selected" : ""
      }`;

  return (
    <Pressable
      onPress={handlePress}
      disabled={closedToday}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityState={{ disabled: closedToday, selected }}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.row,
        closedToday && styles.rowClosed,
        selected && styles.rowSelected,
        pressed && !closedToday && styles.rowPressed,
      ]}
    >
      <View style={styles.mainColumn}>
        <Text style={[styles.name, closedToday && styles.nameClosed]}>{location.name}</Text>
        <Text style={styles.subline}>
          {location.neighborhood} · {distanceLabel}
        </Text>
      </View>
      <View style={styles.statusColumn}>
        {closedToday ? (
          <View style={styles.closedTag}>
            <View style={styles.closedGlyph} />
            <Text style={styles.closedTagText}>Closed today</Text>
          </View>
        ) : (
          <Text style={styles.hoursText}>{hoursLabel}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    marginHorizontal: tokens.space(4),
    marginBottom: tokens.space(2),
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  rowSelected: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  rowPressed: {
    backgroundColor: tokens.color.border,
  },
  rowClosed: {
    borderStyle: "dashed",
    backgroundColor: tokens.color.bg,
    opacity: 0.6,
  },
  mainColumn: {
    flexShrink: 1,
    paddingRight: tokens.space(3),
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  nameClosed: {
    color: tokens.color.muted,
  },
  subline: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  statusColumn: {
    alignItems: "flex-end",
  },
  hoursText: {
    fontSize: 13,
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  closedTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
  },
  closedGlyph: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: tokens.color.faint,
    marginRight: tokens.space(1),
  },
  closedTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
  },
});
