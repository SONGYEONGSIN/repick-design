// native/src/evolve/r7/b/SearchResultsScreen.tsx — auto-native-r7 candidate b.
//
// Search Results (with active filters): the user has already run a text search across the
// catalog and is now refining it with facet filters — distinct from Discover (evolve-r6-b), which
// is a no-query browse feed. This screen foregrounds match-to-query relevance and applied-filter
// state, not open-ended browsing: single-column ranked rows (not a browse grid), a relevance meter
// + "Matches: …" line per row, and facets shown as individually REMOVABLE chips (not Discover's
// single-select radio chips, which can only be swapped, never cleared to "none").
//
// Chrome decision: this screen has no genuine terminal/blocking action — it is pure browse/refine,
// so per the r3/r5 rule ("fixed chrome earns its keep by doing work, not by existing") there is NO
// fixed bottom band. The top bar stays pinned, but only the compact strip that must remain reachable
// while results scroll — query, live result count, removable active-filter chips, and sort — because
// removing a chip or changing sort needs to work no matter how far down the list you are; it is a
// live read/write filter-state strip, not a decorative shell. The full facet picker ("Refine") is
// NOT pinned — it scrolls away as part of the list header, since adding a new facet is an occasional
// action that doesn't need permanent thumb reach the way "remove this filter" or "change sort" does.
//
// Currency: KRW figures use formatKRW (data.ts) and are never styled with fontVariant
// "tabular-nums" anywhere in this file — see the auto-native-r4 / auto-native-r6 deltas (₩ + RN Web
// tabular-nums renders a strikethrough-like artifact, and nesting the ₩ glyph as a descendant of a
// tabular-nums Text still triggers it even as a "sibling"). Simplest safe fix: don't use it here.
import { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import {
  BRAND_OPTIONS,
  CONDITION_OPTIONS,
  DEFAULT_FILTERS,
  DEFAULT_QUERY,
  PRICE_OPTIONS,
  RESULTS,
  SIZE_OPTIONS,
  daysAgoLabel,
  facetMatchCount,
  formatKRW,
  matchedFacetLabels,
  matchedTokens,
  matchesFilters,
  sortResults,
  tokenize,
  type Brand,
  type Condition,
  type Filters,
  type Item,
  type PriceBandKey,
  type Size,
  type SortKey,
} from "./data";
import { tokens } from "../../../tokens";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const SORT_OPTIONS: readonly { key: SortKey; label: string }[] = [
  { key: "relevance", label: "Relevance" },
  { key: "priceAsc", label: "Price: Low to High" },
  { key: "priceDesc", label: "Price: High to Low" },
  { key: "newest", label: "Newest" },
];

type ActiveChip = {
  key: string;
  label: string;
  remove: () => void;
};

/* ───────── small building blocks ───────── */

function RemovableChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Pressable
      onPress={onRemove}
      accessibilityRole="button"
      accessibilityLabel={`Remove filter: ${label}`}
      hitSlop={HIT_SLOP}
      style={({ pressed }) => [styles.activeChip, pressed && styles.pressed]}
    >
      <Text style={styles.activeChipLabel}>{label}</Text>
      <Text style={styles.activeChipRemove}>×</Text>
    </Pressable>
  );
}

function ToggleChip({
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
      style={({ pressed }) => [styles.toggleChip, selected && styles.toggleChipOn, pressed && styles.pressed]}
    >
      <Text style={[styles.toggleChipLabel, selected && styles.toggleChipLabelOn]}>
        {selected ? "✓ " : ""}
        {label}
      </Text>
    </Pressable>
  );
}

function SortRow({ value, onChange }: { value: SortKey; onChange: (k: SortKey) => void }) {
  return (
    <View style={styles.sortGroup}>
      <Text style={styles.sortLabel}>Sort</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {SORT_OPTIONS.map((opt) => (
          <ToggleChip key={opt.key} label={opt.label} selected={opt.key === value} onPress={() => onChange(opt.key)} />
        ))}
      </ScrollView>
    </View>
  );
}

