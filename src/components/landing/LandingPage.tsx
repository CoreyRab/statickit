'use client';

import { ComingSoon } from './ComingSoon';

interface LandingPageProps {
  onUpload?: (file: File) => void;
}

export function LandingPage({ onUpload }: LandingPageProps) {
  // Coming soon mode - swap back to full landing page when ready
  return <ComingSoon />;
}
