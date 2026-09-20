import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Release } from "../../types";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { ProgressBar } from "../common/ProgressBar";
import { releaseStatusStyles, urgentReleaseStatuses, readinessTone } from "../../utils/statusStyles";
import { formatDate } from "../../utils/format";
import { ROUTES } from "../../routes/paths";
import { useReleaseIntelligence } from "../../store/selectors";
import { getReleaseProgress } from "../../utils/calculations";

interface RecentReleasesTableProps {
  releases: Release[];
}

export function RecentReleasesTable({ releases }: RecentReleasesTableProps) {
  const navigate = useNavigate();
  const intelligence = useReleaseIntelligence();

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
            <th className="px-6 py-3 font-medium">Release</th>
            <th className="px-4 py-3 font-medium">Version</th>
            <th className="px-4 py-3 font-medium">Environment</th>
            <th className="px-4 py-3 font-medium">Target Date</th>
            <th className="px-4 py-3 font-medium">Progress</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Readiness</th>
            <th className="w-8 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => {
            const item = intelligence.find((i) => i.release.id === release.id);
            const progress = item ? getReleaseProgress(release, item.jiraIssues) : release.progress;
            const readinessScore = item?.readiness.score ?? release.progress;

            return (
              <tr
                key={release.id}
                onClick={() => navigate(ROUTES.releaseDetailPath(release.id))}
                className="group cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/40"
              >
                <td className="px-6 py-3">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{release.name}</p>
                  <p className="text-xs text-slate-400">{release.id}</p>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{release.version}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{release.environment}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(release.targetDate)}</td>
                <td className="px-4 py-3">
                  <ProgressBar value={progress} />
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={releaseStatusStyles[release.status]}
                    dot={urgentReleaseStatuses.has(release.status)}
                  >
                    {release.status}
                  </Badge>
                </td>
                <td className={`px-4 py-3 font-semibold ${readinessTone(readinessScore)}`}>
                  {readinessScore}%
                </td>
                <td className="px-4 py-3 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-400">
                  <ChevronRight className="h-4 w-4" />
                </td>
              </tr>
            );
          })}
          {releases.length === 0 && (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-400">
                No releases match this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}
