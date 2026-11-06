import type { Metadata } from 'next';
import LandingPage from './LandingPage';

export const metadata: Metadata = {
  title: 'repick — price, condition, trust. You draw the line.',
  description:
    'Move three thresholds — max price, minimum condition grade, minimum seller trust score — and a live pictogram array of 100 sample listings recalculates which ones qualify.',
};

export default function Page() {
  return <LandingPage />;
}
