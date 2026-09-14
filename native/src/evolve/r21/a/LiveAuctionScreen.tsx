// native/src/evolve/r21/a/LiveAuctionScreen.tsx
//
// Concept: "Live Auction Bid" — watch and participate in a single-item timed
// auction: a live countdown to close, the current highest bid, a ladder of
// recent bids, a bid-increment stepper, and an optional proxy "max auto-bid"
// ceiling that (per its own explanatory copy) auto-raises your bid up to a
// cap as others bid. This is a new mechanism for this catalog — an
// escalating value stack racing a clock — not a chat-style single
// counter-offer and not an item-for-item barter.
//
// Band-form choice: the bottom-pinned control here is NOT a blocked-workflow
// "why can't I proceed" state machine (explicitly avoided per brief — that
// pattern already belongs to verification/disputes/authentication/condition/
// pickup) and it is NOT a selection-count contextual bar (already
// bulk-relist's pattern). Placing a bid commits money, so per GENERATION.md
// §3 this instead uses the DESTRUCTIVE-ACTION CONFIRMATION form: tapping
// "Place Bid" turns the bar into a Cancel/Confirm two-button row with plain
// confirmation copy, rather than opening a native Alert. Every style key on
// this control is written fresh for this screen (bidBar*, ladder*, auction*,
// proxy*) — none of it reuses bandBlocked*/bandReady* naming from other
// screens, even though the underlying "confirm before commit" idea rhymes
// with the payout/withdraw screen elsewhere in the catalog.
//
// Live region: exactly one, on the "you're leading / you've been outbid"
// status sentence in the highest-bid card — GENERATION.md §4 names this
// exact case as the canonical example for this screen. The bid-bar confirm
// copy is plain visible text (not a second live region), since it appears
// directly under the finger that just triggered it and two simultaneous
// live regions would make it ambiguous which one is new.
//
// Differentiation from named prior screens: offer-thread is a chat-style
// single counter-offer with no clock and no multi-party ladder. Trade
// Proposal (r20/a) is an item-for-item barter with a fairness bar, no time
// pressure and no escalating numeric stack. This screen has neither items-
// for-items comparison nor a message thread — its whole surface is a clock,
// a leaderboard-style bid ladder, and a proxy-ceiling setting.

