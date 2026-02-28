import { BattleScreen } from "@/components/battle/battle-screen";
import { GameContainer } from "@/components/layout/game-container";
import { ResultScreen } from "@/components/result/result-screen";
import { SettingScreen } from "@/components/setting/setting-screen";
import { useGameStore } from "@/stores/game-store";

function App() {
  const phase = useGameStore((s) => s.phase);

  return (
    <GameContainer>
      {phase === "setting" && <SettingScreen />}
      {phase === "battle" && <BattleScreen />}
      {phase === "result" && <ResultScreen />}
    </GameContainer>
  );
}

export default App;
