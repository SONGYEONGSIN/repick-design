// native/src/evolve/r47/c/PointsRedemptionScreen.tsx
//
// Concept: "Points Redemption Catalog" — the user spends loyalty points
// earned from selling/buying activity on a catalog of rewards (shipping-fee
// credit, listing-boost credit, store-credit vouchers). This is not the
// Referral & Rewards screen (that invites friends) and not the Wallet
// screen (that's real-money transaction history) — nothing here involves
// money or invitations, only points and rewards.
//
// Ambient-bar choice: the points balance is rendered in its own View ABOVE
// the FlatList, outside its scrollable content, so it stays visible no
// matter how far the catalog is scrolled — unlike the screen heading and
// subtitle, which live inside ListHeaderComponent and scroll away. That bar
// is not decoration: redeeming a reward deducts its cost from this same
// balance state, so the number on screen is a live, hand-verifiable
// before/after of every redemption, not a static label.
//
// Row-confirm choice: redeeming is an irreversible spend of points, so each
// row applies this codebase's destructive-confirm idiom itself — tapping
// "Redeem" flips that row into a Cancel / Confirm pair in place, inside a
// live-region-announced container — rather than opening a native Alert.
// Exactly one row may be mid-interaction at a time: `activeRewardId` and
// `rowPhase` are a single shared pair (not a per-row boolean), so only one
// row's live region is ever mounted, which is also the only place the
// points-balance change gets announced (the "done" sentence states the new
// balance in the same breath as the redemption, instead of opening a
// second, simultaneous live region just for the balance).
//
// A reward costing more than the current balance renders a disabled
// control with no Pressable handler at all, so it can never be tapped into
// the confirm phase — see RewardRow for that branch.

import { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import RewardRow, { type RewardRowPhase } from "./RewardRow";
import { formatPoints, REWARDS, STARTING_BALANCE } from "./data";

// How long the inline "Redeemed…" acknowledgement stays visible in a row
// before the row returns to its normal Redeem control. Fixed and
// deterministic — not derived from any clock.
const REDEEM_ACK_MS = 1400;

export default function PointsRedemptionScreen() {
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [activeRewardId, setActiveRewardId] = useState<string | null>(null);
  const [rowPhase, setRowPhase] = useState<RewardRowPhase | null>(null);
  const ackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAckTimer = () => {
    if (ackTimer.current !== null) {
      clearTimeout(ackTimer.current);
      ackTimer.current = null;
    }
  };

  useEffect(() => clearAckTimer, []);

  // Only one row may be non-idle (confirming OR showing its redeemed
  // acknowledgement) at a time, so exactly one accessibilityLiveRegion is
  // ever live on this screen. If a different row's acknowledgement is still
  // showing when a new "Redeem" is tapped, finalize that previous one right
  // away and hand the single active slot to the new row.
  const requestRedeem = (rewardId: string) => {
    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!reward || reward.costPoints > balance) return;
    if (
      activeRewardId !== null &&
      activeRewardId !== rewardId &&
      rowPhase === "done"
    ) {
      clearAckTimer();
    }
    setActiveRewardId(rewardId);
    setRowPhase("confirm");
  };

  const cancelRedeem = () => {
    setActiveRewardId(null);
    setRowPhase(null);
  };

  const confirmRedeem = (rewardId: string) => {
    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!reward) return;
    setBalance((prev) => Math.max(0, prev - reward.costPoints));
    setRowPhase("done");
    clearAckTimer();
    ackTimer.current = setTimeout(() => {
      setActiveRewardId(null);
      setRowPhase(null);
      ackTimer.current = null;
    }, REDEEM_ACK_MS);
  };

  const phaseFor = (rewardId: string): RewardRowPhase =>
    activeRewardId === rewardId && rowPhase ? rowPhase : "idle";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.balanceBar}>
        <Text style={styles.balanceLabel}>Your points balance</Text>
        <Text
          style={[styles.balanceValue, styles.tabularNums]}
          accessibilityLabel={`${formatPoints(balance)} points available to redeem`}
        >
          {`${formatPoints(balance)} pts`}
        </Text>
      </View>

      <FlatList
        data={REWARDS}
        keyExtractor={(item) => item.id}
        extraData={[balance, activeRewardId, rowPhase]}
        renderItem={({ item }) => (
          <RewardRow
            reward={item}
            phase={phaseFor(item.id)}
            balance={balance}
            onRequestRedeem={requestRedeem}
            onCancel={cancelRedeem}
            onConfirm={confirmRedeem}
          />
        )}
        ListHeaderComponent={
          <View style={styles.headerArea}>
            <Text accessibilityRole="header" style={styles.title}>
              Redeem Points
            </Text>
            <Text style={styles.subtitle}>
              Redeem points earned from selling and buying for shipping
              credit, listing boosts, or store credit vouchers. Each
              redemption spends your points and can't be undone.
            </Text>
            <Text accessibilityRole="header" style={styles.sectionLabel}>
              Available rewards
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  balanceBar: {
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(1),
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: tokens.space(8),
  },
  headerArea: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    gap: tokens.space(2),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
    marginBottom: tokens.space(2),
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: tokens.space(1),
  },
});
