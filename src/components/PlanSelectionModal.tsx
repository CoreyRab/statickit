'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type PlanKey = 'starter' | 'pro' | 'ultra';

const plans: Array<{
  key: PlanKey;
  name: string;
  price: string;
  period: string;
  description: string;
  credits: number;
  features: string[];
  popular: boolean;
}> = [
  {
    key: 'starter',
    name: 'Starter',
    price: '$19',
    period: '/month',
    description: 'For individual creators',
    credits: 30,
    features: [
      '30 iterations/month',
      'All variation types',
      'Version history',
      'Basic resize',
    ],
    popular: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For growing brands',
    credits: 300,
    features: [
      '300 iterations/month',
      'All variation types',
      'Version history',
      'AI resize to any format',
      'Priority support',
    ],
    popular: true,
  },
  {
    key: 'ultra',
    name: 'Ultra',
    price: '$99',
    period: '/month',
    description: 'For power users',
    credits: 800,
    features: [
      '800 iterations/month',
      'All variation types',
      'Version history',
      'AI resize to any format',
      'Dedicated support',
    ],
    popular: false,
  },
];

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlanSelectionModal({ isOpen, onClose }: PlanSelectionModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);

  const handleSelectPlan = async (planKey: PlanKey) => {
    setLoadingPlan(planKey);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert(data.error || 'Failed to start checkout');
        setLoadingPlan(null);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout');
      setLoadingPlan(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose your plan</DialogTitle>
          <DialogDescription>
            Select a plan to start creating ad variations
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {plans.map((plan) => (
            <Card
              key={plan.key}
              className={`relative flex flex-col ${
                plan.popular
                  ? 'border-2 border-primary bg-primary/5'
                  : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription className="text-xs">{plan.description}</CardDescription>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 pb-2">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSelectPlan(plan.key)}
                  disabled={loadingPlan !== null}
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full"
                >
                  {loadingPlan === plan.key ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Select Plan'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
