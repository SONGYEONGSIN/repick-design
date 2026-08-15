// native/src/evolve/r6/b/DiscoverScreen.tsx — auto-native-r6 candidate b.
//
// Discover/Search: the app's general browse surface over the full catalog, distinct from
// Watchlist (a list of items the user already saved). Chrome choice: the search bar and filter
// chips are kept in a FIXED (non-scrolling) header above the FlatList — unlike the zero-fixed-chrome
// pattern that won for a pure settings screen (auto-native-r2/c), a search/discovery screen's primary
// tool needs to stay reachable while the results scroll, so pinning it here is the better fit for
// this screen type, not a reversion to the banned always-fixed 3-band silhouette (there is no fixed
// bottom bar — only the top search/filter band, and it does real, live filtering work every frame it's
// visible, matching the r3/r5 "fixed chrome must do work" rule).
import { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import {
  CATEGORY_FILTERS,
  CONDITION_FILTERS,
  DEFAULT_FILTERS,
  filterListings,
  formatKRW,
  LISTINGS,
  PRICE_FILTERS,
  type Filters,
  type Listing,
} from "./data";
import { tokens } from "../../../tokens";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

/* ───────── filter chip (single-select per group) ───────── */

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}${selected ? ", selected" : ""}`}
      hitSlop={HIT_SLOP}
      style={({ pressed }) => [styles.chip, selected && styles.chipOn, pressed && styles.pressed]}
    >
      {/* Selection is signaled by border weight + a checkmark glyph + bold text, not color alone. */}
      <Text style={[styles.chipLabel, selected && styles.chipLabelOn]}>
        {selected ? "✓ " : ""}
        {label}
      </Text>
    </Pressable>
  );
}

function ChipRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <View style={styles.chipGroup}>
      <Text style={styles.chipGroupLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {options.map((opt) => (
          <Chip key={opt} label={opt} selected={opt === value} onPress={() => onChange(opt)} />
        ))}
      </ScrollView>
    </View>
  );
}

/* ───────── result card (expands in place into a quick preview) ───────── */

function ListingCard({
  item,
  selected,
  saved,
  onToggleSelect,
  onToggleSave,
}: {
  item: Listing;
  selected: boolean;
  saved: boolean;
  onToggleSelect: () => void;
  onToggleSave: () => void;
}) {
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <Pressable
        onPress={onToggleSelect}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`${item.title}, ${formatKRW(item.price)}, condition ${item.condition}${selected ? ", expanded" : ""}`}
      >
        <View style={styles.thumb}>
          <Text style={styles.thumbGlyph}>{item.glyph}</Text>
        </View>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatKRW(item.price)}</Text>
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionBadgeLabel}>{item.condition}</Text>
          </View>
        </View>
        {selected && <Text style={styles.selectedTag}>Selected</Text>}
      </Pressable>

      {selected && (
        <View style={styles.preview}>
          <Text style={styles.previewDesc}>{item.description}</Text>
          <Text style={styles.previewSeller}>Seller: {item.seller}</Text>
          <View style={styles.previewActions}>
            <Pressable
              onPress={onToggleSave}
              accessibilityRole="button"
              accessibilityState={{ selected: saved }}
              accessibilityLabel={saved ? `Remove ${item.title} from watchlist` : `Save ${item.title} to watchlist`}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [
                styles.previewBtn,
                saved ? styles.previewBtnSaved : styles.previewBtnGhost,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.previewBtnLabel, saved ? styles.previewBtnLabelSaved : styles.previewBtnLabelGhost]}>
                {saved ? "✓ Saved" : "Save to watchlist"}
              </Text>
            </Pressable>
            <Pressable
              onPress={onToggleSelect}
              accessibilityRole="button"
              accessibilityLabel={`Close preview for ${item.title}`}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [styles.previewBtn, styles.previewBtnGhost, pressed && styles.pressed]}
            >
              <Text style={[styles.previewBtnLabel, styles.previewBtnLabelGhost]}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

/* ───────── empty state (guidance + action, not a blank screen) ───────── */

function EmptyResults({ onClear }: { onClear: () => void }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No listings match your filters</Text>
      <Text style={styles.emptyBody}>Try a different search term or clear the filters below.</Text>
      <Pressable
        onPress={onClear}
        accessibilityRole="button"
        accessibilityLabel="Clear all filters"
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [styles.emptyBtn, pressed && styles.pressed]}
      >
        <Text style={styles.emptyBtnLabel}>Clear filters</Text>
      </Pressable>
    </View>
  );
}

/* ───────── screen ───────── */

export function DiscoverScreen() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const results = useMemo(() => filterListings(LISTINGS, filters), [filters]);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSelectedId(null);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Deterministic reset (no random/time-based data) — pull-to-refresh returns the browse
    // surface to its default, unfiltered state, matching what a fresh catalog fetch would show.
    setTimeout(() => {
      clearFilters();
      setRefreshing(false);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.h1} accessibilityRole="header">
          Discover Listings
        </Text>
        <Text style={styles.sub}>
          {results.length} of {LISTINGS.length} listings
        </Text>

        <TextInput
          value={filters.query}
          onChangeText={(text) => setFilters((prev) => ({ ...prev, query: text }))}
          placeholder="Search by title or category"
          placeholderTextColor={tokens.color.faint}
          accessibilityLabel="Search listings by title or category"
          style={styles.search}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        <ChipRow
          label="Category"
          options={CATEGORY_FILTERS}
          value={filters.category}
          onChange={(category) => setFilters((prev) => ({ ...prev, category }))}
        />
        <ChipRow
          label="Condition"
          options={CONDITION_FILTERS}
          value={filters.condition}
          onChange={(condition) => setFilters((prev) => ({ ...prev, condition }))}
        />
        <View style={styles.chipGroup}>
          <Text style={styles.chipGroupLabel}>Price</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {PRICE_FILTERS.map((opt) => (
              <Chip
                key={opt.key}
                label={opt.label}
                selected={opt.key === filters.price}
                onPress={() => setFilters((prev) => ({ ...prev, price: opt.key }))}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrap}
        contentContainerStyle={styles.list}
        extraData={{ selectedId, savedIds }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tokens.color.accent} />
        }
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <ListingCard
              item={item}
              selected={item.id === selectedId}
              saved={!!savedIds[item.id]}
              onToggleSelect={() => setSelectedId((cur) => (cur === item.id ? null : item.id))}
              onToggleSave={() => setSavedIds((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
            />
          </View>
        )}
        ListEmptyComponent={<EmptyResults onClear={clearFilters} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },

  /* fixed header: title + live count + search + filter chips — pinned so the primary browse
     tool stays reachable while results scroll (see file-top comment for the chrome rationale) */
  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(10),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 4, fontSize: 13, color: tokens.color.faint },

  search: {
    marginTop: tokens.space(4),
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    fontSize: 15,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },

  chipGroup: { marginTop: tokens.space(3) },
  chipGroupLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  chipRow: { flexDirection: "row", gap: tokens.space(2), paddingRight: tokens.space(2) },
  chip: {
    minHeight: 36,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  chipOn: { borderWidth: 2, borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  chipLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  chipLabelOn: { color: tokens.color.onAccent, fontWeight: "800" },

  /* results grid */
  list: { paddingHorizontal: tokens.space(5), paddingTop: tokens.space(4), paddingBottom: tokens.space(10) },
  columnWrap: { gap: tokens.space(3) },
  cell: { flex: 1, marginBottom: tokens.space(3) },

  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  cardSelected: { borderWidth: 2, borderColor: tokens.color.accent },

  thumb: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbGlyph: { fontSize: 18, fontWeight: "800", color: tokens.color.muted, letterSpacing: 1 },

  category: { marginTop: tokens.space(2), fontSize: 10, fontWeight: "700", color: tokens.color.faint, textTransform: "uppercase", letterSpacing: 0.4 },
  title: { marginTop: 3, fontSize: 13, fontWeight: "600", color: tokens.color.ink2, lineHeight: 18, minHeight: 36 },

  priceRow: { marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 },
  price: { fontSize: 15, fontWeight: "800", color: tokens.color.ink },
  conditionBadge: { paddingHorizontal: tokens.space(2), paddingVertical: 2, borderRadius: tokens.radius.sm, borderWidth: 1, borderColor: tokens.color.border },
  conditionBadgeLabel: { fontSize: 10, fontWeight: "700", color: tokens.color.muted },

  selectedTag: { marginTop: 8, fontSize: 11, fontWeight: "700", color: tokens.color.accent },

  preview: { marginTop: tokens.space(3), paddingTop: tokens.space(3), borderTopWidth: 1, borderTopColor: tokens.color.border },
  previewDesc: { fontSize: 12, color: tokens.color.ink2, lineHeight: 17 },
  previewSeller: { marginTop: 6, fontSize: 11, color: tokens.color.faint },
  previewActions: { marginTop: tokens.space(3), flexDirection: "row", flexWrap: "wrap", gap: tokens.space(2) },
  previewBtn: { minHeight: 36, paddingHorizontal: tokens.space(3), borderRadius: tokens.radius.md, alignItems: "center", justifyContent: "center" },
  previewBtnGhost: { borderWidth: 1, borderColor: tokens.color.border, backgroundColor: tokens.color.bg },
  previewBtnSaved: { backgroundColor: tokens.color.accent },
  previewBtnLabel: { fontSize: 12, fontWeight: "700" },
  previewBtnLabelGhost: { color: tokens.color.ink2 },
  previewBtnLabelSaved: { color: tokens.color.onAccent },

  /* empty state */
  empty: { marginTop: tokens.space(10), paddingHorizontal: tokens.space(5), alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.ink2, textAlign: "center" },
  emptyBody: { marginTop: 6, fontSize: 13, color: tokens.color.faint, textAlign: "center", lineHeight: 18 },
  emptyBtn: { marginTop: tokens.space(4), minHeight: 44, paddingHorizontal: tokens.space(5), borderRadius: tokens.radius.md, backgroundColor: tokens.color.accent, alignItems: "center", justifyContent: "center" },
  emptyBtnLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.onAccent },

  pressed: { opacity: 0.85 },
});
