import { useState } from "react";
import { ListChecks, Circle, Loader, CheckCircle2, Ban } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { MetricCard } from "../components/common/MetricCard";
import { JiraIssuesTable } from "../components/jira/JiraIssuesTable";
import { useAppStore } from "../store/useAppStore";
import type { JiraPriority, JiraStatus } from "../types";

const STATUS_FILTERS: (JiraStatus | "All")[] = ["All", "To Do", "In Progress", "Done", "Blocked"];
const PRIORITY_FILTERS: (JiraPriority | "All")[] = ["All", "Low", "Medium", "High", "Critical"];

export function JiraPage() {
  const issues = useAppStore((state) => state.jiraIssues);
  const [statusFilter, setStatusFilter] = useState<JiraStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<JiraPriority | "All">("All");

  const total = issues.length;
  const toDo = issues.filter((i) => i.status === "To Do").length;
  const inProgress = issues.filter((i) => i.status === "In Progress").length;
  const done = issues.filter((i) => i.status === "Done").length;
  const blocked = issues.filter((i) => i.status === "Blocked").length;

  const filtered = issues.filter(
    (issue) =>
      (statusFilter === "All" || issue.status === statusFilter) &&
      (priorityFilter === "All" || issue.priority === priorityFilter),
  );

  return (
    <div>
      <PageHeader title="Jira" description="Simulated Jira tickets linked to releases, epics, and sprints." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Total Issues" value={total} icon={ListChecks} tone="info" />
        <MetricCard label="To Do" value={toDo} icon={Circle} tone="neutral" />
        <MetricCard label="In Progress" value={inProgress} icon={Loader} tone="info" />
        <MetricCard label="Done" value={done} icon={CheckCircle2} tone="success" />
        <MetricCard label="Blocked" value={blocked} icon={Ban} tone="danger" emphasize={blocked > 0} />
      </div>

      <div className="my-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as JiraStatus | "All")}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            {STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Priority</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as JiraPriority | "All")}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            {PRIORITY_FILTERS.map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </div>

      <JiraIssuesTable issues={filtered} showReleaseColumn />
    </div>
  );
}
