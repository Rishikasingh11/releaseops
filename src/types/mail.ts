export type MailCategory = "Approval" | "Information" | "Alert";

export interface Mail {
  id: string;
  category: MailCategory;
  subject: string;
  from: string;
  to: string;
  timestamp: string;
  body: string;
  releaseId?: string;
  approvalId?: string;
  read: boolean;
}
