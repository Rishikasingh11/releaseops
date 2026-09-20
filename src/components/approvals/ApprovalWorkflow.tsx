import type { ReactElement } from "react";
import { Check, X, HelpCircle, Clock } from "lucide-react";
import type { Approval } from "../../types";
import { ApprovalActions } from "./ApprovalActions";

interface ApprovalWorkflowProps {
  approvals: Approval[];
}

const statusIcon: Record<Approval["status"], ReactElement> = {
  Approved: <Check className="h-4 w-4" />,
  Rejected: <X className="h-4 w-4" />,
  "More Info Requested": <HelpCircle className="h-4 w-4" />,
  Pending: <Clock className="h-4 w-4" />,
};

const statusColor: Record<Approval["status"], string> = {
  Approved: "bg-emerald-600 text-white border-emerald-600 scale-100",
  Rejected: "bg-red-600 text-white border-red-600 scale-100",
  "More Info Requested": "bg-orange-500 text-white border-orange-500 scale-100",
  Pending: "bg-white text-slate-400 border-slate-300 dark:bg-slate-800 dark:border-slate-600",
};

export function ApprovalWorkflow({ approvals }: ApprovalWorkflowProps) {
  const sorted = [...approvals].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex items-center overflow-x-auto pb-2">
        {sorted.map((approval, index) => {
          const nextApproved = sorted[index + 1]?.status === "Approved";
          const isApproved = approval.status === "Approved";
          return (
            <div key={approval.id} className="flex items-center">
              <div className="flex flex-col items-center gap-2 px-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${statusColor[approval.status]}`}
                >
                  {statusIcon[approval.status]}
                </div>
                <p className="w-24 text-center text-xs font-medium text-slate-700 dark:text-slate-300">
                  {approval.type}
                </p>
              </div>
              {index < sorted.length - 1 && (
                <div
                  className={`mx-1 h-0.5 w-8 shrink-0 transition-colors duration-300 ${
                    isApproved && nextApproved ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {sorted.map((approval) => (
          <div
            key={approval.id}
            className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"
          >
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {approval.type} · {approval.approver}
              </p>
              <p className="text-xs text-slate-400">
                Status: {approval.status}
                {approval.comment ? ` · "${approval.comment}"` : ""}
              </p>
            </div>
            <ApprovalActions approval={approval} />
          </div>
        ))}
      </div>
    </div>
  );
}
