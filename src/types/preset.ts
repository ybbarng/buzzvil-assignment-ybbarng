import type { Stats } from "@/types/character";

export type HeroRole = "tank" | "damage" | "support";

export type TankSubRole = "initiator" | "brawler" | "anchor";
export type DamageSubRole = "specialist" | "scout" | "flanker" | "marksman";
export type SupportSubRole = "tactician" | "medic" | "survivor";

export type HeroSubRole = TankSubRole | DamageSubRole | SupportSubRole;

export interface HeroPreset {
  id: string;
  name: string;
  role: HeroRole;
  subRole: HeroSubRole;
  description: string;
  stats: Stats;
}
