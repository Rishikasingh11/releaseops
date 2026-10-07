import {
  Boxes,
  CheckCircle2,
  Clock,
  ArrowDownCircle,
  AlertTriangle,
} from "lucide-react";
import { MetricCard } from "../common/MetricCard";
import type { ProductionRepositoryAlignment } from "../../types/productionAlignment";
import { summarizeAlignmentMetrics } from "../../utils/alignmentLogic";

interface AlignmentMetricCardsProps {
  alignments: ProductionRepositoryAlignment[];
}

export function AlignmentMetricCards({ alignments }: AlignmentMetricCardsProps) {
  const metrics = summarizeAlignmentMetrics(alignments);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricCard
        label="Total Production Repositories"
        value={metrics.total}
        icon={Boxes}
        tone="info"
      />
      <MetricCard
        label="Aligned"
        value={metrics.aligned}
        icon={CheckCircle2}
        tone="success"
      />
      <MetricCard
        label="Release Pending Deployment"
        value={metrics.releasePending}
        icon={Clock}
        tone="warning"
      />
      <MetricCard
        label="Production Behind"
        value={metrics.productionBehind}
        icon={ArrowDownCircle}
        tone="warning"
      />
      <MetricCard
        label="Diverged / Attention Required"
        value={metrics.divergedOrAttention}
        icon={AlertTriangle}
        tone="danger"
        emphasize={metrics.divergedOrAttention > 0}
      />
    </div>
  );
}
