import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import type { Approval, Dependency, JiraIssue, KubernetesNode, Release, Risk } from "../../types";
import { Card } from "../common/Card";
import { getReadinessBreakdown, getRiskAssessment } from "../../utils/calculations";
import { generateReleaseSummary, getRecommendedActions } from "../../utils/aiInsights";

interface ReleaseAiSummaryCardProps {
  release: Release;
  jiraIssues: JiraIssue[];
  approvals: Approval[];
  risks: Risk[];
  dependencies: Dependency[];
  nodes: KubernetesNode[];
}

export function ReleaseAiSummaryCard({
  release,
  jiraIssues,
  approvals,
  risks,
  dependencies,
  nodes,
}: ReleaseAiSummaryCardProps) {
  const readiness = getReadinessBreakdown(release, approvals, risks, jiraIssues, dependencies, nodes);
  const risk = getRiskAssessment(release, approvals, risks, jiraIssues, dependencies, nodes);
  const actions = getRecommendedActions(jiraIssues, nodes, approvals, dependencies, risks);

  // A signature of every input that can change the generated text — not
  // just the readiness score, which can round to the same value (e.g. 0%)
  // even after a real blocker is resolved.
  const dataSignature = [readiness.score, readiness.blockers.join("|"), actions.join("|")].join("::");

  const [summary, setSummary] = useState<string | null>(null);
  const [generatedForSignature, setGeneratedForSignature] = useState<string | null>(null);

  const isStale = summary !== null && generatedForSignature !== dataSignature;

  const handleGenerate = () => {
    setSummary(generateReleaseSummary(release, readiness, jiraIssues, approvals, nodes, actions));
    setGeneratedForSignature(dataSignature);
  };

  return (
    <Card className="border-blue-100 bg-gradient-to-br from-blue-50/60 to-white dark:border-blue-900/50 dark:from-blue-950/40 dark:to-slate-800">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Release AI Summary</h2>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
        >
          <RefreshCw className="h-3 w-3" />
          {summary ? "Regenerate" : "Generate"} AI Summary
        </button>
      </div>

      {summary ? (
        <>
          <p className="animate-fade-in-up text-sm text-slate-600 dark:text-slate-300">{summary}</p>
          {isStale && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              Underlying data has changed (risk level: {risk.level}) since this summary was generated —
              regenerate for an up-to-date analysis.
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-400">
          Click "Generate AI Summary" for a deterministic, data-driven analysis of this release's
          current readiness, blockers, and recommended next step.
        </p>
      )}
    </Card>
  );
}
