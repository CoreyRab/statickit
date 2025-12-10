'use client';

import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.name}
        </span>
      </div>
      <div className="flex gap-1">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              step.id < currentStep
                ? 'bg-primary'
                : step.id === currentStep
                ? 'bg-primary'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
