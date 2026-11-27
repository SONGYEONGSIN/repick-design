// native/src/evolve/r59/b/WarehouseIntakeScanScreen.tsx — auto-native-r59
// candidate b.
//
// Warehouse Intake Scan — an operations tool for a worker receiving a
// consigned shipment against a fixed manifest. There is deliberately NO
// bottom band on this screen (brief-sanctioned no-band choice): the single
// large "Scan next package" press *is* the progress mechanism itself, so
// there is no separate blocked-reason to explain underneath it, and once
// the manifest is exhausted the scan UI is replaced entirely by a
// read-only summary rather than handed off to any action bar.
//
// State model: one integer, scannedCount (0..MANIFEST.length). It is a
// plain counter, not a random or camera-driven value — each press
// advances it by exactly one, in fixed manifest order. Every row's
// pending/received status and the "X of N received" line are *derived*
// from scannedCount plus MANIFEST's fixed order, the same
// single-source-of-truth shape the brief's doctrine calls for, just with a
// counter instead of a completed-id array (this screen's interaction is
// "press to advance in order", not "complete items in any order").
//
// Accessibility: one permanently-mounted `accessibilityLiveRegion="polite"`
// container holds the transition sentence; the sentence itself carries
// `accessibilityRole="alert"` and nothing else on screen doubles as a
// second live region. The same container keeps announcing after the
// manifest empties — the completion sentence is just another message it
// renders — so the live region is never torn down and recreated at the
// same render as the content swap.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import { MANIFEST, SHIPMENT_ID, ManifestItem } from "./data";

const ANNOUNCEMENT_VISIBLE_MS = 4000;
const TOTAL_PACKAGES = MANIFEST.length;

