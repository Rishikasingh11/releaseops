import {
  ArrowRight,
  ArrowDown,
  Radio,
  GitCommit,
} from "lucide-react";
import { Card } from "../common/Card";
import type { ProductionRepositoryAlignment } from "../../types/productionAlignment";

interface AlignmentLineageVisualizerProps {
  repository: ProductionRepositoryAlignment;
}

export function AlignmentLineageVisualizer({
  repository,
}: AlignmentLineageVisualizerProps) {
  const isAligned = repository.alignmentStatus === "ALIGNED";
  const isDiverged = repository.alignmentStatus === "DIVERGED";
  const isPending = repository.alignmentStatus === "RELEASE PENDING";

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Release Lineage & Branch Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Conceptual lifecycle from latest development to live production runtime
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
            Live Sync Monitoring
          </span>
        </div>
      </div>

      {/* 3-Node Lineage Diagram */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-11 md:items-center">
        {/* Node 1: TRUNK / DEVELOP */}
        <div className="md:col-span-3">
          <div className="relative rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-5 transition-all hover:shadow-md dark:border-blue-900/60 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                TRUNK / DEVELOP
              </span>
              <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                main
              </span>
            </div>

            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {repository.trunkVersion}
              </p>
              <div className="mt-1 flex items-center gap-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                <GitCommit className="h-3.5 w-3.5 text-blue-500" />
                <span>{repository.trunkCommit}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-blue-200/60 pt-3 dark:border-blue-900/40">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                {repository.commitsAheadTrunkVsRelease > 0
                  ? `${repository.commitsAheadTrunkVsRelease} commits ahead of Release`
                  : "Synced with Release branch"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Latest active development
              </p>
            </div>
          </div>
        </div>

        {/* Connector 1: Trunk to Release */}
        <div className="flex flex-col items-center justify-center md:col-span-1">
          <div className="hidden flex-col items-center gap-1 md:flex">
            <span className="text-center font-mono text-[10px] font-semibold text-slate-500">
              +{repository.commitsAheadTrunkVsRelease}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-400">
              <ArrowRight className="h-4 w-4" />
            </div>
            <span className="text-center text-[10px] text-slate-400">Cut</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-2 md:hidden">
            <ArrowDown className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">
              +{repository.commitsAheadTrunkVsRelease} commits ahead of Release
            </span>
          </div>
        </div>

        {/* Node 2: RELEASE BRANCH */}
        <div className="md:col-span-3">
          <div className="relative rounded-xl border-2 border-violet-200 bg-violet-50/50 p-5 transition-all hover:shadow-md dark:border-violet-900/60 dark:bg-violet-950/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                RELEASE BRANCH
              </span>
              <span className="rounded bg-violet-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-violet-800 dark:bg-violet-900/50 dark:text-violet-300">
                release/{repository.releaseVersion}
              </span>
            </div>

            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {repository.releaseVersion}
              </p>
              <div className="mt-1 flex items-center gap-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                <GitCommit className="h-3.5 w-3.5 text-violet-500" />
                <span>{repository.releaseCommit}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-violet-200/60 pt-3 dark:border-violet-900/40">
              <p className="text-xs font-medium text-violet-700 dark:text-violet-300">
                {repository.commitsAheadReleaseVsProd > 0
                  ? `${repository.commitsAheadReleaseVsProd} commits ahead of Production`
                  : isAligned
                  ? "Fully aligned with Production"
                  : "Staged candidate"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Status: {repository.releaseStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Connector 2: Release to Production */}
        <div className="flex flex-col items-center justify-center md:col-span-1">
          <div className="hidden flex-col items-center gap-1 md:flex">
            <span className="text-center font-mono text-[10px] font-semibold text-slate-500">
              {isDiverged
                ? "Diverged"
                : `+${repository.commitsAheadReleaseVsProd}`}
            </span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm ${
                isDiverged
                  ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                  : isPending
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
              }`}
            >
              <ArrowRight className="h-4 w-4" />
            </div>
            <span className="text-center text-[10px] text-slate-400">Deploy</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-2 md:hidden">
            <ArrowDown className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">
              {isDiverged
                ? "Divergence detected"
                : `+${repository.commitsAheadReleaseVsProd} commits ahead of Production`}
            </span>
          </div>
        </div>

        {/* Node 3: PRODUCTION / MAIN & LIVE APPLICATION */}
        <div className="md:col-span-3">
          <div
            className={`relative rounded-xl border-2 p-5 transition-all hover:shadow-md ${
              isAligned
                ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-900/70 dark:bg-emerald-950/20"
                : isDiverged
                ? "border-red-300 bg-red-50/50 dark:border-red-900/70 dark:bg-red-950/20"
                : "border-amber-300 bg-amber-50/50 dark:border-amber-900/70 dark:bg-amber-950/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isAligned
                    ? "text-emerald-700 dark:text-emerald-400"
                    : isDiverged
                    ? "text-red-700 dark:text-red-400"
                    : "text-amber-700 dark:text-amber-400"
                }`}
              >
                PRODUCTION / LIVE
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE RUNTIME
              </span>
            </div>

            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {repository.productionVersion}
              </p>
              <div className="mt-1 flex items-center gap-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                <GitCommit
                  className={`h-3.5 w-3.5 ${
                    isDiverged ? "text-red-500" : "text-emerald-500"
                  }`}
                />
                <span>{repository.productionCommit}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-200/60 pt-3 dark:border-slate-800">
              <p
                className={`text-xs font-semibold ${
                  isAligned
                    ? "text-emerald-700 dark:text-emerald-400"
                    : isDiverged
                    ? "text-red-700 dark:text-red-400"
                    : "text-amber-700 dark:text-amber-400"
                }`}
              >
                {isAligned
                  ? "✓ In full alignment with Release"
                  : isDiverged
                  ? "⚠ Diverged from Release candidate"
                  : `Behind Release by ${repository.commitsAheadReleaseVsProd} commits`}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Deployed {repository.lastProductionDeployment} ({repository.deployedBy})
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
