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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(replays));
  } catch {
    // Private Browsing, 스토리지 할당량 초과 등 — 저장 실패는 무시
  }
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
    const updated = get().replays.filter((replay) => replay.id !== id);
    writeToStorage(updated);
    set({ replays: updated });
  },

  setActive: (replay) => set({ activeReplay: replay }),

  reset: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 삭제 실패는 무시
    }
    set({ replays: [], activeReplay: null });
  },
}));
