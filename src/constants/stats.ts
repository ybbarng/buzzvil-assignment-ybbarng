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

export const STAT_LABELS: Record<StatKey, { en: string; ko: string }> = {
  hp: { en: "HP", ko: "체력" },
  mp: { en: "MP", ko: "마나" },
  atk: { en: "ATK", ko: "공격" },
  def: { en: "DEF", ko: "방어" },
  spd: { en: "SPD", ko: "속도" },
};

export const STAT_COLORS: Record<
  StatKey,
  { bg: string; text: string; slider: string }
> = {
  hp: {
    bg: "bg-hp",
    text: "text-hp",
    slider: "[&_[data-slot=slider-range]]:bg-hp",
  },
  mp: {
    bg: "bg-mp",
    text: "text-mp",
    slider: "[&_[data-slot=slider-range]]:bg-mp",
  },
  atk: {
    bg: "bg-damage",
    text: "text-damage",
    slider: "[&_[data-slot=slider-range]]:bg-damage",
  },
  def: {
    bg: "bg-accent-blue",
    text: "text-accent-blue",
    slider: "[&_[data-slot=slider-range]]:bg-accent-blue",
  },
  spd: {
    bg: "bg-buff",
    text: "text-buff",
    slider: "[&_[data-slot=slider-range]]:bg-buff",
  },
};
