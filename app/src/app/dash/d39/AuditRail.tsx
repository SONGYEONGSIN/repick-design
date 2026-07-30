import { CheckCircle2, History, MinusCircle, X } from "lucide-react";
import Image from "next/image";
import { ROLE_BY_ID, unsplashAvatar, type AuditEntry, type RoleId } from "./data";
import { BORDER, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, FOCUS_RING, cx } from "./tokens";
import { InitialsAvatar, EyebrowLabel } from "./ui";

export default function AuditRail({ entries, selectedRoleId, onClearRole }: { entries: AuditEntry[]; selectedRoleId: RoleId | null; onClearRole: () => void }) {
  const filtered = selectedRoleId ? entries.filter((e) => e.roleId === selectedRoleId) : entries;
  const role = selectedRoleId ? ROLE_BY_ID[selectedRoleId] : null;

  return (
    <aside aria-labelledby="audit-rail-heading" className={cx("hidden shrink-0 xl:block xl:w-72", "border-l pl-4", BORDER)}>
      <div className="sticky top-4 flex max-h-[calc(100dvh-6rem)] flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <History size={14} aria-hidden="true" className={TEXT_CAPTION} />
          <h2 id="audit-rail-heading" className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
            Recent changes
          </h2>
        </div>

        {role ? (
          <div className={cx("flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-xs", BORDER, "bg-zinc-50 dark:bg-white/5")}>
            <span className={TEXT_CAPTION}>
              Scoped to <span className={cx("font-semibold", TEXT_PRIMARY)}>{role.label}</span>
            </span>
            <button
              type="button"
              onClick={onClearRole}
              aria-label="Clear role filter on audit log"
              className={cx("grid h-6 w-6 place-items-center rounded-md", "hover:bg-zinc-200 dark:hover:bg-white/10", TRANSITION, FOCUS_RING)}
            >
              <X size={12} aria-hidden="true" className={TEXT_CAPTION} />
            </button>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
          {role?.locked ? (
            <p className={cx("py-6 text-center text-xs leading-relaxed", TEXT_CAPTION)}>Owner permissions are fixed and cannot be changed, so there is no change history for this role.</p>
          ) : filtered.length === 0 ? (
            <p className={cx("py-6 text-center text-xs leading-relaxed", TEXT_CAPTION)}>No recorded changes for this role yet.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {filtered.map((entry) => (
                <li key={entry.id} className="flex gap-2.5">
                  {entry.actorAvatarId ? (
                    <Image
                      src={unsplashAvatar(entry.actorAvatarId, 48)}
                      alt={`${entry.actorName} profile photo`}
                      width={24}
                      height={24}
                      className="mt-0.5 h-6 w-6 shrink-0 rounded-full border border-zinc-200 object-cover dark:border-white/10"
                    />
                  ) : (
                    <span className="mt-0.5">
                      <InitialsAvatar initials={entry.actorInitials} size={24} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={cx("text-xs leading-snug", TEXT_PRIMARY)}>
                      <span className="font-medium">{entry.actorName}</span>{" "}
                      {entry.action === "granted" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 size={11} aria-hidden="true" className="shrink-0" />
                          granted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300">
                          <MinusCircle size={11} aria-hidden="true" className="shrink-0" />
                          revoked
                        </span>
                      )}{" "}
                      <span className={cx("font-medium", TEXT_PRIMARY)}>{ROLE_BY_ID[entry.roleId].label}</span> access to &ldquo;{entry.permissionLabel}&rdquo;
                    </p>
                    <p className={cx("mt-0.5 text-[11px]", TEXT_CAPTION)}>{entry.timeLabel}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className={cx("border-t pt-2", BORDER)}>
          <EyebrowLabel>All changes are logged for compliance review</EyebrowLabel>
        </div>
      </div>
    </aside>
  );
}
