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
      <GameContainer>
        {phase === "setting" && <SettingScreen />}
        {phase === "battle" && <BattleScreen />}
        {phase === "result" && <ResultScreen />}
      </GameContainer>
    </TooltipProvider>
  );
}

export default App;
