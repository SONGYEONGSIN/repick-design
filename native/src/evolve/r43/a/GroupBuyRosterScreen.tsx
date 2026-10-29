// native/src/evolve/r43/a/GroupBuyRosterScreen.tsx — auto-native-r43 candidate a.
//
// Group Buy / Split Purchase Roster: several buyers pool money toward one
// listed item. A sticky header (item thumbnail/name/target price + a big
// running-total-vs-target readout and progress bar) sits above a scrolling
// FlatList of every contributor. "You" is the only contributor whose pledge
// is live state here — a +/- stepper on that one row — everyone else's
// pledge is a fixed, already-made amount.
//
// Band mechanic (new shape, assigned this round): a numeric-sum-threshold
// derived gate. This generalizes the existing "derived boolean gates a band"
// family — a selected-count>0 contextual bar (r16/b), a dirty-vs-saved diff
// (r23/a), a nullable-selection-id (r42/c) — to a SUM comparison:
//
//   const poolReady = totalPooled >= ITEM.targetPrice;
//
// While `poolReady` is false the bottom band is a plain, non-Pressable View:
// it states in a sentence how much more is needed and that nothing here is
// tappable yet (per GENERATION.md §3, an inert band must say why, not just
// sit there disabled). The instant the pool reaches or passes the target,
// that same slot becomes a real enabled "Lock In Purchase" Pressable. If the
// pool later drops back under target (the stepper can move either way) the
// band reverts to inert. Once locked in, the band becomes a third, terminal,
// non-interactive state and the "You" stepper disables.
//
// Accessibility: the band's outer View always carries
// accessibilityLiveRegion="polite" — exactly one live region on this screen.
// A separate transient announcement line inside it (pattern: "just
// happened", must be cleared — see announce()/ANNOUNCE_VISIBLE_MS below)
// gets accessibilityRole="alert" and is only ever mounted (not just
// role-toggled) while there is something to say, so nothing is announced on
// initial mount. The big total/target readout in the header is the OTHER
// pattern — a value re-derived from state on every render — so it is plain
// text with no live region and needs no manual clearing.
//
// Style-key names for this band are fresh (`poolBand*`), not the
// `bandBlocked`/`bandReady`/`bandDone` family already used verbatim by six
// other screens in this catalog (see candidates/a.md "Brief gaps" for why).

