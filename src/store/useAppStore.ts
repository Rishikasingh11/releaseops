import { create } from "zustand";
import type {
  Activity,
  Approval,
  ApprovalStatus,
  JiraIssue,
  JiraStatus,
  KubernetesCluster,
  KubernetesNode,
  NodeStatus,
  Mail,
  Release,
  ReleaseNote,
  ReleaseStatus,
  ReleasePackage,
  Dependency,
  Risk,
} from "../types";
import {
  releases as seedReleases,
  jiraIssues as seedJiraIssues,
  kubernetesClusters as seedClusters,
  kubernetesNodes as seedNodes,
  releasePackages as seedPackages,
  dependencies as seedDependencies,
  risks as seedRisks,
  activities as seedActivities,
  releaseNotes as seedNotes,
  approvals as seedApprovals,
  mails as seedMails,
} from "../data";
import { getDeploymentBlockers } from "../utils/calculations";

interface CurrentUser {
  name: string;
  role: string;
}

const RELEASE_FLOW: ReleaseStatus[] = [
  "In Progress",
  "Pending Approval",
  "Ready for Deployment",
  "Deployed",
  "Closed",
];

export function getNextReleaseStatus(status: ReleaseStatus): ReleaseStatus | null {
  const index = RELEASE_FLOW.indexOf(status);
  if (index === -1 || index === RELEASE_FLOW.length - 1) return null;
  return RELEASE_FLOW[index + 1];
}

interface AppState {
  currentUser: CurrentUser;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  releases: Release[];
  jiraIssues: JiraIssue[];
  kubernetesClusters: KubernetesCluster[];
  kubernetesNodes: KubernetesNode[];
  releasePackages: ReleasePackage[];
  dependencies: Dependency[];
  risks: Risk[];
  activities: Activity[];
  releaseNotes: ReleaseNote[];
  approvals: Approval[];
  mails: Mail[];

  updateRelease: (releaseId: string, changes: Partial<Release>) => void;
  advanceReleaseStatus: (releaseId: string) => string[];
  updateApproval: (
    approvalId: string,
    status: ApprovalStatus,
    comment?: string,
  ) => void;
  updateJiraIssue: (issueId: string, status: JiraStatus) => void;
  updateKubernetesNode: (nodeId: string, status: NodeStatus) => void;
  addReleaseNote: (releaseId: string, author: string, content: string) => void;
  addActivity: (releaseId: string, actor: string, action: string) => void;
  markMailRead: (mailId: string) => void;
}

function makeActivity(releaseId: string, actor: string, action: string): Activity {
  return {
    id: `ACT-${crypto.randomUUID()}`,
    releaseId,
    actor,
    action,
    timestamp: new Date().toISOString(),
  };
}

