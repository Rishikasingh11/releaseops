import { GitBranch, Boxes, ShieldAlert, Link2 } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { Reveal } from "../components/common/Reveal";
import { OverallReadinessPanel } from "../components/ai/OverallReadinessPanel";
import { ReleaseRiskCard } from "../components/ai/ReleaseRiskCard";
import { EntityRiskList, type EntityRiskItem } from "../components/ai/EntityRiskList";
import { RecommendedActionsPanel } from "../components/ai/RecommendedActionsPanel";
import { useReleaseIntelligence } from "../store/selectors";

export function AiInsightsPage() {
  const intelligence = useReleaseIntelligence();
  const active = intelligence.filter((i) => i.release.status !== "Closed");

  const rankedByRisk = [...active].sort((a, b) => b.risk.score - a.risk.score);

  const blockerItems: EntityRiskItem[] = active.flatMap((i) => [
    ...i.jiraIssues
      .filter((issue) => issue.status === "Blocked")
      .map((issue) => ({
        key: `issue-${issue.id}`,
        label: `${issue.key}: ${issue.summary}`,
        detail: `Blocked · ${issue.priority} priority`,
        releaseId: i.release.id,
        releaseName: i.release.name,
      })),
    ...i.nodes
      .filter((node) => node.status === "Critical")
      .map((node) => ({
        key: `${i.release.id}-node-${node.id}`,
        label: node.name,
        detail: "Critical Kubernetes node",
        releaseId: i.release.id,
        releaseName: i.release.name,
      })),
  ]);

  const dependencyItems: EntityRiskItem[] = active.flatMap((i) =>
    i.dependencies
      .filter((dep) => dep.status !== "Satisfied")
      .map((dep) => ({
        key: `dep-${dep.id}`,
        label: dep.name,
        detail: `${dep.type} · ${dep.status}`,
        releaseId: i.release.id,
        releaseName: i.release.name,
      })),
  );

  const infrastructureItems: EntityRiskItem[] = active.flatMap((i) =>
    i.nodes
      .filter((node) => node.status !== "Healthy")
      .map((node) => ({
        key: `${i.release.id}-infra-${node.id}`,
        label: node.name,
        detail: `${node.status} · CPU ${node.cpuUsage}% · Memory ${node.memoryUsage}%`,
        releaseId: i.release.id,
        releaseName: i.release.name,
      })),
  );

  const approvalItems: EntityRiskItem[] = active.flatMap((i) =>
    i.approvals
      .filter((approval) => approval.status === "Pending" || approval.status === "More Info Requested")
      .map((approval) => ({
        key: `approval-${approval.id}`,
        label: `${approval.type} approval`,
        detail: `${approval.approver} · ${approval.status}`,
        releaseId: i.release.id,
        releaseName: i.release.name,
      })),
  );

  return (
    <div>
      <PageHeader
        title="AI Release Intelligence Center"
        description="Deterministic, rule-based analysis of every active release — every insight traces back to real Jira, Kubernetes, approval, and dependency data."
      />

      <div className="space-y-6">
        <Reveal index={0}>
          <OverallReadinessPanel intelligence={intelligence} />
        </Reveal>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Release Risk Scores</h2>
          <div className="space-y-4">
            {rankedByRisk.map((item, index) => (
              <Reveal key={item.release.id} index={index + 1}>
                <ReleaseRiskCard intelligence={item} />
              </Reveal>
            ))}
            {rankedByRisk.length === 0 && (
              <p className="text-sm text-slate-400">No active releases to analyze.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <EntityRiskList
            title="Critical Blockers"
            icon={ShieldAlert}
            items={blockerItems}
            emptyMessage="No blocked Jira issues or critical nodes across active releases."
          />
          <EntityRiskList
            title="Dependency Risk"
            icon={Link2}
            items={dependencyItems}
            emptyMessage="All dependencies are satisfied."
          />
          <EntityRiskList
            title="Infrastructure Risk"
            icon={Boxes}
            items={infrastructureItems}
            emptyMessage="All Kubernetes nodes are healthy."
          />
          <EntityRiskList
            title="Approval Risk"
            icon={GitBranch}
            items={approvalItems}
            emptyMessage="No pending or overdue approvals."
          />
        </div>

        <RecommendedActionsPanel intelligence={active} />
      </div>
    </div>
  );
}