import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import ContributorRow from "./ContributorRow";
import {
  FIXED_OTHERS_TOTAL,
  ITEM,
  OTHER_CONTRIBUTORS,
  YOU_ID,
  YOU_INITIAL,
  YOU_MAX,
  YOU_MIN,
  YOU_NAME,
  YOU_STEP,
  formatKRW,
  type FixedContributor,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const ANNOUNCE_VISIBLE_MS = 4000;

export function GroupBuyRosterScreen() {
  const [youAmount, setYouAmount] = useState(YOU_INITIAL);
  const [lockedIn, setLockedIn] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const announceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    return () => {
      if (announceTimer.current) clearTimeout(announceTimer.current);
    };
  }, []);

  function announce(message: string) {
    if (announceTimer.current) clearTimeout(announceTimer.current);
    setLiveMessage(message);
    announceTimer.current = setTimeout(() => {
      setLiveMessage("");
      announceTimer.current = null;
    }, ANNOUNCE_VISIBLE_MS);
  }

  const totalPooled = FIXED_OTHERS_TOTAL + youAmount;
  const remaining = Math.max(0, ITEM.targetPrice - totalPooled);
  const overBy = Math.max(0, totalPooled - ITEM.targetPrice);
  const poolReady = totalPooled >= ITEM.targetPrice;
  const fillPct = Math.round(
    Math.min(100, (totalPooled / ITEM.targetPrice) * 100),
  );
  const pledgedCount =
    (youAmount > 0 ? 1 : 0) +
    OTHER_CONTRIBUTORS.filter((c) => c.amount > 0).length;
  const totalCount = OTHER_CONTRIBUTORS.length + 1;

  // Announce the gate FLIPPING, not its steady state — this effect only
  // fires on a change to `poolReady` after the first render, so nothing is
  // announced on mount even when the pool already happens to start ready.
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (lockedIn) return;
    if (poolReady) {
      announce(
        `Pool reached — ${formatKRW(totalPooled)} of ${formatKRW(
          ITEM.targetPrice,
        )} pooled. Lock In Purchase is now available.`,
      );
    } else {
      announce(
        "Pool dropped back below target. Lock In Purchase is unavailable again.",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolReady]);

  function adjustYouAmount(delta: number) {
    if (lockedIn) return;
    setYouAmount((prev) => Math.max(YOU_MIN, Math.min(YOU_MAX, prev + delta)));
  }

  function lockInPurchase() {
    if (!poolReady || lockedIn) return;
    setLockedIn(true);
    announce(
      `Purchase locked in at ${formatKRW(
        totalPooled,
      )} pooled. The organizer will collect final payment from each contributor next.`,
    );
  }

  const youEntry: FixedContributor = {
    id: YOU_ID,
    name: YOU_NAME,
    initial: "Y",
    amount: youAmount,
    statusLabel: lockedIn
      ? "Pledge locked in"
      : youAmount > 0
        ? "Your pledge"
        : "Add your pledge below",
  };
  const rosterData: FixedContributor[] = [youEntry, ...OTHER_CONTRIBUTORS];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.kicker}>REPICK GROUP BUY</Text>
        <Text style={styles.title} accessibilityRole="header">
          Group Buy Roster
        </Text>

        <View style={styles.itemRow}>
          <View style={styles.itemThumb} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{ITEM.title}</Text>
            <Text style={styles.itemSubtitle}>{ITEM.subtitle}</Text>
          </View>
        </View>

        <View style={styles.progressBlock}>
          <Text style={[styles.progressReadout, styles.tabularNums]}>
            {formatKRW(totalPooled)}
            <Text style={styles.progressOf}> of </Text>
            {formatKRW(ITEM.targetPrice)}
            <Text style={styles.progressOf}> pooled</Text>
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${fillPct}%` },
                poolReady && styles.progressFillReady,
              ]}
            />
          </View>
          <Text style={styles.progressMeta}>
            {`${
              poolReady
                ? overBy > 0
                  ? `Target met, ${formatKRW(overBy)} over`
                  : "Target met exactly"
                : `${formatKRW(remaining)} still needed`
            }  ·  ${pledgedCount} of ${totalCount} contributors have pledged`}
          </Text>
        </View>
      </View>

      <FlatList
        data={rosterData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isYou = item.id === YOU_ID;
          return (
            <ContributorRow
              name={item.name}
              initial={item.initial}
              amount={item.amount}
              statusLabel={item.statusLabel}
              statusTone={item.amount > 0 ? "pledged" : "waiting"}
              isYou={isYou}
              disabled={isYou ? lockedIn : undefined}
              canIncrease={isYou ? youAmount < YOU_MAX : undefined}
              canDecrease={isYou ? youAmount > YOU_MIN : undefined}
              onIncrease={isYou ? () => adjustYouAmount(YOU_STEP) : undefined}
              onDecrease={isYou ? () => adjustYouAmount(-YOU_STEP) : undefined}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      <View style={styles.poolBandWrap} accessibilityLiveRegion="polite">
        {liveMessage ? (
          <Text style={styles.poolBandAnnounce} accessibilityRole="alert">
            {liveMessage}
          </Text>
        ) : null}

        {lockedIn ? (
          <View style={styles.poolBandLocked}>
            <Text style={styles.poolBandLockedTitle}>
              Purchase locked in
            </Text>
            <Text style={styles.poolBandLockedHint}>
              {`Locked at ${formatKRW(totalPooled)} pooled · organizer collects final payment next`}
            </Text>
          </View>
        ) : poolReady ? (
          <Pressable
            onPress={lockInPurchase}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Lock In Purchase"
            accessibilityHint="Locks in the group purchase at the current pooled amount."
            style={({ pressed }) => [
              styles.poolBandGo,
              pressed && styles.poolBandPressed,
            ]}
          >
            <Text style={styles.poolBandGoTitle}>Lock In Purchase</Text>
            <Text style={styles.poolBandGoHint}>
              {`Pool fully funded${overBy > 0 ? `, ${formatKRW(overBy)} over target` : ""} — tap to lock it in`}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.poolBandInert}>
            <Text style={styles.poolBandInertTitle}>
              {formatKRW(remaining)} more needed to unlock Lock In Purchase
            </Text>
            <Text style={styles.poolBandInertHint}>
              Raise your pledge below, or wait for more contributors to join.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export default GroupBuyRosterScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: tokens.space(2),
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: tokens.color.faint,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: tokens.color.ink,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    marginTop: tokens.space(1),
  },
  itemThumb: {
    width: 52,
    height: 52,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.swatch1,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  itemSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },
  progressBlock: {
    marginTop: tokens.space(2),
    gap: tokens.space(1),
  },
  progressReadout: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  progressOf: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.faint,
  },
  progressTrack: {
    marginTop: tokens.space(1),
    height: 8,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.border,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  progressFillReady: {
    backgroundColor: tokens.color.success,
  },
  progressMeta: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: tokens.space(6),
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },

  poolBandWrap: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
    gap: tokens.space(2),
  },
  poolBandAnnounce: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  poolBandPressed: {
    opacity: 0.85,
  },
  poolBandInert: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  poolBandInertTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  poolBandInertHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },
  poolBandGo: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  poolBandGoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  poolBandGoHint: {
    fontSize: 12,
    color: tokens.color.onAccent,
  },
  poolBandLocked: {
    minHeight: 56,
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    borderColor: tokens.color.success,
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    gap: 2,
  },
  poolBandLockedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.success,
  },
  poolBandLockedHint: {
    fontSize: 12,
    color: tokens.color.muted,
  },
});
