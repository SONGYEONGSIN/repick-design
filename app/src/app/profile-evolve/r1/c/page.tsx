import type { Metadata } from "next";
import IdentityPanel from "./identity-panel";
import PostsFeed from "./posts-feed";
import MembershipTiers from "./membership-tiers";
import SiteFooter from "./site-footer";

export const metadata: Metadata = {
  title: "Priya Anand — Signal & Noise",
  description: "Weekly essays on product analytics, instrumentation, and data-literate teams.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <IdentityPanel />
      <PostsFeed />
      <MembershipTiers />
      <SiteFooter />
    </main>
  );
}
