import type { Metadata } from 'next';
import LandingPage from './LandingPage';

export const metadata: Metadata = {
  title: 'repick — Weight your match, watch the score answer',
  description:
    'Move any of five priorities on the Priority Orbit and watch the composite match score, and the real listing it is scored against, recompute live.',
};

export default function Page() {
  return <LandingPage />;
}
