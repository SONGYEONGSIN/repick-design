// native/src/storefront/SellerStorefrontScreen.tsx — auto-native-r15 candidate a.
//
// Seller Storefront: a public-facing profile page for viewing ONE seller — genuinely new relative
// to the existing catalog. It is not `account` (that's the viewer's OWN settings) and not
// `verification` (that screen runs an active, step-by-step, blocking identity-verification flow
// FOR the person being verified). Here the seller is already verified — a completed-state fact —
// so the badge below reuses the *meaning* of that concept (a checked, proof-style credential) as a
// static read-only summary, with no steps, no progress, and nothing to unblock.
//
// Per GENERATION.md §3: this is a read-mostly browsing screen with no linear multi-step workflow
// to gate, so the fixed bottom band is a persistent action bar, never a state machine. Both of its
// buttons produce a real, visible outcome on press (a live-region announcement + a real toggled
// state for Follow) rather than being silent no-ops — see the component body for the reasoning on
// which one is the screen's single primary action.
import { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../tokens";
import {
  FOLLOW_FEEDBACK,
  LISTINGS,
  MESSAGE_FEEDBACK,
  REPUTATION,
  SELLER,
  SORT_OPTIONS,
  UNFOLLOW_FEEDBACK,
  VERIFICATION,
  type Listing,
  type SortKey,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

// Thousands-separated KRW formatting, no toLocaleString (deterministic across environments).
// Won-sign mitigation choice: option 1 from GENERATION.md §1 — a literal space between ₩ and the
// digits, via a separate Text with marginRight, so the sign's horizontal stroke never touches the
// adjacent digit at body-text size. See candidates/a.md for the full note.
function formatDigits(won: number): string {
  return Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Price({ krw, size }: { krw: number; size: "card" | "hero" }) {
  return (
    <View style={styles.priceRow}>
      <Text
        style={[styles.wonSign, size === "hero" && styles.wonSignHero]}
        accessibilityElementsHidden
      >
        {"₩"}
      </Text>
      <Text
        style={[styles.priceDigits, size === "hero" && styles.priceDigitsHero]}
        accessibilityLabel={`${formatDigits(krw)} won`}
      >
        {formatDigits(krw)}
      </Text>
    </View>
  );
}

function sortListings(list: Listing[], key: SortKey): Listing[] {
  const copy = [...list];
  copy.sort((a, b) => {
    let diff = 0;
    if (key === "price") diff = a.priceKrw - b.priceKrw;
    else if (key === "newest") diff = a.recencyRank - b.recencyRank;
    else diff = a.conditionRank - b.conditionRank;
    // Deterministic tie-break so re-sorting the same data always yields the same order.
    return diff !== 0 ? diff : a.id.localeCompare(b.id);
  });
  return copy;
}

function ListingCard({ item }: { item: Listing }) {
  return (
    <View style={styles.card}>
      <View style={styles.thumb}>
        <Text style={styles.thumbLabel}>{item.imageLabel}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardBrand}>{item.brand}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.cardMetaRow}>
          <View style={styles.matchPill}>
            <Text style={styles.matchPillText}>{item.matchPercent}% match</Text>
          </View>
          <Text style={styles.conditionText}>{item.conditionLabel}</Text>
        </View>

        <View style={styles.cardPriceRow}>
          <Price krw={item.priceKrw} size="card" />
          <Text style={styles.discountText}>-{item.discountPercent}%</Text>
        </View>
        <Text style={styles.originalPrice}>
          {"₩"} {formatDigits(item.originalPriceKrw)}
        </Text>
        <Text style={styles.listedAgo}>{item.listedDaysAgoLabel}</Text>
      </View>
    </View>
  );
}

export function SellerStorefrontScreen() {
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [following, setFollowing] = useState(false);
  const [bandFeedback, setBandFeedback] = useState<string | null>(null);

  const sorted = useMemo(() => sortListings(LISTINGS, sortKey), [sortKey]);
  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.key === sortKey)?.label ?? "";

  const handleSort = (key: SortKey) => {
    setSortKey(key);
  };

  // Follow is the screen's single primary action: it is the one control that changes real,
  // persisted-feeling state that this specific storefront view exists to offer (subscribing to a
  // seller you don't yet follow). It is never a silent no-op — the label, style, and the band's
  // live-region text all flip immediately on press.
  const toggleFollow = () => {
    const next = !following;
    setFollowing(next);
    setBandFeedback(next ? FOLLOW_FEEDBACK : UNFOLLOW_FEEDBACK);
  };

  // Secondary affordance: scaffolding for the not-yet-built chat-open flow (the real thread lives
  // in offer-thread / chat elsewhere in the app). It carries no accessibilityHint promising
  // navigation it doesn't perform, and it still produces a real, visible confirmation rather than
  // doing nothing.
  const handleMessage = () => {
    setBandFeedback(MESSAGE_FEEDBACK);
  };

  const header = (
    <View>
      <View style={styles.identityRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{SELLER.initials}</Text>
        </View>
        <View style={styles.identityBody}>
          <Text style={styles.sellerName} accessibilityRole="header">
            {SELLER.name}
          </Text>
          <Text style={styles.sellerHandle}>{SELLER.handle}</Text>
          <Text style={styles.sellerMeta}>
            {SELLER.location} · {SELLER.memberSinceLabel}
          </Text>
        </View>
      </View>

      <View
        style={styles.verifiedRow}
        accessible
        accessibilityLabel={`Verified seller. ${VERIFICATION.detail}. ${VERIFICATION.verifiedSinceLabel}.`}
      >
        <View style={styles.verifiedMark}>
          <Text style={styles.verifiedMarkGlyph}>{"✓"}</Text>
        </View>
        <View style={styles.verifiedBody}>
          <Text style={styles.verifiedTitle}>Verified Seller</Text>
          <Text style={styles.verifiedDetail}>
            {VERIFICATION.detail} · {VERIFICATION.verifiedSinceLabel}
          </Text>
        </View>
      </View>

      <Text style={styles.bio}>{SELLER.bio}</Text>

      <View style={styles.statsGrid}>
        {[
          { value: REPUTATION.avgRating.toFixed(1), label: "Avg. rating" },
          { value: String(REPUTATION.reviewCount), label: "Reviews" },
          { value: String(REPUTATION.completedOrders), label: "Orders sold" },
          {
            value: `${REPUTATION.onTimeShipRatePercent}%`,
            label: "On-time ship",
          },
        ].map((stat, i, arr) => (
          <View
            key={stat.label}
            style={[
              styles.statTile,
              i === arr.length - 1 && styles.statTileLast,
            ]}
            accessible
            accessibilityLabel={`${stat.value} ${stat.label}`}
          >
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.responseTime}>{REPUTATION.responseTimeLabel}</Text>

      <View style={styles.divider} />

      <View style={styles.listingsHead}>
        <Text style={styles.sectionHead} accessibilityRole="header">
          Active Listings
        </Text>
        <View accessibilityLiveRegion="polite">
          <Text style={styles.resultCount} accessibilityRole="alert">
            {sorted.length} items · sorted by {activeSortLabel}
          </Text>
        </View>
      </View>

      <View style={styles.sortRow}>
        {SORT_OPTIONS.map((opt) => {
          const selected = opt.key === sortKey;
          return (
            <Pressable
              key={opt.key}
              onPress={() => handleSort(opt.key)}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Sort by ${opt.label}`}
              style={({ pressed }) => [
                styles.sortPill,
                selected && styles.sortPillSelected,
                pressed && styles.sortPillPressed,
              ]}
            >
              <Text
                style={[
                  styles.sortPillText,
                  selected && styles.sortPillTextSelected,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard item={item} />}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.band} accessibilityLiveRegion="polite">
        {bandFeedback ? (
          <Text style={styles.bandFeedback} accessibilityRole="alert">
            {bandFeedback}
          </Text>
        ) : (
          <Text style={styles.bandLead}>
            {following
              ? `Following ${SELLER.name}`
              : `Viewing ${SELLER.name}'s storefront`}
          </Text>
        )}
        <View style={styles.bandActions}>
          <Pressable
            onPress={toggleFollow}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityState={{ selected: following }}
            accessibilityLabel={
              following
                ? `Unfollow ${SELLER.name}`
                : `Follow ${SELLER.name}`
            }
            style={({ pressed }) => [
              styles.primaryBtn,
              following && styles.primaryBtnActive,
              pressed && styles.btnPressed,
            ]}
          >
            <Text
              style={[
                styles.primaryBtnText,
                following && styles.primaryBtnTextActive,
              ]}
            >
              {following ? "Following ✓" : "Follow"}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleMessage}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={`Message ${SELLER.name}`}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.secondaryBtnText}>Message seller</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const CARD_GAP = tokens.space(3);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },

  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(4),
    paddingTop: tokens.space(4),
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  identityBody: {
    flex: 1,
    gap: 2,
  },
  sellerName: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    letterSpacing: -0.2,
  },
  sellerHandle: {
    fontSize: 13,
    color: tokens.color.faint,
  },
  sellerMeta: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: 2,
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    marginTop: tokens.space(4),
    padding: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
  },
  verifiedMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedMarkGlyph: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  verifiedBody: {
    flex: 1,
    gap: 1,
  },
  verifiedTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  verifiedDetail: {
    fontSize: 12,
    color: tokens.color.muted,
  },

  bio: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    marginTop: tokens.space(4),
  },

  statsGrid: {
    flexDirection: "row",
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  statTile: {
    flex: 1,
    alignItems: "center",
    paddingVertical: tokens.space(3),
    borderRightWidth: 1,
    borderRightColor: tokens.color.border,
  },
  statTileLast: {
    borderRightWidth: 0,
  },
  statValue: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  statLabel: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: 2,
    textAlign: "center",
  },
  responseTime: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(2),
    textAlign: "center",
  },

  divider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginTop: tokens.space(5),
    marginBottom: tokens.space(4),
  },

  listingsHead: {
    gap: 2,
  },
  sectionHead: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  resultCount: {
    fontSize: 12,
    color: tokens.color.muted,
  },

  sortRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space(2),
    marginTop: tokens.space(3),
    marginBottom: tokens.space(4),
  },
  sortPill: {
    minHeight: 36,
    paddingHorizontal: tokens.space(3),
    borderRadius: 18,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  sortPillSelected: {
    backgroundColor: tokens.color.ink,
    borderColor: tokens.color.ink,
  },
  sortPillPressed: {
    opacity: 0.7,
  },
  sortPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  sortPillTextSelected: {
    color: tokens.color.onInk,
  },

  columnWrapper: {
    gap: CARD_GAP,
  },
  card: {
    flex: 1,
    marginBottom: CARD_GAP,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  thumb: {
    height: 96,
    backgroundColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  cardBody: {
    padding: tokens.space(3),
    gap: 3,
  },
  cardBrand: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
    lineHeight: 17,
    minHeight: 34,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  matchPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  matchPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  conditionText: {
    fontSize: 11,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  cardPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: tokens.space(2),
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  wonSign: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink,
    marginRight: 3,
  },
  wonSignHero: {
    fontSize: 18,
  },
  priceDigits: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  priceDigitsHero: {
    fontSize: 20,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  originalPrice: {
    fontSize: 11,
    color: tokens.color.faint,
    textDecorationLine: "line-through",
    fontVariant: ["tabular-nums"],
  },
  listedAgo: {
    fontSize: 10,
    color: tokens.color.faint,
    marginTop: 2,
  },

  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(3),
  },
  bandLead: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  bandFeedback: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  bandActions: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  primaryBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  primaryBtnActive: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  primaryBtnTextActive: {
    color: tokens.color.accent,
  },
  secondaryBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  btnPressed: {
    opacity: 0.8,
  },
});
