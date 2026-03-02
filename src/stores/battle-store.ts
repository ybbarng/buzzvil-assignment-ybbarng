import { create } from "zustand";
import { ENEMIES } from "@/constants/enemies";
import { eventsToLegacyLogs } from "@/logic/battle-log";
import { generateRoundEvents } from "@/logic/round-events";
import { toSnapshot } from "@/logic/snapshot";
import { useGameStore } from "@/stores/game-store";
import type {
  BattleCharacter,
  BattleLogEntry,
  CharacterSnapshot,
} from "@/types/battle";
import type { RoundEvent } from "@/types/battle-event";
import type { Stats } from "@/types/character";
import type { BattleOutcome, Difficulty } from "@/types/game";
import type { Skill } from "@/types/skill";

interface BattleState {
  // 로직용 최종 상태
  player: BattleCharacter | null;
  enemy: BattleCharacter | null;
  difficulty: Difficulty;
  round: number;
  outcome: BattleOutcome | null;

  // 레거시 호환
  logs: BattleLogEntry[];

  // 이벤트 시스템
  events: RoundEvent[];
  pendingEvents: RoundEvent[];
  displayPlayer: CharacterSnapshot | null;
  displayEnemy: CharacterSnapshot | null;
  isAnimating: boolean;
  animationEnabled: boolean;

  initBattle: (
    name: string,
    stats: Stats,
    skills: Skill[],
    difficulty: Difficulty,
  ) => void;
  executePlayerAction: (skillIndex: number) => void;
  advanceEvent: () => void;
  flushEvents: () => void;
  setAnimationEnabled: (enabled: boolean) => void;
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
  difficulty: "normal" as Difficulty,
  round: 1,
  outcome: null,
  logs: [],

  events: [],
  pendingEvents: [],
  displayPlayer: null,
  displayEnemy: null,
  isAnimating: false,
  animationEnabled: true,

  initBattle: (name, stats, skills, difficulty) => {
    const enemyConfig = ENEMIES[difficulty];
    const player = createCharacter(name, stats, skills);
    const enemy = createCharacter(
      enemyConfig.name,
      enemyConfig.stats,
      enemyConfig.skills,
    );
    set({
      player,
      enemy,
      difficulty,
      round: 1,
      outcome: null,
      logs: [],
      events: [],
      pendingEvents: [],
      displayPlayer: toSnapshot(player),
      displayEnemy: toSnapshot(enemy),
      isAnimating: false,
    });
  },

  executePlayerAction: (skillIndex) => {
    const state = get();
    if (!state.player || !state.enemy || state.outcome) return;

    const playerSkill = state.player.skills[skillIndex];
    if (!playerSkill) return;
    if (playerSkill.mpCost > state.player.currentMp) return;

    const result = generateRoundEvents(
      state.player,
      state.enemy,
      state.round,
      playerSkill,
      state.difficulty,
    );

    // 레거시 로그 변환
    const newLegacyLogs = eventsToLegacyLogs(result.events);

    set({
      player: result.finalPlayer,
      enemy: result.finalEnemy,
      round: result.nextRound,
      outcome: result.outcome,
      logs: [...state.logs, ...newLegacyLogs],
      pendingEvents: [...result.events],
      isAnimating: true,
    });

    // 애니메이션 비활성화 시 즉시 모든 이벤트 처리
    if (!get().animationEnabled) {
      get().flushEvents();
    }
  },

  advanceEvent: () => {
    const state = get();
    if (state.pendingEvents.length === 0) return;

    const [event, ...remaining] = state.pendingEvents;
    const newEvents = [...state.events, event];

    const updates: Partial<BattleState> = {
      events: newEvents,
      pendingEvents: remaining,
      displayPlayer: event.playerSnapshot,
      displayEnemy: event.enemySnapshot,
    };

    if (remaining.length === 0) {
      updates.isAnimating = false;
    }

    set(updates as BattleState);

    // battle-end 이벤트 처리: 결과 화면 전환
    if (event.type === "battle-end") {
      const { outcome, round } = get();
      if (outcome) {
        useGameStore.getState().showResult(outcome, round - 1);
      }
    }
  },

  flushEvents: () => {
    const state = get();
    if (state.pendingEvents.length === 0) return;

    const allEvents = [...state.events, ...state.pendingEvents];
    const lastEvent = state.pendingEvents[state.pendingEvents.length - 1];

    set({
      events: allEvents,
      pendingEvents: [],
      displayPlayer: lastEvent.playerSnapshot,
      displayEnemy: lastEvent.enemySnapshot,
      isAnimating: false,
    });

    // battle-end 이벤트가 포함되어 있으면 결과 화면 전환
    const battleEnd = state.pendingEvents.find((e) => e.type === "battle-end");
    if (battleEnd) {
      const { outcome, round } = get();
      if (outcome) {
        useGameStore.getState().showResult(outcome, round - 1);
      }
    }
  },

  setAnimationEnabled: (enabled) => set({ animationEnabled: enabled }),

  reset: () =>
    set({
      player: null,
      enemy: null,
      difficulty: "normal" as Difficulty,
      round: 1,
      outcome: null,
      logs: [],
      events: [],
      pendingEvents: [],
      displayPlayer: null,
      displayEnemy: null,
      isAnimating: false,
    }),
}));
