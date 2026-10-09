import React from "react";
import { View, Text, Pressable, Switch, TextInput, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import {
  WatchedListing,
  ThresholdMode,
  resolveNotifyBelow,
  formatUsd,
} from "./data";

const SWATCH_COLORS = [tokens.color.swatch1, tokens.color.swatch2, tokens.color.swatch3];

interface AlertRowProps {
  listing: WatchedListing;
  onToggleEnabled: (id: string) => void;
  onChangeMode: (id: string, mode: ThresholdMode) => void;
  onChangePriceInput: (id: string, text: string) => void;
  onChangePercentInput: (id: string, text: string) => void;
}

export function AlertRow({
  listing,
  onToggleEnabled,
  onChangeMode,
  onChangePriceInput,
  onChangePercentInput,
}: AlertRowProps) {
  const notifyBelow = resolveNotifyBelow(listing);
  const showInvalidNote = listing.alertEnabled && notifyBelow === null;
  const showReadout = listing.alertEnabled && notifyBelow !== null;

  return (
    <View style={styles.row}>
      <View style={styles.topLine}>
        <View
          style={[styles.thumb, { backgroundColor: SWATCH_COLORS[listing.swatchIndex] }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {listing.title}
          </Text>
          <Text style={styles.condition}>{listing.conditionLabel}</Text>
          <Text style={styles.price}>{formatUsd(listing.currentPrice)}</Text>
        </View>
        <Switch
          value={listing.alertEnabled}
          onValueChange={() => onToggleEnabled(listing.id)}
          trackColor={{ false: tokens.color.border, true: tokens.color.accentBg }}
          thumbColor={listing.alertEnabled ? tokens.color.accent : tokens.color.bg}
          ios_backgroundColor={tokens.color.border}
          accessibilityLabel={`Price drop alert for ${listing.title}, currently ${
            listing.alertEnabled ? "on" : "off"
          }`}
        />
      </View>

      {listing.alertEnabled ? (
        <View style={styles.editor}>
          <View style={styles.modeSwitcher}>
            <Pressable
              onPress={() => onChangeMode(listing.id, "price")}
              style={[
                styles.modeButton,
                listing.thresholdMode === "price" && styles.modeButtonSelected,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: listing.thresholdMode === "price" }}
              accessibilityLabel={`Use a fixed price trigger for ${listing.title}`}
              hitSlop={6}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  listing.thresholdMode === "price" && styles.modeButtonTextSelected,
                ]}
              >
                Fixed price
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onChangeMode(listing.id, "percent")}
              style={[
                styles.modeButton,
                listing.thresholdMode === "percent" && styles.modeButtonSelected,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: listing.thresholdMode === "percent" }}
              accessibilityLabel={`Use a percent drop trigger for ${listing.title}`}
              hitSlop={6}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  listing.thresholdMode === "percent" && styles.modeButtonTextSelected,
                ]}
              >
                % drop
              </Text>
            </Pressable>
          </View>

          <View style={styles.inputLine}>
            {listing.thresholdMode === "price" ? (
              <>
                <Text style={styles.inputPrefix}>Below $</Text>
                <TextInput
                  value={listing.priceTriggerInput}
                  onChangeText={(text) => onChangePriceInput(listing.id, text)}
                  keyboardType="decimal-pad"
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={tokens.color.faint}
                  accessibilityLabel={`Fixed price trigger amount for ${listing.title}`}
                />
              </>
            ) : (
              <>
                <Text style={styles.inputPrefix}>Drops by</Text>
                <TextInput
                  value={listing.percentTriggerInput}
                  onChangeText={(text) => onChangePercentInput(listing.id, text)}
                  keyboardType="decimal-pad"
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={tokens.color.faint}
                  accessibilityLabel={`Percent drop trigger amount for ${listing.title}`}
                />
                <Text style={styles.inputSuffix}>%</Text>
              </>
            )}
          </View>

          {showReadout ? (
            <View style={styles.readout}>
              <Text style={styles.readoutText}>
                {`You'll be notified if the price drops below ${formatUsd(notifyBelow as number)}`}
              </Text>
            </View>
          ) : null}

          {showInvalidNote ? (
            <View style={styles.invalidNote}>
              <Text style={styles.invalidNoteText}>
                {listing.thresholdMode === "price"
                  ? `Enter an amount under ${formatUsd(listing.currentPrice)} to turn this alert on`
                  : "Enter a drop between 1% and 99% to turn this alert on"}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  topLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumb: {
    width: tokens.space(14),
    height: tokens.space(14),
    borderRadius: tokens.radius.sm,
  },
  titleBlock: {
    flex: 1,
    marginLeft: tokens.space(3),
    marginRight: tokens.space(3),
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  condition: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(1),
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
    marginTop: tokens.space(1),
  },
  editor: {
    marginTop: tokens.space(3),
  },
  modeSwitcher: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  modeButton: {
    paddingHorizontal: tokens.space(3),
    minHeight: 44,
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  modeButtonSelected: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.muted,
  },
  modeButtonTextSelected: {
    color: tokens.color.accent,
  },
  inputLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(3),
  },
  inputPrefix: {
    fontSize: 14,
    color: tokens.color.muted,
    marginRight: tokens.space(2),
  },
  inputSuffix: {
    fontSize: 14,
    color: tokens.color.muted,
    marginLeft: tokens.space(2),
  },
  input: {
    minWidth: tokens.space(20),
    minHeight: 44,
    paddingHorizontal: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    fontSize: 14,
    color: tokens.color.ink,
  },
  readout: {
    marginTop: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
  },
  readoutText: {
    fontSize: 13,
    color: tokens.color.accent,
    fontWeight: "600",
  },
  invalidNote: {
    marginTop: tokens.space(3),
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(2),
    backgroundColor: tokens.color.warningBg,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    borderRadius: tokens.radius.sm,
  },
  invalidNoteText: {
    fontSize: 12,
    color: tokens.color.warning,
  },
});
