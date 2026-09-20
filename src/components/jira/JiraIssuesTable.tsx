import type { JiraIssue, JiraStatus } from "../../types";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { jiraStatusStyles, priorityStyles } from "../../utils/statusStyles";
import { useAppStore } from "../../store/useAppStore";
import { useToastStore } from "../../store/useToastStore";

const STATUS_OPTIONS: JiraStatus[] = ["To Do", "In Progress", "Done", "Blocked"];

interface JiraIssuesTableProps {
  issues: JiraIssue[];
  showReleaseColumn?: boolean;
}

export function JiraIssuesTable({ issues, showReleaseColumn = false }: JiraIssuesTableProps) {
  const updateJiraIssue = useAppStore((state) => state.updateJiraIssue);
  const releases = useAppStore((state) => state.releases);
  const showToast = useToastStore((state) => state.showToast);

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
            <th className="px-6 py-3 font-medium">Issue Key</th>
            <th className="px-4 py-3 font-medium">Summary</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Assignee</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {showReleaseColumn && <th className="px-4 py-3 font-medium">Release</th>}
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => {
            const release = releases.find((r) => r.id === issue.releaseId);
            const isBlocked = issue.status === "Blocked";
            return (
              <tr
                key={issue.id}
                className={`border-b border-slate-100 last:border-0 dark:border-slate-700/50 ${
                  isBlocked ? "bg-red-50/40 hover:bg-red-50/70 dark:bg-red-900/10 dark:hover:bg-red-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-700/40"
                }`}
              >
                <td
                  className={`px-6 py-3 font-medium ${
                    isBlocked
                      ? "border-l-2 border-l-red-400 pl-[22px] text-slate-900 dark:text-slate-100"
                      : "text-slate-900 dark:text-slate-100"
                  }`}
                >
                  {issue.key}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{issue.summary}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{issue.type}</td>
                <td className="px-4 py-3">
                  <Badge className={priorityStyles[issue.priority]}>{issue.priority}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{issue.assignee}</td>
                <td className="px-4 py-3">
                  <select
                    value={issue.status}
                    onChange={(e) => {
                      const nextStatus = e.target.value as JiraStatus;
                      const wasBlocked = issue.status === "Blocked";
                      updateJiraIssue(issue.id, nextStatus);
                      showToast({
                        variant: wasBlocked && nextStatus === "Done" ? "success" : "info",
                        title:
                          wasBlocked && nextStatus === "Done"
                            ? `Blocker resolved on ${issue.key}`
                            : `${issue.key} moved to ${nextStatus}`,
                      });
                    }}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${jiraStatusStyles[issue.status]}`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                {showReleaseColumn && (
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{release?.name ?? "—"}</td>
                )}
              </tr>
            );
          })}
          {issues.length === 0 && (
            <tr>
              <td colSpan={showReleaseColumn ? 7 : 6} className="px-6 py-6 text-center text-sm text-slate-400">
                No issues found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}
