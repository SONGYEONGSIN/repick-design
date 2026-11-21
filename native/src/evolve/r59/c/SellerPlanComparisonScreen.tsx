// native/src/evolve/r59/c/SellerPlanComparisonScreen.tsx
//
// "Seller Plan Comparison" — a seller picks between two subscription tiers,
// Starter and Plus. A two-tab switch (accessibilityRole="tab", not a
// checkbox/toggle) drives ONE piece of state, selectedTierId, and that state
// fully swaps the rendered perk content below: the value text for every row,
// plus — only while Starter is open, since Plus is strictly the upsell tier
// here — an inline "upgrade to unlock" hint. This is a single-column,
// full-content-swap view (2 reachable states, 1 selector), deliberately not
// a persistent side-by-side table and not 6 independently-toggled rows.
// See candidates/c.md for the brief gaps this screen had to resolve.

import React, { useCallback, useState } from "react";
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
  INITIAL_SELECTED_TIER_ID,
  PERK_ROWS,
  TIERS,
  tierById,
  valueForTier,
  type PerkRow,
  type TierId,
} from "./data";

export default function SellerPlanComparisonScreen() {
  // The one piece of lifted state that drives the full-content swap below.
  const [selectedTierId, setSelectedTierId] = useState<TierId>(INITIAL_SELECTED_TIER_ID);
  // Set once, by the terminal action in the bottom band. Independent of
  // selectedTierId on purpose — after this is set, the tabs above still let
  // a seller browse either tier's detail for reference, but the band itself
  // is locked to whichever tier was actually confirmed, not whatever tab
  // happens to be open at the time.
  const [confirmedTierId, setConfirmedTierId] = useState<TierId | null>(null);

  const selectedTier = tierById(selectedTierId);
  const isConfirmed = confirmedTierId !== null;
  const confirmedTier = confirmedTierId !== null ? tierById(confirmedTierId) : null;
  const isViewingStarter = selectedTierId === "starter";

  const handleSelectTab = useCallback(
    (tierId: TierId) => {
      setSelectedTierId((current) => (current === tierId ? current : tierId));
    },
    [],
  );

  const handleChoose = useCallback(() => {
    if (isConfirmed) return; // terminal action — fires exactly once per visit
    setConfirmedTierId(selectedTierId);
  }, [isConfirmed, selectedTierId]);

  const renderItem = useCallback(
    ({ item }: { item: PerkRow }) => {
      const value = valueForTier(item, selectedTierId);
      const showUnlockHint = isViewingStarter;
      return (
        <View style={styles.perkCard}>
          <Text style={styles.perkLabel}>{item.label}</Text>
          <Text style={styles.perkValue}>{value}</Text>
          {showUnlockHint ? (
            <View style={styles.perkUnlockRow}>
              <Text style={styles.perkUnlockGlyph}>↑</Text>
              <Text style={styles.perkUnlockText}>{item.unlockHint}</Text>
            </View>
          ) : null}
        </View>
      );
    },
    [selectedTierId, isViewingStarter],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Seller plans</Text>
        <Text accessibilityRole="header" style={styles.title}>
          Compare Seller Plans
        </Text>
        <Text style={styles.subtitle}>
          Switch tabs to see one plan at a time, in full — not a side-by-side table.
        </Text>
      </View>

      <View style={styles.tabRow} accessibilityRole="tablist">
        {TIERS.map((tier) => {
          const isActive = tier.id === selectedTierId;
          return (
            <Pressable
              key={tier.id}
              onPress={() => handleSelectTab(tier.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tier.name} plan`}
              style={({ pressed }) => [
                styles.tabButton,
                isActive && styles.tabButtonActive,
                pressed && styles.tabButtonPressed,
              ]}
            >
              <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                {tier.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.listCaption}>{selectedTier.tagline}</Text>

      <FlatList
        data={PERK_ROWS}
        keyExtractor={(row) => row.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Permanently mounted regardless of confirmation state — only the
          children inside change. This keeps the live region a stable
          container rather than one created fresh at the moment of the
          transition, so assistive tech treats the change as an update, not
          a brand-new insertion. */}
      <View style={styles.chooserBar} accessibilityLiveRegion="polite">
        {isConfirmed && confirmedTier ? (
          <Text accessibilityRole="alert" style={styles.chooserConfirmedText}>
            {`You're on ${confirmedTier.name} — manage anytime.`}
          </Text>
        ) : (
          <>
            <Text style={styles.chooserPrompt}>
              Review the perks above, then confirm when you're ready.
            </Text>
            <Pressable
              onPress={handleChoose}
              accessibilityRole="button"
              accessibilityLabel={`Choose ${selectedTier.name}`}
              accessibilityHint="Confirms this plan for your seller account. You can't switch back on this screen afterward."
              style={({ pressed }) => [styles.chooserButton, pressed && styles.chooserButtonPressed]}
            >
              <Text style={styles.chooserButtonText}>{`Choose ${selectedTier.name}`}</Text>
            </Pressable>
          </>
        )}
      </View>
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
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(1),
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.1,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
  },
  title: {
    marginTop: tokens.space(1),
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(1),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  tabRow: {
    flexDirection: "row",
    marginTop: tokens.space(4),
    marginHorizontal: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(2),
  },
  tabButtonActive: {
    backgroundColor: tokens.color.accent,
  },
  tabButtonPressed: {
    opacity: 0.8,
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  tabButtonTextActive: {
    color: tokens.color.onAccent,
    fontWeight: "800",
  },

  listCaption: {
    marginTop: tokens.space(3),
    marginHorizontal: tokens.space(4),
    marginBottom: tokens.space(1),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(4),
  },
  separator: {
    height: tokens.space(2),
  },

  perkCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    minHeight: 44,
  },
  perkLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  perkValue: {
    marginTop: tokens.space(1),
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  perkUnlockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(2),
    paddingTop: tokens.space(2),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  perkUnlockGlyph: {
    fontSize: 13,
    fontWeight: "800",
    color: tokens.color.accent,
    marginRight: tokens.space(1),
  },
  perkUnlockText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.accent,
  },

  chooserBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  chooserPrompt: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  chooserButton: {
    marginTop: tokens.space(3),
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  chooserButtonPressed: {
    opacity: 0.85,
  },
  chooserButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  chooserConfirmedText: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: tokens.color.ink,
  },
});
