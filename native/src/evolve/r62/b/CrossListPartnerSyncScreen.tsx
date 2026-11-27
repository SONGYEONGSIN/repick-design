// native/src/evolve/r62/b/CrossListPartnerSyncScreen.tsx
//
// Concept: "Cross-List to Meridian Marketplace" — a seller browses their own
// active listings in a single FlatList and multi-selects any number of them
// with per-row checkboxes to push onto one external partner marketplace in
// a single batch. There is no price math anywhere on this screen: each
// row's informative content is cross-posting-relevant — partner category
// eligibility and a sync-status chip (Not Posted / Already Posted / Sync
// Error) — not a price.
//
// Band mechanism (form d — selection-count-derived contextual bar):
//   - `selectedIds: Set<string>` is the only piece of state behind the bar.
//     `selectedCount` is read straight off its size every render — there is
//     no separate boolean/phase flag keeping the bar alive. The moment a
//     cross-post batch resolves, every id in the batch is cleared from
//     `selectedIds` in the same update (those rows are no longer eligible
//     to be freshly selected), so `selectedCount` drops to 0 and the bar is
//     gone in that same render, not lingering on a leftover flag.
//   - The bar's live-region dock (`liveDock`) is permanently mounted for
//     the screen's whole lifetime. Only its *children* are conditional
//     (the bar itself, or nothing) — so TalkBack/VoiceOver see every count
//     change, the bar's first appearance, and its disappearance as updates
//     to one persistent region, never as node insertion/removal.
//   - Exactly one `accessibilityLiveRegion="polite"` exists on this screen
//     (`liveDock`), and exactly one `accessibilityRole="alert"` text lives
//     inside it at a time (the running-count sentence) — never two live
//     regions concurrently.
//   - The post-batch result ("3 posted, 1 needs attention") is intentionally
//     NOT folded into the live-region bar — showing it there after
//     `selectedIds` has already cleared would mean the bar's visibility is
//     no longer purely `selectedCount > 0`, which is exactly the
//     habit this form must avoid. Instead it's a plain, dismissible banner
//     above the list — not a live region, not a bottom band, just an
//     ordinary visible status line.
//
// Eligibility vs. sync status (kept as two independent axes so neither can
// silently imply the other):
//   - A row whose category Meridian doesn't support is NEVER selectable —
//     its checkbox slot is replaced by a plain hidden placeholder and the
//     row explains why in visible text, so there's no way to select a row
//     into a cross-post batch that was always going to fail for a reason
//     the user was never told about.
//   - A row already posted to Meridian is also not selectable — re-sending
//     something already there has no action behind it, so its checkbox
//     slot is likewise replaced, never left as a disabled-but-styled trap.
//   - A row that comes back from a batch with "Sync Error" gets its own
//     per-row Retry control (not a checkbox) that resets it to Not Posted
//     so it can be included in a later batch. This keeps "select for a new
//     batch" and "recover a failed one" as two distinct, individually
//     real actions instead of overloading one checkbox with both meanings.

import { useCallback, useState } from "react";
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
  INITIAL_LISTINGS,
  PARTNER_NAME,
  resolveCrossPostOutcome,
  type PartnerListing,
} from "./data";

const { color, space, radius } = tokens;

interface BatchResult {
  attempted: number;
  postedCount: number;
  errorCount: number;
}

type ChipTone = "neutral" | "success" | "danger" | "warning";

interface ChipDescriptor {
  label: string;
  tone: ChipTone;
}

// Pure, exhaustive over the 3 SyncStatus literals, with eligibility checked
// first — so an unsupported-category row always reads "Not Eligible"
// regardless of whatever syncStatus it happens to carry in the data.
function describeListingState(listing: PartnerListing): ChipDescriptor {
  if (listing.eligibility.kind === "unsupportedCategory") {
    return { label: "Not Eligible", tone: "warning" };
  }
  switch (listing.syncStatus) {
    case "notPosted":
      return { label: "Not Posted", tone: "neutral" };
    case "posted":
      return { label: "Already Posted", tone: "success" };
    case "syncError":
      return { label: "Sync Error", tone: "danger" };
  }
}

