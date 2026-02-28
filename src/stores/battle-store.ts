import { create } from "zustand";
import { ENEMIES } from "@/constants/enemies";
import { checkBattleEnd } from "@/logic/battle-result";
import { tickBuffs } from "@/logic/buff";
import { decideEnemyAction } from "@/logic/enemy-ai";
import { resolveSkillEffect } from "@/logic/skill-effect";
import { determineFirstMover } from "@/logic/turn";
import type { BattleCharacter, BattleLogEntry } from "@/types/battle";
import type { Stats } from "@/types/character";
import type { BattleOutcome, Difficulty } from "@/types/game";
import type { Skill } from "@/types/skill";

interface BattleState {
  player: BattleCharacter | null;
  enemy: BattleCharacter | null;
  round: number;
  logs: BattleLogEntry[];
  outcome: BattleOutcome | null;
  difficulty: Difficulty;

  initBattle: (
    name: string,
    stats: Stats,
    skills: Skill[],
    difficulty: Difficulty,
  ) => void;
  executePlayerAction: (skillIndex: number) => void;
  reset: () => void;
}

function createCharacter(
  name: string,
  stats: Stats,
  skills: Skill[],
): BattleCharacter {
  return {
    name,
    baseStats: { ...stats },
    currentHp: stats.hp,
    currentMp: stats.mp,
    skills,
    buffs: [],
    isDefending: false,
  };
}

export const useBattleStore = create<BattleState>((set, get) => ({
  player: null,
  enemy: null,
  round: 1,
  logs: [],
  outcome: null,
  difficulty: "normal",

  initBattle: (name, stats, skills, difficulty) => {
    const enemyConfig = ENEMIES[difficulty];
    set({
      player: createCharacter(name, stats, skills),
      enemy: createCharacter(
        enemyConfig.name,
        enemyConfig.stats,
        enemyConfig.skills,
      ),
      round: 1,
      logs: [],
      outcome: null,
      difficulty,
    });
  },

  executePlayerAction: (skillIndex) => {
    const state = get();
    if (!state.player || !state.enemy || state.outcome) return;

    const playerSkill = state.player.skills[skillIndex];
    if (!playerSkill) return;
    if (playerSkill.mpCost > state.player.currentMp) return;

    const round = state.round;
    const newLogs: BattleLogEntry[] = [];

    // 방어 상태 초기화
    let player = { ...state.player, isDefending: false };
    let enemy = { ...state.enemy, isDefending: false };

    const firstMover = determineFirstMover(player, enemy);

    if (firstMover === "player") {
      // 플레이어 선공
      const playerResult = resolveSkillEffect(playerSkill, player, enemy);
      player = playerResult.actor;
      enemy = playerResult.target;
      newLogs.push({ round, actor: "player", message: playerResult.log });

      // 적 HP 확인
      const midCheck = checkBattleEnd(player, enemy, round);
      if (midCheck) {
        set({
          player,
          enemy,
          logs: [...state.logs, ...newLogs],
          outcome: midCheck,
        });
        return;
      }

      // 적 행동
      const enemySkillIndex = decideEnemyAction(
        enemy,
        player,
        state.difficulty,
      );
      const enemySkill = enemy.skills[enemySkillIndex];
      const enemyResult = resolveSkillEffect(enemySkill, enemy, player);
      enemy = enemyResult.actor;
      player = enemyResult.target;
      newLogs.push({ round, actor: "enemy", message: enemyResult.log });
    } else {
      // 적 선공
      const enemySkillIndex = decideEnemyAction(
        enemy,
        player,
        state.difficulty,
      );
      const enemySkill = enemy.skills[enemySkillIndex];
      const enemyResult = resolveSkillEffect(enemySkill, enemy, player);
      enemy = enemyResult.actor;
      player = enemyResult.target;
      newLogs.push({ round, actor: "enemy", message: enemyResult.log });

      // 플레이어 HP 확인
      const midCheck = checkBattleEnd(player, enemy, round);
      if (midCheck) {
        set({
          player,
          enemy,
          logs: [...state.logs, ...newLogs],
          outcome: midCheck,
        });
        return;
      }

      // 플레이어 행동
      const playerResult = resolveSkillEffect(playerSkill, player, enemy);
      player = playerResult.actor;
      enemy = playerResult.target;
      newLogs.push({ round, actor: "player", message: playerResult.log });
    }

    // 턴 종료: 버프 틱
    player = { ...player, buffs: tickBuffs(player.buffs) };
    enemy = { ...enemy, buffs: tickBuffs(enemy.buffs) };

    const nextRound = round + 1;
    const endCheck = checkBattleEnd(player, enemy, nextRound);

    set({
      player,
      enemy,
      round: nextRound,
      logs: [...state.logs, ...newLogs],
      outcome: endCheck,
    });
  },

  reset: () =>
    set({
      player: null,
      enemy: null,
      round: 1,
      logs: [],
      outcome: null,
      difficulty: "normal",
    }),
}));
