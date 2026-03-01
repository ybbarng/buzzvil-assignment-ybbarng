import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, josa } from "@/lib/utils";
import type { SettingStep } from "@/types/game";

const STEPS: { step: SettingStep; label: string }[] = [
  { step: 1, label: "영웅 생성" },
  { step: 2, label: "스킬 장착" },
  { step: 3, label: "난이도 선택" },
];

interface StepIndicatorProps {
  currentStep: SettingStep;
  onStepClick?: (step: SettingStep) => void;
}

export function StepIndicator({
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="mb-6 flex items-center justify-center gap-1">
      {STEPS.map(({ step, label }) => {
        const isCurrent = step === currentStep;
        const isCompleted = step < currentStep;
        const isFuture = step > currentStep;
        const currentLabel = STEPS[currentStep - 1].label;

        const button = (
          <button
            key={step}
            type="button"
            disabled={isCurrent || isFuture}
            onClick={() => isCompleted && onStepClick?.(step)}
            className={cn(
              "-skew-x-12 px-6 py-2 transition-all duration-300",
              isCurrent &&
                "animate-pulse-glow bg-accent-orange hover:scale-105",
              isCompleted &&
                "cursor-pointer bg-accent-blue hover:scale-105 hover:brightness-125",
              isFuture &&
                "bg-bg-tertiary hover:brightness-110 disabled:cursor-not-allowed",
            )}
          >
            <span
              className={cn(
                "skew-x-12 block text-sm tracking-wider uppercase",
                isCurrent && "text-bg-primary",
                isCompleted && "text-white",
                isFuture && "text-text-muted",
              )}
            >
              {label}
            </span>
          </button>
        );

        if (isFuture) {
          return (
            <Tooltip key={step}>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent>
                '{currentLabel}'{josa(currentLabel, "을", "를")} 먼저 완료하세요
              </TooltipContent>
            </Tooltip>
          );
        }

        return button;
      })}
    </div>
  );
}
