import { cn } from "@/lib/utils";

interface HpBarProps {
  current: number;
  max: number;
  type: "hp" | "mp";
}

export function HpBar({ current, max, type }: HpBarProps) {
  const percentage = Math.max(0, (current / max) * 100);
  const colorClass = type === "hp" ? "bg-hp" : "bg-mp";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-text-muted">{type.toUpperCase()}</span>
        <span className="text-text-secondary">
          {current}/{max}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg-tertiary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            colorClass,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
