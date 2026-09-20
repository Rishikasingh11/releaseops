import { ListTodo } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReleaseIntelligence } from "../../store/selectors";
import { Card } from "../common/Card";
import { ROUTES } from "../../routes/paths";

interface RecommendedActionsPanelProps {
  intelligence: ReleaseIntelligence[];
}

export function RecommendedActionsPanel({ intelligence }: RecommendedActionsPanelProps) {
  const rows = [...intelligence]
    .filter((i) => i.actions.length > 0)
    .sort((a, b) => b.risk.score - a.risk.score)
    .flatMap((i) => i.actions.slice(0, 2).map((action) => ({ action, release: i.release })));

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <ListTodo className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recommended Actions</h2>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-400">No action needed — every release is on track.</p>
      ) : (
        <ol className="space-y-2">
          {rows.map(({ action, release }, index) => (
            <li key={`${release.id}-${action}`} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                {index + 1}
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                {action} —{" "}
                <Link to={ROUTES.releaseDetailPath(release.id)} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  {release.name}
                </Link>
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
