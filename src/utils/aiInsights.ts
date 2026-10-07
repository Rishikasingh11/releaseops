import type {
  Approval,
  Dependency,
  JiraIssue,
  KubernetesNode,
  Release,
  Risk,
  ProductionRepositoryAlignment,
} from "../types";
import {
  getBlockedJiraIssues,
  getCriticalKubernetesNodes,
  isApprovalOverdue,
  type ReadinessBreakdown,
} from "./calculations";
import { formatDate } from "./format";

/**
 * Specific, named, actionable recommendations — every entry is traceable to
 * a real record (a Jira key, a node name, an approval type, a dependency or
 * risk title, or repository alignment), ordered most-urgent first:
 * divergence and infrastructure blockers, code blockers, then approvals,
 * then dependencies and risks.
 */
export function getRecommendedActions(
  jiraIssues: JiraIssue[],
  nodes: KubernetesNode[],
  approvals: Approval[],
  dependencies: Dependency[],
  risks: Risk[],
  alignments: ProductionRepositoryAlignment[] = [],
): string[] {
  const actions: string[] = [];

  // Urgent: Production repository divergence
  const divergedRepos = alignments.filter((r) => r.alignmentStatus === "DIVERGED");
  divergedRepos.forEach((repo) =>
    actions.push(
      `Investigate ${repo.repositoryName} divergence before approving the next Production release`,
    ),
  );

  getCriticalKubernetesNodes(nodes).forEach((node) =>
    actions.push(`Resolve critical node ${node.name}`),
  );

  getBlockedJiraIssues(jiraIssues).forEach((issue) =>
    actions.push(`Unblock Jira issue ${issue.key} (${issue.summary})`),
  );

  approvals
    .filter((approval) => approval.status === "Pending" || approval.status === "More Info Requested")
    .forEach((approval) =>
      actions.push(
        approval.status === "More Info Requested"
          ? `Provide the requested information for the ${approval.type} approval`
          : `Complete the ${approval.type} approval`,
      ),
    );

  approvals.filter(isApprovalOverdue).forEach((approval) =>
    actions.push(`Escalate the overdue ${approval.type} approval (was due ${formatDate(approval.dueDate)})`),
  );

  dependencies
    .filter((dep) => dep.status !== "Satisfied")
    .forEach((dep) => actions.push(`Resolve dependency: ${dep.name}`));

  risks
    .filter((risk) => (risk.severity === "High" || risk.severity === "Critical") && risk.status === "Open")
    .forEach((risk) => actions.push(`Mitigate risk: ${risk.title}`));

  // Pending / Behind deployments
  const pendingRepos = alignments.filter(
    (r) => r.alignmentStatus === "RELEASE PENDING" || r.alignmentStatus === "BEHIND",
  );
  pendingRepos.forEach((repo) =>
    actions.push(`Review the pending deployment for ${repo.repositoryName}`),
  );

  const attentionRepos = alignments.filter((r) => r.alignmentStatus === "ATTENTION REQUIRED");
  attentionRepos.forEach((repo) =>
    actions.push(
      `Schedule an accelerated deployment window for ${repo.repositoryName} (${repo.commitsAheadReleaseVsProd} commits behind)`,
    ),
  );

  return actions;
}

/**
 * Joins the top 1-2 recommended actions into a single readable sentence,
 * e.g. "Resolve critical node node-04 and complete the Security approval."
 */
