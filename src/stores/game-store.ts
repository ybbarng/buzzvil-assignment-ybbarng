import { create } from "zustand";
import type { BattleOutcome, GamePhase } from "@/types/game";

interface GameState {
  phase: GamePhase;
  outcome: BattleOutcome | null;
  totalTurns: number;
  startBattle: () => void;
  showResult: (outcome: BattleOutcome, totalTurns: number) => void;
  restart: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: "setting",
  outcome: null,
  totalTurns: 0,
  startBattle: () => set({ phase: "battle" }),
  showResult: (outcome, totalTurns) =>
    set({ phase: "result", outcome, totalTurns }),
  restart: () => set({ phase: "setting", outcome: null, totalTurns: 0 }),
}));
