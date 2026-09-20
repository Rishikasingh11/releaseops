import type { Approval, JiraIssue, KubernetesNode, Release, Risk } from "../../types";
import { Badge } from "../common/Badge";
import { releaseStatusStyles, urgentReleaseStatuses } from "../../utils/statusStyles";
import { formatDate } from "../../utils/format";
import { ReleaseStatusControl } from "./ReleaseStatusControl";

interface ReleaseHeaderProps {
  release: Release;
  jiraIssues: JiraIssue[];
  nodes: KubernetesNode[];
  approvals: Approval[];
  risks: Risk[];
}

export function ReleaseHeader({ release, jiraIssues, nodes, approvals, risks }: ReleaseHeaderProps) {
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
        <ReleaseStatusControl
          release={release}
          jiraIssues={jiraIssues}
          nodes={nodes}
          approvals={approvals}
          risks={risks}
        />
      </div>
    </div>
  );
}
