// native/src/evolve/r19/a/ShipmentPickupScreen.tsx — auto-native-r19 candidate a.
//
// Shipping Label & Pickup Scheduling: once a sale is confirmed for an item the seller is
// shipping (not a local meetup), this screen carries them from raw package measurements to a
// booked carrier pickup. It is a genuine three-stage blocked workflow, not a cosmetic one:
// (1) weight/dimensions must be explicitly confirmed — because the rate table below is keyed
// off *billable* weight (the greater of actual weight and a computed dimensional weight,
// actualWeight vs (L×W×H)/139, the standard in/lb DIM divisor) and showing a carrier price
// before that number is settled would be a lie; (2) a carrier + service tier must be chosen,
// since price and the set of available pickup windows both depend on it; (3) only then can a
// pickup window be picked and the booking confirmed. Each stage is visually locked until its
// prerequisite is met, not just gated at the bottom — but the fixed bottom dock is still the
// single source of truth for "why can't I proceed," per screen, via one live region.
//
// Deliberately NOT the disputes/verification accordion shape (evolve r7a DisputeCenterScreen,
// src/verification SellerVerificationScreen): this is a linear, always-expanded three-stage
// form (no collapse/expand), and the blocking dock's state names, style keys and hint copy
// below are original to this screen rather than reused from either.
import { useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
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
  DEFAULT_HEIGHT_IN,
  DEFAULT_LENGTH_IN,
  DEFAULT_WEIGHT_LB,
  DEFAULT_WIDTH_IN,
  DIM_DIVISOR,
  DIM_MAX_IN,
  DIM_MIN_IN,
  DIM_STEP_IN,
  PICKUP_WINDOWS,
  SALE,
  SERVICE_OPTIONS,
  WEIGHT_BRACKETS,
  WEIGHT_MAX_LB,
  WEIGHT_MIN_LB,
  WEIGHT_STEP_LB,
  buildLabelRef,
  type ServiceOption,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type StageId = "measure" | "carrier" | "pickup";
type SectionItem = { id: StageId };
const SECTIONS: SectionItem[] = [{ id: "measure" }, { id: "carrier" }, { id: "pickup" }];
const STAGE_INDEX: Record<StageId, number> = { measure: 0, carrier: 1, pickup: 2 };

type Blocker = { stage: StageId; reason: string } | null;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function Stepper({
  label,
  value,
  unit,
  onDecrease,
  onIncrease,
  disabled,
  atMin,
  atMax,
}: {
  label: string;
  value: string;
  unit: string;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled: boolean;
  atMin: boolean;
  atMax: boolean;
}) {
  return (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControl}>
        <Pressable
          onPress={onDecrease}
          disabled={disabled || atMin}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label.toLowerCase()}`}
          accessibilityState={{ disabled: disabled || atMin }}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.stepperBtn,
            (disabled || atMin) && styles.stepperBtnDisabled,
            pressed && !(disabled || atMin) && styles.pressed,
          ]}
        >
          <Text style={styles.stepperBtnGlyph}>−</Text>
        </Pressable>
        <Text style={styles.stepperValue}>
          {value} {unit}
        </Text>
        <Pressable
          onPress={onIncrease}
          disabled={disabled || atMax}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label.toLowerCase()}`}
          accessibilityState={{ disabled: disabled || atMax }}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.stepperBtn,
            (disabled || atMax) && styles.stepperBtnDisabled,
            pressed && !(disabled || atMax) && styles.pressed,
          ]}
        >
          <Text style={styles.stepperBtnGlyph}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ShipmentPickupScreen() {
  const [weightLb, setWeightLb] = useState(DEFAULT_WEIGHT_LB);
  const [lengthIn, setLengthIn] = useState(DEFAULT_LENGTH_IN);
  const [widthIn, setWidthIn] = useState(DEFAULT_WIDTH_IN);
  const [heightIn, setHeightIn] = useState(DEFAULT_HEIGHT_IN);
  const [measureLocked, setMeasureLocked] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [bookedLabelRef, setBookedLabelRef] = useState<string | null>(null);

  const listRef = useRef<FlatList<SectionItem>>(null);

  const dimWeightLb = (lengthIn * widthIn * heightIn) / DIM_DIVISOR;
  const usingDimWeight = dimWeightLb > weightLb;
  const billableLb = Math.max(weightLb, dimWeightLb);
  const bracket =
    WEIGHT_BRACKETS.find((b) => billableLb <= b.maxLb) ??
    WEIGHT_BRACKETS[WEIGHT_BRACKETS.length - 1];
  const bracketIndex = WEIGHT_BRACKETS.findIndex((b) => b.id === bracket.id);

  const selectedService = SERVICE_OPTIONS.find((s) => s.id === selectedServiceId) ?? null;
  const selectedWindow = PICKUP_WINDOWS.find((w) => w.id === selectedWindowId) ?? null;
  const priceCents = selectedService ? selectedService.ratesCents[bracketIndex] : null;

  const windowsForCarrier = selectedService
    ? PICKUP_WINDOWS.filter((w) => w.carrierName === selectedService.carrierName)
    : [];

  const blocker: Blocker = useMemo(() => {
    if (!measureLocked) {
      return {
        stage: "measure",
        reason: "Confirm the package weight and dimensions — carrier rates are calculated from it",
      };
    }
    if (!selectedServiceId) {
      return { stage: "carrier", reason: "Choose a carrier and service tier to lock in a price" };
    }
    if (!selectedWindowId) {
      return { stage: "pickup", reason: "Pick a pickup window before booking the carrier" };
    }
    return null;
  }, [measureLocked, selectedServiceId, selectedWindowId]);

  const jumpToStage = (stage: StageId) => {
    listRef.current?.scrollToIndex({ index: STAGE_INDEX[stage], viewPosition: 0, animated: true });
  };

  const changeWeight = (delta: number) => {
    if (booked) return;
    setWeightLb((w) => clamp(Math.round((w + delta) * 10) / 10, WEIGHT_MIN_LB, WEIGHT_MAX_LB));
    setMeasureLocked(false);
  };
  const changeDim = (setter: Dispatch<SetStateAction<number>>, delta: number) => {
    if (booked) return;
    setter((v) => clamp(v + delta, DIM_MIN_IN, DIM_MAX_IN));
    setMeasureLocked(false);
  };

  const onConfirmMeasurements = () => {
    if (booked) return;
    setMeasureLocked(true);
  };
  const onEditMeasurements = () => {
    if (booked) return;
    setMeasureLocked(false);
  };

  const onSelectService = (service: ServiceOption) => {
    if (booked || !measureLocked) return;
    setSelectedServiceId(service.id);
    setSelectedWindowId((prev) => {
      const stillValid = PICKUP_WINDOWS.some(
        (w) => w.id === prev && w.carrierName === service.carrierName,
      );
      return stillValid ? prev : null;
    });
  };

  const onSelectWindow = (windowId: string) => {
    if (booked || !measureLocked || !selectedServiceId) return;
    setSelectedWindowId(windowId);
  };

  const onDockPress = () => {
    if (blocker) {
      jumpToStage(blocker.stage);
      return;
    }
    if (booked || !selectedServiceId || !selectedWindowId) return;
    setBookedLabelRef(buildLabelRef(selectedServiceId, selectedWindowId));
    setBooked(true);
  };

  const renderMeasureSection = () => (
    <View style={[styles.card, blocker?.stage === "measure" && styles.cardActiveBlock]}>
      <Text style={styles.cardKicker}>STEP 1</Text>
      <Text style={styles.cardTitle} accessibilityRole="header">
        Confirm weight & dimensions
      </Text>
      <Text style={styles.cardSub}>
        {SALE.itemTitle} · sold {SALE.saleDateLabel} · {SALE.salePriceLabel}
      </Text>

      <View style={styles.stepperGroup}>
        <Stepper
          label="Weight"
          unit="lb"
          value={weightLb.toFixed(1)}
          onDecrease={() => changeWeight(-WEIGHT_STEP_LB)}
          onIncrease={() => changeWeight(WEIGHT_STEP_LB)}
          disabled={measureLocked || booked}
          atMin={weightLb <= WEIGHT_MIN_LB}
          atMax={weightLb >= WEIGHT_MAX_LB}
        />
        <Stepper
          label="Length"
          unit="in"
          value={String(lengthIn)}
          onDecrease={() => changeDim(setLengthIn, -DIM_STEP_IN)}
          onIncrease={() => changeDim(setLengthIn, DIM_STEP_IN)}
          disabled={measureLocked || booked}
          atMin={lengthIn <= DIM_MIN_IN}
          atMax={lengthIn >= DIM_MAX_IN}
        />
        <Stepper
          label="Width"
          unit="in"
          value={String(widthIn)}
          onDecrease={() => changeDim(setWidthIn, -DIM_STEP_IN)}
          onIncrease={() => changeDim(setWidthIn, DIM_STEP_IN)}
          disabled={measureLocked || booked}
          atMin={widthIn <= DIM_MIN_IN}
          atMax={widthIn >= DIM_MAX_IN}
        />
        <Stepper
          label="Height"
          unit="in"
          value={String(heightIn)}
          onDecrease={() => changeDim(setHeightIn, -DIM_STEP_IN)}
          onIncrease={() => changeDim(setHeightIn, DIM_STEP_IN)}
          disabled={measureLocked || booked}
          atMin={heightIn <= DIM_MIN_IN}
          atMax={heightIn >= DIM_MAX_IN}
        />
      </View>

      <View style={styles.billableNote}>
        <Text style={styles.billableNoteText}>
          Billable weight{" "}
          <Text style={styles.billableNoteStrong}>{billableLb.toFixed(1)} lb</Text> ({bracket.label}) —
          using {usingDimWeight ? "dimensional" : "actual"} weight (
          {usingDimWeight ? `${dimWeightLb.toFixed(1)} lb computed` : `${weightLb.toFixed(1)} lb entered`})
        </Text>
      </View>

      {measureLocked ? (
        <View style={styles.confirmedRow}>
          <Text style={styles.confirmedText}>✓ Measurements confirmed</Text>
          <Pressable
            onPress={onEditMeasurements}
            disabled={booked}
            accessibilityRole="button"
            accessibilityLabel="Edit weight and dimensions"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.editLink, pressed && !booked && styles.pressed]}
          >
            <Text style={styles.editLinkText}>Edit</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={onConfirmMeasurements}
          accessibilityRole="button"
          accessibilityLabel="Confirm weight and dimensions"
          accessibilityHint="Locks in these measurements so carrier rates can be calculated"
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [styles.confirmBtn, pressed && styles.pressed]}
        >
          <Text style={styles.confirmBtnText}>Confirm weight & dimensions</Text>
        </Pressable>
      )}
    </View>
  );

  const renderCarrierSection = () => {
    const unlocked = measureLocked;
    return (
      <View style={[styles.card, blocker?.stage === "carrier" && styles.cardActiveBlock]}>
        <Text style={styles.cardKicker}>STEP 2</Text>
        <Text style={styles.cardTitle} accessibilityRole="header">
          Choose carrier & service
        </Text>
        {!unlocked ? (
          <Text style={styles.lockedNote}>Confirm measurements above to see live rates.</Text>
        ) : (
          <Text style={styles.cardSub}>
            Rates below are for {bracket.label} ({billableLb.toFixed(1)} lb billable)
          </Text>
        )}

        <View
          style={styles.optionList}
          accessibilityRole="radiogroup"
          accessibilityLabel="Carrier and service tier"
        >
          {SERVICE_OPTIONS.map((service) => {
            const selected = selectedServiceId === service.id;
            const price = service.ratesCents[bracketIndex];
            return (
              <Pressable
                key={service.id}
                onPress={() => onSelectService(service)}
                disabled={!unlocked || booked}
                accessibilityRole="radio"
                accessibilityState={{ selected, disabled: !unlocked || booked }}
                accessibilityLabel={`${service.carrierName} ${service.tierLabel}, ${service.etaLabel}, ${money(price)}`}
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.optionRow,
                  selected && styles.optionRowOn,
                  !unlocked && styles.optionRowLocked,
                  pressed && unlocked && !booked && styles.pressed,
                ]}
              >
                <View style={styles.optionBody}>
                  <Text style={[styles.optionTitle, !unlocked && styles.optionTitleLocked]}>
                    {service.carrierName} · {service.tierLabel}
                  </Text>
                  <Text style={styles.optionSub}>{service.etaLabel}</Text>
                </View>
                <Text style={[styles.optionPrice, !unlocked && styles.optionTitleLocked]}>
                  {unlocked ? money(price) : "—"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  const renderPickupSection = () => {
    const unlocked = measureLocked && !!selectedService;
    return (
      <View style={[styles.card, blocker?.stage === "pickup" && styles.cardActiveBlock]}>
        <Text style={styles.cardKicker}>STEP 3</Text>
        <Text style={styles.cardTitle} accessibilityRole="header">
          Schedule Pickup
        </Text>
        {!unlocked ? (
          <Text style={styles.lockedNote}>
            {!measureLocked
              ? "Confirm measurements and choose a carrier to see pickup windows."
              : "Choose a carrier above to see its pickup windows."}
          </Text>
        ) : (
          <Text style={styles.cardSub}>
            {selectedService?.carrierName} windows near the seller&apos;s address
          </Text>
        )}

        {unlocked ? (
          <View
            style={styles.optionList}
            accessibilityRole="radiogroup"
            accessibilityLabel="Pickup window"
          >
            {windowsForCarrier.map((w) => {
              const selected = selectedWindowId === w.id;
              return (
                <Pressable
                  key={w.id}
                  onPress={() => onSelectWindow(w.id)}
                  disabled={booked}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, disabled: booked }}
                  accessibilityLabel={`${w.dateLabel}, ${w.timeLabel}`}
                  hitSlop={HIT_SLOP}
                  style={({ pressed }) => [
                    styles.optionRow,
                    selected && styles.optionRowOn,
                    pressed && !booked && styles.pressed,
                  ]}
                >
                  <View style={styles.optionBody}>
                    <Text style={styles.optionTitle}>{w.dateLabel}</Text>
                    <Text style={styles.optionSub}>{w.timeLabel}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {booked && bookedLabelRef ? (
          <View style={styles.labelRefBox}>
            <Text style={styles.labelRefKicker}>LABEL REFERENCE</Text>
            <Text style={styles.labelRefValue} selectable>
              {bookedLabelRef}
            </Text>
            <Text style={styles.labelRefHint}>
              Hand this reference to the {selectedService?.carrierName} driver, or show it printed
              on the label at pickup.
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderItem = ({ item }: { item: SectionItem }) => {
    if (item.id === "measure") return renderMeasureSection();
    if (item.id === "carrier") return renderCarrierSection();
    return renderPickupSection();
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
            <Text style={styles.kicker}>PREPARE SHIPMENT</Text>
            <Text style={styles.title} accessibilityRole="header">
              Ready this order for carrier pickup
            </Text>
            <Text style={styles.lede}>
              {SALE.itemTitle} sold to {SALE.buyerHandle} on {SALE.saleDateLabel}. Confirm the
              package, pick a carrier, then book a pickup window.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.dock} accessibilityLiveRegion="polite">
        {booked ? (
          <View style={styles.dockDone}>
            <Text style={styles.dockDoneTitle} accessibilityRole="alert">
              Pickup booked — {bookedLabelRef}
            </Text>
            <Text style={styles.dockDoneHint}>
              {selectedWindow?.dateLabel}, {selectedWindow?.timeLabel} · {selectedService?.carrierName}{" "}
              {selectedService?.tierLabel} · {priceCents !== null ? money(priceCents) : ""}
            </Text>
          </View>
        ) : blocker ? (
          <Pressable
            onPress={onDockPress}
            accessibilityRole="button"
            accessibilityLabel={`${blocker.reason}.`}
            accessibilityHint="Jumps to the step that needs attention"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.dockBlocked, pressed && styles.dockPressed]}
          >
            <Text style={styles.dockBlockedTitle} accessibilityRole="alert">
              {blocker.reason}
            </Text>
            <Text style={styles.dockBlockedHint}>Tap to jump to this step</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onDockPress}
            accessibilityRole="button"
            accessibilityLabel={`Book pickup with ${selectedService?.carrierName} ${selectedService?.tierLabel}, ${selectedWindow?.dateLabel} ${selectedWindow?.timeLabel}, ${priceCents !== null ? money(priceCents) : ""}`}
            accessibilityHint="Generates a label reference and confirms the pickup window"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.dockReady, pressed && styles.dockPressed]}
          >
            <Text style={styles.dockReadyTitle} accessibilityRole="alert">
              Schedule Pickup
            </Text>
            <Text style={styles.dockReadyHint}>
              {selectedService?.carrierName} {selectedService?.tierLabel} ·{" "}
              {priceCents !== null ? money(priceCents) : ""} · {selectedWindow?.dateLabel}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export default ShipmentPickupScreen;

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

  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(3),
  },
  cardActiveBlock: {
    borderColor: tokens.color.ink2,
    borderWidth: 1.5,
    padding: tokens.space(4) - 0.5,
  },
  cardKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: tokens.color.faint,
  },
  cardTitle: { fontSize: 17, fontWeight: "700", color: tokens.color.ink },
  cardSub: { fontSize: 12, lineHeight: 17, color: tokens.color.muted },
  lockedNote: { fontSize: 12, lineHeight: 17, color: tokens.color.faint, fontStyle: "italic" },

  stepperGroup: { gap: tokens.space(2) },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  stepperLabel: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  stepperControl: { flexDirection: "row", alignItems: "center", gap: tokens.space(3) },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnDisabled: { opacity: 0.35 },
  stepperBtnGlyph: { fontSize: 16, fontWeight: "700", color: tokens.color.ink2 },
  stepperValue: {
    minWidth: 64,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },

  billableNote: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    padding: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  billableNoteText: { fontSize: 12, lineHeight: 18, color: tokens.color.muted },
  billableNoteStrong: { fontWeight: "700", color: tokens.color.ink },

  confirmBtn: {
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: { fontSize: 14, fontWeight: "700", color: tokens.color.accent },
  confirmedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  confirmedText: { fontSize: 14, fontWeight: "700", color: tokens.color.accent },
  editLink: { minHeight: 32, minWidth: 44, alignItems: "flex-end", justifyContent: "center" },
  editLinkText: { fontSize: 13, fontWeight: "600", color: tokens.color.muted },

  optionList: { gap: tokens.space(2) },
  optionRow: {
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
  optionRowOn: { borderColor: tokens.color.accent, borderWidth: 1.5 },
  optionRowLocked: { opacity: 0.45 },
  optionBody: { flex: 1, gap: 1 },
  optionTitle: { fontSize: 13, fontWeight: "700", color: tokens.color.ink },
  optionTitleLocked: { color: tokens.color.faint },
  optionSub: { fontSize: 11, color: tokens.color.muted },
  optionPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  pressed: { opacity: 0.8 },

  labelRefBox: {
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    gap: 3,
  },
  labelRefKicker: { fontSize: 10, fontWeight: "700", letterSpacing: 1, color: tokens.color.faint },
  labelRefValue: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  labelRefHint: { fontSize: 12, lineHeight: 17, color: tokens.color.muted },

  dock: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  dockPressed: { opacity: 0.85 },
  dockBlocked: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  dockBlockedTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  dockBlockedHint: { fontSize: 12, color: tokens.color.muted },
  dockReady: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  dockReadyTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.onAccent },
  dockReadyHint: { fontSize: 12, color: tokens.color.onAccent },
  dockDone: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  dockDoneTitle: { fontSize: 16, fontWeight: "700", color: tokens.color.accent },
  dockDoneHint: { fontSize: 12, color: tokens.color.muted },
});
