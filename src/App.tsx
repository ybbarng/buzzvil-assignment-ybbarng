import { useEffect } from "react";
import { BattleScreen } from "@/components/battle/battle-screen";
import { GameContainer } from "@/components/layout/game-container";
import { ResultScreen } from "@/components/result/result-screen";
import { SettingScreen } from "@/components/setting/setting-screen";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FONT_ITALIC } from "@/constants/theme";
import { useGameStore } from "@/stores/game-store";

function App() {
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    document.body.classList.toggle("italic", FONT_ITALIC);
  }, []);

  return (
    <TooltipProvider>
      <GameContainer align={phase === "result" ? "center" : "start"}>
        {phase !== "result" && (
          <div className="mb-8 text-center">
            <h1 className="animate-title-blaze text-6xl font-bold tracking-wide text-accent-orange uppercase">
              BUZZ ARENA
            </h1>
            <p className="mt-2 text-base tracking-wide text-text-secondary">
              자신만의 강력한 영웅을 구성하고 치열한 전투에 참가해보세요!
            </p>
          </div>
        )}
        {phase === "setting" && <SettingScreen />}
        {phase === "battle" && <BattleScreen />}
        {phase === "result" && <ResultScreen />}
      </GameContainer>
    </TooltipProvider>
  );
}

export default App;
