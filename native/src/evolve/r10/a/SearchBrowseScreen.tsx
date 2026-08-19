import { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  RefreshControl,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { tokens } from "../../../tokens";
import { CATEGORIES, LISTINGS, formatKRW, type Category, type Listing } from "./data";

const H_PADDING = tokens.space(5);
const GRID_GAP = tokens.space(3);
const REFRESH_DELAY_MS = 700; // fixed deterministic delay — no Date.now/random involved

// ---- icons (react-native-svg, no emoji) ----------------------------------

function SearchIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx={10.5} cy={10.5} r={7} stroke={tokens.color.faint} strokeWidth={2} />
      <Line x1={20} y1={20} x2={15.5} y2={15.5} stroke={tokens.color.faint} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ClearIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={tokens.color.faint} strokeWidth={1.5} />
      <Path d="M9 9L15 15M15 9L9 15" stroke={tokens.color.faint} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  const d =
    "M12 20.5c-.24 0-.47-.08-.66-.23-1.06-.85-2.08-1.63-2.98-2.32l-.01-.01c-2.7-2.06-5.03-3.85-6.58-5.86C.09 9.9-.35 7.66.5 5.68 1.36 3.68 3.3 2.4 5.46 2.4c1.7 0 3.31.86 4.54 2.42 1.23-1.56 2.84-2.42 4.54-2.42 2.17 0 4.1 1.28 4.96 3.28.85 1.98.41 4.22-1.27 6.43-1.55 2.01-3.88 3.8-6.58 5.86l-.01.01c-.9.69-1.92 1.47-2.98 2.32-.19.15-.42.23-.66.23z";
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Path
        d={d}
        fill={filled ? tokens.color.accent : "none"}
        stroke={filled ? tokens.color.accent : tokens.color.faint}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PhotoIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
        stroke={tokens.color.faint}
        strokeWidth={1.6}
      />
      <Circle cx={9} cy={10} r={1.6} fill={tokens.color.faint} />
      <Path d="M4 17l5-5 4 4 3.5-4.5L20 16" stroke={tokens.color.faint} strokeWidth={1.6} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function PullHintIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4v13" stroke={tokens.color.faint} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M6 12l6 6 6-6" stroke={tokens.color.faint} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EmptyBoxIcon() {
  return (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path d="M3 8l9-4 9 4-9 4-9-4z" stroke={tokens.color.faint} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M3 8v9l9 4V12L3 8z" stroke={tokens.color.faint} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M21 8v9l-9 4V12l9-4z" stroke={tokens.color.faint} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}

// ---- product card ----------------------------------------------------------

function ProductCard({
  item,
  width,
  saved,
  onToggleSave,
}: {
  item: Listing;
  width: number;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.imageBox}>
        <PhotoIcon />
        <Pressable
          onPress={onToggleSave}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          accessibilityRole="button"
          accessibilityState={{ selected: saved }}
          accessibilityLabel={saved ? `Remove ${item.title} from saved items` : `Save ${item.title}`}
          style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
        >
          <HeartIcon filled={saved} />
        </Pressable>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardPrice}>{formatKRW(item.price)}</Text>
      </View>
    </View>
  );
}

// ---- category filter chip ---------------------------------------------------

