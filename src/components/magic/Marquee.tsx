import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: "slow" | "normal" | "fast";
  reverse?: boolean;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  className,
  speed = "normal",
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  const duration = speed === "slow" ? "40s" : speed === "fast" ? "15s" : "25s";

  return (
    <div
      className={cn("group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]", className)}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-4",
          "animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "flex min-w-full shrink-0 items-center gap-4",
          "animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
