import { SKEW, SKEW_TEXT } from "@/constants/theme";
import { cn } from "@/lib/utils";

interface HpBarProps {
  current: number;
  max: number;
  type: "hp" | "mp";
}

export function HpBar({ current, max, type }: HpBarProps) {
  const percentage = Math.max(0, (current / max) * 100);
  const colorClass = type === "hp" ? "bg-hp" : "bg-mp";
  const isDanger = type === "hp" && percentage <= 30;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={cn("text-text-muted", SKEW_TEXT)}>
          {type.toUpperCase()}
        </span>
        <span className={cn("text-text-secondary", SKEW_TEXT)}>
          {current}/{max}
        </span>
      </div>
      <div
        className={cn(
          "h-2 overflow-hidden bg-bg-tertiary",
          SKEW,
          isDanger && "animate-hp-danger",
        )}
      >
        <div
          className={cn("h-full transition-all duration-300", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
