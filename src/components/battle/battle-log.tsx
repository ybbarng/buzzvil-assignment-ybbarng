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
import type React from "react";
import { useEffect, useRef } from "react";
import { SKILL_TYPE_COLORS } from "@/constants/skills";
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

function getEventIcon(event: RoundEvent): LucideIcon {
  if (event.type === "skill-use") {
    return Zap;
  }
  if (event.type === "skill-effect") {
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

function getIconColor(event: RoundEvent): string {
  if (event.type === "skill-use" || event.type === "skill-effect") {
    return SKILL_TYPE_COLORS[event.skillType]?.text ?? "text-text-secondary";
  }

  const colorMap: Record<RoundEvent["type"], string> = {
    "round-start": "text-accent-orange",
    defend: "text-accent-blue",
    "speed-compare": "text-text-muted",
    "skill-use": "text-text-secondary",
    "skill-effect": "text-text-secondary",
    "skip-turn": "text-text-muted",
    "buff-expire": "text-text-muted",
    "battle-end": "text-accent-orange",
  };
  return colorMap[event.type];
}

/**
 * 문자열 내 플레이어/적 이름을 각각의 팀 색상 span으로 교체한 React 노드를 반환한다.
 * 이름이 겹치지 않는다고 가정한다.
 */
function colorizeNames(
  text: string,
  playerName: string,
  enemyName: string,
): React.ReactNode {
  const names = [
    { name: playerName, color: "text-accent-blue" },
    { name: enemyName, color: "text-damage" },
  ];

  const segments: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let earliest = -1;
    let matched: (typeof names)[number] | null = null;

    for (const entry of names) {
      const idx = remaining.indexOf(entry.name);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        matched = entry;
      }
    }

    if (earliest === -1 || !matched) {
      segments.push(remaining);
      break;
    }

    if (earliest > 0) {
      segments.push(remaining.slice(0, earliest));
    }
    segments.push(
      <span key={key++} className={matched.color}>
        {matched.name}
      </span>,
    );
    remaining = remaining.slice(earliest + matched.name.length);
  }

  return segments;
}

interface BattleLogProps {
  events: RoundEvent[];
  playerName: string;
  enemyName: string;
}

export function BattleLog({ events, playerName, enemyName }: BattleLogProps) {
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
            const iconColor = getIconColor(event);

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
                {colorizeNames(formatEvent(event), playerName, enemyName)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
