import type { KubernetesNode } from "../../types";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { nodeStatusStyles, urgentNodeStatuses } from "../../utils/statusStyles";
import { formatDateTime } from "../../utils/format";
import { useAppStore } from "../../store/useAppStore";
import { useToastStore } from "../../store/useToastStore";

interface NodesTableProps {
  nodes: KubernetesNode[];
  showClusterColumn?: boolean;
}

function usageTone(percent: number): string {
  if (percent >= 90) return "text-red-600 font-semibold dark:text-red-400";
  if (percent >= 70) return "text-amber-600 font-medium dark:text-amber-400";
  return "text-slate-600 dark:text-slate-400";
}

export function NodesTable({ nodes, showClusterColumn = false }: NodesTableProps) {
  const updateKubernetesNode = useAppStore((state) => state.updateKubernetesNode);
  const clusters = useAppStore((state) => state.kubernetesClusters);
  const showToast = useToastStore((state) => state.showToast);
  const columnCount = showClusterColumn ? 8 : 7;

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
            <th className="px-6 py-3 font-medium">Node</th>
            {showClusterColumn && <th className="px-4 py-3 font-medium">Cluster</th>}
            <th className="px-4 py-3 font-medium">Environment</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">CPU</th>
            <th className="px-4 py-3 font-medium">Memory</th>
            <th className="px-4 py-3 font-medium">Last Seen</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => {
            const cluster = clusters.find((c) => c.id === node.clusterId);
            const isCritical = node.status === "Critical";
            return (
              <tr
                key={node.id}
                className={`border-b border-slate-100 last:border-0 dark:border-slate-700/50 ${
                  isCritical
                    ? "bg-red-50/40 hover:bg-red-50/70 dark:bg-red-900/10 dark:hover:bg-red-900/20"
                    : "hover:bg-slate-50 dark:hover:bg-slate-700/40"
                }`}
              >
                <td
                  className={`px-6 py-3 font-medium text-slate-900 dark:text-slate-100 ${
                    isCritical ? "border-l-2 border-l-red-400 pl-[22px]" : ""
                  }`}
                >
                  {node.name}
                </td>
                {showClusterColumn && (
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{cluster?.name ?? "—"}</td>
                )}
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{cluster?.environment ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge className={nodeStatusStyles[node.status]} dot={urgentNodeStatuses.has(node.status)}>
                    {node.status}
                  </Badge>
                </td>
                <td className={`px-4 py-3 ${usageTone(node.cpuUsage)}`}>{node.cpuUsage}%</td>
                <td className={`px-4 py-3 ${usageTone(node.memoryUsage)}`}>{node.memoryUsage}%</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDateTime(node.lastSeen)}</td>
                <td className="px-4 py-3 text-right">
                  {node.status !== "Healthy" && (
                    <button
                      type="button"
                      onClick={() => {
                        updateKubernetesNode(node.id, "Healthy");
                        showToast({
                          variant: "success",
                          title: `${node.name} marked healthy`,
                          description: "Infrastructure risk recalculated for affected releases.",
                        });
                      }}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                    >
                      Mark Healthy
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
          {nodes.length === 0 && (
            <tr>
              <td colSpan={columnCount} className="px-6 py-6 text-center text-sm text-slate-400">
                No nodes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}
