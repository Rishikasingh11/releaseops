interface ProgressBarProps {
  value: number;
  colorClassName?: string;
}

export function ProgressBar({ value, colorClassName = "bg-blue-600" }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${colorClassName}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{clamped}%</span>
    </div>
  );
}
