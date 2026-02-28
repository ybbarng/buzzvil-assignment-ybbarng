import { STAT_KEYS, STAT_RANGES, TOTAL_POINTS } from "@/constants/stats";
import type { StatKey, Stats } from "@/types/character";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function distributeRemainingStats(currentStats: Stats): Stats {
  const stats = { ...currentStats };

  const used = STAT_KEYS.reduce((s, k) => s + stats[k], 0);
  let remaining = TOTAL_POINTS - used;

  const shuffled = shuffle(STAT_KEYS);

  for (const key of shuffled) {
    if (remaining <= 0) break;
    const room = STAT_RANGES[key].max - stats[key];
    const add = Math.floor(Math.random() * (Math.min(room, remaining) + 1));
    stats[key] += add;
    remaining -= add;
  }

  // 남은 포인트가 있으면 여유가 있는 스탯에 분배
  if (remaining > 0) {
    for (const key of shuffled) {
      if (remaining <= 0) break;
      const room = STAT_RANGES[key].max - stats[key];
      const add = Math.min(room, remaining);
      stats[key] += add;
      remaining -= add;
    }
  }

  return stats;
}

export function distributeRandomToStat(
  currentStats: Stats,
  key: StatKey,
): Stats {
  const used = STAT_KEYS.reduce((s, k) => s + currentStats[k], 0);
  const remaining = TOTAL_POINTS - used;
  const room = STAT_RANGES[key].max - currentStats[key];
  const upper = Math.min(room, remaining);

  if (upper <= 0) return currentStats;

  const add = Math.floor(Math.random() * upper) + 1;
  return { ...currentStats, [key]: currentStats[key] + add };
}

export function clearStat(currentStats: Stats, key: StatKey): Stats {
  return { ...currentStats, [key]: STAT_RANGES[key].min };
}