import { useEffect, useMemo, useState } from "react";
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
  AUTO_BID_CEILING_CAP_WON,
  AUTO_BID_CEILING_STEP_WON,
  AUTO_BID_DEFAULT_CEILING_WON,
  BID_INCREMENT_WON,
  INITIAL_BIDS,
  INITIAL_REMAINING_MS,
  ITEM_CONDITION,
  ITEM_SELLER_INITIALS,
  ITEM_SELLER_NAME,
  ITEM_THUMBNAIL_INITIALS,
  ITEM_TITLE,
  STARTING_BID_WON,
  STEPPER_CAP_ABOVE_MIN_WON,
  formatCountdown,
  formatTimeAgo,
  formatWon,
} from "./data";
import type { Bid } from "./data";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function BidRow({ bid, isLeading }: { bid: Bid; isLeading: boolean }) {
  return (
    <View
      style={[styles.ladderRow, isLeading && styles.ladderRowLeading]}
      accessibilityLabel={`${bid.bidderName}${bid.isYou ? " (you)" : ""}, ${formatWon(
        bid.amountWon,
      )}, ${formatTimeAgo(bid.minutesAgo)}${isLeading ? ", currently leading" : ""}`}
    >
      <View style={[styles.ladderAvatar, bid.isYou && styles.ladderAvatarYou]}>
        <Text style={styles.ladderAvatarText}>{bid.bidderInitials}</Text>
      </View>
      <View style={styles.ladderTextCol}>
        <View style={styles.ladderNameRow}>
          <Text style={styles.ladderName}>{bid.bidderName}</Text>
          {bid.isYou ? <Text style={styles.ladderYouTag}>You</Text> : null}
          {isLeading ? (
            <View style={styles.ladderLeadingChip}>
              <Text style={styles.ladderLeadingChipText}>▲ Leading</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.ladderTime}>{formatTimeAgo(bid.minutesAgo)}</Text>
      </View>
      <Text style={styles.ladderAmount}>{formatWon(bid.amountWon)}</Text>
    </View>
  );
}

export default function LiveAuctionScreen() {
  const [tickCount, setTickCount] = useState(0);
  const [bids, setBids] = useState<Bid[]>(INITIAL_BIDS);
  const currentHighBid = bids[bids.length - 1];
  const minNextBidWon = currentHighBid.amountWon + BID_INCREMENT_WON;
  const maxStepperBidWon = minNextBidWon + STEPPER_CAP_ABOVE_MIN_WON;

  const [selectedBidWon, setSelectedBidWon] = useState<number>(minNextBidWon);
  const [confirming, setConfirming] = useState(false);
  const [autoBidEnabled, setAutoBidEnabled] = useState(false);
  const [autoBidCeilingWon, setAutoBidCeilingWon] = useState<number>(
    AUTO_BID_DEFAULT_CEILING_WON,
  );

  const remainingMs = Math.max(0, INITIAL_REMAINING_MS - tickCount * 1000);
  const auctionClosed = remainingMs <= 0;

  useEffect(() => {
    if (auctionClosed) return;
    const id = setInterval(() => setTickCount((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [auctionClosed]);

  const youAreLeading = currentHighBid.isYou;

  const statusGlyph = youAreLeading ? "▲" : "▼";
  const statusText = youAreLeading
    ? `You're the highest bidder at ${formatWon(currentHighBid.amountWon)}.`
    : `You've been outbid — ${currentHighBid.bidderName} leads at ${formatWon(
        currentHighBid.amountWon,
      )}.`;

  const ladderData = useMemo(() => [...bids].reverse(), [bids]);

  const adjustSelectedBid = (delta: number) => {
    setSelectedBidWon((prev) => clamp(prev + delta, minNextBidWon, maxStepperBidWon));
  };

  const adjustAutoBidCeiling = (delta: number) => {
    setAutoBidCeilingWon((prev) =>
      clamp(prev + delta, minNextBidWon, AUTO_BID_CEILING_CAP_WON),
    );
  };

  const startConfirm = () => {
    if (auctionClosed || youAreLeading) return;
    setConfirming(true);
  };

  const cancelConfirm = () => setConfirming(false);

  const confirmBid = () => {
    const placedAmount = selectedBidWon;
    const newBid: Bid = {
      id: `you-${bids.length + 1}`,
      bidderName: "You",
      bidderInitials: "ME",
      amountWon: placedAmount,
      minutesAgo: 0,
      isYou: true,
    };
    setBids((prev) => [...prev, newBid]);
    setSelectedBidWon(placedAmount + BID_INCREMENT_WON);
    if (autoBidEnabled && autoBidCeilingWon < placedAmount + BID_INCREMENT_WON) {
      setAutoBidCeilingWon(placedAmount + BID_INCREMENT_WON);
    }
    setConfirming(false);
  };

  const header = (
    <View>
      <Text accessibilityRole="header" style={styles.screenTitle}>
        Live Auction Bid
      </Text>

      <View style={styles.itemCard}>
        <View style={styles.itemThumb}>
          <Text style={styles.itemThumbText}>{ITEM_THUMBNAIL_INITIALS}</Text>
        </View>
        <View style={styles.itemTextCol}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {ITEM_TITLE}
          </Text>
          <Text style={styles.itemMeta}>{ITEM_CONDITION}</Text>
          <View style={styles.itemSellerRow}>
            <View style={styles.itemSellerAvatar}>
              <Text style={styles.itemSellerAvatarText}>{ITEM_SELLER_INITIALS}</Text>
            </View>
            <Text style={styles.itemSellerName}>{ITEM_SELLER_NAME}</Text>
          </View>
        </View>
      </View>

      <View style={styles.auctionCard}>
        <Text style={styles.auctionCloseLabel}>
          {auctionClosed ? "Auction closed" : "Closes in"}
        </Text>
        <Text style={styles.auctionCountdown}>{formatCountdown(remainingMs)}</Text>
        <Text style={styles.auctionStartingNote}>
          Started at {formatWon(STARTING_BID_WON)} · bidding in{" "}
          {formatWon(BID_INCREMENT_WON)} steps
        </Text>

        <View style={styles.auctionHighRow}>
          <View>
            <Text style={styles.auctionHighLabel}>Current highest bid</Text>
            <Text style={styles.auctionHighAmount}>
              {formatWon(currentHighBid.amountWon)}
            </Text>
          </View>
          <View
            style={[
              styles.auctionStatusPill,
              youAreLeading ? styles.auctionStatusPillLeading : styles.auctionStatusPillOutbid,
            ]}
          >
            <Text
              style={[
                styles.auctionStatusPillGlyph,
                youAreLeading
                  ? styles.auctionStatusPillGlyphLeading
                  : styles.auctionStatusPillGlyphOutbid,
              ]}
            >
              {statusGlyph}
            </Text>
          </View>
        </View>

        <View style={styles.auctionStatusZone} accessibilityLiveRegion="polite">
          <Text accessibilityRole="alert" style={styles.auctionStatusText}>
            {statusText}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Recent bids</Text>
    </View>
  );

  const footer = (
    <View>
      <View style={styles.proxyCard}>
        <View style={styles.proxyHeaderRow}>
          <View style={styles.proxyTextCol}>
            <Text style={styles.proxyTitle}>Proxy auto-bid</Text>
            <Text style={styles.proxySubtitle}>
              Auto-raise your bid to stay in the lead, up to a ceiling you set.
            </Text>
          </View>
          <Pressable
            onPress={() => setAutoBidEnabled((v) => !v)}
            hitSlop={8}
            accessibilityRole="switch"
            accessibilityState={{ checked: autoBidEnabled }}
            accessibilityLabel="Proxy auto-bid"
            style={({ pressed }) => [
              styles.proxyToggleTrack,
              autoBidEnabled && styles.proxyToggleTrackOn,
              pressed && styles.pressedDim,
            ]}
          >
            <View
              style={[styles.proxyToggleKnob, autoBidEnabled && styles.proxyToggleKnobOn]}
            />
          </Pressable>
        </View>

        {autoBidEnabled ? (
          <View style={styles.proxyCeilingBlock}>
            <Text style={styles.proxyCeilingLabel}>Your ceiling</Text>
            <View style={styles.proxyStepperRow}>
              <Pressable
                onPress={() => adjustAutoBidCeiling(-AUTO_BID_CEILING_STEP_WON)}
                hitSlop={10}
                disabled={autoBidCeilingWon <= minNextBidWon}
                accessibilityRole="button"
                accessibilityLabel={`Decrease ceiling by ${formatWon(
                  AUTO_BID_CEILING_STEP_WON,
                )}`}
                style={({ pressed }) => [
                  styles.proxyStepperButton,
                  autoBidCeilingWon <= minNextBidWon && styles.proxyStepperButtonDisabled,
                  pressed && styles.pressedDim,
                ]}
              >
                <Text style={styles.proxyStepperGlyph}>−</Text>
              </Pressable>
              <Text style={styles.proxyCeilingValue}>{formatWon(autoBidCeilingWon)}</Text>
              <Pressable
                onPress={() => adjustAutoBidCeiling(AUTO_BID_CEILING_STEP_WON)}
                hitSlop={10}
                disabled={autoBidCeilingWon >= AUTO_BID_CEILING_CAP_WON}
                accessibilityRole="button"
                accessibilityLabel={`Increase ceiling by ${formatWon(
                  AUTO_BID_CEILING_STEP_WON,
                )}`}
                style={({ pressed }) => [
                  styles.proxyStepperButton,
                  autoBidCeilingWon >= AUTO_BID_CEILING_CAP_WON &&
                    styles.proxyStepperButtonDisabled,
                  pressed && styles.pressedDim,
                ]}
              >
                <Text style={styles.proxyStepperGlyph}>+</Text>
              </Pressable>
            </View>
            <Text style={styles.proxyExplainer}>
              Armed. Repick bids the minimum needed to keep you ahead, one step at
              a time, and stops at {formatWon(autoBidCeilingWon)} — you're never
              charged more than that.
            </Text>
          </View>
        ) : (
          <Text style={styles.proxyExplainer}>
            Off — you'll only bid when you tap Place Bid below.
          </Text>
        )}
      </View>

      <Text style={styles.footerNote}>
        Placing a bid is a binding commitment to pay if you're the winner when
        the clock reaches zero.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={ladderData}
        keyExtractor={(bid) => bid.id}
        renderItem={({ item, index }) => (
          <BidRow bid={item} isLeading={index === 0} />
        )}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      <View style={styles.bidBar}>
        {confirming ? (
          <View style={styles.bidBarConfirmBlock}>
            <Text style={styles.bidBarConfirmCopy}>
              Confirm your bid of {formatWon(selectedBidWon)} on {ITEM_TITLE}. This
              is binding — you'll owe this amount if you win.
            </Text>
            <View style={styles.bidBarConfirmRow}>
              <Pressable
                onPress={cancelConfirm}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel="Cancel bid"
                style={({ pressed }) => [
                  styles.bidBarCancelButton,
                  pressed && styles.pressedDim,
                ]}
              >
                <Text style={styles.bidBarCancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmBid}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={`Confirm bid of ${formatWon(selectedBidWon)}`}
                style={({ pressed }) => [
                  styles.bidBarConfirmButton,
                  pressed && styles.pressedDim,
                ]}
              >
                <Text style={styles.bidBarConfirmButtonText}>Confirm Bid</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.bidBarStepperRow}>
              <Pressable
                onPress={() => adjustSelectedBid(-BID_INCREMENT_WON)}
                hitSlop={10}
                disabled={auctionClosed || selectedBidWon <= minNextBidWon}
                accessibilityRole="button"
                accessibilityLabel={`Decrease bid by ${formatWon(BID_INCREMENT_WON)}`}
                style={({ pressed }) => [
                  styles.bidBarStepperButton,
                  (auctionClosed || selectedBidWon <= minNextBidWon) &&
                    styles.bidBarStepperButtonDisabled,
                  pressed && styles.pressedDim,
                ]}
              >
                <Text style={styles.bidBarStepperGlyph}>−</Text>
              </Pressable>
              <View style={styles.bidBarValueCol}>
                <Text style={styles.bidBarValue}>{formatWon(selectedBidWon)}</Text>
                <Text style={styles.bidBarMinNote}>
                  Min next bid {formatWon(minNextBidWon)}
                </Text>
              </View>
              <Pressable
                onPress={() => adjustSelectedBid(BID_INCREMENT_WON)}
                hitSlop={10}
                disabled={auctionClosed || selectedBidWon >= maxStepperBidWon}
                accessibilityRole="button"
                accessibilityLabel={`Increase bid by ${formatWon(BID_INCREMENT_WON)}`}
                style={({ pressed }) => [
                  styles.bidBarStepperButton,
                  (auctionClosed || selectedBidWon >= maxStepperBidWon) &&
                    styles.bidBarStepperButtonDisabled,
                  pressed && styles.pressedDim,
                ]}
              >
                <Text style={styles.bidBarStepperGlyph}>+</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={startConfirm}
              disabled={auctionClosed || youAreLeading}
              accessibilityRole="button"
              accessibilityLabel={
                auctionClosed
                  ? "Auction closed"
                  : youAreLeading
                    ? "You are already the highest bidder"
                    : `Place bid of ${formatWon(selectedBidWon)}`
              }
              accessibilityState={{ disabled: auctionClosed || youAreLeading }}
              style={({ pressed }) => [
                styles.bidBarPlaceButton,
                (auctionClosed || youAreLeading) && styles.bidBarPlaceButtonDisabled,
                pressed && !(auctionClosed || youAreLeading) && styles.pressedDim,
              ]}
            >
              <Text
                style={[
                  styles.bidBarPlaceButtonText,
                  (auctionClosed || youAreLeading) &&
                    styles.bidBarPlaceButtonTextDisabled,
                ]}
              >
                {auctionClosed
                  ? "Auction Closed"
                  : youAreLeading
                    ? "You're Leading"
                    : "Place Bid"}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(3),
    marginBottom: tokens.space(3),
  },
  itemCard: {
    flexDirection: "row",
    gap: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
  },
  itemThumb: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.ink,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemThumbText: {
    color: tokens.color.onInk,
    fontSize: 16,
    fontWeight: "700",
  },
  itemTextCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemMeta: {
    fontSize: 12,
    color: tokens.color.muted,
    marginTop: 2,
  },
  itemSellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(1.5),
    marginTop: tokens.space(2),
  },
  itemSellerAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  itemSellerAvatarText: {
    fontSize: 9,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  itemSellerName: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  auctionCard: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    alignItems: "center",
  },
  auctionCloseLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  auctionCountdown: {
    fontSize: 36,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
    marginTop: tokens.space(1),
  },
  auctionStartingNote: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
    textAlign: "center",
  },
  auctionHighRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(3),
  },
  auctionHighLabel: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  auctionHighAmount: {
    fontSize: 24,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
    marginTop: 2,
  },
  auctionStatusPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  auctionStatusPillLeading: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  auctionStatusPillOutbid: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  auctionStatusPillGlyph: {
    fontSize: 16,
    fontWeight: "700",
  },
  auctionStatusPillGlyphLeading: {
    color: tokens.color.onAccent,
  },
  auctionStatusPillGlyphOutbid: {
    color: tokens.color.muted,
  },
  auctionStatusZone: {
    width: "100%",
    marginTop: tokens.space(3),
  },
  auctionStatusText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginTop: tokens.space(5),
    marginBottom: tokens.space(2),
  },
  ladderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2.5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(2.5),
    paddingHorizontal: tokens.space(2.5),
    minHeight: 44,
    marginBottom: tokens.space(2),
  },
  ladderRowLeading: {
    borderColor: tokens.color.accent,
  },
  ladderAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ladderAvatarYou: {
    backgroundColor: tokens.color.ink,
  },
  ladderAvatarText: {
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  ladderTextCol: {
    flex: 1,
  },
  ladderNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: tokens.space(1.5),
  },
  ladderName: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  ladderYouTag: {
    fontSize: 10,
    fontWeight: "700",
    color: tokens.color.accent,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(1),
    paddingVertical: 1,
  },
  ladderLeadingChip: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(1.5),
    paddingVertical: 1,
  },
  ladderLeadingChipText: {
    fontSize: 10,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  ladderTime: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: 2,
  },
  ladderAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  proxyCard: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3.5),
  },
  proxyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
  },
  proxyTextCol: {
    flex: 1,
  },
  proxyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  proxySubtitle: {
    fontSize: 12,
    color: tokens.color.muted,
    marginTop: 2,
    lineHeight: 16,
  },
  proxyToggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.color.border,
    padding: 2,
    justifyContent: "center",
  },
  proxyToggleTrackOn: {
    backgroundColor: tokens.color.accent,
  },
  proxyToggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.color.bg,
    alignSelf: "flex-start",
  },
  proxyToggleKnobOn: {
    alignSelf: "flex-end",
  },
  proxyCeilingBlock: {
    marginTop: tokens.space(3.5),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(3),
  },
  proxyCeilingLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.ink2,
    textAlign: "center",
  },
  proxyStepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.space(4),
    marginTop: tokens.space(2),
  },
  proxyStepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  proxyStepperButtonDisabled: {
    opacity: 0.4,
  },
  proxyStepperGlyph: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  proxyCeilingValue: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
    minWidth: 96,
    textAlign: "center",
  },
  proxyExplainer: {
    fontSize: 12,
    color: tokens.color.muted,
    marginTop: tokens.space(2.5),
    lineHeight: 17,
    textAlign: "center",
  },
  footerNote: {
    fontSize: 12,
    color: tokens.color.faint,
    textAlign: "center",
    marginTop: tokens.space(4),
    paddingHorizontal: tokens.space(2),
  },
  bidBar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  bidBarStepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.space(4),
    marginBottom: tokens.space(3),
  },
  bidBarStepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  bidBarStepperButtonDisabled: {
    opacity: 0.4,
  },
  bidBarStepperGlyph: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  bidBarValueCol: {
    alignItems: "center",
    minWidth: 140,
  },
  bidBarValue: {
    fontSize: 20,
    fontWeight: "800",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },
  bidBarMinNote: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: 2,
  },
  bidBarPlaceButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3.5),
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  bidBarPlaceButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  bidBarPlaceButtonText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  bidBarPlaceButtonTextDisabled: {
    color: tokens.color.faint,
  },
  bidBarConfirmBlock: {
    width: "100%",
  },
  bidBarConfirmCopy: {
    fontSize: 13,
    color: tokens.color.ink2,
    lineHeight: 18,
    marginBottom: tokens.space(3),
    textAlign: "center",
  },
  bidBarConfirmRow: {
    flexDirection: "row",
    gap: tokens.space(2.5),
  },
  bidBarCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3.5),
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bidBarCancelButtonText: {
    color: tokens.color.ink2,
    fontSize: 15,
    fontWeight: "700",
  },
  bidBarConfirmButton: {
    flex: 1,
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3.5),
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bidBarConfirmButtonText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "700",
  },
  pressedDim: {
    opacity: 0.7,
  },
});
