import { STAT_RANGES, TOTAL_POINTS } from "@/constants/stats";
import type { StatKey, Stats } from "@/types/character";

const STAT_KEYS: StatKey[] = ["hp", "mp", "atk", "def", "spd"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateRandomStats(): Stats {
  const stats = {} as Stats;
  for (const key of STAT_KEYS) {
    stats[key] = STAT_RANGES[key].min;
  }

  const minTotal = STAT_KEYS.reduce((s, k) => s + STAT_RANGES[k].min, 0);
  let remaining = TOTAL_POINTS - minTotal;

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
