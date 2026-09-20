import { Link } from "react-router-dom";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { useAppStore } from "../../store/useAppStore";
import { formatDate } from "../../utils/format";
import { isApprovalOverdue } from "../../utils/calculations";
import { ROUTES } from "../../routes/paths";

export function PendingApprovalsPanel() {
  const approvals = useAppStore((state) => state.approvals);
  const releases = useAppStore((state) => state.releases);

  const pending = approvals
    .filter((approval) => approval.status === "Pending" || approval.status === "More Info Requested")
    .slice(0, 5);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pending Approvals</h2>
        <Link to={ROUTES.approvals} className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
          View all
        </Link>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-700">
        {pending.map((approval) => {
          const release = releases.find((r) => r.id === approval.releaseId);
          const overdue = isApprovalOverdue(approval);
          return (
            <li key={approval.id}>
              <Link
                to={release ? ROUTES.releaseDetailPath(release.id) : ROUTES.approvals}
                className="-mx-1 flex items-center justify-between gap-3 rounded-lg px-1 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                    {approval.type} · {release?.name ?? "Unknown release"}
                  </p>
                  <p className="text-xs text-slate-400">Due {formatDate(approval.dueDate)}</p>
                </div>
                {overdue ? (
                  <Badge className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" dot>
                    Overdue
                  </Badge>
                ) : (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                    {approval.status}
                  </Badge>
                )}
              </Link>
            </li>
          );
        })}
        {pending.length === 0 && (
          <p className="py-2 text-sm text-slate-400">No pending approvals.</p>
        )}
      </ul>
    </Card>
  );
}
