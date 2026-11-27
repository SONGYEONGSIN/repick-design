import type { Metadata } from 'next';
import LandingPage from './LandingPage';

export const metadata: Metadata = {
  title: 'repick — Resale, mapped to your neighborhood',
  description:
    'Click any neighborhood to see live resale activity, then shop AI-matched, condition-graded, seller-verified listings near you.',
};

export default function Page() {
  return <LandingPage />;
}
