import { afterEach, describe, expect, it } from "vitest";
import { TEST_ENEMY_SNAPSHOT, TEST_PLAYER_SNAPSHOT } from "@/test/helpers";
import type { ReplayData } from "@/types/replay";
import { REPLAY_VERSION } from "@/types/replay";
import { useReplayStore } from "./replay-store";

const STORAGE_KEY = "buzz-arena-replays";

function createReplay(overrides?: Partial<ReplayData>): ReplayData {
  return {
    version: REPLAY_VERSION,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    playerName: "플레이어",
    enemyName: "적",
    difficulty: "normal",
    outcome: "win",
    totalTurns: 5,
    events: [
      {
        type: "round-start",
        round: 1,
        playerSnapshot: TEST_PLAYER_SNAPSHOT,
        enemySnapshot: TEST_ENEMY_SNAPSHOT,
      },
    ],
    ...overrides,
  };
}

describe("replay-store", () => {
  afterEach(() => {
    useReplayStore.getState().reset();
  });

  describe("save", () => {
    it("리플레이를 저장한다", () => {
      const replay = createReplay();
      useReplayStore.getState().save(replay);

      expect(useReplayStore.getState().replays).toHaveLength(1);
      expect(useReplayStore.getState().replays[0].id).toBe(replay.id);
    });

    it("최신 리플레이가 앞에 추가된다", () => {
      const old = createReplay({ id: "old", timestamp: 1000 });
      const recent = createReplay({ id: "recent", timestamp: 2000 });

      useReplayStore.getState().save(old);
      useReplayStore.getState().save(recent);

      const replays = useReplayStore.getState().replays;
      expect(replays[0].id).toBe("recent");
      expect(replays[1].id).toBe("old");
    });

    it("최대 10개까지만 유지한다", () => {
      for (let i = 0; i < 12; i++) {
        useReplayStore.getState().save(createReplay({ id: `r-${i}` }));
      }

      const replays = useReplayStore.getState().replays;
      expect(replays).toHaveLength(10);
      // 가장 최근 것이 앞에
      expect(replays[0].id).toBe("r-11");
      // 가장 오래된 것이 삭제됨
      expect(replays.find((r) => r.id === "r-0")).toBeUndefined();
      expect(replays.find((r) => r.id === "r-1")).toBeUndefined();
    });

    it("localStorage에 동기화된다", () => {
      const replay = createReplay();
      useReplayStore.getState().save(replay);

      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]",
      ) as ReplayData[];
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe(replay.id);
    });
  });

  describe("load", () => {
    it("localStorage에서 리플레이를 로드한다", () => {
      const replay = createReplay();
      localStorage.setItem(STORAGE_KEY, JSON.stringify([replay]));

      useReplayStore.getState().load();

      expect(useReplayStore.getState().replays).toHaveLength(1);
      expect(useReplayStore.getState().replays[0].id).toBe(replay.id);
    });

    it("호환되지 않는 버전의 데이터를 필터링한다", () => {
      const valid = createReplay({ id: "valid" });
      const invalid = { ...createReplay({ id: "invalid" }), version: 999 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([valid, invalid]));

      useReplayStore.getState().load();

      const replays = useReplayStore.getState().replays;
      expect(replays).toHaveLength(1);
      expect(replays[0].id).toBe("valid");
    });

    it("잘못된 JSON을 빈 배열로 처리한다", () => {
      localStorage.setItem(STORAGE_KEY, "not-json");

      useReplayStore.getState().load();

      expect(useReplayStore.getState().replays).toHaveLength(0);
    });

    it("데이터가 없으면 빈 배열을 반환한다", () => {
      useReplayStore.getState().load();
      expect(useReplayStore.getState().replays).toHaveLength(0);
    });
  });

  describe("remove", () => {
    it("특정 리플레이를 삭제한다", () => {
      const r1 = createReplay({ id: "r1" });
      const r2 = createReplay({ id: "r2" });
      useReplayStore.getState().save(r1);
      useReplayStore.getState().save(r2);

      useReplayStore.getState().remove("r1");

      const replays = useReplayStore.getState().replays;
      expect(replays).toHaveLength(1);
      expect(replays[0].id).toBe("r2");
    });

    it("삭제 후 localStorage에 동기화된다", () => {
      const replay = createReplay({ id: "to-delete" });
      useReplayStore.getState().save(replay);
      useReplayStore.getState().remove("to-delete");

      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]",
      ) as ReplayData[];
      expect(stored).toHaveLength(0);
    });
  });

  describe("setActive", () => {
    it("활성 리플레이를 설정한다", () => {
      const replay = createReplay();
      useReplayStore.getState().setActive(replay);

      expect(useReplayStore.getState().activeReplay?.id).toBe(replay.id);
    });

    it("null로 초기화할 수 있다", () => {
      const replay = createReplay();
      useReplayStore.getState().setActive(replay);
      useReplayStore.getState().setActive(null);

      expect(useReplayStore.getState().activeReplay).toBeNull();
    });
  });

  describe("reset", () => {
    it("상태를 초기화한다", () => {
      useReplayStore.getState().save(createReplay());
      useReplayStore.getState().setActive(createReplay());

      useReplayStore.getState().reset();

      const state = useReplayStore.getState();
      expect(state.replays).toHaveLength(0);
      expect(state.activeReplay).toBeNull();
    });
  });
});
