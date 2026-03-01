import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GameContainerProps {
  children: ReactNode;
  className?: string;
}

export function GameContainer({ children, className }: GameContainerProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-bg-primary p-4",
        className,
      )}
    >
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  );
}
