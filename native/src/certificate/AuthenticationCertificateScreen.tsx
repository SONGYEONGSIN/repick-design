// native/src/certificate/AuthenticationCertificateScreen.tsx — auto-native-r12 candidate c.
//
// Item Authentication Certificate: the completed *result* of an item-level authentication check,
// shown as a certificate-style record (reference photo, item meta, an overall verdict, and five
// independently-timestamped checkpoints). This is deliberately NOT another step-by-step wizard —
// unlike verification/SellerVerificationScreen (which verifies a PERSON through an active
// multi-step flow with a blocking state-machine band), everything on this screen is already
// decided by the time it renders. Per GENERATION.md §3, a state-machine "why blocked" band would
// misrepresent that: nothing here is blocked, so the fixed bottom band is instead a persistent,
// always-available action bar (Share certificate / Download as proof) — not a state machine.
//
// Checkpoint verdict states are told apart by shape + weight + glyph, never color: "pass" is a
// filled accent circle with a check glyph, "note" (an advisory that does not change the verdict)
// is an outlined ink2 circle with a "!" glyph. Screen readers get the same distinction as an
// explicit accessibilityLabel on the marker itself, not just from color/icon.
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../tokens";
import {
  CERTIFICATE_ID,
  CHECKPOINTS,
  DOWNLOAD_FEEDBACK,
  INSPECTOR,
  INTAKE_PHOTO_LABEL,
  ISSUED_LABEL,
  ITEM,
  OVERALL,
  SHARE_DESTINATIONS,
  VOID_NOTE,
  type Checkpoint,
  type ShareDestination,
} from "./data";

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

function CheckpointMarker({ status }: { status: Checkpoint["status"] }) {
  const isPass = status === "pass";
  return (
    <View
      accessible
      accessibilityLabel={isPass ? "Passed" : "Passed, advisory note"}
      style={[styles.marker, isPass ? styles.markerPass : styles.markerNote]}
    >
      <Text style={[styles.markerGlyph, isPass && styles.markerGlyphOnAccent]}>
        {isPass ? "✓" : "!"}
      </Text>
    </View>
  );
}

