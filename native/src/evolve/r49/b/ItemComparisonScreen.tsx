// native/src/evolve/r49/b/ItemComparisonScreen.tsx
// Item Comparison — lets a buyer line up 2 (expandable to 3) saved/watched
// items side-by-side across a fixed set of spec rows (price, condition,
// match %, seller rating, shipping time). Items can be dropped from the
// comparison (non-destructive — the watched item itself is untouched) and
// new ones added from a picker drawn from the rest of the watch catalog.
//
// Layout: a frozen label column on the left plus a horizontally scrolling
// run of item columns on the right, so row alignment holds even while the
// item columns scroll past it. This two-pane table shape does not reuse any
// existing screen's ref/callback/union-state structure in this repo.

// Note: this screen never shows more than 3 compared items or 5 pickable
// items at once, so the fixed small .map() lists below (documented DNA
// exception) are used in place of FlatList, which would add virtualization
// overhead with nothing to virtualize.
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  COMPARISON_ATTRIBUTE_ROWS,
  findBestComparisonId,
  formatPrice,
  INITIAL_COMPARISON_IDS,
  MAX_COMPARISON_ITEMS,
  WATCHED_ITEM_CATALOG,
  type WatchedItemSpec,
} from "./data";

/** How long a change announcement stays visible before the live region resets to empty. */
const ANNOUNCEMENT_VISIBLE_MS = 3000;

const LABEL_COLUMN_WIDTH = 112;
const ITEM_COLUMN_WIDTH = 156;
const HEADER_CELL_HEIGHT = 128;
const ROW_CELL_HEIGHT = 56;

