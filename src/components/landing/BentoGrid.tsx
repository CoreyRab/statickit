'use client';

import {
  Image,
  Maximize2,
  MessageSquare,
  Sliders,
  History,
  Download,
} from 'lucide-react';

const features = [
  {
    title: 'Scene variations',
    description: 'Same product, different environments. Coffee shop, home office, outdoor — AI places your product anywhere.',
    icon: Image,
    color: 'text-violet-400',
  },
  {
    title: 'Multi-size export',
    description: '1:1, 9:16, 16:9, 4:5 — generate every format from a single image. One click.',
    icon: Maximize2,
    color: 'text-blue-400',
  },
  {
    title: 'Natural language edits',
    description: '"Make the lighting warmer" or "add a plant". Refine any generation with plain English.',
    icon: MessageSquare,
    color: 'text-emerald-400',
  },
  {
    title: 'Creativity control',
    description: 'Dial from conservative to experimental. You decide how far the AI pushes.',
    icon: Sliders,
    color: 'text-pink-400',
  },
  {
    title: 'Version history',
    description: 'Every iteration saved. Navigate back and forth. Never lose a good version.',
    icon: History,
    color: 'text-orange-400',
  },
  {
    title: 'Bulk download',
    description: 'All variations. All sizes. One ZIP. Ready for your ad platform.',
    icon: Download,
    color: 'text-cyan-400',
  },
];

export function BentoGrid() {
  return (
    <section className="py-16 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-wide mb-8">
          What you get
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${feature.color}`} />
                  <h3 className="text-white font-medium">{feature.title}</h3>
                </div>
                <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
