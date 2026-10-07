import {
  AlertOctagon,
  ShieldAlert,
  GitBranch,
  ExternalLink,
  GitCommit,
  X,
  FileCheck2,
} from "lucide-react";
import type { ProductionRepositoryAlignment } from "../../types/productionAlignment";

interface DivergenceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  repository: ProductionRepositoryAlignment;
  onViewRelease: () => void;
  onViewChanges: () => void;
}

export function DivergenceReviewModal({
  isOpen,
  onClose,
  repository,
  onViewRelease,
  onViewChanges,
}: DivergenceReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="divergence-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800 bg-red-50/40 dark:bg-red-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="divergence-modal-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100"
              >
                Repository Divergence & Drift Audit
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {repository.repositoryName} · Live Production ({repository.productionVersion})
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {/* Root cause anomaly card */}
          <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs tracking-wide uppercase text-red-700 dark:text-red-400">
              <ShieldAlert className="h-4 w-4" />
              Root-Cause Anomaly Detected
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              {repository.divergenceReason || repository.explanation}
            </p>
          </div>

          {/* Version & Commit Comparison Matrix */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5" />
              Branch State & Hash Lineage
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Trunk / Develop
                </p>
                <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                  {repository.trunkVersion}
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  Commit: {repository.trunkCommit}
                </p>
              </div>

              <div className="rounded-lg border border-violet-200 bg-violet-50/60 p-3 dark:border-violet-900/50 dark:bg-violet-950/30">
                <p className="text-[11px] font-medium text-violet-700 dark:text-violet-300">
                  Release Branch
                </p>
                <p className="font-mono text-sm font-bold text-violet-700 dark:text-violet-300">
                  {repository.releaseVersion}
                </p>
                <p className="mt-1 font-mono text-[11px] text-violet-600 dark:text-violet-400">
                  Commit: {repository.releaseCommit}
                </p>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  Live Production
                </p>
                <p className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {repository.productionVersion}
                </p>
                <p className="mt-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                  Commit: {repository.productionCommit}
                </p>
              </div>
            </div>
          </div>

          {/* Governance Rules: Why Direct Promotion Is Prohibited */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200 space-y-1.5">
            <p className="font-semibold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
              <FileCheck2 className="h-4 w-4" />
              Release Governance Enforcement Policy
            </p>
            <p className="leading-relaxed">
              Direct Production deployment from Production Alignment is strictly disabled by design.
              Because this repository has unexpected divergence, deploying Release{" "}
              <span className="font-mono font-semibold">{repository.releaseVersion}</span> blindly
              would overwrite unmerged Production hotfixes and cause severe regression in live runtime.
            </p>
          </div>

          {/* Recommended Remediation Protocol */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Prescribed Remediation Steps
            </h4>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  1
                </span>
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">Cherry-pick hotfix commit:</strong>{" "}
                  Inspect production commit <span className="font-mono">{repository.productionCommit}</span> and cherry-pick it into the active release branch <span className="font-mono">release/{repository.releaseVersion}</span>.
                </p>
              </div>

              <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  2
                </span>
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">Backport upstream:</strong>{" "}
                  Ensure the hotfix patch is merged back into Trunk (<span className="font-mono">{repository.trunkVersion}</span>) to prevent future regression.
                </p>
              </div>

              <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  3
                </span>
                <p>
                  <strong className="text-slate-900 dark:text-slate-100">Execute through Release governance:</strong>{" "}
                  Navigate to {repository.releaseId ? `Release ${repository.releaseId}` : "Release management"}, review the automated deployment readiness score, and obtain required change approvals before rollout.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewChanges();
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <GitCommit className="h-3.5 w-3.5 text-blue-500" />
            View Unpublished Commits ({repository.changesNotInProduction.length})
          </button>

          <div className="flex items-center gap-2 justify-end">
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
