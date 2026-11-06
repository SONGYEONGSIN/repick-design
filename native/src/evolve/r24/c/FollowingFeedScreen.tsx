// native/src/evolve/r24/c/FollowingFeedScreen.tsx — auto-native-r24 candidate c.
//
// Following Feed: a buyer manages which sellers they follow and scrolls one feed of new
// listings posted by those sellers. This is a social-graph concept (who you follow → what
// shows up), genuinely distinct from `watchlist` (individual saved items you track price on)
// and from `storefront` (one seller's own public page). Nothing here saves a specific item and
// nothing here is a single seller's profile — it's the buyer's own following list plus the feed
// that list produces.
//
// Per GENERATION.md §3: a fixed bottom band is only used when it does real state-machine work
// (a blocked workflow) or is a persistent action bar for a read-only completed record. Neither
// applies here — there is no blocked step and no single terminal action the screen exists to
// gate, so per the doctrine's own carve-out ("밴드가 아예 없는 것도 유효한 선택이다") this screen
// has zero fixed chrome. Everything — the seller list, the filter tabs, and the feed itself —
// scrolls together in one FlatList via ListHeaderComponent. Adding a decorative bottom bar here
// would be exactly the "band for its own sake" anti-pattern the doctrine warns against.
//
// Two real interactions, both backed by actual React state:
//  1. Follow/Unfollow — a Pressable per seller row that flips `followed[sellerId]` and changes
//     its own visible label text (not just a color/icon swap).
//  2. Filter tabs (All / New Arrivals / Ending Soon) — a Pressable per tab that changes
//     `activeFilter`, which changes which FeedItems the FlatList renders.
// The two states compose: unfollowing a seller removes their listings from the feed
// immediately (the feed IS the following graph), which is real, visible, and not decorative.
import { useMemo, useState } from "react";
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
  FEED_ITEMS,
  FILTER_TABS,
  SELLERS,
  formatDigits,
  type FeedItem,
  type FilterKey,
  type Seller,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const SWATCHES = [tokens.color.swatch1, tokens.color.swatch2, tokens.color.swatch3];
const SELLERS_BY_ID: Record<string, Seller> = Object.fromEntries(
  SELLERS.map((s) => [s.id, s]),
);

function Price({ krw }: { krw: number }) {
  return (
    <View style={styles.priceRow}>
      <Text style={styles.wonSign} accessibilityElementsHidden>
        {"₩"}
      </Text>
      <Text style={styles.priceDigits} accessibilityLabel={`${formatDigits(krw)} won`}>
        {formatDigits(krw)}
      </Text>
    </View>
  );
}

function SellerRow({
  seller,
  isFollowing,
  onToggle,
}: {
  seller: Seller;
  isFollowing: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <View style={styles.sellerRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{seller.initials}</Text>
      </View>
      <View style={styles.sellerBody}>
        <Text style={styles.sellerName} numberOfLines={1}>
          {seller.name}
        </Text>
        <Text style={styles.sellerMeta}>
          {seller.handle} · {seller.listingsCountLabel}
        </Text>
      </View>
      <Pressable
        onPress={() => onToggle(seller.id)}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityState={{ selected: isFollowing }}
        accessibilityLabel={`${isFollowing ? "Unfollow" : "Follow"} ${seller.name}`}
        style={({ pressed }) => [
          styles.followBtn,
          isFollowing && styles.followBtnActive,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.followBtnText, isFollowing && styles.followBtnTextActive]}>
          {isFollowing ? "Following" : "Follow"}
        </Text>
      </Pressable>
    </View>
  );
}

function tagLabel(tag: FeedItem["tag"]): string | null {
  if (tag === "new") return "New arrival";
  if (tag === "ending") return "Ending soon";
  return null;
}

function FeedCard({ item, index }: { item: FeedItem; index: number }) {
  const seller = SELLERS_BY_ID[item.sellerId];
  const swatch = SWATCHES[index % SWATCHES.length];
  const label = tagLabel(item.tag);
  return (
    <View style={styles.card}>
      <View style={[styles.thumb, { backgroundColor: swatch }]}>
        <View style={styles.thumbBadge}>
          <Text style={styles.thumbLabel} numberOfLines={1}>
            {item.brand}
          </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardSeller} numberOfLines={1}>
          By {seller?.name ?? "Unknown seller"}
        </Text>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.cardBottomRow}>
          <Price krw={item.priceKrw} />
          {label ? (
            <View
              style={[
                styles.tagPill,
                item.tag === "ending" ? styles.tagPillEnding : styles.tagPillNew,
              ]}
            >
              <Text
                style={[
                  styles.tagPillText,
                  item.tag === "ending" ? styles.tagPillTextEnding : styles.tagPillTextNew,
                ]}
              >
                {label}
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.postedLabel}>{item.postedLabel}</Text>
      </View>
    </View>
  );
}

