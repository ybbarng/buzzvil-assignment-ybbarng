import type { RoundEvent, SkillEffectEvent } from "@/types/battle-event";

export interface BattleStats {
  damageDealt: number;
  damageReceived: number;
  healingDone: number;
  skillsUsed: number;
}

/** 전투 이벤트에서 특정 캐릭터의 통계를 계산한다. */
export function computeBattleStats(
  events: RoundEvent[],
  actorName: string,
): BattleStats {
  let damageDealt = 0;
  let damageReceived = 0;
  let healingDone = 0;
  let skillsUsed = 0;

  const effects = events.filter(
    (e): e is SkillEffectEvent => e.type === "skill-effect",
  );

  for (const effect of effects) {
    if (effect.actorName === actorName) {
      skillsUsed++;
      if (effect.skillType === "attack") {
        damageDealt += effect.value;
      } else if (effect.skillType === "heal") {
        healingDone += effect.value;
      }
    } else {
      if (effect.skillType === "attack") {
        damageReceived += effect.value;
      }
    }
  }

  return { damageDealt, damageReceived, healingDone, skillsUsed };
}
