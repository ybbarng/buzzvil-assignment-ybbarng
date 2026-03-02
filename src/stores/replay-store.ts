import { create } from "zustand";
import type { ReplayData } from "@/types/replay";

const STORAGE_KEY = "buzz-arena-replays";
const MAX_REPLAYS = 10;

interface ReplayState {
  replays: ReplayData[];
  activeReplay: ReplayData | null;

  load: () => void;
  save: (data: ReplayData) => void;
  remove: (id: string) => void;
  setActive: (replay: ReplayData | null) => void;
  reset: () => void;
}

function readFromStorage(): ReplayData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReplayData[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(replays: ReplayData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(replays));
}

export const useReplayStore = create<ReplayState>((set, get) => ({
  replays: [],
  activeReplay: null,

  load: () => {
    set({ replays: readFromStorage() });
  },

  save: (data) => {
    const updated = [data, ...get().replays].slice(0, MAX_REPLAYS);
    writeToStorage(updated);
    set({ replays: updated });
  },

  remove: (id) => {
    const updated = get().replays.filter((r) => r.id !== id);
    writeToStorage(updated);
    set({ replays: updated });
  },

  setActive: (replay) => set({ activeReplay: replay }),

  reset: () => set({ replays: [], activeReplay: null }),
}));
