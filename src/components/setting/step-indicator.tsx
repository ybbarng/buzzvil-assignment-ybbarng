import { cn } from "@/lib/utils";
import type { SettingStep } from "@/types/game";

const STEPS: { step: SettingStep; label: string }[] = [
  { step: 1, label: "이름 · 스탯" },
  { step: 2, label: "스킬" },
  { step: 3, label: "난이도" },
];

interface StepIndicatorProps {
  currentStep: SettingStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {STEPS.map(({ step, label }, index) => (
        <div key={step} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs font-bold",
                step === currentStep
                  ? "bg-accent-orange text-bg-primary"
                  : step < currentStep
                    ? "bg-accent-blue text-white"
                    : "bg-bg-tertiary text-text-muted",
              )}
            >
              {step}
            </div>
            <span
              className={cn(
                "text-sm",
                step === currentStep
                  ? "font-semibold text-accent-orange"
                  : "text-text-muted",
              )}
            >
              {label}
            </span>
          </div>
          {index < STEPS.length - 1 && <div className="h-px w-8 bg-border" />}
        </div>
      ))}
    </div>
  );
}
