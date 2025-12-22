'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Powered by Google Gemini AI
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Turn One Winning Ad
          <br />
          <span className="text-primary">Into Five</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Upload your best-performing static ad and let AI generate scroll-stopping
          variations in minutes. Test more creatives, find more winners.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2 px-8">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="gap-2">
            <Play className="w-4 h-4" />
            See How It Works
          </Button>
        </div>

        {/* Visual Demo */}
        <div className="relative max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl border shadow-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Original Ad */}
              <div className="flex-shrink-0">
                <div className="text-xs text-muted-foreground mb-2 font-medium">ORIGINAL</div>
                <div className="w-32 h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <span className="text-4xl">📱</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-4xl text-primary">→</div>

              {/* Variations */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { emoji: '🏃', label: 'Gym' },
                  { emoji: '✈️', label: 'Travel' },
                  { emoji: '🏠', label: 'Home' },
                  { emoji: '🌆', label: 'Urban' },
                  { emoji: '🎨', label: 'Bold' },
                ].map((variation, i) => (
                  <div key={i} className="text-center">
                    <div className="w-20 h-24 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border flex items-center justify-center mb-1 hover:scale-105 transition-transform">
                      <span className="text-2xl">{variation.emoji}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{variation.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -top-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            +34% CTR
          </div>
          <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            AI-Powered
          </div>
        </div>
      </div>
    </section>
  );
}