function CategoryChip({
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
      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label} filter, ${selected ? "on" : "off"}`}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipOn : styles.chipOff,
        pressed && styles.chipPressed,
      ]}
    >
      <Text style={[styles.chipLabel, selected ? styles.chipLabelOn : styles.chipLabelOff]}>{label}</Text>
    </Pressable>
  );
}

// ---- screen ------------------------------------------------------------------

export function SearchBrowseScreen() {
  const { width: winWidth } = useWindowDimensions();
  const cardWidth = (winWidth - H_PADDING * 2 - GRID_GAP) / 2;

  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(
    new Set(LISTINGS.filter((l) => l.savedInitial).map((l) => l.id)),
  );
  const [refreshing, setRefreshing] = useState(false);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setQuery("");
  };

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Fixed delay to simulate a fetch — deterministic, not tied to Date.now/random.
    setTimeout(() => setRefreshing(false), REFRESH_DELAY_MS);
  };

  const trimmedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      LISTINGS.filter((l) => {
        const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(l.category);
        const matchesQuery = trimmedQuery === "" || l.title.toLowerCase().includes(trimmedQuery);
        return matchesCategory && matchesQuery;
      }),
    [trimmedQuery, selectedCategories],
  );

  const allSelected = selectedCategories.size === 0;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.h1} accessibilityRole="header">
          Browse
        </Text>

        <View style={styles.searchBar}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search listings"
            placeholderTextColor={tokens.color.faint}
            accessibilityLabel="Search listings"
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery("")}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
              accessibilityRole="button"
              accessibilityLabel="Clear search text"
            >
              <ClearIcon />
            </Pressable>
          )}
        </View>

        <View style={styles.chipsRow}>
          <CategoryChip label="All" selected={allSelected} onPress={clearFilters} />
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              selected={selectedCategories.has(cat)}
              onPress={() => toggleCategory(cat)}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={tokens.color.accent} colors={[tokens.color.accent]} />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.pullHint}>
              <PullHintIcon />
              <Text style={styles.pullHintText}>Pull down to refresh</Text>
            </View>
            {filtered.length > 0 && (
              <Text style={styles.resultCount}>
                {filtered.length} {filtered.length === 1 ? "result" : "results"}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            width={cardWidth}
            saved={savedIds.has(item.id)}
            onToggleSave={() => toggleSaved(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox} accessibilityLiveRegion="polite">
            <EmptyBoxIcon />
            <Text style={styles.emptyTitle} accessibilityRole="alert">
              No listings match your search
            </Text>
            <Text style={styles.emptyBody}>Try a different keyword or clear your filters to see everything.</Text>
            <Pressable
              onPress={clearFilters}
              accessibilityRole="button"
              accessibilityLabel="Clear all filters and search text"
              style={({ pressed }) => [styles.clearFiltersBtn, pressed && styles.clearFiltersBtnPressed]}
            >
              <Text style={styles.clearFiltersLabel}>Clear filters</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },

  header: {
    paddingTop: tokens.space(10),
    paddingHorizontal: H_PADDING,
    paddingBottom: tokens.space(3),
    gap: tokens.space(3),
  },
  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    minHeight: 48,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
  },
  searchInput: { flex: 1, fontSize: 15, color: tokens.color.ink, paddingVertical: tokens.space(2) },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space(2) },
  chip: {
    minHeight: 36,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    borderRadius: tokens.radius.md,
    justifyContent: "center",
  },
  chipOn: { backgroundColor: tokens.color.accent },
  chipOff: { backgroundColor: tokens.color.bg, borderWidth: 1, borderColor: tokens.color.border },
  chipPressed: { opacity: 0.6 },
  chipLabel: { fontSize: 13, fontWeight: "600" },
  chipLabelOn: { color: tokens.color.onAccent },
  chipLabelOff: { color: tokens.color.ink2 },

  listHeader: { paddingHorizontal: H_PADDING, paddingBottom: tokens.space(3), gap: tokens.space(2) },
  pullHint: { flexDirection: "row", alignItems: "center", gap: tokens.space(1), alignSelf: "center" },
  pullHintText: { fontSize: 11, color: tokens.color.faint },
  resultCount: { fontSize: 13, color: tokens.color.muted },

  gridContent: { paddingHorizontal: H_PADDING, paddingBottom: tokens.space(10), flexGrow: 1 },
  gridRow: { gap: GRID_GAP, marginBottom: GRID_GAP },

  card: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  imageBox: {
    aspectRatio: 1,
    backgroundColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    position: "absolute",
    top: tokens.space(2),
    right: tokens.space(2),
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnPressed: { opacity: 0.6 },
  cardBody: { padding: tokens.space(3), gap: 4 },
  cardTitle: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2, lineHeight: 18, minHeight: 36 },
  cardPrice: { fontSize: 15, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },

  emptyBox: { alignItems: "center", paddingTop: tokens.space(10), paddingHorizontal: tokens.space(8), gap: tokens.space(2) },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.ink, marginTop: tokens.space(2), textAlign: "center" },
  emptyBody: { fontSize: 13, color: tokens.color.muted, textAlign: "center", lineHeight: 19 },
  clearFiltersBtn: {
    marginTop: tokens.space(3),
    minHeight: 44,
    paddingHorizontal: tokens.space(5),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  clearFiltersBtnPressed: { opacity: 0.6 },
  clearFiltersLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.accent },
});