function attachActivityToReleases(releases: Release[], activities: Activity[]): Release[] {
  const byRelease = new Map<string, string[]>();
  activities.forEach((activity) => {
    byRelease.set(activity.releaseId, [
      activity.id,
      ...(byRelease.get(activity.releaseId) ?? []),
    ]);
  });

  return releases.map((release) => {
    const newIds = byRelease.get(release.id);
    return newIds ? { ...release, activityIds: [...newIds, ...release.activityIds] } : release;
  });
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: {
    name: "Alex Morgan",
    role: "Release Manager",
  },
  isMobileSidebarOpen: false,
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  releases: seedReleases,
  jiraIssues: seedJiraIssues,
  kubernetesClusters: seedClusters,
  kubernetesNodes: seedNodes,
  releasePackages: seedPackages,
  dependencies: seedDependencies,
  risks: seedRisks,
  activities: seedActivities,
  releaseNotes: seedNotes,
  approvals: seedApprovals,
  mails: seedMails,

  updateRelease: (releaseId, changes) =>
    set((state) => ({
      releases: state.releases.map((release) =>
        release.id === releaseId ? { ...release, ...changes } : release,
      ),
    })),

  advanceReleaseStatus: (releaseId) => {
    const state = get();
    const release = state.releases.find((r) => r.id === releaseId);
    if (!release) return [];

    const nextStatus = getNextReleaseStatus(release.status);
    if (!nextStatus) return [];

    if (nextStatus === "Deployed") {
      const issues = state.jiraIssues.filter((i) => release.jiraIssueIds.includes(i.id));
      const nodes = state.kubernetesNodes.filter((n) => release.clusterIds.includes(n.clusterId));
      const approvals = state.approvals.filter((a) => release.approvalIds.includes(a.id));
      const risks = state.risks.filter((r) => release.riskIds.includes(r.id));
      const blockers = getDeploymentBlockers(approvals, risks, issues, nodes);
      if (blockers.length > 0) return blockers;
    }

    const actor = state.currentUser.name;
    const activity = makeActivity(releaseId, actor, `Advanced release status to "${nextStatus}"`);

    set((s) => ({
      releases: attachActivityToReleases(
        s.releases.map((r) => (r.id === releaseId ? { ...r, status: nextStatus } : r)),
        [activity],
      ),
      activities: [activity, ...s.activities],
    }));

    return [];
  },

  updateApproval: (approvalId, status, comment) =>
    set((state) => {
      const approval = state.approvals.find((a) => a.id === approvalId);
      if (!approval) return state;

      const actionLabel =
        status === "Approved"
          ? `Approved the ${approval.type} approval`
          : status === "Rejected"
            ? `Rejected the ${approval.type} approval`
            : `Requested more information for the ${approval.type} approval`;
      const activity = makeActivity(approval.releaseId, state.currentUser.name, actionLabel);

      return {
        approvals: state.approvals.map((a) =>
          a.id === approvalId ? { ...a, status, comment: comment ?? a.comment } : a,
        ),
        activities: [activity, ...state.activities],
        releases: attachActivityToReleases(state.releases, [activity]),
      };
    }),

  updateJiraIssue: (issueId, status) =>
    set((state) => {
      const issue = state.jiraIssues.find((i) => i.id === issueId);
      if (!issue) return state;

      const actionLabel =
        issue.status === "Blocked" && status === "Done"
          ? `Resolved blocker on ${issue.key} — moved to Done`
          : `Moved ${issue.key} from ${issue.status} to ${status}`;
      const activity = makeActivity(issue.releaseId, state.currentUser.name, actionLabel);

      return {
        jiraIssues: state.jiraIssues.map((i) => (i.id === issueId ? { ...i, status } : i)),
        activities: [activity, ...state.activities],
        releases: attachActivityToReleases(state.releases, [activity]),
      };
    }),

  updateKubernetesNode: (nodeId, status) =>
    set((state) => {
      const node = state.kubernetesNodes.find((n) => n.id === nodeId);
      if (!node) return state;

      const wasUnhealthy = node.status !== "Healthy";
      const affectedReleases =
        status === "Healthy" && wasUnhealthy
          ? state.releases.filter((r) => r.clusterIds.includes(node.clusterId))
          : [];

      const newActivities = affectedReleases.map((release) =>
        makeActivity(
          release.id,
          state.currentUser.name,
          `Resolved ${node.status.toLowerCase()} node ${node.name}, improving infrastructure readiness`,
        ),
      );

      return {
        kubernetesNodes: state.kubernetesNodes.map((n) =>
          n.id === nodeId ? { ...n, status } : n,
        ),
        activities: [...newActivities, ...state.activities],
        releases: attachActivityToReleases(state.releases, newActivities),
      };
    }),

  addReleaseNote: (releaseId, author, content) =>
    set((state) => {
      const note: ReleaseNote = {
        id: `NOTE-${crypto.randomUUID()}`,
        releaseId,
        author,
        content,
        timestamp: new Date().toISOString(),
      };
      const activity = makeActivity(releaseId, author, "Added a release note");

      return {
        releaseNotes: [note, ...state.releaseNotes],
        activities: [activity, ...state.activities],
        releases: attachActivityToReleases(
          state.releases.map((release) =>
            release.id === releaseId
              ? { ...release, noteIds: [note.id, ...release.noteIds] }
              : release,
          ),
          [activity],
        ),
      };
    }),

  addActivity: (releaseId, actor, action) =>
    set((state) => {
      const activity = makeActivity(releaseId, actor, action);
      return {
        activities: [activity, ...state.activities],
        releases: attachActivityToReleases(state.releases, [activity]),
      };
    }),

  markMailRead: (mailId) =>
    set((state) => ({
      mails: state.mails.map((mail) =>
        mail.id === mailId ? { ...mail, read: true } : mail,
      ),
    })),
}));
