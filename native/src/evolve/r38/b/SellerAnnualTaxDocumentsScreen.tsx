// native/src/evolve/r38/b/SellerAnnualTaxDocumentsScreen.tsx
//
// Seller Annual Tax Documents — the marketplace's own official annual tax
// paperwork (a 1099-K-equivalent and, some years, a supplementary summary
// or a correction), grouped by tax year and offered for download. This is
// a read-only archive, not the "Tax Export Tagging" screen: nothing here
// lets the seller edit or tag a transaction, and nothing is blocked or
// destructive, so there is no bottom action band at all.
//
// Macro layout: a genuinely two-level grouped list — a sticky year-header
// row ("2025", "2024", ...) followed by that year's 1-3 document rows,
// flattened into one FlatList data array via a `type` discriminator
// (yearHeader / pending / document) rather than a flat list of cards.
//
// The one live interaction is per-row Download: pressing it is real enough
// to confirm — the button itself swaps to a brief "Downloaded" state and a
// single shared live region announces it, then both revert to idle after a
// fixed ~4s window so the confirmation never gets stuck "on".

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
import {
  taxYearGroups,
  buildTaxDocumentListItems,
  findYearHeaderIndices,
  formatKRW,
  type TaxDocListItem,
  type TaxDocumentRecord,
} from "./data";

const CONFIRMATION_VISIBLE_MS = 4000;

export function SellerAnnualTaxDocumentsScreen() {
  const listItems = useMemo(() => buildTaxDocumentListItems(taxYearGroups), []);
  const stickyHeaderIndices = useMemo(
    () => findYearHeaderIndices(listItems),
    [listItems]
  );

  // Exactly one confirmation is live at a time, both as the row's own
  // button state and as the text inside the single shared live region
  // below — so two confirmations can never be announced at once.
  const [confirmedDocId, setConfirmedDocId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string>("");
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
      }
    };
  }, []);

  const handleDownload = useCallback((record: TaxDocumentRecord, taxYear: number) => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
    }
    setConfirmedDocId(record.id);
    setAnnouncement(`${record.formNumberLabel} for ${taxYear} downloaded.`);
    clearTimerRef.current = setTimeout(() => {
      setConfirmedDocId(null);
      setAnnouncement("");
      clearTimerRef.current = null;
    }, CONFIRMATION_VISIBLE_MS);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: TaxDocListItem }) => {
      if (item.type === "yearHeader") {
        return (
          <View style={styles.yearHeaderRow}>
            <Text accessibilityRole="header" style={styles.yearHeaderTitle}>
              {String(item.taxYear)}
            </Text>
            <Text style={styles.yearHeaderCaption}>{item.captionLabel}</Text>
          </View>
        );
      }

      if (item.type === "pending") {
        return (
          <View style={styles.pendingRow}>
            <Text style={styles.pendingLabel}>{item.reasonLabel}</Text>
          </View>
        );
      }

      const { record } = item;
      const isConfirmed = confirmedDocId === record.id;

      return (
        <View style={styles.documentRow}>
          <View style={styles.documentTopLine}>
            <View style={styles.fileTypeBadge}>
              <Text style={styles.fileTypeBadgeLabel}>{record.fileFormat}</Text>
            </View>
            <Text style={styles.documentTitle} numberOfLines={2}>
              {record.formNumberLabel}
            </Text>
          </View>

          <Text style={styles.documentMetaLine}>
            Issued {record.issuedDateLabel} · {record.fileSizeLabel}
          </Text>

          {record.totalReportedAmount != null ? (
            <Text style={styles.documentAmountLine}>
              Gross reported: {formatKRW(record.totalReportedAmount)}
            </Text>
          ) : null}

          {record.noteLabel ? (
            <Text style={styles.documentNoteLine}>{record.noteLabel}</Text>
          ) : null}

          <Pressable
            onPress={() => handleDownload(record, item.taxYear)}
            accessibilityRole="button"
            accessibilityLabel={`Download ${record.formNumberLabel}, ${item.taxYear} tax year, ${record.fileFormat}, issued ${record.issuedDateLabel}`}
            accessibilityHint="Downloads this document and confirms once it's ready."
            style={({ pressed }) => [
              styles.downloadButton,
              pressed && !isConfirmed && styles.downloadButtonPressed,
              isConfirmed && styles.downloadButtonConfirmed,
            ]}
          >
            <Text
              style={[
                styles.downloadButtonLabel,
                isConfirmed && styles.downloadButtonLabelConfirmed,
              ]}
            >
              {isConfirmed ? "Downloaded" : "Download"}
            </Text>
          </Pressable>
        </View>
      );
    },
    [confirmedDocId, handleDownload]
  );

  return (
    <SafeAreaView style={styles.screenRoot}>
      <View style={styles.titleBlock}>
        <Text accessibilityRole="header" style={styles.screenTitle}>
          Annual Tax Documents
        </Text>
        <Text style={styles.screenSubtitle}>
          Official 1099-K forms and supplementary summaries the marketplace
          has issued for your sales, grouped by tax year.
        </Text>
      </View>

      <View
        style={[
          styles.confirmationRegion,
          announcement.length > 0 && styles.confirmationRegionActive,
        ]}
        accessibilityLiveRegion="polite"
      >
        {announcement.length > 0 ? (
          <Text accessibilityRole="alert" style={styles.confirmationText}>
            {announcement}
          </Text>
        ) : null}
      </View>

      <FlatList
        data={listItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={confirmedDocId}
        stickyHeaderIndices={stickyHeaderIndices}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  titleBlock: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(2),
  },
  screenTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },
  confirmationRegion: {
    paddingHorizontal: tokens.space(4),
    height: 0,
    overflow: "hidden",
  },
  confirmationRegionActive: {
    height: undefined,
    paddingVertical: tokens.space(2),
    backgroundColor: tokens.color.successBg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: tokens.color.successBorder,
  },
  confirmationText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    color: tokens.color.success,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  yearHeaderRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    backgroundColor: tokens.color.bg,
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(2),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    marginBottom: tokens.space(3),
  },
  yearHeaderTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  yearHeaderCaption: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.faint,
  },
  pendingRow: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    borderStyle: "dashed",
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
  },
  pendingLabel: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.faint,
  },
  documentRow: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  documentTopLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: tokens.space(2),
  },
  fileTypeBadge: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    marginRight: tokens.space(3),
    backgroundColor: tokens.color.accentBg,
  },
  fileTypeBadgeLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: tokens.color.accent,
  },
  documentTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  documentMetaLine: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
    marginBottom: tokens.space(1),
  },
  documentAmountLine: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
    marginBottom: tokens.space(1),
  },
  documentNoteLine: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
    marginBottom: tokens.space(2),
  },
  downloadButton: {
    alignSelf: "flex-start",
    minHeight: 40,
    minWidth: 112,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    marginTop: tokens.space(1),
  },
  downloadButtonPressed: {
    opacity: 0.85,
  },
  downloadButtonConfirmed: {
    backgroundColor: tokens.color.successBg,
    borderWidth: 1,
    borderColor: tokens.color.successBorder,
  },
  downloadButtonLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: tokens.color.onAccent,
  },
  downloadButtonLabelConfirmed: {
    color: tokens.color.success,
  },
});

export default SellerAnnualTaxDocumentsScreen;
