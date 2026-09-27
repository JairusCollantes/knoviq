// src/components/dot-background-demo.jsx
import { cn } from "@/lib/utils";

export function DotBackgroundDemo({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-black dark:bg-black">
      {/* The dot pattern */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:24px_24px]",
          "[background-image:radial-gradient(#a1a1aa_1.5px,transparent_1.5px)]",
          "dark:[background-image:radial-gradient(#525252_1.5px,transparent_1.5px)]"
        )} 
      />
      
      {/* The faded look mask */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_70%)] dark:bg-black"
      ></div>
      
      {/* Your page content goes here */}
      <div className="relative z-20 w-full">
        {children}
      </div>
    </div>
  );
}