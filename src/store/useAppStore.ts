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
  FreezeWindow,
  Persona,
  ProductionRepositoryAlignment,
} from "../types";
import { PERSONAS } from "../types/persona";
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
  freezeWindows as seedFreezeWindows,
  productionAlignments as seedProductionAlignments,
} from "../data";
import { getDeploymentBlockers } from "../utils/calculations";

// Helper to ensure in-memory state always starts with pristine cloned seed data
const clone = <T>(val: T): T => JSON.parse(JSON.stringify(val));

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

export interface NewReleaseInput {
  name: string;
  version: string;
  environment: "Development" | "Staging" | "Production";
  targetDate: string;
  releaseManager: string;
  description: string;
  template?: "standard" | "soc2" | "hotfix";
}

interface AppState {
  currentUser: Persona;
  switchPersona: (personaId: string) => void;
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
  freezeWindows: FreezeWindow[];
  productionAlignments: ProductionRepositoryAlignment[];

  updateRelease: (releaseId: string, changes: Partial<Release>) => void;
  createRelease: (input: NewReleaseInput) => Release;
  advanceReleaseStatus: (releaseId: string) => string[];
  updateApproval: (
    approvalId: string,
    status: ApprovalStatus,
    comment?: string,
  ) => void;
  updateJiraIssue: (issueId: string, status: JiraStatus) => void;
  updateKubernetesNode: (nodeId: string, status: NodeStatus) => void;
  mitigateRisk: (
    riskId: string,
    status: "Mitigated" | "Accepted",
    mitigationNotes?: string,
  ) => void;
  addReleaseNote: (releaseId: string, author: string, content: string) => void;
  addActivity: (releaseId: string, actor: string, action: string) => void;
  markMailRead: (mailId: string) => void;
  addFreezeWindow: (window: Omit<FreezeWindow, "id">) => void;
  toggleFreezeWindow: (id: string) => void;
  deleteFreezeWindow: (id: string) => void;
  updateProductionAlignment: (
    repoId: string,
    changes: Partial<ProductionRepositoryAlignment>,
  ) => void;
  simulateDeployRelease: (repoId: string) => void;
  resetToSeedData: () => void;
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

export const useAppStore = create<AppState>()((set, get) => ({
  currentUser: PERSONAS[0],
  switchPersona: (personaId: string) => {
    const persona = PERSONAS.find((p) => p.id === personaId) ?? PERSONAS[0];
    set({ currentUser: persona });
  },

  isMobileSidebarOpen: false,
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  releases: clone(seedReleases),
  jiraIssues: clone(seedJiraIssues),
  kubernetesClusters: clone(seedClusters),
  kubernetesNodes: clone(seedNodes),
  releasePackages: clone(seedPackages),
  dependencies: clone(seedDependencies),
  risks: clone(seedRisks),
  activities: clone(seedActivities),
  releaseNotes: clone(seedNotes),
  approvals: clone(seedApprovals),
  mails: clone(seedMails),
  freezeWindows: clone(seedFreezeWindows),
  productionAlignments: clone(seedProductionAlignments),

      updateRelease: (releaseId, changes) =>
        set((state) => ({
          releases: state.releases.map((release) =>
            release.id === releaseId ? { ...release, ...changes } : release,
          ),
        })),

      createRelease: (input) => {
        const state = get();
        const nextNum = 1000 + state.releases.length + 1;
        const newId = `REL-${nextNum}`;

        // Create standard approvals based on template
        const isSoc2 = input.template === "soc2";
        const isHotfix = input.template === "hotfix";

        const approvalTypes: import("../types").ApprovalType[] = isHotfix
          ? ["Security", "Deployment"]
          : isSoc2
            ? ["Security", "Change Advisory", "CAB", "Business", "Deployment"]
            : ["Security", "Change Advisory", "Deployment"];

        const newApprovals: Approval[] = approvalTypes.map((type, idx) => ({
          id: `APR-${nextNum}-${idx + 1}`,
          releaseId: newId,
          type,
          order: idx + 1,
          status: "Pending",
          approver: type.includes("Security") ? "Priya Nair" : type.includes("QA") ? "Sarah Lin" : "Alex Morgan",
          requestedDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 86400000 * (idx + 2)).toISOString(),
        }));

        const newActivity = makeActivity(
          newId,
          state.currentUser.name,
          `Created release ${input.name} (v${input.version}) targeting ${input.environment}`,
        );

        const newRelease: Release = {
          id: newId,
          name: input.name,
          version: input.version,
          environment: input.environment,
          status: "In Progress",
          targetDate: input.targetDate,
          releaseManager: input.releaseManager || state.currentUser.name,
          description: input.description,
          progress: 10,
          jiraIssueIds: [],
          packageIds: [],
          dependencyIds: [],
          approvalIds: newApprovals.map((a) => a.id),
          riskIds: [],
          activityIds: [newActivity.id],
          noteIds: [],
          clusterIds: ["CLU-01"],
          aiSummary: `Initial release plan created. Target deployment is ${input.targetDate}. Governance gates have been initialized.`,
        };

        set((s) => ({
          releases: [newRelease, ...s.releases],
          approvals: [...newApprovals, ...s.approvals],
          activities: [newActivity, ...s.activities],
        }));

        return newRelease;
      },

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
          const blockers = getDeploymentBlockers(
            approvals,
            risks,
            issues,
            nodes,
            state.freezeWindows,
            release.environment,
            release.targetDate,
          );
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

      mitigateRisk: (riskId, status, mitigationNotes) =>
        set((state) => {
          const risk = state.risks.find((r) => r.id === riskId);
          if (!risk) return state;

          const actionLabel =
            status === "Mitigated"
              ? `Mitigated risk "${risk.title}"${mitigationNotes ? `: ${mitigationNotes}` : ""}`
              : `Accepted risk exception for "${risk.title}"${mitigationNotes ? `: ${mitigationNotes}` : ""}`;
          const activity = makeActivity(risk.releaseId, state.currentUser.name, actionLabel);

          return {
            risks: state.risks.map((r) =>
              r.id === riskId
                ? {
                    ...r,
                    status,
                    mitigation: mitigationNotes ? `${r.mitigation} | Note: ${mitigationNotes}` : r.mitigation,
                  }
                : r,
            ),
            activities: [activity, ...state.activities],
            releases: attachActivityToReleases(state.releases, [activity]),
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

      addFreezeWindow: (window) =>
        set((state) => ({
          freezeWindows: [
            {
              id: `FREEZE-${Date.now()}`,
              ...window,
            },
            ...state.freezeWindows,
          ],
        })),

      toggleFreezeWindow: (id) =>
        set((state) => ({
          freezeWindows: state.freezeWindows.map((w) =>
            w.id === id ? { ...w, enforced: !w.enforced } : w,
          ),
        })),

      deleteFreezeWindow: (id) =>
        set((state) => ({
          freezeWindows: state.freezeWindows.filter((w) => w.id !== id),
        })),

      updateProductionAlignment: (repoId, changes) =>
        set((state) => ({
          productionAlignments: state.productionAlignments.map((repo) =>
            repo.repositoryId === repoId ? { ...repo, ...changes } : repo,
          ),
        })),

      simulateDeployRelease: (repoId) => {
        set((state) => {
          const target = state.productionAlignments.find((r) => r.repositoryId === repoId);
          if (!target) return state;
          const updatedRepos = state.productionAlignments.map((repo) => {
            if (repo.repositoryId !== repoId) return repo;
            return {
              ...repo,
              productionVersion: repo.releaseVersion,
              productionCommit: repo.releaseCommit,
              releaseStatus: "Deployed" as const,
              alignmentStatus: "ALIGNED" as const,
              commitsAheadReleaseVsProd: 0,
              commitsAhead: 0,
              commitsAheadTrunkVsProd: repo.commitsAheadTrunkVsRelease,
              lastProductionDeployment: "Just now",
              deploymentDate: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
              deployedBy: `${state.currentUser.name} (${state.currentUser.role})`,
              isDiverged: false,
              divergenceReason: undefined,
              explanation: `Production is fully aligned with Release ${repo.releaseVersion}. Deployed just now.`,
              recommendation: "No action required. Repository is in optimal release health.",
              changesNotInProduction: [],
            };
          });
          return { productionAlignments: updatedRepos };
        });
      },

      resetToSeedData: () => {
        set({
          currentUser: PERSONAS[0],
          releases: clone(seedReleases),
          jiraIssues: clone(seedJiraIssues),
          kubernetesClusters: clone(seedClusters),
          kubernetesNodes: clone(seedNodes),
          releasePackages: clone(seedPackages),
          dependencies: clone(seedDependencies),
          risks: clone(seedRisks),
          activities: clone(seedActivities),
          releaseNotes: clone(seedNotes),
          approvals: clone(seedApprovals),
          mails: clone(seedMails),
          freezeWindows: clone(seedFreezeWindows),
          productionAlignments: clone(seedProductionAlignments),
        });
      },
    }));
