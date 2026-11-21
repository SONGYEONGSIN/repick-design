import type { Metadata } from 'next';
import LandingPage from './LandingPage';

export const metadata: Metadata = {
  title: 'Repick — Sneakers resale, priced against real comparable sales',
  description:
    'Drag a price range to recompute a live box-and-whisker distribution of sold Sneakers by condition grade, with your listing marked against it.',
};

export default function Page() {
  return <LandingPage />;
}
