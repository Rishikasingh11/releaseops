import type { Approval, Dependency, JiraIssue, KubernetesNode, Release, Risk } from "../types";
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
 * risk title), ordered most-urgent first: infrastructure and code blockers,
 * then approvals, then dependencies and risks.
 */
export function getRecommendedActions(
  jiraIssues: JiraIssue[],
  nodes: KubernetesNode[],
  approvals: Approval[],
  dependencies: Dependency[],
  risks: Risk[],
): string[] {
  const actions: string[] = [];

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
      ? `${blockedIssues.length === 1 ? "One" : blockedIssues.length} Jira issue${blockedIssues.length === 1 ? "" : "s"} remain${blockedIssues.length === 1 ? "s" : ""} blocked`
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

  sentences.push(`Recommended action: ${composeRecommendation(actions)}.`);

  return sentences.join(" ");
}
