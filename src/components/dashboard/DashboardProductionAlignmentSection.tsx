import { useNavigate } from "react-router-dom";
import {
  GitCompare,
  GitBranch,
  ChevronRight,
} from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import {
  alignmentStatusStyles,
  urgentAlignmentStatuses,
} from "../../utils/statusStyles";
import { summarizeAlignmentMetrics } from "../../utils/alignmentLogic";
import { ROUTES } from "../../routes/paths";
import { useAppStore } from "../../store/useAppStore";

export function DashboardProductionAlignmentSection() {
  const navigate = useNavigate();
  const alignments = useAppStore((state) => state.productionAlignments);
  const metrics = summarizeAlignmentMetrics(alignments);

  // Take top 4 most interesting repos (prioritizing diverged and pending)
  const prioritizedRepos = [...alignments]
    .sort((a, b) => {
      const order = {
        DIVERGED: 0,
        "ATTENTION REQUIRED": 1,
        "RELEASE PENDING": 2,
        BEHIND: 3,
        ALIGNED: 4,
      };
      return order[a.alignmentStatus] - order[b.alignmentStatus];
    })
    .slice(0, 4);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            <GitCompare className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Production Alignment
              </h2>
              <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                {metrics.total} Repositories
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fleet-wide branch and commit synchronization with live Production runtime
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.productionAlignment)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View All
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 divide-x divide-y sm:divide-y-0 sm:grid-cols-4 divide-slate-100 border-b border-slate-100 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        <div className="p-3 text-center sm:text-left sm:px-4">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
            Aligned
          </span>
          <p className="mt-0.5 text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {metrics.aligned} <span className="text-xs font-normal text-slate-400">repos</span>
          </p>
        </div>
        <div className="p-3 text-center sm:text-left sm:px-4">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
            Release Pending
          </span>
          <p className="mt-0.5 text-lg font-bold text-amber-600 dark:text-amber-400">
            {metrics.releasePending} <span className="text-xs font-normal text-slate-400">repos</span>
          </p>
        </div>
        <div className="p-3 text-center sm:text-left sm:px-4">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
            Behind
          </span>
          <p className="mt-0.5 text-lg font-bold text-orange-600 dark:text-orange-400">
            {metrics.productionBehind} <span className="text-xs font-normal text-slate-400">repo</span>
          </p>
        </div>
        <div className="p-3 text-center sm:text-left sm:px-4">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
            Diverged / Attention
          </span>
          <p className="mt-0.5 text-lg font-bold text-red-600 dark:text-red-400">
            {metrics.divergedOrAttention} <span className="text-xs font-normal text-slate-400">repos</span>
          </p>
        </div>
      </div>

      {/* Compact Repository Highlights */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {prioritizedRepos.map((repo) => {
          const isUrgent = urgentAlignmentStatuses.has(repo.alignmentStatus);

          return (
            <div
              key={repo.repositoryId}
              onClick={() =>
                navigate(ROUTES.productionAlignmentDetailPath(repo.repositoryId))
              }
              className="group flex cursor-pointer items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <GitBranch className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                      {repo.repositoryName}
                    </span>
                    <span className="hidden font-mono text-xs text-slate-400 sm:inline">
                      (Prod: {repo.productionVersion} vs Rel: {repo.releaseVersion})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {repo.applicationName}
                    {repo.releaseName && ` · Release: ${repo.releaseName}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={alignmentStatusStyles[repo.alignmentStatus]}
                  dot={isUrgent}
                >
                  {repo.alignmentStatus}
                </Badge>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400" />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
