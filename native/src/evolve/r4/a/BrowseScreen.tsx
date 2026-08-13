// native/src/evolve/r4/a/BrowseScreen.tsx — Search & Browse: the marketplace's main discovery
// surface. Distinct from Watchlist (only saved items) and AI Match (curated feed, no search) —
// this is a general searchable/filterable grid of every active listing.
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CATEGORIES,
  LISTINGS,
  PRICE_BANDS,
  SORTS,
  daysAgoLabel,
  matchesCategories,
  matchesPriceBand,
  matchesQuery,
  sortListings,
  usd,
  type Listing,
  type PriceBandId,
  type SortId,
} from "./data";

function ListingCard({
  item,
  saved,
  onToggleSave,
}: {
  item: Listing;
  saved: boolean;
  onToggleSave: (id: string) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.thumb}>
        <View
          style={[
            styles.swatchShape,
            {
              width: item.swatch.w,
              height: item.swatch.h,
              borderRadius:
                item.swatch.r === "md" ? tokens.radius.md : tokens.radius.sm,
            },
          ]}
        >
          {item.swatch.inner === "dot" ? <View style={styles.swatchDot} /> : null}
          {item.swatch.inner === "bar" ? <View style={styles.swatchBar} /> : null}
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Pressable
            onPress={() => onToggleSave(item.id)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityState={{ selected: saved }}
            accessibilityLabel={`${saved ? "Remove" : "Save"} ${item.title} ${
              saved ? "from" : "to"
            } your watchlist`}
            style={({ pressed }) => [
              styles.saveChip,
              saved && styles.saveChipOn,
              pressed && styles.saveChipPressed,
            ]}
          >
            <Text style={[styles.saveChipText, saved && styles.saveChipTextOn]}>
              {saved ? "Saved" : "Save"}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.cardPrice}>{usd(item.price)}</Text>

        <Text style={styles.cardMeta} numberOfLines={1}>
          {item.condition} &middot; {item.category}
        </Text>
        <Text style={styles.cardMeta} numberOfLines={1}>
          {item.location} &middot; {daysAgoLabel(item.postedDaysAgo)}
        </Text>
      </View>
    </View>
  );
}

