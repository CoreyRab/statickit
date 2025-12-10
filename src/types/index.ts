export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  credits: number;
  plan: 'free' | 'starter' | 'pro' | 'agency';
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Ad {
  id: string;
  project_id: string;
  original_image_url: string;
  original_filename: string;
  width: number;
  height: number;
  aspect_ratio: string;
  aspect_ratio_decimal: number;
  analysis: AdAnalysis | null;
  status: 'uploaded' | 'analyzing' | 'analyzed' | 'error';
  created_at: string;
}

export interface AdAnalysis {
  product: string;
  brand_style: string;
  visual_elements: string[];
  key_selling_points: string[];
  target_audience: string;
  colors: string[];
  mood: string;
}

export interface Variation {
  id: string;
  ad_id: string;
  title: string;
  description: string;
  icon: string;
  status: 'suggested' | 'approved' | 'generating' | 'completed' | 'error';
  created_at: string;
}

export interface GeneratedImage {
  id: string;
  variation_id: string;
  image_url: string;
  width: number;
  height: number;
  aspect_ratio: string;
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'usage' | 'bonus' | 'refund';
  description: string;
  created_at: string;
}

export const ASPECT_RATIOS = {
  '1:1': { width: 1080, height: 1080, label: 'Square', platform: 'Feed' },
  '4:5': { width: 1080, height: 1350, label: 'Portrait', platform: 'Feed' },
  '9:16': { width: 1080, height: 1920, label: 'Vertical', platform: 'Story/Reels' },
  '16:9': { width: 1920, height: 1080, label: 'Landscape', platform: 'Display' },
  '1.91:1': { width: 1200, height: 628, label: 'Wide', platform: 'Link Ads' },
} as const;

export type AspectRatioKey = keyof typeof ASPECT_RATIOS;

export function detectAspectRatio(width: number, height: number): { key: AspectRatioKey | 'custom'; label: string } {
  const ratio = width / height;

  const ratios: { key: AspectRatioKey; decimal: number }[] = [
    { key: '1:1', decimal: 1 },
    { key: '4:5', decimal: 0.8 },
    { key: '9:16', decimal: 0.5625 },
    { key: '16:9', decimal: 1.778 },
    { key: '1.91:1', decimal: 1.91 },
  ];

  for (const r of ratios) {
    if (Math.abs(ratio - r.decimal) < 0.05) {
      return { key: r.key, label: `${r.key} (${ASPECT_RATIOS[r.key].platform})` };
    }
  }

  return { key: 'custom', label: `Custom (${width}x${height})` };
}
