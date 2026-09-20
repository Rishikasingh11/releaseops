import { Boxes, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { MetricCard } from "../components/common/MetricCard";
import { NodesTable } from "../components/kubernetes/NodesTable";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { useAppStore } from "../store/useAppStore";
import { packageStatusStyles } from "../utils/statusStyles";

export function KubernetesPage() {
  const clusters = useAppStore((state) => state.kubernetesClusters);
  const nodes = useAppStore((state) => state.kubernetesNodes);
  const packages = useAppStore((state) => state.releasePackages);
  const releases = useAppStore((state) => state.releases);

  const healthy = nodes.filter((n) => n.status === "Healthy").length;
  const warning = nodes.filter((n) => n.status === "Warning").length;
  const critical = nodes.filter((n) => n.status === "Critical").length;

  return (
    <div>
      <PageHeader
        title="Mirantis Kubernetes"
        description="Cluster health, workloads, and deployment status across environments."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Clusters" value={clusters.length} icon={Boxes} tone="info" />
        <MetricCard label="Healthy Nodes" value={healthy} icon={CheckCircle2} tone="success" />
        <MetricCard label="Warning Nodes" value={warning} icon={AlertTriangle} tone="warning" emphasize={warning > 0} />
        <MetricCard label="Critical Nodes" value={critical} icon={ShieldAlert} tone="danger" emphasize={critical > 0} />
      </div>

      <div className="my-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Nodes</h2>
        <NodesTable nodes={nodes} showClusterColumn />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Deployment Packages</h2>
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-6 py-3 font-medium">Package</th>
                <th className="px-4 py-3 font-medium">Version</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Release</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => {
                const release = releases.find((r) => r.id === pkg.releaseId);
                const isFailed = pkg.status === "Failed";
                return (
                  <tr
                    key={pkg.id}
                    className={`border-b border-slate-100 last:border-0 ${
                      isFailed ? "bg-red-50/40 hover:bg-red-50/70" : "hover:bg-slate-50"
                    }`}
                  >
                    <td
                      className={`px-6 py-3 font-medium text-slate-900 ${
                        isFailed ? "border-l-2 border-l-red-400 pl-[22px]" : ""
                      }`}
                    >
                      {pkg.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{pkg.version}</td>
                    <td className="px-4 py-3 text-slate-600">{pkg.type}</td>
                    <td className="px-4 py-3 text-slate-600">{release?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge className={packageStatusStyles[pkg.status]} dot={isFailed}>
                        {pkg.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
              {packages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">
                    No deployment packages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
