import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type GameButtonVariant = "orange" | "blue";
type GameButtonSize = "sm" | "default";

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GameButtonVariant;
  size?: GameButtonSize;
  /** 활성(준비 완료) 상태에서 글로우 애니메이션 적용 */
  active?: boolean;
}

export const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(
  (
    {
      variant = "orange",
      size = "default",
      active,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "cursor-pointer font-bold text-white uppercase tracking-wider transition-all",
          "disabled:cursor-not-allowed disabled:opacity-40",
          size === "sm" && "px-4 py-2 text-xs",
          size === "default" && "px-8 py-2.5 text-sm",
          variant === "orange" &&
            (active
              ? "animate-button-ready bg-accent-orange hover:bg-accent-orange-hover"
              : "bg-accent-orange hover:scale-105 hover:brightness-125"),
          variant === "blue" &&
            "bg-accent-blue hover:scale-105 hover:brightness-125",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
