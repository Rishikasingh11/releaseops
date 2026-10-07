export const ROUTES = {
  dashboard: "/dashboard",
  releases: "/releases",
  releaseDetail: "/releases/:releaseId",
  releaseDetailPath: (releaseId: string) => `/releases/${releaseId}`,
  jira: "/jira",
  kubernetes: "/kubernetes",
  mails: "/mails",
  approvals: "/approvals",
  reports: "/reports",
  calendar: "/calendar",
  aiInsights: "/ai-insights",
  productionAlignment: "/production-alignment",
  productionAlignmentDetail: "/production-alignment/:repositoryId",
  productionAlignmentDetailPath: (repositoryId: string) =>
    `/production-alignment/${repositoryId}`,
  settings: "/settings",
} as const;
