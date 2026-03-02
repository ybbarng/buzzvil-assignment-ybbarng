import { useEffect } from "react";
import { BattleScreen } from "@/components/battle/battle-screen";
import { GameContainer } from "@/components/layout/game-container";
import { ResultScreen } from "@/components/result/result-screen";
import { SettingScreen } from "@/components/setting/setting-screen";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FONT_ITALIC } from "@/constants/theme";
import { useGameStore } from "@/stores/game-store";
import { useReplayStore } from "@/stores/replay-store";

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
      <GameContainer align={isResult ? "center" : "start"}>
        {isBattle && (
          <div data-header className="mb-8 animate-slide-in-top text-center">
            <h1 className="animate-title-blaze text-6xl font-bold tracking-wide text-accent-orange uppercase">
              BUZZ ARENA
            </h1>
          </div>
        )}
        {phase === "setting" && <SettingScreen />}
        {isBattle && <BattleScreen />}
        {isResult && <ResultScreen />}
      </GameContainer>
    </TooltipProvider>
  );
}

export default App;
