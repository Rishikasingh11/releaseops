import { useNavigate } from "react-router-dom";
import {
  GitCompare,
  GitBranch,
  ExternalLink,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import {
  alignmentStatusStyles,
  urgentAlignmentStatuses,
} from "../../utils/statusStyles";
import { ROUTES } from "../../routes/paths";
import type { ProductionRepositoryAlignment } from "../../types/productionAlignment";

interface ReleaseProductionAlignmentCardProps {
  alignments: ProductionRepositoryAlignment[];
  releaseName: string;
}

export function ReleaseProductionAlignmentCard({
  alignments,
  releaseName,
}: ReleaseProductionAlignmentCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            <GitCompare className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Production Alignment
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live Production-to-branch synchronization for {releaseName}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.productionAlignment)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View All Repositories
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {alignments.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-400">
          No production repositories directly associated with this release.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {alignments.map((repo) => {
            const isUrgent = urgentAlignmentStatuses.has(repo.alignmentStatus);
            const isDiverged = repo.alignmentStatus === "DIVERGED";

            return (
              <div key={repo.repositoryId} className="p-4 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <GitBranch className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {repo.repositoryName}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({repo.applicationName})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Environment: <span className="font-medium text-slate-700 dark:text-slate-300">{repo.environment}</span>
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

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          ROUTES.productionAlignmentDetailPath(repo.repositoryId),
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-blue-400"
                    >
                      View Alignment
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Versions and Commits Grid */}
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-xs sm:grid-cols-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <div>
                    <span className="text-slate-400">Trunk Version</span>
                    <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {repo.trunkVersion}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Release Version</span>
                    <p className="font-mono font-semibold text-violet-700 dark:text-violet-400">
                      {repo.releaseVersion}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Production Version</span>
                    <p className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      {repo.productionVersion}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Commits Ahead</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {repo.commitsAheadReleaseVsProd > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400">
                          +{repo.commitsAheadReleaseVsProd} commits
                        </span>
                      ) : isDiverged ? (
                        <span className="text-red-600 dark:text-red-400">
                          Diverged
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          0 (Aligned)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Explanation Snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Sync Analysis:{" "}
                  </span>
                  {repo.explanation}
                </p>

                {isDiverged && (
                  <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>
                      Critical divergence: An unmerged production hotfix is currently running in live production!
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
