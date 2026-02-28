import { create } from "zustand";
import { DEFAULT_SKILLS } from "@/constants/skills";
import { DEFAULT_STATS } from "@/constants/stats";
import type { Stats } from "@/types/character";
import type { SettingStep } from "@/types/game";
import type { Skill } from "@/types/skill";

interface SettingState {
  step: SettingStep;
  name: string;
  stats: Stats;
  skills: Skill[];

  setStep: (step: SettingStep) => void;
  setName: (name: string) => void;
  setStats: (stats: Stats) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (index: number) => void;
  reset: () => void;
}

const initialState = {
  step: 1 as SettingStep,
  name: "",
  stats: { ...DEFAULT_STATS },
  skills: [...DEFAULT_SKILLS],
};

export const useSettingStore = create<SettingState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setName: (name) => set({ name }),
  setStats: (stats) => set({ stats }),
  addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
  removeSkill: (index) =>
    set((state) => ({
      skills: state.skills.filter((_, i) => i !== index),
    })),
  reset: () =>
    set({
      ...initialState,
      stats: { ...DEFAULT_STATS },
      skills: [...DEFAULT_SKILLS],
    }),
}));
