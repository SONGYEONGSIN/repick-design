// native/src/evolve/r17/c/PriceSuggestionScreen.tsx — auto-native-r17 candidate c.
// Screen type: "Price Suggestion & Market Comps" — a seller-side pricing tool shown while
// creating a listing. It shows sold comparable listings and a computed AI-suggested price;
// the seller accepts it as-is or overrides it, and the "why this price" copy updates live.
//
// Bottom-band choice (native/GENERATION.md §3): a persistent action bar, not a blocked-workflow
// gate. There is no genuine invalid state here — the screen opens with a valid default (the AI
// suggestion), and any price the seller lands on, including one outside the comp range, is still
// a price they're allowed to set; the range/suggestion framing is informational, not a gate. So
// the fixed bottom band is "Continue with ₩X", always enabled, always reflecting the live price —
// not a state machine explaining why the seller can't proceed, because they always can.
//
// The one load-bearing mechanism this screen promises is the live-updating price recommendation:
// computeSuggestedPrice/categorizePrice in ./data.ts are real functions over the fixed COMPS data,
// and every number/marker/sentence on screen (RangeBar knob, comparison sentence, bottom bar,
// confirmation banner) is derived from the same `customPrice` state — nothing here is a static
// number sitting next to a decorative control.
import { useMemo, useState } from "react";
import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet, useWindowDimensions } from "react-native";
import { tokens } from "../../../tokens";
import {
  SELLER_ITEM,
  COMPS,
  PRICE_STEP,
  computeSuggestedPrice,
  compRange,
  categorizePrice,
  CATEGORY_LABEL,
  diffPct,
  pctText,
  formatWon,
  type SoldComp,
} from "./data";
import { ItemSummaryCard, RangeBar, PriceEditor, CompRow } from "./components";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export function PriceSuggestionScreen() {
  const { width } = useWindowDimensions();
  const barWidth = Math.min(Math.max(width - tokens.space(5) * 2 - tokens.space(4) * 2, 200), 420);

  // Computed once from fixed data — a real function, not a literal (see data.ts).
  const suggested = useMemo(() => computeSuggestedPrice(COMPS, SELLER_ITEM.condition), []);
  const range = useMemo(() => compRange(COMPS), []);

  const [customPrice, setCustomPrice] = useState(suggested);
  const [confirmedPrice, setConfirmedPrice] = useState<number | null>(null);

  const category = useMemo(() => categorizePrice(customPrice, suggested, range), [customPrice, suggested, range]);
  const diff = useMemo(() => diffPct(customPrice, suggested), [customPrice, suggested]);

  function handleStep(delta: number) {
    setCustomPrice((prev) => Math.max(0, prev + delta));
    setConfirmedPrice(null);
  }

  function handleChangeText(text: string) {
    const digits = text.replace(/[^0-9]/g, "");
    setCustomPrice(digits === "" ? 0 : Math.min(parseInt(digits, 10), 99999000));
    setConfirmedPrice(null);
  }

  function handleUseSuggested() {
    setCustomPrice(suggested);
    setConfirmedPrice(null);
  }

  function handleContinue() {
    // No navigation stack exists in this catalog — each screen is rendered standalone by
    // ../../../../screens.ts (registered by the orchestrator, not this file). What IS real and
    // local: confirming the chosen price, which is what this bar's label and hint promise.
    setConfirmedPrice(customPrice);
  }

  return (
    <SafeAreaView style={styles.root}>
      <FlatList<SoldComp>
        style={styles.body}
        data={COMPS}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <CompRow item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.h1} accessibilityRole="header">
              Price Suggestion
            </Text>
            <Text style={styles.sub}>Priced from real sold listings, not asking prices</Text>

            <View style={styles.section}>
              <ItemSummaryCard />
            </View>

            <View style={[styles.section, styles.suggestedCard]}>
              <Text style={styles.suggestedLabel}>AI-suggested price</Text>
              <Text style={styles.suggestedAmount}>{formatWon(suggested)}</Text>
              <Text style={styles.suggestedCaption}>
                Weighted from {COMPS.length} similar sold listings, favoring recent sales and the closest condition match to
                yours.
              </Text>

              <RangeBar comps={COMPS} min={range.min} max={range.max} suggested={suggested} current={customPrice} width={barWidth} />
            </View>

            <View style={styles.section}>
              <PriceEditor
                value={customPrice}
                step={PRICE_STEP}
                suggested={suggested}
                onChangeText={handleChangeText}
                onStep={handleStep}
                onUseSuggested={handleUseSuggested}
              />

              {/* Single live region on this screen: the qualitative category label only (not the
                  raw digits, not the percent) — so a screen reader hears "moved into range" or
                  "now above every sale" without being read every keystroke as the seller types. */}
              <View style={styles.comparisonWrap} accessibilityLiveRegion="polite">
                <Text style={styles.comparisonLabel}>{CATEGORY_LABEL[category]}</Text>
              </View>
              <Text style={styles.comparisonDetail}>
                {category === "at-suggested"
                  ? `Typical range for this item: ${formatWon(range.min)}–${formatWon(range.max)}.`
                  : `${pctText(diff)} vs. the suggestion · typical range ${formatWon(range.min)}–${formatWon(range.max)}.`}
              </Text>
            </View>

            <Text style={styles.compsHeading} accessibilityRole="header">
              Comparable sold listings
            </Text>
            <Text style={styles.compsCaption}>Same model, ranked by how recently each one sold.</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerHeading}>How this number is calculated</Text>
            <Text style={styles.footerBody}>
              Each comp is weighted by two things: how recently it sold (older sales count less) and how closely its
              condition matches “{SELLER_ITEM.condition}” (closer matches count more). The suggestion is the weighted
              average of the {COMPS.length} sold prices above.
            </Text>
          </View>
        }
      />

      <View style={styles.bottomBar}>
        {confirmedPrice !== null ? (
          <Text style={styles.confirmedText}>Price set to {formatWon(confirmedPrice)} for this listing.</Text>
        ) : null}
        <Pressable
          onPress={handleContinue}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={`Continue with ${formatWon(customPrice)}`}
          accessibilityHint={`Confirms ${formatWon(customPrice)} as this listing's price`}
          style={({ pressed }) => [styles.continueBtn, pressed && styles.continueBtnPressed]}
        >
          <Text style={styles.continueBtnText}>Continue with {formatWon(customPrice)}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.color.bg },
  body: { flex: 1 },
  list: { paddingHorizontal: tokens.space(5), paddingBottom: tokens.space(6) },

  h1: { marginTop: tokens.space(8), fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.muted },

  section: { marginTop: tokens.space(5) },

  suggestedCard: {
    padding: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  suggestedLabel: { fontSize: 13, color: tokens.color.muted },
  suggestedAmount: {
    marginTop: tokens.space(1),
    fontSize: 34,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  suggestedCaption: { marginTop: tokens.space(2), fontSize: 12, color: tokens.color.muted, lineHeight: 17 },

  comparisonWrap: { marginTop: tokens.space(4) },
  comparisonLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.ink2 },
  comparisonDetail: { marginTop: 3, fontSize: 12, color: tokens.color.muted, fontVariant: ["tabular-nums"] },

  compsHeading: {
    marginTop: tokens.space(7),
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  compsCaption: { marginTop: 3, marginBottom: tokens.space(2), fontSize: 12, color: tokens.color.muted },

  footer: {
    marginTop: tokens.space(4),
    padding: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
  },
  footerHeading: { fontSize: 13, fontWeight: "700", color: tokens.color.ink2 },
  footerBody: { marginTop: 4, fontSize: 12, color: tokens.color.muted, lineHeight: 17 },

  bottomBar: {
    padding: tokens.space(4),
    backgroundColor: tokens.color.bg,
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    gap: tokens.space(2),
  },
  confirmedText: { fontSize: 12, color: tokens.color.muted, textAlign: "center", fontVariant: ["tabular-nums"] },
  continueBtn: {
    minHeight: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnPressed: { opacity: 0.9 },
  continueBtnText: { fontSize: 16, fontWeight: "700", color: tokens.color.onAccent, fontVariant: ["tabular-nums"] },
});
