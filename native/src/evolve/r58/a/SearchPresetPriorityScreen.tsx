// native/src/evolve/r58/a/SearchPresetPriorityScreen.tsx
//
// Search Preset Priority — when more than one saved search preset matches a new
// listing, this screen lets the buyer decide which preset "wins" for
// notification purposes, by setting an explicit priority order via up/down
// controls (no drag gesture — deterministic taps for screenshot verification).
//
// State model: `savedOrder` is the baseline as if loaded from the server,
// `workingOrder` is what the buyer is currently arranging. The bottom band is
// derived from a single comparison of the two — there is no separate "dirty"
// boolean to keep in sync.

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { PRESETS, INITIAL_SAVED_ORDER, PresetId } from "./data";

function ordersEqual(a: PresetId[], b: PresetId[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function swap(order: PresetId[], i: number, j: number): PresetId[] {
  const next = order.slice();
  const tmp = next[i];
  next[i] = next[j];
  next[j] = tmp;
  return next;
}

export default function SearchPresetPriorityScreen() {
  const [savedOrder, setSavedOrder] = useState<PresetId[]>(INITIAL_SAVED_ORDER);
  const [workingOrder, setWorkingOrder] = useState<PresetId[]>(INITIAL_SAVED_ORDER);

  // Single derived comparison — never a separately-tracked "isDirty" flag, so
  // it is always fresh against the live savedOrder/workingOrder state.
  const isDirty = useMemo(
    () => !ordersEqual(workingOrder, savedOrder),
    [workingOrder, savedOrder]
  );

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setWorkingOrder((prev) => swap(prev, index, index - 1));
  }, []);

  const moveDown = useCallback((index: number) => {
    setWorkingOrder((prev) => {
      if (index >= prev.length - 1) return prev;
      return swap(prev, index, index + 1);
    });
  }, []);

  const handleReset = useCallback(() => {
    setWorkingOrder(savedOrder);
  }, [savedOrder]);

  const handleSave = useCallback(() => {
    setSavedOrder(workingOrder);
  }, [workingOrder]);

  const total = workingOrder.length;

  const renderItem = useCallback(
    ({ item, index }: { item: PresetId; index: number }) => {
      const preset = PRESETS[item];
      const isFirst = index === 0;
      const isLast = index === total - 1;
      const position = index + 1;

      return (
        <View style={styles.row}>
          <View style={styles.rowRank}>
            <Text style={[styles.rankNumber, styles.tabularNums]}>
              {position}
            </Text>
          </View>

          <View style={styles.rowBody}>
            <Text
              style={styles.presetName}
              accessibilityLabel={`Position ${position} of ${total}: ${preset.name}`}
            >
              {preset.name}
            </Text>
            <Text style={styles.presetSummary}>{preset.summary}</Text>
            <Text style={[styles.matchCount, styles.tabularNums]}>
              {preset.matchCount} active matches
            </Text>
          </View>

          <View style={styles.rowControls}>
            <Pressable
              onPress={() => moveUp(index)}
              disabled={isFirst}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityState={{ disabled: isFirst }}
              accessibilityLabel={
                isFirst
                  ? `Move ${preset.name} up, unavailable, already top priority`
                  : `Move ${preset.name} up to position ${position - 1}`
              }
              style={({ pressed }) => [
                styles.arrowButton,
                isFirst && styles.arrowButtonDisabled,
                pressed && !isFirst && styles.arrowButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.arrowGlyph,
                  isFirst && styles.arrowGlyphDisabled,
                ]}
              >
                {"▲"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => moveDown(index)}
              disabled={isLast}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityState={{ disabled: isLast }}
              accessibilityLabel={
                isLast
                  ? `Move ${preset.name} down, unavailable, already lowest priority`
                  : `Move ${preset.name} down to position ${position + 1}`
              }
              style={({ pressed }) => [
                styles.arrowButton,
                isLast && styles.arrowButtonDisabled,
                pressed && !isLast && styles.arrowButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.arrowGlyph,
                  isLast && styles.arrowGlyphDisabled,
                ]}
              >
                {"▼"}
              </Text>
            </Pressable>
          </View>
        </View>
      );
    },
    [moveUp, moveDown, total]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Search Preset Priority
        </Text>
        <Text style={styles.subtitle}>
          When a new listing matches more than one of your saved presets, the
          higher preset in this list wins for notification purposes.
        </Text>
      </View>

      <FlatList
        data={workingOrder}
        keyExtractor={(id) => id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {isDirty && (
        <View style={styles.band} accessibilityLiveRegion="polite">
          <Text accessibilityRole="alert" style={styles.bandText}>
            Priority order changed. Save to apply it, or reset to revert.
          </Text>
          <View style={styles.bandActions}>
            <Pressable
              onPress={handleReset}
              accessibilityRole="button"
              accessibilityLabel="Reset to saved priority order"
              style={({ pressed }) => [
                styles.resetButton,
                pressed && styles.resetButtonPressed,
              ]}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel="Save priority order"
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
            >
              <Text style={styles.saveButtonText}>Save priority order</Text>
            </Pressable>
          </View>
        </View>
      )}
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
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  separator: {
    height: tokens.space(2),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  rowRank: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  rowBody: {
    flex: 1,
    marginLeft: tokens.space(2),
    marginRight: tokens.space(2),
  },
  presetName: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  presetSummary: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 18,
    color: tokens.color.muted,
  },
  matchCount: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.accent,
    fontWeight: "600",
  },
  rowControls: {
    flexDirection: "column",
  },
  arrowButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
  },
  arrowButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  arrowButtonDisabled: {
    opacity: 1,
  },
  arrowGlyph: {
    fontSize: 16,
    color: tokens.color.ink2,
  },
  arrowGlyphDisabled: {
    color: tokens.color.border,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  bandText: {
    fontSize: 13,
    color: tokens.color.ink2,
    marginBottom: tokens.space(3),
  },
  bandActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  resetButton: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    marginRight: tokens.space(2),
  },
  resetButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  saveButton: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
});
