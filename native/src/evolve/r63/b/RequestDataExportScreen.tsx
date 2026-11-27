// native/src/evolve/r63/b/RequestDataExportScreen.tsx — auto-native-r63 candidate b (blind).
//
// "Request My Data Export" (privacy / account settings). Per this round's
// brief this is the sanctioned "no band" form: requesting an export is a
// single, irreversible action with no blocked/incomplete state to gate on,
// so there is deliberately NO persistent bottom bar of any kind. The one
// primary action lives inline in the scrolling content. Tapping it performs
// a one-way, whole-content swap (not an overlay, not a toast on top of the
// still-visible request view) from "here's what will export" to a terminal
// confirmation that stays up for the rest of the session — there is no
// second action and no cancel afterward.
//
// This is the same ABSTRACT shape as auto-native-r59/b (no band, one global
// button, terminal full-content-swap) but nothing below reuses its names,
// strings, or structure — only the pattern is shared, independently.
//
// A11y: the request view and the confirmation view are two separate top-level
// containers, so only the confirmation one carries accessibilityLiveRegion
// ="polite", and only its headline sentence carries accessibilityRole="alert"
// — exactly one live region in the tree, never two competing ones.
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  EXPORT_CATEGORIES,
  EXPORT_DELIVERY_EMAIL,
  EXPORT_ETA_LABEL,
  EXPORT_REQUESTED_AT_LABEL,
  EXPORT_REQUEST_REFERENCE,
  INCLUDED_DETAILS,
  formatCategoriesSummary,
  formatCategoryLine,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type ScreenState = "ready" | "requested";

