import { create } from "zustand";
import type { ReplayData } from "@/types/replay";
import { isValidReplay } from "@/types/replay";

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
    if (!raw) return [];
    const parsed: unknown[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // 호환되지 않는 버전의 데이터는 자동 제거
    return parsed.filter(isValidReplay);
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
