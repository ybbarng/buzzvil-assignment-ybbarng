import { fireEvent, screen } from "@testing-library/react";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import { useReplayStore } from "@/stores/replay-store";
import { useSettingStore } from "@/stores/setting-store";
import type { CharacterSnapshot } from "@/types/battle";

export const TEST_PLAYER_SNAPSHOT: CharacterSnapshot = {
  name: "플레이어",
  baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 },
  currentHp: 100,
  currentMp: 50,
  isDefending: false,
  buffs: [],
};

export const TEST_ENEMY_SNAPSHOT: CharacterSnapshot = {
  name: "적",
  baseStats: { hp: 80, mp: 40, atk: 15, def: 8, spd: 10 },
  currentHp: 80,
  currentMp: 40,
  isDefending: false,
  buffs: [],
};

export function resetStores() {
  useGameStore.getState().restart();
  useSettingStore.getState().reset();
  useBattleStore.getState().reset();
  useBattleStore.getState().setAnimationEnabled(false);
  useReplayStore.getState().reset();
}

/**
 * 스탯 인풋의 값을 변경한다.
 * react-hook-form의 controlled input은 userEvent.type으로 값을 지정하기
 * 어려우므로, fireEvent.change로 값을 직접 설정한다.
 */
export function setStatValue(testId: string, value: number) {
  fireEvent.change(screen.getByTestId(testId), {
    target: { value: String(value) },
  });
}

/** 스탯을 총 200으로 배분한다 (HP 60, MP 50, ATK 30, DEF 30, SPD 30) */
export function allocateStats() {
  setStatValue("stat-hp", 60);
  setStatValue("stat-mp", 50);
  setStatValue("stat-atk", 30);
  setStatValue("stat-def", 30);
  setStatValue("stat-spd", 30);
}
