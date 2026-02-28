import { useEffect, useRef } from "react";
import { cn, josa } from "@/lib/utils";
import type { BattleLogEntry } from "@/types/battle";
import type { SkillType } from "@/types/skill";

function formatLogEntry(entry: BattleLogEntry): string {
  switch (entry.skillType) {
    case "attack":
      return `${entry.actor}의 ${entry.skillName}! ${entry.value} 데미지`;
    case "defend":
      return `${entry.actor}${josa(entry.actor, "이", "가")} 방어 태세`;
    case "heal":
      return `${entry.actor}의 ${entry.skillName}! HP ${entry.value} 회복`;
    case "buff":
      return `${entry.actor}의 ${entry.skillName}! 능력치 강화`;
    case "debuff":
      return `${entry.actor}의 ${entry.skillName}! 능력치 약화`;
  }
}

const SKILL_TYPE_COLORS: Record<SkillType, string> = {
  attack: "text-damage",
  defend: "text-accent-blue",
  heal: "text-hp",
  buff: "text-accent-orange",
  debuff: "text-text-muted",
};

interface BattleLogProps {
  logs: BattleLogEntry[];
}

export function BattleLog({ logs }: BattleLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: logs.length 변화 시 스크롤 필요
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs.length]);

  return (
    <div
      data-testid="battle-log"
      ref={scrollRef}
      className="h-40 overflow-y-auto rounded-lg border border-border bg-bg-secondary p-3"
    >
      {logs.length === 0 ? (
        <p className="text-center text-sm text-text-muted">
          전투가 시작되었습니다
        </p>
      ) : (
        <ul className="space-y-1">
          {logs.map((entry, index) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: 로그는 추가만 되고 순서가 변하지 않음
              key={index}
              className={cn("text-sm", SKILL_TYPE_COLORS[entry.skillType])}
            >
              <span className="mr-1 text-xs text-text-muted">
                R{entry.round}
              </span>
              {formatLogEntry(entry)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
