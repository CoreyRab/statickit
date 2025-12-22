'use client';

import { Target, Palette, Layout, Zap, DollarSign, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Smart Analysis',
    description: 'AI understands your product, audience, and selling points automatically.',
  },
  {
    icon: Palette,
    title: 'Brand Consistent',
    description: 'Maintains your brand colors, style, and visual identity across all variations.',
  },
  {
    icon: Layout,
    title: 'All Formats',
    description: 'Respects your original size and exports to Meta, Google, TikTok formats.',
  },
  {
    icon: Zap,
    title: 'Fast Generation',
    description: 'Generate variations in minutes, not days. Test more, learn faster.',
  },
  {
    icon: DollarSign,
    title: 'Cost Effective',
    description: 'Fraction of the cost of a designer or agency for creative testing.',
  },
  {
    icon: RefreshCw,
    title: 'Iterate Fast',
    description: 'Test more creatives, find winners, scale what works.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built for performance marketers who want to test more creatives without the overhead
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