export function AuthenticationCertificateScreen() {
  const [sharePanelOpen, setSharePanelOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const passedCount = CHECKPOINTS.filter((c) => c.status === "pass").length;
  const advisoryCount = CHECKPOINTS.length - passedCount;

  const openSharePanel = () => {
    setFeedback(null);
    setSharePanelOpen(true);
  };

  const closeSharePanel = () => setSharePanelOpen(false);

  const chooseDestination = (dest: ShareDestination) => {
    setSharePanelOpen(false);
    setFeedback(dest.feedback);
  };

  const handleDownload = () => {
    setSharePanelOpen(false);
    setFeedback(DOWNLOAD_FEEDBACK);
  };

  const header = (
    <View style={styles.header}>
      <Text style={styles.kicker}>ITEM AUTHENTICATION</Text>
      <Text style={styles.title} accessibilityRole="header">
        Authentication Certificate
      </Text>

      <View style={styles.certRow}>
        <View style={styles.certMeta}>
          <Text style={styles.certId}>{CERTIFICATE_ID}</Text>
          <Text style={styles.certIssued}>Issued {ISSUED_LABEL}</Text>
        </View>
        <View
          style={styles.scanFrame}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Text style={styles.scanFrameGlyph}>{"▦"}</Text>
        </View>
      </View>

      <View style={styles.itemCard}>
        <View
          style={styles.photoBox}
          accessible
          accessibilityRole="image"
          accessibilityLabel="Reference photo of the item captured during intake"
        >
          <Text style={styles.photoBoxLabel}>Photo on file</Text>
          <Text style={styles.photoBoxCaption}>{INTAKE_PHOTO_LABEL}</Text>
        </View>
        <View style={styles.itemMeta}>
          <Text style={styles.itemBrand}>{ITEM.brand}</Text>
          <Text style={styles.itemTitle}>{ITEM.title}</Text>
          <Text style={styles.itemLine}>{ITEM.category}</Text>
          <Text style={styles.itemLine}>Ref. {ITEM.refNumber}</Text>
          <Text style={styles.itemLine}>Condition: {ITEM.conditionLabel}</Text>
        </View>
      </View>

      <View style={styles.verdictCard}>
        <View
          style={styles.verdictMark}
          accessible
          accessibilityLabel="Overall verdict: authentic"
        >
          <Text style={styles.verdictMarkGlyph}>{"✓"}</Text>
        </View>
        <View style={styles.verdictBody}>
          <Text style={styles.verdictHeadline}>{OVERALL.headline}</Text>
          <Text style={styles.verdictSummary}>{OVERALL.summary}</Text>
        </View>
      </View>

      <View style={styles.inspectorRow}>
        <Text style={styles.inspectorLabel}>Inspected by</Text>
        <Text style={styles.inspectorValue}>
          {INSPECTOR.name} · {INSPECTOR.credential}
        </Text>
      </View>

      <Text style={styles.sectionHead} accessibilityRole="header">
        Checkpoints ({CHECKPOINTS.length})
      </Text>
      <Text style={styles.sectionSub}>
        Each item is inspected independently before a certificate is issued.
      </Text>
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <View style={styles.tallyRow}>
        <Text style={styles.tallyText}>
          {passedCount} passed · {advisoryCount} advisory note
          {advisoryCount === 1 ? "" : "s"}
        </Text>
      </View>
      <Text style={styles.voidNote}>{VOID_NOTE}</Text>
      <Text style={styles.tail}>
        Certificate {CERTIFICATE_ID} · Repick Trust Lab
      </Text>
    </View>
  );

  const renderCheckpoint = ({ item }: { item: Checkpoint }) => (
    <View style={styles.checkRow}>
      <CheckpointMarker status={item.status} />
      <View style={styles.checkBody}>
        <View style={styles.checkTop}>
          <Text style={styles.checkName}>{item.name}</Text>
          <Text
            style={[
              styles.checkVerdict,
              item.status === "note" && styles.checkVerdictNote,
            ]}
          >
            {item.verdictLabel}
          </Text>
        </View>
        <Text style={styles.checkNote}>{item.note}</Text>
        <Text style={styles.checkTimestamp}>{item.timestampLabel}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={CHECKPOINTS}
        keyExtractor={(item) => item.id}
        renderItem={renderCheckpoint}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.band} accessibilityLiveRegion="polite">
        {feedback ? (
          <Text style={styles.bandFeedback} accessibilityRole="alert">
            {feedback}
          </Text>
        ) : (
          <Text style={styles.bandLead}>
            Certificate {CERTIFICATE_ID} is ready to share or save.
          </Text>
        )}

        {sharePanelOpen ? (
          <View style={styles.sharePanel}>
            {SHARE_DESTINATIONS.map((dest) => (
              <Pressable
                key={dest.id}
                onPress={() => chooseDestination(dest)}
                accessibilityRole="button"
                accessibilityLabel={dest.label}
                hitSlop={HIT_SLOP}
                style={({ pressed }) => [
                  styles.shareRow,
                  pressed && styles.shareRowPressed,
                ]}
              >
                <Text style={styles.shareRowText}>{dest.label}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={closeSharePanel}
              accessibilityRole="button"
              accessibilityLabel="Cancel sharing"
              hitSlop={HIT_SLOP}
              style={({ pressed }) => [
                styles.shareCancel,
                pressed && styles.shareRowPressed,
              ]}
            >
              <Text style={styles.shareCancelText}>Cancel</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.bandActions}>
          <Pressable
            onPress={sharePanelOpen ? closeSharePanel : openSharePanel}
            accessibilityRole="button"
            accessibilityLabel={
              sharePanelOpen ? "Close share options" : "Share certificate"
            }
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>
              {sharePanelOpen ? "Choose where to share" : "Share certificate"}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleDownload}
            accessibilityRole="button"
            accessibilityLabel="Download as proof, PDF"
            hitSlop={HIT_SLOP}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.secondaryBtnText}>Download as proof</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingBottom: tokens.space(6),
  },

  header: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
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

  certRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: tokens.space(4),
    paddingBottom: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  certMeta: {
    gap: 2,
  },
  certId: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  certIssued: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  scanFrame: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrameGlyph: {
    fontSize: 20,
    color: tokens.color.faint,
  },

  itemCard: {
    flexDirection: "row",
    gap: tokens.space(4),
    marginTop: tokens.space(4),
  },
  photoBox: {
    width: 104,
    height: 104,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
    gap: 2,
  },
  photoBoxLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: tokens.color.muted,
    textAlign: "center",
  },
  photoBoxCaption: {
    fontSize: 10,
    color: tokens.color.faint,
    textAlign: "center",
  },
  itemMeta: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },
  itemBrand: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: 2,
  },
  itemLine: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: 2,
  },

  verdictCard: {
    flexDirection: "row",
    gap: tokens.space(4),
    marginTop: tokens.space(5),
    borderWidth: 1.5,
    borderColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    alignItems: "flex-start",
  },
  verdictMark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  verdictMarkGlyph: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  verdictBody: {
    flex: 1,
    gap: 4,
  },
  verdictHeadline: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  verdictSummary: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },

  inspectorRow: {
    marginTop: tokens.space(4),
    paddingBottom: tokens.space(5),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    gap: 2,
  },
  inspectorLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: tokens.color.faint,
  },
  inspectorValue: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
  },

  sectionHead: {
    fontSize: 17,
    fontWeight: "700",
    color: tokens.color.ink,
    marginTop: tokens.space(5),
  },
  sectionSub: {
    fontSize: 13,
    color: tokens.color.muted,
    marginTop: tokens.space(1),
    marginBottom: tokens.space(1),
  },

  checkRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(5),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  markerPass: {
    backgroundColor: tokens.color.accent,
  },
  markerNote: {
    borderWidth: 1.5,
    borderColor: tokens.color.ink2,
    backgroundColor: tokens.color.bg,
  },
  markerGlyph: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  markerGlyphOnAccent: {
    color: tokens.color.onAccent,
  },
  checkBody: {
    flex: 1,
    gap: 3,
  },
  checkTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.space(2),
  },
  checkName: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  checkVerdict: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  checkVerdictNote: {
    color: tokens.color.ink2,
  },
  checkNote: {
    fontSize: 13,
    lineHeight: 19,
    color: tokens.color.muted,
  },
  checkTimestamp: {
    fontSize: 11,
    color: tokens.color.faint,
    marginTop: 1,
  },

  footer: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
  },
  tallyRow: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
  },
  tallyText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  voidNote: {
    fontSize: 12,
    lineHeight: 18,
    color: tokens.color.faint,
    marginTop: tokens.space(3),
  },
  tail: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: tokens.space(5),
  },

  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
    gap: tokens.space(3),
  },
  bandLead: {
    fontSize: 13,
    color: tokens.color.muted,
  },
  bandFeedback: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.accent,
  },

  sharePanel: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  shareRow: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
  },
  shareRowPressed: {
    backgroundColor: tokens.color.border,
  },
  shareRowText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  shareCancel: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  shareCancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.faint,
  },

  bandActions: {
    flexDirection: "row",
    gap: tokens.space(3),
  },
  primaryBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  secondaryBtn: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  btnPressed: {
    opacity: 0.8,
  },
});
