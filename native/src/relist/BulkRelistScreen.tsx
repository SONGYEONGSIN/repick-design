// native/src/relist/BulkRelistScreen.tsx
//
// Bulk Relist — a seller's aging-inventory screen. Select any number of stale
// listings, then apply a batch action ("Drop price 10%" / "Bump to top") to all
// of them at once from a contextual bar that only exists while something is
// selected. This is the screen's one interaction shell: no bar when selection
// is empty, an announced bar the moment it isn't.
import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../tokens";
import { INITIAL_LISTINGS, type Listing } from "./data";

type SortMode = "days" | "views";

type RuntimeListing = Listing & {
  currentPrice: number;
  bumped: boolean;
  bumpRank: number;
};

type UndoState = {
  message: string;
  restore: Record<string, Partial<RuntimeListing>>;
};

function buildInitialItems(): RuntimeListing[] {
  return INITIAL_LISTINGS.map((l) => ({
    ...l,
    currentPrice: l.originalPrice,
    bumped: false,
    bumpRank: 0,
  }));
}

function formatKrw(n: number): string {
  // (a) a small space between the ₩ glyph and the digits keeps its stroke from
  // visually running into the numerals at body size on -apple-system.
  return `₩ ${n.toLocaleString("en-US")}`;
}

export function BulkRelistScreen() {
  const [items, setItems] = useState<RuntimeListing[]>(buildInitialItems);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortMode, setSortMode] = useState<SortMode>("days");
  const [undo, setUndo] = useState<UndoState | null>(null);
  const bumpCounter = useRef(0);

  const selectedCount = selected.size;

  const displayList = useMemo(() => {
    const bumped = items.filter((i) => i.bumped).sort((a, b) => a.bumpRank - b.bumpRank);
    const rest = items.filter((i) => !i.bumped);
    rest.sort((a, b) => (sortMode === "days" ? b.daysListed - a.daysListed : b.views - a.views));
    return [...bumped, ...rest];
  }, [items, sortMode]);

  const toggleSelect = useCallback((id: string) => {
    setUndo(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const applyDropPrice = useCallback(() => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    const restore: Record<string, Partial<RuntimeListing>> = {};
    items.forEach((it) => {
      if (selected.has(it.id)) restore[it.id] = { currentPrice: it.currentPrice };
    });
    setItems((prev) =>
      prev.map((it) =>
        selected.has(it.id) ? { ...it, currentPrice: Math.round((it.currentPrice * 0.9) / 100) * 100 } : it
      )
    );
    setUndo({ message: `Price dropped 10% on ${ids.length} item${ids.length > 1 ? "s" : ""}`, restore });
    setSelected(new Set());
  }, [items, selected]);

  const applyBump = useCallback(() => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    const restore: Record<string, Partial<RuntimeListing>> = {};
    items.forEach((it) => {
      if (selected.has(it.id)) restore[it.id] = { bumped: it.bumped, bumpRank: it.bumpRank };
    });
    setItems((prev) =>
      prev.map((it) => {
        if (!selected.has(it.id)) return it;
        bumpCounter.current += 1;
        return { ...it, bumped: true, bumpRank: bumpCounter.current };
      })
    );
    setUndo({ message: `Bumped ${ids.length} item${ids.length > 1 ? "s" : ""} to top`, restore });
    setSelected(new Set());
  }, [items, selected]);

  const handleUndo = useCallback(() => {
    if (!undo) return;
    setItems((prev) => prev.map((it) => (undo.restore[it.id] ? { ...it, ...undo.restore[it.id] } : it)));
    setUndo(null);
  }, [undo]);

  const dismissUndo = useCallback(() => setUndo(null), []);

  const barVisible = selectedCount > 0;
  const undoVisible = !barVisible && undo !== null;

  const renderItem = useCallback(
    ({ item }: { item: RuntimeListing }) => {
      const isSelected = selected.has(item.id);
      const droppedPct = Math.round((1 - item.currentPrice / item.originalPrice) * 100);
      const priceLabel = formatKrw(item.currentPrice);
      const stateLabel = isSelected ? "selected" : "not selected";

      return (
        <Pressable
          onPress={() => toggleSelect(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}, ${priceLabel}, ${stateLabel}`}
          style={({ pressed }) => [
            styles.card,
            isSelected && styles.cardSelected,
            pressed && styles.cardPressed,
          ]}
        >
          <Pressable
            onPress={() => toggleSelect(item.id)}
            hitSlop={12}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={`Select ${item.title}`}
            style={[styles.checkbox, isSelected && styles.checkboxChecked]}
          >
            {isSelected ? <Text style={styles.checkmark}>{"✓"}</Text> : null}
          </Pressable>

          <View style={styles.thumb}>
            <Text style={styles.thumbLabel}>{item.thumbLabel}</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>

            <View style={styles.priceRow}>
              {droppedPct > 0 ? (
                <Text style={styles.priceOld}>{formatKrw(item.originalPrice)}</Text>
              ) : null}
              <Text style={styles.priceNew}>{priceLabel}</Text>
              {droppedPct > 0 ? (
                <View style={styles.dropBadge}>
                  <Text style={styles.dropBadgeText}>-{droppedPct}%</Text>
                </View>
              ) : null}
            </View>

            {item.bumped ? (
              <View style={styles.bumpBadge}>
                <Text style={styles.bumpBadgeText}>Bumped to top · just relisted</Text>
              </View>
            ) : (
              <Text style={styles.metaText}>
                {item.daysListed} days listed · {item.views} views
              </Text>
            )}
          </View>
        </Pressable>
      );
    },
    [selected, toggleSelect]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Bulk Relist
        </Text>
        <Text style={styles.subtitle}>
          {INITIAL_LISTINGS.length} stale listings · unsold 14+ days · select some and take action
        </Text>

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort:</Text>
          <Pressable
            onPress={() => setSortMode("days")}
            accessibilityRole="button"
            accessibilityState={{ selected: sortMode === "days" }}
            accessibilityLabel="Sort by longest listed"
            style={[styles.chip, sortMode === "days" && styles.chipActive]}
          >
            <Text style={[styles.chipText, sortMode === "days" && styles.chipTextActive]}>Longest listed</Text>
          </Pressable>
          <Pressable
            onPress={() => setSortMode("views")}
            accessibilityRole="button"
            accessibilityState={{ selected: sortMode === "views" }}
            accessibilityLabel="Sort by most viewed"
            style={[styles.chip, sortMode === "views" && styles.chipActive]}
          >
            <Text style={[styles.chipText, sortMode === "views" && styles.chipTextActive]}>Most viewed</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={displayList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={[styles.listContent, (barVisible || undoVisible) && styles.listContentPad]}
      />

      {barVisible ? (
        <View style={styles.bar}>
          <View accessibilityLiveRegion="polite" style={styles.barCountWrap}>
            <Text accessibilityRole="alert" style={styles.barCountText}>
              {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
            </Text>
          </View>
          <View style={styles.barActions}>
            <Pressable
              onPress={applyDropPrice}
              accessibilityRole="button"
              accessibilityLabel={`Drop price 10% for ${selectedCount} selected item${selectedCount > 1 ? "s" : ""}`}
              style={({ pressed }) => [styles.barButton, styles.barButtonGhost, pressed && styles.barButtonPressed]}
            >
              <Text style={styles.barButtonGhostText}>Drop price 10%</Text>
            </Pressable>
            <Pressable
              onPress={applyBump}
              accessibilityRole="button"
              accessibilityLabel={`Bump ${selectedCount} selected item${selectedCount > 1 ? "s" : ""} to top`}
              style={({ pressed }) => [styles.barButton, styles.barButtonSolid, pressed && styles.barButtonPressed]}
            >
              <Text style={styles.barButtonSolidText}>Bump to top</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={clearSelection}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Clear selection"
            style={styles.barClear}
          >
            <Text style={styles.barClearText}>{"✕"}</Text>
          </Pressable>
        </View>
      ) : null}

      {undoVisible && undo ? (
        <View style={styles.undoBar}>
          <View accessibilityLiveRegion="polite" style={styles.undoTextWrap}>
            <Text accessibilityRole="alert" style={styles.undoText}>
              {undo.message}
            </Text>
          </View>
          <Pressable onPress={handleUndo} hitSlop={8} accessibilityRole="button" accessibilityLabel="Undo last batch action">
            <Text style={styles.undoAction}>Undo</Text>
          </Pressable>
          <Pressable onPress={dismissUndo} hitSlop={12} accessibilityRole="button" accessibilityLabel="Dismiss">
            <Text style={styles.undoDismiss}>{"✕"}</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export default BulkRelistScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(1),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    marginTop: tokens.space(3),
  },
  sortLabel: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  chip: {
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    minHeight: 44,
    justifyContent: "center",
  },
  chipActive: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  chipText: {
    fontSize: 12,
    color: tokens.color.muted,
    fontWeight: "600",
  },
  chipTextActive: {
    color: tokens.color.onAccent,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: tokens.space(4),
    gap: tokens.space(3),
  },
  listContentPad: {
    paddingBottom: tokens.space(28),
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    padding: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  cardSelected: {
    borderColor: tokens.color.accent,
    borderWidth: 2,
  },
  cardPressed: {
    opacity: 0.85,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(1),
    backgroundColor: tokens.color.bg,
  },
  checkboxChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkmark: {
    color: tokens.color.onAccent,
    fontSize: 14,
    fontWeight: "700",
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  cardBody: {
    flex: 1,
    gap: tokens.space(1),
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    flexWrap: "wrap",
  },
  priceOld: {
    fontSize: 12,
    color: tokens.color.faint,
    textDecorationLine: "line-through",
    fontVariant: ["tabular-nums"],
  },
  priceNew: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  dropBadge: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  dropBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.onAccent,
    fontVariant: ["tabular-nums"],
  },
  bumpBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  bumpBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  metaText: {
    fontSize: 12,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.ink,
    borderTopLeftRadius: tokens.radius.md,
    borderTopRightRadius: tokens.radius.md,
  },
  barCountWrap: {
    minWidth: 0,
  },
  barCountText: {
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  barActions: {
    flexDirection: "row",
    gap: tokens.space(2),
    marginLeft: "auto",
  },
  barButton: {
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  barButtonGhost: {
    borderWidth: 1,
    borderColor: tokens.color.onInkMuted,
  },
  barButtonSolid: {
    backgroundColor: tokens.color.accent,
  },
  barButtonPressed: {
    opacity: 0.75,
  },
  barButtonGhostText: {
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "600",
  },
  barButtonSolidText: {
    color: tokens.color.onAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  barClear: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  barClearText: {
    color: tokens.color.onInkMuted,
    fontSize: 16,
  },
  undoBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    backgroundColor: tokens.color.ink2,
    borderTopLeftRadius: tokens.radius.md,
    borderTopRightRadius: tokens.radius.md,
  },
  undoTextWrap: {
    flex: 1,
  },
  undoText: {
    color: tokens.color.onInk,
    fontSize: 13,
    fontWeight: "600",
  },
  undoAction: {
    color: tokens.color.accent,
    fontSize: 13,
    fontWeight: "700",
    minHeight: 44,
    textAlignVertical: "center",
  },
  undoDismiss: {
    color: tokens.color.onInkMuted,
    fontSize: 16,
    width: 44,
    height: 44,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
