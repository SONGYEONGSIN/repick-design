// native/src/evolve/r21/b/ItemComparisonScreen.tsx
//
// Concept: "Compare Items" — a multi-column side-by-side spec grid for 1-3
// watchlisted items, with a pinned row-label rail on the left and a
// horizontally-scrolling strip of item columns on the right. Users can
// remove an item from the comparison set from its column header, or add one
// back from a strip of items currently left out (capped at 3 columns). The
// best value in each spec row is marked with a checkmark + "Best" text, not
// color alone.
//
// Band-form choice: NO fixed bottom band. This is an exploration/read screen,
// not a blocked workflow with a single terminal action to gate — GENERATION.md
// §3 calls "no band" well-justified here, and there is no state machine of
// "why you can't proceed" to build. The one persistent-ish surface is the
// small live-region status line pinned above the grid, which exists purely
// to announce set-membership changes to assistive tech, not to gate an
// action. There's also no selection-COUNT-driven contextual bar (relist's
// pattern): removal is a per-column control on the item itself, not a
// summary bar that appears once N items are checked off a list.
//
// Differentiation from named prior screens:
//   - watchlist (list) shows saved items one-per-row, no cross-item spec
//     comparison and nothing side-by-side. This screen's whole point is N
//     items' specs lined up against each other in one grid.
//   - price-history detail is ONE item's own price over time (a chart). This
//     screen has no chart and no time axis — it's a snapshot spec table
//     across MULTIPLE items, comparing them to each other right now, not one
//     item's own past.
//   - bulk-relist's selection-count contextual bottom bar is a picker driving
//     a bulk action; here there is no "select then act" bar — the primary
//     surface IS the grid, and add/remove are inline column-level controls.

import { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ALL_ITEMS,
  INITIAL_COMPARISON_IDS,
  MAX_COMPARE,
  ROW_CONFIGS,
  type ComparisonItem,
} from "./data";

const HEADER_CELL_HEIGHT = 96;
const DATA_CELL_HEIGHT = 60;
const COLUMN_WIDTH = 152;
const RAIL_WIDTH = 108;

function firstName(fullTitle: string): string {
  return fullTitle.split(" — ")[0];
}

