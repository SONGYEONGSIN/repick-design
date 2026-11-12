import type { Metadata } from 'next';
import LandingPage from './LandingPage';

export const metadata: Metadata = {
  title: 'repick — Rank your priorities, watch the matches follow',
  description:
    'Drag Price, Condition Grade, Seller Trust and Pickup Speed into the order that matters to you, and watch the live match percent and card ranking recompute.',
};

export default function Page() {
  return <LandingPage />;
}
