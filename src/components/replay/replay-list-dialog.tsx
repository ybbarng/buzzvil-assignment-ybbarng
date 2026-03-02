import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GameButton } from "@/components/ui/game-button";
import { SKEW, SKEW_TEXT } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import { useReplayStore } from "@/stores/replay-store";
import type { BattleOutcome, Difficulty } from "@/types/game";
import type { ReplayData } from "@/types/replay";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
};

const OUTCOME_LABELS: Record<BattleOutcome, string> = {
  win: "승리",
  lose: "패배",
  draw: "무승부",
};

const OUTCOME_COLORS: Record<BattleOutcome, string> = {
  win: "text-accent-orange",
  lose: "text-damage",
  draw: "text-accent-blue",
};

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
}

interface ReplayListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReplayListDialog({
  open,
  onOpenChange,
}: ReplayListDialogProps) {
  const replays = useReplayStore((s) => s.replays);
  const remove = useReplayStore((s) => s.remove);

  const handlePlay = (replay: ReplayData) => {
    onOpenChange(false);
    useReplayStore.getState().setActive(replay);
    useBattleStore.getState().reset();
    useBattleStore.getState().initReplay(replay.events);
    useGameStore.getState().startReplay();
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    remove(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-border bg-bg-secondary max-w-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-text-primary">
            리플레이
          </DialogTitle>
        </DialogHeader>

        {replays.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">
            저장된 리플레이가 없습니다
          </p>
        ) : (
          <ul className="space-y-2">
            {replays.map((replay) => (
              <li key={replay.id}>
                <button
                  type="button"
                  onClick={() => handlePlay(replay)}
                  className={cn(
                    `${SKEW} flex w-full items-center gap-3 bg-bg-tertiary px-4 py-3`,
                    "transition-all hover:scale-[1.02] hover:brightness-110",
                  )}
                >
                  <div
                    className={`${SKEW_TEXT} flex w-full items-center gap-3`}
                  >
                    <span className="shrink-0 text-xs text-text-muted">
                      {formatDate(replay.timestamp)}
                    </span>
                    <span className="min-w-0 truncate text-sm text-text-primary">
                      {replay.playerName} vs {replay.enemyName}
                    </span>
                    <span className="shrink-0 text-xs text-text-secondary">
                      {DIFFICULTY_LABELS[replay.difficulty]}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-xs font-bold",
                        OUTCOME_COLORS[replay.outcome],
                      )}
                    >
                      {OUTCOME_LABELS[replay.outcome]}
                    </span>
                    <span className="shrink-0 text-xs text-text-muted">
                      {replay.totalTurns}턴
                    </span>
                    <GameButton
                      type="button"
                      variant="blue"
                      size="sm"
                      className="ml-auto shrink-0"
                      onClick={(e) => handleRemove(replay.id, e)}
                    >
                      삭제
                    </GameButton>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
