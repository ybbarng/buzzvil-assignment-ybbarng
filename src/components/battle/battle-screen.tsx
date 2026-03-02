import { useEffect, useMemo, useRef } from "react";
import { ActionPanel } from "@/components/battle/action-panel";
import { BattleLog } from "@/components/battle/battle-log";
import { CharacterPanel } from "@/components/battle/character-panel";
import { ACTOR_CHANGE_DELAY, EVENT_DELAYS } from "@/constants/battle";
import { SKEW, SKEW_TEXT } from "@/constants/theme";
import { josa } from "@/lib/utils";
import { useBattleStore } from "@/stores/battle-store";
import { useSettingStore } from "@/stores/setting-store";

export function BattleScreen() {
  const player = useBattleStore((s) => s.player);
  const enemy = useBattleStore((s) => s.enemy);
  const outcome = useBattleStore((s) => s.outcome);
  const initBattle = useBattleStore((s) => s.initBattle);
  const events = useBattleStore((s) => s.events);
  const executePlayerAction = useBattleStore((s) => s.executePlayerAction);
  const displayPlayer = useBattleStore((s) => s.displayPlayer);
  const displayEnemy = useBattleStore((s) => s.displayEnemy);
  const isAnimating = useBattleStore((s) => s.isAnimating);
  const pendingEvents = useBattleStore((s) => s.pendingEvents);
  const advanceEvent = useBattleStore((s) => s.advanceEvent);
  const activeActor = useBattleStore((s) => s.activeActor);

  const initialized = useRef(false);

  // events 배열에서 마지막 round-start의 round를 표시용으로 사용
  const displayRound = useMemo(() => {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].type === "round-start") return events[i].round;
    }
    return 1;
  }, [events]);

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
    let delay = EVENT_DELAYS[nextEvent.type] ?? 600;

    // 직전 이벤트와 시전자가 바뀌면 추가 여백
    const lastEvent = events[events.length - 1];
    if (
      lastEvent &&
      "actor" in lastEvent &&
      "actor" in nextEvent &&
      lastEvent.actor !== nextEvent.actor
    ) {
      delay += ACTOR_CHANGE_DELAY;
    }

    const timer = setTimeout(() => {
      advanceEvent();
    }, delay);

    return () => clearTimeout(timer);
  }, [pendingEvents, events, advanceEvent]);

  if (!player || !enemy) return null;

  return (
    <div className="space-y-4">
      {/* 라운드 배지: 위에서 슬라이드 */}
      <div className="animate-slide-in-top flex items-center justify-center gap-2">
        <span
          data-testid="round-display"
          className={`inline-block bg-accent-orange px-4 py-1 text-lg font-bold text-bg-primary ${SKEW}`}
        >
          <span className={SKEW_TEXT}>라운드 {displayRound}</span>
        </span>
      </div>

      {/* 캐릭터 패널: 플레이어 왼쪽에서, VS 위에서, 적 오른쪽에서 */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div
          className="animate-slide-in-left"
          style={{ animationDelay: "700ms" }}
        >
          <CharacterPanel
            character={player}
            snapshot={displayPlayer}
            testId="player-panel"
            nameTestId="player-name"
            side="player"
            isActive={activeActor === "player"}
          />
        </div>
        <span className="animate-slide-in-top text-2xl font-bold text-text-muted">
          VS
        </span>
        <div
          className="animate-slide-in-right"
          style={{ animationDelay: "700ms" }}
        >
          <CharacterPanel
            character={enemy}
            snapshot={displayEnemy}
            testId="enemy-panel"
            nameTestId="enemy-name"
            side="enemy"
            isActive={activeActor === "enemy"}
          />
        </div>
      </div>

      {/* 안내 문구 + 액션 패널: 아래에서 슬라이드 */}
      {(!outcome || isAnimating) && (
        <div
          className="animate-slide-in-bottom space-y-2"
          style={{ animationDelay: "1400ms" }}
        >
          <p className="text-sm text-text-secondary">
            {displayRound === 1
              ? "전투가 시작되었습니다. "
              : `${displayRound} 라운드입니다. `}
            <span className="text-white">{player.name}</span>
            {josa(player.name, "은", "는")}{" "}
            {displayRound === 1
              ? "첫 라운드에서 무엇을 하시겠습니까?"
              : "무엇을 하시겠습니까?"}
          </p>
          <ActionPanel
            player={player}
            onAction={executePlayerAction}
            disabled={isAnimating}
          />
        </div>
      )}

      {/* 전투 로그: 아래에서 슬라이드 */}
      <div
        className="animate-slide-in-bottom"
        style={{ animationDelay: "1800ms" }}
      >
        <BattleLog
          events={events}
          playerName={player.name}
          enemyName={enemy.name}
        />
      </div>
    </div>
  );
}
