// native/src/evolve/r8/a/SellerStorefrontScreen.tsx — auto-native-r8 candidate a.
//
// Seller Storefront: a buyer's read-only view of another user's public seller profile — a
// profile-header band (initials avatar, display name, a trust-signal stat row), then a
// segmented switch between "Listings" (2-column grid) and "Reviews" (single-column list).
// Macro shape (header band + tab switch + switched body) is distinct from every existing
// screen: it is not a checklist/accordion (verification), not a heterogeneous form + timeline
// (disputes), not a swap-per-step wizard (listing), and not a plain grid or plain settings list
// on its own — the profile-header framing plus the two-body-shapes-behind-one-switch is the
// point. There is no terminal/blocking action anywhere on this screen (browsing another
// person's storefront has no "submit"), so per GENERATION.md §3 there is deliberately NO fixed
// bottom band — an inert one would be a demerit, and forcing the verification/disputes
// state-machine band pattern here would not be genuine.
import { useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { tokens } from "../../../tokens";
import { LISTINGS, REVIEWS, SELLER, type Listing, type Review } from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const STAR_FULL = "★";
const STAR_EMPTY = "☆";

type Tab = "listings" | "reviews";

function Stars({ rating }: { rating: number }) {
  const glyphs = [1, 2, 3, 4, 5].map((n) => (n <= rating ? STAR_FULL : STAR_EMPTY));
  return (
    <Text style={styles.stars} accessibilityElementsHidden importantForAccessibility="no">
      {glyphs.join("")}
    </Text>
  );
}

function ThumbPlaceholder() {
  // Vector-drawn stand-in for a listing photo — no image asset involved.
  return (
    <View style={styles.thumb}>
      <View style={styles.thumbMountain} />
      <View style={styles.thumbSun} />
    </View>
  );
}

function ListingCard({ item }: { item: Listing }) {
  return (
    <View
      style={styles.listingCard}
      accessibilityLabel={`${item.title}, ${item.priceLabel}, condition ${item.condition}, ${item.statusLabel}`}
    >
      <ThumbPlaceholder />
      <Text style={styles.listingTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.listingPrice}>{item.priceLabel}</Text>
      <View style={styles.listingMetaRow}>
        <View style={styles.conditionPill}>
          <Text style={styles.conditionPillText}>{item.condition}</Text>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{item.statusLabel}</Text>
        </View>
      </View>
    </View>
  );
}

function ReviewCard({ item }: { item: Review }) {
  return (
    <View
      style={styles.reviewCard}
      accessibilityLabel={`${item.rating} out of 5 stars from ${item.reviewerName}, ${item.dateLabel}: ${item.text}`}
    >
      <View style={styles.reviewHead}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.reviewAvatarText}>{item.reviewerInitials}</Text>
        </View>
        <View style={styles.reviewHeadBody}>
          <Text style={styles.reviewerName}>{item.reviewerName}</Text>
          <View style={styles.reviewHeadRow}>
            <Stars rating={item.rating} />
            <Text style={styles.reviewDate}>{item.dateLabel}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
    </View>
  );
}

