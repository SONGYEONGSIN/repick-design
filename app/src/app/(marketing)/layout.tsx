import type { Metadata } from "next";

// 📄 Landing page category — marketing site (public, /)
export const metadata: Metadata = {
  title: "RE:Pick — AI Re-Picks Secondhand, Just for You",
};

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
