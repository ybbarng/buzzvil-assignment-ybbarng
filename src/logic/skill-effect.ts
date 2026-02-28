import type { BattleCharacter } from "@/types/battle";
import type { Skill } from "@/types/skill";
import { applyBuff } from "./buff";
import { calculateDamage } from "./damage";

interface SkillResult {
  actor: BattleCharacter;
  target: BattleCharacter;
  log: string;
}

export function resolveSkillEffect(
  skill: Skill,
  actor: BattleCharacter,
  target: BattleCharacter,
): SkillResult {
  const updatedActor = {
    ...actor,
    currentMp: actor.currentMp - skill.mpCost,
  };

  switch (skill.type) {
    case "attack": {
      const damage = calculateDamage(updatedActor, target, skill.multiplier);
      const updatedTarget = {
        ...target,
        currentHp: Math.max(0, target.currentHp - damage),
      };
      return {
        actor: updatedActor,
        target: updatedTarget,
        log: `${actor.name}의 ${skill.name}! ${target.name}에게 ${damage} 데미지`,
      };
    }
    case "defend": {
      return {
        actor: { ...updatedActor, isDefending: true },
        target,
        log: `${actor.name}이(가) 방어 태세를 취했다!`,
      };
    }
    case "heal": {
      const maxHp = actor.baseStats.hp;
      const healed = Math.min(skill.healAmount, maxHp - updatedActor.currentHp);
      return {
        actor: {
          ...updatedActor,
          currentHp: updatedActor.currentHp + healed,
        },
        target,
        log: `${actor.name}의 ${skill.name}! HP ${healed} 회복`,
      };
    }
    case "buff": {
      return {
        actor: {
          ...updatedActor,
          buffs: applyBuff(
            updatedActor.buffs,
            skill.target,
            skill.value,
            skill.duration,
            false,
          ),
        },
        target,
        log: `${actor.name}의 ${skill.name}! ${skill.target.toUpperCase()} +${skill.value} (${skill.duration}턴)`,
      };
    }
    case "debuff": {
      return {
        actor: updatedActor,
        target: {
          ...target,
          buffs: applyBuff(
            target.buffs,
            skill.target,
            skill.value,
            skill.duration,
            true,
          ),
        },
        log: `${actor.name}의 ${skill.name}! ${target.name}의 ${skill.target.toUpperCase()} -${skill.value} (${skill.duration}턴)`,
      };
    }
  }
}
