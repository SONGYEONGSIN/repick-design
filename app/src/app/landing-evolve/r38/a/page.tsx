import type { Metadata } from 'next';
import LandingPage from './LandingPage';

export const metadata: Metadata = {
  title: 'repick — The verification ladder',
  description:
    'Pick a seller verification tier on a five-rung ladder and watch estimated days-to-sell, buyer reach, and service fee recompute live, all the way to the closing call to action.',
};

export default function Page() {
  return <LandingPage />;
}