export function BrowseScreen() {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceBand, setPriceBand] = useState<PriceBandId>("all");
  const [sort, setSort] = useState<SortId>("newest");
  const [saved, setSaved] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category],
    );
  };

  const toggleSave = (id: string) => {
    setSaved((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );
  };

  const filtered = useMemo(() => {
    return LISTINGS.filter(
      (item) =>
        matchesQuery(item, query) &&
        matchesCategories(item, selectedCategories) &&
        matchesPriceBand(item, priceBand),
    );
  }, [query, selectedCategories, priceBand]);

  const results = useMemo(() => sortListings(filtered, sort), [filtered, sort]);

  const filtersActive =
    query.trim().length > 0 || selectedCategories.length > 0 || priceBand !== "all";

  const clearFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setPriceBand("all");
  };

  const header = (
    <View style={styles.listHeader}>
      <View
        style={styles.chipRow}
        accessibilityLabel="Filter by category"
      >
        {CATEGORIES.map((category) => {
          const selected = selectedCategories.includes(category);
          return (
            <Pressable
              key={category}
              onPress={() => toggleCategory(category)}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Category: ${category}${selected ? ", selected" : ""}`}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipOn,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.chipRow} accessibilityLabel="Filter by price">
        {PRICE_BANDS.map((band) => {
          const selected = priceBand === band.id;
          return (
            <Pressable
              key={band.id}
              onPress={() => setPriceBand(band.id)}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Price: ${band.label}${selected ? ", selected" : ""}`}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipOn,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                {band.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sortRow} accessibilityLabel="Sort results">
        {SORTS.map((option) => {
          const selected = sort === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => setSort(option.id)}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Sort by ${option.label}${selected ? ", selected" : ""}`}
              style={({ pressed }) => [
                styles.sortChip,
                selected && styles.sortChipOn,
                pressed && styles.sortChipPressed,
              ]}
            >
              <Text
                style={[styles.sortChipText, selected && styles.sortChipTextOn]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {results.length} {results.length === 1 ? "result" : "results"}
          {saved.length > 0 ? ` · ${saved.length} saved` : ""}
        </Text>
        {filtersActive ? (
          <Pressable
            onPress={clearFilters}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search and filters"
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.clearButtonPressed,
            ]}
          >
            <Text style={styles.clearButtonText}>Clear filters</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.h1} accessibilityRole="header">
          Browse
        </Text>
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search listings, categories, places"
            placeholderTextColor={tokens.color.faint}
            accessibilityLabel="Search listings"
            style={styles.searchInput}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => setQuery("")}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Clear search text"
              style={({ pressed }) => [
                styles.clearTextButton,
                pressed && styles.clearTextButtonPressed,
              ]}
            >
              <Text style={styles.clearTextGlyph}>&times;</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard item={item} saved={saved.includes(item.id)} onToggleSave={toggleSave} />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No listings match</Text>
            <Text style={styles.emptyBody}>
              Try a different search term, or clear your filters to see everything.
            </Text>
            <Pressable
              onPress={clearFilters}
              accessibilityRole="button"
              accessibilityLabel="Clear search and filters"
              style={({ pressed }) => [
                styles.emptyButton,
                pressed && styles.emptyButtonPressed,
              ]}
            >
              <Text style={styles.emptyButtonText}>Clear filters</Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  topBar: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  h1: {
    fontSize: 28,
    fontWeight: "800",
    color: tokens.color.ink,
    letterSpacing: -0.5,
  },
  searchRow: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: tokens.color.ink,
    paddingVertical: tokens.space(2),
  },
  clearTextButton: {
    width: 28,
    height: 28,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: tokens.space(1),
  },
  clearTextButtonPressed: {
    backgroundColor: tokens.color.border,
  },
  clearTextGlyph: {
    fontSize: 18,
    lineHeight: 18,
    color: tokens.color.faint,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(10),
  },
  listHeader: {
    paddingTop: tokens.space(4),
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
    marginBottom: tokens.space(3),
  },
  chip: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  chipOn: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  chipPressed: {
    borderColor: tokens.color.ink2,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  chipTextOn: {
    color: tokens.color.onAccent,
  },
  sortRow: {
    flexDirection: "row",
    gap: tokens.space(2),
    marginBottom: tokens.space(4),
  },
  sortChip: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  sortChipOn: {
    borderColor: tokens.color.accent,
  },
  sortChipPressed: {
    borderColor: tokens.color.ink2,
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  sortChipTextOn: {
    color: tokens.color.accent,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    marginBottom: tokens.space(3),
  },
  summaryText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  clearButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  clearButtonPressed: {
    opacity: 0.6,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  card: {
    flexDirection: "row",
    gap: tokens.space(3),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  swatchShape: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.border,
  },
  swatchDot: {
    width: 14,
    height: 14,
    borderRadius: tokens.radius.md,
    borderWidth: 2,
    borderColor: tokens.color.bg,
  },
  swatchBar: {
    width: "52%",
    height: 4,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.bg,
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: tokens.space(2),
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    lineHeight: 19,
  },
  saveChip: {
    minHeight: 28,
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  saveChipOn: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  saveChipPressed: {
    borderColor: tokens.color.ink2,
  },
  saveChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  saveChipTextOn: {
    color: tokens.color.onAccent,
  },
  cardPrice: {
    marginTop: tokens.space(1),
    fontSize: 18,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  cardMeta: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.faint,
  },
  empty: {
    paddingTop: tokens.space(10),
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  emptyBody: {
    marginTop: tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: tokens.space(4),
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  emptyButtonPressed: {
    borderColor: tokens.color.ink2,
  },
  emptyButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
});
