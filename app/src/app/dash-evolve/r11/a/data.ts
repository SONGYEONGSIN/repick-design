/**
 * Palisade — deterministic dummy data for the Roles & Permissions console.
 * No Math.random / Date.now anywhere. All relative timestamps are fixed strings.
 */

import type { LucideIcon } from "lucide-react";
import { Database, FolderKanban, KeyRound, Lock, Settings, Users } from "lucide-react";

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/* --------------------------------------------------------------- Brand */

export const BRAND = { name: "Palisade", tagline: "Access & Permissions Console" };

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces`;
}

export type Workspace = { id: string; name: string; plan: string };

export const WORKSPACES: Workspace[] = [
  { id: "ws-northlane", name: "Northlane Studio", plan: "Business plan" },
  { id: "ws-sandbox", name: "Sandbox", plan: "Free plan" },
];

/** Fictional persona — never real session data. */
export const CURRENT_USER = {
  name: "Mina Aldridge",
  role: "Workspace Admin",
  email: "mina.aldridge@palisade-app.io",
  avatarId: "1519085360753-af0119f7cbe7",
};

/* -------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean; badge?: string };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "overview", label: "Overview", Icon: Settings, disabled: true },
      { id: "projects", label: "Projects", Icon: FolderKanban, disabled: true },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "members", label: "Members", Icon: Users, disabled: true },
      { id: "roles", label: "Roles & Permissions", Icon: Lock, active: true },
      { id: "api", label: "API & integrations", Icon: KeyRound, disabled: true },
    ],
  },
];

/* --------------------------------------------------------- Settings tabs */

export type SettingsTab = { id: string; label: string; active?: boolean; disabled?: boolean };

export const SETTINGS_TABS: SettingsTab[] = [
  { id: "general", label: "General", disabled: true },
  { id: "members", label: "Members", disabled: true },
  { id: "roles", label: "Roles & Permissions", active: true },
  { id: "api", label: "API & integrations", disabled: true },
  { id: "billing", label: "Billing", disabled: true },
  { id: "security", label: "Security", disabled: true },
];

/* ------------------------------------------------------------- Roles */

export type RoleId = "owner" | "admin" | "editor" | "viewer" | "billing";

export type Role = { id: RoleId; label: string; description: string; locked?: boolean };

export const ROLES: Role[] = [
  { id: "owner", label: "Owner", description: "Full access to every setting. Cannot be changed.", locked: true },
  { id: "admin", label: "Admin", description: "Manages members, projects, and workspace settings." },
  { id: "editor", label: "Editor", description: "Creates and edits projects and integrations." },
  { id: "viewer", label: "Viewer", description: "Read-only access to projects and audit history." },
  { id: "billing", label: "Billing", description: "Manages payment method and cost-related exports." },
];

export const ROLE_BY_ID: Record<RoleId, Role> = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<RoleId, Role>;

/** Role columns a person can actually toggle — Owner is locked to always-allowed. */
export type EditableRoleId = Exclude<RoleId, "owner">;
export const EDITABLE_ROLES: EditableRoleId[] = ["admin", "editor", "viewer", "billing"];

/* -------------------------------------------------------- Permissions */

export type Permission = { id: string; label: string; description: string };
export type PermissionGroup = { id: string; label: string; Icon: LucideIcon; permissions: Permission[] };

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "workspace",
    label: "Workspace settings",
    Icon: Settings,
    permissions: [
      { id: "ws-edit", label: "Edit workspace settings", description: "Rename the workspace, update logo and timezone." },
      { id: "ws-billing", label: "Manage billing plan", description: "Change subscription tier and payment method." },
      { id: "ws-delete", label: "Delete workspace", description: "Permanently delete the workspace and all its data." },
    ],
  },
  {
    id: "members",
    label: "Members",
    Icon: Users,
    permissions: [
      { id: "mem-invite", label: "Invite members", description: "Send invitations to join this workspace." },
      { id: "mem-role", label: "Change member role", description: "Promote or demote another member's role." },
      { id: "mem-remove", label: "Remove members", description: "Remove a member from the workspace." },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    Icon: FolderKanban,
    permissions: [
      { id: "proj-create", label: "Create project", description: "Start a new project inside the workspace." },
      { id: "proj-archive", label: "Archive project", description: "Move a project out of the active list." },
      { id: "proj-delete", label: "Delete project", description: "Permanently delete a project and its history." },
    ],
  },
  {
    id: "api",
    label: "API & integrations",
    Icon: KeyRound,
    permissions: [
      { id: "api-create", label: "Create API key", description: "Generate a new API key for programmatic access." },
      { id: "api-revoke", label: "Revoke API key", description: "Immediately invalidate an existing API key." },
      { id: "api-webhook", label: "Manage webhooks", description: "Add, edit, or remove outgoing webhooks." },
      { id: "api-install", label: "Install integrations", description: "Connect third-party apps from the marketplace." },
    ],
  },
  {
    id: "data",
    label: "Data",
    Icon: Database,
    permissions: [
      { id: "data-export", label: "Export data", description: "Download workspace data as CSV or JSON." },
      { id: "data-import", label: "Import data", description: "Bulk-upload records from an external file." },
      { id: "data-delete", label: "Delete records", description: "Permanently delete individual data records." },
    ],
  },
  {
    id: "security",
    label: "Security",
    Icon: Lock,
    permissions: [
      { id: "sec-sso", label: "Manage SSO settings", description: "Configure the single sign-on provider and domains." },
      { id: "sec-2fa", label: "Enforce 2FA requirement", description: "Require two-factor authentication workspace-wide." },
      { id: "sec-audit", label: "View audit log", description: "See a full history of permission and security changes." },
    ],
  },
];

export const ALL_PERMISSIONS: Permission[] = PERMISSION_GROUPS.flatMap((g) => g.permissions);
export const PERMISSION_BY_ID: Record<string, Permission> = Object.fromEntries(ALL_PERMISSIONS.map((p) => [p.id, p]));

/* ------------------------------------------------------- Default matrix */

/** permissionId -> editable-role-id -> allowed. Owner is always allowed and is not stored here. */
export type MatrixState = Record<string, Record<EditableRoleId, boolean>>;

const M: Record<string, [boolean, boolean, boolean, boolean]> = {
  // [admin, editor, viewer, billing]
  "ws-edit": [true, false, false, false],
  "ws-billing": [true, false, false, true],
  "ws-delete": [false, false, false, false],
  "mem-invite": [true, true, false, false],
  "mem-role": [true, false, false, false],
  "mem-remove": [true, false, false, false],
  "proj-create": [true, true, false, false],
  "proj-archive": [true, true, false, false],
  "proj-delete": [true, false, false, false],
  "api-create": [true, true, false, false],
  "api-revoke": [true, false, false, false],
  "api-webhook": [true, true, false, false],
  "api-install": [true, true, false, false],
  "data-export": [true, true, false, true],
  "data-import": [true, false, false, false],
  "data-delete": [true, false, false, false],
  "sec-sso": [true, false, false, false],
  "sec-2fa": [true, false, false, false],
  "sec-audit": [true, true, true, false],
};

export const DEFAULT_MATRIX: MatrixState = Object.fromEntries(
  Object.entries(M).map(([permId, [admin, editor, viewer, billing]]) => [permId, { admin, editor, viewer, billing } satisfies Record<EditableRoleId, boolean>]),
);

/* -------------------------------------------------------------- Audit log */

export type AuditAction = "granted" | "revoked" | "info";

export type AuditEntry = {
  id: string;
  actorName: string;
  actorAvatarId?: string;
  actorInitials: string;
  roleId: RoleId;
  permissionLabel: string;
  action: AuditAction;
  timeLabel: string;
};

/** Reverse-chronological seed log — fixed relative-time strings, no Date.now(). */
export const INITIAL_AUDIT_LOG: AuditEntry[] = [
  {
    id: "a-01",
    actorName: "Owen Castillo",
    actorAvatarId: "1633332755192-727a05c4013d",
    actorInitials: "OC",
    roleId: "admin",
    permissionLabel: "Delete workspace",
    action: "revoked",
    timeLabel: "2h ago",
  },
  {
    id: "a-02",
    actorName: "Priya Nakamura",
    actorAvatarId: "1489987707025-afc232f7ea0f",
    actorInitials: "PN",
    roleId: "editor",
    permissionLabel: "Manage webhooks",
    action: "granted",
    timeLabel: "5h ago",
  },
  {
    id: "a-03",
    actorName: "Owen Castillo",
    actorAvatarId: "1633332755192-727a05c4013d",
    actorInitials: "OC",
    roleId: "billing",
    permissionLabel: "Export data",
    action: "granted",
    timeLabel: "1d ago",
  },
  {
    id: "a-04",
    actorName: "Sana Farouk",
    actorInitials: "SF",
    roleId: "viewer",
    permissionLabel: "View audit log",
    action: "granted",
    timeLabel: "1d ago",
  },
  {
    id: "a-05",
    actorName: "Owen Castillo",
    actorAvatarId: "1633332755192-727a05c4013d",
    actorInitials: "OC",
    roleId: "editor",
    permissionLabel: "Remove members",
    action: "revoked",
    timeLabel: "2d ago",
  },
  {
    id: "a-06",
    actorName: "Priya Nakamura",
    actorAvatarId: "1489987707025-afc232f7ea0f",
    actorInitials: "PN",
    roleId: "admin",
    permissionLabel: "Manage SSO settings",
    action: "granted",
    timeLabel: "3d ago",
  },
  {
    id: "a-07",
    actorName: "Sana Farouk",
    actorInitials: "SF",
    roleId: "editor",
    permissionLabel: "Create API key",
    action: "granted",
    timeLabel: "4d ago",
  },
  {
    id: "a-08",
    actorName: "Owen Castillo",
    actorAvatarId: "1633332755192-727a05c4013d",
    actorInitials: "OC",
    roleId: "billing",
    permissionLabel: "Manage billing plan",
    action: "granted",
    timeLabel: "6d ago",
  },
  {
    id: "a-09",
    actorName: "Priya Nakamura",
    actorAvatarId: "1489987707025-afc232f7ea0f",
    actorInitials: "PN",
    roleId: "viewer",
    permissionLabel: "Export data",
    action: "revoked",
    timeLabel: "8d ago",
  },
  {
    id: "a-10",
    actorName: "Sana Farouk",
    actorInitials: "SF",
    roleId: "admin",
    permissionLabel: "Enforce 2FA requirement",
    action: "granted",
    timeLabel: "9d ago",
  },
];
