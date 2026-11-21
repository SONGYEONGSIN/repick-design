// native/src/evolve/r52/a/DropFactRow.tsx
//
// One label/value row in the drop-facts list. Split out per the file-per-
// concern convention (see evolve/r51/b) even though the list is short today
// — it's exactly the kind of row set that could grow (more facts added to a
// drop) and so stays behind FlatList + its own renderItem component rather
// than an inline .map().

import { View, Text, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import type { DropFact } from "./data";

export function DropFactRow({ fact }: { fact: DropFact }) {
  return (
    <View style={styles.row} accessibilityLabel={`${fact.label}: ${fact.value}`}>
      <Text style={styles.label}>{fact.label}</Text>
      <Text style={styles.value}>{fact.value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: tokens.space(2.5),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    minHeight: 44,
  },
  label: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  value: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
});
