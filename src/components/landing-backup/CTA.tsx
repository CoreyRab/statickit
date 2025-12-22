'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">
            Ready to multiply your winning ads?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Start with 5 free generations. No credit card required.
            See results in minutes.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Your Free Trial
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
