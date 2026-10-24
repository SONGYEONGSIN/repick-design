// native/src/evolve/r31/a/AccountDataExportScreen.tsx
// Account Data Export — a GDPR/CCPA-style "download my data" flow.
//
// State machine (own vocabulary for this screen):
//   "drafting"  — user is picking categories / confirming delivery; may be
//                 blocked on a real precondition.
//   "compiling" — request submitted, archive is being assembled, ETA shown.
//   "packaged"  — archive is ready, a real share action is available.
// Editing the category selection or the delivery confirmation while in
// "compiling" or "packaged" snaps the screen back to "drafting" — a stale
// request is never left standing next to changed inputs.
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Share,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  EXPORT_CATEGORIES,
  ExportCategory,
  ExportCategoryId,
  ACCOUNT_EMAIL,
  computeEtaMinutes,
  formatSize,
  formatItemCount,
  PROCESSING_SIMULATION_MS,
  REQUEST_SUBMITTED_LABEL,
  EXPORT_EXPIRES_LABEL,
  ARCHIVE_FILENAME,
} from "./data";
import { ExportBand, ExportPhase } from "./ExportBand";

type Snapshot = {
  ids: ExportCategoryId[];
  labels: string[];
  totalSizeMB: number;
  etaMinutes: number;
};

