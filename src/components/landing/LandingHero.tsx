'use client';

import { SignInButton } from '@clerk/nextjs';
import { ArrowRight, Upload } from 'lucide-react';

export function LandingHero() {
  return (
    <section className="pt-8 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main content - two column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text + Upload */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-[1.1] tracking-tight text-white">
              One ad in.
              <br />
              <span className="text-white/40">Dozens out.</span>
            </h1>

            <p className="text-lg text-white/50 mb-8 max-w-md">
              Drop your best-performing ad. Get back variations ready for A/B testing across every platform.
            </p>

            {/* Compact upload area */}
            <div className="max-w-md">
              <SignInButton mode="modal">
                <button className="group w-full border border-white/10 hover:border-white/30 rounded-xl p-5 text-left transition-all hover:bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <Upload className="w-5 h-5 text-white/40 group-hover:text-white/60" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white/90 mb-0.5">Upload your image</p>
                      <p className="text-sm text-white/40">PNG, JPG, WebP</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                  </div>
                </button>
              </SignInButton>

              {/* See how it works - video CTA */}
              <button
                onClick={() => {
                  // TODO: Open video modal when video is ready
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-4 w-full flex items-center justify-center gap-3 text-sm text-white/50 hover:text-white/70 transition-colors group"
              >
                {/* Video thumbnail frame */}
                <div className="relative w-12 h-8 rounded bg-white/5 border border-white/10 overflow-hidden group-hover:border-white/20 transition-colors">
                  {/* Placeholder gradient - replace with actual video thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
                  {/* Play icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-white/80 border-b-[3px] border-b-transparent ml-0.5" />
                    </div>
                  </div>
                </div>
                <span>See how it works</span>
              </button>
            </div>
          </div>

          {/* Right: Product preview - showing transformation */}
          <div className="relative">
            {/* Before/After visualization */}
            <div className="relative">
              {/* "Before" - Original ad */}
              <div className="absolute -left-4 top-8 w-32 sm:w-40 z-10">
                <div className="bg-white/5 border border-white/10 rounded-lg p-2">
                  <div className="aspect-[4/5] bg-gradient-to-br from-white/10 to-white/5 rounded flex items-center justify-center">
                    <span className="text-xs text-white/30 font-medium">Original</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/30 mt-2 text-center uppercase tracking-wide">Input</p>
              </div>

              {/* Arrow */}
              <div className="absolute left-28 sm:left-36 top-1/2 -translate-y-1/2 z-20">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white/40" />
                </div>
              </div>

              {/* "After" - Generated variations */}
              <div className="ml-auto w-64 sm:w-72">
                <div className="grid grid-cols-2 gap-2">
                  {['Morning Light', 'Urban', 'Minimal', 'Lifestyle'].map((label, i) => (
                    <div key={label} className="bg-white/5 border border-white/10 rounded-lg p-1.5">
                      <div className={`aspect-[4/5] rounded flex items-center justify-center ${
                        i === 0 ? 'bg-amber-500/10' :
                        i === 1 ? 'bg-blue-500/10' :
                        i === 2 ? 'bg-white/10' :
                        'bg-emerald-500/10'
                      }`}>
                        <span className="text-[10px] text-white/40 font-medium">{label}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-white/30 mt-2 text-center uppercase tracking-wide">Output</p>
              </div>
            </div>

            {/* Size badges below */}
            <div className="flex items-center justify-end gap-2 mt-6">
              {['1:1', '9:16', '16:9', '4:5'].map((size) => (
                <span key={size} className="px-2 py-1 text-[10px] text-white/30 bg-white/5 rounded">
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
