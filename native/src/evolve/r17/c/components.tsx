// native/src/evolve/r17/c/components.tsx — presentational pieces for the Price Suggestion screen.
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import Svg, { Line, Circle, Polygon } from "react-native-svg";
import { tokens } from "../../../tokens";
import {
  SELLER_ITEM,
  agoText,
  formatWon,
  type SoldComp,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

/* ───────── item being priced (mini summary card) ───────── */

export function ItemSummaryCard() {
  const monogram = SELLER_ITEM.title.charAt(0);
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemIcon} accessible={false}>
        <Text style={styles.itemIconText}>{monogram}</Text>
      </View>
      <View style={styles.itemTextCol}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {SELLER_ITEM.title}
        </Text>
        <Text style={styles.itemMeta}>
          {SELLER_ITEM.category} · Condition: {SELLER_ITEM.condition}
        </Text>
      </View>
    </View>
  );
}

/* ───────── comp range bar — min/max of comps, a tick per comp, a marker for the AI
   suggestion, and a knob for the seller's current price. Recomputed on every render from
   live props, so the knob genuinely moves as the price is edited — this is not decorative. */

type RangeBarProps = {
  comps: SoldComp[];
  min: number;
  max: number;
  suggested: number;
  current: number;
  width: number;
};

export function RangeBar({ comps, min, max, suggested, current, width }: RangeBarProps) {
  const H = 40;
  const trackY = 22;
  const span = max - min || 1;
  const pctOf = (v: number) => Math.max(0, Math.min(1, (v - min) / span)) * width;

  const suggestedX = pctOf(suggested);
  const currentX = pctOf(current);
  const currentClamped = current < min || current > max;

  const label = `Comparable sold prices range from ${formatWon(min)} to ${formatWon(max)}. AI-suggested price ${formatWon(
    suggested,
  )}. Your current price ${formatWon(current)}${currentClamped ? ", outside this range" : ""}.`;

  return (
    <View style={styles.rangeWrap}>
      <View style={[styles.rangeSvgWrap, { width, height: H }]} accessible accessibilityRole="image" accessibilityLabel={label}>
        <Svg width={width} height={H}>
          {/* track */}
          <Line x1={0} y1={trackY} x2={width} y2={trackY} stroke={tokens.color.border} strokeWidth={4} strokeLinecap="round" />
          {/* one tick per comp sale */}
          {comps.map((c) => (
            <Line
              key={c.id}
              x1={pctOf(c.soldPriceWon)}
              y1={trackY - 6}
              x2={pctOf(c.soldPriceWon)}
              y2={trackY + 6}
              stroke={tokens.color.faint}
              strokeWidth={2}
            />
          ))}
          {/* AI suggestion: triangle above the track */}
          <Polygon
            points={`${suggestedX - 5},${trackY - 12} ${suggestedX + 5},${trackY - 12} ${suggestedX},${trackY - 3}`}
            fill={tokens.color.accent}
          />
          {/* current price: knob on the track */}
          <Circle cx={currentX} cy={trackY} r={7} fill={tokens.color.bg} stroke={tokens.color.accent} strokeWidth={3} />
        </Svg>
      </View>
      <View style={styles.rangeLegend}>
        <View style={styles.legendItem}>
          <View style={styles.legendTriangle} />
          <Text style={styles.legendText}>AI suggestion</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendKnob} />
          <Text style={styles.legendText}>Your price</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendTick} />
          <Text style={styles.legendText}>Sold comp</Text>
        </View>
      </View>
      <View style={styles.rangeMinMaxRow}>
        <Text style={styles.rangeMinMaxText}>{formatWon(min)}</Text>
        <Text style={styles.rangeMinMaxText}>{formatWon(max)}</Text>
      </View>
    </View>
  );
}

/* ───────── price editor: stepper + numeric input + reset-to-suggestion ───────── */

type PriceEditorProps = {
  value: number;
  step: number;
  suggested: number;
  onChangeText: (text: string) => void;
  onStep: (delta: number) => void;
  onUseSuggested: () => void;
};

