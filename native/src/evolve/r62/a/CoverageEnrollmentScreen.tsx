// native/src/evolve/r62/a/CoverageEnrollmentScreen.tsx — auto-native-r62 candidate a.
//
// Shipping Insurance Add-on Enrollment: before a shipment goes out, the seller walks a
// three-step decision — (1) declare what the item inside is worth, (2) pick a coverage
// tier whose availability and premium are both computed live from that declared value,
// (3) review the resulting add-on cost and accept it. This is a real underwriting
// decision, not a settings form: lowering the declared value after a tier is already
// picked can make that tier stop qualifying, and the bottom band must notice this on
// every single render — never from a cached flag — and revert to naming that exact step
// as the thing still blocking enrollment.
//
// Only plain react-native core components are used (View, Text, Pressable, FlatList,
// SafeAreaView, StyleSheet) — no Expo-specific or navigation APIs, consistent with this
// screen rendering standalone outside any navigator.
import { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  COVERAGE_TIERS,
  MAX_INSURABLE_VALUE,
  MIN_INSURABLE_VALUE,
  SHIPMENT,
  VALUE_FINE_STEP,
  VALUE_PRESETS,
  formatCurrency,
  premiumForTier,
  tierQualifies,
  type CoverageTier,
  type CoverageTierId,
} from "./data";

const REACH_PAD = { top: 10, bottom: 10, left: 10, right: 10 };

type RowId = "value" | "tier" | "review";
const ROW_ORDER: readonly RowId[] = ["value", "tier", "review"];

type OpenRequirement = {
  rowIndex: number;
  headline: string;
  jumpCue: string;
};

