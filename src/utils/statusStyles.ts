import type {
  ApprovalStatus,
  Dependency,
  JiraStatus,
  NodeStatus,
  ReleasePackage,
  ReleaseStatus,
  RiskSeverity,
  AlignmentStatus,
} from "../types";

const badge = (classes: string) => classes;

export const releaseStatusStyles: Record<ReleaseStatus, string> = {
  "In Progress": badge("bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"),
  "Pending Approval": badge("bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"),
  "Ready for Deployment": badge("bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800"),
  Deployed: badge("bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"),
  Closed: badge("bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"),
  "At Risk": badge("bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"),
};

export const jiraStatusStyles: Record<JiraStatus, string> = {
  "To Do": badge("bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"),
  "In Progress": badge("bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"),
  Done: badge("bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"),
  Blocked: badge("bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"),
};

export const nodeStatusStyles: Record<NodeStatus, string> = {
  Healthy: badge("bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"),
  Warning: badge("bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"),
  Critical: badge("bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"),
};

export const approvalStatusStyles: Record<ApprovalStatus, string> = {
  Pending: badge("bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"),
  Approved: badge("bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"),
  Rejected: badge("bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"),
  "More Info Requested": badge("bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"),
};

export const riskSeverityStyles: Record<RiskSeverity, string> = {
  Low: badge("bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"),
  Medium: badge("bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"),
  High: badge("bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"),
  Critical: badge("bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"),
};

export const riskLevelSolidStyles: Record<RiskSeverity, string> = {
  Low: badge("bg-emerald-600 text-white border-emerald-600"),
  Medium: badge("bg-amber-500 text-white border-amber-500"),
  High: badge("bg-orange-600 text-white border-orange-600"),
  Critical: badge("bg-red-600 text-white border-red-600"),
};

export const alignmentStatusStyles: Record<AlignmentStatus, string> = {
  ALIGNED: badge("bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"),
  "RELEASE PENDING": badge("bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"),
  BEHIND: badge("bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"),
  DIVERGED: badge("bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"),
  "ATTENTION REQUIRED": badge("bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"),
};

/**
 * Statuses severe enough to warrant the extra visual weight of a leading
 * dot indicator on their badge — used so "At Risk", "Blocked", "Critical"
 * etc. read as unmistakably urgent at a glance, everywhere they appear.
 */
export const urgentReleaseStatuses = new Set<ReleaseStatus>(["At Risk"]);
export const urgentJiraStatuses = new Set<JiraStatus>(["Blocked"]);
export const urgentNodeStatuses = new Set<NodeStatus>(["Critical"]);
export const urgentRiskSeverities = new Set<RiskSeverity>(["Critical"]);
export const urgentApprovalStatuses = new Set<ApprovalStatus>(["Rejected"]);
export const urgentAlignmentStatuses = new Set<AlignmentStatus>(["DIVERGED", "ATTENTION REQUIRED"]);

export const packageStatusStyles: Record<ReleasePackage["status"], string> = {
  Pending: badge("bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"),
  Building: badge("bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"),
  Built: badge("bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800"),
  Deployed: badge("bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"),
  Failed: badge("bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"),
};

export const dependencyStatusStyles: Record<Dependency["status"], string> = {
  Satisfied: badge("bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"),
  Pending: badge("bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"),
  Blocked: badge("bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"),
};

/** Color-codes a 0-100 readiness score so it reads as good/caution/bad at a glance. */
export function readinessTone(score: number): string {
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export const priorityStyles: Record<string, string> = {
  Low: badge("bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"),
  Medium: badge("bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"),
  High: badge("bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"),
  Critical: badge("bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"),
};
