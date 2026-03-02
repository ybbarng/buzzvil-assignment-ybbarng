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

/** ActionEvent만 필터링하여 레거시 BattleLogEntry[] 형태로 변환 */
export function eventsToLegacyLogs(events: RoundEvent[]): BattleLogEntry[] {
  return events
    .filter((e) => e.type === "action")
    .map((e) => ({
      round: e.round,
      actor: e.actorName,
      skillName: e.skillName,
      skillType: e.skillType,
      value: e.value,
    }));
}
