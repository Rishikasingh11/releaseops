import { useMemo } from "react";
import { useAppStore } from "./useAppStore";
import {
  getReadinessBreakdown,
  getRiskAssessment,
  type ReadinessBreakdown,
  type RiskAssessment,
} from "../utils/calculations";
import { getRecommendedActions } from "../utils/aiInsights";
import type { Approval, Dependency, JiraIssue, KubernetesNode, Release, Risk } from "../types";

/**
 * Selects the raw, stable array references from the store (each is only a
 * new reference when that slice of state actually changes), then derives
 * the release-scoped views with useMemo. Deriving inside the Zustand
 * selector itself would return a brand-new object/array on every call and
 * cause an infinite render loop with useSyncExternalStore.
 */
export function useReleaseWorkspace(releaseId: string | undefined) {
  const releases = useAppStore((state) => state.releases);
  const jiraIssues = useAppStore((state) => state.jiraIssues);
  const releasePackages = useAppStore((state) => state.releasePackages);
  const dependencies = useAppStore((state) => state.dependencies);
  const approvals = useAppStore((state) => state.approvals);
  const risks = useAppStore((state) => state.risks);
  const activities = useAppStore((state) => state.activities);
  const releaseNotes = useAppStore((state) => state.releaseNotes);
  const kubernetesClusters = useAppStore((state) => state.kubernetesClusters);
  const kubernetesNodes = useAppStore((state) => state.kubernetesNodes);

  return useMemo(() => {
    const release = releases.find((r) => r.id === releaseId);
    if (!release) {
      return {
        release: undefined,
        jiraIssues: [],
        packages: [],
        dependencies: [],
        approvals: [],
        risks: [],
        activities: [],
        notes: [],
        clusters: [],
        nodes: [],
      };
    }

    const scopedJiraIssues = jiraIssues.filter((issue) =>
      release.jiraIssueIds.includes(issue.id),
    );
    const scopedPackages = releasePackages.filter((pkg) =>
      release.packageIds.includes(pkg.id),
    );
    const scopedDependencies = dependencies.filter((dep) =>
      release.dependencyIds.includes(dep.id),
    );
    const scopedApprovals = approvals
      .filter((approval) => release.approvalIds.includes(approval.id))
      .sort((a, b) => a.order - b.order);
    const scopedRisks = risks.filter((risk) => release.riskIds.includes(risk.id));
    const scopedActivities = activities
      .filter((activity) => release.activityIds.includes(activity.id))
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    const scopedNotes = releaseNotes
      .filter((note) => release.noteIds.includes(note.id))
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    const scopedClusters = kubernetesClusters.filter((cluster) =>
      release.clusterIds.includes(cluster.id),
    );
    const scopedNodes = kubernetesNodes.filter((node) =>
      release.clusterIds.includes(node.clusterId),
    );

    return {
      release,
      jiraIssues: scopedJiraIssues,
      packages: scopedPackages,
      dependencies: scopedDependencies,
      approvals: scopedApprovals,
      risks: scopedRisks,
      activities: scopedActivities,
      notes: scopedNotes,
      clusters: scopedClusters,
      nodes: scopedNodes,
    };
  }, [
    releaseId,
    releases,
    jiraIssues,
    releasePackages,
    dependencies,
    approvals,
    risks,
    activities,
    releaseNotes,
    kubernetesClusters,
    kubernetesNodes,
  ]);
}

export interface ReleaseIntelligence {
  release: Release;
  jiraIssues: JiraIssue[];
  approvals: Approval[];
  risks: Risk[];
  dependencies: Dependency[];
  nodes: KubernetesNode[];
  readiness: ReadinessBreakdown;
  risk: RiskAssessment;
  actions: string[];
}

/**
 * The full deterministic "intelligence" computation for every release in
 * one place, so the Dashboard Command Center, the AI Insights page, and the
 * Release Overview AI Summary all read from the exact same numbers instead
 * of re-deriving (and potentially drifting from) their own copies.
 */
export function useReleaseIntelligence(): ReleaseIntelligence[] {
  const releases = useAppStore((state) => state.releases);
  const jiraIssues = useAppStore((state) => state.jiraIssues);
  const dependencies = useAppStore((state) => state.dependencies);
  const approvals = useAppStore((state) => state.approvals);
  const risks = useAppStore((state) => state.risks);
  const kubernetesNodes = useAppStore((state) => state.kubernetesNodes);

  return useMemo(() => {
    return releases.map((release) => {
      const scopedJiraIssues = jiraIssues.filter((issue) =>
        release.jiraIssueIds.includes(issue.id),
      );
      const scopedApprovals = approvals.filter((approval) =>
        release.approvalIds.includes(approval.id),
      );
      const scopedRisks = risks.filter((risk) => release.riskIds.includes(risk.id));
      const scopedDependencies = dependencies.filter((dep) =>
        release.dependencyIds.includes(dep.id),
      );
      const scopedNodes = kubernetesNodes.filter((node) =>
        release.clusterIds.includes(node.clusterId),
      );

      const readiness = getReadinessBreakdown(
        release,
        scopedApprovals,
        scopedRisks,
        scopedJiraIssues,
        scopedDependencies,
        scopedNodes,
      );
      const risk = getRiskAssessment(
        release,
        scopedApprovals,
        scopedRisks,
        scopedJiraIssues,
        scopedDependencies,
        scopedNodes,
      );
      const actions = getRecommendedActions(
        scopedJiraIssues,
        scopedNodes,
        scopedApprovals,
        scopedDependencies,
        scopedRisks,
      );

      return {
        release,
        jiraIssues: scopedJiraIssues,
        approvals: scopedApprovals,
        risks: scopedRisks,
        dependencies: scopedDependencies,
        nodes: scopedNodes,
        readiness,
        risk,
        actions,
      };
    });
  }, [releases, jiraIssues, approvals, risks, dependencies, kubernetesNodes]);
}
