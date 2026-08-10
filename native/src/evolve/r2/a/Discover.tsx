// native/src/evolve/r2/a/Discover.tsx — auto-native-r2 candidate a.
// Query-driven exploration: a search bar + a horizontally-scrollable row of toggleable filter
// chips (brand/size/condition/price, OR within a facet, AND across facets) narrow a 2-column
// virtualized card grid below. Search bar + chip row sit outside the grid's own scroll region, so
// they never move — the grid is the only thing that scrolls, and there is no bottom action bar.
// This is a browse/explore verb, not the write/negotiate/judge verbs the other native screens use.
import { useState } from "react";
import { View, Text, Pressable, TextInput, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { CHIPS, ITEMS, filterItems, formatKRW, type Chip, type Item } from "./data";
import { tokens } from "../../../tokens";

function FilterChip({ chip, active, onToggle }: { chip: Chip; active: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${chip.label} filter, ${active ? "on" : "off"}`}
      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
        {chip.label}
      </Text>
    </Pressable>
  );
}

function ResultCard({
  item,
  saved,
  onToggleSave,
}: {
  item: Item;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <View style={styles.cardWrap}>
      <View style={styles.card}>
        <Pressable
          style={styles.tapArea}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${item.title}, ${item.brand}, ${formatKRW(item.price)}, size ${item.size}, ${item.condition} condition`}
        >
          <View style={styles.thumb}>
            <Text style={styles.thumbGlyph}>{item.brand.charAt(0)}</Text>
          </View>
          <Text style={styles.cardBrand} numberOfLines={1}>
            {item.brand}
          </Text>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardPrice}>{formatKRW(item.price)}</Text>
          <View style={styles.cardMetaRow}>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>{item.size}</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>{item.condition}</Text>
            </View>
          </View>
        </Pressable>
        <Pressable
          onPress={onToggleSave}
          accessibilityRole="button"
          accessibilityState={{ selected: saved }}
          accessibilityLabel={`${saved ? "Remove" : "Save"} ${item.title} ${saved ? "from" : "to"} your watchlist`}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={({ pressed }) => [styles.saveBtn, saved && styles.saveBtnOn, pressed && styles.pressed]}
        >
          <Text style={[styles.saveBtnText, saved && styles.saveBtnTextOn]}>{saved ? "SAVED" : "SAVE"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function Discover() {
  const [query, setQuery] = useState("");
  const [activeChipIds, setActiveChipIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleChip = (id: string) => {
    setActiveChipIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const clearAll = () => {
    setQuery("");
    setActiveChipIds([]);
  };

  const trimmedQuery = query.trim();
  const results = filterItems(ITEMS, query, activeChipIds);
  const hasActiveFilters = activeChipIds.length > 0 || trimmedQuery.length > 0;

  const summaryText =
    results.length === ITEMS.length
      ? `Showing all ${ITEMS.length} items`
      : trimmedQuery.length > 0
        ? `${results.length} result${results.length === 1 ? "" : "s"} for "${trimmedQuery}"`
        : `${results.length} of ${ITEMS.length} items`;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.h1} accessibilityRole="header">
          Search & Discover
        </Text>
        <Text style={styles.sub}>{ITEMS.length} items in the catalog</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by item or brand"
          placeholderTextColor={tokens.color.faint}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search catalog by item name or brand"
        />
        {trimmedQuery.length > 0 && (
          <Pressable
            onPress={() => setQuery("")}
            accessibilityRole="button"
            accessibilityLabel="Clear search text"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.searchClear}
          >
            <Text style={styles.searchClearGlyph}>×</Text>
          </Pressable>
        )}
      </View>


      <View style={styles.filterHead}>
        <Text style={styles.filterLabel}>Filter by</Text>
        <Pressable
          onPress={clearAll}
          disabled={!hasActiveFilters}
          accessibilityRole="button"
          accessibilityState={{ disabled: !hasActiveFilters }}
          accessibilityLabel="Clear all filters and search text"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [
            styles.clearAllBtn,
            !hasActiveFilters && styles.clearAllBtnDisabled,
            pressed && hasActiveFilters && styles.pressed,
          ]}
        >
          <Text style={[styles.clearAllText, !hasActiveFilters && styles.clearAllTextDisabled]}>Clear all</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={CHIPS}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <FilterChip chip={item} active={activeChipIds.includes(item.id)} onToggle={() => toggleChip(item.id)} />
        )}
        showsHorizontalScrollIndicator={false}
        style={styles.chipList}
        contentContainerStyle={styles.chipRow}
      />

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText} accessibilityLiveRegion="polite">
          {summaryText}
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <ResultCard item={item} saved={savedIds.includes(item.id)} onToggleSave={() => toggleSave(item.id)} />
        )}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        style={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No matches</Text>
            <Text style={styles.emptyBody}>
              No items match {trimmedQuery.length > 0 ? `"${trimmedQuery}"` : "the selected filters"}. Try removing
              a filter or searching a different term.
            </Text>
            <Pressable
              onPress={clearAll}
              accessibilityRole="button"
              accessibilityLabel="Clear all filters and search text"
              style={({ pressed }) => [styles.emptyBtn, pressed && styles.pressed]}
            >
              <Text style={styles.emptyBtnText}>Clear filters</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },

  header: { paddingHorizontal: tokens.space(5), paddingTop: tokens.space(10), paddingBottom: tokens.space(2) },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint },

  /* search — outside the grid's own scroll region, so it never moves */
  searchRow: {
    position: "relative",
    marginTop: tokens.space(2),
    paddingHorizontal: tokens.space(5),
    justifyContent: "center",
  },
  searchInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingLeft: tokens.space(3),
    paddingRight: tokens.space(9),
    fontSize: 16,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  searchClear: {
    position: "absolute",
    right: tokens.space(5) + tokens.space(2),
    top: 0,
    bottom: 0,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  searchClearGlyph: { fontSize: 18, fontWeight: "700", color: tokens.color.faint, lineHeight: 20 },

  /* filter head + horizontal chip row */
  filterHead: {
    marginTop: tokens.space(4),
    paddingHorizontal: tokens.space(5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  clearAllBtn: { minHeight: 32, justifyContent: "center" },
  clearAllBtnDisabled: { opacity: 0.5 },
  clearAllText: { fontSize: 13, fontWeight: "700", color: tokens.color.accent },
  clearAllTextDisabled: { color: tokens.color.faint },

  chipList: { flexGrow: 0, marginTop: tokens.space(2) },
  chipRow: { paddingHorizontal: tokens.space(5), gap: tokens.space(2) },
  chip: {
    minHeight: 44,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  chipActive: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  chipText: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  chipTextActive: { color: tokens.color.onAccent },

  /* result count — the live proof that the query/chips above actually narrowed the grid below */
  summaryRow: {
    marginTop: tokens.space(3),
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  summaryText: { fontSize: 13, fontWeight: "600", color: tokens.color.muted },

  /* the only scrolling region on screen */
  grid: { flex: 1 },
  gridContent: { paddingHorizontal: tokens.space(5), paddingTop: tokens.space(3), paddingBottom: tokens.space(6) },
  gridRow: { gap: tokens.space(3) },

  cardWrap: { flex: 1, marginBottom: tokens.space(3) },
  card: {
    position: "relative",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
    overflow: "hidden",
  },
  tapArea: { padding: tokens.space(3) },
  thumb: {
    aspectRatio: 1,
    width: "100%",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbGlyph: { fontSize: 30, fontWeight: "800", color: tokens.color.muted },
  cardBrand: {
    marginTop: tokens.space(2),
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  cardTitle: { marginTop: 2, fontSize: 14, fontWeight: "600", color: tokens.color.ink2, lineHeight: 19 },
  cardPrice: { marginTop: 6, fontSize: 16, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
  cardMetaRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  metaPill: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
  },
  metaPillText: { fontSize: 10, fontWeight: "600", color: tokens.color.muted },

  /* save toggle — overlaid on the card corner, a sibling of tapArea (not nested inside its Pressable) */
  saveBtn: {
    position: "absolute",
    top: tokens.space(2),
    right: tokens.space(2),
    minHeight: 24,
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnOn: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  saveBtnText: { fontSize: 9, fontWeight: "800", color: tokens.color.ink2, letterSpacing: 0.3 },
  saveBtnTextOn: { color: tokens.color.onAccent },

  /* no-results state — always paired with a deterministic way back to the full catalog */
  emptyWrap: { paddingTop: tokens.space(10), paddingHorizontal: tokens.space(5), alignItems: "center", gap: 6 },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: tokens.color.ink },
  emptyBody: { fontSize: 13, color: tokens.color.muted, textAlign: "center", lineHeight: 19 },
  emptyBtn: {
    marginTop: tokens.space(3),
    minHeight: 44,
    paddingHorizontal: tokens.space(5),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBtnText: { fontSize: 14, fontWeight: "700", color: tokens.color.ink2 },

  pressed: { opacity: 0.85 },
});
