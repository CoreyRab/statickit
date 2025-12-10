'use client';

import Link from 'next/link';
import { SignInButton } from '@clerk/nextjs';
import { LandingHero } from './LandingHero';
import { BentoGrid } from './BentoGrid';
import { UseCases } from './UseCases';
import { HowItWorks } from './HowItWorks';
import { LandingCTA } from './LandingCTA';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <img src="/logo.svg" alt="StaticKit" className="w-6 h-6" />
            <span>StaticKit</span>
          </div>

          <SignInButton mode="modal">
            <button className="text-sm text-white/50 hover:text-white transition-colors">
              Sign in
            </button>
          </SignInButton>
        </div>
      </header>

      {/* Main content */}
      <main>
        <LandingHero />
        <BentoGrid />
        <HowItWorks />
        <UseCases />
        <LandingCTA />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="StaticKit" className="w-5 h-5 opacity-50" />
            <span>StaticKit</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white/50 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
