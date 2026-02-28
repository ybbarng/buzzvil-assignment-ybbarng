import { GameContainer } from "@/components/layout/game-container";
import { SettingScreen } from "@/components/setting/setting-screen";
import { useGameStore } from "@/stores/game-store";

function BattlePlaceholder() {
  const showResult = useGameStore((s) => s.showResult);
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-accent-blue">전투</h2>
      <p className="mt-2 text-text-secondary">전투가 진행 중입니다</p>
      <button
        type="button"
        className="mt-4 rounded bg-accent-blue px-4 py-2 font-bold text-white hover:bg-accent-blue-hover"
        onClick={() => showResult("win", 5)}
      >
        승리
      </button>
    </div>
  );
}

function ResultPlaceholder() {
  const outcome = useGameStore((s) => s.outcome);
  const totalTurns = useGameStore((s) => s.totalTurns);
  const restart = useGameStore((s) => s.restart);
  return (
    <div className="text-center">
      <h2
        data-testid="result-title"
        className="text-2xl font-bold text-accent-orange"
      >
        {outcome === "win" ? "승리" : outcome === "lose" ? "패배" : "무승부"}
      </h2>
      <p data-testid="result-turns" className="mt-2 text-text-secondary">
        {totalTurns}턴
      </p>
      <button
        type="button"
        data-testid="restart-button"
        className="mt-4 rounded bg-accent-orange px-4 py-2 font-bold text-bg-primary hover:bg-accent-orange-hover"
        onClick={restart}
      >
        다시 시작
      </button>
    </div>
  );
}

function App() {
  const phase = useGameStore((s) => s.phase);

  return (
    <GameContainer>
      {phase === "setting" && <SettingScreen />}
      {phase === "battle" && <BattlePlaceholder />}
      {phase === "result" && <ResultPlaceholder />}
    </GameContainer>
  );
}

export default App;
