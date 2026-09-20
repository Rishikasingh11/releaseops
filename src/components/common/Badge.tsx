import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  /** Adds a small leading dot (in the badge's own color) for extra visual weight on urgent statuses. */
  dot?: boolean;
}

export function Badge({ children, className = "", dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}
