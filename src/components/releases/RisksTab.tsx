import type { Risk } from "../../types";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { riskSeverityStyles, urgentRiskSeverities } from "../../utils/statusStyles";

interface RisksTabProps {
  risks: Risk[];
}

const riskStatusStyles: Record<Risk["status"], string> = {
  Open: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  Mitigated: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  Accepted: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
};

export function RisksTab({ risks }: RisksTabProps) {
  return (
    <div className="space-y-4">
      {risks.map((risk) => {
        const isUrgent = urgentRiskSeverities.has(risk.severity) && risk.status === "Open";
        return (
          <Card
            key={risk.id}
            className={isUrgent ? "border-l-4 border-l-red-400 bg-red-50/30 dark:bg-red-900/10" : ""}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{risk.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{risk.description}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Mitigation:</span> {risk.mitigation}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <Badge className={riskSeverityStyles[risk.severity]} dot={urgentRiskSeverities.has(risk.severity)}>
                  {risk.severity}
                </Badge>
                <Badge className={riskStatusStyles[risk.status]}>{risk.status}</Badge>
              </div>
            </div>
          </Card>
        );
      })}
      {risks.length === 0 && (
        <Card>
          <p className="text-sm text-slate-400">No risks identified for this release.</p>
        </Card>
      )}
    </div>
  );
}
