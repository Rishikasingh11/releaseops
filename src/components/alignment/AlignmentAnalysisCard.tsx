import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  ShieldAlert,
  Layers,
  GitCommit,
  Ticket,
} from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import {
  alignmentStatusStyles,
  urgentAlignmentStatuses,
} from "../../utils/statusStyles";
import type { ProductionRepositoryAlignment } from "../../types/productionAlignment";
import { ROUTES } from "../../routes/paths";
import { DivergenceReviewModal } from "./DivergenceReviewModal";
import { RelatedJiraIssuesModal } from "./RelatedJiraIssuesModal";
import { useToastStore } from "../../store/useToastStore";

interface AlignmentAnalysisCardProps {
  repository: ProductionRepositoryAlignment;
}

export function AlignmentAnalysisCard({
  repository,
}: AlignmentAnalysisCardProps) {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const [showDivergenceModal, setShowDivergenceModal] = useState(false);
  const [showJiraModal, setShowJiraModal] = useState(false);

  const isAligned = repository.alignmentStatus === "ALIGNED";
  const isDiverged = repository.alignmentStatus === "DIVERGED";
  const isAttention = repository.alignmentStatus === "ATTENTION REQUIRED";
  const isPending = repository.alignmentStatus === "RELEASE PENDING";

  const handleViewRelease = () => {
    if (repository.releaseId) {
      navigate(ROUTES.releaseDetailPath(repository.releaseId));
    } else {
      navigate(ROUTES.releases);
    }
  };

  const handleReviewDivergence = () => {
    setShowDivergenceModal(true);
  };

  const handleScrollToChanges = () => {
    const el = document.getElementById("unpublished-changes");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      showToast({
        title: "All Changes Deployed",
        description: `There are no unreleased commits for ${repository.repositoryName}.`,
        variant: "info",
      });
    }
  };

  const handleViewJira = () => {
    setShowJiraModal(true);
  };

  const handleNavigateToJira = () => {
    navigate(ROUTES.jira);
  };

  const getIcon = () => {
    if (isAligned)
      return <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />;
    if (isDiverged)
      return <AlertOctagon className="h-6 w-6 text-red-600 dark:text-red-400" />;
    if (isAttention)
      return <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />;
    if (isPending)
      return <Info className="h-6 w-6 text-amber-600 dark:text-amber-400" />;
    return <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
  };

  const getContainerStyles = () => {
    if (isAligned)
      return "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20";
    if (isDiverged)
      return "border-red-200 bg-red-50/40 dark:border-red-900/40 dark:bg-red-950/20";
    if (isAttention)
      return "border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20";
    return "border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20";
  };

  const renderPrimaryAction = () => {
    if (isDiverged) {
      return (
        <button
          type="button"
          onClick={handleReviewDivergence}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow"
        >
          <AlertOctagon className="h-3.5 w-3.5" />
          Review Divergence
        </button>
      );
    }

    if (isPending || repository.alignmentStatus === "BEHIND") {
      return (
        <button
          type="button"
          onClick={handleViewRelease}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
        >
          <Layers className="h-3.5 w-3.5" />
          View Release
        </button>
      );
    }

    if (isAligned) {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-100/70 px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Production Aligned
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={handleReviewDivergence}
        className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-amber-700 hover:shadow"
      >
        <AlertTriangle className="h-3.5 w-3.5" />
        Review Divergence
      </button>
    );
  };

  return (
    <Card className={`p-6 border-l-4 ${getContainerStyles()}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="shrink-0 pt-0.5">{getIcon()}</div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Alignment Analysis & Explainability
              </h3>
              <Badge
                className={alignmentStatusStyles[repository.alignmentStatus]}
                dot={urgentAlignmentStatuses.has(repository.alignmentStatus)}
              >
                {repository.alignmentStatus}
              </Badge>
            </div>

            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {repository.explanation}
            </p>

            {repository.recommendation && (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Governance Guidance:{" "}
                </span>
                {repository.recommendation}
              </p>
            )}

            {isDiverged && repository.divergenceReason && (
              <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-100/70 p-3.5 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
                <ShieldAlert className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-red-900 dark:text-red-200">
                    Hotfix Lineage Anomaly (Drift Detected):
                  </p>
                  <p className="leading-relaxed">{repository.divergenceReason}</p>
                </div>
              </div>
            )}

            <div className="pt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>
                Production deployments are governed through ReleaseOps change control and gated approvals.
              </span>
            </div>
          </div>
        </div>

        {/* Action Group */}
        <div className="shrink-0 flex flex-col items-start lg:items-end gap-2.5 pt-2 lg:pt-0">
          {/* Primary Action Button */}
          <div>{renderPrimaryAction()}</div>

          {/* Secondary Safer Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {!isPending && repository.alignmentStatus !== "BEHIND" && (
              <button
                type="button"
                onClick={handleViewRelease}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                title="Open associated Release page in ReleaseOps"
              >
                <Layers className="h-3.5 w-3.5 text-violet-500" />
                View Release
              </button>
            )}

            {!isDiverged && (repository.divergenceReason || isAttention) && (
              <button
                type="button"
                onClick={handleReviewDivergence}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                title="Inspect divergence audit details"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                Review Divergence
              </button>
            )}

            <button
              type="button"
              onClick={handleScrollToChanges}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              title="Scroll to unpublished changes table"
            >
              <GitCommit className="h-3.5 w-3.5 text-blue-500" />
              View Changes
              {repository.changesNotInProduction.length > 0 && (
                <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {repository.changesNotInProduction.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleViewJira}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              title="Inspect Jira issues related to this repository"
            >
              <Ticket className="h-3.5 w-3.5 text-amber-500" />
              View Related Jira Issues
            </button>
          </div>
        </div>
      </div>

      {/* Divergence Review Modal */}
      <DivergenceReviewModal
        isOpen={showDivergenceModal}
        onClose={() => setShowDivergenceModal(false)}
        repository={repository}
        onViewRelease={handleViewRelease}
        onViewChanges={handleScrollToChanges}
      />

      {/* Related Jira Issues Modal */}
      <RelatedJiraIssuesModal
        isOpen={showJiraModal}
        onClose={() => setShowJiraModal(false)}
        repository={repository}
        onViewRelease={handleViewRelease}
        onNavigateToJira={handleNavigateToJira}
      />
    </Card>
  );
}
