import { ShieldCheck } from "lucide-react";
import type { ReleaseIntelligence } from "../../store/selectors";
import { Card } from "../common/Card";
import { useCountUp } from "../../utils/useCountUp";

interface OverallReadinessPanelProps {
  intelligence: ReleaseIntelligence[];
}

export function OverallReadinessPanel({ intelligence }: OverallReadinessPanelProps) {
  const active = intelligence.filter((i) => i.release.status !== "Closed");
  const average = active.length
    ? Math.round(active.reduce((sum, i) => sum + i.readiness.score, 0) / active.length)
    : 100;
  const animatedAverage = useCountUp(average);

  const safeToDeployCount = active.filter((i) => i.risk.level === "Low").length;

  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Overall Deployment Readiness</p>
          <p className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">{animatedAverage}%</p>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-800 dark:text-slate-200">{safeToDeployCount}</span> of{" "}
        <span className="font-semibold text-slate-800 dark:text-slate-200">{active.length}</span> active releases are
        currently low-risk and safe to deploy.
      </p>
    </Card>
  );
}