export default function CrossListPartnerSyncScreen() {
  const [listings, setListings] = useState<PartnerListing[]>(INITIAL_LISTINGS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastBatch, setLastBatch] = useState<BatchResult | null>(null);

  const selectedCount = selectedIds.size;

  const toggleRowSelection = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const resetRowForRetry = useCallback((id: string) => {
    setListings((current) =>
      current.map((listing) =>
        listing.id === id ? { ...listing, syncStatus: "notPosted" } : listing,
      ),
    );
  }, []);

  const sendSelectionToPartner = useCallback(() => {
    if (selectedCount === 0) return;
    let postedCount = 0;
    let errorCount = 0;

    setListings((current) =>
      current.map((listing) => {
        if (!selectedIds.has(listing.id)) return listing;
        const outcome = resolveCrossPostOutcome(listing.id);
        if (outcome === "posted") postedCount += 1;
        else errorCount += 1;
        return { ...listing, syncStatus: outcome };
      }),
    );

    setLastBatch({ attempted: selectedCount, postedCount, errorCount });
    setSelectedIds(new Set());
  }, [selectedIds, selectedCount]);

  const dismissBatchNotice = useCallback(() => {
    setLastBatch(null);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerBlock}>
        <Text accessibilityRole="header" style={styles.headerTitle}>
          Cross-List to Meridian Marketplace
        </Text>
        <Text style={styles.headerSubtitle}>
          Select any number of eligible listings below and send them to
          Meridian together in one batch.
        </Text>
      </View>

      {lastBatch ? (
        <View style={styles.batchNotice}>
          <Text style={styles.batchNoticeText}>
            {`Sent ${lastBatch.attempted} listing${
              lastBatch.attempted === 1 ? "" : "s"
            } to ${PARTNER_NAME}: ${lastBatch.postedCount} posted${
              lastBatch.errorCount > 0
                ? `, ${lastBatch.errorCount} need${
                    lastBatch.errorCount === 1 ? "s" : ""
                  } attention`
                : ""
            }.`}
          </Text>
          <Pressable
            onPress={dismissBatchNotice}
            accessibilityRole="button"
            accessibilityLabel="Dismiss cross-post result notice"
            accessibilityHint="Clears this result summary from view."
            style={styles.batchNoticeDismiss}
          >
            <Text style={styles.batchNoticeDismissText}>Dismiss</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.rowDivider} />}
        renderItem={({ item }) => (
          <ListingRow
            listing={item}
            isSelected={selectedIds.has(item.id)}
            onToggleSelect={toggleRowSelection}
            onRetry={resetRowForRetry}
          />
        )}
      />

      {/* Permanently mounted live-region dock. Only its children vary with
          selectedCount — the container itself never mounts/unmounts, so
          TalkBack/VoiceOver treat every change inside it as an update, not
          an insertion. At selectedCount === 0 it renders no children and
          therefore takes no visible space; the bar genuinely does not
          exist in that state, not merely "hidden". */}
      <View style={styles.liveDock} accessibilityLiveRegion="polite">
        {selectedCount > 0 ? (
          <View style={styles.selectionBar}>
            <Text accessibilityRole="alert" style={styles.selectionBarCount}>
              {`${selectedCount} listing${
                selectedCount === 1 ? "" : "s"
              } selected for cross-posting`}
            </Text>
            <Pressable
              onPress={sendSelectionToPartner}
              accessibilityRole="button"
              accessibilityLabel={`Cross-post ${selectedCount} selected listing${
                selectedCount === 1 ? "" : "s"
              } to ${PARTNER_NAME}`}
              accessibilityHint="Sends every selected listing to the partner marketplace in one batch."
              style={styles.crossPostAction}
            >
              <Text style={styles.crossPostActionText}>
                {`Cross-Post to ${PARTNER_NAME}`}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

interface ListingRowProps {
  listing: PartnerListing;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRetry: (id: string) => void;
}

function ListingRow({
  listing,
  isSelected,
  onToggleSelect,
  onRetry,
}: ListingRowProps) {
  const isEligible = listing.eligibility.kind === "eligible";
  const isCheckable = isEligible && listing.syncStatus === "notPosted";
  const isErrored = isEligible && listing.syncStatus === "syncError";
  const state = describeListingState(listing);

  return (
    <View style={styles.row}>
      <View style={styles.rowMain}>
        {isCheckable ? (
          // Touch target math: minWidth/minHeight are set explicitly to 44
          // rather than inferred from padding around the 22x22 visual box,
          // since 22 + 2*12(space(3)) = 46 would clear the 44pt floor but
          // this makes the floor a direct, verifiable guarantee instead of
          // an eyeballed one.
          <Pressable
            onPress={() => onToggleSelect(listing.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={`Select ${listing.title} to cross-post to ${PARTNER_NAME}`}
            style={styles.checkboxTarget}
          >
            <View
              style={[styles.checkboxBox, isSelected && styles.checkboxBoxOn]}
            >
              {isSelected ? (
                <Text style={styles.checkboxGlyph}>{"✓"}</Text>
              ) : null}
            </View>
          </Pressable>
        ) : (
          <View
            style={styles.checkboxTarget}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <View style={styles.checkboxBoxOff} />
          </View>
        )}

        <View style={styles.rowBody}>
          <Text style={styles.rowTitle}>{listing.title}</Text>
          <Text style={styles.rowMeta}>
            {`${listing.category} · ${listing.conditionLabel} · ${listing.ageLabel}`}
          </Text>
          {listing.eligibility.kind === "unsupportedCategory" ? (
            <Text style={styles.rowIssueNote}>{listing.eligibility.reason}</Text>
          ) : null}
          {isErrored && listing.retryHint ? (
            <Text style={styles.rowIssueNote}>{listing.retryHint}</Text>
          ) : null}
        </View>

        <View style={[styles.statusChip, chipBoxStyle(state.tone)]}>
          <Text style={[styles.statusChipText, chipTextStyle(state.tone)]}>
            {state.label}
          </Text>
        </View>
      </View>

      {isErrored ? (
        <Pressable
          onPress={() => onRetry(listing.id)}
          accessibilityRole="button"
          accessibilityLabel={`Retry cross-posting ${listing.title}`}
          accessibilityHint="Marks this listing Not Posted so it can be included in your next cross-post batch."
          style={styles.retryAction}
        >
          <Text style={styles.retryActionText}>Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function chipBoxStyle(tone: ChipTone): object {
  switch (tone) {
    case "neutral":
      return styles.chipNeutralBox;
    case "success":
      return styles.chipSuccessBox;
    case "danger":
      return styles.chipDangerBox;
    case "warning":
      return styles.chipWarningBox;
  }
}

function chipTextStyle(tone: ChipTone): object {
  switch (tone) {
    case "neutral":
      return styles.chipNeutralText;
    case "success":
      return styles.chipSuccessText;
    case "danger":
      return styles.chipDangerText;
    case "warning":
      return styles.chipWarningText;
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.bg,
  },
  headerBlock: {
    paddingHorizontal: space(5),
    paddingTop: space(4),
    paddingBottom: space(3),
    gap: space(1),
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: color.ink,
  },
  headerSubtitle: {
    fontSize: 14,
    color: color.muted,
    lineHeight: 20,
  },
  batchNotice: {
    marginHorizontal: space(5),
    marginBottom: space(3),
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.md,
    backgroundColor: color.accentBg,
    paddingHorizontal: space(4),
    paddingVertical: space(3),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space(3),
  },
  batchNoticeText: {
    flex: 1,
    fontSize: 13,
    color: color.ink2,
    lineHeight: 18,
    fontVariant: ["tabular-nums"],
  },
  batchNoticeDismiss: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  batchNoticeDismissText: {
    fontSize: 13,
    fontWeight: "700",
    color: color.accent,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: space(5),
    paddingBottom: space(4),
  },
  rowDivider: {
    height: 1,
    backgroundColor: color.border,
  },
  row: {
    paddingVertical: space(3),
    gap: space(2),
  },
  rowMain: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space(1),
  },
  checkboxTarget: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.bg,
  },
  checkboxBoxOn: {
    borderColor: color.accent,
    backgroundColor: color.accent,
  },
  checkboxBoxOff: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: color.border,
    backgroundColor: color.bg,
    opacity: 0.4,
  },
  checkboxGlyph: {
    fontSize: 13,
    fontWeight: "700",
    color: color.onAccent,
  },
  rowBody: {
    flex: 1,
    gap: space(1),
    paddingTop: space(1),
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: color.ink,
  },
  rowMeta: {
    fontSize: 12,
    color: color.muted,
  },
  rowIssueNote: {
    fontSize: 12,
    color: color.faint,
    lineHeight: 16,
  },
  statusChip: {
    borderRadius: radius.sm,
    paddingHorizontal: space(2),
    paddingVertical: space(1),
    alignSelf: "flex-start",
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  chipNeutralBox: {
    backgroundColor: color.bg,
    borderWidth: 1,
    borderColor: color.border,
  },
  chipNeutralText: {
    color: color.faint,
  },
  chipSuccessBox: {
    backgroundColor: color.successBg,
    borderWidth: 1,
    borderColor: color.successBorder,
  },
  chipSuccessText: {
    color: color.success,
  },
  chipDangerBox: {
    backgroundColor: color.dangerBg,
    borderWidth: 1,
    borderColor: color.dangerBorder,
  },
  chipDangerText: {
    color: color.danger,
  },
  chipWarningBox: {
    backgroundColor: color.warningBg,
    borderWidth: 1,
    borderColor: color.warningBorder,
  },
  chipWarningText: {
    color: color.warning,
  },
  retryAction: {
    alignSelf: "flex-start",
    marginLeft: 44,
    minHeight: 44,
    paddingHorizontal: space(4),
    justifyContent: "center",
    borderWidth: 1,
    borderColor: color.dangerBorder,
    borderRadius: radius.sm,
  },
  retryActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: color.danger,
  },
  liveDock: {
    // No dimensions of its own: at selectedCount === 0 it renders no
    // children above, so it collapses to zero height and shows nothing.
  },
  selectionBar: {
    backgroundColor: color.ink,
    paddingHorizontal: space(5),
    paddingTop: space(3),
    paddingBottom: space(4),
    gap: space(2),
  },
  selectionBarCount: {
    fontSize: 14,
    fontWeight: "600",
    color: color.onInk,
    fontVariant: ["tabular-nums"],
  },
  crossPostAction: {
    // Computed: paddingVertical space(3)=12 * 2 + a ~15px line box (~19px
    // rendered) comes out to roughly 43pt, just under the 44pt floor, so
    // minHeight below is the explicit guarantee rather than the padding
    // alone.
    minHeight: 44,
    paddingVertical: space(3),
    paddingHorizontal: space(5),
    borderRadius: radius.sm,
    backgroundColor: color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  crossPostActionText: {
    fontSize: 15,
    fontWeight: "700",
    color: color.onAccent,
  },
});
