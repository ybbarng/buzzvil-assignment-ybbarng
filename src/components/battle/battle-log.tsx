import { useEffect, useRef } from "react";
import type { BattleLogEntry } from "@/types/battle";

interface BattleLogProps {
  logs: BattleLogEntry[];
}

export function BattleLog({ logs }: BattleLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: logs 변경 시 스크롤을 아래로 이동해야 함
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      data-testid="battle-log"
      ref={scrollRef}
      className="h-40 overflow-y-auto rounded-lg border border-border bg-bg-secondary p-3"
    >
      {logs.length === 0 ? (
        <p className="text-sm text-text-muted">전투가 시작되었습니다.</p>
      ) : (
        <div className="space-y-1">
          {logs.map((entry, i) => (
            <p
              // biome-ignore lint/suspicious/noArrayIndexKey: log entries are append-only
              key={i}
              className={`text-sm ${
                entry.actor === "player" ? "text-accent-blue" : "text-damage"
              }`}
            >
              <span className="text-text-muted text-xs">R{entry.round}</span>{" "}
              {entry.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
