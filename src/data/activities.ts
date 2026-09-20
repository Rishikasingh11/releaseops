import type { Activity } from "../types";

export const activities: Activity[] = [
  { id: "ACT-1", releaseId: "REL-1001", actor: "Priya Nair", action: "Started work on PAY-201 tokenization integration", timestamp: "2026-09-06T10:15:00Z" },
  { id: "ACT-2", releaseId: "REL-1001", actor: "System", action: "Package payments-api build started", timestamp: "2026-09-07T14:30:00Z" },
  { id: "ACT-3", releaseId: "REL-1001", actor: "Marcus Lee", action: "Flagged fraud-score webhook consumer as blocked on dependency", timestamp: "2026-09-08T08:05:00Z" },

  { id: "ACT-4", releaseId: "REL-1002", actor: "Sofia Torres", action: "Completed design system migration for dashboard widgets", timestamp: "2026-09-05T11:00:00Z" },
  { id: "ACT-5", releaseId: "REL-1002", actor: "System", action: "Release moved to Pending Approval", timestamp: "2026-09-07T09:00:00Z" },

  { id: "ACT-6", releaseId: "REL-1003", actor: "Grace Oduya", action: "Completed load testing at 5x volume", timestamp: "2026-09-06T16:45:00Z" },
  { id: "ACT-7", releaseId: "REL-1003", actor: "System", action: "All approvals completed, release marked Ready for Deployment", timestamp: "2026-09-07T18:20:00Z" },

  { id: "ACT-8", releaseId: "REL-1004", actor: "System", action: "notification-engine deployed to prod-us-east", timestamp: "2026-09-04T22:00:00Z" },
  { id: "ACT-9", releaseId: "REL-1004", actor: "Marcus Lee", action: "Verified SMS channel adapter in production", timestamp: "2026-09-05T08:30:00Z" },

  { id: "ACT-10", releaseId: "REL-1005", actor: "Daniel Kim", action: "Archived legacy billing tables", timestamp: "2026-08-28T12:00:00Z" },
  { id: "ACT-11", releaseId: "REL-1005", actor: "System", action: "Release closed", timestamp: "2026-08-30T09:00:00Z" },

  { id: "ACT-12", releaseId: "REL-1006", actor: "Aiden Brooks", action: "Reported refresh token rotation causing logout loop", timestamp: "2026-09-07T13:10:00Z" },
  { id: "ACT-13", releaseId: "REL-1006", actor: "System", action: "Release flagged At Risk due to critical open risk", timestamp: "2026-09-08T07:00:00Z" },
];
