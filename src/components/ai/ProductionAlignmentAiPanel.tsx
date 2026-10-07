import { useNavigate } from "react-router-dom";
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { useAppStore } from "../../store/useAppStore";
import { generateAlignmentAiInsights } from "../../utils/aiInsights";
import { ROUTES } from "../../routes/paths";

export function ProductionAlignmentAiPanel() {
  const navigate = useNavigate();
  const alignments = useAppStore((state) => state.productionAlignments);
  const insights = generateAlignmentAiInsights(alignments);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />;
      case "info":
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
    }
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Production Alignment AI Intelligence
              </h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                Deterministic
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated branch-to-runtime drift diagnosis and recommended remediation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.productionAlignment)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View Fleet Alignment
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {insights.map((item) => (
          <div key={item.id} className="p-4 space-y-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                {getSeverityIcon(item.severity)}
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getSeverityBadge(item.severity)}>
                  {item.severity.toUpperCase()}
                </Badge>
                <button
                  type="button"
                  onClick={() =>
                    navigate(ROUTES.productionAlignmentDetailPath(item.repositoryId))
                  }
                  className="rounded p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                  title="View repository alignment details"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 pl-7">
              {item.description}
            </p>

            <div className="ml-7 rounded-md bg-slate-100/70 p-2 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                AI Recommendation:{" "}
              </span>
              {item.recommendation}
              {item.releaseId && (
                <span className="ml-2">
                  (Associated with{" "}
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.releaseDetailPath(item.releaseId!))}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {item.releaseName || item.releaseId}
                  </button>
                  )
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