export function PriceEditor({ value, step, suggested, onChangeText, onStep, onUseSuggested }: PriceEditorProps) {
  const atSuggested = value === suggested;
  return (
    <View style={styles.editorWrap}>
      <View style={styles.editorTopRow}>
        <Text style={styles.editorLabel}>Your price</Text>
        {!atSuggested ? (
          <Pressable
            onPress={onUseSuggested}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`Use the AI-suggested price of ${formatWon(suggested)}`}
            style={({ pressed }) => [styles.useSuggestedBtn, pressed && styles.pressed]}
          >
            <Text style={styles.useSuggestedText}>Use AI suggestion</Text>
          </Pressable>
        ) : (
          <View style={styles.matchedBadge}>
            <Text style={styles.matchedBadgeText}>Matched</Text>
          </View>
        )}
      </View>
      <View style={styles.stepperRow}>
        <Pressable
          onPress={() => onStep(-step)}
          disabled={value <= 0}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={`Decrease price by ${formatWon(step)}`}
          style={({ pressed }) => [
            styles.stepperBtn,
            value <= 0 && styles.stepperBtnDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.stepperBtnText, value <= 0 && styles.stepperBtnTextDisabled]}>−</Text>
        </Pressable>
        {/* The number IS the live editable value — no separate decorative display beside it. */}
        <View style={styles.priceInputWrap}>
          <Text style={styles.priceInputSymbol} accessibilityElementsHidden importantForAccessibility="no">
            ₩
          </Text>
          <TextInput
            style={styles.priceInputField}
            value={String(value)}
            onChangeText={onChangeText}
            keyboardType="number-pad"
            accessibilityLabel="Your price in won"
            accessibilityHint="Digits only, replaces the current price"
            placeholder="0"
            placeholderTextColor={tokens.color.faint}
          />
        </View>
        <Pressable
          onPress={() => onStep(step)}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={`Increase price by ${formatWon(step)}`}
          style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressed]}
        >
          <Text style={styles.stepperBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ───────── one comparable sold listing ───────── */

export function CompRow({ item }: { item: SoldComp }) {
  const monogram = item.condition.charAt(0);
  const spoken = `${item.title}. Condition ${item.condition}. Sold ${formatWon(item.soldPriceWon)}, ${agoText(item.daysAgo)}.`;
  return (
    <View style={styles.compRow} accessible accessibilityLabel={spoken}>
      <View style={styles.compIcon} accessible={false}>
        <Text style={styles.compIconText}>{monogram}</Text>
      </View>
      <View style={styles.compBody}>
        <Text style={styles.compTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.compMeta}>
          {item.condition} · Sold {agoText(item.daysAgo)}
        </Text>
      </View>
      <Text style={styles.compPrice}>{formatWon(item.soldPriceWon)}</Text>
    </View>
  );
}

/* ───────── styles ───────── */

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  itemIconText: { fontSize: 16, fontWeight: "800", color: tokens.color.ink2 },
  itemTextCol: { flex: 1, gap: 2 },
  itemTitle: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  itemMeta: { fontSize: 12, color: tokens.color.muted },

  rangeWrap: { marginTop: tokens.space(5) },
  rangeSvgWrap: { alignSelf: "center" },
  rangeLegend: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space(4), marginTop: tokens.space(2), justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: tokens.color.accent,
  },
  legendKnob: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.bg,
  },
  legendTick: { width: 2, height: 12, backgroundColor: tokens.color.faint },
  legendText: { fontSize: 11, color: tokens.color.muted },
  rangeMinMaxRow: { flexDirection: "row", justifyContent: "space-between", marginTop: tokens.space(1) },
  rangeMinMaxText: { fontSize: 11, color: tokens.color.faint, fontVariant: ["tabular-nums"] },

  editorWrap: { marginTop: tokens.space(6) },
  editorTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  editorLabel: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },
  useSuggestedBtn: {
    minHeight: 32,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  useSuggestedText: { fontSize: 12, fontWeight: "700", color: tokens.color.accent },
  matchedBadge: {
    minHeight: 32,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  matchedBadgeText: { fontSize: 12, fontWeight: "700", color: tokens.color.muted },
  pressed: { opacity: 0.85 },

  stepperRow: { flexDirection: "row", alignItems: "center", gap: tokens.space(2), marginTop: tokens.space(3) },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnDisabled: { opacity: 0.4 },
  stepperBtnText: { fontSize: 20, fontWeight: "700", color: tokens.color.ink2 },
  stepperBtnTextDisabled: { color: tokens.color.faint },
  priceInputWrap: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(3),
  },
  priceInputSymbol: { fontSize: 18, fontWeight: "700", color: tokens.color.muted },
  priceInputField: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
    padding: 0,
  },

  compRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    minHeight: 44,
  },
  compIcon: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  compIconText: { fontSize: 12, fontWeight: "800", color: tokens.color.ink2 },
  compBody: { flex: 1, gap: 2 },
  compTitle: { fontSize: 14, fontWeight: "600", color: tokens.color.ink },
  compMeta: { fontSize: 12, color: tokens.color.muted },
  compPrice: { fontSize: 14, fontWeight: "800", color: tokens.color.ink, fontVariant: ["tabular-nums"] },
});
