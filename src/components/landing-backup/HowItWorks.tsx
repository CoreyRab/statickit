'use client';

import { Upload, Sparkles, Download, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const steps = [
  {
    number: '01',
    title: 'Upload',
    description: 'Drop your winning ad',
    details: 'Any image format. Our AI analyzes your product, brand style, and target audience automatically.',
    icon: Upload,
    isGenerate: false,
  },
  {
    number: '02',
    title: 'Generate',
    description: 'AI creates strategic iterations',
    details: 'Get iterations testing different scenes, moods, and contexts. Same product, new environments.',
    icon: Sparkles,
    isGenerate: true,
  },
  {
    number: '03',
    title: 'Export',
    description: 'Download all sizes, ready for testing',
    details: 'One-click resize for every platform. Bulk download everything. Launch your A/B tests immediately.',
    icon: Download,
    isGenerate: false,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 border-t border-border">
      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .gradient-spin {
          animation: gradient-rotate 8s linear infinite;
        }
        .pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Three steps to more creative
          </h2>
          <p className="text-muted-foreground">
            From upload to A/B-ready variations in under a minute
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.number} className="relative">
                  {/* Animated gradient border for Generate card */}
                  {step.isGenerate && (
                    <div className="absolute -inset-[1px] rounded-xl overflow-hidden">
                      {/* Rotating gradient border */}
                      <div
                        className="absolute inset-[-50%] gradient-spin"
                        style={{
                          background: 'conic-gradient(from 0deg, #3b82f6, #22c55e, #eab308, #f97316, #ec4899, #3b82f6)',
                        }}
                      />
                      {/* Inner mask to create border effect */}
                      <div className="absolute inset-[1px] rounded-xl bg-background" />
                    </div>
                  )}

                  {/* Soft glow behind */}
                  {step.isGenerate && (
                    <div
                      className="absolute -inset-4 rounded-2xl blur-2xl pulse-soft pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(34,197,94,0.15), rgba(234,179,8,0.15), rgba(249,115,22,0.15), rgba(236,72,153,0.15))',
                      }}
                    />
                  )}

                  {/* Step card */}
                  <Card className={`relative z-10 p-6 h-full ${
                    step.isGenerate
                      ? 'border-0 bg-background'
                      : ''
                  }`}>
                    {/* Step number */}
                    <div className={`text-4xl font-bold mb-3 ${
                      step.isGenerate ? 'bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent' : 'text-muted-foreground/20'
                    }`}>{step.number}</div>

                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                      step.isGenerate
                        ? 'bg-gradient-to-br from-blue-500/20 via-green-500/20 to-pink-500/20 border border-border'
                        : 'bg-muted border border-border'
                    }`}>
                      <Icon className={`w-5 h-5 ${step.isGenerate ? 'text-foreground' : 'text-muted-foreground'}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{step.description}</p>
                    <p className="text-muted-foreground/60 text-sm">{step.details}</p>
                  </Card>

                  {/* Arrow connector (hidden on mobile) */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                      <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground/60 mb-3">Works with</p>
          <p className="text-sm text-muted-foreground">
            Meta Ads · Google Display · TikTok · Pinterest · LinkedIn
          </p>
        </div>
      </div>
    </section>
  );
}
