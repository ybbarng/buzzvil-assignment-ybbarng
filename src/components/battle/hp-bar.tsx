import { useEffect, useRef, useState } from "react";
import { SKEW, SKEW_TEXT } from "@/constants/theme";
import { cn } from "@/lib/utils";

/** 잔상이 유지되는 시간 (ms) */
const TRAIL_HOLD = 400;
/** 잔상이 사라지는 애니메이션 시간 (ms) */
const TRAIL_FADE = 500;

interface HpBarProps {
  current: number;
  max: number;
  type: "hp" | "mp";
}

export function HpBar({ current, max, type }: HpBarProps) {
  const percentage = Math.max(0, (current / max) * 100);
  const colorClass = type === "hp" ? "bg-hp" : "bg-mp";
  const trailColor = type === "hp" ? "bg-damage" : "bg-accent-blue";
  const isDanger = type === "hp" && percentage <= 30;

  const [trailPct, setTrailPct] = useState(percentage);
  const prevPct = useRef(percentage);

  useEffect(() => {
    const prev = prevPct.current;
    prevPct.current = percentage;

    // 감소할 때만 잔상 표시
    if (percentage >= prev) {
      setTrailPct(percentage);
      return;
    }

    // 잔상을 이전 값으로 유지한 뒤 서서히 줄임
    setTrailPct(prev);
    const timer = setTimeout(() => {
      setTrailPct(percentage);
    }, TRAIL_HOLD);

    return () => clearTimeout(timer);
  }, [percentage]);

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
        role="progressbar"
        aria-label={type === "hp" ? "체력" : "마나"}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          "relative h-2 overflow-hidden bg-bg-tertiary",
          SKEW,
          isDanger && "animate-hp-danger",
        )}
      >
        {/* 잔상 바: 감소 시 이전 값에서 서서히 줄어듦 */}
        <div
          className={cn("absolute inset-y-0 left-0 opacity-60", trailColor)}
          style={{
            width: `${trailPct}%`,
            transition: `width ${TRAIL_FADE}ms ease-out`,
          }}
        />
        {/* 실제 바: 즉시 새 값으로 이동 */}
        <div
          className={cn(
            "relative h-full transition-all duration-300",
            colorClass,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
