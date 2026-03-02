import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Clock,
  Flag,
  Heart,
  type LucideIcon,
  Shield,
  Sword,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { SKILL_TYPE_COLORS } from "@/constants/skills";
import { cn } from "@/lib/utils";
import { formatEvent } from "@/logic/event-formatter";
import type { RoundEvent } from "@/types/battle-event";

const EVENT_ICON: Record<RoundEvent["type"], LucideIcon> = {
  "round-start": Flag,
  defend: Shield,
  "speed-compare": Zap,
  action: Sword,
  "buff-expire": Clock,
  "battle-end": AlertTriangle,
};

function getEventIcon(event: RoundEvent): LucideIcon {
  if (event.type === "action") {
    const iconMap: Record<string, LucideIcon> = {
      attack: Sword,
      defend: Shield,
      heal: Heart,
      buff: ArrowUp,
      debuff: ArrowDown,
    };
    return iconMap[event.skillType] ?? Sword;
  }
  return EVENT_ICON[event.type];
}

function getEventColor(event: RoundEvent): string {
  if (event.type === "action") {
    return SKILL_TYPE_COLORS[event.skillType]?.text ?? "text-text-secondary";
  }

  const colorMap: Record<RoundEvent["type"], string> = {
    "round-start": "text-accent-orange",
    defend: "text-accent-blue",
    "speed-compare": "text-text-muted",
    action: "text-text-secondary",
    "buff-expire": "text-text-muted",
    "battle-end": "text-accent-orange",
  };
  return colorMap[event.type];
}

function getTextColor(event: RoundEvent): string {
  if (event.type === "action") {
    const logColors: Record<string, string> = {
      attack: "text-damage",
      defend: "text-accent-blue",
      heal: "text-hp",
      buff: "text-accent-orange",
      debuff: "text-text-muted",
    };
    return logColors[event.skillType] ?? "text-text-secondary";
  }
  if (event.type === "round-start") return "text-accent-orange";
  if (event.type === "battle-end") return "text-accent-orange";
  return "text-text-secondary";
}

interface BattleLogProps {
  events: RoundEvent[];
}

export function BattleLog({ events }: BattleLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: events.length 변화 시 스크롤 필요
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length]);

  return (
    <div
      data-testid="battle-log"
      ref={scrollRef}
      className="h-40 overflow-y-auto border-l-2 border-accent-orange bg-bg-secondary p-3"
    >
      {events.length === 0 ? (
        <p className="text-center text-sm text-text-muted">
          전투가 시작되었습니다
        </p>
      ) : (
        <ul className="space-y-1">
          {events.map((event, index) => {
            const Icon = getEventIcon(event);
            const iconColor = getEventColor(event);
            const textColor = getTextColor(event);

            if (event.type === "round-start") {
              return (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: 이벤트는 추가만 되고 순서가 변하지 않음
                  key={index}
                  className="my-2 flex items-center gap-2 text-xs text-accent-orange"
                >
                  <span className="h-px flex-1 bg-accent-orange/30" />
                  <span className="font-bold">{formatEvent(event)}</span>
                  <span className="h-px flex-1 bg-accent-orange/30" />
                </li>
              );
            }

            return (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: 이벤트는 추가만 되고 순서가 변하지 않음
                key={index}
                className={cn("flex items-center gap-1 text-sm", textColor)}
              >
                <Icon className={`size-3 shrink-0 ${iconColor}`} />
                {formatEvent(event)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
