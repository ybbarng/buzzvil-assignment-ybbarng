import { checkBattleEnd } from "@/logic/battle-result";
import { tickBuffs } from "@/logic/buff";
import { decideEnemyAction } from "@/logic/enemy-ai";
import { resolveSkillEffect } from "@/logic/skill-effect";
import { toSnapshot } from "@/logic/snapshot";
import { determineFirstMover } from "@/logic/turn";
import type { BattleCharacter } from "@/types/battle";
import type { RoundEvent } from "@/types/battle-event";
import type { BattleOutcome, Difficulty } from "@/types/game";
import type { Skill } from "@/types/skill";

export interface RoundResult {
  events: RoundEvent[];
  finalPlayer: BattleCharacter;
  finalEnemy: BattleCharacter;
  nextRound: number;
  outcome: BattleOutcome | null;
}

export function generateRoundEvents(
  player: BattleCharacter,
  enemy: BattleCharacter,
  round: number,
  playerSkill: Skill,
  difficulty: Difficulty,
): RoundResult {
  const events: RoundEvent[] = [];
  const enemySkillIndex = decideEnemyAction(enemy, difficulty);
  const enemySkill = enemy.skills[enemySkillIndex];
  if (!enemySkill) {
    return {
      events,
      finalPlayer: player,
      finalEnemy: enemy,
      nextRound: round,
      outcome: null,
    };
  }

  // 방어 상태 초기화 후, 이번 라운드 방어 선적용
  let p: BattleCharacter = {
    ...player,
    isDefending: playerSkill.type === "defend",
  };
  let e: BattleCharacter = {
    ...enemy,
    isDefending: enemySkill.type === "defend",
  };

  // 1. defend events
  if (playerSkill.type === "defend") {
    events.push({
      type: "defend",
      round,
      actor: "player",
      actorName: p.name,
      playerSnapshot: toSnapshot(p),
      enemySnapshot: toSnapshot(e),
    });
  }
  if (enemySkill.type === "defend") {
    events.push({
      type: "defend",
      round,
      actor: "enemy",
      actorName: e.name,
      playerSnapshot: toSnapshot(p),
      enemySnapshot: toSnapshot(e),
    });
  }

  // 2. speed-compare
  const firstMover = determineFirstMover(p, e);
  const [firstName, firstSpd, secondName, secondSpd] =
    firstMover === "player"
      ? [p.name, p.baseStats.spd, e.name, e.baseStats.spd]
      : [e.name, e.baseStats.spd, p.name, p.baseStats.spd];

  events.push({
    type: "speed-compare",
    round,
    firstName,
    firstSpd,
    secondName,
    secondSpd,
    playerSnapshot: toSnapshot(p),
    enemySnapshot: toSnapshot(e),
  });

  // 3. action turns
  const turnOrder =
    firstMover === "player"
      ? [
          { role: "player" as const, skill: playerSkill },
          { role: "enemy" as const, skill: enemySkill },
        ]
      : [
          { role: "enemy" as const, skill: enemySkill },
          { role: "player" as const, skill: playerSkill },
        ];

  for (const turn of turnOrder) {
    // defend 선택자는 skill 이벤트 스킵
    if (turn.skill.type === "defend") continue;

    const isPlayerTurn = turn.role === "player";
    const actor = isPlayerTurn ? p : e;
    const target = isPlayerTurn ? e : p;

    // 행동 전 검증: 쓰러졌거나 MP 부족이면 스킵
    if (actor.currentHp <= 0) {
      events.push({
        type: "skip-turn",
        round,
        actor: turn.role,
        actorName: actor.name,
        reason: "defeated",
        playerSnapshot: toSnapshot(p),
        enemySnapshot: toSnapshot(e),
      });
      continue;
    }
    if (turn.skill.mpCost > actor.currentMp) {
      events.push({
        type: "skip-turn",
        round,
        actor: turn.role,
        actorName: actor.name,
        reason: "no-mp",
        skillName: turn.skill.name,
        playerSnapshot: toSnapshot(p),
        enemySnapshot: toSnapshot(e),
      });
      continue;
    }

    // skill-use: MP만 차감한 중간 스냅샷
    const mpCost = turn.skill.mpCost;
    if (isPlayerTurn) {
      p = { ...p, currentMp: p.currentMp - mpCost };
    } else {
      e = { ...e, currentMp: e.currentMp - mpCost };
    }

    events.push({
      type: "skill-use",
      round,
      actor: turn.role,
      actorName: actor.name,
      targetName: target.name,
      skillName: turn.skill.name,
      skillType: turn.skill.type,
      mpCost,
      playerSnapshot: toSnapshot(p),
      enemySnapshot: toSnapshot(e),
    });

    // skill-effect: 실제 효과 적용 (MP 소비는 이미 반영했으므로 mpCost=0 으로 호출)
    const skillForEffect = { ...turn.skill, mpCost: 0 };
    const result = resolveSkillEffect(
      isPlayerTurn ? p : e,
      isPlayerTurn ? e : p,
      skillForEffect,
    );

    // resolveSkillEffect(actor, target)이므로 result.user=actor, result.target=target
    const actorAfter = result.user;
    const targetAfter = result.target;

    // value 계산
    let value = 0;
    switch (turn.skill.type) {
      case "attack":
        value = target.currentHp - targetAfter.currentHp;
        break;
      case "heal":
        value = actorAfter.currentHp - actor.currentHp;
        break;
      case "buff":
      case "debuff":
        value = turn.skill.value;
        break;
    }

    if (isPlayerTurn) {
      p = actorAfter;
      e = targetAfter;
    } else {
      p = targetAfter;
      e = actorAfter;
    }

    events.push({
      type: "skill-effect",
      round,
      actor: turn.role,
      actorName: actor.name,
      targetName: target.name,
      skillName: turn.skill.name,
      skillType: turn.skill.type,
      value,
      playerSnapshot: toSnapshot(p),
      enemySnapshot: toSnapshot(e),
    });
  }

  // 4. buff-expire: tickBuffs 전에 만료 예정 버프 기록
  const expiringPlayerBuffs = p.buffs.filter((b) => b.remainingTurns <= 1);
  const expiringEnemyBuffs = e.buffs.filter((b) => b.remainingTurns <= 1);

  p = tickBuffs(p);
  e = tickBuffs(e);

  for (const buff of expiringPlayerBuffs) {
    events.push({
      type: "buff-expire",
      round,
      targetName: p.name,
      buffTarget: buff.target,
      wasBuff: buff.value > 0,
      playerSnapshot: toSnapshot(p),
      enemySnapshot: toSnapshot(e),
    });
  }
  for (const buff of expiringEnemyBuffs) {
    events.push({
      type: "buff-expire",
      round,
      targetName: e.name,
      buffTarget: buff.target,
      wasBuff: buff.value > 0,
      playerSnapshot: toSnapshot(p),
      enemySnapshot: toSnapshot(e),
    });
  }

  // 5. 라운드 종료 후 전투 종료 판정
  const endCheck = checkBattleEnd(p, e, round + 1);
  if (endCheck) {
    events.push({
      type: "battle-end",
      round,
      outcome: endCheck,
      playerSnapshot: toSnapshot(p),
      enemySnapshot: toSnapshot(e),
    });
    return {
      events,
      finalPlayer: p,
      finalEnemy: e,
      nextRound: round + 1,
      outcome: endCheck,
    };
  }

  return {
    events,
    finalPlayer: p,
    finalEnemy: e,
    nextRound: round + 1,
    outcome: null,
  };
}
