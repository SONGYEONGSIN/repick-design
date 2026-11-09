// native/src/evolve/r53/a/BoothRegistrationGateScreen.tsx
//
// Pop-Up Booth Registration gate: a seller readying a table reservation at a
// local pop-up market can only confirm once three independent, named
// conditions are all cleared — identity verification, booth fee payment, and
// a minimum-size tagged inventory manifest. The bottom band is absent-of-
// pretense: while blocked it names the single active cause in a sentence and
// a tap scrolls + moves accessibility focus to that exact unresolved control
// (a different target per cause). Once every condition clears, the band
// itself becomes the real "Confirm" action — never a disabled dead button.
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  EVENT,
  INITIAL_MANIFEST,
  MIN_MANIFEST_ITEMS,
  ROW_HEIGHT,
  formatUsd,
  type ManifestItem,
} from "./data";

type GateCause = "identity" | "payment" | "manifest" | null;

const HEADING_TEXT = "Pop-Up Booth Registration";

function focusNode(ref: { current: View | null }) {
  const tag = findNodeHandle(ref.current);
  if (tag != null) {
    AccessibilityInfo.setAccessibilityFocus(tag);
  }
}

export default function BoothRegistrationGateScreen() {
  const [identityVerified, setIdentityVerified] = useState(false);
  const [feePaid, setFeePaid] = useState(false);
  const [items, setItems] = useState<ManifestItem[]>(INITIAL_MANIFEST);
  const [confirmed, setConfirmed] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const verifyButtonRef = useRef<View>(null);
  const payButtonRef = useRef<View>(null);
  const itemRowRefs = useRef<Record<string, View | null>>({});

  // Measured section offsets inside the ScrollView content, captured once on
  // layout. Mutated via ref (not state) so measuring never triggers a
  // re-render loop.
  const sectionOffsets = useRef({ identity: 0, payment: 0, manifestTop: 0 });

  const taggedCount = items.filter((i) => i.tagged).length;
  const manifestMet = taggedCount >= MIN_MANIFEST_ITEMS;

  // Recomputed fresh every render from current state — never a stored copy —
  // so the gate instantly reflects whichever upstream condition last changed.
  const gateCause: GateCause = !identityVerified
    ? "identity"
    : !feePaid
    ? "payment"
    : !manifestMet
    ? "manifest"
    : null;

  const bandMessage = useMemo(() => {
    switch (gateCause) {
      case "identity":
        return "Booth reservation is blocked: your seller identity isn't verified for this event yet.";
      case "payment":
        return `Booth reservation is blocked: the ${formatUsd(
          EVENT.feeCents
        )} booth fee hasn't been paid.`;
      case "manifest":
        return `Booth reservation is blocked: only ${taggedCount} of ${MIN_MANIFEST_ITEMS} required items are tagged ready.`;
      default:
        return null;
    }
  }, [gateCause, taggedCount]);

  function toggleItem(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, tagged: !it.tagged } : it))
    );
  }

  function handleReviewPress() {
    if (gateCause === "identity") {
      scrollRef.current?.scrollTo({
        y: sectionOffsets.current.identity,
        animated: true,
      });
      setTimeout(() => focusNode(verifyButtonRef), 350);
    } else if (gateCause === "payment") {
      scrollRef.current?.scrollTo({
        y: sectionOffsets.current.payment,
        animated: true,
      });
      setTimeout(() => focusNode(payButtonRef), 350);
    } else if (gateCause === "manifest") {
      const idx = items.findIndex((it) => !it.tagged);
      if (idx >= 0) {
        const target =
          sectionOffsets.current.manifestTop + idx * ROW_HEIGHT - ROW_HEIGHT;
        scrollRef.current?.scrollTo({ y: Math.max(target, 0), animated: true });
        setTimeout(() => focusNode({ current: itemRowRefs.current[items[idx].id] }), 350);
      }
    }
  }

  const reviewLabel =
    gateCause === "identity"
      ? "Go to identity verification"
      : gateCause === "payment"
      ? "Go to booth fee payment"
      : gateCause === "manifest"
      ? "Go to next item that needs tagging"
      : "Review";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text accessibilityRole="header" style={styles.heading}>
          {HEADING_TEXT}
        </Text>

        {/* Core proof: always visible, never gated behind the steps below. */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryEvent}>{EVENT.name}</Text>
          <Text style={styles.summaryLine}>{EVENT.dateLabel}</Text>
          <Text style={styles.summaryLine}>{EVENT.boothSize}</Text>
          <Text style={styles.summaryFee}>
            Booth fee: {formatUsd(EVENT.feeCents)}
          </Text>
        </View>

        <View
          style={styles.section}
          onLayout={(e) => {
            sectionOffsets.current.identity = e.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.sectionTitle}>Seller Identity Verification</Text>
          {identityVerified ? (
            <Text style={styles.okLine}>Identity verified for this event.</Text>
          ) : (
            <>
              <Text style={styles.sectionBody}>
                This event requires a fresh identity check before you can hold
                a table.
              </Text>
              <Pressable
                ref={verifyButtonRef}
                onPress={() => setIdentityVerified(true)}
                accessibilityRole="button"
                accessibilityLabel="Verify identity"
                accessibilityHint="Marks your identity as verified for this event."
                hitSlop={8}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.primaryButtonPressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>Verify Identity</Text>
              </Pressable>
            </>
          )}
        </View>

        <View
          style={styles.section}
          onLayout={(e) => {
            sectionOffsets.current.payment = e.nativeEvent.layout.y;
          }}
        >
          <Text style={styles.sectionTitle}>Booth Fee Payment</Text>
          {feePaid ? (
            <Text style={styles.okLine}>
              {formatUsd(EVENT.feeCents)} fee paid.
            </Text>
          ) : (
            <>
              <Text style={styles.sectionBody}>
                Your table is only held once the fee clears.
              </Text>
              <Pressable
                ref={payButtonRef}
                onPress={() => setFeePaid(true)}
                accessibilityRole="button"
                accessibilityLabel={`Pay booth fee, ${formatUsd(EVENT.feeCents)}`}
                accessibilityHint="Marks the booth fee as paid."
                hitSlop={8}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.primaryButtonPressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  Pay Booth Fee - {formatUsd(EVENT.feeCents)}
                </Text>
              </Pressable>
            </>
          )}
        </View>

        <View
          style={styles.section}
          onLayout={(e) => {
            sectionOffsets.current.manifestTop =
              e.nativeEvent.layout.y + styles.manifestHeaderSpace.height;
          }}
        >
          <Text style={styles.sectionTitle}>
            Inventory Manifest ({taggedCount}/{MIN_MANIFEST_ITEMS} tagged ready)
          </Text>
          <Text style={styles.sectionBody}>
            Tag at least {MIN_MANIFEST_ITEMS} items as ready before this table
            can be confirmed.
          </Text>
          <View style={styles.manifestHeaderSpace} />
          <FlatList
            data={items}
            keyExtractor={(it) => it.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Pressable
                ref={(node) => {
                  itemRowRefs.current[item.id] = node;
                }}
                onPress={() => toggleItem(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`${item.name}, ${formatUsd(item.priceCents)}, ${
                  item.tagged ? "ready" : "not ready"
                }`}
                accessibilityHint={
                  item.tagged
                    ? "Marks this item as not ready."
                    : "Marks this item as ready for the booth."
                }
                style={({ pressed }) => [
                  styles.itemRow,
                  pressed && styles.itemRowPressed,
                ]}
              >
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatUsd(item.priceCents)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.itemBadge,
                    item.tagged ? styles.itemBadgeReady : styles.itemBadgeIdle,
                  ]}
                >
                  <Text
                    style={[
                      styles.itemBadgeText,
                      item.tagged
                        ? styles.itemBadgeTextReady
                        : styles.itemBadgeTextIdle,
                    ]}
                  >
                    {item.tagged ? "Ready" : "Mark Ready"}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.band}>
        {gateCause !== null ? (
          <View
            style={styles.bandBlockedRow}
            accessibilityLiveRegion="polite"
          >
            <Text
              accessibilityRole="alert"
              style={styles.bandBlockedText}
            >
              {bandMessage}
            </Text>
            <Pressable
              onPress={handleReviewPress}
              accessibilityRole="button"
              accessibilityLabel={reviewLabel}
              accessibilityHint="Scrolls to the step that needs attention and moves focus there."
              hitSlop={8}
              style={({ pressed }) => [
                styles.reviewButton,
                pressed && styles.reviewButtonPressed,
              ]}
            >
              <Text style={styles.reviewButtonText}>Review</Text>
            </Pressable>
          </View>
        ) : confirmed ? (
          <View accessibilityLiveRegion="polite" style={styles.bandConfirmedRow}>
            <Text accessibilityRole="alert" style={styles.bandConfirmedText}>
              Booth reservation confirmed for {EVENT.dateLabel}.
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={() => setConfirmed(true)}
            accessibilityRole="button"
            accessibilityLabel="Confirm booth reservation"
            accessibilityHint="Reserves your table for this event."
            style={({ pressed }) => [
              styles.confirmButton,
              pressed && styles.confirmButtonPressed,
            ]}
          >
            <Text style={styles.confirmButtonText}>Confirm Booth Reservation</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  summaryCard: {
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(5),
  },
  summaryEvent: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  summaryLine: {
    fontSize: 14,
    color: tokens.color.muted,
    marginBottom: tokens.space(1) / 2,
  },
  summaryFee: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.accent,
    marginTop: tokens.space(1),
    fontVariant: ["tabular-nums"],
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(4),
    marginBottom: tokens.space(4),
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  sectionBody: {
    fontSize: 13,
    color: tokens.color.muted,
    marginBottom: tokens.space(3),
  },
  okLine: {
    fontSize: 14,
    color: tokens.color.success,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    minHeight: 44,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "600",
  },
  manifestHeaderSpace: {
    height: tokens.space(1),
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: ROW_HEIGHT,
    paddingHorizontal: tokens.space(3),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    marginBottom: tokens.space(2),
    backgroundColor: tokens.color.bg,
  },
  itemRowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  itemTextCol: {
    flexShrink: 1,
    paddingRight: tokens.space(2),
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  itemPrice: {
    fontSize: 13,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  itemBadge: {
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(1),
    paddingHorizontal: tokens.space(2),
    minWidth: 76,
    alignItems: "center",
  },
  itemBadgeReady: {
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
  },
  itemBadgeIdle: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  itemBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  itemBadgeTextReady: {
    color: tokens.color.success,
  },
  itemBadgeTextIdle: {
    color: tokens.color.muted,
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    padding: tokens.space(4),
  },
  bandBlockedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bandBlockedText: {
    flex: 1,
    fontSize: 13,
    color: tokens.color.ink2,
    paddingRight: tokens.space(3),
  },
  reviewButton: {
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
    justifyContent: "center",
  },
  reviewButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  reviewButtonText: {
    color: tokens.color.accent,
    fontSize: 14,
    fontWeight: "700",
  },
  bandConfirmedRow: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bandConfirmedText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.success,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonPressed: {
    opacity: 0.85,
  },
  confirmButtonText: {
    color: tokens.color.onAccent,
    fontSize: 16,
    fontWeight: "700",
  },
});
