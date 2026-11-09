// native/src/evolve/r53/c/SizeReferenceScreen.tsx
//
// Lane "c": prove a screen can be complete, rich and interactive with ZERO
// persistent bottom surface. This is a browse/lookup reference tool for
// secondhand clothing/shoe sizing — a shopper flips between brands' sizing
// before making an offer. There is nothing to "finish": completeness is
// just "found the chart you needed", which ordinary filtering, searching,
// sorting and expanding already delivers. No band, no multi-select, no
// checklist/gate of any kind lives on this screen.

import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  TextInput,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { fitGuides, FitCategory, FitGuide, FitRow } from "./data";

const CATEGORY_FILTERS: Array<FitCategory | "All"> = [
  "All",
  "Tops",
  "Bottoms",
  "Shoes",
  "Outerwear",
];

type UnitMode = "metric" | "imperial";
type OrderMode = "catalog" | "alphabetical";

function guideMatchesQuery(guide: FitGuide, query: string): boolean {
  if (query.trim().length === 0) return true;
  const haystack = `${guide.garmentName} ${guide.category}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

export default function SizeReferenceScreen() {
  const [activeCategory, setActiveCategory] = useState<FitCategory | "All">(
    "All"
  );
  const [searchText, setSearchText] = useState("");
  const [orderMode, setOrderMode] = useState<OrderMode>("catalog");
  const [unitMode, setUnitMode] = useState<UnitMode>("metric");
  const [expandedGuideIds, setExpandedGuideIds] = useState<Set<string>>(
    new Set()
  );

  const visibleGuides = useMemo(() => {
    const filtered = fitGuides.filter((guide) => {
      const categoryOk =
        activeCategory === "All" || guide.category === activeCategory;
      return categoryOk && guideMatchesQuery(guide, searchText);
    });

    if (orderMode === "alphabetical") {
      return [...filtered].sort((a, b) =>
        a.garmentName.localeCompare(b.garmentName)
      );
    }
    return filtered;
  }, [activeCategory, searchText, orderMode]);

  const resultSummary = useMemo(() => {
    const count = visibleGuides.length;
    if (count === 0) return "No size charts match this filter.";
    if (count === 1) return "1 size chart found.";
    return `${count} size charts found.`;
  }, [visibleGuides.length]);

  const handleSelectCategory = useCallback((category: FitCategory | "All") => {
    setActiveCategory(category);
  }, []);

  const handleToggleOrderMode = useCallback(() => {
    setOrderMode((current) =>
      current === "catalog" ? "alphabetical" : "catalog"
    );
  }, []);

  const handleSelectUnitMode = useCallback((mode: UnitMode) => {
    setUnitMode(mode);
  }, []);

  const handleToggleGuideExpanded = useCallback((guideId: string) => {
    setExpandedGuideIds((current) => {
      const next = new Set(current);
      if (next.has(guideId)) {
        next.delete(guideId);
      } else {
        next.add(guideId);
      }
      return next;
    });
  }, []);

  const renderFitRow = useCallback(
    (row: FitRow) => {
      const value = unitMode === "metric" ? row.metricValue : row.imperialValue;
      return (
        <View style={styles.chartRow} key={row.label}>
          <Text style={styles.chartRowLabel}>{row.label}</Text>
          <Text style={styles.chartRowValue} fontVariant={["tabular-nums"]}>
            {value}
          </Text>
        </View>
      );
    },
    [unitMode]
  );

  const renderGuideCard = useCallback(
    ({ item }: { item: FitGuide }) => {
      const isExpanded = expandedGuideIds.has(item.id);
      return (
        <View style={styles.guideCard}>
          <Pressable
            onPress={() => handleToggleGuideExpanded(item.id)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityState={{ expanded: isExpanded }}
            accessibilityHint={
              isExpanded
                ? "Collapses this size chart."
                : "Expands to show the full size chart."
            }
            style={styles.guideCardHeader}
          >
            <View style={styles.guideCardHeaderText}>
              <Text style={styles.guideCardTitle}>{item.garmentName}</Text>
              <Text style={styles.guideCardMeta}>
                {item.category} · {item.rows.length} sizes
              </Text>
            </View>
            <Text style={styles.guideCardChevron} accessibilityElementsHidden>
              {isExpanded ? "–" : "+"}
            </Text>
          </Pressable>

          {isExpanded ? (
            <View style={styles.guideCardBody}>
              <Text style={styles.guideCardHelperNote}>{item.helperNote}</Text>
              <View style={styles.chartHeaderRow}>
                <Text style={styles.chartHeaderLabel}>Size</Text>
                <Text style={styles.chartHeaderValue}>
                  {item.measuresLabel}
                </Text>
              </View>
              {item.rows.map((row) => renderFitRow(row))}
            </View>
          ) : null}
        </View>
      );
    },
    [expandedGuideIds, handleToggleGuideExpanded, renderFitRow]
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerBlock}>
        <Text accessibilityRole="header" style={styles.headerTitle}>
          Size & Fit Reference
        </Text>
        <Text style={styles.headerSubtitle}>
          Browse sizing across brands before you message a seller.
        </Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder='Search garment type, e.g. "coats"'
          placeholderTextColor={tokens.color.faint}
          style={styles.searchInput}
          accessibilityLabel="Search size charts by garment type"
          autoCorrect={false}
        />
      </View>

      <View style={styles.chipRow}>
        {CATEGORY_FILTERS.map((category) => {
          const isActive = category === activeCategory;
          return (
            <Pressable
              key={category}
              onPress={() => handleSelectCategory(category)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={[styles.chip, isActive ? styles.chipActive : null]}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive ? styles.chipTextActive : null,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.controlsRow}>
        <Pressable
          onPress={handleToggleOrderMode}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={
            orderMode === "catalog"
              ? "Sort order: catalog order. Double tap to sort A to Z."
              : "Sort order: A to Z. Double tap to sort by catalog order."
          }
          style={styles.sortButton}
        >
          <Text style={styles.sortButtonText}>
            Sort: {orderMode === "catalog" ? "Catalog order" : "A–Z"}
          </Text>
        </Pressable>

        <View style={styles.unitToggleGroup}>
          <Pressable
            onPress={() => handleSelectUnitMode("metric")}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityState={{ selected: unitMode === "metric" }}
            style={[
              styles.unitToggleButton,
              unitMode === "metric" ? styles.unitToggleButtonActive : null,
            ]}
          >
            <Text
              style={[
                styles.unitToggleText,
                unitMode === "metric" ? styles.unitToggleTextActive : null,
              ]}
            >
              cm
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleSelectUnitMode("imperial")}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityState={{ selected: unitMode === "imperial" }}
            style={[
              styles.unitToggleButton,
              unitMode === "imperial" ? styles.unitToggleButtonActive : null,
            ]}
          >
            <Text
              style={[
                styles.unitToggleText,
                unitMode === "imperial" ? styles.unitToggleTextActive : null,
              ]}
            >
              in
            </Text>
          </Pressable>
        </View>
      </View>

      <View accessibilityLiveRegion="polite" style={styles.summaryRow}>
        <Text accessibilityRole="alert" style={styles.summaryText}>
          {resultSummary}
        </Text>
      </View>

      <FlatList
        data={visibleGuides}
        keyExtractor={(item) => item.id}
        renderItem={renderGuideCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No matching charts</Text>
            <Text style={styles.emptyStateBody}>
              Try a different category, or clear the search text above.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerBlock: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(2),
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  headerSubtitle: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  searchRow: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  searchInput: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2.5),
    fontSize: 15,
    color: tokens.color.ink,
    backgroundColor: tokens.color.bg,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: tokens.space(3),
    paddingBottom: tokens.space(2),
    gap: tokens.space(2),
  },
  chip: {
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    minHeight: 36,
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  chipTextActive: {
    color: tokens.color.accent,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  sortButton: {
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    borderRadius: tokens.radius.sm,
    minHeight: 44,
    justifyContent: "center",
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  unitToggleGroup: {
    flexDirection: "row",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    overflow: "hidden",
  },
  unitToggleButton: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(2),
    minHeight: 40,
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.color.bg,
  },
  unitToggleButtonActive: {
    backgroundColor: tokens.color.accent,
  },
  unitToggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.muted,
  },
  unitToggleTextActive: {
    color: tokens.color.onAccent,
  },
  summaryRow: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  summaryText: {
    fontSize: 13,
    color: tokens.color.faint,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
    gap: tokens.space(3),
  },
  guideCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
    overflow: "hidden",
  },
  guideCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    minHeight: 44,
  },
  guideCardHeaderText: {
    flex: 1,
    paddingRight: tokens.space(2),
  },
  guideCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  guideCardMeta: {
    marginTop: tokens.space(0.5),
    fontSize: 12,
    color: tokens.color.faint,
  },
  guideCardChevron: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.accent,
    width: 24,
    textAlign: "center",
  },
  guideCardBody: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  guideCardHelperNote: {
    marginTop: tokens.space(2),
    marginBottom: tokens.space(2),
    fontSize: 12,
    color: tokens.color.muted,
  },
  chartHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: tokens.space(1.5),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  chartHeaderLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  chartHeaderValue: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  chartRowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  chartRowValue: {
    fontSize: 14,
    color: tokens.color.ink,
  },
  emptyState: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(8),
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  emptyStateBody: {
    fontSize: 13,
    color: tokens.color.muted,
    textAlign: "center",
  },
});