export function composeRecommendation(actions: string[]): string {
  if (actions.length === 0) return "No action needed — release is on track for deployment";
  if (actions.length === 1) return actions[0];

  const [first, second] = actions;
  return `${first} and ${second.charAt(0).toLowerCase()}${second.slice(1)}`;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function joinWithAnd(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * Generates the "Release AI Summary" paragraph purely from this release's
 * current live data — same inputs always produce the same sentence.
 */
export function generateReleaseSummary(
  release: Release,
  readiness: ReadinessBreakdown,
  jiraIssues: JiraIssue[],
  approvals: Approval[],
  nodes: KubernetesNode[],
  actions: string[],
  alignments: ProductionRepositoryAlignment[] = [],
): string {
  const blockedIssues = getBlockedJiraIssues(jiraIssues);
  const pendingApprovals = approvals.filter(
    (approval) => approval.status === "Pending" || approval.status === "More Info Requested",
  );
  const unhealthyNodes = nodes.filter((node) => node.status !== "Healthy");

  const sentences: string[] = [
    `Release ${release.id} is ${readiness.score}% ready for deployment.`,
  ];

  const issueClause =
    blockedIssues.length > 0
      ? `${blockedIssues.length === 1 ? "One" : blockedIssues.length} Jira issue${blockedIssues.length === 1 ? "" : "s"} remain${blockedIssues.length === 1 ? "" : "s"} blocked`
      : null;
  const approvalClause =
    pendingApprovals.length > 0
      ? `${joinWithAnd(pendingApprovals.map((a) => a.type))} approval${pendingApprovals.length > 1 ? "s are" : " is"} pending`
      : null;

  if (issueClause && approvalClause) {
    sentences.push(`${issueClause}, and ${approvalClause}.`);
  } else if (issueClause) {
    sentences.push(`${issueClause}.`);
  } else if (approvalClause) {
    sentences.push(`${capitalize(approvalClause)}.`);
  } else {
    sentences.push("All Jira issues are complete and all approvals are in order.");
  }

  sentences.push(
    unhealthyNodes.length > 0
      ? `Infrastructure health needs attention (${unhealthyNodes.length} node${unhealthyNodes.length > 1 ? "s" : ""} not healthy).`
      : "Infrastructure health is stable.",
  );

  // Production Alignment clause
  if (alignments.length > 0) {
    const diverged = alignments.find((r) => r.alignmentStatus === "DIVERGED");
    const attention = alignments.find((r) => r.alignmentStatus === "ATTENTION REQUIRED");
    const pending = alignments.find(
      (r) => r.alignmentStatus === "RELEASE PENDING" || r.alignmentStatus === "BEHIND",
    );

    if (diverged) {
      sentences.push(
        `Production Alignment alert: ${diverged.repositoryName} shows unexpected divergence between Production and Release (${diverged.commitsAheadReleaseVsProd} commits drift).`,
      );
    } else if (attention) {
      sentences.push(
        `Production Alignment warning: ${attention.repositoryName} has ${attention.commitsAheadReleaseVsProd} commits awaiting deployment and is 2 versions behind.`,
      );
    } else if (pending) {
      sentences.push(
        `Production Alignment: ${pending.repositoryName} release ${pending.releaseVersion} is awaiting deployment to Production with ${pending.commitsAheadReleaseVsProd} commits staged.`,
      );
    } else {
      sentences.push(
        `Production Alignment: ${alignments[0].repositoryName} is fully aligned with live Production.`,
      );
    }
  }

  sentences.push(`Recommended action: ${composeRecommendation(actions)}.`);

  return sentences.join(" ");
}

export interface AlignmentAiInsight {
  id: string;
  severity: "critical" | "warning" | "info" | "success";
  title: string;
  description: string;
  recommendation: string;
  repositoryId: string;
  releaseId?: string;
  releaseName?: string;
}

/**
 * Deterministic, rule-based AI insights generated from live repository alignment data.
 */
export function generateAlignmentAiInsights(
  alignments: ProductionRepositoryAlignment[],
): AlignmentAiInsight[] {
  const insights: AlignmentAiInsight[] = [];

  alignments.forEach((repo) => {
    if (repo.alignmentStatus === "DIVERGED") {
      insights.push({
        id: `align-insight-${repo.repositoryId}`,
        severity: "critical",
        title: `${repo.repositoryName} shows unexpected divergence between Production and Release`,
        description: `${repo.repositoryName} has ${repo.commitsAheadReleaseVsProd} commits in Release candidate that conflict with untracked Production commit ${repo.productionCommit}. Hotfix lineage drift detected.`,
        recommendation: `Investigate ${repo.repositoryName} divergence before approving the next Production release. Backport production hotfix to Release and Trunk immediately.`,
        repositoryId: repo.repositoryId,
        releaseId: repo.releaseId,
        releaseName: repo.releaseName,
      });
    } else if (repo.alignmentStatus === "ATTENTION REQUIRED") {
      insights.push({
        id: `align-insight-${repo.repositoryId}`,
        severity: "warning",
        title: `${repo.repositoryName} is significantly behind active Release branch`,
        description: `Production is running ${repo.productionVersion} while Release branch has reached ${repo.releaseVersion} (${repo.commitsAheadReleaseVsProd} unreleased commits). Trunk is already at ${repo.trunkVersion}.`,
        recommendation: `Schedule an accelerated deployment window for ${repo.repositoryName} to prevent release debt and configuration drift.`,
        repositoryId: repo.repositoryId,
        releaseId: repo.releaseId,
        releaseName: repo.releaseName,
      });
    } else if (repo.alignmentStatus === "RELEASE PENDING") {
      insights.push({
        id: `align-insight-${repo.repositoryId}`,
        severity: "info",
        title: `${repo.repositoryName} has ${repo.commitsAheadReleaseVsProd} commits that are not yet present in Production`,
        description: `Release candidate ${repo.releaseVersion} is tested and staged. Production is currently on ${repo.productionVersion}.`,
        recommendation: `Review the pending deployment for ${repo.repositoryName} in Release governance workflow before authorizing deployment.`,
        repositoryId: repo.repositoryId,
        releaseId: repo.releaseId,
        releaseName: repo.releaseName,
      });
    } else if (repo.alignmentStatus === "BEHIND") {
      insights.push({
        id: `align-insight-${repo.repositoryId}`,
        severity: "warning",
        title: `${repo.repositoryName} is behind current Release candidate`,
        description: `Production is 1 version behind Release ${repo.releaseVersion} with ${repo.commitsAheadReleaseVsProd} unreleased changes.`,
        recommendation: `Review release readiness and complete governance approvals for Release ${repo.releaseVersion} during upcoming change window.`,
        repositoryId: repo.repositoryId,
        releaseId: repo.releaseId,
        releaseName: repo.releaseName,
      });
    } else if (repo.alignmentStatus === "ALIGNED") {
      insights.push({
        id: `align-insight-${repo.repositoryId}`,
        severity: "success",
        title: `${repo.repositoryName} is fully aligned with its current Release`,
        description: `Trunk, Release branch, and live Production runtime all match at version ${repo.productionVersion} (${repo.productionCommit}) with 0 commits drift.`,
        recommendation: `No action required. Repository maintains zero-drift release compliance.`,
        repositoryId: repo.repositoryId,
        releaseId: repo.releaseId,
        releaseName: repo.releaseName,
      });
    }
  });

  return insights;
}