export default function WarehouseIntakeScanScreen() {
  const [scannedCount, setScannedCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const announcementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isComplete = scannedCount === TOTAL_PACKAGES;

  const flaggedItems = useMemo(
    () => MANIFEST.filter((item) => item.observedCondition !== item.expectedCondition),
    []
  );

  useEffect(() => {
    return () => {
      if (announcementTimerRef.current) {
        clearTimeout(announcementTimerRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string) => {
    setStatusMessage(message);
    if (announcementTimerRef.current) {
      clearTimeout(announcementTimerRef.current);
    }
    announcementTimerRef.current = setTimeout(() => {
      setStatusMessage("");
    }, ANNOUNCEMENT_VISIBLE_MS);
  }, []);

  const handleScanNext = useCallback(() => {
    if (scannedCount >= TOTAL_PACKAGES) {
      return;
    }
    const scannedItem = MANIFEST[scannedCount];
    const newCount = scannedCount + 1;
    setScannedCount(newCount);

    if (newCount === TOTAL_PACKAGES) {
      const flaggedCount = flaggedItems.length;
      announce(
        `${scannedItem.itemName} received. Intake complete — ${newCount} of ${TOTAL_PACKAGES} packages received` +
          (flaggedCount > 0
            ? `, ${flaggedCount} flagged for condition mismatch.`
            : ", no condition mismatches.")
      );
    } else {
      announce(`${scannedItem.itemName} received. ${newCount} of ${TOTAL_PACKAGES} received.`);
    }
  }, [scannedCount, flaggedItems.length, announce]);

  const renderRow = useCallback(
    ({ item, index }: { item: ManifestItem; index: number }) => (
      <ManifestRow item={item} received={index < scannedCount} />
    ),
    [scannedCount]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.heading}>
          Warehouse Intake Scan
        </Text>
        <Text style={styles.subheading}>
          Shipment {SHIPMENT_ID} · {TOTAL_PACKAGES} consigned items
        </Text>

        <View accessibilityLiveRegion="polite" style={styles.statusRegion}>
          {statusMessage ? (
            <Text accessibilityRole="alert" style={styles.statusRegionText}>
              {statusMessage}
            </Text>
          ) : null}
        </View>

        {isComplete ? (
          <CompleteSummary flaggedItems={flaggedItems} receivedCount={scannedCount} />
        ) : (
          <>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                <Text style={styles.progressTextTabular}>{scannedCount}</Text> of{" "}
                <Text style={styles.progressTextTabular}>{TOTAL_PACKAGES}</Text> received
              </Text>
            </View>

            <FlatList
              data={MANIFEST}
              keyExtractor={(item) => item.id}
              renderItem={renderRow}
              style={styles.list}
              contentContainerStyle={styles.listContent}
            />

            <Pressable
              onPress={handleScanNext}
              accessibilityRole="button"
              accessibilityLabel={`Scan next package. ${TOTAL_PACKAGES - scannedCount} remaining.`}
              accessibilityHint="Marks the next package in the manifest as received"
              hitSlop={8}
              style={({ pressed }) => [
                styles.scanButton,
                pressed && styles.scanButtonPressed,
              ]}
            >
              <Text style={styles.scanButtonText}>Scan next package</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

function ManifestRow({ item, received }: { item: ManifestItem; received: boolean }) {
  const isFlagged = item.observedCondition !== item.expectedCondition;
  return (
    <View style={styles.row}>
      {received ? <ReceivedGlyph /> : <PendingGlyph />}
      <View style={styles.rowBody}>
        <Text style={[styles.rowTitle, !received && styles.rowTitlePending]}>
          {item.itemName}
        </Text>
        <Text style={styles.rowMeta}>
          {item.id} · Expected: {item.expectedCondition}
        </Text>
        {received && isFlagged ? (
          <Text style={styles.rowFlag}>Condition mismatch — observed {item.observedCondition}</Text>
        ) : null}
      </View>
      <Text
        style={[
          styles.rowStatusLabel,
          received ? styles.rowStatusLabelReceived : styles.rowStatusLabelPending,
        ]}
      >
        {received ? "Received" : "Pending"}
      </Text>
    </View>
  );
}

function CompleteSummary({
  flaggedItems,
  receivedCount,
}: {
  flaggedItems: readonly ManifestItem[];
  receivedCount: number;
}) {
  return (
    <View style={styles.summaryContainer}>
      <Text accessibilityRole="header" style={styles.summaryHeading}>
        Intake complete
      </Text>
      <View style={styles.summaryCard}>
        <View style={styles.summaryCardRow}>
          <Text style={styles.summaryCardLabel}>Packages received</Text>
          <Text style={[styles.summaryCardValue, styles.summaryCardValueTabular]}>
            {receivedCount} / {TOTAL_PACKAGES}
          </Text>
        </View>
        <View style={styles.summaryCardRow}>
          <Text style={styles.summaryCardLabel}>Condition mismatches</Text>
          <Text
            style={[
              styles.summaryCardValue,
              styles.summaryCardValueTabular,
              flaggedItems.length > 0 && styles.summaryCardValueFlagged,
            ]}
          >
            {flaggedItems.length}
          </Text>
        </View>
      </View>

      {flaggedItems.length > 0 ? (
        <View style={styles.flaggedCard}>
          <Text accessibilityRole="header" style={styles.flaggedHeading}>
            Flagged for review
          </Text>
          {flaggedItems.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.flaggedRow,
                index === flaggedItems.length - 1 && styles.flaggedRowLast,
              ]}
            >
              <Text style={styles.flaggedItemName}>{item.itemName}</Text>
              <Text style={styles.flaggedItemDetail}>
                {item.id} · Expected {item.expectedCondition}, observed {item.observedCondition}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <Text style={styles.summaryFootnote}>
        This intake record is now read-only. No further action is available here.
      </Text>
    </View>
  );
}

function ReceivedGlyph() {
  return (
    <View style={styles.glyphBox}>
      <View style={styles.checkShortLeg} />
      <View style={styles.checkLongLeg} />
    </View>
  );
}

function PendingGlyph() {
  return (
    <View style={styles.glyphBox}>
      <View style={styles.pendingRing} />
    </View>
  );
}

const GLYPH_SIZE = 22;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  statusRegion: {
    minHeight: tokens.space(1),
  },
  statusRegionText: {
    marginTop: tokens.space(3),
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  progressRow: {
    marginTop: tokens.space(4),
    marginBottom: tokens.space(3),
  },
  progressText: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  progressTextTabular: {
    fontVariant: ["tabular-nums"],
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: tokens.space(3),
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  glyphBox: {
    width: GLYPH_SIZE,
    height: GLYPH_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(1) / 2,
  },
  pendingRing: {
    width: GLYPH_SIZE - 4,
    height: GLYPH_SIZE - 4,
    borderRadius: (GLYPH_SIZE - 4) / 2,
    borderWidth: 2,
    borderColor: tokens.color.border,
  },
  checkShortLeg: {
    position: "absolute",
    left: 4,
    top: 9,
    width: 2.5,
    height: 8,
    borderRadius: 1.25,
    backgroundColor: tokens.color.success,
    transform: [{ rotate: "45deg" }],
  },
  checkLongLeg: {
    position: "absolute",
    left: 9,
    top: 2,
    width: 2.5,
    height: 14,
    borderRadius: 1.25,
    backgroundColor: tokens.color.success,
    transform: [{ rotate: "-45deg" }],
  },
  rowBody: {
    flex: 1,
    marginLeft: tokens.space(3),
    marginRight: tokens.space(2),
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  rowTitlePending: {
    color: tokens.color.faint,
  },
  rowMeta: {
    marginTop: tokens.space(1) / 2,
    fontSize: 12,
    color: tokens.color.faint,
  },
  rowFlag: {
    marginTop: tokens.space(1),
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.warning,
  },
  rowStatusLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginTop: tokens.space(1) / 2,
  },
  rowStatusLabelReceived: {
    color: tokens.color.success,
  },
  rowStatusLabelPending: {
    color: tokens.color.faint,
  },
  scanButton: {
    minHeight: 56,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: tokens.space(3),
    marginBottom: tokens.space(4),
  },
  scanButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  summaryContainer: {
    flex: 1,
    marginTop: tokens.space(4),
  },
  summaryHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(4),
  },
  summaryCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: tokens.space(1),
  },
  summaryCardLabel: {
    fontSize: 14,
    color: tokens.color.muted,
  },
  summaryCardValue: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  summaryCardValueTabular: {
    fontVariant: ["tabular-nums"],
  },
  summaryCardValueFlagged: {
    color: tokens.color.warning,
  },
  flaggedCard: {
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
    backgroundColor: tokens.color.warningBg,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(4),
  },
  flaggedHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.warning,
    marginBottom: tokens.space(2),
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  flaggedRow: {
    paddingBottom: tokens.space(2),
    marginBottom: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.warningBorder,
  },
  flaggedRowLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  flaggedItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  flaggedItemDetail: {
    marginTop: tokens.space(1) / 2,
    fontSize: 12,
    color: tokens.color.muted,
  },
  summaryFootnote: {
    fontSize: 12,
    color: tokens.color.faint,
    textAlign: "center",
    marginTop: tokens.space(2),
  },
});
