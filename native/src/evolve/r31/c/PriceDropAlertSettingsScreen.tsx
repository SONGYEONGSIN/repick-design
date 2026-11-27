import React, { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { INITIAL_LISTINGS, WatchedListing, ThresholdMode, isAlertActive } from "./data";
import { AlertRow } from "./AlertRow";

export default function PriceDropAlertSettingsScreen() {
  const [listings, setListings] = useState<WatchedListing[]>(INITIAL_LISTINGS);

  const activeCount = useMemo(() => listings.filter(isAlertActive).length, [listings]);

  const handleToggleEnabled = useCallback((id: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, alertEnabled: !item.alertEnabled } : item))
    );
  }, []);

  const handleChangeMode = useCallback((id: string, mode: ThresholdMode) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, thresholdMode: mode } : item))
    );
  }, []);

  const handleChangePriceInput = useCallback((id: string, text: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, priceTriggerInput: text } : item))
    );
  }, []);

  const handleChangePercentInput = useCallback((id: string, text: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, percentTriggerInput: text } : item))
    );
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.heading} accessibilityRole="header">
        Price Drop Alerts
      </Text>
      <Text style={styles.subheading}>
        Pick a price or a percent drop per item. We watch it for you.
      </Text>
      <View style={styles.counterChip} accessibilityLiveRegion="polite">
        <Text style={styles.counterChipText}>
          {activeCount === 1 ? "1 alert active" : `${activeCount} alerts active`}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlertRow
            listing={item}
            onToggleEnabled={handleToggleEnabled}
            onChangeMode={handleChangeMode}
            onChangePriceInput={handleChangePriceInput}
            onChangePercentInput={handleChangePercentInput}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingBottom: tokens.space(8),
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
    marginBottom: tokens.space(3),
  },
  counterChip: {
    alignSelf: "flex-start",
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
  },
  counterChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },
});
