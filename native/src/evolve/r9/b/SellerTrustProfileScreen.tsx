// native/src/evolve/r8/b/SellerTrustProfileScreen.tsx — auto-native-r8 candidate b.
//
// SELLER TRUST PROFILE, built as a *claim with a stress test* rather than a profile page.
// The skeleton is: one asserted range (not a point score) on an ink surface, then controls that
// SUBTRACT evidence from underneath it so the range visibly reacts. This is deliberately none of
// the shapes this app has already spent: no standing list, no chronological thread, no checklist,
// no settings scroll, no wizard, no timeline, no accordion, no filter feed — and reviews are not
// the skeleton, the rating distribution is.
//
// Why a range: 4.7 from 3 deals and 4.7 from 312 deals print identically as a star average. A
// 95% interval computed from the seller's own distribution cannot print identically — n=9 spans
// 1.82 stars, n=312 spans 0.17. Sample size, recency and buyer independence therefore sit inside
// the same card as the number, not in a footnote.
//
// Nothing is gated behind a tap. The default lens is the full evidence base with every figure
// already resolved; the chips only narrow it, and each chip carries its own sample size unpressed
// so a thin subset (Electronics, 9) announces itself before it is selected. There is deliberately
// NO fixed bottom band — this screen has no blocked terminal action to state-machine over
// (GENERATION.md §3: a band with no work to do gives up its seat).
import { useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ACCOUNT_LIMITS,
  ALL_EVIDENCE,
  AXIS_MAX,
  AXIS_MIN,
  INDEPENDENT_SHARE_PCT,
  LENSES,
  MIN_SAMPLE,
  SELLER,
  STARS,
  TOP_STAR,
  countTotal,
  cumulativeAtOrBelow,
  round1,
  sharePct,
  trustStats,
  type LensId,
  type Star,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export function SellerTrustProfileScreen() {
  const [lensId, setLensId] = useState<LensId>("all");
  const [following, setFollowing] = useState(false);
  const [showMedian, setShowMedian] = useState(false);
  const [openStar, setOpenStar] = useState<Star | null>(null);

  const lens = LENSES.find((item) => item.id === lensId) ?? ALL_EVIDENCE;
  const baseline = trustStats(ALL_EVIDENCE.counts);
  const stats = trustStats(lens.counts);
  const isBaseline = lens.id === ALL_EVIDENCE.id;

  const widthRatio = round1(stats.width / baseline.width);
  const meanGap = Math.round((baseline.mean - stats.mean) * 100) / 100;
  const medianGap = Math.round((stats.mean - SELLER.categoryMedian) * 100) / 100;

  function readVerdict(): { word: string; body: string } {
    if (isBaseline) {
      return {
        word: "Full evidence base",
        body: `Every rated deal, ${stats.n} of them. The range is ${stats.width.toFixed(2)} stars wide — the narrowest this seller can produce. Each filter below removes evidence, so it can only get wider from here.`,
      };
    }
    if (stats.n < MIN_SAMPLE) {
      return {
        word: "Too thin to judge",
        body: `Only ${stats.n} rated deals. The range spans ${stats.width.toFixed(2)} stars, ${widthRatio.toFixed(1)} times the full base. An average of ${stats.mean.toFixed(2)} here settles nothing either way.`,
      };
    }
    if (stats.mean >= baseline.low) {
      return {
        word: "Holds",
        body: `Average ${stats.mean.toFixed(2)} stays inside the full-evidence range, but it rests on ${stats.n} deals and the range is ${widthRatio.toFixed(1)} times wider.`,
      };
    }
    return {
      word: "Softens",
      body: `Average ${stats.mean.toFixed(2)} sits ${meanGap.toFixed(2)} below the headline and under the full-evidence range, on ${stats.n} deals with a range ${widthRatio.toFixed(1)} times wider.`,
    };
  }

  // Verdict word first, sentence second — the judgement is never carried by colour alone.
  const verdict = readVerdict();

  const bandLow = Math.max(AXIS_MIN, stats.low);
  const bandHigh = Math.min(AXIS_MAX, stats.high);

  const buyerSharePct = sharePct(lens.distinctBuyers, stats.n);
  const buyersIndependent = buyerSharePct >= INDEPENDENT_SHARE_PCT;

  const readStar = (star: Star): string => {
    const count = lens.counts[star];
    if (star === TOP_STAR) {
      return `${count} of ${stats.n} rated deals came in at 5 stars, ${sharePct(count, stats.n).toFixed(1)} percent. The other ${stats.n - count} did not.`;
    }
    const cumulative = cumulativeAtOrBelow(lens.counts, star);
    const oneIn = Math.round(stats.n / cumulative);
    return `${cumulative} of ${stats.n} rated deals came in at ${star} star${star === 1 ? "" : "s"} or lower, ${sharePct(cumulative, stats.n).toFixed(1)} percent. About 1 deal in ${oneIn}.`;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{SELLER.initials}</Text>
        </View>
        <View style={styles.topBarBody}>
          <Text style={styles.sellerName} accessibilityRole="header">
            {SELLER.name}
          </Text>
          <Text style={styles.sellerMeta}>
            {SELLER.joinedLabel} · ID verified · {SELLER.completedDeals} deals
          </Text>
        </View>
        <Pressable
          onPress={() => setFollowing((prev) => !prev)}
          accessibilityRole="button"
          accessibilityState={{ selected: following }}
          accessibilityLabel={
            following
              ? `Following ${SELLER.name}. Tap to stop following.`
              : `Follow ${SELLER.name}`
          }
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.followPill,
            following && styles.followPillOn,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[styles.followText, following && styles.followTextOn]}
          >
            {following ? "Following" : "Follow"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Claim card. Sample size and recency live at the same type level as the number. */}
        <View style={styles.claimCard} accessibilityLiveRegion="polite">
          <Text style={styles.claimKicker} accessibilityRole="header">
            {lens.claimLabel}
          </Text>
          <Text style={styles.claimRange}>
            {stats.low.toFixed(2)} – {stats.high.toFixed(2)}
          </Text>
          <Text style={styles.claimRangeCaption}>
            where this seller&apos;s true rating most likely sits
          </Text>

          <View style={styles.claimStats}>
            <View style={styles.claimStat}>
              <Text style={styles.claimStatValue}>{stats.mean.toFixed(2)}</Text>
              <Text style={styles.claimStatLabel}>average star</Text>
            </View>
            <View style={styles.claimStatDivider} />
            <View style={styles.claimStat}>
              <Text style={styles.claimStatValue}>{stats.n}</Text>
              <Text style={styles.claimStatLabel}>rated deals</Text>
            </View>
            <View style={styles.claimStatDivider} />
            <View style={styles.claimStat}>
              <Text style={styles.claimStatValue}>{lens.within12moPct}%</Text>
              <Text style={styles.claimStatLabel}>within 12 months</Text>
            </View>
          </View>

          <View
            style={styles.axis}
            accessible
            accessibilityRole="image"
            accessibilityLabel={`Star scale from ${AXIS_MIN} to ${AXIS_MAX}. Likely range ${stats.low.toFixed(2)} to ${stats.high.toFixed(2)}, centred on ${stats.mean.toFixed(2)}.${showMedian ? ` Category median ${SELLER.categoryMedian.toFixed(2)} marked.` : ""}`}
          >
            <View style={styles.axisRail}>
              <View style={{ flex: bandLow - AXIS_MIN }} />
              <View style={[styles.axisBand, { flex: bandHigh - bandLow }]}>
                <View style={styles.axisBandTick} />
              </View>
              <View style={{ flex: AXIS_MAX - bandHigh }} />
              {showMedian ? (
                <View style={styles.medianOverlay}>
                  <View style={{ flex: SELLER.categoryMedian - AXIS_MIN }} />
                  <View style={styles.medianHalo}>
                    <View style={styles.medianCore} />
                  </View>
                  <View style={{ flex: AXIS_MAX - SELLER.categoryMedian }} />
                </View>
              ) : null}
            </View>
            <View style={styles.axisLabels}>
              <Text style={styles.axisLabel}>{AXIS_MIN.toFixed(1)}</Text>
              <Text style={styles.axisNote}>scale truncated below 2.5</Text>
              <Text style={styles.axisLabel}>{AXIS_MAX.toFixed(1)}</Text>
            </View>
          </View>

          {showMedian ? (
            <Text style={styles.medianCaption}>
              Category median for {SELLER.categoryLabel} is{" "}
              {SELLER.categoryMedian.toFixed(2)} — this filter sits{" "}
              {Math.abs(medianGap).toFixed(2)}{" "}
              {medianGap >= 0 ? "above" : "below"} it.
            </Text>
          ) : null}

          <Text style={styles.claimLatest}>
            Most recent rated deal · {lens.latestRatedLabel}
          </Text>

          <View
            style={styles.verdict}
            accessible
            accessibilityRole="alert"
            accessibilityLabel={`${verdict.word}. ${verdict.body}`}
          >
            <Text style={styles.verdictWord}>{verdict.word}</Text>
            <Text style={styles.verdictBody}>{verdict.body}</Text>
          </View>
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchBody}>
            <Text style={styles.switchLabel}>Mark the category median</Text>
            <Text style={styles.switchHint}>
              Adds {SELLER.categoryLabel} median {SELLER.categoryMedian.toFixed(2)} to the
              scale above
            </Text>
          </View>
          <Switch
            value={showMedian}
            onValueChange={setShowMedian}
            accessibilityLabel="Mark the category median on the star scale"
            trackColor={{ false: tokens.color.border, true: tokens.color.accent }}
            thumbColor={tokens.color.bg}
            ios_backgroundColor={tokens.color.border}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Stress-test the number
          </Text>
          <Text style={styles.sectionCaption}>
            Each filter takes evidence away rather than adding any. Watch whether the
            range survives the cut.
          </Text>
          <FlatList
            style={styles.chipList}
            contentContainerStyle={styles.chipRow}
            data={LENSES}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            accessibilityRole="radiogroup"
            accessibilityLabel="Evidence filter"
            renderItem={({ item }) => {
              const selected = item.id === lens.id;
              const n = countTotal(item.counts);
              return (
                <Pressable
                  onPress={() => {
                    setLensId(item.id);
                    setOpenStar(null);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, checked: selected }}
                  accessibilityLabel={`${item.chip}, ${n} rated deals`}
                  hitSlop={HIT_SLOP}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipOn,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                    {item.chip} · {n}
                  </Text>
                </Pressable>
              );
            }}
          />
          <Text style={styles.lensNote}>{lens.note}</Text>
          {isBaseline ? null : (
            <View style={styles.deltaBox}>
              <Text style={styles.deltaTitle}>Against all evidence</Text>
              <Text style={styles.deltaBody}>
                average {Math.abs(meanGap).toFixed(2)}{" "}
                {meanGap >= 0 ? "lower" : "higher"} · range {widthRatio.toFixed(1)}{" "}
                times wider · {baseline.n - stats.n} fewer rated deals
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            How those ratings are spread
          </Text>
          <Text style={styles.sectionCaption}>
            Counts inside the current filter. An average hides which shape produced it.
          </Text>
          <View style={styles.histogram}>
            {STARS.map((star) => {
              const count = lens.counts[star];
              const selected = openStar === star;
              return (
                <Pressable
                  key={star}
                  onPress={() =>
                    setOpenStar((prev) => (prev === star ? null : star))
                  }
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${star} star, ${count} of ${stats.n} rated deals. Tap to read this row as a frequency.`}
                  hitSlop={HIT_SLOP}
                  style={({ pressed }) => [
                    styles.histRow,
                    selected && styles.histRowOn,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.histStar, selected && styles.histStarOn]}>
                    {star}
                  </Text>
                  <View style={styles.histTrack}>
                    <View
                      style={[
                        styles.histFill,
                        selected && styles.histFillOn,
                        { flex: count },
                      ]}
                    />
                    <View style={{ flex: stats.n - count }} />
                  </View>
                  <Text style={styles.histCount}>{count}</Text>
                  <Text style={styles.histPct}>
                    {sharePct(count, stats.n).toFixed(1)}%
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {openStar === null ? (
            <Text style={styles.readoutHint}>
              Tap a row to read it as a frequency instead of a bar.
            </Text>
          ) : (
            <View style={styles.readout} accessibilityLiveRegion="polite">
              <Text style={styles.readoutText}>{readStar(openStar)}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            What the number cannot cover
          </Text>
          <Text style={styles.sectionCaption}>
            Counter-evidence stays on screen at every filter. Only the first row moves
            with the filter.
          </Text>

          <View style={styles.limitCard}>
            <View style={styles.limitHead}>
              <Text style={styles.limitTitle}>Buyer independence</Text>
              <Text style={styles.limitVerdict}>
                {buyersIndependent ? "Independent" : "Repeat-weighted"}
              </Text>
            </View>
            <Text style={styles.limitBody}>
              {lens.distinctBuyers} distinct buyers stand behind {stats.n} rated deals
              in this filter. {buyerSharePct.toFixed(1)}% of these ratings come from a
              buyer who appears exactly once.
            </Text>
            <Text style={styles.limitScope}>MOVES WITH THE FILTER</Text>
          </View>

          {ACCOUNT_LIMITS.map((limit) => (
            <View key={limit.id} style={styles.limitCard}>
              <View style={styles.limitHead}>
                <Text style={styles.limitTitle}>{limit.title}</Text>
                <Text style={styles.limitVerdict}>{limit.verdict}</Text>
              </View>
              <Text style={styles.limitBody}>{limit.body}</Text>
              <Text style={styles.limitScope}>ACCOUNT-WIDE</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${SELLER.activeListings} active listings from ${SELLER.name}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [styles.actionPrimary, pressed && styles.pressed]}
          >
            <Text style={styles.actionPrimaryText}>
              View {SELLER.activeListings} active listings
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Message ${SELLER.name}`}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.actionSecondary,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.actionSecondaryText}>Message seller</Text>
          </Pressable>
        </View>

        <Text style={styles.footnote}>
          The range is a 95% interval computed from this seller&apos;s own rating
          distribution. A wide range means few ratings, not bad ones — and a narrow one
          is a claim about consistency, not about you.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SellerTrustProfileScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },
  pressed: { opacity: 0.8 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: tokens.color.onInk,
  },
  topBarBody: { flex: 1, gap: 2 },
  sellerName: { fontSize: 17, fontWeight: "700", color: tokens.color.ink },
  sellerMeta: { fontSize: 12, color: tokens.color.muted },
  followPill: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.ink2,
  },
  followPillOn: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  followText: { fontSize: 13, fontWeight: "700", color: tokens.color.ink },
  followTextOn: { color: tokens.color.onAccent },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(10),
  },

  claimCard: {
    backgroundColor: tokens.color.ink,
    borderRadius: tokens.radius.md,
    padding: tokens.space(5),
    gap: tokens.space(3),
  },
  claimKicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: tokens.color.onInkMuted,
  },
  claimRange: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "700",
    letterSpacing: -1,
    color: tokens.color.onInk,
    fontVariant: ["tabular-nums"],
  },
  claimRangeCaption: {
    marginTop: -tokens.space(2),
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.onInkMuted,
  },

  claimStats: { flexDirection: "row", alignItems: "stretch" },
  claimStat: { flex: 1, gap: 2 },
  claimStatDivider: {
    width: 1,
    marginHorizontal: tokens.space(3),
    backgroundColor: tokens.color.muted,
  },
  claimStatValue: {
    fontSize: 19,
    fontWeight: "700",
    color: tokens.color.onInk,
    fontVariant: ["tabular-nums"],
  },
  claimStatLabel: { fontSize: 11, lineHeight: 15, color: tokens.color.onInkMuted },

  axis: { gap: tokens.space(2) },
  axisRail: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    backgroundColor: tokens.color.ink2,
    borderWidth: 1,
    borderColor: tokens.color.muted,
    overflow: "hidden",
  },
  axisBand: {
    minWidth: 8,
    backgroundColor: tokens.color.onInk,
    alignItems: "center",
    justifyContent: "center",
  },
  axisBandTick: {
    width: 2,
    alignSelf: "stretch",
    backgroundColor: tokens.color.accent,
  },
  medianOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
  },
  medianHalo: {
    width: 6,
    alignSelf: "stretch",
    backgroundColor: tokens.color.onInk,
    alignItems: "center",
    justifyContent: "center",
  },
  medianCore: {
    width: 2,
    alignSelf: "stretch",
    backgroundColor: tokens.color.accent,
  },
  axisLabels: { flexDirection: "row", alignItems: "center" },
  axisLabel: {
    fontSize: 11,
    color: tokens.color.onInkMuted,
    fontVariant: ["tabular-nums"],
  },
  axisNote: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    color: tokens.color.onInkMuted,
  },
  medianCaption: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.onInkMuted,
  },
  claimLatest: { fontSize: 12, color: tokens.color.onInkMuted },

  verdict: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.muted,
    paddingTop: tokens.space(3),
    gap: tokens.space(1),
  },
  verdictWord: { fontSize: 16, fontWeight: "700", color: tokens.color.onInk },
  verdictBody: { fontSize: 13, lineHeight: 19, color: tokens.color.onInkMuted },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(4),
    minHeight: 56,
    paddingVertical: tokens.space(2),
  },
  switchBody: { flex: 1, gap: 2 },
  switchLabel: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },
  switchHint: { fontSize: 12, lineHeight: 17, color: tokens.color.muted },

  section: { marginTop: tokens.space(5), gap: tokens.space(2) },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: tokens.color.ink },
  sectionCaption: { fontSize: 13, lineHeight: 19, color: tokens.color.muted },

  chipList: { flexGrow: 0, marginTop: tokens.space(1) },
  chipRow: { gap: tokens.space(2), paddingRight: tokens.space(2) },
  chip: {
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  chipOn: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  chipText: { fontSize: 13, fontWeight: "600", color: tokens.color.ink2 },
  chipTextOn: { color: tokens.color.onAccent },
  lensNote: { fontSize: 13, lineHeight: 19, color: tokens.color.ink2 },

  deltaBox: {
    marginTop: tokens.space(1),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    gap: 2,
  },
  deltaTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: tokens.color.faint,
  },
  deltaBody: { fontSize: 13, lineHeight: 19, color: tokens.color.ink },

  histogram: { marginTop: tokens.space(1) },
  histRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    minHeight: 44,
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.sm,
  },
  histRowOn: { backgroundColor: tokens.color.border },
  histStar: {
    width: 14,
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  histStarOn: { color: tokens.color.ink, fontWeight: "700" },
  histTrack: {
    flex: 1,
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  histFill: { minWidth: 4, backgroundColor: tokens.color.ink2 },
  histFillOn: { backgroundColor: tokens.color.accent },
  histCount: {
    width: 34,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  histPct: {
    width: 46,
    textAlign: "right",
    fontSize: 12,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  readoutHint: { fontSize: 12, color: tokens.color.faint },
  readout: {
    borderLeftWidth: 2,
    borderLeftColor: tokens.color.accent,
    paddingLeft: tokens.space(3),
    paddingVertical: tokens.space(1),
  },
  readoutText: { fontSize: 13, lineHeight: 19, color: tokens.color.ink },

  limitCard: {
    marginTop: tokens.space(1),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  limitHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: tokens.space(3),
  },
  limitTitle: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },
  limitVerdict: {
    flexShrink: 1,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  limitBody: { fontSize: 13, lineHeight: 19, color: tokens.color.muted },
  limitScope: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: tokens.color.faint,
  },

  actions: { marginTop: tokens.space(6), gap: tokens.space(3) },
  actionPrimary: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
  },
  actionPrimaryText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  actionSecondary: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(4),
  },
  actionSecondaryText: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },

  footnote: {
    marginTop: tokens.space(6),
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
  },
});