export default function ItemComparisonScreen() {
  const [comparisonIds, setComparisonIds] = useState<string[]>([...INITIAL_COMPARISON_IDS]);
  const [highlightBetter, setHighlightBetter] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const announcementTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (announcementTimer.current) clearTimeout(announcementTimer.current);
    };
  }, []);

  const announce = useCallback((message: string) => {
    if (announcementTimer.current) clearTimeout(announcementTimer.current);
    setAnnouncement(message);
    announcementTimer.current = setTimeout(() => setAnnouncement(""), ANNOUNCEMENT_VISIBLE_MS);
  }, []);

  const comparisonItems: WatchedItemSpec[] = comparisonIds
    .map((id) => WATCHED_ITEM_CATALOG.find((entry) => entry.id === id))
    .filter((entry): entry is WatchedItemSpec => entry !== undefined);

  const availableToAdd = WATCHED_ITEM_CATALOG.filter(
    (entry) => !comparisonIds.includes(entry.id)
  );
  const canAddMore = comparisonIds.length < MAX_COMPARISON_ITEMS;

  const handleRemove = useCallback(
    (item: WatchedItemSpec) => {
      setComparisonIds((prev) => prev.filter((id) => id !== item.id));
      announce(`${item.title} removed from comparison. It is still on your watchlist.`);
    },
    [announce]
  );

  const handleAdd = useCallback(
    (item: WatchedItemSpec) => {
      setComparisonIds((prev) =>
        prev.length >= MAX_COMPARISON_ITEMS ? prev : [...prev, item.id]
      );
      setPickerOpen(false);
      announce(`${item.title} added to comparison.`);
    },
    [announce]
  );

  const openPicker = useCallback(() => setPickerOpen(true), []);
  const closePicker = useCallback(() => setPickerOpen(false), []);
  const toggleHighlight = useCallback(() => setHighlightBetter((prev) => !prev), []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text accessibilityRole="header" style={styles.heading}>
          Compare Items Side-by-Side
        </Text>
        <Text style={styles.subheading}>
          Line up watched items across price, condition, match, and more before you decide.
        </Text>

        <Pressable
          onPress={toggleHighlight}
          accessibilityRole="switch"
          accessibilityState={{ checked: highlightBetter }}
          accessibilityLabel="Highlight the better value in each row"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={({ pressed }) => [styles.toggleRow, pressed && styles.toggleRowPressed]}
        >
          <View style={[styles.toggleTrack, highlightBetter && styles.toggleTrackOn]}>
            <View style={[styles.toggleKnob, highlightBetter && styles.toggleKnobOn]} />
          </View>
          <View style={styles.toggleTextBlock}>
            <Text style={styles.toggleLabel}>Highlight better values</Text>
            <Text style={styles.toggleHint}>
              {highlightBetter
                ? "Best cell in each row is marked “Best”."
                : "Values are shown without a best-cell mark."}
            </Text>
          </View>
        </Pressable>

        {/* Single live region for this screen: announces add/remove changes to the item set. */}
        <View accessibilityLiveRegion="polite" style={styles.liveRegion}>
          {announcement.length > 0 ? (
            <Text accessibilityRole="alert" style={styles.liveRegionText}>
              {announcement}
            </Text>
          ) : (
            <Text style={styles.liveRegionText}> </Text>
          )}
        </View>

        {comparisonItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Add an item to start comparing</Text>
            <Pressable
              onPress={openPicker}
              accessibilityRole="button"
              accessibilityLabel="Add an item to compare"
              style={({ pressed }) => [styles.emptyStateButton, pressed && styles.pressedDim]}
            >
              <Text style={styles.emptyStateButtonText}>Add item</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.tableFrame}>
            <View style={styles.tableRow}>
              {/* Frozen label column */}
              <View style={styles.labelColumn}>
                <View style={[styles.labelCell, { height: HEADER_CELL_HEIGHT }]} />
                {COMPARISON_ATTRIBUTE_ROWS.map((row) => (
                  <View key={row.key} style={[styles.labelCell, { height: ROW_CELL_HEIGHT }]}>
                    <Text style={styles.labelCellText}>{row.label}</Text>
                  </View>
                ))}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.itemsScroll}
              >
                {comparisonItems.map((item) => (
                  <View key={item.id} style={styles.itemColumn}>
                    <View style={[styles.itemHeaderCell, { height: HEADER_CELL_HEIGHT }]}>
                      <View
                        style={[styles.photoSwatch, { backgroundColor: tokens.color[item.swatchKey] }]}
                        importantForAccessibility="no"
                      />
                      <Text style={styles.itemTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Pressable
                        onPress={() => handleRemove(item)}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${item.title} from comparison`}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={({ pressed }) => [
                          styles.removeButton,
                          pressed && styles.removeButtonPressed,
                        ]}
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </Pressable>
                    </View>

                    {COMPARISON_ATTRIBUTE_ROWS.map((row) => {
                      const bestId = findBestComparisonId(row, comparisonItems);
                      const isBest = highlightBetter && bestId === item.id;
                      return (
                        <View
                          key={row.key}
                          style={[
                            styles.valueCell,
                            { height: ROW_CELL_HEIGHT },
                            isBest && styles.valueCellBest,
                          ]}
                        >
                          <Text style={[styles.valueCellText, isBest && styles.valueCellTextBest]}>
                            {row.formatValue(item)}
                          </Text>
                          {isBest ? <Text style={styles.bestBadge}>Best</Text> : null}
                        </View>
                      );
                    })}
                  </View>
                ))}

                {canAddMore ? (
                  <Pressable
                    onPress={openPicker}
                    accessibilityRole="button"
                    accessibilityLabel="Add another item to compare"
                    style={({ pressed }) => [
                      styles.addColumn,
                      { height: HEADER_CELL_HEIGHT + COMPARISON_ATTRIBUTE_ROWS.length * ROW_CELL_HEIGHT },
                      pressed && styles.pressedDim,
                    ]}
                  >
                    <Text style={styles.addColumnPlus}>+</Text>
                    <Text style={styles.addColumnText}>Add item to compare</Text>
                  </Pressable>
                ) : null}
              </ScrollView>
            </View>
          </View>
        )}

        {!canAddMore && comparisonItems.length > 0 ? (
          <Text style={styles.limitNote}>
            Comparison is full at {MAX_COMPARISON_ITEMS} items. Remove one to add another.
          </Text>
        ) : null}

        {pickerOpen ? (
          <View style={styles.pickerPanel}>
            <View style={styles.pickerHeaderRow}>
              <Text accessibilityRole="header" style={styles.pickerHeading}>
                Add to comparison
              </Text>
              <Pressable
                onPress={closePicker}
                accessibilityRole="button"
                accessibilityLabel="Close add item picker"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={({ pressed }) => [styles.pickerCloseButton, pressed && styles.removeButtonPressed]}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </Pressable>
            </View>

            {availableToAdd.length === 0 ? (
              <Text style={styles.pickerEmptyText}>
                All watched items are already being compared.
              </Text>
            ) : (
              availableToAdd.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleAdd(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${item.title} to comparison`}
                  style={({ pressed }) => [styles.pickerRow, pressed && styles.pressedDim]}
                >
                  <View
                    style={[styles.photoSwatchSmall, { backgroundColor: tokens.color[item.swatchKey] }]}
                    importantForAccessibility="no"
                  />
                  <View style={styles.pickerRowTextBlock}>
                    <Text style={styles.pickerRowTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.pickerRowMeta}>
                      {formatPrice(item.priceCents)} · {item.conditionGrade}
                    </Text>
                  </View>
                  <Text style={styles.pickerRowAction}>Add</Text>
                </Pressable>
              ))
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(10),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
  },
  toggleRow: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: tokens.space(2),
    minHeight: 44,
  },
  toggleRowPressed: {
    opacity: 0.7,
  },
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: tokens.color.border,
    padding: 3,
    justifyContent: "center",
  },
  toggleTrackOn: {
    backgroundColor: tokens.color.accent,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: tokens.color.bg,
    alignSelf: "flex-start",
  },
  toggleKnobOn: {
    alignSelf: "flex-end",
  },
  toggleTextBlock: {
    marginLeft: tokens.space(3),
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  toggleHint: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.faint,
  },
  liveRegion: {
    minHeight: 18,
    marginTop: tokens.space(2),
  },
  liveRegionText: {
    fontSize: 12,
    color: tokens.color.accent,
    fontWeight: "600",
  },
  emptyState: {
    marginTop: tokens.space(6),
    alignItems: "center",
    paddingVertical: tokens.space(10),
    paddingHorizontal: tokens.space(6),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderStyle: "dashed",
  },
  emptyStateText: {
    fontSize: 15,
    color: tokens.color.muted,
    textAlign: "center",
  },
  emptyStateButton: {
    marginTop: tokens.space(4),
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: tokens.space(5),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  emptyStateButtonText: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },
  tableFrame: {
    marginTop: tokens.space(5),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
  },
  labelColumn: {
    width: LABEL_COLUMN_WIDTH,
    backgroundColor: tokens.color.accentBg,
    borderRightWidth: 1,
    borderRightColor: tokens.color.border,
  },
  labelCell: {
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  labelCellText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  itemsScroll: {
    flex: 1,
  },
  itemColumn: {
    width: ITEM_COLUMN_WIDTH,
    borderRightWidth: 1,
    borderRightColor: tokens.color.border,
  },
  itemHeaderCell: {
    padding: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  photoSwatch: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.sm,
  },
  photoSwatchSmall: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.sm,
  },
  itemTitle: {
    marginTop: tokens.space(1),
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.ink,
    paddingRight: 24,
  },
  removeButton: {
    position: "absolute",
    top: tokens.space(1),
    right: tokens.space(1),
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  removeButtonPressed: {
    backgroundColor: tokens.color.dangerBg,
    borderColor: tokens.color.dangerBorder,
  },
  removeButtonText: {
    fontSize: 14,
    lineHeight: 14,
    color: tokens.color.muted,
    fontWeight: "700",
  },
  valueCell: {
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  valueCellBest: {
    backgroundColor: tokens.color.accentBg,
  },
  valueCellText: {
    fontSize: 13,
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  valueCellTextBest: {
    color: tokens.color.accent,
    fontWeight: "700",
  },
  bestBadge: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "700",
    color: tokens.color.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addColumn: {
    width: ITEM_COLUMN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  addColumnPlus: {
    fontSize: 22,
    color: tokens.color.accent,
    fontWeight: "700",
  },
  addColumnText: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.accent,
    fontWeight: "600",
    textAlign: "center",
  },
  pressedDim: {
    opacity: 0.7,
  },
  limitNote: {
    marginTop: tokens.space(3),
    fontSize: 12,
    color: tokens.color.faint,
  },
  pickerPanel: {
    marginTop: tokens.space(5),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    padding: tokens.space(3),
  },
  pickerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  pickerCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  pickerEmptyText: {
    marginTop: tokens.space(3),
    fontSize: 13,
    color: tokens.color.muted,
  },
  pickerRow: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  pickerRowTextBlock: {
    flex: 1,
    marginLeft: tokens.space(3),
  },
  pickerRowTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  pickerRowMeta: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  pickerRowAction: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
});
