import type { BattleLogEntry } from "@/types/battle";

export interface BattleStats {
  damageDealt: number;
  damageReceived: number;
  healingDone: number;
  skillsUsed: number;
}

/** 전투 로그에서 특정 캐릭터의 통계를 계산한다. */
export function computeBattleStats(
  logs: BattleLogEntry[],
  actorName: string,
): BattleStats {
  let damageDealt = 0;
  let damageReceived = 0;
  let healingDone = 0;
  let skillsUsed = 0;

  for (const log of logs) {
    if (log.actor === actorName) {
      skillsUsed++;
      if (log.skillType === "attack") {
        damageDealt += log.value;
      } else if (log.skillType === "heal") {
        healingDone += log.value;
      }
    } else {
      if (log.skillType === "attack") {
        damageReceived += log.value;
      }
    }
  }

  return { damageDealt, damageReceived, healingDone, skillsUsed };
}
