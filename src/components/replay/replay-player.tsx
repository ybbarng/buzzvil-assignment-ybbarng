import { useCallback, useRef } from "react";
import { SKEW, SKEW_TEXT } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { useBattleStore } from "@/stores/battle-store";

export function ReplayPlayer() {
  const events = useBattleStore((s) => s.events);
  const allReplayEvents = useBattleStore((s) => s.allReplayEvents);
  const isReplayPaused = useBattleStore((s) => s.isReplayPaused);
  const toggleReplayPause = useBattleStore((s) => s.toggleReplayPause);
  const seekReplay = useBattleStore((s) => s.seekReplay);

  const barRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const total = allReplayEvents.length;
  const current = events.length;
  const progress = total > 0 ? current / total : 0;

  const seekFromPointer = useCallback(
    (clientX: number) => {
      const bar = barRef.current;
      if (!bar || total === 0) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const targetIndex = Math.round(ratio * (total - 1));
      seekReplay(targetIndex);
    },
    [total, seekReplay],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      seekFromPointer(e.clientX);
    },
    [seekFromPointer],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      seekFromPointer(e.clientX);
    },
    [seekFromPointer],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        {/* 재생/일시정지 버튼 */}
        <button
          type="button"
          onClick={toggleReplayPause}
          className={cn(
            `${SKEW} flex h-7 w-9 items-center justify-center bg-accent-blue`,
            "transition-all hover:scale-105 hover:brightness-110",
          )}
        >
          <span className={`${SKEW_TEXT} text-sm font-bold text-white`}>
            {isReplayPaused ? "\u25B6" : "\u275A\u275A"}
          </span>
        </button>

        {/* 프로그레스 바 */}
        <div
          ref={barRef}
          className="relative h-2 flex-1 cursor-pointer bg-bg-tertiary"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div
            className="absolute inset-y-0 left-0 bg-accent-orange transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
          {/* 드래그 핸들 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-4 w-2 bg-white shadow-md"
            style={{ left: `calc(${progress * 100}% - 4px)` }}
          />
        </div>

        {/* 진행 표시 */}
        <span className="shrink-0 text-xs tabular-nums text-text-muted">
          {current}/{total}
        </span>
      </div>
    </div>
  );
}
