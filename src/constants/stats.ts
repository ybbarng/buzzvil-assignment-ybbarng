import type { StatKey, Stats } from "@/types/character";

export const STAT_KEYS: StatKey[] = ["hp", "mp", "atk", "def", "spd"];

export const TOTAL_POINTS = 200;

export const STAT_RANGES: Record<StatKey, { min: number; max: number }> = {
  hp: { min: 20, max: 100 },
  mp: { min: 20, max: 100 },
  atk: { min: 5, max: 30 },
  def: { min: 5, max: 30 },
  spd: { min: 5, max: 30 },
};

export const DEFAULT_STATS: Stats = {
  hp: 20,
  mp: 20,
  atk: 5,
  def: 5,
  spd: 5,
};

export const STAT_LABELS: Record<StatKey, string> = {
  hp: "HP",
  mp: "MP",
  atk: "ATK",
  def: "DEF",
  spd: "SPD",
};
