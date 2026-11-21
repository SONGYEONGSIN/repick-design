// native/src/evolve/r42/c/SplitPayPlanSelectorScreen.tsx — auto-native-r42 candidate c.
//
// Buyer-facing payment-TIMING picker shown before checkout on a single item purchase: pay the
// full price today, or split it into 4 biweekly or 12 monthly installments. This is strictly
// about WHEN money leaves the buyer's account — it is not the separate protection/coverage-tier
// screen (a different axis: insurance benefits, not financing schedule) and not the separate
// seller payout/wallet screens (money flowing OUT to a seller, not IN from this buyer).
//
// Macro-layout: three fixed comparison radio-cards, single-select, rendered with a plain
// `.map()` over PLAN_DEFINITIONS — a small fixed set of exactly 3 named options, not a scrolling
// list of records, so FlatList is not the right tool here.
//
// Band mechanic assigned to this round: a selection-derived band, generalized to a NEW trigger
// shape versus the other two forms already in this catalog (a pending-count bar, a dirty-vs-saved
// diff). Here there is nothing to count and nothing to diff — there is exactly one choice, and the
// band's only question is whether that choice has been made yet:
//
//   const hasSelection = selectedPlanId !== null;
//
// `hasSelection` is recomputed from `selectedPlanId` on every render and used directly in JSX to
// decide whether <PlanBand> mounts at all. There is no separately-tracked `showBand` flag that
// gets imperatively flipped anywhere in this file.
import { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable, SafeAreaView, StyleSheet } from "react-native";
import {
  PLAN_DEFINITIONS,
  PURCHASE_ITEM,
  FIRST_PAYMENT_DATE,
  formatCurrency,
  type PlanDef,
  type PlanId,
} from "./data";
import { tokens } from "../../../tokens";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

/* ───────── item summary strip ───────── */

function ItemSummary() {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemSwatch} />
      <View style={styles.itemTextCol}>
        <Text style={styles.itemTitle}>{PURCHASE_ITEM.title}</Text>
        <Text style={styles.itemSeller}>{PURCHASE_ITEM.seller}</Text>
      </View>
      <Text style={styles.itemPrice}>{formatCurrency(PURCHASE_ITEM.price)}</Text>
    </View>
  );
}

