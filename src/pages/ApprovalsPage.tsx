import { Clock, CheckCircle2, XCircle, AlarmClock } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { MetricCard } from "../components/common/MetricCard";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { ApprovalActions } from "../components/approvals/ApprovalActions";
import { useAppStore } from "../store/useAppStore";
import { formatDate } from "../utils/format";
import { isApprovalOverdue } from "../utils/calculations";
import { approvalStatusStyles } from "../utils/statusStyles";

export function ApprovalsPage() {
  const approvals = useAppStore((state) => state.approvals);
  const releases = useAppStore((state) => state.releases);

  const pending = approvals.filter((a) => a.status === "Pending" || a.status === "More Info Requested").length;
  const approved = approvals.filter((a) => a.status === "Approved").length;
  const rejected = approvals.filter((a) => a.status === "Rejected").length;
  const overdue = approvals.filter(isApprovalOverdue).length;

  const sorted = [...approvals].sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));

  return (
    <div>
      <PageHeader title="Approvals" description="Pending and completed approval workflows for release gates." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Pending" value={pending} icon={Clock} tone="warning" emphasize={pending > 0} />
        <MetricCard label="Approved" value={approved} icon={CheckCircle2} tone="success" />
        <MetricCard label="Rejected" value={rejected} icon={XCircle} tone="danger" emphasize={rejected > 0} />
        <MetricCard label="Overdue" value={overdue} icon={AlarmClock} tone="danger" emphasize={overdue > 0} />
      </div>

      <div className="mt-6">
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
                <th className="px-6 py-3 font-medium">Release</th>
                <th className="px-4 py-3 font-medium">Approval Type</th>
                <th className="px-4 py-3 font-medium">Approver</th>
                <th className="px-4 py-3 font-medium">Requested</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((approval) => {
                const release = releases.find((r) => r.id === approval.releaseId);
                const overdueRow = isApprovalOverdue(approval);
                return (
                  <tr
                    key={approval.id}
                    className={`border-b border-slate-100 last:border-0 dark:border-slate-700/50 ${
                      overdueRow
                        ? "bg-red-50/40 hover:bg-red-50/70 dark:bg-red-900/10 dark:hover:bg-red-900/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/40"
                    }`}
                  >
                    <td
                      className={`px-6 py-3 font-medium text-slate-900 dark:text-slate-100 ${
                        overdueRow ? "border-l-2 border-l-red-400 pl-[22px]" : ""
                      }`}
                    >
                      {release?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{approval.type}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{approval.approver}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(approval.requestedDate)}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(approval.dueDate)}</td>
                    <td className="px-4 py-3">
                      {overdueRow ? (
                        <Badge className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800" dot>
                          Overdue
                        </Badge>
                      ) : (
                        <Badge className={approvalStatusStyles[approval.status]}>{approval.status}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ApprovalActions approval={approval} />
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-400">
                    No approvals to show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
