// native/src/evolve/r37/c/BundleDealBuilderScreen.tsx
//
// Bundle Deal Builder — a seller picks 2 or more of their OWN active
// listings from a two-column grid; a checkbox ring on each tile tracks
// selection. Selection-count-derived contextual bar (brief §3 / GENERATION
// §3): the bar does not exist at 0 selected, appears from 1 selected,
// spells out the ">= 2" requirement explicitly in its own copy, and lives
// inside one polite live region that both narrates the running count/price
// and, only at the moment the bundle becomes possible/impossible, carries a
// cleared alert sentence.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  sellerActiveListings,
  conditionLabel,
  computeBundleQuote,
  formatWon,
  type SellerListing,
} from "./data";

const MIN_BUNDLE_SIZE = 2;

export function BundleDealBuilderScreen() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [draftTally, setDraftTally] = useState(0);
  const [cueText, setCueText] = useState("");
  const cueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (cueTimerRef.current) clearTimeout(cueTimerRef.current);
    };
  }, []);

  const raiseCue = useCallback((message: string) => {
    if (cueTimerRef.current) clearTimeout(cueTimerRef.current);
    setCueText(message);
    cueTimerRef.current = setTimeout(() => setCueText(""), 4200);
  }, []);

  const toggleListing = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectedListings = useMemo(
    () => sellerActiveListings.filter((listing) => selectedIds.has(listing.id)),
    [selectedIds]
  );
  const selectedCount = selectedListings.length;
  const quote = useMemo(() => computeBundleQuote(selectedListings), [selectedListings]);
  const canCreateBundle = selectedCount >= MIN_BUNDLE_SIZE;

  // Announce only the moment progress crosses the >=2 line, in either
  // direction — not every single tap, and never a stuck-on alert.
  const wasCreatableRef = useRef(canCreateBundle);
  useEffect(() => {
    if (canCreateBundle === wasCreatableRef.current) return;
    wasCreatableRef.current = canCreateBundle;
    if (canCreateBundle) {
      raiseCue(
        `Ready to bundle. ${selectedCount} items selected at ${formatWon(
          quote.bundlePriceWon
        )}.`
      );
    } else {
      raiseCue("Below the 2-item minimum — select one more to bundle.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canCreateBundle]);

  const handleCreateBundle = useCallback(() => {
    if (!canCreateBundle) return;
    setDraftTally((prev) => prev + 1);
    raiseCue(
      `Bundle draft started: ${selectedCount} items for ${formatWon(
        quote.bundlePriceWon
      )}. Find it in your drafts.`
    );
  }, [canCreateBundle, selectedCount, quote.bundlePriceWon, raiseCue]);

  const renderTile = useCallback(
    ({ item }: { item: SellerListing }) => {
      const isSelected = selectedIds.has(item.id);
      return (
        <Pressable
          onPress={() => toggleListing(item.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
          accessibilityLabel={`${item.title}, ${formatWon(item.priceWon)}, condition ${conditionLabel(
            item.condition
          )}`}
          accessibilityHint="Toggles whether this listing is included in the bundle you're building."
          style={({ pressed }) => [
            styles.listingTile,
            isSelected && styles.listingTileSelected,
            pressed && styles.listingTilePressed,
          ]}
        >
          <View
            style={[styles.swatchBlock, swatchStyleFor(item.swatchIndex)]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <View
            style={[styles.checkRing, isSelected && styles.checkRingOn]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {isSelected ? <Text style={styles.checkRingGlyph}>{"✓"}</Text> : null}
          </View>
          <Text style={styles.tileTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.tileMeta}>
            {item.categoryLabel} · {conditionLabel(item.condition)}
          </Text>
          <Text style={styles.tilePrice}>{formatWon(item.priceWon)}</Text>
        </Pressable>
      );
    },
    [selectedIds, toggleListing]
  );

  const gridHeader = (
    <View style={styles.headerBlock}>
      <Text style={styles.headerTitle} accessibilityRole="header">
        Bundle Deal Builder
      </Text>
      <Text style={styles.headerSubtitle}>
        Select at least {MIN_BUNDLE_SIZE} of your active listings to offer them together at one
        discounted price.
      </Text>
      {draftTally > 0 ? (
        <Text style={styles.headerDraftNote}>
          {draftTally} bundle draft{draftTally === 1 ? "" : "s"} started this session.
        </Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.screenRoot}>
      <FlatList
        data={sellerActiveListings}
        keyExtractor={(item) => item.id}
        renderItem={renderTile}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={gridHeader}
        contentContainerStyle={styles.gridContent}
      />

      {selectedCount > 0 ? (
        <View style={styles.quoteBar} accessibilityLiveRegion="polite">
          <Text style={styles.quoteStatusLine}>
            {selectedCount} item{selectedCount === 1 ? "" : "s"} selected · Bundle price{" "}
            {formatWon(quote.bundlePriceWon)}
            {quote.savingsWon > 0 ? ` (save ${formatWon(quote.savingsWon)})` : ""}
          </Text>
          {cueText ? (
            <Text accessibilityRole="alert" style={styles.quoteCueLine}>
              {cueText}
            </Text>
          ) : null}
          {canCreateBundle ? (
            <Pressable
              onPress={handleCreateBundle}
              accessibilityRole="button"
              accessibilityLabel="Create bundle"
              accessibilityHint="Starts a bundle draft from the selected listings at the shown price."
              style={({ pressed }) => [
                styles.quoteCreateButton,
                pressed && styles.quoteCreateButtonPressed,
              ]}
            >
              <Text style={styles.quoteCreateButtonLabel}>Create Bundle</Text>
            </Pressable>
          ) : (
            <Text style={styles.quotePrompt}>
              Select {MIN_BUNDLE_SIZE - selectedCount} more item
              {MIN_BUNDLE_SIZE - selectedCount === 1 ? "" : "s"} to create a bundle.
            </Text>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function swatchStyleFor(index: 1 | 2 | 3) {
  if (index === 1) return { backgroundColor: tokens.color.swatch1 };
  if (index === 2) return { backgroundColor: tokens.color.swatch2 };
  return { backgroundColor: tokens.color.swatch3 };
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  gridContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  gridRow: {
    justifyContent: "space-between",
  },
  headerBlock: {
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  headerTitle: {
    fontSize: 30,
    lineHeight: 42,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.muted,
  },
  headerDraftNote: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.accent,
    marginTop: tokens.space(2),
  },
  listingTile: {
    width: "48%",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  listingTileSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  listingTilePressed: {
    backgroundColor: tokens.color.accentBg,
  },
  swatchBlock: {
    width: "100%",
    height: 64,
    borderRadius: tokens.radius.sm,
    marginBottom: tokens.space(2),
  },
  checkRing: {
    position: "absolute",
    top: tokens.space(2),
    right: tokens.space(2),
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: tokens.color.scrimLight,
    backgroundColor: tokens.color.scrimDark,
    alignItems: "center",
    justifyContent: "center",
  },
  checkRingOn: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.onAccent,
  },
  checkRingGlyph: {
    fontSize: 13,
    lineHeight: 13,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  tileTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
    minHeight: 38,
  },
  tileMeta: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
    marginBottom: tokens.space(1),
  },
  tilePrice: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  quoteBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  quoteStatusLine: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
    fontVariant: ["tabular-nums"],
  },
  quoteCueLine: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.accent,
    marginBottom: tokens.space(2),
  },
  quotePrompt: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },
  quoteCreateButton: {
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  quoteCreateButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  quoteCreateButtonLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
});

export default BundleDealBuilderScreen;
