import { create } from "zustand";
import { ENEMIES } from "@/constants/enemies";
import { checkBattleEnd } from "@/logic/battle-result";
import { calculateDamage } from "@/logic/damage";
import { determineFirstMover } from "@/logic/turn";
import type { BattleCharacter } from "@/types/battle";
import type { Stats } from "@/types/character";
import type { BattleOutcome, Difficulty } from "@/types/game";
import type { Skill } from "@/types/skill";

interface BattleState {
  player: BattleCharacter | null;
  enemy: BattleCharacter | null;
  round: number;
  outcome: BattleOutcome | null;

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
  };
}

function executeAttack(
  attacker: BattleCharacter,
  defender: BattleCharacter,
  skill: Skill,
): { attacker: BattleCharacter; defender: BattleCharacter } {
  if (skill.type === "defend") {
    return {
      attacker: { ...attacker, isDefending: true },
      defender,
    };
  }

  const multiplier = skill.type === "attack" ? skill.multiplier : 1.0;
  const damage = calculateDamage(attacker, defender, multiplier);
  return {
    attacker: {
      ...attacker,
      currentMp: attacker.currentMp - skill.mpCost,
    },
    defender: {
      ...defender,
      currentHp: Math.max(0, defender.currentHp - damage),
    },
  };
}

export const useBattleStore = create<BattleState>((set, get) => ({
  player: null,
  enemy: null,
  round: 1,
  outcome: null,

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
    });
  },

  executePlayerAction: (skillIndex) => {
    const state = get();
    if (!state.player || !state.enemy || state.outcome) return;

    const playerSkill = state.player.skills[skillIndex];
    if (!playerSkill) return;
    if (playerSkill.mpCost > state.player.currentMp) return;

    const round = state.round;

    // 방어 상태 초기화 후, 이번 라운드 방어 선적용
    let player: BattleCharacter = {
      ...state.player,
      isDefending: playerSkill.type === "defend",
    };
    let enemy: BattleCharacter = { ...state.enemy, isDefending: false };

    // 적은 항상 기본 공격 (index 0)
    const enemySkill = enemy.skills[0];
    if (enemySkill.type === "defend") {
      enemy = { ...enemy, isDefending: true };
    }

    const firstMover = determineFirstMover(player, enemy);

    if (firstMover === "player") {
      const p = executeAttack(player, enemy, playerSkill);
      player = p.attacker;
      enemy = p.defender;

      const midCheck = checkBattleEnd(player, enemy, round);
      if (midCheck) {
        set({ player, enemy, outcome: midCheck });
        return;
      }

      const e = executeAttack(enemy, player, enemySkill);
      enemy = e.attacker;
      player = e.defender;
    } else {
      const e = executeAttack(enemy, player, enemySkill);
      enemy = e.attacker;
      player = e.defender;

      const midCheck = checkBattleEnd(player, enemy, round);
      if (midCheck) {
        set({ player, enemy, outcome: midCheck });
        return;
      }

      const p = executeAttack(player, enemy, playerSkill);
      player = p.attacker;
      enemy = p.defender;
    }

    const nextRound = round + 1;
    const endCheck = checkBattleEnd(player, enemy, nextRound);

    set({
      player,
      enemy,
      round: nextRound,
      outcome: endCheck,
    });
  },

  reset: () =>
    set({
      player: null,
      enemy: null,
      round: 1,
      outcome: null,
    }),
}));
