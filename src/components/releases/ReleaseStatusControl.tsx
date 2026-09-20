import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Approval, JiraIssue, KubernetesNode, Release, Risk } from "../../types";
import { useAppStore, getNextReleaseStatus } from "../../store/useAppStore";
import { useToastStore } from "../../store/useToastStore";
import { getDeploymentBlockers } from "../../utils/calculations";
import { ConfirmDialog } from "../common/ConfirmDialog";

interface ReleaseStatusControlProps {
  release: Release;
  jiraIssues: JiraIssue[];
  nodes: KubernetesNode[];
  approvals: Approval[];
  risks: Risk[];
}

const CONFIRM_REQUIRED_STATUSES = new Set(["Deployed", "Closed"]);

export function ReleaseStatusControl({
  release,
  jiraIssues,
  nodes,
  approvals,
  risks,
}: ReleaseStatusControlProps) {
  const advanceReleaseStatus = useAppStore((state) => state.advanceReleaseStatus);
  const showToast = useToastStore((state) => state.showToast);
  const [confirmingStatus, setConfirmingStatus] = useState<string | null>(null);

  const nextStatus = getNextReleaseStatus(release.status);
  if (!nextStatus) {
    return (
      <p className="text-xs text-slate-400">
        {release.status === "At Risk"
          ? "Resolve open critical risks to resume the release workflow."
          : "This release has reached its final state."}
      </p>
    );
  }

  const blockers =
    nextStatus === "Deployed" ? getDeploymentBlockers(approvals, risks, jiraIssues, nodes) : [];
  const isBlocked = blockers.length > 0;

  const handleClick = () => {
    if (CONFIRM_REQUIRED_STATUSES.has(nextStatus)) {
      setConfirmingStatus(nextStatus);
      return;
    }
    advanceReleaseStatus(release.id);
    showToast({ variant: "success", title: `${release.name} advanced to ${nextStatus}` });
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isBlocked}
        title={isBlocked ? `Blocked: ${blockers.join(", ")}` : undefined}
        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:translate-y-0 disabled:hover:bg-slate-100 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
      >
        Advance to {nextStatus}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
      {isBlocked && (
        <p className="mt-1.5 max-w-xs text-xs text-slate-400">Blocked: {blockers.join(", ")}</p>
      )}

      <ConfirmDialog
        open={confirmingStatus !== null}
        title={`Move release to ${confirmingStatus}?`}
        description={
          confirmingStatus === "Deployed"
            ? "This will mark the release as deployed to production. Make sure all deployment steps have been completed."
            : "This will close the release. Closed releases are considered final and archived for audit purposes."
        }
        confirmLabel={`Confirm: ${confirmingStatus}`}
        destructive={confirmingStatus === "Closed"}
        onConfirm={() => {
          advanceReleaseStatus(release.id);
          showToast({
            variant: confirmingStatus === "Deployed" ? "success" : "info",
            title: `${release.name} is now ${confirmingStatus}`,
          });
          setConfirmingStatus(null);
        }}
        onCancel={() => setConfirmingStatus(null)}
      />
    </div>
  );
}
