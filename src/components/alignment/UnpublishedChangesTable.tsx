import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Check,
  Ticket,
} from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import type {
  UnpublishedChange,
  ChangeType,
} from "../../types/productionAlignment";

interface UnpublishedChangesTableProps {
  changes: UnpublishedChange[];
  repositoryName: string;
}

const typeStyles: Record<ChangeType, string> = {
  "Feature enhancement":
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  "Bug fix":
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  "Security patch":
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  "Configuration update":
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  "Dependency upgrade":
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
};

export function UnpublishedChangesTable({
  changes,
  repositoryName,
}: UnpublishedChangesTableProps) {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [copiedCommitId, setCopiedCommitId] = useState<string | null>(null);

  const filteredChanges =
    selectedType === "All"
      ? changes
      : changes.filter((c) => c.type === selectedType);

  const handleCopy = (commitId: string) => {
    navigator.clipboard.writeText(commitId);
    setCopiedCommitId(commitId);
    setTimeout(() => setCopiedCommitId(null), 1500);
  };

  return (
    <Card id="unpublished-changes" className="p-0 overflow-hidden scroll-mt-6">
      <div className="border-b border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Changes Not Yet Live in Production
              </h3>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                {changes.length} {changes.length === 1 ? "change" : "changes"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Commits committed to Release or Trunk branch that have not yet been deployed to Production
            </p>
          </div>

          {changes.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                aria-label="Filter changes by type"
              >
                <option value="All">All Change Types</option>
                <option value="Feature enhancement">Feature enhancement</option>
                <option value="Bug fix">Bug fix</option>
                <option value="Security patch">Security patch</option>
                <option value="Configuration update">Configuration update</option>
                <option value="Dependency upgrade">Dependency upgrade</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {changes.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
            All Changes Are Live in Production
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            There are zero pending commits or unreleased features for {repositoryName}. Production is fully aligned.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
                <th className="px-6 py-3 font-medium">Commit ID</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Jira Issue</th>
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredChanges.map((change) => (
                <tr
                  key={change.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/40"
                >
                  {/* Commit ID */}
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {change.commitId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(change.commitId)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        title="Copy commit hash"
                      >
                        {copiedCommitId === change.commitId ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <Badge className={typeStyles[change.type]}>
                      {change.type}
                    </Badge>
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {change.description}
                  </td>

                  {/* Jira Issue */}
                  <td className="px-4 py-3">
                    {change.jiraIssue ? (
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-blue-700 hover:underline dark:bg-slate-800 dark:text-blue-400">
                        <Ticket className="h-3 w-3" />
                        {change.jiraIssue}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>

                  {/* Branch */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        change.branch === "Release"
                          ? "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300"
                          : change.branch === "Hotfix"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                      }`}
                    >
                      {change.branch}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                    {change.author}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {change.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
