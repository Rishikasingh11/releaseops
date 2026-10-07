import { useState } from "react";
import { useParams } from "react-router-dom";
import { ReleaseHeader } from "../components/releases/ReleaseHeader";
import { OverviewTab } from "../components/releases/OverviewTab";
import { DependenciesTab } from "../components/releases/DependenciesTab";
import { RisksTab } from "../components/releases/RisksTab";
import { TimelineTab } from "../components/releases/TimelineTab";
import { NotesTab } from "../components/releases/NotesTab";
import { JiraIssuesTable } from "../components/jira/JiraIssuesTable";
import { NodesTable } from "../components/kubernetes/NodesTable";
import { ApprovalWorkflow } from "../components/approvals/ApprovalWorkflow";
import { Tabs } from "../components/common/Tabs";
import { Card } from "../components/common/Card";
import { useReleaseWorkspace } from "../store/selectors";

const TABS = [
  "Overview",
  "Jira",
  "Dependencies",
  "Kubernetes",
  "Approvals",
  "Risks",
  "Timeline",
  "Notes",
];

export function ReleaseDetailPage() {
  const { releaseId } = useParams<{ releaseId: string }>();
  const [activeTab, setActiveTab] = useState("Overview");
  const workspace = useReleaseWorkspace(releaseId);

  if (!workspace.release) {
    return (
      <Card>
        <p className="text-sm text-slate-500">Release "{releaseId}" was not found.</p>
      </Card>
    );
  }

  const {
    release,
    jiraIssues,
    packages,
    dependencies,
    approvals,
    risks,
    activities,
    notes,
    nodes,
    alignments,
  } = workspace;

  return (
    <div>
      <ReleaseHeader
        release={release}
        jiraIssues={jiraIssues}
        nodes={nodes}
        approvals={approvals}
        risks={risks}
        packages={packages}
        alignments={alignments}
      />

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/*
        Every tab panel stays mounted and is hidden with the `hidden`
        attribute rather than conditionally rendered. Conditionally
        rendering (unmount/remount on tab switch) would reset any local
        component state inside a panel — e.g. the generated Release AI
        Summary on Overview — every time the user switched tabs and back.
      */}
      <div className="mt-6">
        <div hidden={activeTab !== "Overview"}>
          <OverviewTab
            release={release}
            jiraIssues={jiraIssues}
            packages={packages}
            dependencies={dependencies}
            approvals={approvals}
            risks={risks}
            nodes={nodes}
            alignments={alignments}
          />
        </div>
        <div hidden={activeTab !== "Jira"}>
          <JiraIssuesTable issues={jiraIssues} />
        </div>
        <div hidden={activeTab !== "Dependencies"}>
          <DependenciesTab dependencies={dependencies} />
        </div>
        <div hidden={activeTab !== "Kubernetes"}>
          <NodesTable nodes={nodes} showClusterColumn />
        </div>
        <div hidden={activeTab !== "Approvals"}>
          <ApprovalWorkflow approvals={approvals} />
        </div>
        <div hidden={activeTab !== "Risks"}>
          <RisksTab risks={risks} />
        </div>
        <div hidden={activeTab !== "Timeline"}>
          <TimelineTab activities={activities} />
        </div>
        <div hidden={activeTab !== "Notes"}>
          <NotesTab releaseId={release.id} notes={notes} />
        </div>
      </div>
    </div>
  );
}
