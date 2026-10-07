import { useState } from "react";
import { GitCompare, RefreshCw, ShieldCheck } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { Card } from "../components/common/Card";
import { AlignmentMetricCards } from "../components/alignment/AlignmentMetricCards";
import { RepositoryAlignmentTable } from "../components/alignment/RepositoryAlignmentTable";
import { useAppStore } from "../store/useAppStore";
import { useToastStore } from "../store/useToastStore";

export function ProductionAlignmentPage() {
  const alignments = useAppStore((state) => state.productionAlignments);
  const showToast = useToastStore((state) => state.showToast);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanFleet = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast({
        title: "Fleet Sync Scan Complete",
        description:
          "Scanned 8 production repositories. 1 divergence and 2 pending releases detected.",
        variant: "info",
      });
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Production-to-Repository Alignment"
        description="Monitor whether production-live applications are aligned with their Trunk and Release branches."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isScanning}
              onClick={handleScanFleet}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <RefreshCw
                className={`h-4 w-4 ${isScanning ? "animate-spin text-blue-600" : ""}`}
              />
              {isScanning ? "Scanning Fleet..." : "Sync Fleet Status"}
            </button>
          </div>
        }
      />

      {/* Conceptual Architecture Card */}
      <Card className="border-blue-200/60 bg-gradient-to-r from-blue-50/50 via-indigo-50/20 to-purple-50/30 p-4 dark:border-blue-900/40 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <GitCompare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Continuous Governance Lineage
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Trunk / Develop → Release Branch → Production / Main → Live Runtime
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> Zero-Drift Protection
            </span>
          </div>
        </div>
      </Card>

      {/* Top Metric Cards */}
      <AlignmentMetricCards alignments={alignments} />

      {/* Main Repository Alignment Table with Filters */}
      <RepositoryAlignmentTable alignments={alignments} />
    </div>
  );
}
