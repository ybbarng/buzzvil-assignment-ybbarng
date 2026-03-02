import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Ban,
  Clock,
  Flag,
  Heart,
  type LucideIcon,
  Shield,
  Sword,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { SKILL_TYPE_COLORS } from "@/constants/skills";
import { colorizeNames, createHighlightPatterns } from "@/lib/colorize-names";
import { formatEvent } from "@/logic/event-formatter";
import type { RoundEvent } from "@/types/battle-event";

const EVENT_ICON: Record<RoundEvent["type"], LucideIcon> = {
  "round-start": Flag,
  defend: Shield,
  "speed-compare": Zap,
  "skill-use": Zap,
  "skill-effect": Sword,
  "skip-turn": Ban,
  "buff-expire": Clock,
  "battle-end": AlertTriangle,
};

const SKILL_EFFECT_ICON: Record<string, LucideIcon> = {
  attack: Sword,
  heal: Heart,
  buff: ArrowUp,
  debuff: ArrowDown,
};

const ICON_COLOR: Record<RoundEvent["type"], string> = {
  "round-start": "text-accent-orange",
  defend: "text-accent-blue",
  "speed-compare": "text-text-muted",
  "skill-use": "text-text-secondary",
  "skill-effect": "text-text-secondary",
  "skip-turn": "text-text-muted",
  "buff-expire": "text-text-muted",
  "battle-end": "text-accent-orange",
};

function getEventIcon(event: RoundEvent): LucideIcon {
  if (event.type === "skill-use") {
    return Zap;
  }
  if (event.type === "skill-effect") {
    return SKILL_EFFECT_ICON[event.skillType] ?? Sword;
  }
  return EVENT_ICON[event.type];
}

function getIconColor(event: RoundEvent): string {
  if (event.type === "skill-use" || event.type === "skill-effect") {
    return SKILL_TYPE_COLORS[event.skillType]?.text ?? "text-text-secondary";
  }
  return ICON_COLOR[event.type];
}

interface BattleLogProps {
  events: RoundEvent[];
  playerName: string;
  enemyName: string;
}

export function BattleLog({ events, playerName, enemyName }: BattleLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const patterns = useMemo(
    () => createHighlightPatterns(playerName, enemyName),
    [playerName, enemyName],
  );

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
      className="h-full overflow-y-auto border-l-2 border-accent-orange bg-bg-secondary p-3"
    >
      {events.length === 0 ? (
        <p className="text-center text-sm text-text-muted">
          전투가 시작되었습니다
        </p>
      ) : (
        <ul className="space-y-1">
          {events.map((event, index) => {
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

            const Icon = getEventIcon(event);
            const iconColor = getIconColor(event);

            if (event.type === "battle-end") {
              return (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: 이벤트는 추가만 되고 순서가 변하지 않음
                  key={index}
                  className="flex items-center gap-1 text-sm text-accent-orange"
                >
                  <Icon className={`size-3 shrink-0 ${iconColor}`} />
                  {formatEvent(event)}
                </li>
              );
            }

            return (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: 이벤트는 추가만 되고 순서가 변하지 않음
                key={index}
                className="flex items-center gap-1 text-sm text-white"
              >
                <Icon className={`size-3 shrink-0 ${iconColor}`} />
                <span>{colorizeNames(formatEvent(event), patterns)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