export default function AccountDataExportScreen() {
  const [selectedIds, setSelectedIds] = useState<Set<ExportCategoryId>>(new Set());
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [phase, setPhase] = useState<ExportPhase>("drafting");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [cancelPending, setCancelPending] = useState(false);
  const [liveMessage, setLiveMessage] = useState(
    "Choose the data you'd like exported, then confirm your delivery email.",
  );
  const [categoriesY, setCategoriesY] = useState(0);
  const [emailY, setEmailY] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const selectedCategories: ExportCategory[] = EXPORT_CATEGORIES.filter((c) =>
    selectedIds.has(c.id),
  );
  const totalSizeMB = selectedCategories.reduce((sum, c) => sum + c.sizeMB, 0);
  const liveEtaMinutes = computeEtaMinutes(totalSizeMB);

  const canSubmit = phase === "drafting" && selectedIds.size > 0 && emailConfirmed;
  const blockedReason =
    phase === "drafting" && !canSubmit
      ? selectedIds.size === 0
        ? "Select at least one data category to include before you can request an export."
        : "Confirm your delivery email before you can request an export."
      : null;

  function retractIfSubmitted(changedWhat: string) {
    if (phase !== "drafting") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setPhase("drafting");
      setSnapshot(null);
      setCancelPending(false);
      setLiveMessage(
        `You changed your ${changedWhat} after requesting an export, so it needs to be requested again.`,
      );
    }
  }

  function toggleCategory(id: ExportCategoryId) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    retractIfSubmitted("category selection");
  }

  function toggleEmailConfirmed() {
    setEmailConfirmed((prev) => !prev);
    retractIfSubmitted("delivery confirmation");
  }

  function scrollToY(y: number) {
    scrollRef.current?.scrollTo({ y: Math.max(0, y - tokens.space(4)), animated: true });
  }

  function handlePressBlocked() {
    if (selectedIds.size === 0) {
      scrollToY(categoriesY);
    } else if (!emailConfirmed) {
      scrollToY(emailY);
    }
  }

  function handleSubmit() {
    const next: Snapshot = {
      ids: Array.from(selectedIds),
      labels: selectedCategories.map((c) => c.label),
      totalSizeMB,
      etaMinutes: liveEtaMinutes,
    };
    setSnapshot(next);
    setPhase("compiling");
    setCancelPending(false);
    setLiveMessage(
      `Export requested — compiling ${next.labels.length} categor${
        next.labels.length === 1 ? "y" : "ies"
      } (${formatSize(next.totalSizeMB)}), about ${next.etaMinutes} min remaining.`,
    );
    timeoutRef.current = setTimeout(() => {
      setPhase("packaged");
      setLiveMessage(
        `Your export is ready — ${formatSize(next.totalSizeMB)} packaged as ${ARCHIVE_FILENAME}.`,
      );
    }, PROCESSING_SIMULATION_MS);
  }

  async function handleShare() {
    try {
      await Share.share({
        title: "repick account data export",
        message: `Your repick account export (${ARCHIVE_FILENAME}) is ready. The link expires ${EXPORT_EXPIRES_LABEL}: https://repick.example/exports/2026-10-06`,
      });
    } catch {
      // Share sheet dismissed or unavailable on this device — nothing else to do.
    }
  }

  function handleRequestCancel() {
    setCancelPending(true);
    setLiveMessage(
      phase === "packaged"
        ? "Discard this export? You'll need to request a new one. This can't be undone."
        : "Cancel this export request? This can't be undone.",
    );
  }

  function handleKeepRequest() {
    setCancelPending(false);
    setLiveMessage(
      phase === "packaged"
        ? `Kept your export — ${ARCHIVE_FILENAME} is still available to share.`
        : `Kept your request — still compiling, about ${snapshot?.etaMinutes ?? liveEtaMinutes} min remaining.`,
    );
  }

  function handleConfirmCancel() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const wasPackaged = phase === "packaged";
    setPhase("drafting");
    setSnapshot(null);
    setCancelPending(false);
    setLiveMessage(
      wasPackaged
        ? "Export discarded. Update your selection and request again when you're ready."
        : "Export request canceled. Update your selection and request again when you're ready.",
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text accessibilityRole="header" style={styles.title}>
            Export Account Data
          </Text>
          <Text style={styles.subtitle}>
            Download a copy of what repick stores for your account — your listings,
            order history, messages, and photos.
          </Text>

          <View style={styles.liveRegion} accessibilityLiveRegion="polite">
            <Text accessibilityRole="alert" style={styles.liveText}>
              {liveMessage}
            </Text>
          </View>

          {phase !== "drafting" && snapshot ? (
            <View style={styles.statusCard}>
              <View style={styles.statusHeaderRow}>
                <View
                  style={[
                    styles.phaseChip,
                    phase === "packaged" ? styles.phaseChipReady : styles.phaseChipCompiling,
                  ]}
                >
                  <Text
                    style={[
                      styles.phaseChipText,
                      phase === "packaged"
                        ? styles.phaseChipTextReady
                        : styles.phaseChipTextCompiling,
                    ]}
                  >
                    {phase === "packaged" ? "Ready" : "Compiling"}
                  </Text>
                </View>
                <Text style={styles.statusMeta}>Requested {REQUEST_SUBMITTED_LABEL}</Text>
              </View>

              <Text style={styles.statusLine}>
                {snapshot.labels.join(", ")} · {formatSize(snapshot.totalSizeMB)}
              </Text>

              {phase === "compiling" ? (
                <Text style={styles.statusLine}>
                  Estimated ready in about {snapshot.etaMinutes} min
                </Text>
              ) : (
                <Text style={styles.statusLine}>
                  {ARCHIVE_FILENAME} · link active until {EXPORT_EXPIRES_LABEL}
                </Text>
              )}

              {cancelPending ? (
                <View style={styles.confirmRow}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.confirmButton,
                      styles.keepButton,
                      pressed && styles.confirmButtonPressed,
                    ]}
                    onPress={handleKeepRequest}
                    accessibilityRole="button"
                    accessibilityLabel={phase === "packaged" ? "Keep export" : "Keep request"}
                    hitSlop={6}
                  >
                    <Text style={styles.keepButtonText}>
                      {phase === "packaged" ? "Keep Export" : "Keep Request"}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.confirmButton,
                      styles.destroyButton,
                      pressed && styles.confirmButtonPressed,
                    ]}
                    onPress={handleConfirmCancel}
                    accessibilityRole="button"
                    accessibilityLabel={phase === "packaged" ? "Confirm discard export" : "Confirm cancel export"}
                    hitSlop={6}
                  >
                    <Text style={styles.destroyButtonText}>
                      {phase === "packaged" ? "Discard Export" : "Cancel Export"}
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [styles.textButton, pressed && styles.textButtonPressed]}
                  onPress={handleRequestCancel}
                  accessibilityRole="button"
                  accessibilityLabel={phase === "packaged" ? "Discard export" : "Cancel request"}
                  hitSlop={8}
                >
                  <Text style={styles.textButtonLabel}>
                    {phase === "packaged" ? "Discard Export" : "Cancel Request"}
                  </Text>
                </Pressable>
              )}
            </View>
          ) : null}

          <View
            style={styles.section}
            onLayout={(e) => setCategoriesY(e.nativeEvent.layout.y)}
          >
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              What to include
            </Text>
            <Text style={styles.sectionHint}>Choose at least one category to export.</Text>

            {EXPORT_CATEGORIES.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                selected={selectedIds.has(category.id)}
                onToggle={() => toggleCategory(category.id)}
              />
            ))}

            <Text style={styles.totalLine}>
              {selectedIds.size} selected · {formatSize(totalSizeMB)} total
            </Text>
          </View>

          <View style={styles.section} onLayout={(e) => setEmailY(e.nativeEvent.layout.y)}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              Delivery
            </Text>
            <Text style={styles.sectionHint}>
              We'll email a download link to this address once your export is ready.
            </Text>

            <Pressable
              style={({ pressed }) => [styles.emailRow, pressed && styles.emailRowPressed]}
              onPress={toggleEmailConfirmed}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: emailConfirmed }}
              accessibilityLabel={`Send export to ${ACCOUNT_EMAIL}`}
              hitSlop={4}
            >
              <View style={[styles.checkbox, emailConfirmed && styles.checkboxChecked]}>
                {emailConfirmed ? <View style={styles.checkboxDot} /> : null}
              </View>
              <View style={styles.emailTextWrap}>
                <Text style={styles.emailAddress}>{ACCOUNT_EMAIL}</Text>
                <Text style={styles.emailHint}>
                  Confirm this is where you want the export sent
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Exports are packaged as a single .zip file. Download links stay active for 7
              days after the export finishes compiling.
            </Text>
          </View>
        </ScrollView>

        <ExportBand
          phase={phase}
          canSubmit={canSubmit}
          blockedReason={blockedReason}
          etaMinutes={snapshot?.etaMinutes ?? liveEtaMinutes}
          onPressBlocked={handlePressBlocked}
          onSubmit={handleSubmit}
          onShare={handleShare}
        />
      </View>
    </SafeAreaView>
  );
}

