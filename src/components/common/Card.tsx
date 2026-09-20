import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Lifts the card with a shadow + slight translate on hover — use for clickable/interactive cards. */
  hoverLift?: boolean;
}

export function Card({ children, className = "", hoverLift = false, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 dark:border-slate-700 dark:bg-slate-800 ${
        hoverLift ? "hover:-translate-y-0.5 hover:shadow-md" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
