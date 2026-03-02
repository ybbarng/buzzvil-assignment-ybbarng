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
 * 문자열 내 플레이어/적 이름을 팀 색상 볼드로, 숫자를 녹색 볼드로 교체한 React 노드를 반환한다.
 * 이름이 겹치지 않는다고 가정한다.
 */
function colorizeNames(
  text: string,
  playerName: string,
  enemyName: string,
): React.ReactNode {
  const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns: { regex: RegExp; className: string }[] = [
    {
      regex: new RegExp(escapeRe(playerName), "g"),
      className: "font-bold text-accent-blue",
    },
    {
      regex: new RegExp(escapeRe(enemyName), "g"),
      className: "font-bold text-damage",
    },
    { regex: /\d+/g, className: "font-bold text-hp" },
  ];

  const segments: React.ReactNode[] = [];
  let key = 0;

  // 모든 매치를 찾아 위치순으로 정렬
  const matches: {
    start: number;
    end: number;
    text: string;
    className: string;
  }[] = [];
  for (const { regex, className } of patterns) {
    let m: RegExpExecArray | null = null;
    // biome-ignore lint/suspicious/noAssignInExpressions: regex exec loop
    while ((m = regex.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        text: m[0],
        className,
      });
    }
  }
  matches.sort((a, b) => a.start - b.start);

  // 겹치는 매치 제거 (먼저 나온 것 우선)
  const filtered: typeof matches = [];
  let lastEnd = 0;
  for (const match of matches) {
    if (match.start >= lastEnd) {
      filtered.push(match);
      lastEnd = match.end;
    }
  }

  let cursor = 0;
  for (const match of filtered) {
    if (match.start > cursor) {
      segments.push(text.slice(cursor, match.start));
    }
    segments.push(
      <span key={key++} className={match.className}>
        {match.text}
      </span>,
    );
    cursor = match.end;
  }
  if (cursor < text.length) {
    segments.push(text.slice(cursor));
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
                <span>
                  {colorizeNames(formatEvent(event), playerName, enemyName)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
