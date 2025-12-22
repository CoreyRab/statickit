'use client';

import { useState } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      'Email support',
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

export function Pricing() {
  const { isSignedIn, isLoaded } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);

  const handleCheckout = async (planKey: PlanKey) => {
    if (!isSignedIn) return;

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
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-20 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Simple pricing
          </h2>
          <p className="text-muted-foreground">
            Choose the plan that fits your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {isLoaded && isSignedIn ? (
                  <Button
                    onClick={() => handleCheckout(plan.key)}
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
                      'Subscribe'
                    )}
                  </Button>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      variant={plan.popular ? 'default' : 'outline'}
                      className="w-full"
                    >
                      Get started
                    </Button>
                  </SignInButton>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          All plans include a 7-day money-back guarantee. Need more?{' '}
          <a href="mailto:hello@statickit.com" className="text-foreground hover:underline underline-offset-2">
            Contact us
          </a>{' '}
          for enterprise plans.
        </p>
      </div>
    </section>
  );
}
