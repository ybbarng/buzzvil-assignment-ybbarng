import { create } from "zustand";
import { ENEMIES } from "@/constants/enemies";
import { createLogEntry } from "@/logic/battle-log";
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
  outcome: BattleOutcome | null;
  logs: BattleLogEntry[];

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
    isDefending: false,
    buffs: [],
  };
}

export const useBattleStore = create<BattleState>((set, get) => ({
  player: null,
  enemy: null,
  round: 1,
  outcome: null,
  logs: [],

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
      outcome: null,
      logs: [],
    });
  },

  executePlayerAction: (skillIndex) => {
    const state = get();
    if (!state.player || !state.enemy || state.outcome) return;

    const playerSkill = state.player.skills[skillIndex];
    if (!playerSkill) return;
    if (playerSkill.mpCost > state.player.currentMp) return;

    const round = state.round;

    // 적 AI로 스킬 결정
    const enemySkillIndex = decideEnemyAction(state.enemy);
    const enemySkill = state.enemy.skills[enemySkillIndex];
    if (!enemySkill) return;

    // 방어 상태 초기화 후, 이번 라운드 방어 선적용
    let player: BattleCharacter = {
      ...state.player,
      isDefending: playerSkill.type === "defend",
    };
    let enemy: BattleCharacter = {
      ...state.enemy,
      isDefending: enemySkill.type === "defend",
    };

    const firstMover = determineFirstMover(player, enemy);
    const roundLogs: BattleLogEntry[] = [];

    function applyAction(
      actor: BattleCharacter,
      target: BattleCharacter,
      skill: Skill,
    ) {
      const result = resolveSkillEffect(actor, target, skill);
      roundLogs.push(
        createLogEntry(round, actor, target, skill, result.user, result.target),
      );
      return result;
    }

    if (firstMover === "player") {
      const p = applyAction(player, enemy, playerSkill);
      player = p.user;
      enemy = p.target;

      const midCheck = checkBattleEnd(player, enemy, round);
      if (midCheck) {
        set({
          player,
          enemy,
          round: round + 1,
          outcome: midCheck,
          logs: [...state.logs, ...roundLogs],
        });
        return;
      }

      const e = applyAction(enemy, player, enemySkill);
      enemy = e.user;
      player = e.target;
    } else {
      const e = applyAction(enemy, player, enemySkill);
      enemy = e.user;
      player = e.target;

      const midCheck = checkBattleEnd(player, enemy, round);
      if (midCheck) {
        set({
          player,
          enemy,
          round: round + 1,
          outcome: midCheck,
          logs: [...state.logs, ...roundLogs],
        });
        return;
      }

      const p = applyAction(player, enemy, playerSkill);
      player = p.user;
      enemy = p.target;
    }

    // 라운드 종료 시 버프 틱
    player = tickBuffs(player);
    enemy = tickBuffs(enemy);

    const nextRound = round + 1;
    const endCheck = checkBattleEnd(player, enemy, nextRound);

    set({
      player,
      enemy,
      round: nextRound,
      outcome: endCheck,
      logs: [...state.logs, ...roundLogs],
    });
  },

  reset: () =>
    set({
      player: null,
      enemy: null,
      round: 1,
      outcome: null,
      logs: [],
    }),
}));
