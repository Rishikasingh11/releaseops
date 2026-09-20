import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { useCountUp } from "../../utils/useCountUp";

export type MetricTone = "neutral" | "info" | "success" | "warning" | "danger" | "accent";

const toneStyles: Record<
  MetricTone,
  { icon: string; value: string; border: string; bg: string }
> = {
  neutral: {
    icon: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    value: "text-slate-900 dark:text-slate-100",
    border: "border-l-slate-400",
    bg: "bg-slate-50/60 dark:bg-slate-700/30",
  },
  info: {
    icon: "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    value: "text-slate-900 dark:text-slate-100",
    border: "border-l-blue-500",
    bg: "bg-blue-50/40 dark:bg-blue-900/20",
  },
  success: {
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    value: "text-slate-900 dark:text-slate-100",
    border: "border-l-emerald-500",
    bg: "bg-emerald-50/40 dark:bg-emerald-900/20",
  },
  warning: {
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    value: "text-amber-700 dark:text-amber-400",
    border: "border-l-amber-500",
    bg: "bg-amber-50/50 dark:bg-amber-900/20",
  },
  danger: {
    icon: "bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-400",
    value: "text-red-700 dark:text-red-400",
    border: "border-l-red-500",
    bg: "bg-red-50/50 dark:bg-red-900/20",
  },
  accent: {
    icon: "bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
    value: "text-violet-700 dark:text-violet-400",
    border: "border-l-violet-500",
    bg: "bg-violet-50/40 dark:bg-violet-900/20",
  },
};

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: MetricTone;
  /** Adds a colored left border + tinted background to make an urgent count impossible to miss. */
  emphasize?: boolean;
}

export function MetricCard({ label, value, icon: Icon, tone = "info", emphasize = false }: MetricCardProps) {
  const styles = toneStyles[tone];
  const numericValue = typeof value === "number" ? value : null;
  const animatedValue = useCountUp(numericValue ?? 0);
  const shouldPulse = emphasize && tone === "danger" && numericValue !== null && numericValue > 0;

  return (
    <Card
      hoverLift
      className={`flex items-center justify-between ${
        emphasize ? `border-l-4 ${styles.border} ${styles.bg}` : ""
      }`}
    >
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className={`mt-1 text-2xl font-semibold tabular-nums ${emphasize ? styles.value : "text-slate-900 dark:text-slate-100"}`}>
          {numericValue !== null ? animatedValue : value}
        </p>
      </div>
      <div className={`relative flex h-10 w-10 items-center justify-center rounded-lg ${styles.icon}`}>
        {shouldPulse && (
          <span className="absolute inset-0 animate-ping rounded-lg bg-red-400/40 dark:bg-red-500/30" />
        )}
        <Icon className="relative h-5 w-5" />
      </div>
    </Card>
  );
}
