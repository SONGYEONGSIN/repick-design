// native/src/evolve/r18/a/MyImpactScreen.tsx — auto-native-r18 candidate a.
//
// My Impact: a buyer-facing, read-only celebratory record of one shopper's own secondhand
// purchases on repick — CO2 avoided, money saved vs. retail, and a milestone timeline of when
// item-count thresholds were crossed. Nothing here is a seller metric and there is no seller
// content anywhere on the screen; it is the mirror image of `storefront`/`evolve/r17/a`
// (a seller looking at themselves) but for a buyer looking at their own purchase history.
//
// Bottom band: this is a finished-record screen, not a workflow — there is no "why can't I
// proceed" to state, because nothing here is blocked or incomplete (see GENERATION.md §3's
// read-only-record case, same family as `certificate` and `evolve/r17/a`). So the fixed band is
// a persistent, always-meaningful action bar with one real action (Share my impact, which
// flips in a confirmation string via local state) — never a disabled/state-machine band.
//
// Visual rhythm is deliberately NOT the seller scorecard's grid-of-MetricCards: the headline is
// a single hero number (CO2 avoided) with two plain supporting lines beneath it, and the body is
// a chronological milestone timeline (marker + connecting line) rather than a card grid — the
// brief's own suggested shape for celebratory/milestone content.
import { useState } from "react";
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
  CO2_KG_PER_ITEM,
  ITEMS_BOUGHT,
  JOINED_LABEL,
  METHODOLOGY_TEXT,
  MILESTONES,
  MONEY_SAVED_WON,
  SHARE_CONFIRMATION,
  actualSpentWon,
  carKmEquivalent,
  co2AvoidedKg,
  formatCount,
  formatWon,
  itemsToNextMilestone,
  progressToNextMilestonePercent,
  type Milestone,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function MilestoneMarker({ status }: { status: Milestone["status"] }) {
  const achieved = status === "achieved";
  return (
    <View
      accessible
      accessibilityLabel={achieved ? "Achieved" : "Upcoming milestone"}
      style={[styles.marker, achieved ? styles.markerAchieved : styles.markerUpcoming]}
    >
      <Text style={[styles.markerGlyph, achieved && styles.markerGlyphOnAccent]}>
        {achieved ? "✓" : "→"}
      </Text>
    </View>
  );
}