export function SellerStorefrontScreen() {
  const [tab, setTab] = useState<Tab>("listings");

  const header = (
    <View style={styles.headerWrap}>
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{SELLER.initials}</Text>
        </View>
        <View style={styles.profileBody}>
          <Text style={styles.sellerName} accessibilityRole="header">
            {SELLER.displayName}
          </Text>
          <Text style={styles.sellerHandle}>{SELLER.handle}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCell}>
          <Text style={styles.statValue}>{SELLER.ratingValue}</Text>
          <Text style={styles.statLabel}>
            Rating ({SELLER.ratingCount})
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}>
          <Text style={styles.statValue}>{SELLER.completedSales}</Text>
          <Text style={styles.statLabel}>Completed sales</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}>
          <Text style={styles.statValueSm}>{SELLER.memberSinceLabel}</Text>
          <Text style={styles.statLabel}>Membership</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}>
          <Text style={styles.statValueSm}>{SELLER.avgResponseLabel}</Text>
          <Text style={styles.statLabel}>Avg. response</Text>
        </View>
      </View>

      <View
        style={styles.tabBar}
        accessibilityRole="tablist"
        accessibilityLabel="Storefront sections"
      >
        <Pressable
          onPress={() => setTab("listings")}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === "listings" }}
          accessibilityLabel={`Listings, ${LISTINGS.length}`}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.tabBtn,
            tab === "listings" && styles.tabBtnOn,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.tabBtnText, tab === "listings" && styles.tabBtnTextOn]}>
            Listings ({LISTINGS.length})
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("reviews")}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === "reviews" }}
          accessibilityLabel={`Reviews, ${REVIEWS.length}`}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.tabBtn,
            tab === "reviews" && styles.tabBtnOn,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.tabBtnText, tab === "reviews" && styles.tabBtnTextOn]}>
            Reviews ({REVIEWS.length})
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionCaption}>
        {tab === "listings"
          ? `${LISTINGS.length} items currently for sale`
          : `${SELLER.ratingValue} average from ${SELLER.ratingCount} completed sales`}
      </Text>
    </View>
  );

  if (tab === "reviews") {
    return (
      <SafeAreaView style={styles.screen}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContentReviews}
          data={REVIEWS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReviewCard item={item} />}
          ItemSeparatorComponent={() => <View style={styles.reviewGap} />}
          ListHeaderComponent={header}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        key="listings-grid"
        style={styles.list}
        contentContainerStyle={styles.listContentGrid}
        data={LISTINGS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => <ListingCard item={item} />}
        ListHeaderComponent={header}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default SellerStorefrontScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.color.bg },
  list: { flex: 1 },
  listContentGrid: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },
  listContentReviews: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(6),
  },
  gridRow: { gap: tokens.space(3) },
  reviewGap: { height: tokens.space(3) },

  headerWrap: { paddingTop: tokens.space(4), paddingBottom: tokens.space(4) },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(4),
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  profileBody: { flex: 1, gap: 2 },
  sellerName: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: tokens.color.ink,
  },
  sellerHandle: { fontSize: 13, color: tokens.color.faint },

  statsRow: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(2),
  },
  statCell: { flex: 1, alignItems: "center", gap: 3, paddingHorizontal: 2 },
  statDivider: { width: 1, alignSelf: "stretch", backgroundColor: tokens.color.border },
  statValue: { fontSize: 17, fontWeight: "700", color: tokens.color.ink },
  statValueSm: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.ink,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 11,
    color: tokens.color.faint,
    textAlign: "center",
  },

  tabBar: {
    marginTop: tokens.space(5),
    flexDirection: "row",
    gap: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    paddingBottom: tokens.space(1),
  },
  tabBtn: {
    minHeight: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(3),
  },
  tabBtnOn: { backgroundColor: tokens.color.accent },
  tabBtnText: { fontSize: 13, fontWeight: "700", color: tokens.color.muted },
  tabBtnTextOn: { color: tokens.color.onAccent },
  pressed: { opacity: 0.8 },

  sectionCaption: {
    marginTop: tokens.space(3),
    fontSize: 12,
    color: tokens.color.faint,
  },

  // Listings grid
  listingCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    gap: 4,
  },
  thumb: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  thumbMountain: {
    position: "absolute",
    bottom: -12,
    left: 10,
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: tokens.color.border,
    transform: [{ rotate: "45deg" }],
  },
  thumbSun: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: tokens.color.border,
  },
  listingTitle: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    color: tokens.color.ink2,
    minHeight: 36,
  },
  listingPrice: { fontSize: 15, fontWeight: "700", color: tokens.color.ink },
  listingMetaRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  conditionPill: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: 2,
  },
  conditionPillText: { fontSize: 10, fontWeight: "700", color: tokens.color.muted },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.color.accent,
  },
  statusText: { fontSize: 10, fontWeight: "700", color: tokens.color.accent },

  // Reviews list
  reviewCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  reviewHead: { flexDirection: "row", alignItems: "center", gap: tokens.space(3) },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { fontSize: 12, fontWeight: "700", color: tokens.color.ink2 },
  reviewHeadBody: { flex: 1, gap: 2 },
  reviewerName: { fontSize: 14, fontWeight: "700", color: tokens.color.ink },
  reviewHeadRow: { flexDirection: "row", alignItems: "center", gap: tokens.space(2) },
  stars: { fontSize: 13, color: tokens.color.accent, letterSpacing: 1 },
  reviewDate: { fontSize: 11, color: tokens.color.faint },
  reviewText: { fontSize: 13, lineHeight: 19, color: tokens.color.ink2 },
});
