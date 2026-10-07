import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GitBranch,
  GitCommit,
  Clock,
  Layers,
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { AlignmentLineageVisualizer } from "../components/alignment/AlignmentLineageVisualizer";
import { AlignmentAnalysisCard } from "../components/alignment/AlignmentAnalysisCard";
import { UnpublishedChangesTable } from "../components/alignment/UnpublishedChangesTable";
import {
  alignmentStatusStyles,
  urgentAlignmentStatuses,
} from "../utils/statusStyles";
import { ROUTES } from "../routes/paths";
import { useAppStore } from "../store/useAppStore";

export function ProductionAlignmentDetailPage() {
  const { repositoryId } = useParams<{ repositoryId: string }>();
  const navigate = useNavigate();

  const repository = useAppStore((state) =>
    state.productionAlignments.find((r) => r.repositoryId === repositoryId)
  );

  if (!repository) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate(ROUTES.productionAlignment)}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Production Alignment
        </button>

        <Card className="p-12 text-center">
          <GitBranch className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            Repository Not Found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The repository "{repositoryId}" could not be located in the production alignment index.
          </p>
        </Card>
      </div>
    );
  }

  const isUrgent = urgentAlignmentStatuses.has(repository.alignmentStatus);

  return (
    <div className="space-y-6">
      {/* Top back navigation */}
      <div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.productionAlignment)}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Production Alignment
        </button>
      </div>

      {/* Header section */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {repository.repositoryName}
            </h1>
            <Badge
              className={alignmentStatusStyles[repository.alignmentStatus]}
              dot={isUrgent}
            >
              {repository.alignmentStatus}
            </Badge>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {repository.environment}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Application: <span className="font-semibold text-slate-700 dark:text-slate-300">{repository.applicationName}</span>
            {" · "}
            Live Production Version: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{repository.productionVersion}</span>
            {repository.releaseId && (
              <>
                {" · "}
                Associated Release:{" "}
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.releaseDetailPath(repository.releaseId!))}
                  className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
                >
                  {repository.releaseId} ({repository.releaseName})
                </button>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-right dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Last Prod Deployment
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {repository.lastProductionDeployment}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Lineage: TRUNK -> RELEASE -> PRODUCTION */}
      <AlignmentLineageVisualizer repository={repository} />

      {/* Alignment Analysis Card ("Why is it not aligned?") */}
      <AlignmentAnalysisCard repository={repository} />

      {/* Commit Difference & Alignment Details Metric Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Version Comparison */}
        <Card className="p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <Layers className="h-4 w-4 text-blue-500" />
            Branch Versions
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Current Trunk:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {repository.trunkVersion}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Current Release:</span>
              <span className="font-mono font-bold text-violet-600 dark:text-violet-400">
                {repository.releaseVersion}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Current Production:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {repository.productionVersion}
              </span>
            </div>
          </div>
        </Card>

        {/* Card 2: Commit Difference Deltas */}
        <Card className="p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <GitCommit className="h-4 w-4 text-violet-500" />
            Commit Deltas
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Trunk vs Release:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {repository.commitsAheadTrunkVsRelease > 0 ? `+${repository.commitsAheadTrunkVsRelease} commits` : "Synced"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Release vs Production:</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {repository.commitsAheadReleaseVsProd > 0 ? `+${repository.commitsAheadReleaseVsProd} commits` : "Synced"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Trunk vs Production:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {repository.commitsAheadTrunkVsProd > 0 ? `+${repository.commitsAheadTrunkVsProd} commits` : "Synced"}
              </span>
            </div>
          </div>
        </Card>

        {/* Card 3: Deployment Metadata */}
        <Card className="p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <Clock className="h-4 w-4 text-emerald-500" />
            Deployment Governance
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Deployment Date:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {repository.deploymentDate}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Deployed By:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {repository.deployedBy}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Release Status:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {repository.releaseStatus}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Section: Changes Not Yet Live in Production */}
      <UnpublishedChangesTable
        changes={repository.changesNotInProduction}
        repositoryName={repository.repositoryName}
      />
    </div>
  );
}
