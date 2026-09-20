import { useState } from "react";
import type { Approval } from "../../types";
import { useAppStore } from "../../store/useAppStore";
import { useToastStore } from "../../store/useToastStore";
import { ConfirmDialog } from "../common/ConfirmDialog";

interface ApprovalActionsProps {
  approval: Approval;
}

export function ApprovalActions({ approval }: ApprovalActionsProps) {
  const updateApproval = useAppStore((state) => state.updateApproval);
  const showToast = useToastStore((state) => state.showToast);
  const [confirmingReject, setConfirmingReject] = useState(false);

  if (approval.status === "Approved" || approval.status === "Rejected") {
    return <span className="text-xs text-slate-400">No action needed</span>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            updateApproval(approval.id, "Approved");
            showToast({
              variant: "success",
              title: `${approval.type} approval granted`,
              description: "Readiness and AI insights have been recalculated.",
            });
          }}
          className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => setConfirmingReject(true)}
          className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => {
            updateApproval(approval.id, "More Info Requested");
            showToast({
              variant: "info",
              title: `More info requested on ${approval.type} approval`,
            });
          }}
          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Request More Info
        </button>
      </div>

      <ConfirmDialog
        open={confirmingReject}
        title={`Reject ${approval.type} approval?`}
        description="This will mark the approval as rejected and block the release from progressing through this gate. This action can be reversed later, but stakeholders will be notified."
        confirmLabel="Reject Approval"
        destructive
        onConfirm={() => {
          updateApproval(approval.id, "Rejected");
          showToast({
            variant: "error",
            title: `${approval.type} approval rejected`,
            description: "The release is now blocked at this gate.",
          });
          setConfirmingReject(false);
        }}
        onCancel={() => setConfirmingReject(false)}
      />
    </>
  );
}