/* ───────── one comparison radio-card ───────── */

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: PlanDef;
  selected: boolean;
  onSelect: (id: PlanId) => void;
}) {
  const perInstallmentLabel =
    plan.installmentCount === 1
      ? `${formatCurrency(plan.amountPerInstallment)} charged today`
      : `${formatCurrency(plan.amountPerInstallment)} per payment`;

  return (
    <Pressable
      onPress={() => onSelect(plan.id)}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${plan.name}. ${plan.cadenceLabel}. ${perInstallmentLabel}. Total ${formatCurrency(
        plan.totalCost
      )}. ${plan.feeLabel}.`}
      hitSlop={HIT_SLOP}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.cardTopRow}>
        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.cardName}>{plan.name}</Text>
      </View>

      <Text style={styles.cardCadence}>{plan.cadenceLabel}</Text>

      <View style={styles.cardAmountsRow}>
        <Text style={styles.cardPerInstallment}>{perInstallmentLabel}</Text>
        <Text style={styles.cardTotal}>Total {formatCurrency(plan.totalCost)}</Text>
      </View>

      <View
        style={[
          styles.feeBadge,
          plan.feeAmount === 0 ? styles.feeBadgeNone : styles.feeBadgeSome,
        ]}
      >
        <Text
          style={[
            styles.feeBadgeText,
            plan.feeAmount === 0 ? styles.feeBadgeTextNone : styles.feeBadgeTextSome,
          ]}
        >
          {plan.feeLabel}
        </Text>
      </View>
    </Pressable>
  );
}

/* ───────── band: mounted only once a plan is selected (selection-derived, not a count/diff) ───────── */

function PlanBand({
  plan,
  confirmed,
  onConfirm,
  onChangePlan,
}: {
  plan: PlanDef;
  confirmed: boolean;
  onConfirm: () => void;
  onChangePlan: () => void;
}) {
  if (confirmed) {
    return (
      <View style={styles.band}>
        <Text style={styles.bandHeadline} accessibilityRole="alert">
          Plan confirmed — {plan.name}
        </Text>
        <Text style={styles.bandSubtext}>
          First payment of {formatCurrency(plan.amountPerInstallment)} charges on{" "}
          {FIRST_PAYMENT_DATE}.
        </Text>
        <Pressable
          onPress={onChangePlan}
          accessibilityRole="button"
          accessibilityLabel="Change payment plan"
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.bandButtonSecondary, pressed && styles.pressed]}
        >
          <Text style={styles.bandButtonSecondaryLabel}>Change Plan</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.band}>
      <Text style={styles.bandHeadline} accessibilityRole="alert">
        {plan.name} selected
      </Text>
      <Text style={styles.bandSubtext}>
        First payment: {FIRST_PAYMENT_DATE}, {formatCurrency(plan.amountPerInstallment)}
        {plan.installmentCount > 1 ? ` of ${plan.installmentCount}` : ""}.
      </Text>
      <Pressable
        onPress={onConfirm}
        accessibilityRole="button"
        accessibilityLabel={`Confirm ${plan.name} payment plan`}
        hitSlop={HIT_SLOP}
        style={({ pressed }) => [styles.bandButtonPrimary, pressed && styles.pressed]}
      >
        <Text style={styles.bandButtonPrimaryLabel}>Confirm Plan</Text>
      </Pressable>
    </View>
  );
}

/* ───────── screen ───────── */

export default function SplitPayPlanSelectorScreen() {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // Derived every render from the single piece of selection state. Never a hand-flipped flag.
  const hasSelection = selectedPlanId !== null;

  const selectedPlan = useMemo(
    () => PLAN_DEFINITIONS.find((p) => p.id === selectedPlanId) ?? null,
    [selectedPlanId]
  );

  const handleSelectPlan = useCallback((id: PlanId) => {
    setSelectedPlanId((prev) => {
      // Picking a different plan after confirming invalidates the prior confirmation; picking
      // the same plan again leaves it alone. This does not change whether the band is present
      // (that is still `hasSelection` alone) — only what the band is currently showing.
      if (prev !== id) setConfirmed(false);
      return id;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setConfirmed(true);
  }, []);

  const handleChangePlan = useCallback(() => {
    setConfirmed(false);
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.scroll}>
        <View style={styles.headerWrap}>
          <Text style={styles.headerTitle} accessibilityRole="header">
            Choose How You'll Pay
          </Text>
          <Text style={styles.headerSubtitle}>
            Select a payment plan for this purchase. You can pay the full amount today or split
            it into smaller payments over time.
          </Text>
        </View>

        <ItemSummary />

        <View style={styles.cardsCol}>
          {PLAN_DEFINITIONS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={plan.id === selectedPlanId}
              onSelect={handleSelectPlan}
            />
          ))}
        </View>
      </View>

      {/* Always mounted so the live region persists across the band appearing/disappearing;
          only its content (and hence what gets announced) changes. At most one live region
          on this screen. */}
      <View accessibilityLiveRegion="polite">
        {hasSelection && selectedPlan && (
          <PlanBand
            plan={selectedPlan}
            confirmed={confirmed}
            onConfirm={handleConfirm}
            onChangePlan={handleChangePlan}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },
  scroll: { flex: 1, paddingHorizontal: tokens.space(5) },

  headerWrap: { paddingTop: tokens.space(10), paddingBottom: tokens.space(4) },
  headerTitle: { fontSize: 26, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  headerSubtitle: { marginTop: 6, fontSize: 13, color: tokens.color.faint, lineHeight: 18 },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(5),
  },
  itemSwatch: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.swatch1,
  },
  itemTextCol: { flex: 1, gap: 2 },
  itemTitle: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },
  itemSeller: { fontSize: 12, color: tokens.color.faint },
  itemPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },

  cardsCol: { gap: tokens.space(3), paddingBottom: tokens.space(32) },

  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
    backgroundColor: tokens.color.bg,
  },
  cardSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  pressed: { opacity: 0.85 },

  cardTopRow: { flexDirection: "row", alignItems: "center", gap: tokens.space(3) },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: { borderColor: tokens.color.accent },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.color.accent,
  },
  cardName: { fontSize: 16, fontWeight: "800", color: tokens.color.ink },

  cardCadence: {
    fontSize: 13,
    color: tokens.color.muted,
    marginLeft: tokens.space(8),
  },

  cardAmountsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginLeft: tokens.space(8),
    marginTop: tokens.space(1),
  },
  cardPerInstallment: {
    fontSize: 18,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  cardTotal: {
    fontSize: 13,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },

  feeBadge: {
    alignSelf: "flex-start",
    marginLeft: tokens.space(8),
    marginTop: tokens.space(1),
    paddingHorizontal: tokens.space(2),
    paddingVertical: 3,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  feeBadgeNone: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  feeBadgeSome: {
    backgroundColor: tokens.color.warningBg,
    borderColor: tokens.color.warningBorder,
  },
  feeBadgeText: { fontSize: 11, fontWeight: "700" },
  feeBadgeTextNone: { color: tokens.color.success },
  feeBadgeTextSome: { color: tokens.color.warning },

  /* selection-derived band */
  band: {
    backgroundColor: tokens.color.bg,
    borderTopWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(6),
    gap: tokens.space(2),
  },
  bandHeadline: { fontSize: 15, fontWeight: "800", color: tokens.color.ink },
  bandSubtext: { fontSize: 12, color: tokens.color.faint, lineHeight: 17 },

  bandButtonPrimary: {
    marginTop: tokens.space(2),
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonPrimaryLabel: { fontSize: 15, fontWeight: "700", color: tokens.color.onAccent },

  bandButtonSecondary: {
    marginTop: tokens.space(2),
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonSecondaryLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.muted },
});