export default function RequestDataExportScreen() {
  const [screenState, setScreenState] = useState<ScreenState>("ready");
  const [detailsOpen, setDetailsOpen] = useState(false);

  const categoriesSummary = formatCategoriesSummary(EXPORT_CATEGORIES);

  const handleRequestExport = () => {
    // One-way transition — there is no handler that moves screenState back
    // to "ready", by design: this action cannot be undone.
    setScreenState("requested");
  };

  const toggleDetails = () => setDetailsOpen((open) => !open);

  if (screenState === "requested") {
    return (
      <SafeAreaView style={styles.safe}>
        <View
          style={styles.container}
          accessibilityLiveRegion="polite"
        >
          <View style={styles.doneMark}>
            <Text style={styles.doneMarkGlyph}>{"✓"}</Text>
          </View>

          <Text
            style={styles.doneHeadline}
            accessibilityRole="alert"
          >
            Export requested — we'll email a download link {EXPORT_ETA_LABEL}.
          </Text>

          <Text style={styles.doneBody}>
            Your {categoriesSummary} are being packaged now. The link will be
            sent to {EXPORT_DELIVERY_EMAIL}.
          </Text>

          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Reference number</Text>
              <Text style={styles.receiptValue}>
                {EXPORT_REQUEST_REFERENCE}
              </Text>
            </View>
            <View style={styles.receiptDivider} />
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Requested at</Text>
              <Text style={styles.receiptValue}>
                {EXPORT_REQUESTED_AT_LABEL}
              </Text>
            </View>
          </View>

          <Text style={styles.doneFootnote}>
            This request has been submitted and can't be canceled. Keep this
            reference number if you contact support about your export.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>PRIVACY</Text>
        <Text style={styles.title} accessibilityRole="header">
          Request My Data Export
        </Text>
        <Text style={styles.intro}>
          We'll put together a copy of your {categoriesSummary} and email you
          a secure download link.
        </Text>

        <Text style={styles.sectionHead} accessibilityRole="header">
          What will be included
        </Text>

        <View style={styles.categoryList}>
          {EXPORT_CATEGORIES.map((category, index) => (
            <View
              key={category.id}
              style={[
                styles.categoryRow,
                index === EXPORT_CATEGORIES.length - 1 &&
                  styles.categoryRowLast,
              ]}
            >
              <Text style={styles.categoryLabel}>{category.label}</Text>
              <Text style={styles.categoryCount}>
                {formatCategoryLine(category)}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={toggleDetails}
          accessibilityRole="button"
          accessibilityLabel={
            detailsOpen
              ? "Hide export file details"
              : "Show export file details"
          }
          accessibilityState={{ expanded: detailsOpen }}
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.disclosureRow,
            pressed && styles.disclosureRowPressed,
          ]}
        >
          <Text style={styles.disclosureText}>
            {detailsOpen ? "Hide details" : "What's included in the file"}
          </Text>
          <Text style={styles.disclosureGlyph}>
            {detailsOpen ? "−" : "+"}
          </Text>
        </Pressable>

        {detailsOpen ? (
          <View style={styles.detailsPanel}>
            {INCLUDED_DETAILS.map((line) => (
              <View key={line} style={styles.detailsRow}>
                <Text style={styles.detailsBullet}>{"•"}</Text>
                <Text style={styles.detailsText}>{line}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Pressable
          onPress={handleRequestExport}
          accessibilityRole="button"
          accessibilityLabel="Request export"
          accessibilityHint="Submits a one-time export request that can't be canceled"
          hitSlop={HIT_SLOP}
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && styles.primaryBtnPressed,
          ]}
        >
          <Text style={styles.primaryBtnText}>Request export</Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          This can't be undone once submitted. You can request a new export
          again later if you need a more recent copy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(8),
  },

  kicker: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    color: tokens.color.faint,
  },
  title: {
    marginTop: tokens.space(2),
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: tokens.color.ink,
  },
  intro: {
    marginTop: tokens.space(3),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
  },

  sectionHead: {
    marginTop: tokens.space(6),
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },

  categoryList: {
    marginTop: tokens.space(3),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: tokens.space(4),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  categoryRowLast: {
    borderBottomWidth: 0,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },

  disclosureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: tokens.space(4),
    minHeight: 44,
    paddingHorizontal: tokens.space(1),
  },
  disclosureRowPressed: {
    opacity: 0.6,
  },
  disclosureText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.accent,
  },
  disclosureGlyph: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  detailsPanel: {
    marginTop: tokens.space(1),
    marginBottom: tokens.space(2),
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  detailsRow: {
    flexDirection: "row",
    gap: tokens.space(2),
  },
  detailsBullet: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  detailsText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  // Primary button touch-target math: paddingVertical tokens.space(4) = 16px
  // top + 16px bottom = 32px, plus a 16px/22px-line-height label, so the
  // pressable's content box alone is already 54pt tall — comfortably over
  // the 44x44pt minimum, with full-bleed width giving ample horizontal room.
  primaryBtn: {
    marginTop: tokens.space(6),
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(4),
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  primaryBtnPressed: {
    opacity: 0.85,
  },
  primaryBtnText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },

  disclaimer: {
    marginTop: tokens.space(3),
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
    textAlign: "center",
  },

  // Confirmation (terminal) state — entirely separate container from the
  // request view above, so this is the only place accessibilityLiveRegion
  // ever appears in this component.
  doneMark: {
    marginTop: tokens.space(8),
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  doneMarkGlyph: {
    fontSize: 26,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  doneHeadline: {
    marginTop: tokens.space(5),
    paddingHorizontal: tokens.space(5),
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "700",
    color: tokens.color.ink,
    textAlign: "center",
  },
  doneBody: {
    marginTop: tokens.space(3),
    paddingHorizontal: tokens.space(5),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
    textAlign: "center",
  },

  receiptCard: {
    marginTop: tokens.space(6),
    marginHorizontal: tokens.space(5),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
  },
  receiptRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: tokens.space(3),
  },
  receiptDivider: {
    height: 1,
    backgroundColor: tokens.color.border,
  },
  receiptLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    fontVariant: ["tabular-nums"],
  },

  doneFootnote: {
    marginTop: tokens.space(5),
    paddingHorizontal: tokens.space(6),
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
    textAlign: "center",
  },
});
