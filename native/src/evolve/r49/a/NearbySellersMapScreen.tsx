// native/src/evolve/r49/a/NearbySellersMapScreen.tsx
// Nearby Sellers Map Browse — buyer-facing geographic discovery screen.
// Toggles between a stylized abstract "map" (fixed-position pins + distance
// rings, no map SDK) and a virtualized list, with a filter sheet (distance
// radius + category). Selection state is shared across both views: tapping a
// pin opens an inline callout that can jump to the matching list row, and
// tapping a list row can jump back to the matching pin on the map.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Modal,
  type ListRenderItemInfo,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  CATEGORY_FILTER_OPTIONS,
  CATEGORY_LABELS,
  DEFAULT_FILTERS,
  MAP_RINGS,
  NEARBY_SELLERS,
  RADIUS_OPTIONS,
  type AppliedFilters,
  type NearbySeller,
} from "./data";

/** How long a just-applied result-count announcement stays flagged as a live alert. */
const LIVE_MESSAGE_VISIBLE_MS = 2600;

/** Fixed row footprint used both for styling and for FlatList's getItemLayout. */
const SELLER_ROW_HEIGHT = 136;

function formatDistance(distanceMi: number): string {
  return `${distanceMi} mi`;
}

function describeAppliedFilters(filters: AppliedFilters): string {
  const categoryLabel =
    filters.category === "all" ? "all categories" : CATEGORY_LABELS[filters.category];
  return `${filters.radiusMi} mi, ${categoryLabel}`;
}

/** Pure filter predicate shared by the memoized list and the one-off apply-time recount. */
function sellerMatchesFilters(seller: NearbySeller, filters: AppliedFilters): boolean {
  const withinRadius = seller.distanceMi <= filters.radiusMi;
  const matchesCategory = filters.category === "all" || seller.category === filters.category;
  return withinRadius && matchesCategory;
}

interface MapCanvasProps {
  sellers: ReadonlyArray<NearbySeller>;
  selectedSeller: NearbySeller | null;
  onPinPress: (sellerId: string) => void;
  onViewInList: () => void;
  onDismissSelection: () => void;
  onResetFilters: () => void;
}

