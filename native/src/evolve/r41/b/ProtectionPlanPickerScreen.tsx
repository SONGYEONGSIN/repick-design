// native/src/evolve/r41/b/ProtectionPlanPickerScreen.tsx
//
// Domain: Protection Plan Picker — a PRE-purchase comparison/selection screen.
// The buyer is choosing whether to add an optional protection plan to an
// order that has NOT been placed yet (unlike evolve/r23/a/
// ProtectionCoverageScreen, a read-only record of a plan already attached to
// a past order). Four mutually exclusive options are compared: "No
// protection plan" (the explicit, always-valid baseline) and three escalating
// paid tiers. Exactly one is selected at a time.
//
// Band choice: this is neither a blocked-workflow state machine (proceeding
// with "No protection plan" is always valid — nothing is ever blocked) nor a
// read-only completed-record action bar (there is no finished result here,
// the decision is still live) nor a destructive-confirmation band (nothing
// here is destructive) nor a selection-COUNT-derived contextual bar (this
// isn't a multi-select list where a bar mounts once count > 0 — exactly one
// option is always selected, even "none"). So the band is ALWAYS mounted
// (a decision always exists), but its CONTENT is derived live from which
// option is currently selected: "Continue — $0 added" with no plan, or
// "Continue — +$9.99 (Plus)" once a tier is chosen. See the concept notes at
// vault/.../candidates/b.md for the full argument on why this is a distinct
// band form from the four already documented in GENERATION.md §3.
import React, { useState } from "react";
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
  ITEM,
  PLAN_OPTIONS,
  INITIAL_SELECTION,
  PlanOption,
  PlanOptionId,
  findPlanOption,
  formatUsdCents,
  continueBandLabel,
  continueAccessibilityLabel,
} from "./data";

export default function ProtectionPlanPickerScreen() {
  const [selectedId, setSelectedId] = useState<PlanOptionId>(INITIAL_SELECTION);
  const selectedOption = findPlanOption(selectedId);

  const bandLabel = continueBandLabel(selectedOption);
  const continueLabel = continueAccessibilityLabel(selectedOption);

  function handleContinue() {
    // This demo screen ends the purchase flow here by design — there is no
    // further checkout step to hand off to, so this intentionally does
    // nothing further. No accessibilityHint is attached to this button
    // promising a screen transition, since none happens.
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={PLAN_OPTIONS}
        keyExtractor={(option) => option.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text accessibilityRole="header" style={styles.title}>
              Protection Plan Picker
            </Text>
            <Text style={styles.subtitle}>
              Add optional coverage for the item you&apos;re about to buy.
            </Text>

            <View style={styles.itemCard}>
              <View style={styles.itemThumb}>
                <Text style={styles.itemThumbGlyph}>
                  {ITEM.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemLabel}>Purchasing</Text>
                <Text style={styles.itemName}>{ITEM.name}</Text>
                <Text style={styles.itemPrice}>
                  {formatUsdCents(ITEM.priceCents)}
                </Text>
              </View>
            </View>

            <Text accessibilityRole="header" style={styles.sectionHeader}>
              Choose a plan
            </Text>
          </View>
        }
        renderItem={({ item: option }) => (
          <PlanOptionRow
            option={option}
            selected={option.id === selectedId}
            onSelect={() => setSelectedId(option.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
      />

      <View style={styles.band} accessibilityLiveRegion="polite">
        <Text accessibilityRole="alert" style={styles.bandLine}>
          {bandLabel}
        </Text>
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={continueLabel}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function PlanOptionRow({
  option,
  selected,
  onSelect,
}: {
  option: PlanOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const isNone = option.priceCents === 0;
  const priceLabel = isNone ? "$0" : `+${formatUsdCents(option.priceCents)}`;
  const rowAccessibilityLabel = `${option.name}, ${
    isNone ? "no added cost" : `${priceLabel} add-on`
  }. ${option.bullets.join(". ")}.`;

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={rowAccessibilityLabel}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={styles.cardHeaderRow}>
        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={[styles.cardName, selected && styles.cardNameSelected]}>
          {option.name}
        </Text>
        <Text style={[styles.cardPrice, selected && styles.cardPriceSelected]}>
          {priceLabel}
        </Text>
      </View>
      <View style={styles.bulletList}>
        {option.bullets.map((bullet) => (
          <View key={bullet} style={styles.bulletRow}>
            <Text style={isNone ? styles.bulletDashGlyph : styles.bulletCheckGlyph}>
              {isNone ? "–" : "✓"}
            </Text>
            <Text style={styles.bulletText}>{bullet}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(32),
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
    marginBottom: tokens.space(4),
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(5),
    gap: tokens.space(3),
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  itemThumbGlyph: {
    color: tokens.color.onInk,
    fontSize: 18,
    fontWeight: "700",
  },
  itemInfo: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 11,
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: tokens.space(1),
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  rowSeparator: {
    height: tokens.space(3),
  },
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  cardSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
    marginBottom: tokens.space(3),
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: tokens.color.accent,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: tokens.color.accent,
  },
  cardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  cardNameSelected: {
    color: tokens.color.accent,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  cardPriceSelected: {
    color: tokens.color.accent,
  },
  bulletList: {
    gap: tokens.space(1),
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(2),
  },
  bulletCheckGlyph: {
    color: tokens.color.success,
    fontSize: 13,
    fontWeight: "700",
    width: 16,
  },
  bulletDashGlyph: {
    color: tokens.color.faint,
    fontSize: 13,
    fontWeight: "700",
    width: 16,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  bandLine: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    marginBottom: tokens.space(2),
    fontVariant: ["tabular-nums"],
  },
  continueButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    alignItems: "center",
  },
  continueButtonPressed: {
    opacity: 0.85,
  },
  continueButtonText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
});
