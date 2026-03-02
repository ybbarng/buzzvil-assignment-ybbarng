import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GameContainerProps {
  children: ReactNode;
  align?: "start" | "center";
}

export function GameContainer({
  children,
  align = "center",
}: GameContainerProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen select-none justify-center bg-bg-primary p-4",
        align === "start" ? "items-start" : "items-center",
      )}
    >
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  );
}