function CategoryRow({
  category,
  selected,
  onToggle,
}: {
  category: ExportCategory;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.categoryRow, pressed && styles.categoryRowPressed]}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${category.label}, ${formatItemCount(category.itemCount)} items, ${formatSize(category.sizeMB)}`}
      hitSlop={4}
    >
      <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
        {selected ? <View style={styles.checkboxDot} /> : null}
      </View>
      <View style={styles.categoryTextWrap}>
        <Text style={styles.categoryLabel}>{category.label}</Text>
        <Text style={styles.categoryDescription}>{category.description}</Text>
        <Text style={styles.categoryMeta}>
          {formatItemCount(category.itemCount)} items · {formatSize(category.sizeMB)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  root: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  scrollContent: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(2),
    fontSize: 14,
    color: tokens.color.muted,
    lineHeight: 20,
  },
  liveRegion: {
    marginTop: tokens.space(4),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accentBg,
    paddingHorizontal: tokens.space(3),
    paddingVertical: tokens.space(3),
  },
  liveText: {
    fontSize: 13,
    color: tokens.color.ink2,
    lineHeight: 18,
  },
  statusCard: {
    marginTop: tokens.space(4),
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    gap: tokens.space(2),
  },
  statusHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phaseChip: {
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
  },
  phaseChipCompiling: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.accent,
  },
  phaseChipReady: {
    backgroundColor: tokens.color.successBg,
    borderColor: tokens.color.successBorder,
  },
  phaseChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  phaseChipTextCompiling: {
    color: tokens.color.accent,
  },
  phaseChipTextReady: {
    color: tokens.color.success,
  },
  statusMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  statusLine: {
    fontSize: 14,
    color: tokens.color.ink2,
  },
  textButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
    marginTop: tokens.space(1),
  },
  textButtonPressed: {
    opacity: 0.6,
  },
  textButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.danger,
  },
  confirmRow: {
    flexDirection: "row",
    gap: tokens.space(2),
    marginTop: tokens.space(1),
  },
  confirmButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(2),
    borderWidth: 1,
  },
  confirmButtonPressed: {
    opacity: 0.85,
  },
  keepButton: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
  },
  keepButtonText: {
    color: tokens.color.ink2,
    fontSize: 13,
    fontWeight: "600",
  },
  destroyButton: {
    backgroundColor: tokens.color.dangerBg,
    borderColor: tokens.color.dangerBorder,
  },
  destroyButtonText: {
    color: tokens.color.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    marginTop: tokens.space(6),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  sectionHint: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(3),
    paddingVertical: tokens.space(3),
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border,
    minHeight: 44,
  },
  categoryRowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  categoryTextWrap: {
    flex: 1,
    gap: 2,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  categoryDescription: {
    fontSize: 13,
    color: tokens.color.muted,
    lineHeight: 18,
  },
  categoryMeta: {
    fontSize: 12,
    color: tokens.color.faint,
    marginTop: 2,
  },
  totalLine: {
    marginTop: tokens.space(2),
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.ink2,
    textAlign: "right",
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(3),
    paddingVertical: tokens.space(3),
    minHeight: 44,
  },
  emailRowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  emailTextWrap: {
    flex: 1,
  },
  emailAddress: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  emailHint: {
    marginTop: 2,
    fontSize: 12,
    color: tokens.color.faint,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: tokens.radius.sm,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accent,
  },
  checkboxDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: tokens.color.onAccent,
  },
  infoCard: {
    marginTop: tokens.space(6),
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    padding: tokens.space(3),
  },
  infoText: {
    fontSize: 12,
    color: tokens.color.faint,
    lineHeight: 17,
  },
});
