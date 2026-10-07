import { useState } from "react";
import {
  Ticket,
  ExternalLink,
  X,
  Filter,
  CheckCircle2,
  Clock,
  Ban,
  AlertCircle,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { useAppStore } from "../../store/useAppStore";
import type { ProductionRepositoryAlignment } from "../../types/productionAlignment";
import type { JiraStatus, JiraPriority } from "../../types";

interface RelatedJiraIssuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  repository: ProductionRepositoryAlignment;
  onViewRelease: () => void;
  onNavigateToJira: () => void;
}

const statusIcons: Record<JiraStatus, typeof CheckCircle2> = {
  "To Do": Clock,
  "In Progress": Clock,
  Done: CheckCircle2,
  Blocked: Ban,
};

const statusStyles: Record<JiraStatus, string> = {
  "To Do": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Done: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Blocked: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const priorityStyles: Record<JiraPriority, string> = {
  Critical: "text-red-700 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
  High: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  Medium: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  Low: "text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export function RelatedJiraIssuesModal({
  isOpen,
  onClose,
  repository,
  onViewRelease,
  onNavigateToJira,
}: RelatedJiraIssuesModalProps) {
  const allJiraIssues = useAppStore((state) => state.jiraIssues);
  const [filterType, setFilterType] = useState<string>("All");

  if (!isOpen) return null;

  // 1. Get issues linked through releaseId
  const releaseJiraIssues = repository.releaseId
    ? allJiraIssues.filter((j) => j.releaseId === repository.releaseId)
    : [];

  // 2. Collect commit-referenced Jira tickets
  const commitJiraKeys = Array.from(
    new Set(
      repository.changesNotInProduction
        .map((c) => c.jiraIssue)
        .filter((key): key is string => Boolean(key))
    )
  );

  // Match commit keys with existing store tickets or generate reference placeholders
  const commitReferencedIssues = commitJiraKeys.map((key) => {
    const existing = allJiraIssues.find((j) => j.key === key);
    if (existing) {
      return {
        ...existing,
        source: "Commit Tag & Release Scope",
      };
    }
    const matchingChange = repository.changesNotInProduction.find(
      (c) => c.jiraIssue === key
    );
    return {
      id: `gen-${key}`,
      key,
      summary: matchingChange ? matchingChange.description : `Work item ${key}`,
      type: "Story" as const,
      priority: "Medium" as const,
      assignee: matchingChange ? matchingChange.author : "Engineering Team",
      status: "In Progress" as const,
      releaseId: repository.releaseId || "N/A",
      source: "Unpublished Commit Tag",
    };
  });

  // Combine and deduplicate
  const combinedMap = new Map<string, any>();
  releaseJiraIssues.forEach((issue) => {
    combinedMap.set(issue.key, { ...issue, source: "Associated Release Scope" });
  });
  commitReferencedIssues.forEach((issue) => {
    if (combinedMap.has(issue.key)) {
      const cur = combinedMap.get(issue.key);
      combinedMap.set(issue.key, {
        ...cur,
        source: "Release Scope & Commit Tag",
      });
    } else {
      combinedMap.set(issue.key, issue);
    }
  });

  const allItems = Array.from(combinedMap.values());
  const filteredItems =
    filterType === "All"
      ? allItems
      : allItems.filter((item) => item.status === filterType);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="jira-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800 bg-amber-50/40 dark:bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="jira-modal-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100"
              >
                Related Jira Work Items
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {repository.repositoryName} · Associated Release:{" "}
                <span className="font-semibold text-violet-600 dark:text-violet-400">
                  {repository.releaseId || "Unassigned"}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium text-slate-600 dark:text-slate-400">
              Filter by Status:
            </span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              aria-label="Filter Jira items by status"
            >
              <option value="All">All Statuses ({allItems.length})</option>
              <option value="Done">Done</option>
              <option value="In Progress">In Progress</option>
              <option value="To Do">To Do</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <span className="text-slate-500 dark:text-slate-400">
            Showing {filteredItems.length} of {allItems.length} tickets
          </span>
        </div>

        {/* Body list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <AlertCircle className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-medium">No Jira issues match the filter</p>
            </div>
          ) : (
            filteredItems.map((issue) => {
              const StatusIcon = statusIcons[issue.status as JiraStatus] || Clock;
              return (
                <div
                  key={issue.key}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                          {issue.key}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {issue.type}
                        </span>
                        <Badge
                          className={`text-[10px] ${statusStyles[issue.status as JiraStatus] || "bg-slate-100"}`}
                        >
                          <StatusIcon className="mr-1 inline h-2.5 w-2.5" />
                          {issue.status}
                        </Badge>
                        <span
                          className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${priorityStyles[issue.priority as JiraPriority] || ""}`}
                        >
                          {issue.priority}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {issue.summary}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Assignee: <strong className="text-slate-700 dark:text-slate-300">{issue.assignee}</strong>
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {issue.source}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToJira();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open Full Jira Board
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewRelease();
              }}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open Release {repository.releaseId || "Overview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