export function MyImpactScreen() {
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [shared, setShared] = useState(false);

  const co2Kg = co2AvoidedKg();
  const kmEquivalent = carKmEquivalent();
  const spentWon = actualSpentWon();
  const itemsToGo = itemsToNextMilestone();
  const progressPercent = progressToNextMilestonePercent();

  const toggleMethodology = () => setMethodologyOpen((v) => !v);
  const handleShare = () => setShared(true);

  const header = (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>YOUR IMPACT</Text>
      <Text style={styles.title} accessibilityRole="header">
        My Impact
      </Text>
      <Text style={styles.subtitle}>
        Every secondhand purchase is one less item made new — here's yours, since{" "}
        {JOINED_LABEL}.
      </Text>

      <View style={styles.hero}>
        <Text
          style={styles.heroValue}
          accessibilityLabel={`${co2Kg} kilograms of CO2 avoided`}
        >
          {co2Kg}
          <Text style={styles.heroUnit}> kg CO2</Text>
        </Text>
        <Text style={styles.heroLabel}>avoided by buying secondhand instead of new</Text>
        <Text style={styles.heroCaption}>
          ≈ {formatCount(kmEquivalent)} km not driven by car, based on average emissions
        </Text>

        <View style={styles.heroDivider} />

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{formatCount(ITEMS_BOUGHT)}</Text>
            <Text style={styles.heroStatLabel}>Items bought secondhand</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{formatWon(MONEY_SAVED_WON)}</Text>
            <Text style={styles.heroStatLabel}>Saved vs. buying new</Text>
          </View>
        </View>
        <Text style={styles.heroFootnote}>
          You paid {formatWon(spentWon)} total for items worth {formatWon(spentWon + MONEY_SAVED_WON)}{" "}
          at retail.
        </Text>
      </View>

      <Text style={styles.sectionHead} accessibilityRole="header">
        Your milestones
      </Text>
      <Text style={styles.sectionSub}>
        Thresholds you've crossed since your first secondhand purchase.
      </Text>
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <Pressable
        onPress={toggleMethodology}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityState={{ expanded: methodologyOpen }}
        accessibilityLabel={
          methodologyOpen ? "Hide how this is calculated" : "Show how this is calculated"
        }
        style={({ pressed }) => [styles.methodologyToggle, pressed && styles.pressed]}
      >
        <Text style={styles.methodologyToggleText}>
          {methodologyOpen ? "Hide how this is calculated" : "How we calculate this"}
        </Text>
        <Text style={styles.methodologyChevron}>{methodologyOpen ? "▲" : "▼"}</Text>
      </Pressable>

      {methodologyOpen ? (
        <View style={styles.methodologyBody} accessibilityLiveRegion="polite">
          <Text style={styles.methodologyText} accessibilityRole="alert">
            {METHODOLOGY_TEXT}
          </Text>
        </View>
      ) : null}

      <Text style={styles.tail}>
        Based on {formatCount(ITEMS_BOUGHT)} secondhand purchases at ~{CO2_KG_PER_ITEM} kg CO2
        avoided each. For your records — not an audited measurement.
      </Text>
    </View>
  );

  const renderMilestone = ({ item, index }: { item: Milestone; index: number }) => {
    const isLast = index === MILESTONES.length - 1;
    return (
      <View style={styles.milestoneRow}>
        <View style={styles.milestoneMarkerCol}>
          <MilestoneMarker status={item.status} />
          {!isLast ? <View style={styles.milestoneLine} /> : null}
        </View>
        <View style={styles.milestoneBody}>
          <Text style={styles.milestoneTitle}>{item.title}</Text>
          {item.status === "achieved" ? (
            <Text style={styles.milestoneMeta}>
              {item.dateLabel} · {item.co2AtThresholdKg} kg CO2 avoided by then
            </Text>
          ) : (
            <>
              <Text style={styles.milestoneMeta}>
                {formatCount(itemsToGo)} item{itemsToGo === 1 ? "" : "s"} to go ·{" "}
                {formatCount(ITEMS_BOUGHT)} of {formatCount(item.threshold)}
              </Text>
              <View
                style={styles.progressTrack}
                accessible
                accessibilityRole="progressbar"
                accessibilityLabel={`${progressPercent}% of the way to the ${item.title}`}
              >
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={MILESTONES}
        keyExtractor={(item) => item.id}
        renderItem={renderMilestone}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.band}>
        <View style={styles.bandTextWrap} accessibilityLiveRegion="polite">
          {shared ? (
            <Text style={styles.bandFeedback} accessibilityRole="alert">
              {SHARE_CONFIRMATION}
            </Text>
          ) : (
            <Text style={styles.bandLead}>Proud of this? It's worth sharing.</Text>
          )}
        </View>
        <Pressable
          onPress={handleShare}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Share my impact"
          style={({ pressed }) => [styles.shareBtn, pressed && styles.pressed]}
        >
          <Text style={styles.shareBtnText}>Share my impact</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.color.bg },
  listContent: { paddingBottom: tokens.space(6) },

  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    color: tokens.color.faint,
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  hero: {
    marginTop: tokens.space(5),
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(5),
  },
  heroValue: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  heroUnit: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  heroLabel: {
    marginTop: tokens.space(1),
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  heroCaption: {
    marginTop: tokens.space(1),
    fontSize: 12,
    color: tokens.color.faint,
  },
  heroDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginTop: tokens.space(4),
    marginBottom: tokens.space(4),
  },
  heroStatsRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  heroStat: {
    flex: 1,
    gap: 2,
  },
  heroStatDivider: {
    width: 1,
    backgroundColor: tokens.color.border,
    marginHorizontal: tokens.space(4),
  },
  heroStatValue: {
    fontSize: 20,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  heroStatLabel: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  heroFootnote: {
    marginTop: tokens.space(3),
    fontSize: 11,
    lineHeight: 16,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },

  sectionHead: {
    marginTop: tokens.space(6),
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sectionSub: {
    marginTop: tokens.space(1),
    marginBottom: tokens.space(2),
    fontSize: 13,
    color: tokens.color.muted,
  },

  milestoneRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(5),
  },
  milestoneMarkerCol: {
    alignItems: "center",
    width: 28,
  },
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  markerAchieved: {
    backgroundColor: tokens.color.accent,
  },
  markerUpcoming: {
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    backgroundColor: tokens.color.bg,
  },
  markerGlyph: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  markerGlyphOnAccent: {
    color: tokens.color.onAccent,
  },
  milestoneLine: {
    flex: 1,
    width: 2,
    minHeight: tokens.space(4),
    backgroundColor: tokens.color.border,
    marginTop: 2,
  },
  milestoneBody: {
    flex: 1,
    gap: 3,
    paddingBottom: tokens.space(5),
  },
  milestoneTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  milestoneMeta: {
    fontSize: 12,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  progressTrack: {
    marginTop: tokens.space(2),
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.color.accent,
  },

  footer: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(2),
  },
  methodologyToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(4),
  },
  methodologyToggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  methodologyChevron: {
    fontSize: 13,
    color: tokens.color.faint,
  },
  methodologyBody: {
    marginTop: tokens.space(3),
    padding: tokens.space(4),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.border,
  },
  methodologyText: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.ink2,
  },
  tail: {
    marginTop: tokens.space(4),
    fontSize: 11,
    lineHeight: 16,
    color: tokens.color.faint,
  },
  pressed: {
    opacity: 0.8,
  },

  band: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  bandTextWrap: { flex: 1 },
  bandLead: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  bandFeedback: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  shareBtn: {
    minHeight: 48,
    paddingHorizontal: tokens.space(5),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});

// Named export matches this catalog's registration convention (see ../../../screens.ts, which
// imports every screen by name); default export satisfies the generation brief's "export a
// single default component" requirement for this standalone candidate file.
export default MyImpactScreen;
