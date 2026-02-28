import type { BattleCharacter, BattleLogEntry } from "@/types/battle";
import type { Skill } from "@/types/skill";

export function createLogEntry(
  round: number,
  actor: BattleCharacter,
  target: BattleCharacter,
  skill: Skill,
  actorAfter: BattleCharacter,
  targetAfter: BattleCharacter,
): BattleLogEntry {
  let value = 0;

  switch (skill.type) {
    case "attack":
      value = target.currentHp - targetAfter.currentHp;
      break;
    case "heal":
      value = actorAfter.currentHp - actor.currentHp;
      break;
    case "buff":
    case "debuff":
      value = skill.value;
      break;
  }

  return {
    round,
    actor: actor.name,
    skillName: skill.name,
    skillType: skill.type,
    value,
  };
}
