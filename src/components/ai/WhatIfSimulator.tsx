import { useState, useMemo } from "react";
import { Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { ProgressBar } from "../common/ProgressBar";
import { useAppStore } from "../../store/useAppStore";
import { getReadinessBreakdown, getRiskAssessment } from "../../utils/calculations";
import { readinessTone, riskLevelSolidStyles } from "../../utils/statusStyles";

export function WhatIfSimulator() {
  const releases = useAppStore((state) => state.releases);
  const jiraIssues = useAppStore((state) => state.jiraIssues);
  const approvals = useAppStore((state) => state.approvals);
  const risks = useAppStore((state) => state.risks);
  const kubernetesNodes = useAppStore((state) => state.kubernetesNodes);
  const dependencies = useAppStore((state) => state.dependencies);
  const freezeWindows = useAppStore((state) => state.freezeWindows);

  // Active releases that aren't closed
  const activeReleases = releases.filter((r) => r.status !== "Closed");

  // Selected release to simulate
  const [selectedReleaseId, setSelectedReleaseId] = useState(
    activeReleases[0]?.id || releases[0]?.id || "",
  );

  const selectedRelease = releases.find((r) => r.id === selectedReleaseId);

  // Scoped entities
  const scopedIssues = jiraIssues.filter((i) => selectedRelease?.jiraIssueIds.includes(i.id));
  const scopedApprovals = approvals.filter((a) => selectedRelease?.approvalIds.includes(a.id));
  const scopedRisks = risks.filter((r) => selectedRelease?.riskIds.includes(r.id));
  const scopedNodes = kubernetesNodes.filter((n) => selectedRelease?.clusterIds.includes(n.clusterId));
  const scopedDependencies = dependencies.filter((d) => selectedRelease?.dependencyIds.includes(d.id));

  // Actual baseline scores
  const baselineReadiness = selectedRelease
    ? getReadinessBreakdown(
        selectedRelease,
        scopedApprovals,
        scopedRisks,
        scopedIssues,
        scopedDependencies,
        scopedNodes,
        freezeWindows,
      )
    : { score: 0, blockers: [] };

  // Simulation toggles
  const [simulatedApprovals, setSimulatedApprovals] = useState<Record<string, boolean>>({});
  const [simulatedResolvedIssues, setSimulatedResolvedIssues] = useState<Record<string, boolean>>({});
  const [simulatedHealedNodes, setSimulatedHealedNodes] = useState<Record<string, boolean>>({});
  const [simulatedMitigatedRisks, setSimulatedMitigatedRisks] = useState<Record<string, boolean>>({});

  // Reset simulation toggles when release changes
  const handleReleaseChange = (id: string) => {
    setSelectedReleaseId(id);
    setSimulatedApprovals({});
    setSimulatedResolvedIssues({});
    setSimulatedHealedNodes({});
    setSimulatedMitigatedRisks({});
  };

  const handleResetSim = () => {
    setSimulatedApprovals({});
    setSimulatedResolvedIssues({});
    setSimulatedHealedNodes({});
    setSimulatedMitigatedRisks({});
  };

  // Compute simulated results
  const simulatedResults = useMemo(() => {
    if (!selectedRelease) return null;

    const simApprovals = scopedApprovals.map((a) =>
      simulatedApprovals[a.id] ? { ...a, status: "Approved" as const } : a,
    );
    const simIssues = scopedIssues.map((i) =>
      simulatedResolvedIssues[i.id] ? { ...i, status: "Done" as const } : i,
    );
    const simNodes = scopedNodes.map((n) =>
      simulatedHealedNodes[n.id] ? { ...n, status: "Healthy" as const } : n,
    );
    const simRisks = scopedRisks.map((r) =>
      simulatedMitigatedRisks[r.id] ? { ...r, status: "Mitigated" as const } : r,
    );

    const readiness = getReadinessBreakdown(
      selectedRelease,
      simApprovals,
      simRisks,
      simIssues,
      scopedDependencies,
      simNodes,
      freezeWindows,
    );

    const risk = getRiskAssessment(
      selectedRelease,
      simApprovals,
      simRisks,
      simIssues,
      scopedDependencies,
      simNodes,
      freezeWindows,
    );

    return {
      readiness,
      risk,
    };
  }, [
    selectedRelease,
    scopedApprovals,
    scopedIssues,
    scopedNodes,
    scopedRisks,
    scopedDependencies,
    freezeWindows,
    simulatedApprovals,
    simulatedResolvedIssues,
    simulatedHealedNodes,
    simulatedMitigatedRisks,
  ]);

  if (!selectedRelease) return null;

  const scoreDelta = (simulatedResults?.readiness.score ?? 0) - baselineReadiness.score;
  const isModified =
    Object.values(simulatedApprovals).some(Boolean) ||
    Object.values(simulatedResolvedIssues).some(Boolean) ||
    Object.values(simulatedHealedNodes).some(Boolean) ||
    Object.values(simulatedMitigatedRisks).some(Boolean);

  return (
    <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/40 dark:border-indigo-900/40 dark:from-slate-800 dark:via-slate-800 dark:to-indigo-950/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              AI "What-If" Release Simulator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simulate actions in real time to calculate readiness deltas and identify the fastest path to green
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedReleaseId}
            onChange={(e) => handleReleaseChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            {activeReleases.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.id})
              </option>
            ))}
          </select>
          {isModified && (
            <button
              type="button"
              onClick={handleResetSim}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
              title="Reset simulation toggles"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Simulation Toggles (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          {/* Pending Approvals */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Hypothetical Governance Approvals
            </p>
            <div className="space-y-1.5">
              {scopedApprovals
                .filter((a) => a.status !== "Approved")
                .map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-2.5 text-xs shadow-xs hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800/80 cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {a.type} Approval
                      </span>
                      <p className="text-[11px] text-slate-400">Approver: {a.approver || "Pending"}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!simulatedApprovals[a.id]}
                      onChange={(e) =>
                        setSimulatedApprovals((prev) => ({ ...prev, [a.id]: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                ))}
              {scopedApprovals.filter((a) => a.status !== "Approved").length === 0 && (
                <p className="text-xs text-slate-400 py-1">All approvals are already approved.</p>
              )}
            </div>
          </div>

          {/* Blocked Issues */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Hypothetical Blocker Resolutions
            </p>
            <div className="space-y-1.5">
              {scopedIssues
                .filter((i) => i.status === "Blocked")
                .map((i) => (
                  <label
                    key={i.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-2.5 text-xs shadow-xs hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800/80 cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {i.key}: {i.summary}
                      </span>
                      <p className="text-[11px] text-red-500">Currently Blocked</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!simulatedResolvedIssues[i.id]}
                      onChange={(e) =>
                        setSimulatedResolvedIssues((prev) => ({ ...prev, [i.id]: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                ))}
              {scopedIssues.filter((i) => i.status === "Blocked").length === 0 && (
                <p className="text-xs text-slate-400 py-1">Zero blocked Jira tickets.</p>
              )}
            </div>
          </div>

          {/* Unhealthy Nodes */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Hypothetical Infrastructure Healing
            </p>
            <div className="space-y-1.5">
              {scopedNodes
                .filter((n) => n.status !== "Healthy")
                .map((n) => (
                  <label
                    key={n.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-2.5 text-xs shadow-xs hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800/80 cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{n.name}</span>
                      <p className="text-[11px] text-amber-500">Status: {n.status}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!simulatedHealedNodes[n.id]}
                      onChange={(e) =>
                        setSimulatedHealedNodes((prev) => ({ ...prev, [n.id]: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                ))}
              {scopedNodes.filter((n) => n.status !== "Healthy").length === 0 && (
                <p className="text-xs text-slate-400 py-1">All assigned cluster nodes are healthy.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Simulation Delta & Outcomes (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Readiness Score Impact
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className={`text-3xl font-extrabold tabular-nums ${readinessTone(simulatedResults?.readiness.score ?? 0)}`}>
                {simulatedResults?.readiness.score}%
              </span>
              <span className="text-xs text-slate-400">
                (was {baselineReadiness.score}%)
              </span>
              {scoreDelta > 0 && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  +{scoreDelta}%
                </span>
              )}
            </div>
            <div className="mt-3">
              <ProgressBar value={simulatedResults?.readiness.score ?? 0} />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Simulated Risk Level
              </p>
              <div className="flex items-center gap-2">
                <Badge className={riskLevelSolidStyles[simulatedResults?.risk.level || "Low"]}>
                  {simulatedResults?.risk.level.toUpperCase()} RISK
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Score: {simulatedResults?.risk.score}/100
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Remaining Simulated Blockers
              </p>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {simulatedResults?.readiness.blockers.map((b) => (
                  <li key={b} className="flex items-start gap-1.5">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-500" />
                    <span>{b}</span>
                  </li>
                ))}
                {simulatedResults?.readiness.blockers.length === 0 && (
                  <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Zero deployment blockers! Release is ready to ship.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
