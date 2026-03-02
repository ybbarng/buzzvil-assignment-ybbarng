import type { RoundEvent, SkillEffectEvent } from "@/types/battle-event";

export interface BattleStats {
  damageDealt: number;
  /** 방어 중 받은 피해 (방어 자세 적용 후 실제 피해량) */
  damageMitigated: number;
  healingDone: number;
  skillsUsed: number;
}

/** 전투 이벤트에서 특정 캐릭터의 통계를 계산한다. */
export function computeBattleStats(
  events: RoundEvent[],
  actorName: string,
): BattleStats {
  let damageDealt = 0;
  let damageMitigated = 0;
  let healingDone = 0;
  let skillsUsed = 0;

  // 방어한 라운드 수집
  const defendedRounds = new Set<number>();
  for (const e of events) {
    if (e.type === "defend" && e.actorName === actorName) {
      defendedRounds.add(e.round);
    }
  }

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
      // 방어 중 받은 공격: value는 방어 적용 후 실제 피해량
      if (effect.skillType === "attack" && defendedRounds.has(effect.round)) {
        damageMitigated += effect.value;
      }
    }
  }

  return { damageDealt, damageMitigated, healingDone, skillsUsed };
}
