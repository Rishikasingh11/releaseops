import { useState } from "react";
import { Zap, Clock, ShieldCheck, Activity, Award } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";

interface DoraMetric {
  title: string;
  value: string;
  unit: string;
  rating: "Elite" | "High" | "Medium" | "Low";
  description: string;
  benchmark: string;
  icon: typeof Zap;
  tone: "accent" | "info" | "warning" | "success";
}

const ratingColors: Record<DoraMetric["rating"], string> = {
  Elite: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  High: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
  Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  Low: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
};

export function DoraMetricsPanel() {
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "all">("30d");

  const metrics: DoraMetric[] = [
    {
      title: "Deployment Frequency",
      value: timeRange === "30d" ? "4.2" : timeRange === "90d" ? "3.8" : "3.5",
      unit: "deploys / week",
      rating: "High",
      description: "How often code is successfully deployed to production.",
      benchmark: "Industry Elite: Multiple deploys per day",
      icon: Zap,
      tone: "accent",
    },
    {
      title: "Lead Time for Changes",
      value: timeRange === "30d" ? "3.2" : timeRange === "90d" ? "4.1" : "4.5",
      unit: "days",
      rating: "High",
      description: "Time from code commit to running in production.",
      benchmark: "Industry Elite: Less than one day",
      icon: Clock,
      tone: "info",
    },
    {
      title: "Change Failure Rate",
      value: timeRange === "30d" ? "6.8%" : timeRange === "90d" ? "8.2%" : "9.1%",
      unit: "of deployments",
      rating: "Elite",
      description: "Percentage of releases causing degradation or requiring rollback.",
      benchmark: "Industry Elite: Under 15%",
      icon: ShieldCheck,
      tone: "success",
    },
    {
      title: "Mean Time to Recovery",
      value: timeRange === "30d" ? "38" : timeRange === "90d" ? "45" : "52",
      unit: "minutes",
      rating: "Elite",
      description: "Average duration to restore service from a production incident.",
      benchmark: "Industry Elite: Under 1 hour",
      icon: Activity,
      tone: "success",
    },
  ];

  return (
    <Card className="overflow-hidden border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              DORA Performance Metrics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              DevOps Research & Assessment benchmarks for delivery velocity and stability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setTimeRange("30d")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              timeRange === "30d"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("90d")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              timeRange === "90d"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            Last 90 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("all")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              timeRange === "all"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.title}
              className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 dark:border-slate-700/60 dark:bg-slate-800/40 dark:hover:bg-slate-700/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {m.title}
                    </span>
                  </div>
                  <Badge className={ratingColors[m.rating]}>{m.rating}</Badge>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {m.value}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{m.unit}</span>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">{m.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 dark:border-slate-700">
                {m.benchmark}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
