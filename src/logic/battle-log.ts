import type { BattleCharacter, BattleLogEntry } from "@/types/battle";
import type { RoundEvent } from "@/types/battle-event";
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

/** ActionEvent + DefendEvent를 레거시 BattleLogEntry[] 형태로 변환 */
export function eventsToLegacyLogs(events: RoundEvent[]): BattleLogEntry[] {
  const result: BattleLogEntry[] = [];
  for (const e of events) {
    if (e.type === "action") {
      result.push({
        round: e.round,
        actor: e.actorName,
        skillName: e.skillName,
        skillType: e.skillType,
        value: e.value,
      });
    } else if (e.type === "defend") {
      result.push({
        round: e.round,
        actor: e.actorName,
        skillName: "방어",
        skillType: "defend",
        value: 0,
      });
    }
  }
  return result;
}
