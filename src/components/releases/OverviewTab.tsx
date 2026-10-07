import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type {
  Approval,
  Dependency,
  JiraIssue,
  KubernetesNode,
  Release,
  ReleasePackage,
  Risk,
  ProductionRepositoryAlignment,
} from "../../types";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { ProgressBar } from "../common/ProgressBar";
import { getReleaseProgress, getReadinessBreakdown, getBlockedJiraIssues } from "../../utils/calculations";
import { packageStatusStyles, readinessTone } from "../../utils/statusStyles";
import { ReleaseAiSummaryCard } from "../ai/ReleaseAiSummaryCard";
import { ReleaseProductionAlignmentCard } from "./ReleaseProductionAlignmentCard";
import { useCountUp } from "../../utils/useCountUp";

interface OverviewTabProps {
  release: Release;
  jiraIssues: JiraIssue[];
  packages: ReleasePackage[];
  dependencies: Dependency[];
  approvals: Approval[];
  risks: Risk[];
  nodes: KubernetesNode[];
  alignments?: ProductionRepositoryAlignment[];
}

export function OverviewTab({
  release,
  jiraIssues,
  packages,
  dependencies,
  approvals,
  risks,
  nodes,
  alignments = [],
}: OverviewTabProps) {
  const progress = getReleaseProgress(release, jiraIssues);
  const readiness = getReadinessBreakdown(
    release,
    approvals,
    risks,
    jiraIssues,
    dependencies,
    nodes,
    [],
    alignments,
  );
  const animatedReadiness = useCountUp(readiness.score);
  const blockedIssues = getBlockedJiraIssues(jiraIssues);
  const blockedDependencies = dependencies.filter((d) => d.status === "Blocked");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Description</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{release.description}</p>
        </Card>

        {/* Dedicated Production Alignment Card */}
        <ReleaseProductionAlignmentCard
          alignments={alignments}
          releaseName={release.name}
        />

        {(blockedIssues.length > 0 || blockedDependencies.length > 0) && (
          <Card className="border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">Blockers</h2>
            </div>
            <ul className="space-y-2 text-sm text-red-700 dark:text-red-400">
              {blockedIssues.map((issue) => (
                <li key={issue.id}>Jira {issue.key}: {issue.summary}</li>
              ))}
              {blockedDependencies.map((dep) => (
                <li key={dep.id}>Dependency: {dep.name}</li>
              ))}
            </ul>
          </Card>
        )}

        <Card>
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Packages</h2>
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {packages.map((pkg) => (
              <li key={pkg.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{pkg.name}</p>
                  <p className="text-xs text-slate-400">{pkg.type} · v{pkg.version}</p>
                </div>
                <Badge className={packageStatusStyles[pkg.status]}>{pkg.status}</Badge>
              </li>
            ))}
            {packages.length === 0 && (
              <li className="py-2 text-sm text-slate-400">No packages for this release.</li>
            )}
          </ul>
        </Card>

        <ReleaseAiSummaryCard
          release={release}
          jiraIssues={jiraIssues}
          approvals={approvals}
          risks={risks}
          dependencies={dependencies}
          nodes={nodes}
          alignments={alignments}
        />
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Progress</h2>
          <ProgressBar value={progress} />
        </Card>

        {/* Enhanced Deployment Readiness Card */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Deployment Readiness
            </h2>
            <p className={`text-2xl font-bold tabular-nums ${readinessTone(readiness.score)}`}>
              {animatedReadiness}%
            </p>
          </div>

          {/* Factor Checklist */}
          <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-3 dark:border-slate-800">
            {readiness.factors.map((factor) => {
              const isPassed = factor.status === "passed";
              const isWarning = factor.status === "warning";
              return (
                <div key={factor.id} className="flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                    {isPassed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : isWarning ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    )}
                    <span>{factor.name}</span>
                  </div>
                  <span
                    className={`text-right ${
                      isPassed
                        ? "text-slate-500 dark:text-slate-400"
                        : isWarning
                        ? "font-medium text-amber-600 dark:text-amber-400"
                        : "font-medium text-red-600 dark:text-red-400"
                    }`}
                  >
                    {factor.summary}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recommendation */}
          {readiness.recommendation && (
            <div className="mt-4 rounded-lg bg-blue-50/70 p-2.5 text-xs text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
              <span className="font-semibold">Recommendation: </span>
              {readiness.recommendation}
            </div>
          )}

          {readiness.blockers.length > 0 ? (
            <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Blockers & Warnings ({readiness.blockers.length})
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                {readiness.blockers.map((blocker) => (
                  <li key={blocker} className="flex items-start gap-1.5">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-500" />
                    {blocker}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">
              No blockers — fully ready.
            </p>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Release Information</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Release Manager</dt>
              <dd className="text-slate-800 dark:text-slate-200">{release.releaseManager}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Environment</dt>
              <dd className="text-slate-800 dark:text-slate-200">{release.environment}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Version</dt>
              <dd className="text-slate-800 dark:text-slate-200">{release.version}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
