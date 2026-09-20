import type { Dependency } from "../types";

export const dependencies: Dependency[] = [
  { id: "DEP-1", releaseId: "REL-1001", name: "Fraud Scoring Service v2", type: "Internal", status: "Pending" },
  { id: "DEP-2", releaseId: "REL-1001", name: "PSP Sandbox Certification", type: "External", status: "Blocked" },

  { id: "DEP-3", releaseId: "REL-1002", name: "Design System Tokens 2.1.0", dependsOnReleaseId: "REL-1002", type: "Internal", status: "Satisfied" },

  { id: "DEP-4", releaseId: "REL-1003", name: "Warehouse Feed API v3", type: "External", status: "Satisfied" },

  { id: "DEP-5", releaseId: "REL-1004", name: "Notification Templates 4.0.0", type: "Internal", status: "Satisfied" },

  { id: "DEP-6", releaseId: "REL-1005", name: "Legacy Invoice Redirect Rules", type: "Infra", status: "Satisfied" },

  { id: "DEP-7", releaseId: "REL-1006", name: "Redis Session Cluster", type: "Infra", status: "Blocked" },
  { id: "DEP-8", releaseId: "REL-1006", name: "iOS Biometric SDK 5.2", type: "External", status: "Pending" },
];
