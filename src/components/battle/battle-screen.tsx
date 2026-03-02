import { useEffect, useRef } from "react";
import { ActionPanel } from "@/components/battle/action-panel";
import { BattleLog } from "@/components/battle/battle-log";
import { CharacterPanel } from "@/components/battle/character-panel";
import { EVENT_DELAYS } from "@/constants/battle";
import { SKEW, SKEW_TEXT, staggerDelay } from "@/constants/theme";
import { josa } from "@/lib/utils";
import { useBattleStore } from "@/stores/battle-store";
import { useSettingStore } from "@/stores/setting-store";

export function BattleScreen() {
  const player = useBattleStore((s) => s.player);
  const enemy = useBattleStore((s) => s.enemy);
  const round = useBattleStore((s) => s.round);
  const outcome = useBattleStore((s) => s.outcome);
  const initBattle = useBattleStore((s) => s.initBattle);
  const events = useBattleStore((s) => s.events);
  const executePlayerAction = useBattleStore((s) => s.executePlayerAction);
  const displayPlayer = useBattleStore((s) => s.displayPlayer);
  const displayEnemy = useBattleStore((s) => s.displayEnemy);
  const isAnimating = useBattleStore((s) => s.isAnimating);
  const pendingEvents = useBattleStore((s) => s.pendingEvents);
  const advanceEvent = useBattleStore((s) => s.advanceEvent);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const { name, stats, skills, difficulty } = useSettingStore.getState();
    initBattle(name, stats, skills, difficulty);
  }, [initBattle]);

  // 이벤트 애니메이션 타이머
  useEffect(() => {
    if (pendingEvents.length === 0) return;

    const nextEvent = pendingEvents[0];
    const delay = EVENT_DELAYS[nextEvent.type] ?? 600;

    const timer = setTimeout(() => {
      advanceEvent();
    }, delay);

    return () => clearTimeout(timer);
  }, [pendingEvents, advanceEvent]);

  if (!player || !enemy) return null;

  return (
    <div className="space-y-4">
      {/* 라운드 배지 + 캐릭터 패널: 위에서 슬라이드 */}
      <div
        className="animate-slide-in-top flex items-center justify-center gap-2"
        style={staggerDelay(0)}
      >
        <span
          data-testid="round-display"
          className={`inline-block bg-accent-orange px-4 py-1 text-lg font-bold text-bg-primary ${SKEW}`}
        >
          <span className={SKEW_TEXT}>라운드 {round}</span>
        </span>
      </div>

      <div
        className="animate-slide-in-top grid grid-cols-[1fr_auto_1fr] items-center gap-4"
        style={staggerDelay(1)}
      >
        <CharacterPanel
          character={player}
          snapshot={displayPlayer}
          testId="player-panel"
          nameTestId="player-name"
          side="player"
        />
        <span className="text-2xl font-bold text-text-muted">VS</span>
        <CharacterPanel
          character={enemy}
          snapshot={displayEnemy}
          testId="enemy-panel"
          nameTestId="enemy-name"
          side="enemy"
        />
      </div>

      {/* 액션 패널 + 로그: 아래에서 슬라이드 */}
      {!outcome && (
        <div
          className="animate-slide-in-bottom space-y-2"
          style={staggerDelay(2)}
        >
          {!isAnimating && (
            <p className="text-sm text-text-secondary">
              {round === 1
                ? "전투가 시작되었습니다. "
                : `${round} 라운드입니다. `}
              <span className="text-white">{player.name}</span>
              {josa(player.name, "은", "는")}{" "}
              {round === 1
                ? "첫 라운드에서 무엇을 하시겠습니까?"
                : "무엇을 하시겠습니까?"}
            </p>
          )}
          <ActionPanel
            player={player}
            onAction={executePlayerAction}
            disabled={isAnimating}
          />
        </div>
      )}

      <div className="animate-slide-in-bottom" style={staggerDelay(3)}>
        <BattleLog events={events} />
      </div>
    </div>
  );
}
