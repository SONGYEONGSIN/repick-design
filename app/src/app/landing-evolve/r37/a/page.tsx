import type { Metadata } from 'next';
import LandingPage from './LandingPage';

export const metadata: Metadata = {
  title: 'repick — Instant payout estimate',
  description:
    'Search any item to see a live estimated payout range, built from its most recent comparable sale, its condition grade, and three real comps.',
};

export default function Page() {
  return <LandingPage />;
}
