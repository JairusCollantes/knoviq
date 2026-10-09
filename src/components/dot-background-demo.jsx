import { cn } from "@/lib/utils";

export function DotBackgroundDemo({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-[var(--bg)]">
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
          "[background-size:24px_24px]",
          "[background-image:radial-gradient(#3d3745_1.4px,transparent_1.4px)]"
        )}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[var(--bg)] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,transparent_15%,black_75%)]"
      ></div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] [background:radial-gradient(52%_60%_at_50%_0%,color-mix(in_srgb,var(--accent)_13%,transparent),transparent_70%)]"
      ></div>
      
      <div className="relative z-20 w-full">
        {children}
      </div>
    </div>
  );
}