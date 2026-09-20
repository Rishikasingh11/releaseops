import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../common/Card";
import { ROUTES } from "../../routes/paths";

export interface EntityRiskItem {
  key: string;
  label: string;
  detail?: string;
  releaseId: string;
  releaseName: string;
}

interface EntityRiskListProps {
  title: string;
  icon: LucideIcon;
  items: EntityRiskItem[];
  emptyMessage: string;
}

export function EntityRiskList({ title, icon: Icon, items, emptyMessage }: EntityRiskListProps) {
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-700">
          {items.map((item) => (
            <li key={item.key} className="flex items-center justify-between gap-3 py-2 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-800 dark:text-slate-200">{item.label}</p>
                {item.detail && <p className="truncate text-xs text-slate-400">{item.detail}</p>}
              </div>
              <Link
                to={ROUTES.releaseDetailPath(item.releaseId)}
                className="shrink-0 rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                {item.releaseName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
