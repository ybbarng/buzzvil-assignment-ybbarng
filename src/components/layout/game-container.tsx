import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GameContainerProps {
  children: ReactNode;
  align?: "start" | "center";
  /** 내부 콘텐츠가 화면 높이를 채우도록 flex-col 적용 */
  stretch?: boolean;
}

/** select-none: 게임 특성상 버튼 연타·드래그 시 의도치 않은 텍스트 선택을 방지 */
export function GameContainer({
  children,
  align = "center",
  stretch = false,
}: GameContainerProps) {
  return (
    <div
      className={cn(
        "flex select-none justify-center bg-bg-primary p-4",
        stretch ? "h-screen" : "min-h-screen",
        align === "start" ? "items-start" : "items-center",
      )}
    >
      <div
        className={cn("w-full max-w-2xl", stretch && "flex h-full flex-col")}
      >
        {children}
      </div>
    </div>
  );
}
