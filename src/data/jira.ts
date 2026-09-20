import type { JiraIssue } from "../types";

export const jiraIssues: JiraIssue[] = [
  // REL-1001 Payments Gateway Revamp (In Progress)
  { id: "JIRA-1", key: "PAY-201", summary: "Integrate new PSP tokenization API", type: "Story", priority: "High", assignee: "Priya Nair", status: "In Progress", releaseId: "REL-1001" },
  { id: "JIRA-2", key: "PAY-202", summary: "Refactor retry logic for failed charges", type: "Task", priority: "Medium", assignee: "Daniel Kim", status: "In Progress", releaseId: "REL-1001" },
  { id: "JIRA-3", key: "PAY-203", summary: "Fix currency rounding bug in EU checkout", type: "Bug", priority: "Critical", assignee: "Priya Nair", status: "Blocked", releaseId: "REL-1001" },
  { id: "JIRA-4", key: "PAY-204", summary: "Add fraud-score webhook consumer", type: "Story", priority: "High", assignee: "Marcus Lee", status: "To Do", releaseId: "REL-1001" },

  // REL-1002 Customer Portal UI Refresh (Pending Approval)
  { id: "JIRA-5", key: "PORT-118", summary: "Migrate dashboard widgets to design system v2", type: "Story", priority: "Medium", assignee: "Sofia Torres", status: "Done", releaseId: "REL-1002" },
  { id: "JIRA-6", key: "PORT-119", summary: "Accessibility pass on billing pages", type: "Task", priority: "Medium", assignee: "Sofia Torres", status: "Done", releaseId: "REL-1002" },
  { id: "JIRA-7", key: "PORT-120", summary: "Resolve layout shift on profile page", type: "Bug", priority: "Low", assignee: "Wen Zhao", status: "Done", releaseId: "REL-1002" },

  // REL-1003 Inventory Sync Service (Ready for Deployment)
  { id: "JIRA-8", key: "INV-305", summary: "Batch reconciliation job for warehouse feed", type: "Story", priority: "High", assignee: "Aiden Brooks", status: "Done", releaseId: "REL-1003" },
  { id: "JIRA-9", key: "INV-306", summary: "Add dead-letter queue for sync failures", type: "Task", priority: "Medium", assignee: "Aiden Brooks", status: "Done", releaseId: "REL-1003" },
  { id: "JIRA-10", key: "INV-307", summary: "Load test sync throughput at 5x volume", type: "Task", priority: "High", assignee: "Grace Oduya", status: "Done", releaseId: "REL-1003" },

  // REL-1004 Notification Engine (Deployed)
  { id: "JIRA-11", key: "NOTIF-410", summary: "Add SMS channel adapter", type: "Story", priority: "Medium", assignee: "Marcus Lee", status: "Done", releaseId: "REL-1004" },
  { id: "JIRA-12", key: "NOTIF-411", summary: "Template versioning for push notifications", type: "Task", priority: "Low", assignee: "Wen Zhao", status: "Done", releaseId: "REL-1004" },

  // REL-1005 Legacy Billing Sunset (Closed)
  { id: "JIRA-13", key: "BILL-088", summary: "Archive legacy billing tables", type: "Task", priority: "Medium", assignee: "Daniel Kim", status: "Done", releaseId: "REL-1005" },
  { id: "JIRA-14", key: "BILL-089", summary: "Redirect legacy invoice endpoints", type: "Task", priority: "Low", assignee: "Daniel Kim", status: "Done", releaseId: "REL-1005" },

  // REL-1006 Mobile Auth Overhaul (At Risk)
  { id: "JIRA-15", key: "AUTH-512", summary: "Biometric login for iOS", type: "Story", priority: "High", assignee: "Grace Oduya", status: "In Progress", releaseId: "REL-1006" },
  { id: "JIRA-16", key: "AUTH-513", summary: "Refresh token rotation causes logout loop", type: "Bug", priority: "Critical", assignee: "Aiden Brooks", status: "Blocked", releaseId: "REL-1006" },
  { id: "JIRA-17", key: "AUTH-514", summary: "Migrate session store to Redis cluster", type: "Task", priority: "High", assignee: "Priya Nair", status: "Blocked", releaseId: "REL-1006" },
  { id: "JIRA-18", key: "AUTH-515", summary: "Update SDK docs for partner apps", type: "Task", priority: "Low", assignee: "Sofia Torres", status: "To Do", releaseId: "REL-1006" },
];
