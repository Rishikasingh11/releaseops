import type {
  Approval,
  Dependency,
  Environment,
  FreezeWindow,
  JiraIssue,
  KubernetesNode,
  Release,
  Risk,
} from "../types";

const severityWeight: Record<Risk["severity"], number> = {
  Low: 10,
  Medium: 25,
  High: 50,
  Critical: 90,
};

export function isDateInFreezeWindow(date: string | Date, window: FreezeWindow): boolean {
  if (!window.enforced) return false;
  const target = new Date(date).getTime();
  const start = new Date(window.startDate).getTime();
  // Include the full end date (end of day)
  const end = new Date(`${window.endDate}T23:59:59.999Z`).getTime();
  return target >= start && target <= end;
}

export function getActiveFreezeWindows(
  windows: FreezeWindow[],
  environment: Environment,
  date: string = new Date().toISOString().slice(0, 10),
): FreezeWindow[] {
  return windows.filter(
    (w) =>
      w.enforced &&
      (w.environment === "All" || w.environment === environment) &&
      isDateInFreezeWindow(date, w),
  );
}

export function getReleaseProgress(release: Release, issues: JiraIssue[]): number {
  const releaseIssues = issues.filter((issue) =>
    release.jiraIssueIds.includes(issue.id),
  );
  if (releaseIssues.length === 0) return release.progress;

  const doneCount = releaseIssues.filter((issue) => issue.status === "Done").length;
  const issueProgress = Math.round((doneCount / releaseIssues.length) * 100);

  return Math.round((issueProgress + release.progress) / 2);
}

export function getApprovalCompletion(approvals: Approval[]): number {
  if (approvals.length === 0) return 100;
  const approved = approvals.filter((approval) => approval.status === "Approved").length;
  return Math.round((approved / approvals.length) * 100);
}

export function getRiskScore(risks: Risk[]): number {
  const openRisks = risks.filter((risk) => risk.status === "Open");
  if (openRisks.length === 0) return 0;

  const total = openRisks.reduce((sum, risk) => sum + severityWeight[risk.severity], 0);
  return Math.min(100, Math.round(total / openRisks.length));
}

export function getBlockedJiraIssues(issues: JiraIssue[]): JiraIssue[] {
  return issues.filter((issue) => issue.status === "Blocked");
}

export function getCriticalKubernetesNodes(nodes: KubernetesNode[]): KubernetesNode[] {
  return nodes.filter((node) => node.status === "Critical");
}

export function isApprovalOverdue(approval: Approval): boolean {
  if (approval.status === "Approved" || approval.status === "Rejected") return false;
  return new Date(approval.dueDate).getTime() < Date.now();
}

const pluralize = (count: number, noun: string, plural = `${noun}s`) =>
  `${count} ${count === 1 ? noun : plural}`;

export interface ReadinessBreakdown {
  score: number;
  blockers: string[];
}

/**
 * Deterministic, explainable readiness score. Every point deducted has a
 * corresponding human-readable blocker string so the UI can show "why".
 */
