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
  settings: "/settings",
} as const;
