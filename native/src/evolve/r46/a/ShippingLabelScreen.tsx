// native/src/evolve/r46/a/ShippingLabelScreen.tsx — auto-native-r46 candidate a.
//
// Shipping Label Purchase: once an item sells, the seller works through four genuinely gated
// stages — (1) pick a carrier/service tier, (2) confirm package weight & size, (3) review the
// total and pay, (4) the label is generated and can be viewed/downloaded. This is a blocked
// workflow (GENERATION.md §3's state-machine band), the same shape as src/verification's
// SellerVerificationScreen and src/disputes' DisputeCenterScreen — but NOT the same code surface.
// Per §3's L2 note ("형태를 맞게 골라도 코드 표면까지 닮으면 진다"), the state names, the fixed
// bottom control's style keys and its hint copy below are original to this screen, not reused
// from either of those, nor from this app's closest domain neighbor, src/pickup's
// ShipmentPickupScreen (which books a carrier *pickup window* off a weight-bracket rate table —
// a different terminal action). This screen's rate is a flat per-tier price independent of the
// weight/dimensions step (see data.ts), its stages run carrier-first then package-second (the
// reverse of ShipmentPickupScreen's order), weight/size are plain editable TextInputs rather than
// stepper buttons, and its terminal action is a real payment + label generation, not a booking.
import { useMemo, useRef, useState } from "react";
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
  CARRIER_OPTIONS,
  DEFAULT_HEIGHT_IN,
  DEFAULT_LENGTH_IN,
  DEFAULT_WEIGHT_LB,
  DEFAULT_WIDTH_IN,
  DIM_BOUNDS_IN,
  INSURANCE_FEE_WON,
  LABEL_FORMAT_LABEL,
  PAID_AT_LABEL,
  SOLD_ITEM,
  TRACKING_NUMBER,
  WEIGHT_BOUNDS_LB,
  formatWon,
  type CarrierOption,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type SectionId = "carrier" | "package" | "review" | "label";
type SectionItem = { id: SectionId };
const SECTIONS: SectionItem[] = [
  { id: "carrier" },
  { id: "package" },
  { id: "review" },
  { id: "label" },
];
const SECTION_INDEX: Record<SectionId, number> = {
  carrier: 0,
  package: 1,
  review: 2,
  label: 3,
};

type Progress =
  | { kind: "blocked"; section: "carrier" | "package"; message: string }
  | { kind: "ready" }
  | { kind: "done" };

function parsePositive(text: string, bounds: { min: number; max: number }) {
  const n = Number(text.trim());
  return Number.isFinite(n) && n >= bounds.min && n <= bounds.max ? n : null;
}

