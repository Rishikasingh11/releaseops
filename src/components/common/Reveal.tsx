import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger index — each step adds 60ms of delay before this element fades/slides in. */
  index?: number;
  className?: string;
}

/** Wraps content in a subtle fade-in-up entrance, staggered by `index` for a polished cascading reveal. */
export function Reveal({ children, index = 0, className = "" }: RevealProps) {
  return (
    <div className={`animate-fade-in-up ${className}`} style={{ animationDelay: `${index * 60}ms` }}>
      {children}
    </div>
  );
}