export function FollowingFeedScreen() {
  const [followed, setFollowed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SELLERS.map((s) => [s.id, s.followedDefault])),
  );
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const toggleFollow = (sellerId: string) => {
    setFollowed((prev) => ({ ...prev, [sellerId]: !prev[sellerId] }));
  };

  const followedCount = useMemo(
    () => Object.values(followed).filter(Boolean).length,
    [followed],
  );

  const visibleItems = useMemo(
    () =>
      FEED_ITEMS.filter(
        (item) =>
          followed[item.sellerId] &&
          (activeFilter === "all" || item.tag === activeFilter),
      ),
    [followed, activeFilter],
  );

  const header = (
    <View>
      <Text style={styles.h1} accessibilityRole="header">
        Following Feed
      </Text>
      <Text style={styles.sub}>
        {followedCount} {followedCount === 1 ? "seller" : "sellers"} followed ·{" "}
        {visibleItems.length} {visibleItems.length === 1 ? "listing" : "listings"} in your feed
      </Text>

      <Text style={styles.sectionHead} accessibilityRole="header">
        Sellers You Follow
      </Text>
      <View style={styles.sellerList}>
        {SELLERS.map((seller) => (
          <SellerRow
            key={seller.id}
            seller={seller}
            isFollowing={!!followed[seller.id]}
            onToggle={toggleFollow}
          />
        ))}
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionHead} accessibilityRole="header">
        Feed
      </Text>
      <View style={styles.tabRow}>
        {FILTER_TABS.map((tab) => {
          const selected = tab.key === activeFilter;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveFilter(tab.key)}
              hitSlop={HIT_SLOP}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`Filter: ${tab.label}`}
              style={({ pressed }) => [
                styles.tabPill,
                selected && styles.tabPillSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.tabPillText, selected && styles.tabPillTextSelected]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const empty = (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyText}>
        {followedCount === 0
          ? "You aren't following any sellers yet. Follow a seller above to see their listings here."
          : "No listings from your followed sellers match this filter right now."}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <FeedCard item={item} index={index} />}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default FollowingFeedScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(6),
    paddingBottom: tokens.space(8),
  },

  h1: { fontSize: 28, fontWeight: "800", color: tokens.color.ink, letterSpacing: -0.5 },
  sub: { marginTop: 6, fontSize: 13, color: tokens.color.faint },

  sectionHead: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(6),
    marginBottom: tokens.space(3),
  },

  // Sellers-you-follow rows: a plain vertical stack, not a nested FlatList (only 5 sellers —
  // the FlatList virtualization requirement in the DNA applies to the scrollable feed below).
  sellerList: { gap: tokens.space(3) },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 15, fontWeight: "700", color: tokens.color.onInk },
  sellerBody: { flex: 1, gap: 2 },
  sellerName: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },
  sellerMeta: { fontSize: 12, color: tokens.color.faint },

  followBtn: {
    minWidth: 92,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
  },
  followBtnActive: {
    backgroundColor: tokens.color.accentBg,
  },
  followBtnText: { fontSize: 13, fontWeight: "700", color: tokens.color.accent },
  followBtnTextActive: { color: tokens.color.accent },
  pressed: { opacity: 0.75 },

  divider: {
    height: 1,
    backgroundColor: tokens.color.border,
    marginTop: tokens.space(6),
  },

  // Filter tabs: selected state conveyed by fill + border + weight, not color alone.
  tabRow: { flexDirection: "row", gap: tokens.space(2) },
  tabPill: {
    minHeight: 36,
    paddingHorizontal: tokens.space(3),
    borderRadius: 18,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPillSelected: {
    backgroundColor: tokens.color.ink,
    borderColor: tokens.color.ink,
  },
  tabPillText: { fontSize: 12, fontWeight: "600", color: tokens.color.ink2 },
  tabPillTextSelected: { fontWeight: "700", color: tokens.color.onInk },

  card: {
    flexDirection: "row",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginTop: tokens.space(3),
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbBadge: {
    maxWidth: 76,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.scrimLight,
  },
  thumbLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: tokens.color.ink,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    textAlign: "center",
  },
  cardBody: { flex: 1, gap: 3 },
  cardSeller: { fontSize: 11, fontWeight: "600", color: tokens.color.faint },
  cardTitle: { fontSize: 14, fontWeight: "700", color: tokens.color.ink, lineHeight: 19 },

  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priceRow: { flexDirection: "row", alignItems: "baseline" },
  wonSign: { fontSize: 13, fontWeight: "700", color: tokens.color.ink, marginRight: 3 },
  priceDigits: {
    fontSize: 15,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },

  tagPill: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: 3,
    borderRadius: tokens.radius.sm,
  },
  tagPillNew: { backgroundColor: tokens.color.accent },
  tagPillEnding: {
    backgroundColor: tokens.color.warningBg,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
  },
  tagPillText: { fontSize: 11, fontWeight: "700" },
  tagPillTextNew: { color: tokens.color.onAccent },
  tagPillTextEnding: { color: tokens.color.warning },

  postedLabel: { fontSize: 11, color: tokens.color.faint, marginTop: 2 },

  emptyWrap: {
    marginTop: tokens.space(6),
    paddingVertical: tokens.space(8),
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: tokens.color.faint,
    textAlign: "center",
    maxWidth: 280,
  },
});
