import React, { useMemo, useState } from "react";
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
  fieldGroups as baseFieldGroups,
  contentsFlags as baseContentsFlags,
  shipmentContext,
  hsCategory,
  valuation,
  type ContentsFlag,
  type FieldGroupId,
} from "./data";

const ORIGIN_OPTIONS = ["Japan", "Germany", "China"];

// ---- small vector icons (no emoji) --------------------------------------

function CheckMark({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <View
      style={[styles.checkIconWrap, { width: size, height: size }]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      <View style={[styles.checkStemShort, { backgroundColor: color }]} />
      <View style={[styles.checkStemLong, { backgroundColor: color }]} />
    </View>
  );
}

function RingIcon({ color }: { color: string }) {
  return (
    <View
      style={[styles.ringIcon, { borderColor: color }]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    />
  );
}

function LockIcon({ color }: { color: string }) {
  return (
    <View
      style={styles.lockWrap}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      <View style={[styles.lockShackle, { borderColor: color }]} />
      <View style={[styles.lockBody, { backgroundColor: color }]} />
    </View>
  );
}

function StatusIcon({ complete }: { complete: boolean }) {
  return complete ? (
    <View style={[styles.statusCircle, { backgroundColor: tokens.color.success }]}>
      <CheckMark color={tokens.color.onInk} size={14} />
    </View>
  ) : (
    <RingIcon color={tokens.color.border} />
  );
}

// ---- derived summary builders --------------------------------------------

function summarizeFlags(flags: ContentsFlag[]): string {
  const checked = flags.filter((f) => f.checked).map((f) => f.label);
  if (checked.length === 0) {
    return "No batteries, liquids, or restricted materials declared.";
  }
  return checked.join(", ") + " declared.";
}

export default function CustomsDeclarationScreen() {
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [flags, setFlags] = useState<ContentsFlag[]>(baseContentsFlags);
  const [flagsConfirmed, setFlagsConfirmed] = useState(false);
  const [labelGenerated, setLabelGenerated] = useState(false);

  const groups = useMemo(() => {
    return baseFieldGroups.map((g) => {
      if (g.id === "origin") {
        return {
          ...g,
          complete: selectedOrigin !== null,
          completeSummary: selectedOrigin
            ? `Manufactured in ${selectedOrigin}`
            : g.completeSummary,
        };
      }
      if (g.id === "contentsFlags") {
        return {
          ...g,
          complete: flagsConfirmed,
          completeSummary: flagsConfirmed
            ? summarizeFlags(flags)
            : g.completeSummary,
        };
      }
      return g;
    });
  }, [selectedOrigin, flags, flagsConfirmed]);

  const activeGroup = groups.find((g) => !g.complete);
  const allComplete = activeGroup === undefined;

  function toggleFlag(id: string) {
    if (flagsConfirmed || labelGenerated) return;
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, checked: !f.checked } : f))
    );
  }

  function confirmFlags() {
    if (labelGenerated) return;
    setFlagsConfirmed(true);
  }

  function selectOrigin(country: string) {
    if (labelGenerated) return;
    setSelectedOrigin(country);
  }

  function onBandPress() {
    if (!allComplete || labelGenerated) return;
    setLabelGenerated(true);
  }

  const bandKind: "blocked" | "ready" | "done" = labelGenerated
    ? "done"
    : allComplete
    ? "ready"
    : "blocked";

  const bandMessage =
    bandKind === "done"
      ? `Customs label generated for shipment to ${shipmentContext.destinationCountry}.`
      : bandKind === "ready"
      ? "All sections complete. Tap to generate the customs label."
      : activeGroup!.blockedReason;

  const bandEyebrow =
    bandKind === "done" ? "Done" : bandKind === "ready" ? "Ready" : "Blocked";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.headerTitle}>
          Customs Declaration
        </Text>
        <Text style={styles.headerSubtitle}>
          {shipmentContext.listingTitle}
        </Text>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(g) => g.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.summaryCard}>
            <View style={styles.summaryThumb} />
            <View style={styles.summaryTextWrap}>
              <Text style={styles.summaryDestinationLabel}>Ships to</Text>
              <Text style={styles.summaryDestination}>
                {shipmentContext.destinationCity}, {shipmentContext.destinationCountry}
              </Text>
              <View style={styles.hsChip}>
                <Text style={styles.hsChipText}>
                  HS {hsCategory.code} · {hsCategory.label}
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }: { item: typeof groups[number] }) => {
          const isActive =
            !labelGenerated && activeGroup?.id === (item.id as FieldGroupId);
          return (
            <View
              style={[styles.groupCard, isActive && styles.groupCardActive]}
            >
              <View style={styles.groupHeaderRow}>
                <StatusIcon complete={item.complete} />
                <View style={styles.groupTitleWrap}>
                  <Text style={styles.groupTitle}>{item.title}</Text>
                  <Text style={styles.groupSummary}>
                    {item.complete ? item.completeSummary : "Incomplete"}
                  </Text>
                </View>
              </View>

              {item.id === "itemDetails" && (
                <Text style={styles.groupDetailText}>
                  Quantity 1 · Condition: used, fully functional.
                </Text>
              )}

              {item.id === "valuation" && (
                <Text style={styles.groupDetailText}>
                  Declared value ${valuation.amount.toFixed(2)}{" "}
                  {valuation.currency} · Reason for export:{" "}
                  {valuation.reasonForExport}.
                </Text>
              )}

              {item.id === "origin" && !item.complete && !labelGenerated && (
                <View style={styles.chipRow}>
                  {ORIGIN_OPTIONS.map((country) => (
                    <Pressable
                      key={country}
                      onPress={() => selectOrigin(country)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Set country of origin to ${country}`}
                      style={({ pressed }) => [
                        styles.chip,
                        pressed && styles.chipPressed,
                      ]}
                    >
                      <Text style={styles.chipText}>{country}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {item.id === "contentsFlags" &&
                !item.complete &&
                !labelGenerated && (
                  <View style={styles.flagList}>
                    {flags.map((f) => (
                      <Pressable
                        key={f.id}
                        onPress={() => toggleFlag(f.id)}
                        hitSlop={6}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: f.checked }}
                        accessibilityLabel={f.label}
                        accessibilityHint={f.helpText}
                        style={({ pressed }) => [
                          styles.flagRow,
                          pressed && styles.flagRowPressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            f.checked && styles.checkboxChecked,
                          ]}
                        >
                          {f.checked && (
                            <CheckMark color={tokens.color.accent} size={12} />
                          )}
                        </View>
                        <View style={styles.flagTextWrap}>
                          <Text style={styles.flagLabel}>{f.label}</Text>
                          <Text style={styles.flagHelp}>{f.helpText}</Text>
                        </View>
                      </Pressable>
                    ))}
                    <Pressable
                      onPress={confirmFlags}
                      accessibilityRole="button"
                      accessibilityLabel="Confirm restricted contents"
                      style={({ pressed }) => [
                        styles.confirmButton,
                        pressed && styles.confirmButtonPressed,
                      ]}
                    >
                      <Text style={styles.confirmButtonText}>
                        Confirm restricted contents
                      </Text>
                    </Pressable>
                  </View>
                )}
            </View>
          );
        }}
      />

      <View style={styles.bandOuter} accessibilityLiveRegion="polite">
        <Pressable
          onPress={onBandPress}
          disabled={bandKind !== "ready"}
          accessibilityRole={bandKind === "ready" ? "button" : undefined}
          accessibilityState={{ disabled: bandKind !== "ready" }}
          accessibilityLabel={
            bandKind === "ready" ? "Generate customs label" : undefined
          }
          accessibilityHint={
            bandKind === "ready"
              ? "Generates the customs label for this shipment"
              : undefined
          }
          style={({ pressed }) => [
            styles.band,
            bandKind === "blocked" && styles.bandBlocked,
            bandKind === "ready" && styles.bandReady,
            bandKind === "ready" && pressed && styles.bandReadyPressed,
            bandKind === "done" && styles.bandDone,
          ]}
        >
          {bandKind === "blocked" && <LockIcon color={tokens.color.warning} />}
          {bandKind === "ready" && (
            <CheckMark color={tokens.color.onAccent} size={18} />
          )}
          {bandKind === "done" && (
            <CheckMark color={tokens.color.success} size={18} />
          )}
          <View style={styles.bandTextWrap}>
            <Text
              style={[
                styles.bandEyebrow,
                bandKind === "blocked" && styles.bandEyebrowBlocked,
                bandKind === "ready" && styles.bandEyebrowReady,
                bandKind === "done" && styles.bandEyebrowDone,
              ]}
            >
              {bandEyebrow}
            </Text>
            <Text
              accessibilityRole="alert"
              style={[
                styles.bandMessage,
                bandKind === "blocked" && styles.bandMessageBlocked,
                bandKind === "ready" && styles.bandMessageReady,
                bandKind === "done" && styles.bandMessageDone,
              ]}
            >
              {bandKind === "ready" ? "Generate Label" : bandMessage}
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const SP = tokens.space;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: SP(5),
    paddingTop: SP(3),
    paddingBottom: SP(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  headerSubtitle: {
    marginTop: SP(1),
    fontSize: 14,
    fontWeight: "400",
    color: tokens.color.muted,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SP(5),
    paddingTop: SP(4),
    paddingBottom: SP(8),
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: SP(4),
    marginBottom: SP(5),
  },
  summaryThumb: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.swatch2,
    marginRight: SP(4),
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryDestinationLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  summaryDestination: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: SP(1),
  },
  hsChip: {
    alignSelf: "flex-start",
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: SP(2),
    paddingVertical: SP(1),
    marginTop: SP(2),
  },
  hsChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: tokens.color.accent,
  },
  groupCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: SP(4),
    marginBottom: SP(3),
    backgroundColor: tokens.color.bg,
  },
  groupCardActive: {
    borderColor: tokens.color.accent,
    borderWidth: 1.5,
  },
  groupHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  groupTitleWrap: {
    marginLeft: SP(3),
    flex: 1,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: tokens.color.ink,
  },
  groupSummary: {
    fontSize: 13,
    fontWeight: "400",
    color: tokens.color.muted,
    marginTop: SP(1),
  },
  groupDetailText: {
    fontSize: 13,
    fontWeight: "400",
    color: tokens.color.muted,
    marginTop: SP(3),
    marginLeft: SP(8),
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SP(3),
    marginLeft: SP(8),
    gap: SP(2),
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: SP(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    justifyContent: "center",
    alignItems: "center",
  },
  chipPressed: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: tokens.color.ink,
  },
  flagList: {
    marginTop: SP(3),
    marginLeft: SP(8),
  },
  flagRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 44,
    paddingVertical: SP(2),
  },
  flagRowPressed: {
    opacity: 0.7,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.sm,
    borderWidth: 1.5,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SP(1),
  },
  checkboxChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  flagTextWrap: {
    marginLeft: SP(3),
    flex: 1,
  },
  flagLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: tokens.color.ink,
  },
  flagHelp: {
    fontSize: 12,
    fontWeight: "400",
    color: tokens.color.muted,
    marginTop: SP(1) / 2,
  },
  confirmButton: {
    minHeight: 44,
    marginTop: SP(2),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: tokens.color.accent,
  },
  bandOuter: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: SP(5),
    paddingVertical: SP(3),
  },
  band: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    borderRadius: tokens.radius.md,
    paddingHorizontal: SP(4),
  },
  bandBlocked: {
    backgroundColor: tokens.color.warningBg,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
  },
  bandReady: {
    backgroundColor: tokens.color.accent,
  },
  bandReadyPressed: {
    opacity: 0.85,
  },
  bandDone: {
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
  },
  bandTextWrap: {
    marginLeft: SP(3),
    flex: 1,
  },
  bandEyebrow: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  bandEyebrowBlocked: {
    color: tokens.color.warning,
  },
  bandEyebrowReady: {
    color: tokens.color.onAccent,
  },
  bandEyebrowDone: {
    color: tokens.color.success,
  },
  bandMessage: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: SP(1) / 2,
  },
  bandMessageBlocked: {
    color: tokens.color.warning,
  },
  bandMessageReady: {
    color: tokens.color.onAccent,
  },
  bandMessageDone: {
    color: tokens.color.success,
  },
  // icons
  checkIconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkStemShort: {
    position: "absolute",
    width: 2,
    height: 6,
    borderRadius: 1,
    left: "28%",
    top: "52%",
    transform: [{ rotate: "45deg" }],
  },
  checkStemLong: {
    position: "absolute",
    width: 2,
    height: 11,
    borderRadius: 1,
    left: "56%",
    top: "22%",
    transform: [{ rotate: "-45deg" }],
  },
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  ringIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  lockWrap: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  lockShackle: {
    position: "absolute",
    top: 0,
    width: 8,
    height: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  lockBody: {
    width: 14,
    height: 10,
    borderRadius: 2,
  },
});
