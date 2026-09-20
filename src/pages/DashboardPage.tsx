import { Rocket, Clock, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { MetricCard } from "../components/common/MetricCard";
import { Reveal } from "../components/common/Reveal";
import { CommandCenter } from "../components/dashboard/CommandCenter";
import { RecentReleasesTable } from "../components/dashboard/RecentReleasesTable";
import { DeploymentReadinessOverview } from "../components/dashboard/DeploymentReadinessOverview";
import { PendingApprovalsPanel } from "../components/dashboard/PendingApprovalsPanel";
import { ReleaseHealthPanel } from "../components/dashboard/ReleaseHealthPanel";
import { RecentActivityPanel } from "../components/dashboard/RecentActivityPanel";
import { useAppStore } from "../store/useAppStore";

export function DashboardPage() {
  const releases = useAppStore((state) => state.releases);

  const total = releases.length;
  const inProgress = releases.filter((r) => r.status === "In Progress").length;
  const pendingApproval = releases.filter((r) => r.status === "Pending Approval").length;
  const atRisk = releases.filter((r) => r.status === "At Risk").length;
  const readyForDeployment = releases.filter((r) => r.status === "Ready for Deployment").length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="High-level overview of release health, upcoming deployments, and key metrics."
      />

      <Reveal index={0}>
        <CommandCenter />
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Reveal index={1}>
          <MetricCard label="Total Releases" value={total} icon={Rocket} tone="info" />
        </Reveal>
        <Reveal index={2}>
          <MetricCard label="In Progress" value={inProgress} icon={Clock} tone="info" />
        </Reveal>
        <Reveal index={3}>
          <MetricCard label="Pending Approvals" value={pendingApproval} icon={ShieldAlert} tone="warning" emphasize={pendingApproval > 0} />
        </Reveal>
        <Reveal index={4}>
          <MetricCard label="At Risk" value={atRisk} icon={AlertTriangle} tone="danger" emphasize={atRisk > 0} />
        </Reveal>
        <Reveal index={5}>
          <MetricCard label="Ready for Deployment" value={readyForDeployment} icon={CheckCircle2} tone="accent" />
        </Reveal>
      </div>

      <Reveal index={6} className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Recent Releases</h2>
        <RecentReleasesTable releases={releases} />
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal index={7}>
          <DeploymentReadinessOverview releases={releases} />
        </Reveal>
        <Reveal index={8}>
          <ReleaseHealthPanel releases={releases} />
        </Reveal>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal index={9}>
          <PendingApprovalsPanel />
        </Reveal>
        <Reveal index={10}>
          <RecentActivityPanel />
        </Reveal>
      </div>
    </div>
  );
}
