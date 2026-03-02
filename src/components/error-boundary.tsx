import { Component, type ErrorInfo, type ReactNode } from "react";
import { GameButton } from "@/components/ui/game-button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-bg-primary p-4">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold text-damage">오류 발생</h1>
            <p className="text-text-secondary">
              예기치 않은 오류가 발생했습니다.
            </p>
            <GameButton type="button" active skew onClick={this.handleRestart}>
              새로고침
            </GameButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
