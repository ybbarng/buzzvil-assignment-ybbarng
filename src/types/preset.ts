import type { Stats } from "@/types/character";

export type HeroRole = "tank" | "damage" | "support";

export interface HeroPreset {
  id: string;
  name: string;
  role: HeroRole;
  description: string;
  stats: Stats;
}
