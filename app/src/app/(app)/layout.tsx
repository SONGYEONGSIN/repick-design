import type { Metadata } from "next";

// 📊 SaaS dashboard category — logged-in app (/dashboard, etc.)
// A shared app shell (sidebar + top bar) will live here so every dashboard view can reuse it.
export const metadata: Metadata = {
  title: {
    default: "Dashboard — Repick",
    template: "%s — Repick",
  },
};

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
