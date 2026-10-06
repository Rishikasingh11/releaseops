import { useState } from "react";
import {
  Shield,
  User,
  Download,
  RefreshCw,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { useAppStore } from "../store/useAppStore";
import { PERSONAS } from "../types/persona";
import { useToastStore } from "../store/useToastStore";

export function SettingsPage() {
  const currentUser = useAppStore((state) => state.currentUser);
  const switchPersona = useAppStore((state) => state.switchPersona);
  const resetToSeedData = useAppStore((state) => state.resetToSeedData);
  const releases = useAppStore((state) => state.releases);
  const approvals = useAppStore((state) => state.approvals);
  const showToast = useToastStore((state) => state.showToast);

  // Enterprise policy toggles
  const [enforceFreeze, setEnforceFreeze] = useState(true);
  const [requireThreeApprovals, setRequireThreeApprovals] = useState(true);
  const [zeroCriticalNodes, setZeroCriticalNodes] = useState(true);
  const [requireMitigationNotes, setRequireMitigationNotes] = useState(true);

  const handleExportJson = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      user: currentUser,
      releases,
      approvals,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `releaseops-audit-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({
      variant: "success",
      title: "Audit manifest downloaded",
      description: "Full JSON compliance report exported.",
    });
  };

  const handleReset = () => {
    if (window.confirm("Reset all release, approval, and infrastructure data back to initial demo defaults?")) {
      resetToSeedData();
      showToast({
        variant: "success",
        title: "Demo data reset successfully",
        description: "All seed releases, nodes, and approvals restored.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Enterprise Governance"
        description="Manage workspace policies, role-based access control, compliance configurations, and audit exports."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User Identity & RBAC (1 col) */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Active Identity (RBAC)
              </h2>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white shadow-md ${currentUser.color || "bg-blue-600"}`}
              >
                {currentUser.avatarLetter}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.title}</p>
                <Badge className="mt-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
                  {currentUser.role}
                </Badge>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Assigned Permissions
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {currentUser.permissions.map((perm) => (
                  <li key={perm} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Quick Switch Persona
              </p>
              <div className="space-y-1.5">
                {PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => switchPersona(persona.id)}
                    className={`flex w-full items-center justify-between rounded-lg p-2 text-xs transition-colors ${
                      persona.id === currentUser.id
                        ? "bg-blue-50 font-semibold text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                        : "hover:bg-slate-50 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <span>{persona.name} ({persona.role})</span>
                    {persona.id === currentUser.id && (
                      <span className="text-[10px] text-blue-600 font-bold">ACTIVE</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Data Management Card */}
          <Card>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
              <RefreshCw className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Data Management
              </h2>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              ReleaseOps persists your state in your local browser session. You can reset to initial seed data anytime.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50/50 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Demo Data to Seed
            </button>
          </Card>
        </div>

        {/* Governance & Compliance Policies (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
              <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Release Governance & Compliance Rules
              </h2>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              <div className="flex items-center justify-between py-4">
                <div className="pr-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Enforce Change Freeze Windows
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hard-blocks advancing releases to "Deployed" during active corporate freeze windows (e.g. Q4 close, Black Friday).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enforceFreeze}
                  onChange={(e) => setEnforceFreeze(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="pr-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Minimum 3 Approvals for Production
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Requires Security, QA Sign-off, and Change Advisory Board (CAB) approval before production release gate opens.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireThreeApprovals}
                  onChange={(e) => setRequireThreeApprovals(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="pr-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Zero-Critical-Node Policy
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Automatically flags deployment gates as blocked if any Mirantis Kubernetes cluster node assigned to the release is in Critical state.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={zeroCriticalNodes}
                  onChange={(e) => setZeroCriticalNodes(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="pr-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Mandatory Risk Mitigation Audit Trail
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Requires documentation and engineer sign-off when mitigating open high/critical risks or accepting operational exceptions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireMitigationNotes}
                  onChange={(e) => setRequireMitigationNotes(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>

          {/* Compliance & Audit Export */}
          <Card>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
              <FileCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                SOC2 / ISO Compliance Audit Package
              </h2>
            </div>
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
              Generate an audit-ready compliance package containing timestamped approval logs, Jira traceability, risk exception history, and infrastructure telemetry.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700 transition-all"
              >
                <Download className="h-4 w-4" />
                Export Audit Package (JSON)
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
