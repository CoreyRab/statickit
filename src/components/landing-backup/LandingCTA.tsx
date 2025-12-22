'use client';

import { SignInButton } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingCTA() {
  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Start iterating on your winners
        </h2>
        <p className="text-muted-foreground mb-8">
          Free to try. No credit card required.
        </p>

        <SignInButton mode="modal">
          <Button size="lg">
            Get started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </SignInButton>
      </div>
    </section>
  );
}
