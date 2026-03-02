import type React from "react";

interface HighlightPattern {
  regex: RegExp;
  className: string;
  /** 동일 위치에서의 우선순위 (낮을수록 높음) */
  priority: number;
}

interface Match {
  start: number;
  end: number;
  text: string;
  className: string;
  priority: number;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * 하이라이트 패턴 목록을 생성한다.
 * playerName/enemyName이 바뀔 때만 새로 생성하면 되므로
 * useMemo와 함께 사용할 수 있다.
 */
export function createHighlightPatterns(
  playerName: string,
  enemyName: string,
): HighlightPattern[] {
  return [
    {
      regex: new RegExp(escapeRe(playerName), "g"),
      className: "font-bold text-accent-blue",
      priority: 0,
    },
    {
      regex: new RegExp(escapeRe(enemyName), "g"),
      className: "font-bold text-damage",
      priority: 1,
    },
    { regex: /\d+/g, className: "font-bold text-hp", priority: 2 },
  ];
}

/**
 * 문자열 내 패턴 매치를 React 노드로 하이라이트한다.
 * 겹치는 매치는 먼저 나온 것 우선, 같은 위치면 priority가 낮은 것 우선.
 */
export function colorizeNames(
  text: string,
  patterns: HighlightPattern[],
): React.ReactNode {
  const matches: Match[] = [];
  for (const { regex, className, priority } of patterns) {
    regex.lastIndex = 0;
    let m: RegExpExecArray | null = null;
    // biome-ignore lint/suspicious/noAssignInExpressions: regex exec loop
    while ((m = regex.exec(text)) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        text: m[0],
        className,
        priority,
      });
    }
  }
  matches.sort((a, b) => a.start - b.start || a.priority - b.priority);

  // 겹치는 매치 제거 (먼저 나온 것 우선)
  const filtered: Match[] = [];
  let lastEnd = 0;
  for (const match of matches) {
    if (match.start >= lastEnd) {
      filtered.push(match);
      lastEnd = match.end;
    }
  }

  const segments: React.ReactNode[] = [];
  let key = 0;
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
