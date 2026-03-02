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

interface TurnResult {
  events: RoundEvent[];
  updatedPlayer: BattleCharacter;
  updatedEnemy: BattleCharacter;
}

/**
 * 한 캐릭터의 턴을 처리한다.
 * skip-turn, skill-use, skill-effect 이벤트를 생성하고 갱신된 상태를 반환한다.
 */
function processTurn(
  currentPlayer: BattleCharacter,
  currentEnemy: BattleCharacter,
  role: "player" | "enemy",
  skill: Skill,
  round: number,
): TurnResult {
  const events: RoundEvent[] = [];
  const isPlayerTurn = role === "player";
  const actor = isPlayerTurn ? currentPlayer : currentEnemy;
  const target = isPlayerTurn ? currentEnemy : currentPlayer;

  // 행동 전 검증: 쓰러졌으면 스킵
  if (actor.currentHp <= 0) {
    events.push({
      type: "skip-turn",
      round,
      actor: role,
      actorName: actor.name,
      reason: "defeated",
      playerSnapshot: toSnapshot(currentPlayer),
      enemySnapshot: toSnapshot(currentEnemy),
    });
    return { events, updatedPlayer: currentPlayer, updatedEnemy: currentEnemy };
  }

  // 행동 전 검증: MP 부족이면 스킵
  if (skill.mpCost > actor.currentMp) {
    events.push({
      type: "skip-turn",
      round,
      actor: role,
      actorName: actor.name,
      reason: "no-mp",
      skillName: skill.name,
      playerSnapshot: toSnapshot(currentPlayer),
      enemySnapshot: toSnapshot(currentEnemy),
    });
    return { events, updatedPlayer: currentPlayer, updatedEnemy: currentEnemy };
  }

  // skill-use: MP만 차감한 중간 상태
  let updatedPlayer = currentPlayer;
  let updatedEnemy = currentEnemy;
  const mpCost = skill.mpCost;

  if (isPlayerTurn) {
    updatedPlayer = {
      ...updatedPlayer,
      currentMp: updatedPlayer.currentMp - mpCost,
    };
  } else {
    updatedEnemy = {
      ...updatedEnemy,
      currentMp: updatedEnemy.currentMp - mpCost,
    };
  }

  events.push({
    type: "skill-use",
    round,
    actor: role,
    actorName: actor.name,
    targetName: target.name,
    skillName: skill.name,
    skillType: skill.type,
    mpCost,
    playerSnapshot: toSnapshot(updatedPlayer),
    enemySnapshot: toSnapshot(updatedEnemy),
  });

  // skill-effect: 실제 효과 적용 (MP 소비는 이미 반영했으므로 mpCost=0 으로 호출)
  const skillForEffect = { ...skill, mpCost: 0 };
  const result = resolveSkillEffect(
    isPlayerTurn ? updatedPlayer : updatedEnemy,
    isPlayerTurn ? updatedEnemy : updatedPlayer,
    skillForEffect,
  );

  const actorAfter = result.user;
  const targetAfter = result.target;

  // value 계산
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

  if (isPlayerTurn) {
    updatedPlayer = actorAfter;
    updatedEnemy = targetAfter;
  } else {
    updatedPlayer = targetAfter;
    updatedEnemy = actorAfter;
  }

  events.push({
    type: "skill-effect",
    round,
    actor: role,
    actorName: actor.name,
    targetName: target.name,
    skillName: skill.name,
    skillType: skill.type,
    value,
    playerSnapshot: toSnapshot(updatedPlayer),
    enemySnapshot: toSnapshot(updatedEnemy),
  });

  return { events, updatedPlayer, updatedEnemy };
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
  let currentPlayer: BattleCharacter = {
    ...player,
    isDefending: playerSkill.type === "defend",
  };
  let currentEnemy: BattleCharacter = {
    ...enemy,
    isDefending: enemySkill.type === "defend",
  };

  // 1. defend events
  if (playerSkill.type === "defend") {
    events.push({
      type: "defend",
      round,
      actor: "player",
      actorName: currentPlayer.name,
      playerSnapshot: toSnapshot(currentPlayer),
      enemySnapshot: toSnapshot(currentEnemy),
    });
  }
  if (enemySkill.type === "defend") {
    events.push({
      type: "defend",
      round,
      actor: "enemy",
      actorName: currentEnemy.name,
      playerSnapshot: toSnapshot(currentPlayer),
      enemySnapshot: toSnapshot(currentEnemy),
    });
  }

  // 2. speed-compare
  const firstMover = determineFirstMover(currentPlayer, currentEnemy);
  const isPlayerFirst = firstMover === "player";
  const first = isPlayerFirst ? currentPlayer : currentEnemy;
  const second = isPlayerFirst ? currentEnemy : currentPlayer;

  events.push({
    type: "speed-compare",
    round,
    firstName: first.name,
    firstSpd: first.baseStats.spd,
    secondName: second.name,
    secondSpd: second.baseStats.spd,
    playerSnapshot: toSnapshot(currentPlayer),
    enemySnapshot: toSnapshot(currentEnemy),
  });

  // 3. action turns
  const turnOrder = isPlayerFirst
    ? [
        { role: "player" as const, skill: playerSkill },
        { role: "enemy" as const, skill: enemySkill },
      ]
    : [
        { role: "enemy" as const, skill: enemySkill },
        { role: "player" as const, skill: playerSkill },
      ];

  for (const turn of turnOrder) {
    if (turn.skill.type === "defend") continue;

    const turnResult = processTurn(
      currentPlayer,
      currentEnemy,
      turn.role,
      turn.skill,
      round,
    );
    events.push(...turnResult.events);
    currentPlayer = turnResult.updatedPlayer;
    currentEnemy = turnResult.updatedEnemy;
  }

  // 4. buff-expire: tickBuffs 전에 만료 예정 버프 기록
  const expiringPlayerBuffs = currentPlayer.buffs.filter(
    (b) => b.remainingTurns <= 1,
  );
  const expiringEnemyBuffs = currentEnemy.buffs.filter(
    (b) => b.remainingTurns <= 1,
  );

  currentPlayer = tickBuffs(currentPlayer);
  currentEnemy = tickBuffs(currentEnemy);

  for (const buff of expiringPlayerBuffs) {
    events.push({
      type: "buff-expire",
      round,
      targetName: currentPlayer.name,
      buffTarget: buff.target,
      wasBuff: buff.value > 0,
      playerSnapshot: toSnapshot(currentPlayer),
      enemySnapshot: toSnapshot(currentEnemy),
    });
  }
  for (const buff of expiringEnemyBuffs) {
    events.push({
      type: "buff-expire",
      round,
      targetName: currentEnemy.name,
      buffTarget: buff.target,
      wasBuff: buff.value > 0,
      playerSnapshot: toSnapshot(currentPlayer),
      enemySnapshot: toSnapshot(currentEnemy),
    });
  }

  // 5. 라운드 종료 후 전투 종료 판정
  const endCheck = checkBattleEnd(currentPlayer, currentEnemy, round + 1);
  if (endCheck) {
    events.push({
      type: "battle-end",
      round,
      outcome: endCheck,
      playerSnapshot: toSnapshot(currentPlayer),
      enemySnapshot: toSnapshot(currentEnemy),
    });
    return {
      events,
      finalPlayer: currentPlayer,
      finalEnemy: currentEnemy,
      nextRound: round + 1,
      outcome: endCheck,
    };
  }

  return {
    events,
    finalPlayer: currentPlayer,
    finalEnemy: currentEnemy,
    nextRound: round + 1,
    outcome: null,
  };
}
