import { lazy, Suspense, useEffect } from "react";
import { GameContainer } from "@/components/layout/game-container";
import { SettingScreen } from "@/components/setting/setting-screen";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FONT_ITALIC } from "@/constants/theme";
import { useGameStore } from "@/stores/game-store";
import { useReplayStore } from "@/stores/replay-store";

const BattleScreen = lazy(() =>
  import("@/components/battle/battle-screen").then((m) => ({
    default: m.BattleScreen,
  })),
);
const ResultScreen = lazy(() =>
  import("@/components/result/result-screen").then((m) => ({
    default: m.ResultScreen,
  })),
);

function App() {
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    document.body.classList.toggle("italic", FONT_ITALIC);
    useReplayStore.getState().load();
  }, []);

  const isBattle = phase === "battle" || phase === "replay";
  const isResult = phase === "result" || phase === "replay-result";

  return (
    <TooltipProvider>
      <GameContainer align={isResult ? "center" : "start"} stretch={isBattle}>
        {isBattle && (
          <div data-header className="mb-8 animate-slide-in-top text-center">
            <h1 className="animate-title-blaze text-6xl font-bold tracking-wide text-accent-orange uppercase">
              BUZZ ARENA
            </h1>
          </div>
        )}
        <Suspense
          fallback={
            <p className="py-12 text-center text-sm text-text-muted">
              로딩 중...
            </p>
          }
        >
          {phase === "setting" && <SettingScreen />}
          {isBattle && <BattleScreen />}
          {isResult && <ResultScreen />}
        </Suspense>
      </GameContainer>
    </TooltipProvider>
  );
}

export default App;
