# Candidate A — Palisade (Access & Permissions Console)

**Product**: Palisade — a fictional devtools/collaboration SaaS. Route: `/dash-evolve/r11/a`.

**Archetype**: Access & Permissions Console. Inside the mandatory app shell (left sidebar with brand lockup/workspace switcher/nav/user, top bar with ⌘K trigger + "Invite member" primary action + notifications + avatar menu, mobile drawer), the dominant screen-owning content is a real role x permission access-control grid — 5 roles (Owner, Admin, Editor, Viewer, Billing) as columns against 19 permissions grouped into 6 resource categories (Workspace settings, Members, Projects, API & integrations, Data, Security) as rows. This is a semantic `<table>` (sr-only caption, `scope="col"`/`scope="row"`, `table-fixed` + colgroup % widths on `lg:`, mobile-only `min-w` gate) with each editable cell rendered as a `role="switch"` toggle showing an always-visible "Yes"/"No" + icon (never color-only). Owner is a locked, non-interactive column (always-allowed, shown with a lock icon). A left settings sub-navigation (General/Members/Roles & Permissions [active]/API & integrations/Billing/Security) sits beside the matrix, and a fixed-width `xl:`-only right audit-log rail lists reverse-chronological permission changes with deterministic relative timestamps ("2h ago", "1d ago", …).

**Interactions implemented (5, all `'use client'`, real state, no `Math.random`/`Date.now`)**:
1. **Cell toggle** — click/Enter/Space on any editable cell flips its allowed/denied state (`aria-checked` on the switch), and prepends a new deterministic audit-log entry ("Mina Aldridge granted/revoked … — Just now") to the rail.
2. **Role column select** — clicking a role's column header (`aria-pressed`) highlights that entire column across the header and every cell, and scopes the audit rail to only that role's changes (with a "Scoped to X" chip + clear button; Owner shows a dedicated "permissions are fixed" empty state).
3. **Search/filter** — a labeled text input filters visible permission rows by substring match against real state; groups with zero matches are hidden, an `aria-live` region reports the match count, and a "no permissions match" empty state appears when nothing matches.
4. **Keyboard roving matrix navigation** — Arrow Up/Down/Left/Right move focus between interactive grid cells (ref map keyed by `permissionId:roleId`), with full native tab order and `role="switch"`/`aria-checked` as the accessible pattern.
5. **Group collapse/expand** — each of the 6 permission groups has a chevron toggle (`aria-expanded`, `transform`-only rotation, `motion-reduce` gated) that hides/shows its rows; disabled while actively searching so matches stay visible.

A ⌘K command palette (Topbar trigger + global shortcut) additionally lets you jump to a permission (sets the search filter) or a role (sets the column selection/audit scope), reusing interactions 2 and 3.

**Typography/font**: Single global `font-sans` (Pretendard, inherited from the app's root layout — no additional `next/font` imports), `tabular-nums` on all counts/stats/timestamps. Copy is English-only throughout.

**Theme**: B2B Service palette from colors.catalog — light default is pure white/zinc-50 canvas, white cards, zinc-200 hairline borders; single accent = sky-700/sky-400 (`#0369A1` family) used only for emphasis (buttons, focus rings, active/allowed states, selected column). `dark:` variants use zinc-950/900 surfaces with white/10 borders. Caption/secondary text never drops below zinc-500 (light) / zinc-400 (dark) in any state, including the mostly-"No" Viewer column and the empty/locked audit states.

**Avatars**: `next/image` used for the current user (Mina Aldridge, fictional persona/email — not real session data) in the sidebar and topbar, plus 3 distinct real Unsplash IDs for audit-log actors (`1519085360753-af0119f7cbe7`, `1633332755192-727a05c4013d`, `1489987707025-afc232f7ea0f`), all with explicit width/height and descriptive alt text.

**Duplicate-avoidance**: the dominant content is a genuine interactive access-control matrix (role columns x grouped permission rows, boolean toggle cells), not a chart/map/board/feed/tree/graph/spreadsheet/gauge/calendar/leaderboard/heatmap — none of the 27 prior archetypes used this shape. The settings-sub-nav + matrix + audit-rail composition is also structurally distinct from the master-detail, 3-pane trading-terminal, and BI-report-canvas patterns already used in this round series.

**Files**: `app/src/app/dash-evolve/r11/a/{page.tsx, PalisadeClient.tsx, Sidebar.tsx, Topbar.tsx, SettingsNav.tsx, PermissionMatrix.tsx, AuditRail.tsx, CommandPalette.tsx, data.ts, tokens.ts, ui.tsx}`.