export function CoverageEnrollmentScreen() {
  const [declaredValue, setDeclaredValue] = useState<number>(150);
  const [selectedTierId, setSelectedTierId] = useState<CoverageTierId | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const rowListRef = useRef<FlatList<RowId>>(null);

  // --- state transitions -----------------------------------------------
  // Both setters below also clear `accepted`, because the premium shown on the
  // review step is a function of (value, tier): once either input changes, a
  // prior acceptance would otherwise be "stuck" pointing at a cost that no
  // longer matches what's on screen.
  const setDeclaredValueAndResetAcceptance = (next: number) => {
    const clamped = Math.max(0, Math.min(2500, next));
    setDeclaredValue(clamped);
    setAccepted(false);
  };

  const pickTier = (id: CoverageTierId) => {
    setSelectedTierId(id);
    setAccepted(false);
  };

  const nudgeValue = (delta: number) => {
    setDeclaredValueAndResetAcceptance(declaredValue + delta);
  };

  const jumpToRow = (rowIndex: number) => {
    rowListRef.current?.scrollToIndex({ index: rowIndex, animated: true, viewPosition: 0 });
  };

  const confirmEnrollment = () => {
    setEnrolled(true);
  };

  // --- live derivation (computed fresh every render — nothing here is ever
  // cached in state, so a re-block always reflects the current declaredValue
  // and selectedTierId as of THIS render) -------------------------------
  const selectedTier: CoverageTier | null =
    COVERAGE_TIERS.find((t) => t.id === selectedTierId) ?? null;

  const valueIsDeclared =
    declaredValue >= MIN_INSURABLE_VALUE && declaredValue <= MAX_INSURABLE_VALUE;
  const tierStillQualifies = !!selectedTier && tierQualifies(selectedTier, declaredValue);

  function findOpenRequirement(): OpenRequirement | null {
    if (!valueIsDeclared) {
      if (declaredValue > MAX_INSURABLE_VALUE) {
        return {
          rowIndex: 0,
          headline: `Lower the declared value — ${formatCurrency(MAX_INSURABLE_VALUE)} is the most this shipment can insure.`,
          jumpCue: "Go to declared value",
        };
      }
      return {
        rowIndex: 0,
        headline: "Declare what the package is worth before anything can be covered.",
        jumpCue: "Go to declared value",
      };
    }
    if (!tierStillQualifies) {
      if (selectedTier) {
        return {
          rowIndex: 1,
          headline: `${selectedTier.name} needs at least ${formatCurrency(selectedTier.minValue)} declared — pick a different tier for ${formatCurrency(declaredValue)}.`,
          jumpCue: "Go to coverage tier",
        };
      }
      return {
        rowIndex: 1,
        headline: `Pick a coverage tier for this ${formatCurrency(declaredValue)} shipment.`,
        jumpCue: "Go to coverage tier",
      };
    }
    if (!accepted) {
      return {
        rowIndex: 2,
        headline: `Accept the ${formatCurrency(premiumForTier(selectedTier!, declaredValue))} premium to add insurance.`,
        jumpCue: "Go to review",
      };
    }
    return null;
  }

  const openRequirement = enrolled ? null : findOpenRequirement();

  const handleBandPress = () => {
    if (openRequirement) {
      jumpToRow(openRequirement.rowIndex);
      return;
    }
    confirmEnrollment();
  };

  // --- row renderers -----------------------------------------------------
  const renderValueRow = () => (
    <View style={styles.card}>
      <Text style={styles.cardStepLabel}>STEP 1</Text>
      <Text style={styles.cardTitle} accessibilityRole="header">
        Declare the item&apos;s value
      </Text>
      <Text style={styles.cardSub}>
        What the buyer paid, or what you&apos;d need to replace it for.
      </Text>

      <Text style={styles.valueReadout}>{formatCurrency(declaredValue)}</Text>
      {!valueIsDeclared ? (
        <Text style={styles.valueWarning}>
          {declaredValue > MAX_INSURABLE_VALUE
            ? `Above the ${formatCurrency(MAX_INSURABLE_VALUE)} insurable limit.`
            : `Enter at least ${formatCurrency(MIN_INSURABLE_VALUE)} to insure this shipment.`}
        </Text>
      ) : null}

      <View style={styles.stepperRow}>
        <Pressable
          onPress={() => nudgeValue(-VALUE_FINE_STEP)}
          accessibilityRole="button"
          accessibilityLabel={`Decrease declared value by ${formatCurrency(VALUE_FINE_STEP)}`}
          hitSlop={REACH_PAD}
          style={({ pressed }) => [styles.stepperButton, pressed && styles.pressedDim]}
        >
          <Text style={styles.stepperGlyph}>–</Text>
        </Pressable>
        <Text style={styles.stepperMeta}>{formatCurrency(VALUE_FINE_STEP)} increments</Text>
        <Pressable
          onPress={() => nudgeValue(VALUE_FINE_STEP)}
          accessibilityRole="button"
          accessibilityLabel={`Increase declared value by ${formatCurrency(VALUE_FINE_STEP)}`}
          hitSlop={REACH_PAD}
          style={({ pressed }) => [styles.stepperButton, pressed && styles.pressedDim]}
        >
          <Text style={styles.stepperGlyph}>+</Text>
        </Pressable>
      </View>

      <Text style={styles.fieldLabel}>Or pick a typical value</Text>
      <View
        style={styles.presetRow}
        accessibilityRole="radiogroup"
        accessibilityLabel="Quick-select declared value"
      >
        {VALUE_PRESETS.map((preset) => {
          const selected = preset === declaredValue;
          return (
            <Pressable
              key={preset}
              onPress={() => setDeclaredValueAndResetAcceptance(preset)}
              accessibilityRole="radio"
              accessibilityState={{ selected, checked: selected }}
              accessibilityLabel={`${formatCurrency(preset)}`}
              hitSlop={REACH_PAD}
              style={({ pressed }) => [
                styles.presetChip,
                selected && styles.presetChipOn,
                pressed && styles.pressedDim,
              ]}
            >
              <Text style={[styles.presetChipText, selected && styles.presetChipTextOn]}>
                {formatCurrency(preset)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderTierRow = () => (
    <View style={styles.card}>
      <Text style={styles.cardStepLabel}>STEP 2</Text>
      <Text style={styles.cardTitle} accessibilityRole="header">
        Choose a coverage tier
      </Text>
      <Text style={styles.cardSub}>
        Which tiers qualify, and what each costs, is driven entirely by the{" "}
        {formatCurrency(declaredValue)} you declared above.
      </Text>

      <View accessibilityRole="radiogroup" accessibilityLabel="Coverage tier">
        {COVERAGE_TIERS.map((tier) => {
          const qualifies = tierQualifies(tier, declaredValue);
          const selected = tier.id === selectedTierId;
          const premium = premiumForTier(tier, declaredValue);
          return (
            <Pressable
              key={tier.id}
              onPress={qualifies ? () => pickTier(tier.id) : undefined}
              disabled={!qualifies}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: !qualifies, checked: selected }}
              accessibilityLabel={
                qualifies
                  ? `${tier.name}, ${formatCurrency(premium)} premium`
                  : `${tier.name}, unavailable below ${formatCurrency(tier.minValue)} declared`
              }
              style={({ pressed }) => [
                styles.tierRow,
                selected && qualifies && styles.tierRowOn,
                !qualifies && styles.tierRowOff,
                pressed && qualifies && styles.pressedDim,
              ]}
            >
              <View style={styles.tierHeadRow}>
                <Text style={[styles.tierName, !qualifies && styles.tierTextMuted]}>
                  {tier.name}
                </Text>
                <Text
                  style={[
                    styles.tierPremium,
                    selected && qualifies && styles.tierPremiumOn,
                    !qualifies && styles.tierTextMuted,
                  ]}
                >
                  {formatCurrency(premium)}
                </Text>
              </View>
              {qualifies ? (
                <Text style={styles.tierDetail}>
                  {tier.perk} · {tier.deductibleLabel} · {tier.payoutWindowLabel}
                </Text>
              ) : (
                <Text style={styles.tierDetailMuted}>
                  Needs {formatCurrency(tier.minValue)}+ declared to qualify
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderReviewRow = () => (
    <View style={styles.card}>
      <Text style={styles.cardStepLabel}>STEP 3</Text>
      <Text style={styles.cardTitle} accessibilityRole="header">
        Review and accept the cost
      </Text>

      {selectedTier && tierStillQualifies ? (
        <>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Declared value</Text>
              <Text style={styles.summaryValue}>{formatCurrency(declaredValue)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Coverage tier</Text>
              <Text style={styles.summaryValue}>{selectedTier.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Add-on premium</Text>
              <Text style={styles.summaryValueStrong}>
                {formatCurrency(premiumForTier(selectedTier, declaredValue))}
              </Text>
            </View>
          </View>

          <View style={styles.editLinkRow}>
            <Pressable
              onPress={() => jumpToRow(0)}
              accessibilityRole="button"
              accessibilityLabel="Edit declared value"
              accessibilityHint="Scrolls to the declared value step"
              hitSlop={REACH_PAD}
              style={({ pressed }) => [styles.editLink, pressed && styles.pressedDim]}
            >
              <Text style={styles.editLinkText}>Edit value</Text>
            </Pressable>
            <Pressable
              onPress={() => jumpToRow(1)}
              accessibilityRole="button"
              accessibilityLabel="Change coverage tier"
              accessibilityHint="Scrolls to the coverage tier step"
              hitSlop={REACH_PAD}
              style={({ pressed }) => [styles.editLink, pressed && styles.pressedDim]}
            >
              <Text style={styles.editLinkText}>Change tier</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => setAccepted((prev) => !prev)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: accepted }}
            accessibilityLabel={`Accept the ${formatCurrency(premiumForTier(selectedTier, declaredValue))} premium for ${selectedTier.name}`}
            hitSlop={REACH_PAD}
            style={({ pressed }) => [styles.acceptRow, pressed && styles.pressedDim]}
          >
            <View style={[styles.acceptBox, accepted && styles.acceptBoxOn]}>
              {accepted ? <Text style={styles.acceptMark}>✓</Text> : null}
            </View>
            <Text style={styles.acceptText}>
              I accept the {formatCurrency(premiumForTier(selectedTier, declaredValue))}{" "}
              premium to add {selectedTier.name} to this shipment.
            </Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.cardSub}>
          Finish the first two steps to see what this shipment&apos;s insurance would cost.
        </Text>
      )}
    </View>
  );

  const renderRow = ({ item }: { item: RowId }) => {
    if (item === "value") return renderValueRow();
    if (item === "tier") return renderTierRow();
    return renderReviewRow();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        ref={rowListRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={ROW_ORDER}
        keyExtractor={(item) => item}
        renderItem={renderRow}
        onScrollToIndexFailed={(info) => {
          rowListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>REPICK SHIPPING</Text>
            <Text style={styles.title} accessibilityRole="header">
              Insure This Shipment
            </Text>
            <View style={styles.shipmentCard}>
              <Text style={styles.shipmentTitle}>{SHIPMENT.itemTitle}</Text>
              <Text style={styles.shipmentMeta}>{SHIPMENT.routeLabel}</Text>
              <Text style={styles.shipmentMeta}>{SHIPMENT.carrierLabel}</Text>
              <Text style={styles.shipmentShipBy}>{SHIPMENT.shipByLabel}</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.footerNote}>
            Insurance is optional. If you skip it, this shipment ships uninsured and
            Repick cannot reimburse a lost or damaged package.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.coverageBand} accessibilityLiveRegion="polite">
        {enrolled ? (
          <View style={styles.coverageBandSealed}>
            <Text style={styles.sealedHeadline} accessibilityRole="alert">
              Insurance added — {selectedTier?.name}
            </Text>
            <Text style={styles.sealedSubtext}>
              {selectedTier
                ? `${formatCurrency(premiumForTier(selectedTier, declaredValue))} premium will be charged with your shipping label.`
                : ""}
            </Text>
          </View>
        ) : openRequirement ? (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={`${openRequirement.headline} ${openRequirement.jumpCue}.`}
            hitSlop={REACH_PAD}
            style={({ pressed }) => [styles.coverageBandPending, pressed && styles.pressedDimBand]}
          >
            <Text style={styles.pendingHeadline} accessibilityRole="alert">
              {openRequirement.headline}
            </Text>
            <Text style={styles.pendingCue}>{openRequirement.jumpCue}</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleBandPress}
            accessibilityRole="button"
            accessibilityLabel={`Confirm and add ${selectedTier?.name} insurance for ${formatCurrency(
              premiumForTier(selectedTier!, declaredValue),
            )}`}
            hitSlop={REACH_PAD}
            style={({ pressed }) => [styles.coverageBandReady, pressed && styles.pressedDimBand]}
          >
            <Text style={styles.readyHeadline} accessibilityRole="alert">
              Confirm & Add Insurance
            </Text>
            <Text style={styles.readySubtext}>
              {selectedTier
                ? `${formatCurrency(premiumForTier(selectedTier, declaredValue))} · ${selectedTier.name}`
                : ""}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export default CoverageEnrollmentScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },

  header: { paddingTop: tokens.space(4) },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  shipmentCard: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: 2,
  },
  shipmentTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  shipmentMeta: { fontSize: 12, color: tokens.color.muted },
  shipmentShipBy: {
    marginTop: tokens.space(1),
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  card: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  cardStepLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: tokens.color.faint,
  },
  cardTitle: { fontSize: 17, fontWeight: "700", color: tokens.color.ink },
  cardSub: { fontSize: 13, lineHeight: 19, color: tokens.color.muted },

  valueReadout: {
    marginTop: tokens.space(1),
    fontSize: 32,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  valueWarning: { fontSize: 12, fontWeight: "700", color: tokens.color.danger },

  stepperRow: {
    marginTop: tokens.space(2),
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperGlyph: { fontSize: 20, fontWeight: "700", color: tokens.color.ink2 },
  stepperMeta: { flex: 1, textAlign: "center", fontSize: 12, color: tokens.color.faint },

  fieldLabel: {
    marginTop: tokens.space(2),
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  presetRow: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space(2) },
  presetChip: {
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(3),
    alignItems: "center",
    justifyContent: "center",
  },
  presetChipOn: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accentBg },
  presetChipText: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  presetChipTextOn: { color: tokens.color.accent },
  pressedDim: { opacity: 0.8 },

  tierRow: {
    minHeight: 64,
    marginTop: tokens.space(2),
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    padding: tokens.space(3),
    gap: 3,
  },
  tierRowOn: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accentBg },
  tierRowOff: { borderColor: tokens.color.border, opacity: 0.55 },
  tierHeadRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  tierName: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },
  tierPremium: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  tierPremiumOn: { color: tokens.color.accent },
  tierTextMuted: { color: tokens.color.faint },
  tierDetail: { fontSize: 12, lineHeight: 17, color: tokens.color.muted },
  tierDetailMuted: { fontSize: 12, lineHeight: 17, color: tokens.color.faint },

  summaryGrid: { marginTop: tokens.space(1), gap: tokens.space(2) },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 13, color: tokens.color.muted },
  summaryValue: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  summaryValueStrong: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },

  editLinkRow: { flexDirection: "row", gap: tokens.space(4) },
  editLink: { minHeight: 44, justifyContent: "center", paddingVertical: tokens.space(1) },
  editLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
    textDecorationLine: "underline",
  },

  acceptRow: {
    marginTop: tokens.space(2),
    minHeight: 44,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(3),
  },
  acceptBox: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  acceptBoxOn: { borderColor: tokens.color.accent, backgroundColor: tokens.color.accent },
  acceptMark: { fontSize: 13, fontWeight: "700", color: tokens.color.onAccent },
  acceptText: { flex: 1, fontSize: 13, lineHeight: 19, color: tokens.color.ink2 },

  footerNote: {
    marginTop: tokens.space(5),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },

  coverageBand: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  pressedDimBand: { opacity: 0.85 },

  coverageBandPending: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  pendingHeadline: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  pendingCue: { fontSize: 12, color: tokens.color.muted },

  coverageBandReady: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  readyHeadline: { fontSize: 16, fontWeight: "700", color: tokens.color.onAccent },
  readySubtext: { fontSize: 12, color: tokens.color.onAccent },

  coverageBandSealed: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  sealedHeadline: { fontSize: 16, fontWeight: "700", color: tokens.color.accent },
  sealedSubtext: { fontSize: 12, color: tokens.color.muted },
});