/* ───────── relevance meter (0..3 filled segments, no color-only signal) ───────── */

function RelevanceMeter({ matched, total }: { matched: number; total: number }) {
  return (
    <View
      style={styles.meterRow}
      accessibilityLabel={`Matches ${matched} of ${total} search terms`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.meterSeg, i < matched && styles.meterSegOn]} />
      ))}
    </View>
  );
}

/* ───────── result row ───────── */

function ResultRow({ item, tokens: queryTokens, filters }: { item: Item; tokens: string[]; filters: Filters }) {
  const hits = matchedTokens(item, queryTokens);
  const facetLabels = matchedFacetLabels(item, filters);

  return (
    <View style={styles.row}>
      <View style={styles.monogram}>
        <Text style={styles.monogramText}>{item.monogram}</Text>
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={styles.rowTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <RelevanceMeter matched={hits.length} total={queryTokens.length} />
        </View>

        <Text style={styles.rowMeta}>
          {item.brand} · Size {item.size} · {item.condition} · {daysAgoLabel(item.daysAgo)}
        </Text>

        {hits.length > 0 && (
          <Text style={styles.matchLine}>
            Matches: <Text style={styles.matchLineStrong}>{hits.join(", ")}</Text>
          </Text>
        )}

        {facetLabels.length > 0 && (
          <View style={styles.facetTagRow}>
            {facetLabels.map((label) => (
              <View key={label} style={styles.facetTag}>
                <Text style={styles.facetTagLabel}>{label}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.priceWrap}>
          <Text style={styles.price}>{formatKRW(item.price)}</Text>
        </View>
      </View>
    </View>
  );
}

/* ───────── empty state ───────── */

function EmptyResults({ onReset }: { onReset: () => void }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>Nothing matches this search</Text>
      <Text style={styles.emptyBody}>
        Try removing a filter or broadening your search terms — the current combination has no results.
      </Text>
      <Pressable
        onPress={onReset}
        accessibilityRole="button"
        accessibilityLabel="Reset search to default query and filters"
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [styles.emptyBtn, pressed && styles.pressed]}
      >
        <Text style={styles.emptyBtnLabel}>Reset search</Text>
      </Pressable>
    </View>
  );
}

/* ───────── refine panel (facet picker) — scrolls with the list, not pinned ───────── */

function RefineSection<T extends string>({
  label,
  options,
  active,
  onToggle,
}: {
  label: string;
  options: readonly T[];
  active: readonly T[];
  onToggle: (value: T) => void;
}) {
  return (
    <View style={styles.refineSection}>
      <Text style={styles.refineSectionLabel}>{label}</Text>
      <View style={styles.chipWrap}>
        {options.map((opt) => (
          <ToggleChip key={opt} label={opt} selected={active.includes(opt)} onPress={() => onToggle(opt)} />
        ))}
      </View>
    </View>
  );
}

/* ───────── screen ───────── */

export function SearchResultsScreen() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [refineOpen, setRefineOpen] = useState(false);

  const queryTokens = useMemo(() => tokenize(query), [query]);

  const results = useMemo(() => {
    const matched = RESULTS.filter((item) => matchesFilters(item, filters, queryTokens));
    return sortResults(matched, sort, filters, queryTokens);
  }, [filters, sort, queryTokens]);

  const activeChips: ActiveChip[] = useMemo(() => {
    const chips: ActiveChip[] = [];
    filters.size.forEach((v) =>
      chips.push({
        key: `size-${v}`,
        label: `Size ${v}`,
        remove: () => setFilters((f) => ({ ...f, size: f.size.filter((x) => x !== v) })),
      })
    );
    filters.condition.forEach((v) =>
      chips.push({
        key: `cond-${v}`,
        label: v,
        remove: () => setFilters((f) => ({ ...f, condition: f.condition.filter((x) => x !== v) })),
      })
    );
    filters.price.forEach((v) => {
      const label = PRICE_OPTIONS.find((p) => p.key === v)?.label ?? v;
      chips.push({
        key: `price-${v}`,
        label,
        remove: () => setFilters((f) => ({ ...f, price: f.price.filter((x) => x !== v) })),
      });
    });
    filters.brand.forEach((v) =>
      chips.push({
        key: `brand-${v}`,
        label: v,
        remove: () => setFilters((f) => ({ ...f, brand: f.brand.filter((x) => x !== v) })),
      })
    );
    return chips;
  }, [filters]);

  const clearAll = () => setFilters({ size: [], condition: [], price: [], brand: [] });
  const resetSearch = () => {
    setQuery(DEFAULT_QUERY);
    setFilters(DEFAULT_FILTERS);
    setSort("relevance");
  };

  const toggleSize = (v: Size) =>
    setFilters((f) => ({ ...f, size: f.size.includes(v) ? f.size.filter((x) => x !== v) : [...f.size, v] }));
  const toggleCondition = (v: Condition) =>
    setFilters((f) => ({
      ...f,
      condition: f.condition.includes(v) ? f.condition.filter((x) => x !== v) : [...f.condition, v],
    }));
  const togglePrice = (v: PriceBandKey) =>
    setFilters((f) => ({ ...f, price: f.price.includes(v) ? f.price.filter((x) => x !== v) : [...f.price, v] }));
  const toggleBrand = (v: Brand) =>
    setFilters((f) => ({ ...f, brand: f.brand.includes(v) ? f.brand.filter((x) => x !== v) : [...f.brand, v] }));

  return (
    <SafeAreaView style={styles.root}>
      {/* pinned live filter-state strip — see file-top comment for why this band earns its keep */}
      <View style={styles.header}>
        <Text style={styles.h1} accessibilityRole="header">
          Search Results
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search the catalog"
          placeholderTextColor={tokens.color.faint}
          accessibilityLabel="Edit search query"
          style={styles.search}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        <Text style={styles.count} accessibilityLiveRegion="polite">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query || "…"}&rdquo;
        </Text>

        {activeChips.length > 0 ? (
          <View style={styles.activeRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {activeChips.map((chip) => (
                <RemovableChip key={chip.key} label={chip.label} onRemove={chip.remove} />
              ))}
              <Pressable
                onPress={clearAll}
                accessibilityRole="button"
                accessibilityLabel="Clear all filters"
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [styles.clearAllChip, pressed && styles.pressed]}
              >
                <Text style={styles.clearAllLabel}>Clear all</Text>
              </Pressable>
            </ScrollView>
          </View>
        ) : (
          <Text style={styles.noFilters}>No filters applied</Text>
        )}

        <SortRow value={sort} onChange={setSort} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Pressable
              onPress={() => setRefineOpen((v) => !v)}
              accessibilityRole="button"
              accessibilityState={{ expanded: refineOpen }}
              accessibilityLabel={
                refineOpen ? "Collapse refine filters panel" : `Expand refine filters panel, ${activeChips.length} active`
              }
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [styles.refineToggle, pressed && styles.pressed]}
            >
              <Text style={styles.refineToggleLabel}>
                {refineOpen ? "Hide filter options" : "Refine filters"}
                {activeChips.length > 0 ? ` (${activeChips.length} active)` : ""}
              </Text>
              <Text style={styles.refineToggleChevron}>{refineOpen ? "−" : "+"}</Text>
            </Pressable>

            {refineOpen && (
              <View style={styles.refinePanel}>
                <RefineSection label="Size" options={SIZE_OPTIONS} active={filters.size} onToggle={toggleSize} />
                <RefineSection
                  label="Condition"
                  options={CONDITION_OPTIONS}
                  active={filters.condition}
                  onToggle={toggleCondition}
                />
                <View style={styles.refineSection}>
                  <Text style={styles.refineSectionLabel}>Price</Text>
                  <View style={styles.chipWrap}>
                    {PRICE_OPTIONS.map((opt) => (
                      <ToggleChip
                        key={opt.key}
                        label={opt.label}
                        selected={filters.price.includes(opt.key)}
                        onPress={() => togglePrice(opt.key)}
                      />
                    ))}
                  </View>
                </View>
                <RefineSection label="Brand" options={BRAND_OPTIONS} active={filters.brand} onToggle={toggleBrand} />
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => <ResultRow item={item} tokens={queryTokens} filters={filters} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<EmptyResults onReset={resetSearch} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },

  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(10),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  h1: { fontSize: 26, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },

  search: {
    marginTop: tokens.space(3),
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    fontSize: 15,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },

  count: { marginTop: tokens.space(2), fontSize: 12, fontWeight: "600", color: tokens.color.muted },

  activeRow: { marginTop: tokens.space(2) },
  noFilters: { marginTop: tokens.space(2), fontSize: 12, color: tokens.color.faint, fontStyle: "italic" },

  chipRow: { flexDirection: "row", gap: tokens.space(2), paddingRight: tokens.space(2), alignItems: "center" },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space(2) },

  activeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 34,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
  },
  activeChipLabel: { fontSize: 12, fontWeight: "700", color: tokens.color.onAccent },
  activeChipRemove: { fontSize: 14, fontWeight: "800", color: tokens.color.onAccent, lineHeight: 14 },

  clearAllChip: {
    minHeight: 34,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  clearAllLabel: { fontSize: 12, fontWeight: "700", color: tokens.color.muted },

  toggleChip: {
    minHeight: 34,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  toggleChipOn: { borderWidth: 2, borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  toggleChipLabel: { fontSize: 12, fontWeight: "600", color: tokens.color.ink2 },
  toggleChipLabelOn: { color: tokens.color.onAccent, fontWeight: "800" },

  sortGroup: { marginTop: tokens.space(3) },
  sortLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  /* refine panel — scrolls with the list, see file-top chrome-decision comment */
  refineToggle: {
    marginHorizontal: tokens.space(5),
    marginTop: tokens.space(4),
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: tokens.color.bg,
  },
  refineToggleLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },
  refineToggleChevron: { fontSize: 16, fontWeight: "800", color: tokens.color.accent },

  refinePanel: {
    marginHorizontal: tokens.space(5),
    marginTop: tokens.space(3),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    gap: tokens.space(3),
  },
  refineSection: { gap: 6 },
  refineSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.faint,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  /* results */
  list: { paddingHorizontal: tokens.space(5), paddingTop: tokens.space(4), paddingBottom: tokens.space(10) },
  separator: { height: tokens.space(4) },

  row: { flexDirection: "row", gap: tokens.space(3) },
  monogram: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  monogramText: { fontSize: 15, fontWeight: "800", color: tokens.color.muted, letterSpacing: 0.5 },

  rowBody: { flex: 1 },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: tokens.space(2) },
  rowTitle: { flex: 1, fontSize: 14, fontWeight: "700", color: tokens.color.ink, lineHeight: 19 },

  meterRow: { flexDirection: "row", gap: 3, marginTop: 3 },
  meterSeg: { width: 12, height: 5, borderRadius: 2, backgroundColor: tokens.color.border },
  meterSegOn: { backgroundColor: tokens.color.accent },

  rowMeta: { marginTop: 4, fontSize: 12, color: tokens.color.faint },

  matchLine: { marginTop: 6, fontSize: 12, color: tokens.color.muted },
  matchLineStrong: { fontWeight: "700", color: tokens.color.ink2 },

  facetTagRow: { marginTop: 6, flexDirection: "row", flexWrap: "wrap", gap: 6 },
  facetTag: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: 3,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  facetTagLabel: { fontSize: 10, fontWeight: "700", color: tokens.color.accent },

  priceWrap: { marginTop: 8 },
  price: { fontSize: 15, fontWeight: "800", color: tokens.color.ink },

  /* empty state */
  empty: { marginTop: tokens.space(10), alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.ink2, textAlign: "center" },
  emptyBody: { marginTop: 6, fontSize: 13, color: tokens.color.faint, textAlign: "center", lineHeight: 18 },
  emptyBtn: {
    marginTop: tokens.space(4),
    minHeight: 44,
    paddingHorizontal: tokens.space(5),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBtnLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.onAccent },

  pressed: { opacity: 0.85 },
});
