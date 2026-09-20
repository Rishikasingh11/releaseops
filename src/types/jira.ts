export type JiraIssueType = "Story" | "Bug" | "Task" | "Epic";
export type JiraPriority = "Low" | "Medium" | "High" | "Critical";
export type JiraStatus = "To Do" | "In Progress" | "Done" | "Blocked";

export interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  type: JiraIssueType;
  priority: JiraPriority;
  assignee: string;
  status: JiraStatus;
  releaseId: string;
}
