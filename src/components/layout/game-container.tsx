import type { ReactNode } from "react";

interface GameContainerProps {
  children: ReactNode;
}

export function GameContainer({ children }: GameContainerProps) {
  return (
    <div className="flex min-h-screen select-none items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  );
}
