export type AlignmentStatus =
  | "ALIGNED"
  | "RELEASE PENDING"
  | "BEHIND"
  | "DIVERGED"
  | "ATTENTION REQUIRED";

export type BranchStatus = "Up to Date" | "Ahead" | "Behind" | "Diverged";

export type ChangeType =
  | "Feature enhancement"
  | "Bug fix"
  | "Security patch"
  | "Configuration update"
  | "Dependency upgrade";

export interface UnpublishedChange {
  id: string;
  commitId: string;
  description: string;
  author: string;
  date: string;
  jiraIssue?: string;
  branch: "Trunk" | "Release" | "Hotfix";
  type: ChangeType;
}

export interface ProductionRepositoryAlignment {
  repositoryId: string;
  repositoryName: string;
  applicationName: string;
  environment: "Production" | "Staging" | "DR-Production";
  releaseId?: string;
  releaseName?: string;

  // Branch Versions
  trunkVersion: string;
  releaseVersion: string;
  productionVersion: string;

  // Commit Hashes
  trunkCommit: string;
  releaseCommit: string;
  productionCommit: string;

  // Branch States
  trunkStatus: BranchStatus;
  releaseStatus:
    | "Awaiting Deployment"
    | "Ready for Deployment"
    | "In Staging"
    | "Deployed"
    | "Diverged"
    | "Blocked";
  alignmentStatus: AlignmentStatus;

  // Commit Deltas
  commitsAheadTrunkVsRelease: number;
  commitsAheadReleaseVsProd: number;
  commitsAheadTrunkVsProd: number;
  commitsAhead: number;

  // Deployment Metadata
  lastProductionDeployment: string;
  deploymentDate: string;
  deployedBy: string;

  // Explainable Analysis
  explanation: string;
  recommendation?: string;
  isDiverged?: boolean;
  divergenceReason?: string;

  // Unreleased changes
  changesNotInProduction: UnpublishedChange[];
}

export interface AlignmentFilterState {
  search: string;
  alignmentStatus: string;
  environment: string;
  application: string;
  releaseStatus: string;
}