export function ShippingLabelScreen() {
  const [carrierId, setCarrierId] = useState<string | null>(null);
  const [weightText, setWeightText] = useState(DEFAULT_WEIGHT_LB);
  const [lengthText, setLengthText] = useState(DEFAULT_LENGTH_IN);
  const [widthText, setWidthText] = useState(DEFAULT_WIDTH_IN);
  const [heightText, setHeightText] = useState(DEFAULT_HEIGHT_IN);
  const [paid, setPaid] = useState(false);
  const [labelExpanded, setLabelExpanded] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const listRef = useRef<FlatList<SectionItem>>(null);

  const selectedCarrier: CarrierOption | null =
    CARRIER_OPTIONS.find((c) => c.id === carrierId) ?? null;

  const weightLb = parsePositive(weightText, WEIGHT_BOUNDS_LB);
  const lengthIn = parsePositive(lengthText, DIM_BOUNDS_IN);
  const widthIn = parsePositive(widthText, DIM_BOUNDS_IN);
  const heightIn = parsePositive(heightText, DIM_BOUNDS_IN);
  const packageValid =
    weightLb !== null && lengthIn !== null && widthIn !== null && heightIn !== null;

  const totalWon = selectedCarrier
    ? selectedCarrier.priceWon + INSURANCE_FEE_WON
    : null;

  const progress: Progress = useMemo(() => {
    if (!selectedCarrier) {
      return {
        kind: "blocked",
        section: "carrier",
        message: "Pick a carrier below — the label can't be priced without one.",
      };
    }
    if (!packageValid) {
      return {
        kind: "blocked",
        section: "package",
        message: "Enter a package weight and size greater than zero to open checkout.",
      };
    }
    if (!paid) {
      return { kind: "ready" };
    }
    return { kind: "done" };
  }, [selectedCarrier, packageValid, paid]);

  const goToSection = (section: SectionId) => {
    listRef.current?.scrollToIndex({
      index: SECTION_INDEX[section],
      viewPosition: 0,
      animated: true,
    });
  };

  const handlePay = () => {
    if (progress.kind !== "ready") return;
    setPaid(true);
  };

  const handleControlPress = () => {
    if (progress.kind === "blocked") {
      goToSection(progress.section);
      return;
    }
    if (progress.kind === "ready") {
      handlePay();
    }
  };

  const toggleLabelExpanded = () => setLabelExpanded((v) => !v);
  const markDownloaded = () => setDownloaded(true);

  const renderCarrierSection = () => (
    <View
      style={[
        styles.panel,
        progress.kind === "blocked" &&
          progress.section === "carrier" &&
          styles.panelFlagged,
      ]}
    >
      <View style={styles.panelHead}>
        <View style={styles.stageBadge}>
          <Text style={styles.stageBadgeText}>1</Text>
        </View>
        <Text style={styles.panelTitle} accessibilityRole="header">
          Choose a carrier
        </Text>
      </View>
      <Text style={styles.panelSub}>
        {SOLD_ITEM.title} · {SOLD_ITEM.soldOnLabel}
      </Text>

      <View
        style={styles.carrierList}
        accessibilityRole="radiogroup"
        accessibilityLabel="Carrier and service tier"
      >
        {CARRIER_OPTIONS.map((option) => {
          const selected = carrierId === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => setCarrierId(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected, checked: selected }}
              accessibilityLabel={`${option.carrierName} ${option.tierLabel}, ${option.etaLabel}, ${formatWon(option.priceWon)}`}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [
                styles.carrierRow,
                selected && styles.carrierRowOn,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.carrierBody}>
                <Text style={styles.carrierName}>
                  {option.carrierName} · {option.tierLabel}
                </Text>
                <Text style={styles.carrierEta}>{option.etaLabel}</Text>
              </View>
              <Text style={styles.carrierPrice}>{formatWon(option.priceWon)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderPackageSection = () => (
    <View
      style={[
        styles.panel,
        progress.kind === "blocked" &&
          progress.section === "package" &&
          styles.panelFlagged,
      ]}
    >
      <View style={styles.panelHead}>
        <View style={styles.stageBadge}>
          <Text style={styles.stageBadgeText}>2</Text>
        </View>
        <Text style={styles.panelTitle} accessibilityRole="header">
          Confirm weight & size
        </Text>
      </View>
      <Text style={styles.panelSub}>Pre-filled from similar items — edit if different.</Text>

      <View style={styles.dimRow}>
        <View style={styles.dimField}>
          <Text style={styles.dimLabel}>Weight (lb)</Text>
          <TextInput
            value={weightText}
            onChangeText={setWeightText}
            keyboardType="decimal-pad"
            accessibilityLabel="Package weight in pounds"
            style={[styles.dimInput, weightLb === null && styles.dimInputInvalid]}
          />
        </View>
        <View style={styles.dimField}>
          <Text style={styles.dimLabel}>Length (in)</Text>
          <TextInput
            value={lengthText}
            onChangeText={setLengthText}
            keyboardType="decimal-pad"
            accessibilityLabel="Package length in inches"
            style={[styles.dimInput, lengthIn === null && styles.dimInputInvalid]}
          />
        </View>
      </View>
      <View style={styles.dimRow}>
        <View style={styles.dimField}>
          <Text style={styles.dimLabel}>Width (in)</Text>
          <TextInput
            value={widthText}
            onChangeText={setWidthText}
            keyboardType="decimal-pad"
            accessibilityLabel="Package width in inches"
            style={[styles.dimInput, widthIn === null && styles.dimInputInvalid]}
          />
        </View>
        <View style={styles.dimField}>
          <Text style={styles.dimLabel}>Height (in)</Text>
          <TextInput
            value={heightText}
            onChangeText={setHeightText}
            keyboardType="decimal-pad"
            accessibilityLabel="Package height in inches"
            style={[styles.dimInput, heightIn === null && styles.dimInputInvalid]}
          />
        </View>
      </View>

      {!packageValid ? (
        <Text style={styles.invalidNote}>
          Every field needs a number greater than zero.
        </Text>
      ) : null}
    </View>
  );

  const renderReviewSection = () => (
    <View style={styles.panel}>
      <View style={styles.panelHead}>
        <View style={styles.stageBadge}>
          <Text style={styles.stageBadgeText}>3</Text>
        </View>
        <Text style={styles.panelTitle} accessibilityRole="header">
          Review & pay
        </Text>
      </View>

      {selectedCarrier ? (
        <View style={styles.totalBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalRowLabel}>
              {selectedCarrier.carrierName} · {selectedCarrier.tierLabel}
            </Text>
            <Text style={styles.totalRowValue}>
              {formatWon(selectedCarrier.priceWon)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalRowLabel}>Insurance & handling</Text>
            <Text style={styles.totalRowValue}>{formatWon(INSURANCE_FEE_WON)}</Text>
          </View>
          <View style={[styles.totalRow, styles.totalRowFinal]}>
            <Text style={styles.totalFinalLabel}>Total</Text>
            <Text style={styles.totalFinalValue}>
              {totalWon !== null ? formatWon(totalWon) : "—"}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.panelSub}>Choose a carrier above to see your total.</Text>
      )}
    </View>
  );

  const renderLabelSection = () => (
    <View style={styles.panel}>
      <View style={styles.panelHead}>
        <View style={styles.stageBadge}>
          <Text style={styles.stageBadgeText}>4</Text>
        </View>
        <Text style={styles.panelTitle} accessibilityRole="header">
          Your label
        </Text>
      </View>

      {!paid ? (
        <Text style={styles.panelSub}>
          Your shipping label appears here once payment is complete.
        </Text>
      ) : (
        <View style={styles.labelCard}>
          <Text style={styles.labelKicker}>LABEL READY</Text>
          <Text style={styles.labelTracking} selectable>
            {TRACKING_NUMBER}
          </Text>
          <Text style={styles.labelMeta}>
            {selectedCarrier?.carrierName} · {selectedCarrier?.tierLabel} ·{" "}
            {LABEL_FORMAT_LABEL}
          </Text>

          <View style={styles.labelActions}>
            <Pressable
              onPress={toggleLabelExpanded}
              accessibilityRole="button"
              accessibilityState={{ expanded: labelExpanded }}
              accessibilityLabel={`View label${labelExpanded ? ", expanded" : ""}`}
              accessibilityHint="Shows the label preview below"
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [
                styles.labelActionBtn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.labelActionText}>
                {labelExpanded ? "Hide preview" : "View label"}
              </Text>
            </Pressable>
            <Pressable
              onPress={markDownloaded}
              disabled={downloaded}
              accessibilityRole="button"
              accessibilityLabel={downloaded ? "Label downloaded" : "Download PDF"}
              accessibilityHint={
                downloaded ? undefined : "Marks this label as downloaded"
              }
              accessibilityState={{ disabled: downloaded }}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [
                styles.labelActionBtn,
                styles.labelActionBtnPrimary,
                downloaded && styles.labelActionBtnDone,
                pressed && !downloaded && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.labelActionTextPrimary,
                  downloaded && styles.labelActionTextDone,
                ]}
              >
                {downloaded ? "Downloaded ✓" : "Download PDF"}
              </Text>
            </Pressable>
          </View>

          {labelExpanded ? (
            <View style={styles.labelPreview}>
              <Text style={styles.labelPreviewLine}>{SOLD_ITEM.title}</Text>
              <Text style={styles.labelPreviewLine}>{SOLD_ITEM.buyerLabel}</Text>
              <Text style={styles.labelPreviewLine}>
                Ship via {selectedCarrier?.carrierName} ({selectedCarrier?.tierLabel})
              </Text>
              <Text style={styles.labelPreviewLine}>Tracking {TRACKING_NUMBER}</Text>
              <Text style={styles.labelPreviewLine}>Paid {PAID_AT_LABEL}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: SectionItem }) => {
    if (item.id === "carrier") return renderCarrierSection();
    if (item.id === "package") return renderPackageSection();
    if (item.id === "review") return renderReviewSection();
    return renderLabelSection();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={SECTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>SHIP THIS ORDER</Text>
            <Text style={styles.title} accessibilityRole="header">
              Buy a shipping label
            </Text>
            <Text style={styles.lede}>
              {SOLD_ITEM.title} sold for {formatWon(SOLD_ITEM.soldPriceWon)} to{" "}
              {SOLD_ITEM.buyerLabel.replace("Buyer: ", "")}. Pick a carrier, confirm
              the package, then pay to generate the label.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.control} accessibilityLiveRegion="polite">
        {progress.kind === "done" ? (
          <View style={styles.controlDone}>
            <Text style={styles.controlDoneTitle} accessibilityRole="alert">
              Label ready — {TRACKING_NUMBER}
            </Text>
            <Text style={styles.controlDoneHint}>
              Paid {PAID_AT_LABEL} · view or download it above.
            </Text>
          </View>
        ) : progress.kind === "blocked" ? (
          <Pressable
            onPress={handleControlPress}
            accessibilityRole="button"
            accessibilityLabel={progress.message}
            accessibilityHint="Takes you to the step below"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.controlBlocked,
              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.controlBlockedTitle} accessibilityRole="alert">
              {progress.message}
            </Text>
            <Text style={styles.controlBlockedHint}>Takes you to that step</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleControlPress}
            accessibilityRole="button"
            accessibilityLabel={`Pay ${totalWon !== null ? formatWon(totalWon) : ""} for ${selectedCarrier?.carrierName} ${selectedCarrier?.tierLabel}`}
            accessibilityHint="Charges this total and generates the shipping label"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.controlReady,
              pressed && styles.controlPressed,
            ]}
          >
            <Text style={styles.controlReadyTitle} accessibilityRole="alert">
              Pay {totalWon !== null ? formatWon(totalWon) : ""}
            </Text>
            <Text style={styles.controlReadyHint}>
              {selectedCarrier?.carrierName} · {selectedCarrier?.tierLabel} ·
              generates your label
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ShippingLabelScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },
  separator: { height: tokens.space(3) },

  header: {
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.4,
    color: tokens.color.ink,
  },
  lede: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },

  panel: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(3),
  },
  panelFlagged: {
    borderColor: tokens.color.ink2,
    borderWidth: 1.5,
    padding: tokens.space(4) - 0.5,
  },
  panelHead: { flexDirection: "row", alignItems: "center", gap: tokens.space(3) },
  stageBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stageBadgeText: { fontSize: 12, fontWeight: "700", color: tokens.color.muted },
  panelTitle: { fontSize: 17, fontWeight: "700", color: tokens.color.ink },
  panelSub: { fontSize: 12, lineHeight: 17, color: tokens.color.muted },

  carrierList: { gap: tokens.space(2) },
  carrierRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 52,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
  },
  carrierRowOn: { borderColor: tokens.color.accent, borderWidth: 1.5 },
  carrierBody: { flex: 1, gap: 1 },
  carrierName: { fontSize: 13, fontWeight: "700", color: tokens.color.ink },
  carrierEta: { fontSize: 11, color: tokens.color.muted },
  carrierPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  pressed: { opacity: 0.8 },

  dimRow: { flexDirection: "row", gap: tokens.space(3) },
  dimField: { flex: 1, gap: tokens.space(1) },
  dimLabel: { fontSize: 11, fontWeight: "700", color: tokens.color.faint },
  dimInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
    fontSize: 15,
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  dimInputInvalid: { borderColor: tokens.color.danger },
  invalidNote: { fontSize: 12, lineHeight: 17, color: tokens.color.danger },

  totalBlock: { gap: tokens.space(2) },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  totalRowLabel: { fontSize: 13, color: tokens.color.muted },
  totalRowValue: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  totalRowFinal: {
    marginTop: tokens.space(1),
    paddingTop: tokens.space(2),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
  },
  totalFinalLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },
  totalFinalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },

  labelCard: {
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    gap: tokens.space(2),
  },
  labelKicker: { fontSize: 10, fontWeight: "700", letterSpacing: 1, color: tokens.color.faint },
  labelTracking: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  labelMeta: { fontSize: 12, color: tokens.color.muted },
  labelActions: { flexDirection: "row", gap: tokens.space(2), marginTop: tokens.space(1) },
  labelActionBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
  },
  labelActionText: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },
  labelActionBtnPrimary: { backgroundColor: tokens.color.accent, borderColor: tokens.color.accent },
  labelActionTextPrimary: { fontSize: 13, fontWeight: "700", color: tokens.color.onAccent },
  labelActionBtnDone: { backgroundColor: tokens.color.accentBg, borderColor: tokens.color.accent },
  labelActionTextDone: { color: tokens.color.accent },
  labelPreview: {
    marginTop: tokens.space(1),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    padding: tokens.space(3),
    gap: 2,
    backgroundColor: tokens.color.bg,
  },
  labelPreviewLine: { fontSize: 12, lineHeight: 18, color: tokens.color.ink2 },

  control: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  controlPressed: { opacity: 0.85 },
  controlBlocked: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  controlBlockedTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  controlBlockedHint: { fontSize: 12, color: tokens.color.muted },
  controlReady: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  controlReadyTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.onAccent },
  controlReadyHint: { fontSize: 12, color: tokens.color.onAccent },
  controlDone: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  controlDoneTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.accent },
  controlDoneHint: { fontSize: 12, color: tokens.color.muted },
});