export function getReadinessBreakdown(
  release: Release,
  approvals: Approval[],
  risks: Risk[],
  issues: JiraIssue[],
  dependencies: Dependency[],
  nodes: KubernetesNode[],
  freezeWindows: FreezeWindow[] = [],
): ReadinessBreakdown {
  const blockers: string[] = [];
  let score = 100;

  // Check active freeze windows
  if (freezeWindows.length > 0) {
    const activeFreeze = getActiveFreezeWindows(freezeWindows, release.environment, release.targetDate);
    if (activeFreeze.length > 0) {
      score -= 20;
      blockers.push(`Deployment freeze in effect (${activeFreeze[0].name})`);
    }
  }

  const blockedIssues = getBlockedJiraIssues(issues);
  if (blockedIssues.length > 0) {
    score -= blockedIssues.length * 10;
    blockers.push(`${pluralize(blockedIssues.length, "blocked Jira issue")}`);
  }

  const criticalNodes = getCriticalKubernetesNodes(nodes);
  if (criticalNodes.length > 0) {
    score -= criticalNodes.length * 12;
    blockers.push(`${pluralize(criticalNodes.length, "critical Kubernetes node")}`);
  }

  const pendingApprovals = approvals.filter(
    (approval) => approval.status === "Pending" || approval.status === "More Info Requested",
  );
  pendingApprovals.forEach((approval) => {
    blockers.push(
      approval.status === "More Info Requested"
        ? `${approval.type} approval needs more information`
        : `${approval.type} approval pending`,
    );
  });
  score -= pendingApprovals.length * 8;

  const overdueApprovals = approvals.filter(isApprovalOverdue);
  if (overdueApprovals.length > 0) {
    score -= overdueApprovals.length * 6;
    blockers.push(`${pluralize(overdueApprovals.length, "overdue approval")}`);
  }

  const unresolvedDependencies = dependencies.filter((dep) => dep.status !== "Satisfied");
  if (unresolvedDependencies.length > 0) {
    score -= unresolvedDependencies.length * 8;
    blockers.push(`${pluralize(unresolvedDependencies.length, "unresolved dependency", "unresolved dependencies")}`);
  }

  const highRisks = risks.filter(
    (risk) => (risk.severity === "High" || risk.severity === "Critical") && risk.status === "Open",
  );
  if (highRisks.length > 0) {
    score -= highRisks.length * 10;
    blockers.push(`${pluralize(highRisks.length, "high/critical risk")} open`);
  }

  const progress = getReleaseProgress(release, issues);
  score = score * 0.7 + progress * 0.3;

  const daysToTarget = Math.ceil(
    (new Date(release.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (progress < 100 && daysToTarget <= 2) {
    score -= 10;
    blockers.push(
      daysToTarget < 0
        ? "Target date has passed"
        : daysToTarget === 0
          ? "Target date is today"
          : `Target date is only ${pluralize(daysToTarget, "day")} away`,
    );
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    blockers,
  };
}

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export function classifyRisk(score: number): RiskLevel {
  if (score >= 76) return "Critical";
  if (score >= 51) return "High";
  if (score >= 26) return "Medium";
  return "Low";
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: string[];
}

/**
 * Deterministic risk score (0-100, higher = riskier) built from the same
 * underlying signals as readiness, but scored upward from zero rather than
 * downward from 100 so it reads naturally as "risk" rather than "missing
 * readiness". Every point added has a matching human-readable factor.
 */
export function getRiskAssessment(
  release: Release,
  approvals: Approval[],
  risks: Risk[],
  issues: JiraIssue[],
  dependencies: Dependency[],
  nodes: KubernetesNode[],
  freezeWindows: FreezeWindow[] = [],
): RiskAssessment {
  const factors: string[] = [];
  let score = 0;

  if (freezeWindows.length > 0) {
    const activeFreeze = getActiveFreezeWindows(freezeWindows, release.environment, release.targetDate);
    if (activeFreeze.length > 0) {
      score += 25;
      factors.push(`Active change freeze in effect (${activeFreeze[0].name})`);
    }
  }

  const blockedIssues = getBlockedJiraIssues(issues);
  if (blockedIssues.length > 0) {
    score += blockedIssues.length * 15;
    factors.push(
      `${pluralize(blockedIssues.length, "Jira issue")} ${blockedIssues.length > 1 ? "are" : "is"} blocked`,
    );
  }

  const criticalNodes = getCriticalKubernetesNodes(nodes);
  if (criticalNodes.length > 0) {
    score += criticalNodes.length * 18;
    factors.push(
      `${pluralize(criticalNodes.length, "Kubernetes node")} ${criticalNodes.length > 1 ? "are" : "is"} critical`,
    );
  }

  const pendingApprovals = approvals.filter(
    (approval) => approval.status === "Pending" || approval.status === "More Info Requested",
  );
  pendingApprovals.forEach((approval) => {
    factors.push(
      approval.status === "More Info Requested"
        ? `${approval.type} approval needs more information`
        : `${approval.type} approval is pending`,
    );
  });
  score += pendingApprovals.length * 10;

  const overdueApprovals = approvals.filter(isApprovalOverdue);
  if (overdueApprovals.length > 0) {
    score += overdueApprovals.length * 12;
    factors.push(`${pluralize(overdueApprovals.length, "approval")} overdue`);
  }

  const unresolvedDependencies = dependencies.filter((dep) => dep.status !== "Satisfied");
  if (unresolvedDependencies.length > 0) {
    score += unresolvedDependencies.length * 8;
    factors.push(
      `${pluralize(unresolvedDependencies.length, "dependency", "dependencies")} unresolved`,
    );
  }

  const highSeverityRisks = risks.filter(
    (risk) => (risk.severity === "High" || risk.severity === "Critical") && risk.status === "Open",
  );
  if (highSeverityRisks.length > 0) {
    score += highSeverityRisks.length * 15;
    factors.push(`${pluralize(highSeverityRisks.length, "high-severity risk")} open`);
  }

  const progress = getReleaseProgress(release, issues);
  const daysToTarget = Math.ceil(
    (new Date(release.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (progress < 100 && daysToTarget <= 2) {
    score += 10;
    factors.push(
      daysToTarget < 0
        ? "target date has passed"
        : daysToTarget === 0
          ? "target date is today"
          : `target date is only ${pluralize(daysToTarget, "day")} away`,
    );
  }

  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: clampedScore,
    level: classifyRisk(clampedScore),
    factors,
  };
}

/**
 * Hard gates that must clear before a release can move to "Deployed",
 * regardless of overall readiness score.
 */
export function getDeploymentBlockers(
  approvals: Approval[],
  risks: Risk[],
  issues: JiraIssue[],
  nodes: KubernetesNode[],
  freezeWindows: FreezeWindow[] = [],
  environment?: Environment,
  targetDate?: string,
): string[] {
  const blockers: string[] = [];

  if (environment && freezeWindows.length > 0) {
    const active = getActiveFreezeWindows(freezeWindows, environment, targetDate);
    if (active.length > 0) {
      blockers.push(`Deployment freeze in effect (${active.map((w) => w.name).join(", ")})`);
    }
  }

  const blockedIssues = getBlockedJiraIssues(issues);
  if (blockedIssues.length > 0) {
    blockers.push(`${pluralize(blockedIssues.length, "blocked Jira issue")}`);
  }

  const criticalNodes = getCriticalKubernetesNodes(nodes);
  if (criticalNodes.length > 0) {
    blockers.push(`${pluralize(criticalNodes.length, "critical Kubernetes node")}`);
  }

  const openCriticalRisks = risks.filter(
    (risk) => risk.severity === "Critical" && risk.status === "Open",
  );
  if (openCriticalRisks.length > 0) {
    blockers.push(`${pluralize(openCriticalRisks.length, "open critical risk")}`);
  }

  const unapprovedApprovals = approvals.filter((approval) => approval.status !== "Approved");
  if (unapprovedApprovals.length > 0) {
    blockers.push(`${pluralize(unapprovedApprovals.length, "approval")} not yet approved`);
  }

  return blockers;
}
