import { useState } from "react";
import { FileText } from "lucide-react";
import type { Approval, JiraIssue, KubernetesNode, Release, ReleasePackage, Risk, ProductionRepositoryAlignment } from "../../types";
import { Badge } from "../common/Badge";
import { releaseStatusStyles, urgentReleaseStatuses } from "../../utils/statusStyles";
import { formatDate } from "../../utils/format";
import { ReleaseStatusControl } from "./ReleaseStatusControl";
import { ExecutiveBriefingModal } from "./ExecutiveBriefingModal";
import { getReadinessBreakdown } from "../../utils/calculations";

interface ReleaseHeaderProps {
  release: Release;
  jiraIssues: JiraIssue[];
  nodes: KubernetesNode[];
  approvals: Approval[];
  risks: Risk[];
  packages?: ReleasePackage[];
  alignments?: ProductionRepositoryAlignment[];
}

export function ReleaseHeader({
  release,
  jiraIssues,
  nodes,
  approvals,
  risks,
  packages = [],
  alignments = [],
}: ReleaseHeaderProps) {
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const readiness = getReadinessBreakdown(release, approvals, risks, jiraIssues, [], nodes, [], alignments);

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800">
      <div>
        <p className="text-xs font-medium text-slate-400">{release.id}</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{release.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          <span>Version {release.version}</span>
          <span>{release.environment}</span>
          <span>Target: {formatDate(release.targetDate)}</span>
          <span>Manager: {release.releaseManager}</span>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <Badge
          className={`${releaseStatusStyles[release.status]} px-3 py-1 text-sm`}
          dot={urgentReleaseStatuses.has(release.status)}
        >
          {release.status}
        </Badge>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBriefingOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FileText className="h-4 w-4 text-slate-400" />
            Executive Briefing
          </button>
          <ReleaseStatusControl
            release={release}
            jiraIssues={jiraIssues}
            nodes={nodes}
            approvals={approvals}
            risks={risks}
          />
        </div>
      </div>

      <ExecutiveBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        release={release}
        jiraIssues={jiraIssues}
        packages={packages}
        approvals={approvals}
        risks={risks}
        nodes={nodes}
        readinessScore={readiness.score}
        alignments={alignments}
      />
    </div>
  );
}
