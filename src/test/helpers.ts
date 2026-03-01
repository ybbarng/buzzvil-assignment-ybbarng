import { fireEvent, screen } from "@testing-library/react";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import { useSettingStore } from "@/stores/setting-store";

export function resetStores() {
  useGameStore.getState().restart();
  useSettingStore.getState().reset();
  useBattleStore.getState().reset();
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
