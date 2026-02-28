import { applyBuff } from "@/logic/buff";
import { calculateDamage } from "@/logic/damage";
import type { BattleCharacter } from "@/types/battle";
import type { Skill } from "@/types/skill";

export function resolveSkillEffect(
  user: BattleCharacter,
  target: BattleCharacter,
  skill: Skill,
): { user: BattleCharacter; target: BattleCharacter } {
  switch (skill.type) {
    case "attack": {
      const damage = calculateDamage(user, target, skill.multiplier);
      return {
        user: { ...user, currentMp: user.currentMp - skill.mpCost },
        target: {
          ...target,
          currentHp: Math.max(0, target.currentHp - damage),
        },
      };
    }
    case "defend":
      return { user, target };
    case "heal": {
      const healed = Math.min(
        user.currentHp + skill.healAmount,
        user.baseStats.hp,
      );
      return {
        user: {
          ...user,
          currentHp: healed,
          currentMp: user.currentMp - skill.mpCost,
        },
        target,
      };
    }
    case "buff": {
      const buffedUser = applyBuff(
        { ...user, currentMp: user.currentMp - skill.mpCost },
        skill.target,
        skill.value,
        skill.duration,
      );
      return { user: buffedUser, target };
    }
    case "debuff": {
      const debuffedTarget = applyBuff(
        target,
        skill.target,
        -skill.value,
        skill.duration,
      );
      return {
        user: { ...user, currentMp: user.currentMp - skill.mpCost },
        target: debuffedTarget,
      };
    }
  }
}
