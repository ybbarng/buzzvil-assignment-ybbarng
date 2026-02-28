import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_SKILLS } from "@/constants/skills";
import { DEFAULT_STATS } from "@/constants/stats";
import { useSettingStore } from "./setting-store";

describe("setting-store", () => {
  afterEach(() => {
    useSettingStore.getState().reset();
  });

  it("초기 상태가 올바르다", () => {
    const state = useSettingStore.getState();
    expect(state.step).toBe(1);
    expect(state.name).toBe("");
    expect(state.stats).toEqual(DEFAULT_STATS);
    expect(state.skills).toEqual(DEFAULT_SKILLS);
  });

  it("이름을 설정할 수 있다", () => {
    useSettingStore.getState().setName("테스터");
    expect(useSettingStore.getState().name).toBe("테스터");
  });

  it("스탯을 설정할 수 있다", () => {
    const newStats = { hp: 80, mp: 50, atk: 25, def: 25, spd: 20 };
    useSettingStore.getState().setStats(newStats);
    expect(useSettingStore.getState().stats).toEqual(newStats);
  });

  it("스텝을 변경할 수 있다", () => {
    useSettingStore.getState().setStep(2);
    expect(useSettingStore.getState().step).toBe(2);
  });

  it("reset으로 초기 상태로 돌아간다", () => {
    useSettingStore.getState().setName("테스터");
    useSettingStore.getState().setStep(3);
    useSettingStore.getState().reset();
    const state = useSettingStore.getState();
    expect(state.step).toBe(1);
    expect(state.name).toBe("");
    expect(state.stats).toEqual(DEFAULT_STATS);
    expect(state.skills).toEqual(DEFAULT_SKILLS);
  });
});
