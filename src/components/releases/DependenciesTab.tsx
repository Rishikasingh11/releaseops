import type { Dependency } from "../../types";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { dependencyStatusStyles } from "../../utils/statusStyles";

interface DependenciesTabProps {
  dependencies: Dependency[];
}

export function DependenciesTab({ dependencies }: DependenciesTabProps) {
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {dependencies.map((dep) => (
            <tr key={dep.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/40">
              <td className="px-6 py-3 font-medium text-slate-900 dark:text-slate-100">{dep.name}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{dep.type}</td>
              <td className="px-4 py-3">
                <Badge className={dependencyStatusStyles[dep.status]}>{dep.status}</Badge>
              </td>
            </tr>
          ))}
          {dependencies.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-6 text-center text-sm text-slate-400">
                No dependencies.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}
