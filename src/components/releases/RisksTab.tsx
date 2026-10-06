import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import type { Risk } from "../../types";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { riskSeverityStyles, urgentRiskSeverities } from "../../utils/statusStyles";
import { useAppStore } from "../../store/useAppStore";
import { useToastStore } from "../../store/useToastStore";
import { ConfirmDialog } from "../common/ConfirmDialog";

interface RisksTabProps {
  risks: Risk[];
}

const riskStatusStyles: Record<Risk["status"], string> = {
  Open: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  Mitigated: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  Accepted: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
};

export function RisksTab({ risks }: RisksTabProps) {
  const mitigateRisk = useAppStore((state) => state.mitigateRisk);
  const showToast = useToastStore((state) => state.showToast);

  const [activeRiskId, setActiveRiskId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"Mitigated" | "Accepted" | null>(null);
  const [mitigationNote, setMitigationNote] = useState("");

  const activeRisk = risks.find((r) => r.id === activeRiskId);

  const handleConfirm = () => {
    if (!activeRiskId || !actionType) return;

    mitigateRisk(activeRiskId, actionType, mitigationNote.trim() || undefined);
    showToast({
      variant: "success",
      title: actionType === "Mitigated" ? "Risk mitigated" : "Risk accepted as exception",
      description: "Release readiness and deployment blockers recalculated.",
    });

    setActiveRiskId(null);
    setActionType(null);
    setMitigationNote("");
  };

  return (
    <div className="space-y-4">
      {risks.map((risk) => {
        const isUrgent = urgentRiskSeverities.has(risk.severity) && risk.status === "Open";
        return (
          <Card
            key={risk.id}
            className={isUrgent ? "border-l-4 border-l-red-400 bg-red-50/30 dark:bg-red-900/10" : ""}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{risk.title}</p>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{risk.description}</p>
                <div className="mt-2.5 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Mitigation Strategy:</span>{" "}
                  {risk.mitigation}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-start sm:items-end gap-2">
                <div className="flex items-center gap-1.5">
                  <Badge className={riskSeverityStyles[risk.severity]} dot={urgentRiskSeverities.has(risk.severity)}>
                    {risk.severity} Risk
                  </Badge>
                  <Badge className={riskStatusStyles[risk.status]}>{risk.status}</Badge>
                </div>

                {risk.status === "Open" && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRiskId(risk.id);
                        setActionType("Mitigated");
                      }}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Mitigate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRiskId(risk.id);
                        setActionType("Accepted");
                      }}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                      Accept Exception
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}

      {risks.length === 0 && (
        <Card>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">No open risks</p>
            <p className="text-xs text-slate-400">All risk factors for this release are clear.</p>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={activeRiskId !== null}
        title={actionType === "Mitigated" ? `Mitigate Risk: ${activeRisk?.title}?` : `Accept Risk Exception: ${activeRisk?.title}?`}
        description={
          actionType === "Mitigated"
            ? "Confirm that the technical mitigations or fallback plans have been implemented. This will remove this risk as a deployment blocker."
            : "Accept this risk as an approved operational exception. This will record the exception in the release audit log."
        }
        confirmLabel={actionType === "Mitigated" ? "Confirm Mitigation" : "Accept Exception"}
        onConfirm={handleConfirm}
        onCancel={() => {
          setActiveRiskId(null);
          setActionType(null);
          setMitigationNote("");
        }}
      />
    </div>
  );
}