export default function ItemComparisonScreen() {
  const [comparisonIds, setComparisonIds] = useState<string[]>(
    INITIAL_COMPARISON_IDS,
  );
  const [statusMessage, setStatusMessage] = useState<string>(
    `Comparing ${INITIAL_COMPARISON_IDS.length} items.`,
  );

  const comparedItems = useMemo<ComparisonItem[]>(
    () =>
      comparisonIds
        .map((id) => ALL_ITEMS.find((item) => item.id === id))
        .filter((item): item is ComparisonItem => item !== undefined),
    [comparisonIds],
  );

  const availableItems = useMemo(
    () => ALL_ITEMS.filter((item) => !comparisonIds.includes(item.id)),
    [comparisonIds],
  );

  const atMax = comparisonIds.length >= MAX_COMPARE;
  const canShowBest = comparedItems.length >= 2;

  // Best value per row, keyed by row id → set of item ids tied for best.
  const bestByRow = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    if (!canShowBest) return map;
    for (const row of ROW_CONFIGS) {
      const values = comparedItems.map((item) => row.getValue(item));
      const best =
        row.direction === "asc" ? Math.min(...values) : Math.max(...values);
      map[row.id] = new Set(
        comparedItems
          .filter((item) => row.getValue(item) === best)
          .map((i) => i.id),
      );
    }
    return map;
  }, [comparedItems, canShowBest]);

  const removeItem = (item: ComparisonItem) => {
    setComparisonIds((prev) => prev.filter((id) => id !== item.id));
    const remaining = comparisonIds.length - 1;
    setStatusMessage(
      remaining > 0
        ? `Removed ${firstName(item.title)} — comparing ${remaining} item${
            remaining === 1 ? "" : "s"
          }.`
        : `Removed ${firstName(item.title)} — comparison is empty.`,
    );
  };

  const addItem = (item: ComparisonItem) => {
    if (atMax) {
      setStatusMessage(
        `Comparing the maximum of ${MAX_COMPARE} items — remove one to add ${firstName(
          item.title,
        )}.`,
      );
      return;
    }
    setComparisonIds((prev) => [...prev, item.id]);
    const total = comparisonIds.length + 1;
    setStatusMessage(`Added ${firstName(item.title)} — comparing ${total} items.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <Text accessibilityRole="header" style={styles.title}>
          Compare Items
        </Text>
        <Text style={styles.subtitle}>
          Side-by-side specs for the items on your watchlist.
        </Text>

        <View style={styles.statusZone} accessibilityLiveRegion="polite">
          <Text accessibilityRole="alert" style={styles.statusText}>
            {statusMessage}
          </Text>
        </View>

        {comparedItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nothing to compare yet</Text>
            <Text style={styles.emptyBody}>
              Add items from your watchlist below to see their price,
              condition, and seller specs lined up side by side.
            </Text>
          </View>
        ) : (
          <>
            {comparedItems.length > 1 ? (
              <Text style={styles.swipeHint}>Swipe to see more columns →</Text>
            ) : null}
            {!canShowBest ? (
              <Text style={styles.swipeHint}>
                Add another item to see best-value highlights.
              </Text>
            ) : null}

            <View style={styles.gridRow}>
              <View style={styles.rail}>
                <View style={styles.railHeaderCell} />
                {ROW_CONFIGS.map((row) => (
                  <View key={row.id} style={styles.railCell}>
                    <Text style={styles.railLabel}>{row.label}</Text>
                  </View>
                ))}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator
                style={styles.columnsScroll}
                contentContainerStyle={styles.columnsScrollContent}
              >
                {comparedItems.map((item) => (
                  <View key={item.id} style={styles.column}>
                    <View
                      style={styles.columnHeaderCell}
                      accessible
                      accessibilityLabel={`${item.title}, sold by ${item.sellerName}, comparison column`}
                    >
                      <Pressable
                        onPress={() => removeItem(item)}
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${item.title} from comparison`}
                        style={({ pressed }) => [
                          styles.removeButton,
                          pressed && styles.pressedDim,
                        ]}
                      >
                        <Text style={styles.removeButtonGlyph}>×</Text>
                      </Pressable>
                      <Text
                        accessibilityRole="header"
                        style={styles.columnTitle}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.columnSeller} numberOfLines={1}>
                        {item.sellerName}
                      </Text>
                    </View>

                    {ROW_CONFIGS.map((row) => {
                      const isBest = bestByRow[row.id]?.has(item.id) ?? false;
                      const value = row.formatValue(item);
                      return (
                        <View
                          key={row.id}
                          style={[styles.dataCell, isBest && styles.dataCellBest]}
                          accessible
                          accessibilityLabel={`${row.label}: ${value}${
                            isBest ? ", best value" : ""
                          }`}
                        >
                          <View style={styles.dataCellInner}>
                            {isBest ? (
                              <Text style={styles.bestGlyph}>✓</Text>
                            ) : null}
                            <Text
                              style={[
                                styles.dataValue,
                                isBest && styles.dataValueBest,
                              ]}
                              numberOfLines={1}
                            >
                              {value}
                            </Text>
                          </View>
                          {isBest ? <Text style={styles.bestTag}>Best</Text> : null}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        <Text style={styles.sectionLabel}>
          {atMax
            ? `Comparing ${MAX_COMPARE} of ${MAX_COMPARE} — remove one to add another`
            : "Add to comparison"}
        </Text>
        {atMax ? (
          <Text style={styles.sectionNote}>
            Remove a column above to bring in a different item.
          </Text>
        ) : availableItems.length === 0 ? (
          <Text style={styles.sectionNote}>
            Every watchlisted item is already in this comparison.
          </Text>
        ) : (
          <View style={styles.addChipWrap}>
            {availableItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => addItem(item)}
                hitSlop={4}
                accessibilityRole="button"
                accessibilityLabel={`Add ${item.title} to comparison`}
                style={({ pressed }) => [
                  styles.addChip,
                  pressed && styles.pressedDim,
                ]}
              >
                <Text style={styles.addChipGlyph}>+</Text>
                <View style={styles.addChipTextCol}>
                  <Text style={styles.addChipTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.addChipMeta}>{item.sellerName}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  page: {
    flex: 1,
  },
  pageContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(10),
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
  },
  statusZone: {
    marginTop: tokens.space(3),
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  emptyCard: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  emptyBody: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
    lineHeight: 18,
  },
  swipeHint: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(3),
  },
  gridRow: {
    flexDirection: "row",
    marginTop: tokens.space(2.5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  rail: {
    width: RAIL_WIDTH,
    borderRightWidth: 1,
    borderRightColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  railHeaderCell: {
    height: HEADER_CELL_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  railCell: {
    height: DATA_CELL_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: tokens.space(2.5),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  railLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  columnsScroll: {
    flex: 1,
  },
  columnsScrollContent: {
    flexDirection: "row",
  },
  column: {
    width: COLUMN_WIDTH,
    borderRightWidth: 1,
    borderRightColor: tokens.color.border,
  },
  columnHeaderCell: {
    height: HEADER_CELL_HEIGHT,
    paddingHorizontal: tokens.space(2.5),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(1.5),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    justifyContent: "flex-end",
  },
  removeButton: {
    position: "absolute",
    top: tokens.space(1),
    right: tokens.space(1),
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonGlyph: {
    fontSize: 18,
    lineHeight: 18,
    color: tokens.color.faint,
    fontWeight: "600",
  },
  columnTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
    lineHeight: 17,
    paddingRight: tokens.space(5),
  },
  columnSeller: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: tokens.space(0.5),
  },
  dataCell: {
    height: DATA_CELL_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: tokens.space(2.5),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  dataCellBest: {
    backgroundColor: tokens.color.bg,
    borderLeftWidth: 3,
    borderLeftColor: tokens.color.accent,
    paddingLeft: tokens.space(2.5) - 3,
  },
  dataCellInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(1),
  },
  bestGlyph: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  dataValue: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
    flexShrink: 1,
  },
  dataValueBest: {
    color: tokens.color.accent,
    fontWeight: "700",
  },
  bestTag: {
    fontSize: 10,
    fontWeight: "700",
    color: tokens.color.accent,
    marginTop: 1,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginTop: tokens.space(6),
    marginBottom: tokens.space(1),
  },
  sectionNote: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  addChipWrap: {
    marginTop: tokens.space(1.5),
    gap: tokens.space(2),
  },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(2.5),
    paddingHorizontal: tokens.space(3),
    minHeight: 44,
    gap: tokens.space(2.5),
  },
  addChipGlyph: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.accent,
    width: 20,
    textAlign: "center",
  },
  addChipTextCol: {
    flexShrink: 1,
  },
  addChipTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  addChipMeta: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: 1,
  },
  pressedDim: {
    opacity: 0.6,
  },
});
