import { Sparkles, Rocket, Gauge, Clock3, ShieldAlert } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { MetricCard } from "../components/common/MetricCard";
import { Card } from "../components/common/Card";
import { ReleaseHealthPanel } from "../components/dashboard/ReleaseHealthPanel";
import { ReleasesByEnvironmentChart } from "../components/reports/ReleasesByEnvironmentChart";
import { useAppStore } from "../store/useAppStore";
import { useReleaseIntelligence } from "../store/selectors";
import { getReleaseProgress } from "../utils/calculations";

const UPCOMING_REPORTS = [
  "Release velocity trends over time, by team and environment",
  "Deployment frequency vs. change failure rate (DORA metrics)",
  "Approval cycle time by gate, with bottleneck detection",
  "Exportable audit trail for compliance sign-off",
];

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

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Release velocity, deployment frequency, and quality analytics."
      />

      <Card className="relative overflow-hidden border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-100/60 blur-2xl" />
        <div className="absolute -bottom-10 right-24 h-24 w-24 rounded-full bg-blue-100/60 blur-2xl" />
        <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-violet-700">Full Reports — Coming Soon</p>
              <p className="text-sm text-slate-600">
                Trend lines, DORA metrics, and exportable audits are on the way. Until then, here's a
                live snapshot pulled from your current release data.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReleasesByEnvironmentChart releases={releases} />
        <ReleaseHealthPanel releases={releases} />
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">What's coming next</h2>
        <ul className="space-y-2">
          {UPCOMING_REPORTS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
