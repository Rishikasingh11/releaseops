import { Rocket, Gauge, Clock3, ShieldAlert, CheckCircle2 } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { MetricCard } from "../components/common/MetricCard";
import { Card } from "../components/common/Card";
import { ReleaseHealthPanel } from "../components/dashboard/ReleaseHealthPanel";
import { ReleasesByEnvironmentChart } from "../components/reports/ReleasesByEnvironmentChart";
import { DoraMetricsPanel } from "../components/reports/DoraMetricsPanel";
import { useAppStore } from "../store/useAppStore";
import { useReleaseIntelligence } from "../store/selectors";
import { getReleaseProgress } from "../utils/calculations";

export function ReportsPage() {
  const releases = useAppStore((state) => state.releases);
  const risks = useAppStore((state) => state.risks);
  const approvals = useAppStore((state) => state.approvals);
  const intelligence = useReleaseIntelligence();

  const shipped = releases.filter((r) => r.status === "Deployed" || r.status === "Closed").length;

  const avgProgress = intelligence.length
    ? Math.round(
        intelligence.reduce((sum, i) => sum + getReleaseProgress(i.release, i.jiraIssues), 0) /
          intelligence.length,
      )
    : 0;

  const avgApprovalTurnaroundDays = approvals.length
    ? Math.round(
        approvals.reduce((sum, a) => {
          const days = (new Date(a.dueDate).getTime() - new Date(a.requestedDate).getTime()) / 86_400_000;
          return sum + days;
        }, 0) / approvals.length,
      )
    : 0;

  const openCriticalRisks = risks.filter((r) => r.severity === "Critical" && r.status === "Open").length;

  // Gate bottlenecks analysis
  const pendingByGate = approvals.reduce((acc, a) => {
    if (a.status !== "Approved") {
      acc[a.type] = (acc[a.type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engineering Reports & Analytics"
        description="Comprehensive release velocity, DORA delivery metrics, and governance bottleneck analysis."
      />

      {/* DORA Metrics Panel */}
      <DoraMetricsPanel />

      {/* High Level Snapshot */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Releases Shipped" value={shipped} icon={Rocket} tone="accent" />
        <MetricCard label="Avg. Release Progress" value={`${avgProgress}%`} icon={Gauge} tone="info" />
        <MetricCard
          label="Avg. Approval Window"
          value={`${avgApprovalTurnaroundDays}d`}
          icon={Clock3}
          tone="warning"
        />
        <MetricCard
          label="Open Critical Risks"
          value={openCriticalRisks}
          icon={ShieldAlert}
          tone="danger"
          emphasize={openCriticalRisks > 0}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReleasesByEnvironmentChart releases={releases} />
        <ReleaseHealthPanel releases={releases} />
      </div>

      {/* Gate Bottleneck Breakdown */}
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Governance Gate Bottleneck Detection
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution of pending approvals across active release pipelines
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Object.entries(pendingByGate).map(([gate, count]) => (
            <div
              key={gate}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/40"
            >
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{gate}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Gate Type</p>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {count}
              </span>
            </div>
          ))}
          {Object.keys(pendingByGate).length === 0 && (
            <div className="col-span-3 flex items-center justify-center py-6 text-xs text-slate-400">
              <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-500" />
              All governance gates across active releases are approved.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
