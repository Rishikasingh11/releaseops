export type ReleaseStatus =
  | "In Progress"
  | "Pending Approval"
  | "Ready for Deployment"
  | "Deployed"
  | "Closed"
  | "At Risk";

export type Environment = "Development" | "Staging" | "Production";

export interface ReleasePackage {
  id: string;
  releaseId: string;
  name: string;
  version: string;
  type: "Service" | "Library" | "Infra" | "Config";
  status: "Pending" | "Building" | "Built" | "Deployed" | "Failed";
}

export interface Dependency {
  id: string;
  releaseId: string;
  name: string;
  dependsOnReleaseId?: string;
  type: "Internal" | "External" | "Infra";
  status: "Satisfied" | "Pending" | "Blocked";
}

export type RiskSeverity = "Low" | "Medium" | "High" | "Critical";

export interface Risk {
  id: string;
  releaseId: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  likelihood: "Low" | "Medium" | "High";
  mitigation: string;
  status: "Open" | "Mitigated" | "Accepted";
}

export interface Activity {
  id: string;
  releaseId: string;
  actor: string;
  action: string;
  timestamp: string;
}

export interface ReleaseNote {
  id: string;
  releaseId: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Release {
  id: string;
  name: string;
  version: string;
  environment: Environment;
  status: ReleaseStatus;
  targetDate: string;
  releaseManager: string;
  description: string;
  progress: number;
  jiraIssueIds: string[];
  packageIds: string[];
  dependencyIds: string[];
  approvalIds: string[];
  riskIds: string[];
  activityIds: string[];
  noteIds: string[];
  clusterIds: string[];
  aiSummary: string;
  repositoryIds?: string[];
}
