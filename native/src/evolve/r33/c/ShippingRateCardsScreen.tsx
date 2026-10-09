import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { INITIAL_RATE_CARDS, RateCard, isCardLive } from "./data";
import { RateCardRow } from "./RateCardRow";

const ANNOUNCEMENT_LIFETIME_MS = 5000;

export default function ShippingRateCardsScreen() {
  const [cards, setCards] = useState<RateCard[]>(INITIAL_RATE_CARDS);
  const [liveMessage, setLiveMessage] = useState("");
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived, not hand-tracked: recomputed from the same `cards` state the
  // row handlers below mutate, so it can never drift from reality.
  const liveCount = useMemo(() => cards.filter(isCardLive).length, [cards]);
  const totalCount = cards.length;

  const announce = useCallback((message: string) => {
    if (clearTimer.current) {
      clearTimeout(clearTimer.current);
    }
    setLiveMessage(message);
    clearTimer.current = setTimeout(() => {
      setLiveMessage("");
      clearTimer.current = null;
    }, ANNOUNCEMENT_LIFETIME_MS);
  }, []);

  const handleToggleStatus = useCallback((id: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? { ...card, status: card.status === "active" ? "inactive" : "active" }
          : card
      )
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.heading} accessibilityRole="header">
        Shipping Rate Cards
      </Text>
      <Text style={styles.subheading}>
        Reusable shipping-fee rules you can attach to a listing when you create it. Repick picks
        the default card when none of your custom ones fit.
      </Text>
      <View style={styles.statChip}>
        <Text style={styles.statChipText}>
          {liveCount} of {totalCount} rate cards currently selectable on new listings
        </Text>
      </View>
      <View
        style={styles.liveRegion}
        accessibilityLiveRegion="polite"
        accessibilityRole={liveMessage ? "alert" : undefined}
      >
        <Text style={styles.liveRegionText}>
          {liveMessage || "Changes to your rate cards will be announced here."}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RateCardRow
            card={item}
            onToggleStatus={handleToggleStatus}
            onRemove={handleRemove}
            onAnnounce={announce}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<View style={styles.footerSpace} />}
        ItemSeparatorComponent={() => null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(5),
    paddingBottom: tokens.space(4),
  },
  heading: {
    fontSize: 23,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(2),
    lineHeight: 18,
  },
  statChip: {
    alignSelf: "flex-start",
    marginTop: tokens.space(4),
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
  },
  statChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
    fontVariant: ["tabular-nums"],
  },
  liveRegion: {
    marginTop: tokens.space(3),
  },
  liveRegionText: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  footerSpace: {
    height: tokens.space(8),
  },
});
