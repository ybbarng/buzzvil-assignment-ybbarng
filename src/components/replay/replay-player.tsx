import { Pause, Play } from "lucide-react";
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (total === 0) return;
      const currentIndex = current - 1;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        seekReplay(Math.min(currentIndex + 1, total - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        seekReplay(Math.max(currentIndex - 1, 0));
      }
    },
    [current, total, seekReplay],
  );

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        {/* 재생/일시정지 버튼 */}
        <button
          type="button"
          onClick={toggleReplayPause}
          aria-label={isReplayPaused ? "재생" : "일시정지"}
          className={cn(
            `${SKEW} flex h-7 w-9 items-center justify-center bg-accent-blue`,
            "transition-all hover:scale-105 hover:brightness-110",
          )}
        >
          <span className={SKEW_TEXT}>
            {isReplayPaused ? (
              <Play className="size-3.5 fill-white text-white" />
            ) : (
              <Pause className="size-3.5 fill-white text-white" />
            )}
          </span>
        </button>

        {/* 프로그레스 바 */}
        <div
          ref={barRef}
          role="slider"
          aria-label="리플레이 진행률"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          tabIndex={0}
          className="relative h-2 flex-1 cursor-pointer bg-bg-tertiary"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          <div
            className="absolute inset-y-0 left-0 bg-accent-orange transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
          {/* 드래그 핸들 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-4 w-2 bg-white shadow-md"
            style={{
              left: `clamp(0px, calc(${progress * 100}% - 4px), calc(100% - 8px))`,
            }}
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