function MapCanvas({
  sellers,
  selectedSeller,
  onPinPress,
  onViewInList,
  onDismissSelection,
  onResetFilters,
}: MapCanvasProps) {
  return (
    <View style={styles.mapCanvasWrapper}>
      <View style={styles.mapCanvas}>
        <View
          style={styles.ringsLayer}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {MAP_RINGS.map((ring) => {
            const offsetPct = (100 - ring.sizePct) / 2;
            return (
              <View
                key={ring.label}
                style={[
                  styles.ring,
                  {
                    width: `${ring.sizePct}%`,
                    height: `${ring.sizePct}%`,
                    left: `${offsetPct}%`,
                    top: `${offsetPct}%`,
                  },
                ]}
              />
            );
          })}
          {MAP_RINGS.map((ring) => (
            <Text
              key={`${ring.label}-label`}
              style={[styles.ringLabel, { top: `${(100 - ring.sizePct) / 2 - 3}%` }]}
            >
              {ring.label}
            </Text>
          ))}
        </View>

        <View style={styles.youMarker} pointerEvents="none">
          <Text style={styles.youMarkerText}>You</Text>
        </View>

        {sellers.map((seller) => {
          const isSelected = selectedSeller?.id === seller.id;
          return (
            <Pressable
              key={seller.id}
              onPress={() => onPinPress(seller.id)}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityLabel={`${seller.name}, ${CATEGORY_LABELS[seller.category]}, ${formatDistance(
                seller.distanceMi,
              )} away${isSelected ? ", selected" : ""}`}
              accessibilityState={{ selected: isSelected }}
              style={[styles.pinHitArea, { left: `${seller.pinXPct}%`, top: `${seller.pinYPct}%` }]}
            >
              <View style={[styles.pinDot, isSelected && styles.pinDotSelected]} />
            </Pressable>
          );
        })}

        {sellers.length === 0 && (
          <View style={styles.mapEmptyOverlay}>
            <Text style={styles.emptyStateTitle}>No sellers match these filters</Text>
            <Text style={styles.emptyStateBody}>
              Try a wider distance or a different category.
            </Text>
            <Pressable
              onPress={onResetFilters}
              accessibilityRole="button"
              accessibilityLabel="Reset filters"
              hitSlop={8}
              style={styles.emptyStateButton}
            >
              <Text style={styles.emptyStateButtonText}>Reset filters</Text>
            </Pressable>
          </View>
        )}
      </View>

      {selectedSeller && (
        <View style={styles.calloutCard}>
          <View style={styles.calloutHeaderRow}>
            <Text style={styles.calloutName}>{selectedSeller.name}</Text>
            <Pressable
              onPress={onDismissSelection}
              accessibilityRole="button"
              accessibilityLabel="Dismiss seller details"
              hitSlop={10}
              style={styles.calloutDismiss}
            >
              <Text style={styles.calloutDismissText}>×</Text>
            </Pressable>
          </View>
          <Text style={styles.calloutMeta}>
            {CATEGORY_LABELS[selectedSeller.category]} · {formatDistance(selectedSeller.distanceMi)} ·{" "}
            {selectedSeller.itemCount} items
          </Text>
          <Text style={styles.calloutPrice}>{selectedSeller.priceRangeLabel}</Text>
          <Pressable
            onPress={onViewInList}
            accessibilityRole="button"
            accessibilityLabel={`View ${selectedSeller.name} in list`}
            hitSlop={8}
            style={styles.calloutButton}
          >
            <Text style={styles.calloutButtonText}>View in list</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function NearbySellersMapScreen() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<AppliedFilters>(DEFAULT_FILTERS);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const [isLiveAlertActive, setIsLiveAlertActive] = useState(false);

  const pendingScrollSellerId = useRef<string | null>(null);
  const liveMessageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<FlatList<NearbySeller>>(null);

  const filteredSellers = useMemo(
    () => NEARBY_SELLERS.filter((seller) => sellerMatchesFilters(seller, appliedFilters)),
    [appliedFilters],
  );

  const selectedSeller = useMemo(
    () => filteredSellers.find((seller) => seller.id === selectedSellerId) ?? null,
    [filteredSellers, selectedSellerId],
  );

  const hasActiveFilters =
    appliedFilters.radiusMi !== DEFAULT_FILTERS.radiusMi ||
    appliedFilters.category !== DEFAULT_FILTERS.category;

  const announceResultCount = useCallback((count: number, radiusMi: number) => {
    if (liveMessageTimer.current) {
      clearTimeout(liveMessageTimer.current);
    }
    const message =
      count === 1
        ? `Showing 1 seller within ${radiusMi} mi.`
        : `Showing ${count} sellers within ${radiusMi} mi.`;
    setLiveMessage(message);
    setIsLiveAlertActive(true);
    liveMessageTimer.current = setTimeout(() => {
      setIsLiveAlertActive(false);
      setLiveMessage("");
    }, LIVE_MESSAGE_VISIBLE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (liveMessageTimer.current) {
        clearTimeout(liveMessageTimer.current);
      }
    };
  }, []);

  const openFilterSheet = useCallback(() => {
    setDraftFilters(appliedFilters);
    setIsFilterSheetOpen(true);
  }, [appliedFilters]);

  const closeFilterSheetWithoutApplying = useCallback(() => {
    setIsFilterSheetOpen(false);
  }, []);

  const applyFilterSheet = useCallback(() => {
    const nextCount = NEARBY_SELLERS.filter((seller) =>
      sellerMatchesFilters(seller, draftFilters),
    ).length;
    setAppliedFilters(draftFilters);
    setIsFilterSheetOpen(false);
    setSelectedSellerId((currentId) => {
      if (!currentId) return currentId;
      const current = NEARBY_SELLERS.find((seller) => seller.id === currentId);
      if (current && sellerMatchesFilters(current, draftFilters)) return currentId;
      return null;
    });
    announceResultCount(nextCount, draftFilters.radiusMi);
  }, [draftFilters, announceResultCount]);

  const resetFilters = useCallback(() => {
    setAppliedFilters(DEFAULT_FILTERS);
    setDraftFilters(DEFAULT_FILTERS);
    setSelectedSellerId(null);
    announceResultCount(NEARBY_SELLERS.length, DEFAULT_FILTERS.radiusMi);
  }, [announceResultCount]);

  const handlePinPress = useCallback((sellerId: string) => {
    setSelectedSellerId(sellerId);
  }, []);

  const handleDismissSelection = useCallback(() => {
    setSelectedSellerId(null);
  }, []);

  const handleViewInList = useCallback(() => {
    if (!selectedSellerId) return;
    pendingScrollSellerId.current = selectedSellerId;
    setViewMode("list");
  }, [selectedSellerId]);

  const handleSelectRow = useCallback((sellerId: string) => {
    setSelectedSellerId((current) => (current === sellerId ? null : sellerId));
  }, []);

  const handleViewOnMap = useCallback((sellerId: string) => {
    setSelectedSellerId(sellerId);
    setViewMode("map");
  }, []);

  // When a pin's "View in list" callout switches us into list mode, scroll the
  // matching row into view. Runs after the FlatList (re)mounts for this mode.
  useEffect(() => {
    if (viewMode !== "list") return;
    const targetId = pendingScrollSellerId.current;
    if (!targetId) return;
    pendingScrollSellerId.current = null;
    const index = filteredSellers.findIndex((seller) => seller.id === targetId);
    if (index < 0) return;
    const scrollTimer = setTimeout(() => {
      try {
        listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.25 });
      } catch {
        // scrollToIndex can reject before the first layout pass settles; the
        // row remains reachable by manual scroll, so this is safe to ignore.
      }
    }, 60);
    return () => clearTimeout(scrollTimer);
  }, [viewMode, filteredSellers]);

  const getSellerRowLayout = useCallback(
    (_data: ArrayLike<NearbySeller> | null | undefined, index: number) => ({
      length: SELLER_ROW_HEIGHT,
      offset: SELLER_ROW_HEIGHT * index,
      index,
    }),
    [],
  );

  const renderSellerRow = useCallback(
    ({ item }: ListRenderItemInfo<NearbySeller>) => {
      const isSelected = item.id === selectedSellerId;
      return (
        <Pressable
          onPress={() => handleSelectRow(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`${item.name}, ${CATEGORY_LABELS[item.category]}, ${formatDistance(
            item.distanceMi,
          )} away, ${item.itemCount} items, ${item.priceRangeLabel}${
            isSelected ? ", selected" : ""
          }`}
          accessibilityState={{ selected: isSelected }}
          style={[styles.sellerRow, isSelected && styles.sellerRowSelected]}
        >
          <View style={styles.sellerRowHeaderLine}>
            <Text style={styles.sellerName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.sellerDistance}>{formatDistance(item.distanceMi)}</Text>
          </View>
          <Text style={styles.sellerMeta}>
            {CATEGORY_LABELS[item.category]} · {item.itemCount} items · {item.priceRangeLabel}
          </Text>
          <Text style={styles.sellerMeetupNote} numberOfLines={1}>
            {item.meetupNote}
          </Text>
          <Pressable
            onPress={() => handleViewOnMap(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`View ${item.name} on map`}
            hitSlop={8}
            style={styles.sellerRowMapButton}
          >
            <Text style={styles.sellerRowMapButtonText}>View on map</Text>
          </Pressable>
        </Pressable>
      );
    },
    [selectedSellerId, handleSelectRow, handleViewOnMap],
  );

  const renderListEmptyState = useCallback(
    () => (
      <View style={styles.listEmptyState}>
        <Text style={styles.emptyStateTitle}>No sellers match these filters</Text>
        <Text style={styles.emptyStateBody}>Try a wider distance or a different category.</Text>
        <Pressable
          onPress={resetFilters}
          accessibilityRole="button"
          accessibilityLabel="Reset filters"
          hitSlop={8}
          style={styles.emptyStateButton}
        >
          <Text style={styles.emptyStateButtonText}>Reset filters</Text>
        </Pressable>
      </View>
    ),
    [resetFilters],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.headingText}>
          Browse Nearby Sellers
        </Text>
        <Text style={styles.subheadingText}>
          Meetup-eligible listings from sellers around you
        </Text>
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.segmentedControl}>
          <Pressable
            onPress={() => setViewMode("map")}
            accessibilityRole="button"
            accessibilityState={{ selected: viewMode === "map" }}
            accessibilityLabel="Map view"
            hitSlop={6}
            style={[styles.segmentButton, viewMode === "map" && styles.segmentButtonActive]}
          >
            <Text
              style={[styles.segmentButtonText, viewMode === "map" && styles.segmentButtonTextActive]}
            >
              Map
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode("list")}
            accessibilityRole="button"
            accessibilityState={{ selected: viewMode === "list" }}
            accessibilityLabel="List view"
            hitSlop={6}
            style={[styles.segmentButton, viewMode === "list" && styles.segmentButtonActive]}
          >
            <Text
              style={[
                styles.segmentButtonText,
                viewMode === "list" && styles.segmentButtonTextActive,
              ]}
            >
              List
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={openFilterSheet}
          accessibilityRole="button"
          accessibilityLabel={
            hasActiveFilters
              ? `Open filters, currently ${describeAppliedFilters(appliedFilters)}`
              : "Open filters"
          }
          hitSlop={6}
          style={styles.filterButton}
        >
          <Text style={styles.filterButtonText}>Filters</Text>
          {hasActiveFilters && <View style={styles.filterButtonBadge} />}
        </Pressable>
      </View>

      <View accessibilityLiveRegion="polite" style={styles.liveRegion}>
        <Text
          accessibilityRole={isLiveAlertActive ? "alert" : undefined}
          style={styles.liveRegionText}
        >
          {liveMessage}
        </Text>
      </View>

      {viewMode === "map" ? (
        <MapCanvas
          sellers={filteredSellers}
          selectedSeller={selectedSeller}
          onPinPress={handlePinPress}
          onViewInList={handleViewInList}
          onDismissSelection={handleDismissSelection}
          onResetFilters={resetFilters}
        />
      ) : (
        <FlatList
          ref={listRef}
          data={filteredSellers}
          keyExtractor={(item) => item.id}
          renderItem={renderSellerRow}
          getItemLayout={getSellerRowLayout}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderListEmptyState}
        />
      )}

      <Modal
        visible={isFilterSheetOpen}
        animationType="slide"
        transparent
        onRequestClose={closeFilterSheetWithoutApplying}
      >
        <View style={styles.sheetScrim}>
          <Pressable
            style={styles.sheetScrimPressable}
            onPress={closeFilterSheetWithoutApplying}
            accessibilityRole="button"
            accessibilityLabel="Close filters"
          />
          <View style={styles.sheetPanel}>
            <Text accessibilityRole="header" style={styles.sheetTitle}>
              Filter nearby sellers
            </Text>

            <Text style={styles.sheetSectionLabel}>Distance</Text>
            <View style={styles.chipRow}>
              {RADIUS_OPTIONS.map((radius) => {
                const isActive = draftFilters.radiusMi === radius;
                return (
                  <Pressable
                    key={radius}
                    onPress={() => setDraftFilters((prev) => ({ ...prev, radiusMi: radius }))}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={`Within ${radius} miles${isActive ? ", selected" : ""}`}
                    hitSlop={6}
                    style={[styles.chip, isActive && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {radius} mi
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sheetSectionLabel}>Category</Text>
            <View style={styles.chipRowWrap}>
              {CATEGORY_FILTER_OPTIONS.map((option) => {
                const isActive = draftFilters.category === option.key;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setDraftFilters((prev) => ({ ...prev, category: option.key }))}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={`${option.label}${isActive ? ", selected" : ""}`}
                    hitSlop={6}
                    style={[styles.chip, isActive && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.sheetActionsRow}>
              <Pressable
                onPress={closeFilterSheetWithoutApplying}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                hitSlop={8}
                style={styles.sheetCancelButton}
              >
                <Text style={styles.sheetCancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={applyFilterSheet}
                accessibilityRole="button"
                accessibilityLabel="Apply filters"
                hitSlop={8}
                style={styles.sheetApplyButton}
              >
                <Text style={styles.sheetApplyButtonText}>Apply filters</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: tokens.space(2),
  },
  headingText: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheadingText: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(2),
    gap: tokens.space(2),
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.md,
    padding: tokens.space(1),
  },
  segmentButton: {
    minHeight: 40,
    minWidth: 64,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
  },
  segmentButtonActive: {
    backgroundColor: tokens.color.accent,
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  segmentButtonTextActive: {
    color: tokens.color.onAccent,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  filterButtonBadge: {
    marginLeft: tokens.space(2),
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.color.accent,
  },
  liveRegion: {
    minHeight: 20,
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(1),
  },
  liveRegionText: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  mapCanvasWrapper: {
    flex: 1,
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  mapCanvas: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.accentBg,
    overflow: "hidden",
    position: "relative",
  },
  ringsLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: 999,
  },
  ringLabel: {
    position: "absolute",
    left: "50%",
    marginLeft: -18,
    width: 36,
    textAlign: "center",
    fontSize: 10,
    color: tokens.color.faint,
  },
  youMarker: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -16,
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  youMarkerText: {
    fontSize: 10,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  pinHitArea: {
    position: "absolute",
    width: 44,
    height: 44,
    marginLeft: -22,
    marginTop: -22,
    alignItems: "center",
    justifyContent: "center",
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: tokens.color.accent,
    borderWidth: 2,
    borderColor: tokens.color.bg,
  },
  pinDotSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: tokens.color.ink,
  },
  mapEmptyOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(6),
    backgroundColor: tokens.color.scrimLight,
  },
  calloutCard: {
    marginTop: tokens.space(3),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  calloutHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  calloutName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  calloutDismiss: {
    width: 44,
    height: 44,
    marginTop: -tokens.space(2),
    marginRight: -tokens.space(2),
    alignItems: "center",
    justifyContent: "center",
  },
  calloutDismissText: {
    fontSize: 20,
    color: tokens.color.faint,
  },
  calloutMeta: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  calloutPrice: {
    marginTop: tokens.space(1),
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  calloutButton: {
    marginTop: tokens.space(3),
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  calloutButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  sellerRow: {
    height: SELLER_ROW_HEIGHT - tokens.space(3),
    marginBottom: tokens.space(3),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  sellerRowSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  sellerRowHeaderLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sellerName: {
    flex: 1,
    marginRight: tokens.space(2),
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sellerDistance: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  sellerMeta: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  sellerMeetupNote: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.faint,
  },
  sellerRowMapButton: {
    marginTop: tokens.space(2),
    alignSelf: "flex-start",
    minHeight: 32,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  sellerRowMapButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  listEmptyState: {
    marginTop: tokens.space(10),
    alignItems: "center",
    paddingHorizontal: tokens.space(6),
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    textAlign: "center",
  },
  emptyStateBody: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
    textAlign: "center",
  },
  emptyStateButton: {
    marginTop: tokens.space(3),
    minHeight: 44,
    paddingHorizontal: tokens.space(5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  sheetScrim: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: tokens.color.scrimDark,
  },
  sheetScrimPressable: {
    flex: 1,
  },
  sheetPanel: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(5),
    paddingBottom: tokens.space(8),
    borderTopLeftRadius: tokens.radius.md,
    borderTopRightRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sheetSectionLabel: {
    marginTop: tokens.space(5),
    marginBottom: tokens.space(2),
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  chipRow: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  chipRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  chipActive: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  chipTextActive: {
    color: tokens.color.onAccent,
  },
  sheetActionsRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    marginTop: tokens.space(6),
  },
  sheetCancelButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  sheetCancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  sheetApplyButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  sheetApplyButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
